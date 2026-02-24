// /api/tiktok-latest.js
// Redirects to the latest TikTok from @jennetdariagaming

const TIKTOK_USERNAME = 'jennetdariagaming';
const PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}`;

let cache = { url: null, timestamp: 0, fallback: true };
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

async function getLatestUrl() {
  if (cache.url && !cache.fallback && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.url;
  }

  // Method 1: RapidAPI
  if (process.env.RAPIDAPI_KEY) {
    try {
      const resp = await fetch(
        `https://tiktok-scraper7.p.rapidapi.com/user/posts?unique_id=${TIKTOK_USERNAME}&count=1`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
          },
        }
      );
      const data = await resp.json();
      if (data?.data?.videos?.[0]) {
        const video = data.data.videos[0];
        cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${video.video_id}`, timestamp: Date.now(), fallback: false };
        return cache.url;
      }
    } catch (e) { console.error('RapidAPI error:', e); }
  }

  // Method 2: Scrape
  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    const html = await response.text();

    const sigiMatch = html.match(/<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/);
    if (sigiMatch) {
      try {
        const sigiData = JSON.parse(sigiMatch[1]);
        const items = sigiData?.ItemModule;
        if (items) {
          const keys = Object.keys(items);
          if (keys.length > 0) {
            cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${items[keys[0]].id}`, timestamp: Date.now(), fallback: false };
            return cache.url;
          }
        }
      } catch (e) {}
    }

    const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      try {
        const jsonData = JSON.parse(scriptMatch[1]);
        const itemList = jsonData?.['__DEFAULT_SCOPE__']?.['webapp.user-detail']?.itemList;
        if (itemList && itemList.length > 0) {
          cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${itemList[0].id}`, timestamp: Date.now(), fallback: false };
          return cache.url;
        }
      } catch (e) {}
    }

    const videoIds = [...html.matchAll(/\/video\/(\d{15,25})/g)].map(m => m[1]);
    if (videoIds.length > 0) {
      cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoIds[0]}`, timestamp: Date.now(), fallback: false };
      return cache.url;
    }
  } catch (error) {
    console.error('Scrape error:', error);
  }

  return PROFILE_URL;
}

export default async function handler(req, res) {
  const url = await getLatestUrl();
  res.setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate=60');
  res.redirect(302, url);
}
