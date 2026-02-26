// /api/twitch-status.js
let cachedToken = null;
let tokenExpiry = 0;
async function getTwitchToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    console.error('Token fetch failed:', JSON.stringify(data));
    throw new Error('Failed to get Twitch token');
  }
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    const token = await getTwitchToken();
    const channelName = 'jennetdaria';
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${channelName}`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log('Twitch API response:', JSON.stringify(data));
    if (data.data && data.data.length > 0) {
      const stream = data.data[0];
      return res.status(200).json({
        isLive: true,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        thumbnail: stream.thumbnail_url
          .replace('{width}', '440')
          .replace('{height}', '248'),
      });
    }
    return res.status(200).json({ isLive: false });
  } catch (error) {
    console.error('Twitch API error:', error);
    return res.status(200).json({ isLive: false, error: error.message });
  }
}
