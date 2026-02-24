// /api/latest-tiktok.js
// Returns the latest TikTok URL from @jennetdariagaming
// Used by both the landing page AND the /api/tiktok-redirect endpoint

const TIKTOK_USERNAME = 'jennetdariagaming';
const PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}`;

// In-memory cache
let cache = { url: null, desc: null, timestamp: 0 };
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getLatestTiktok() {
  // Return cache if fresh
  if (cache.url && Date.now() - cache.timestamp < CACHE_DURATION) {
    return { url: cache.url, desc: cache.desc };
  }

  try {
    // === OPTION A: RapidAPI (most reliable — uncomment and add RAPIDAPI_KEY env var) ===
    /*
    const response = await fetch(
      `https://tiktok-scraper7.p.rapidapi.com/user/posts?user_id=USERNAME_OR_ID&count=1`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
        },
      }
    );
    const data = await response.json();
    if (data.data?.videos?.[0]) {
      const video = data.data.videos[0];
      cache = {
        url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${video.video_id}`,
        desc: video.title || 'Check out my latest!',
        timestamp: Date.now(),
      };
      return { url: cache.url, desc: cache.desc };
    }
    */

    // === OPTION B: Scrape TikTok page ===
    const response = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const html = await response.text();

    // Try structured data first
    const scriptMatch = html.match(
      /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
    );

    if (scriptMatch) {
      const jsonData = JSON.parse(scriptMatch[1]);
      const defaultScope = jsonData?.['__DEFAULT_SCOPE__'];
      const itemList = defaultScope?.['webapp.user-detail']?.itemList;

      if (itemList && itemList.length > 0) {
        const latest = itemList[0];
        cache = {
          url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${latest.id}`,
          desc: latest.desc || 'Check out my latest!',
          timestamp: Date.now(),
        };
        return { url: cache.url, desc: cache.desc };
      }
    }

    // Fallback: regex for video IDs
    const videoIdMatch = html.match(/\/video\/(\d{15,25})/);
    if (videoIdMatch) {
      cache = {
        url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoIdMatch[1]}`,
        desc: 'Check out my latest!',
        timestamp: Date.now(),
      };
      return { url: cache.url, desc: cache.desc };
    }
  } catch (error) {
    console.error('TikTok fetch error:', error);
  }

  // Ultimate fallback
  return { url: PROFILE_URL, desc: 'Check out my latest!', fallback: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  const data = await getLatestTiktok();
  return res.status(200).json(data);
}
