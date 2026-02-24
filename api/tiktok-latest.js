// /api/tiktok-redirect.js
// When someone visits this URL, they get redirected to the latest TikTok.
// Use this as the target for your short link (e.g. tinyurl or bit.ly)
//
// Short link setup:
//   Create a TinyURL/Bitly that points to:
//   https://jennetdaria-links.vercel.app/api/tiktok-redirect
//
// Then when someone clicks the short link → hits this endpoint → redirects to latest TikTok

const TIKTOK_USERNAME = 'jennetdariagaming';
const PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}`;

let cache = { url: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000;

async function getLatestUrl() {
  if (cache.url && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.url;
  }

  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const html = await response.text();

    const scriptMatch = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
    );

    if (scriptMatch) {
      const jsonData = JSON.parse(scriptMatch[1]);
      const defaultScope = jsonData?.['__DEFAULT_SCOPE__'];
      const itemList = defaultScope?.['webapp.user-detail']?.itemList;

      if (itemList && itemList.length > 0) {
        cache = {
          url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${itemList[0].id}`,
          timestamp: Date.now(),
        };
        return cache.url;
      }
    }

    const videoIdMatch = html.match(/\/video\/(\d{15,25})/);
    if (videoIdMatch) {
      cache = {
        url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoIdMatch[1]}`,
        timestamp: Date.now(),
      };
      return cache.url;
    }
  } catch (error) {
    console.error('TikTok redirect error:', error);
  }

  return PROFILE_URL;
}

export default async function handler(req, res) {
  const url = await getLatestUrl();
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
  res.redirect(302, url);
}
