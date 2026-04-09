# JiggyJoy — Execution Plan
*Last updated: 2026-04-08 — Session 3*

---

## Project Overview

**What we're building:** A free kids education website combining coloring pages + educational games + worksheets.

**Business model:** Free content → Google AdSense display ads + Etsy digital product sales + Amazon KDP coloring books.

**Core insight from research:** Kids coloring pages are free everywhere. Adult/mindfulness content is what competitors charge $5–15/month for. We offer it FREE → steal their traffic → monetize with ads.

**Target market:** India (INR currency, confirmed via keyword data). Global audience via English content.

---

## Progress Tracker

### Phase 1 — Foundation ✅ COMPLETE
### Phase 3 — Site Data Layer ✅ COMPLETE (done session 2)

- [x] Keyword research analysed (3,981 keywords, Google Keyword Planner export)
- [x] Competitive analysis done (6 agents, 6 competitors researched)
- [x] Business model defined
- [x] Tech stack chosen: Next.js 14 + Tailwind + Vercel
- [x] Project scaffolded at `C:/Users/Aashi/Documents/kidslearnplay/`
- [x] Navbar + Footer components built
- [x] Homepage built (hero, stats, category cards, featured games, worksheets)
- [x] Coloring pages section built (hub + category + individual page routes)
- [x] Games section built (hub + individual game routes)
- [x] Worksheets section built (hub + individual worksheet routes)
- [x] Sitemap.xml auto-generated
- [x] robots.txt configured
- [x] SEO metadata on all pages
- [x] 44 static pages generated at build time
- [x] 3 playable games built (Maths Play, Counting Stars, Alphabet Match)
- [x] AI image generation script built (`scripts/generate-images.mjs`)
- [x] Gemini API integrated (model: `gemini-2.5-flash-image`)
- [x] 17 initial coloring page images generated
- [x] Interactive flood-fill coloring canvas built (click to color)
- [x] Save PNG feature (download colored version)
- [x] Print button on all coloring pages
- [x] Competitor research completed + saved to `COMPETITOR-RESEARCH.md`
- [x] 130-page research-backed content plan written into generation script

---

### Phase 2 — Content Generation 🔄 IN PROGRESS

**Goal:** Generate all 130 planned coloring page images using Gemini API.

**API Key:** Generate a new one at aistudio.google.com *(current key was shared in chat — rotate it)*

**Gemini blocker:** Free tier has a **$0 monthly spending cap** on image generation — hit after ~17 images.
**Two paths forward:**

**Path A — Enable Gemini billing (~$5.30 for all 133 remaining images)**
- aistudio.google.com → Settings → Billing → Add card → Set $10 limit
- Cost: ~$0.04/image × 133 = ~$5.30 one-time
- Run: `GEMINI_API_KEY=key node scripts/generate-images.mjs`

**Path B — HuggingFace (FREE, no card, best quality)**
- Sign up free at huggingface.co → settings/tokens → New token → Read → copy
- Run: `HF_TOKEN=your_token node scripts/generate-images-hf.mjs --limit=10`
- Script: `scripts/generate-images-hf.mjs` ✅ ready to use
- Uses FLUX.1-schnell model — same as Pollinations but direct, no rate limit issues

**Path C — Pollinations.ai (FREE, no account needed)**
- No API key required — just run
- Run: `node scripts/generate-images-free.mjs`
- Script: `scripts/generate-images-free.mjs` ✅ ready to use  
- Note: needs 15s between requests. If rate limited, wait 5 min and retry.

#### Image Generation Status — Updated 2026-04-08

| Category | # Pages | Done | Status | Run Command |
|---|---|---|---|---|
| `animal-mandalas` | 15 | 0 | ⏳ Day 1 priority | `--category=animal-mandalas` |
| `floral-mandalas` | 10 | 0 | ⏳ Day 1 | `--category=floral-mandalas` |
| `bold-easy` | 10 | 0 | ⏳ Day 2 | `--category=bold-easy` |
| `cozy-animals` | 8 | 0 | ⏳ Day 2 | `--category=cozy-animals` |
| `fantasy` | 10 | 0 | ⏳ Day 2 | `--category=fantasy` |
| `zodiac` | 12 | 0 | ⏳ Day 3 | `--category=zodiac` |
| `dog-breeds` | 8 | 0 | ⏳ Day 3 | `--category=dog-breeds` |
| `dark-academia` | 4 | 0 | ⏳ Day 3 | `--category=dark-academia` |
| `cottagecore` | 3 | 0 | ⏳ Day 3 | `--category=cottagecore` |
| `characters` | 19 | 7 | 🔄 Partial | `--category=characters` |
| `animals` | 25 | 6 | 🔄 Partial | `--category=animals` |
| `holidays` | 14 | 3 | 🔄 Partial | `--category=holidays` |
| `educational` | 10 | 0 | ⏳ Day 4 | `--category=educational` |
| **TOTAL** | **148** | **19** | | |

**Images currently live (19):** bluey, butterfly, cat, christmas, dinosaur, disney, dog, easter, elephant, elephant-mandala, fish, floral, halloween, hello-kitty, lion-mandala, mandala, mindfulness, paw-patrol, pokemon

**Image quality confirmed ✅** — User approved all 19 images. Full generation of remaining 129 in progress via Pollinations.ai (free, no API key).

**Active generation:** `node scripts/generate-images-free.mjs` running in background. Uses 15s spacing + exponential backoff on rate limits.

**Run commands (in priority order):**
```bash
cd "C:/Users/Aashi/Documents/kidslearnplay"

# Tier 1 — What competitors charge for (do these first)
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=animal-mandalas
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=floral-mandalas
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=bold-easy
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=cozy-animals
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=fantasy

# Tier 2 — Low competition niches
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=zodiac
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=dog-breeds
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=dark-academia
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=cottagecore

# Tier 3 — High volume evergreen
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=characters
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=animals
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=holidays
GEMINI_API_KEY=AIzaSyCD4_vN5QQHu9RnjosENRN-T_juC7-DJBI node scripts/generate-images.mjs --category=educational
```

---

### Phase 3 — Site Data Layer ✅ COMPLETE (2026-04-08)

- [x] Updated `lib/data.ts` with all 13 categories and 148 coloring pages
- [x] Added adult categories: `animal-mandalas`, `floral-mandalas`, `bold-easy`, `cozy-animals`, `fantasy`, `zodiac`, `dog-breeds`, `dark-academia`
- [x] Homepage split into Kids section + Adults section
- [x] Build verified: **175 static pages** generated successfully
- [x] All routes working: `/coloring-pages/animal-mandalas/lion-mandala` etc.

---

### Phase 4 — Deployment ⏳ TODO

- [ ] Buy domain (suggested: `jiggyjoy.com` or `colorandlearn.com`) — ~$10/yr on Namecheap
- [ ] Create Vercel account (free)
- [ ] Connect GitHub repo to Vercel
- [ ] Push project to GitHub
- [ ] Deploy: `npx vercel --prod`
- [ ] Set custom domain in Vercel dashboard
- [ ] Verify sitemap accessible at `yourdomain.com/sitemap.xml`
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Rotate Gemini API key (current one was shared in chat)

---

### Phase 5 — Monetisation Setup ⏳ TODO

#### Immediate (before traffic)
- [ ] Create Etsy shop
  - List animal mandala bundle (10 pages) at $4
  - List floral mandala bundle (10 pages) at $4
  - List holiday coloring bundle at $5
  - List adult stress relief bundle at $5
- [ ] Publish 3 Amazon KDP coloring books
  - "Animal Mandalas — 40 Pages for Adults" at $7.99
  - "Stress Relief Coloring Book — Bold & Easy" at $7.99
  - "Fairy Tales & Fantasy Coloring Book" at $7.99

#### After site is live (Month 2)
- [ ] Apply for Google AdSense (need 20+ pages + live site)
- [ ] Add AdSense ad units to coloring page layout
- [ ] Add Amazon affiliate links (coloring supplies, pencils, markers)
- [ ] Add Etsy shop link in site footer and on coloring pages

#### After 10,000 sessions/month (Month 3–4)
- [ ] Apply for Ezoic (replaces AdSense, 2–3x higher RPM)
- [ ] Consider Patreon at $5/month for premium bundle downloads (coloringbliss.com model)

---

### Phase 6 — SEO & Content Growth ⏳ TODO

- [ ] Submit to free printable directories (FreePrintable.net, etc.)
- [ ] Create seasonal content calendar (see below)
- [ ] Add 50 new coloring pages per week using generation script
- [ ] Target long-tail keywords: `[animal] coloring pages printable free`, `[character] coloring pages for kids`
- [ ] Add blog section for SEO content (optional, Month 3+)
- [ ] Add more games: Spelling Bee, Color by Number, Shape Sorter

---

## Seasonal Content Calendar

| Date | Publish By | Content to Generate |
|---|---|---|
| November 15 | Christmas pages (2,140 on SuperColoring) | 10+ Christmas coloring pages |
| January 1 | New Year + Mindfulness (peak search month) | 5+ mindfulness pages |
| February 1 | Valentine's Day | 5+ Valentine pages |
| March 15 | Easter + Spring | 10+ Easter pages |
| August 1 | Back to School | 10+ educational pages |
| October 1 | Halloween + Mandala peak | 10+ Halloween pages |

---

## Tech Stack Reference

| Layer | Tool | Status |
|---|---|---|
| Framework | Next.js 14 (App Router) | ✅ Installed |
| Styling | Tailwind CSS | ✅ Installed |
| Icons | Lucide React | ✅ Installed |
| AI Images | Google Gemini (`gemini-2.5-flash-image`) | ✅ Working |
| Hosting | Vercel (free tier) | ⏳ Not yet deployed |
| Domain | TBD | ⏳ Not purchased |
| Analytics | Google Search Console | ⏳ After deploy |
| Ads | Google AdSense → Ezoic | ⏳ After traffic |

---

## File Structure

```
kidslearnplay/
├── app/
│   ├── page.tsx                          Homepage
│   ├── layout.tsx                        Root layout + metadata
│   ├── globals.css
│   ├── sitemap.ts                        Auto-generated sitemap
│   ├── robots.ts
│   ├── coloring-pages/
│   │   ├── page.tsx                      Coloring hub
│   │   ├── [category]/page.tsx           Category page
│   │   └── [category]/[slug]/page.tsx    Individual coloring page
│   ├── games/
│   │   ├── page.tsx                      Games hub
│   │   └── [slug]/page.tsx               Individual game
│   └── worksheets/
│       ├── page.tsx                      Worksheets hub
│       └── [slug]/page.tsx               Individual worksheet
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ColoringCanvas.tsx                Interactive flood-fill coloring
│   ├── ColoringThumbnail.tsx             Image with emoji fallback
│   ├── PrintButton.tsx
│   └── games/
│       ├── GameLoader.tsx                Dynamic game importer
│       ├── MathsPlayGame.tsx             +/−/× quiz game
│       ├── CountingGame.tsx              Count & tap game
│       └── AlphabetMatchGame.tsx         Memory card game
├── lib/
│   └── data.ts                           All site data (pages, games, worksheets)
├── public/
│   └── images/coloring/                  Generated PNG coloring pages
├── scripts/
│   └── generate-images.mjs               Gemini image generator (130 pages)
├── EXECUTION-PLAN.md                     ← This file
└── COMPETITOR-RESEARCH.md                Full competitor analysis
```

---

## Key Numbers to Track

| Metric | Current | Month 1 Target | Month 3 Target |
|---|---|---|---|
| Coloring pages | 17 | 130 | 500+ |
| Games | 3 | 8 | 15 |
| Worksheets | 6 | 20 | 50 |
| Monthly visitors | 0 | 1,000 | 50,000 |
| Monthly revenue | $0 | $0–50 (Etsy) | $400–700 (Ads + Etsy) |
| Google index | Not submitted | Submitted | 100+ pages indexed |

---

## Revenue Projections (Based on Competitor Research)

| Monthly Visitors | AdSense/Ezoic | Etsy | KDP | Total |
|---|---|---|---|---|
| 10,000 | $40–80 | $50–100 | $20–40 | **$110–220** |
| 50,000 | $200–400 | $100–200 | $50–100 | **$350–700** |
| 200,000 | $800–1,600 | $200–400 | $100–200 | **$1,100–2,200** |
| 500,000 | $2,000–4,000 | $400–800 | $200–400 | **$2,600–5,200** |

*RPM estimate: $4–8 for kids/education niche with AdSense, $8–15 with Ezoic*

---

## Next Immediate Actions (Do These Now)

1. **Get a new Gemini API key** — aistudio.google.com/app/apikey (old one was shared in chat)
2. **Generate images daily** — run one category per day, quota is ~50–80 images/day free
   ```
   GEMINI_API_KEY=NEW_KEY node scripts/generate-images.mjs --category=animal-mandalas
   GEMINI_API_KEY=NEW_KEY node scripts/generate-images.mjs --category=floral-mandalas
   ```
3. **Buy domain** — `jiggyjoy.com` or `colorandlearn.com` (~$10/yr on Namecheap)
4. **Deploy to Vercel** — site is build-ready, just needs deployment
5. **Open Etsy shop** — list first 3 bundles (animal mandalas, floral mandalas, holiday) at $4–5 each
6. **Apply for AdSense** — once site is live with 20+ pages

---

*Update this file after each work session. Mark tasks ✅ when done.*
