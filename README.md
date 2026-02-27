# JennetDaria Links - Landing Page

## Overview
A custom landing page for Twitch streamer **@jennetdaria** featuring live status detection, automatic latest TikTok linking, timezone-aware stream schedule, and all social media links.

**Live URL:** https://jennetdaria.vercel.app

---

## Features

### 1. Live Status Ring System
- **Offline state:** Clean hero layout — just the profile photo with animated pink/purple rings and the name below. No status text shown.
- **Live state:** The entire hero transforms:
  - **"LIVE ON TWITCH · [Game Name]"** text fades in above the photo with a smooth opacity transition, pushing content down to make room. Container expands over 0.7s, text fades in with a 0.15s delay (landing together at 0.7s). Going offline, text fades out in 0.4s, container collapses 0.1s later. Game name and separator hidden after fade completes (350ms delay) to prevent mid-fade disappearance.
  - Text features a **bright white-green gradient shimmer** with `drop-shadow` glow (4.5s cycle), game name shimmers on a 0.4s delay
  - Green **heartbeat-pulsing dot** (8px, `#4ade80`, double-pump rhythm scaling to 1.5x) next to the text
  - Separator dot between "LIVE ON TWITCH" and the game name
  - **Inner ring** turns green with 3-layer glowing box shadows (28px + 60px + 100px spread), rotates faster (3.5s vs 5s)
  - **Outer ring** switches to denser green segments, counter-rotates faster (5s vs 8s)
  - **Three expanding pulse rings** radiate outward from the photo (staggered 1s apart, start at 0.45 opacity, scale to 1.22x, fade by 60%)
  - **Photo glow** expands and turns green with stronger pulse
  - **Particle dots** turn green
  - **Photo border** gets a subtle green tint
  - **Constellation starfield** gradually shifts from purple/pink to green (stars, connection lines, mouse lines, shooting stars all transition over ~2 seconds)
  - Hero gap expands (24px → 26px) and photo wrapper adds vertical margin for breathing room
- All transitions use **0.8s cubic-bezier(0.16, 1, 0.3, 1)** for a unified "expanding alive" motion
- Clicking the status text links to her Twitch channel
- Checks Twitch API every **2 minutes** automatically
- Only updates the DOM when the status or game actually changes (prevents animation restarts)
- Badge is hidden until the first API response to prevent a flash of incorrect state on load
- Game name auto-centers regardless of length via flex layout with `translateX(-50%)`
- **Powered by:** Twitch API (free, unlimited)

### 2. Stream Schedule
- Displays her schedule: **Mon · Wed · Thu at 6:30 PM**
- Automatically converts to the visitor's local timezone (e.g., PST, GMT, JST)
- Shows timezone abbreviation (e.g., "6:30 PM EST")
- Includes a "Join Discord" link for schedule updates
- **Powered by:** Client-side JavaScript (no API needed)

### 3. Latest TikTok
- "Watch" button links directly to her most recent TikTok video
- **Entire section stays hidden** until the API responds — URL, description, and display are all set before the card slides in, preventing any text glitch or layout shift on slow connections
- Respects the page entrance choreography (minimum 0.55s delay so it doesn't appear before the hero finishes animating)
- Shows the video description below "Latest TikTok" title
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
- **Live-reactive:** When she goes live, stars fade from purple to green, connection lines shift from purple to green, mouse lines go from pink to green, and shooting stars streak green — all via a smooth `liveBlend` lerp (~2 second transition). Fades back to purple when offline.
- **Powered by:** Client-side JavaScript (no API needed)

### 7. Design
- Deep purple cosmic background with gradient mesh overlay
- 5 floating purple/pink blurred orbs with **mouse parallax** (shift with cursor movement and scroll)
- Vignette overlay for depth and focus
- Glassmorphism cards (dark glass with backdrop blur) with shimmer sweep on hover
- **Double animated ring** around profile photo (inner ring + outer counter-rotating ring) — transforms to green with 3-layer glow when live
- **Three expanding pulse rings** around the photo when live (staggered, fading)
- **Sparkle particles** orbiting the profile photo in alternating pink/purple (turn green when live)
- Shimmer effect on "JENNETDARIA" name with glowing text shadow (4.5s cycle)
- White-green gradient shimmer on live status text with drop-shadow glow (matching 4.5s cycle)
- Staggered hero entrance animations (photo → name)
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

## Live Status — Technical Details

### Hero Structure (HTML)
```
.hero#heroSection
  .status-text                    ← height: 0 offline, 28px live (grows in)
    a.status-live-text            ← flex row: dot + label + separator + game
  .photo-wrapper#photoWrapper     ← toggles .is-live class
    .photo-glow                   ← expands + turns green when live
    .photo-ring-outer             ← denser green segments when live
    .photo-ring                   ← green conic gradient + 3-layer glow when live
    .live-pulse-ring (×3)         ← expanding rings, staggered 1s apart
    .particle-ring                ← sparkle dots turn green
    img.photo-img                 ← subtle green border tint
  .name-block
    h1.name                       ← "JENNETDARIA" with pink/purple shimmer
    p.tagline                     ← "GAMING & CONTENT CREATOR"
```

### Constellation Color System (JS)
- `liveBlend` (0–1) lerps between offline purple/pink and live green
- `liveBlendTarget` set to 1 (live) or 0 (offline) by `checkLiveStatus()`
- Lerp rate: `0.02` per animation frame (~2 second full transition at 60fps)
- 4 color helper functions: `lerpC`, `starColor`, `glowColor`, `mouseColor`
- Applied to: star fill, star glow, shooting star gradient, connection lines, mouse lines

### State Management (JS)
- `currentLiveState` and `currentGame` track previous state
- DOM only updates when state or game changes
- `hero.classList.add/remove('is-live-hero')` controls status text visibility + hero spacing
- `wrapper.classList.add/remove('is-live')` controls ring/glow/particle transformations
- `liveBlendTarget` controls constellation color transition
- Game name element updated via `textContent`, separator shown/hidden via `style.display`

### Animation Sync
| Element | Offline | Live |
|---------|---------|------|
| Name shimmer | 4.5s | 4.5s |
| Live text shimmer | — | 4.5s (game 0.4s delay) |
| Live text fade in | — | 0.55s opacity (0.15s delay) |
| Live text fade out | 0.4s opacity | — |
| Status container expand | — | 0.7s |
| Status container collapse | 0.7s (0.1s delay) | — |
| Inner ring rotation | 5s | 3.5s |
| Outer ring rotation | 8s | 5s |
| Photo glow pulse | 3.5s | 2s |
| Dot heartbeat | — | 2s (double-pump, 1.5x scale) |
| Expanding pulse rings | — | 3s (staggered 1s, 0.45 → 0 opacity) |
| Constellation color shift | — | ~2s lerp (0.02/frame) |
| All state transitions | — | 0.8s cubic-bezier |

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
