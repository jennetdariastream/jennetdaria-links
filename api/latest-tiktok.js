// /api/latest-tiktok.js
// Returns the latest TikTok URL from @jennetdariagaming

const TIKTOK_USERNAME = 'jennetdariagaming';
const PROFILE_URL = `https://www.tiktok.com/@${TIKTOK_USERNAME}`;

let cache = { url: null, desc: null, timestamp: 0, fallback: true };
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

async function getLatestTiktok() {
  if (cache.url && !cache.fallback && Date.now() - cache.timestamp < CACHE_DURATION) {
    return { url: cache.url, desc: cache.desc };
  }

  // === Method 1: RapidAPI (most reliable, needs RAPIDAPI_KEY env var) ===
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
        cache = {
          url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${video.video_id}`,
          desc: video.title || 'Check out my latest!',
          timestamp: Date.now(),
          fallback: false,
        };
        return { url: cache.url, desc: cache.desc };
      }
    } catch (e) {
      console.error('RapidAPI error:', e);
    }
  }

  // === Method 2: Scrape TikTok page ===
  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const html = await response.text();

    // Try SIGI_STATE
    const sigiMatch = html.match(/<script id="SIGI_STATE"[^>]*>([\s\S]*?)<\/script>/);
    if (sigiMatch) {
      try {
        const sigiData = JSON.parse(sigiMatch[1]);
        const items = sigiData?.ItemModule;
        if (items) {
          const keys = Object.keys(items);
          if (keys.length > 0) {
            const latest = items[keys[0]];
            cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${latest.id}`, desc: latest.desc || 'Check out my latest!', timestamp: Date.now(), fallback: false };
            return { url: cache.url, desc: cache.desc };
          }
        }
      } catch (e) { console.error('SIGI parse error:', e); }
    }

    // Try __UNIVERSAL_DATA_FOR_REHYDRATION__
    const scriptMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
    if (scriptMatch) {
      try {
        const jsonData = JSON.parse(scriptMatch[1]);
        const defaultScope = jsonData?.['__DEFAULT_SCOPE__'];
        const userDetail = defaultScope?.['webapp.user-detail'];
        const itemList = userDetail?.itemList;
        if (itemList && itemList.length > 0) {
          const latest = itemList[0];
          cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${latest.id}`, desc: latest.desc || 'Check out my latest!', timestamp: Date.now(), fallback: false };
          return { url: cache.url, desc: cache.desc };
        }
      } catch (e) { console.error('Universal data parse error:', e); }
    }

    // Try regex for any video ID
    const videoIds = [...html.matchAll(/\/video\/(\d{15,25})/g)].map(m => m[1]);
    if (videoIds.length > 0) {
      cache = { url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${videoIds[0]}`, desc: 'Check out my latest!', timestamp: Date.now(), fallback: false };
      return { url: cache.url, desc: cache.desc };
    }
  } catch (error) {
    console.error('Scrape error:', error);
  }

  return { url: PROFILE_URL, desc: 'Check out my latest!', fallback: true };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate=60');
  const data = await getLatestTiktok();
  return res.status(200).json(data);
}
