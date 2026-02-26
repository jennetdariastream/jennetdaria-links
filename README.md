# JennetDaria Links - Landing Page

## Overview
A custom landing page for Twitch streamer **@jennetdaria** featuring live status detection, automatic latest TikTok linking, timezone-aware stream schedule, and all social media links.

**Live URL:** https://jennetdaria.vercel.app

---

## Features

### 1. Live Status Badge
- Shows **OFFLINE** (gray) or **STREAMING LIVE · [Game Name]** (green pulsing dot)
- Checks Twitch API every **2 minutes** automatically
- Updates game name if she switches games mid-stream
- Clicking the badge goes to her Twitch channel
- **Powered by:** Twitch API (free, unlimited)

### 2. Stream Schedule
- Displays her schedule: **Mon · Wed · Thu at 6:30 PM**
- Automatically converts to the visitor's local timezone (e.g., PST, GMT, JST)
- Shows timezone abbreviation (e.g., "6:30 PM EST")
- Includes a "Join Discord" link for schedule updates
- **Powered by:** Client-side JavaScript (no API needed)

### 3. Latest TikTok
- "Watch" button links directly to her most recent TikTok video
- Shows the video description once loaded (hidden until API responds to prevent layout shift)
- Checks for new videos every **3 hours** (cached)
- Falls back to her profile page if the API is unavailable
- **Powered by:** RapidAPI TikTok Scraper (free tier, 300 requests/month)

### 4. TikTok Redirect Endpoint
- URL: `jennetdaria.vercel.app/tiktok-latest`
- Instantly redirects visitors to her latest TikTok video
- Used in the StreamElements `!pinme` chat command
- Same 3-hour cache as above
- **Powered by:** Same RapidAPI key as above

### 5. Connect / About Me Tabs
- Tabbed section that toggles between **social links** and an **About Me** bio
- Defaults to "Connect" (social links) on page load
- Active tab shows a pink-to-purple gradient pill; inactive tab stays muted
- Smooth fade + slide animation when switching tabs
- About Me bio is displayed in a single glassmorphism card matching the social link style
- Bio highlights key interests in pink and ends with a CTA to visit her Twitch stream
- **Powered by:** Client-side JavaScript (no API needed)

### 6. Constellation Animation
- Canvas-based starfield with 75 twinkling stars
- Stars drift slowly and connect with purple lines when nearby
- **Mouse-reactive:** stars gently push away from cursor, brighten near it, and pink connection lines draw from cursor to nearby stars
- Occasional shooting stars
- **Powered by:** Client-side JavaScript (no API needed)

### 7. Design
- Deep purple cosmic background with gradient mesh overlay
- 5 floating purple/pink blurred orbs with **mouse parallax** (shift with cursor movement and scroll)
- Vignette overlay for depth and focus
- Glassmorphism cards (dark glass with backdrop blur) with shimmer sweep on hover
- **Double animated ring** around profile photo (inner ring + outer counter-rotating ring)
- **Sparkle particles** orbiting the profile photo in alternating pink/purple
- Shimmer effect on "JENNETDARIA" name with glowing text shadow
- Staggered hero entrance animations (photo → name → badge)
- Scroll-triggered reveal animations on social links with staggered timing
- Social link hover: icon rotates, arrow turns pink, shimmer sweep across card
- Orbitron font (headers) + Quicksand (body)
- Fully responsive (mobile + desktop)

---

## File Structure

```
├── index.html              ← Main landing page (all HTML/CSS/JS in one file)
├── jennet.jpeg             ← Profile photo (local file, won't break if she changes TikTok photo)
├── vercel.json             ← URL rewrites (/tiktok-latest → /api/tiktok-latest)
└── api/
    ├── twitch-status.js    ← Checks if jennetdaria is live on Twitch
    ├── latest-tiktok.js    ← Returns latest TikTok URL as JSON (for the landing page)
    └── tiktok-latest.js    ← Redirects visitor to latest TikTok (for chat command)
```

---

## Environment Variables (Vercel)

All set in: **Vercel → Project → Settings → Environment Variables**

### TWITCH_CLIENT_ID
- **What:** Client ID from Twitch developer app
- **Where to get it:** https://dev.twitch.tv/console/apps → "JennetDariaLinks" app → Manage
- **Used by:** `api/twitch-status.js`
- **Purpose:** Authenticates with Twitch API to check live status
- **Tied to:** Your personal Twitch account (the app, not Jennet's account)
- **Rate limit:** Free, practically unlimited

### TWITCH_CLIENT_SECRET
- **What:** Client Secret from the same Twitch developer app
- **Where to get it:** Same page as Client ID → click "New Secret"
- **Used by:** `api/twitch-status.js`
- **Purpose:** Paired with Client ID to get OAuth tokens
- **Note:** If you regenerate the secret, update this env var too

### RAPIDAPI_KEY
- **What:** API key from RapidAPI
- **Where to get it:** https://rapidapi.com/tikwm-tikwm-default/api/tiktok-scraper7 → Subscribe (free plan) → Key shown in code examples as "X-RapidAPI-Key"
- **Used by:** `api/latest-tiktok.js` and `api/tiktok-latest.js`
- **Purpose:** Fetches the latest TikTok video from @jennetdariagaming
- **Rate limit:** 300 requests/month (free tier) — we use ~240/month (every 3 hours)
- **Tied to:** Your RapidAPI account

---

## External Accounts & Services

### Vercel (Hosting)
- **Team:** jennetdariastreams
- **Project:** jennetdaria-links
- **Domain:** jennetdaria.vercel.app
- **Auto-deploys:** Yes, on every push to `main` branch on GitHub
- **Dashboard:** https://vercel.com/jennetdariastreams/jennetdaria-links

### GitHub (Code Repository)
- **Org:** jennetdariastream
- **Repo:** jennetdaria-links
- **URL:** https://github.com/jennetdariastream/jennetdaria-links
- **Branch:** main

### Twitch Developer App
- **App name:** JennetDariaLinks
- **Console:** https://dev.twitch.tv/console/apps
- **OAuth Redirect:** https://localhost
- **Category:** Chat Bot
- **Client Type:** Confidential
- **Note:** Do NOT delete this app or the live status will break. 2FA can be disabled after creation.

### RapidAPI
- **API used:** tiktok-scraper7 by tikwm
- **Plan:** Basic (Free - $0.00/mo)
- **Limits:** 300 scraping requests/month, 120 requests/minute
- **Dashboard:** https://rapidapi.com/tikwm-tikwm-default/api/tiktok-scraper7
- **If it breaks:** Switch to another TikTok scraper on RapidAPI, update the fetch URL in both tiktok files, swap the RAPIDAPI_KEY if needed

---

## Social Links on the Page (in order)

| Platform | URL | Handle |
|----------|-----|--------|
| Twitch | https://www.twitch.tv/jennetdaria | twitch.tv/jennetdaria |
| Discord | https://discord.gg/7dQwyfh2KK | Join the Community |
| TikTok Gaming | https://www.tiktok.com/@jennetdariagaming | @jennetdariagaming |
| TikTok IRL | https://www.tiktok.com/@jennetdaria | @jennetdaria |
| X (Twitter) | https://x.com/jennetdaria | @jennetdaria |
| Instagram | https://www.instagram.com/jennetdaria | @jennetdaria |
| YouTube | https://www.youtube.com/channel/UCk2-CccPkPmY8CbPGA6c2aw | @jennetdaria |

---

## StreamElements Chat Command

| Field | Value |
|-------|-------|
| Command | `!pinme` |
| Response | `📌 Latest TikTok → jennetdaria.vercel.app/tiktok-latest \| Socials → jennetdaria.vercel.app \| Discord → discord.gg/7dQwyfh2KK` |
| Cooldown | 10 seconds |
| Access Level | Moderator |

---

## How to Update Things

### She changes her profile photo
→ Replace `jennet.jpeg` in the GitHub repo with the new image (must keep the same filename)

### She changes her stream schedule
→ Edit `index.html` in GitHub, find the `buildSchedule()` function:
- `streamDays = [1, 3, 4]` — change day numbers (0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat)
- `T18:30:00` — change the time (18:30 = 6:30 PM Eastern, use 24h format)

### She changes her About Me bio
→ Edit `index.html` in GitHub, find the `panelAbout` div and update the text inside the `<p>` tags

### She changes her TikTok gaming username
→ Edit both `api/latest-tiktok.js` and `api/tiktok-latest.js` in GitHub, change `TIKTOK_USERNAME` at the top

### She changes her Twitch username
→ Edit `api/twitch-status.js` in GitHub, change the username in the fetch URL

### RapidAPI scraper breaks
→ The page will still work (falls back to profile link). Find a new TikTok scraper on RapidAPI, update the fetch URL in both tiktok API files, and update the RAPIDAPI_KEY env var in Vercel if needed.

### Twitch API stops working
→ Check if the Client Secret was regenerated. If so, update TWITCH_CLIENT_SECRET in Vercel env vars and redeploy.

---

## Caching Behavior

| Feature | Cache Duration | Where Cached |
|---------|---------------|--------------|
| Live Status | 2 minutes | Client-side (browser polls every 2 min) |
| Latest TikTok | 3 hours | Server-side (in-memory) + Vercel edge (s-maxage) |
| Stream Schedule | Never expires | Client-side (calculated once on page load) |

---

## Costs

| Service | Cost |
|---------|------|
| Vercel hosting | Free (Hobby plan) |
| Twitch API | Free (unlimited) |
| RapidAPI TikTok scraper | Free (300 req/month) |
| GitHub repo | Free |
| Domain (jennetdaria.vercel.app) | Free |
| **Total** | **$0/month** |
