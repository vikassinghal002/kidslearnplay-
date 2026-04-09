/**
 * Coloring Page Downloader — Pixabay API
 *
 * Downloads real coloring page images from Pixabay.
 * ✅ Free API — no credit card needed
 * ✅ Commercial use allowed (Pixabay License)
 * ✅ Instant — no generation wait time
 * ✅ 20,000+ coloring page images available
 *
 * Setup (2 minutes):
 *   1. Sign up free at pixabay.com
 *   2. Go to pixabay.com/api/docs → copy your API key
 *   3. Run: PIXABAY_KEY=your_key node scripts/download-images.mjs
 *
 * Single page:
 *   PIXABAY_KEY=your_key node scripts/download-images.mjs lion-mandala
 *
 * By category:
 *   PIXABAY_KEY=your_key node scripts/download-images.mjs --category=animal-mandalas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_PAGES } from "./pages-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/images/coloring");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PIXABAY_KEY = process.env.PIXABAY_KEY;
if (!PIXABAY_KEY) {
  console.error("\n❌ Missing PIXABAY_KEY");
  console.error("   1. Sign up free at pixabay.com (no card needed)");
  console.error("   2. Go to pixabay.com/api/docs → copy your API key");
  console.error("   3. Run: PIXABAY_KEY=your_key node scripts/download-images.mjs\n");
  process.exit(1);
}

// Search terms mapped to each slug for best Pixabay results
const SEARCH_TERMS = {
  // Animal Mandalas
  "lion-mandala":         "lion mandala coloring page",
  "elephant-mandala":     "elephant mandala coloring page",
  "owl-mandala":          "owl mandala coloring page",
  "wolf-mandala":         "wolf mandala coloring page",
  "butterfly-mandala":    "butterfly mandala coloring page",
  "horse-mandala":        "horse mandala coloring page",
  "fox-mandala":          "fox mandala coloring page",
  "cat-mandala":          "cat mandala coloring page",
  "dolphin-mandala":      "dolphin mandala coloring page",
  "peacock-mandala":      "peacock mandala coloring page",
  "dragon-mandala":       "dragon mandala coloring page",
  "hummingbird-mandala":  "hummingbird mandala coloring page",
  "bear-mandala":         "bear mandala coloring page",
  "turtle-mandala":       "turtle mandala coloring page",
  "deer-mandala":         "deer mandala coloring page",
  // Floral Mandalas
  "rose-mandala":         "rose mandala coloring",
  "lotus-mandala":        "lotus mandala coloring",
  "sunflower-mandala":    "sunflower mandala coloring",
  "dahlia-mandala":       "flower mandala coloring page",
  "peony-mandala":        "flower mandala intricate coloring",
  "wildflower-mandala":   "wildflower mandala coloring",
  "botanical-coloring-pages": "botanical flowers coloring page",
  "floral-coloring-pages":    "floral coloring page adults",
  "art-nouveau-flowers":      "art nouveau floral coloring",
  "garden-coloring-pages":    "garden coloring page",
  // Bold & Easy
  "stress-relief-coloring-pages": "stress relief coloring page simple",
  "easy-mandala-coloring-pages":  "simple mandala coloring page",
  "mindfulness-colouring":        "mindfulness coloring page",
  "large-print-coloring-pages":   "simple large flower coloring page",
  "simple-flower-coloring-pages": "flower coloring page simple",
  "easy-animal-coloring-pages":   "simple animal coloring page",
  "adult-coloring-pages":         "adult coloring page butterfly",
  "calming-coloring-pages":       "ocean coloring page adult",
  "nature-coloring-pages":        "nature coloring page simple",
  "zen-coloring-pages":           "zen garden coloring page",
  // Cozy Animals
  "cozy-cat-coloring-pages":     "cat coloring page cute",
  "cozy-fox-coloring-pages":     "fox coloring page autumn",
  "cozy-bear-coloring-pages":    "bear coloring page cute",
  "cozy-bunny-coloring-pages":   "bunny rabbit coloring page",
  "cozy-hedgehog-coloring-pages":"hedgehog coloring page",
  "kawaii-coloring-pages":       "kawaii food coloring page",
  "cute-animal-coloring-pages":  "cute animals coloring page",
  "cottagecore-coloring-pages":  "cottage house coloring page nature",
  // Fantasy
  "fairy-coloring-pages":        "fairy coloring page adult",
  "mermaid-coloring-pages":      "mermaid coloring page",
  "unicorn-coloring-pages":      "unicorn coloring page",
  "dragon-coloring-pages":       "dragon coloring page",
  "fantasy-forest-coloring-pages": "enchanted forest coloring page",
  "phoenix-coloring-pages":      "phoenix bird coloring page",
  "witch-coloring-pages":        "witch coloring page",
  "magical-castle-coloring-pages": "castle coloring page",
  "forest-fairy-coloring-pages": "fairy forest coloring page",
  "celestial-coloring-pages":    "moon stars coloring page",
  // Zodiac
  "aries-mandala":    "aries zodiac coloring page",
  "taurus-mandala":   "taurus zodiac coloring",
  "gemini-mandala":   "gemini zodiac coloring",
  "cancer-mandala":   "cancer zodiac coloring",
  "leo-mandala":      "leo zodiac lion coloring",
  "virgo-mandala":    "virgo zodiac coloring",
  "libra-mandala":    "libra zodiac coloring",
  "scorpio-mandala":  "scorpio zodiac coloring",
  "sagittarius-mandala": "sagittarius zodiac coloring",
  "capricorn-mandala": "capricorn zodiac coloring",
  "aquarius-mandala": "aquarius zodiac coloring",
  "pisces-mandala":   "pisces fish zodiac coloring",
  // Dog Breeds
  "golden-retriever-coloring-page":   "golden retriever dog coloring page",
  "french-bulldog-coloring-page":     "french bulldog coloring page",
  "corgi-coloring-page":              "corgi dog coloring page",
  "labrador-coloring-page":           "labrador dog coloring page",
  "husky-coloring-page":              "husky dog coloring page",
  "dachshund-coloring-page":          "dachshund dog coloring page",
  "poodle-coloring-page":             "poodle dog coloring page",
  "german-shepherd-coloring-page":    "german shepherd dog coloring page",
  // Dark Academia
  "dark-academia-coloring-pages":     "gothic library coloring page",
  "gothic-architecture-coloring-pages": "gothic cathedral coloring page",
  "moon-and-stars-coloring-pages":    "moon stars coloring page",
  "crystal-ball-coloring-pages":      "mystical coloring page",
  // Mushroom/Cottage
  "mushroom-coloring-pages":  "mushroom coloring page",
  "cottage-coloring-pages":   "cottage house coloring page",
  "fairy-garden-coloring-pages": "fairy garden coloring page",
  // Characters
  "bluey-coloring-pages":       "puppy dog coloring page cartoon",
  "bluey-and-bingo":            "two puppies coloring page kids",
  "stitch-coloring-pages":      "alien cute coloring page kids",
  "stitch-and-lilo":            "alien girl coloring page",
  "demon-slayer-coloring-pages":"samurai anime coloring page",
  "nezuko-coloring-page":       "anime girl kimono coloring page",
  "pokemon-coloring-pages":     "pikachu coloring page",
  "charizard-coloring-page":    "dragon fire coloring page kids",
  "eevee-coloring-page":        "cute animal coloring page kids",
  "minecraft-coloring-pages":   "minecraft coloring page",
  "minecraft-creeper":          "minecraft creeper coloring page",
  "peppa-pig-coloring-pages":   "peppa pig coloring page",
  "paw-patrol-coloring-pages":  "paw patrol coloring page",
  "hello-kitty-coloring-pages": "hello kitty coloring page",
  "spongebob-coloring-pages":   "spongebob coloring page",
  "inside-out-coloring-pages":  "emotion characters coloring page kids",
  "gabbys-dollhouse-coloring-pages": "girl cartoon coloring page",
  "disney-princess-coloring-pages":  "princess coloring page kids",
  "my-little-pony-coloring-pages":   "my little pony coloring page",
  // Animals
  "cat-coloring-pages":       "cat coloring page kids",
  "dog-coloring-pages":       "dog coloring page kids",
  "horse-coloring-pages":     "horse coloring page kids",
  "dinosaur-coloring-pages":  "dinosaur coloring page kids",
  "elephant-coloring-pages":  "elephant coloring page kids",
  "lion-coloring-pages":      "lion coloring page kids",
  "tiger-coloring-pages":     "tiger coloring page kids",
  "giraffe-coloring-pages":   "giraffe coloring page kids",
  "panda-coloring-pages":     "panda coloring page kids",
  "penguin-coloring-pages":   "penguin coloring page kids",
  "owl-coloring-pages":       "owl coloring page kids",
  "rabbit-coloring-pages":    "rabbit coloring page kids",
  "fox-coloring-pages":       "fox coloring page kids",
  "butterfly-coloring-pages": "butterfly coloring page kids",
  "fish-coloring-pages":      "fish coloring page kids",
  "shark-coloring-pages":     "shark coloring page kids",
  "dolphin-coloring-pages":   "dolphin coloring page kids",
  "turtle-coloring-pages":    "turtle coloring page kids",
  "frog-coloring-pages":      "frog coloring page kids",
  "farm-animals-coloring-pages": "farm animals coloring page",
  "bear-coloring-pages":      "bear coloring page kids",
  "unicorn-coloring-pages":   "unicorn coloring page kids",
  "triceratops-coloring-page": "triceratops dinosaur coloring page",
  "monkey-coloring-pages":    "monkey coloring page kids",
  "bird-coloring-pages":      "bird coloring page kids",
  // Holidays
  "christmas-coloring-pages":       "christmas tree coloring page",
  "christmas-coloring-pictures":    "santa claus coloring page",
  "santa-claus-coloring-pages":     "santa claus coloring page kids",
  "snowman-coloring-pages":         "snowman coloring page",
  "halloween-coloring-pages":       "halloween pumpkin coloring page",
  "halloween-witch-coloring-pages": "witch coloring page kids",
  "halloween-ghost-coloring-pages": "ghost coloring page kids",
  "easter-coloring-pages":          "easter egg coloring page",
  "easter-bunny-coloring-pages":    "easter bunny coloring page",
  "easter-egg-coloring-pages":      "easter eggs coloring page",
  "valentines-day-coloring-pages":  "valentine heart coloring page",
  "thanksgiving-coloring-pages":    "turkey coloring page thanksgiving",
  "diwali-coloring-pages":          "diwali coloring page",
  "spring-coloring-pages":          "spring flowers coloring page kids",
  // Educational
  "color-by-number-coloring-pages": "color by number coloring page",
  "alphabet-coloring-pages":        "alphabet letters coloring page kids",
  "numbers-coloring-pages":         "numbers coloring page kids",
  "solar-system-coloring-pages":    "solar system coloring page kids",
  "ocean-coloring-pages":           "ocean underwater coloring page",
  "space-coloring-pages":           "space rocket coloring page kids",
  "shapes-coloring-pages":          "shapes coloring page kids",
  "map-coloring-pages":             "world map coloring page kids",
  "body-parts-coloring-page":       "body parts coloring page kids",
  "food-coloring-pages":            "fruits vegetables coloring page",
};

// Parse args
const args = process.argv.slice(2);
const categoryFlag = args.find((a) => a.startsWith("--category="))?.split("=")[1];
const slugArg = args.find((a) => !a.startsWith("--"));

let pages = ALL_PAGES;
if (categoryFlag) pages = ALL_PAGES.filter((p) => p.category === categoryFlag);
else if (slugArg) pages = ALL_PAGES.filter((p) => p.slug === slugArg);

const toGet = pages.filter((p) => !fs.existsSync(path.join(OUTPUT_DIR, `${p.slug}.png`)));

console.log(`\n⬇️  Coloring Page Downloader (Pixabay)`);
console.log(`   Free API, commercial use allowed`);
console.log(`   Selected:     ${pages.length} pages`);
console.log(`   Already done: ${pages.length - toGet.length}`);
console.log(`   To download:  ${toGet.length}\n`);

if (toGet.length === 0) { console.log("✅ All done!\n"); process.exit(0); }

async function download(page) {
  const out = path.join(OUTPUT_DIR, `${page.slug}.png`);
  const query = SEARCH_TERMS[page.slug] ?? page.slug.replace(/-/g, " ");

  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&safesearch=true&per_page=5&order=popular`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    if (!data.hits?.length) {
      // Try broader search without vector/grayscale filter
      const broad = query.split(" ").slice(0, 3).join(" ");
      const res2 = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(broad)}&safesearch=true&per_page=5&order=popular`,
        { signal: AbortSignal.timeout(15000) }
      );
      const data2 = await res2.json();
      if (!data2.hits?.length) throw new Error("No results found");
      data.hits = data2.hits;
    }

    // Always use webformatURL — it's a pre-rendered 640px image, always works
    const hit = data.hits[0];
    const imageUrl = hit.webformatURL;

    // Retry image download up to 4x on 429
    let imgRes;
    for (let attempt = 1; attempt <= 4; attempt++) {
      imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
      if (imgRes.status === 429) {
        const wait = 15000 * attempt;
        process.stdout.write(`⏳ img rate limit, waiting ${wait/1000}s... `);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      break;
    }
    if (!imgRes.ok) throw new Error(`Image download failed: ${imgRes.status}`);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    if (buffer.length < 10000) throw new Error(`Too small: ${buffer.length} bytes`);

    // Validate: check image has some light pixels (not all black)
    const sample = buffer.slice(100, Math.min(buffer.length, 3000));
    const whites = [...sample].filter((b) => b > 200).length;
    if (whites / sample.length < 0.1) throw new Error("Image appears too dark — wrong result");

    fs.writeFileSync(out, buffer);
    return { ok: true, source: imageUrl };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

let done = 0, failed = 0;
const failedList = [];

for (let i = 0; i < toGet.length; i++) {
  const page = toGet[i];
  process.stdout.write(`  [${i + 1}/${toGet.length}] ${page.slug}... `);
  const result = await download(page);
  if (result.ok) {
    console.log("✅");
    done++;
  } else {
    console.log(`❌ ${result.error}`);
    failedList.push(page.slug);
    failed++;
  }
  // Pixabay rate limit: 100 requests/minute — 3s delay avoids CDN 429s
  if (i < toGet.length - 1) await new Promise((r) => setTimeout(r, 3000));
}

console.log(`\n✅ Downloaded: ${done}  ❌ Failed: ${failed}`);
if (failedList.length) {
  console.log(`\nFailed slugs (try AI generation for these):`);
  failedList.forEach((s) => console.log(`  - ${s}`));
}
console.log();
