# Tomorrow Homes Website — Claude Context

## What this project is

A new marketing website for **Tomorrow Homes**, an end-to-end residential construction company operating across Victoria, Australia. The new site replaces the existing site at `tomorrowhomes.com.au`.

**Current deployment:** https://website-liard-nu-67.vercel.app/
**Target domain (not yet connected):** https://tomorrowhomes.com.au/
**Old site (still live):** https://tomorrowhomes.com.au/

The domain has not been pointed to the new site yet — that switch is pending.

---

## Tech stack

- Single `index.html` file — no framework, no build step, plain HTML/CSS/JS
- All CSS is written inline in a `<style>` block inside `index.html`
- JavaScript is split across three external files:
  - `landing-intro.js` — animated wordmark intro sequence (docks into the nav)
  - `studio-carousel.js` — facade image carousel with lightbox, drag-to-scroll thumbnails, auto-rotate
  - `interior-selector.js` — interior colour scheme switcher
- Hosted on **Vercel** (static, no server-side)
- No npm, no package.json, no build tools — edit files directly

---

## Design system

| Token | Value |
|-------|-------|
| `--paper` | `#F5F3F0` (warm off-white, main background) |
| `--ink` | `#101820` (near-black, main text) |
| `--grey` | `#737373` |
| `--sage` | `#7D7F79` |
| `--steel` | `#5E7A8D` (accent blue-grey) |
| `--line` | `rgba(16, 24, 32, 0.14)` |
| `--serif` | Cormorant Garamond (headings, display) |
| `--sans` | Jost (body, UI) |
| `--mono` | Space Mono (labels, captions) |
| `--nav-h` | `95px` |
| `--pad` | `clamp(24px, 6vw, 120px)` (horizontal page padding) |

Two themes used via `data-theme` attribute on sections: `light` (paper bg) and `dark` (ink bg). The nav reads the theme of the section behind it and switches logo/colours accordingly.

---

## Page structure (single page, top to bottom)

1. **Splash** — full-screen video (`hero-timelapse.mp4`) with animated wordmark intro
2. **Hero** — H1, brand statement, eyebrow "Residential construction — Victoria"
3. **Brand intro video** — YouTube embed lightbox (`JhryhnXxapA`)
4. **The Tomorrow Difference** (`#about`) — 3-column feature grid
5. **Home walkthrough video** — YouTube embed lightbox (`99LFfTp2X38`)
6. **Testimonial ticker** — scrolling Google review quotes
7. **The Build** (`#the-build`) — split layout with `future-ready-features.mp4`, links to smart features PDF and turnkey inclusions image
8. **The Studio** (`#the-studio`) — Studio Tomorrow section with animated SVG logo, facade carousel, interior selector
9. **Developments** (`#developments`) — 4 development cards (Flora, Coast, Newport, Woolstore) linking to PDF brochures
10. **Footer** — address, phone, email, Google rating, social links

---

## Business details

- **Company:** Tomorrow Homes Pty Ltd
- **Address:** Level 1, 466 Malvern Road, Prahran VIC 3181
- **Phone:** 03 9827 0998
- **Email:** info@tomorrowhomes.com.au
- **Google rating:** 4.7 stars (as of June 2026)
- **LinkedIn:** https://au.linkedin.com/company/tomorrow-homes
- **Facebook:** https://www.facebook.com/tomorrowhomesgroup
- **Instagram:** https://www.instagram.com/tomorrowhomes/
- **Client portal:** https://buildertrend.net/

---

## Key assets

| File | Purpose |
|------|---------|
| `logo-black.png` / `logo-white.png` | Full "Tomorrow Homes" wordmark |
| `wordmark-black.png` / `wordmark-white.png` | "Tomorrow" only (used in animated intro) |
| `t-mark-black.png` / `t-mark-white.png` | T-mark icon (used as favicon) |
| `hero-timelapse.mp4` | Splash section background video |
| `future-ready-features.mp4` | The Build section video |
| `brand-intro-cover.jpg` | Cover image for brand video (also used as OG image) |
| `home-walkthrough-cover.jpg` | Cover image for walkthrough video |
| `facade-*.jpg` | Facade images for the Studio carousel (16 total) |
| `interior-*.jpg` | Interior scheme images (5 schemes × kitchen/bathroom/hero) |
| `dev-flora.png` etc. | Development card images |
| `FLORA_BROCHURE_FA_WEB.pdf` etc. | Development brochures (open in in-page modal) |
| `smart-features.pdf` | Smart features document |
| `turnkey-inclusions.png` | Turnkey inclusions image |

---

## SEO — what's been implemented

All SEO was added on 16 June 2026. See `SEO-CHANGES.md` for full details.

- **Title tag:** `Tomorrow Homes | Award-Winning Home Builder Victoria`
- **Meta description:** present
- **Canonical URL:** `https://tomorrowhomes.com.au/`
- **Open Graph tags:** present (uses `brand-intro-cover.jpg` as OG image)
- **Twitter Card tags:** present
- **JSON-LD structured data:** `HomeAndConstructionBusiness` schema with address, phone, email, social links, service area (Victoria)
- **`robots.txt`:** created
- **`sitemap.xml`:** created
- **Favicon:** `t-mark-black.png`

**Pending (after domain is connected):** Submit sitemap to Google Search Console at https://search.google.com/search-console

---

## Git

- Branch: `main`
- Remote: GitHub (`manmanyu776`)
- `git push` must be run by the user directly (`! git push`) — it fails from Claude's shell session
