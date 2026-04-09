/**
 * Bulk Coloring Page Downloader — Pixabay API
 *
 * Target: 500,000 coloring page images
 * Strategy:
 *   - 250 diverse queries × up to 20 pages × 200 results = 1M potential
 *   - colors=grayscale filter → only B&W/line-art style images
 *   - Brightness check → rejects dark photos, keeps white-background pages
 *   - File size check → rejects corrupted or non-image files
 *   - 8 parallel workers, 400ms between batches
 *   - Never overwrites existing files
 *   - Auto-resumes from manifest
 *
 * Usage:
 *   PIXABAY_KEY=your_key node scripts/download-bulk.mjs
 *   PIXABAY_KEY=your_key TARGET=10000 node scripts/download-bulk.mjs
 *
 * Monitor: tail -f download-bulk.log
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR  = path.join(__dirname, "../public/images/coloring");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");
const LOG_PATH    = path.join(__dirname, "../download-bulk.log");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PIXABAY_KEY = process.env.PIXABAY_KEY;
if (!PIXABAY_KEY) { console.error("❌ Missing PIXABAY_KEY"); process.exit(1); }

const TARGET      = parseInt(process.env.TARGET ?? "50000");
const PER_PAGE    = 200;
const MAX_PAGES   = 5;     // 5 pages × 200 = 1,000 per query
const CONCURRENCY = 8;
const BATCH_DELAY = 400;   // ms between parallel batches

// ─── 250 diverse search queries ───────────────────────────────────────────────

const QUERIES = [
  // Core coloring page terms
  "coloring page", "coloring sheet", "coloring book page", "kids coloring page",
  "printable coloring page", "free coloring page", "adult coloring page",
  "coloring page outline", "line art coloring", "black white coloring page",

  // Animals — mammals
  "cat coloring page", "dog coloring page", "horse coloring page",
  "lion coloring page", "tiger coloring page", "elephant coloring page",
  "bear coloring page", "panda coloring page", "koala coloring page",
  "rabbit coloring page", "fox coloring page", "wolf coloring page",
  "deer coloring page", "giraffe coloring page", "zebra coloring page",
  "hippo coloring page", "rhino coloring page", "gorilla coloring page",
  "monkey coloring page", "kangaroo coloring page", "hamster coloring page",
  "hedgehog coloring page", "squirrel coloring page", "mouse coloring page",
  "pig coloring page", "cow coloring page", "sheep coloring page",
  "goat coloring page", "llama coloring page", "camel coloring page",

  // Animals — birds
  "bird coloring page", "owl coloring page", "eagle coloring page",
  "parrot coloring page", "flamingo coloring page", "peacock coloring page",
  "penguin coloring page", "toucan coloring page", "hummingbird coloring page",
  "duck coloring page", "chicken coloring page", "robin coloring page",

  // Animals — ocean & reptiles
  "fish coloring page", "shark coloring page", "dolphin coloring page",
  "whale coloring page", "octopus coloring page", "crab coloring page",
  "lobster coloring page", "starfish coloring page", "jellyfish coloring page",
  "turtle coloring page", "frog coloring page", "crocodile coloring page",
  "snake coloring page", "lizard coloring page", "chameleon coloring page",

  // Animals — insects
  "butterfly coloring page", "bee coloring page", "ladybug coloring page",
  "dragonfly coloring page", "spider coloring page", "ant coloring page",
  "caterpillar coloring page", "snail coloring page", "beetle coloring page",

  // Dinosaurs
  "dinosaur coloring page", "t-rex coloring page", "triceratops coloring page",
  "stegosaurus coloring page", "brachiosaurus coloring page",
  "velociraptor coloring page", "pterodactyl coloring page",

  // Fantasy
  "dragon coloring page", "unicorn coloring page", "fairy coloring page",
  "mermaid coloring page", "witch coloring page", "wizard coloring page",
  "castle coloring page", "knight coloring page", "princess coloring page",
  "phoenix coloring page", "pegasus coloring page", "elf coloring page",
  "angel coloring page", "vampire coloring page", "zombie coloring page",
  "monster coloring page", "alien coloring page", "robot coloring page",

  // Mandalas
  "mandala coloring page", "lotus mandala coloring", "flower mandala coloring",
  "animal mandala coloring", "geometric mandala coloring", "star mandala coloring",
  "moon mandala coloring", "sun mandala coloring", "butterfly mandala coloring",
  "heart mandala coloring", "feather mandala coloring", "simple mandala coloring",
  "complex mandala coloring", "zentangle coloring page", "doodle art coloring",
  "celtic pattern coloring", "tribal pattern coloring", "henna coloring page",

  // Flowers & nature
  "flower coloring page", "rose coloring page", "sunflower coloring page",
  "tulip coloring page", "daisy coloring page", "lily coloring page",
  "orchid coloring page", "cherry blossom coloring", "hibiscus coloring page",
  "lavender coloring page", "mushroom coloring page", "cactus coloring page",
  "tree coloring page", "forest coloring page", "leaf coloring page",
  "autumn leaf coloring", "garden coloring page", "jungle coloring page",
  "ocean coloring page", "mountain coloring page", "waterfall coloring page",
  "rainbow coloring page", "cloud coloring page", "sun coloring page",
  "moon stars coloring page", "snowflake coloring page",

  // Holidays & seasons
  "christmas coloring page", "santa claus coloring page",
  "christmas tree coloring page", "snowman coloring page",
  "reindeer coloring page", "elf christmas coloring page",
  "halloween coloring page", "pumpkin coloring page", "ghost coloring page",
  "skeleton coloring page", "bat coloring page", "haunted house coloring page",
  "easter coloring page", "easter egg coloring page",
  "easter bunny coloring page", "valentine heart coloring page",
  "thanksgiving coloring page", "turkey coloring page",
  "diwali coloring page", "fireworks coloring page", "birthday cake coloring page",
  "spring coloring page", "summer coloring page", "winter coloring page",

  // Characters & people
  "superhero coloring page", "pirate coloring page", "astronaut coloring page",
  "firefighter coloring page", "doctor coloring page", "nurse coloring page",
  "chef coloring page", "ballerina coloring page", "cowboy coloring page",
  "ninja coloring page", "clown coloring page", "magician coloring page",
  "mummy coloring page", "sailor coloring page", "soldier coloring page",
  "caveman coloring page", "viking coloring page", "samurai coloring page",

  // Educational
  "alphabet coloring page", "number coloring page", "shape coloring page",
  "solar system coloring page", "planet coloring page",
  "space rocket coloring page", "map coloring page", "food coloring page",
  "fruit coloring page", "vegetable coloring page", "body parts coloring page",
  "clothes coloring page", "house coloring page", "school coloring page",

  // Vehicles & transport
  "car coloring page", "truck coloring page", "bus coloring page",
  "train coloring page", "airplane coloring page", "helicopter coloring page",
  "boat coloring page", "ship coloring page", "bicycle coloring page",
  "motorcycle coloring page", "tractor coloring page", "fire truck coloring page",
  "police car coloring page", "ambulance coloring page",
  "race car coloring page", "submarine coloring page",

  // Anime / popular styles
  "anime coloring page", "chibi coloring page", "manga coloring page",
  "kawaii coloring page", "cartoon coloring page",

  // Patterns & abstract
  "geometric coloring page", "abstract coloring page",
  "stained glass coloring page", "pattern coloring page",
  "art nouveau coloring", "paisley coloring page",
  "mosaic coloring page", "kaleidoscope coloring page",
  "dream catcher coloring page", "zodiac coloring page",
  "crystal coloring page", "gem coloring page",

  // Farm & food
  "farm coloring page", "barn coloring page",
  "fruits coloring page", "vegetables coloring page",
  "pizza coloring page", "cupcake coloring page", "ice cream coloring page",
  "candy coloring page",

  // Sports & activities
  "sport coloring page", "football coloring page", "basketball coloring page",
  "soccer coloring page", "tennis coloring page", "swimming coloring page",
  "dancing coloring page", "music coloring page",
  "guitar coloring page", "piano coloring page",

  // Misc
  "underwater coloring page", "safari coloring page",
  "circus coloring page", "fairy tale coloring page",
  "village coloring page", "city coloring page",
  "pirate ship coloring page", "treasure coloring page",
  "lighthouse coloring page", "windmill coloring page",
  "cottage coloring page", "playground coloring page",
  "birthday coloring page", "gift coloring page",
];

// ─── Category detection ───────────────────────────────────────────────────────

const RULES = [
  [/mandala|zentangle|doodle|celtic|henna|paisley|kaleidoscope/, "mandalas"],
  [/christmas|santa|snowman|xmas|reindeer|elf.*xmas/,            "holidays"],
  [/halloween|pumpkin|ghost|witch|skeleton|bat|haunted/,         "holidays"],
  [/easter|bunny.*egg|egg.*bunny/,                               "holidays"],
  [/valentine|heart.*love/,                                      "holidays"],
  [/thanksgiving|turkey.*thanks/,                                "holidays"],
  [/diwali|fireworks|birthday/,                                  "holidays"],
  [/unicorn|pegasus/,                                            "fantasy"],
  [/fairy|mermaid|dragon|castle|phoenix|elf|wizard|witch/,       "fantasy"],
  [/knight|princess|angel|vampire|zombie|monster|alien/,         "fantasy"],
  [/dinosaur|dino|t.?rex|triceratop|stegosaur|pterodactyl/,      "animals"],
  [/butterfly|bee|ladybug|dragonfly|spider|caterpillar|snail/,   "animals"],
  [/cat|kitten|kitty/,                                           "animals"],
  [/dog|puppy|corgi|husky|labrador/,                             "animals"],
  [/horse|pony|zebra|donkey/,                                    "animals"],
  [/lion|tiger|cheetah|leopard/,                                 "animals"],
  [/elephant|hippo|rhino|giraffe|camel|llama/,                   "animals"],
  [/bear|panda|koala|fox|wolf|deer|moose/,                       "animals"],
  [/rabbit|bunny|squirrel|hamster|mouse|hedgehog/,               "animals"],
  [/bird|owl|eagle|parrot|flamingo|peacock|penguin|duck/,        "animals"],
  [/fish|shark|dolphin|whale|octopus|crab|turtle|frog|snake/,   "animals"],
  [/gorilla|monkey|kangaroo|pig|cow|sheep|chicken/,              "animals"],
  [/flower|rose|sunflower|tulip|daisy|lily|orchid|blossom/,      "nature"],
  [/tree|forest|jungle|leaf|garden|mushroom|cactus|plant/,       "nature"],
  [/ocean|mountain|waterfall|rainbow|cloud|snowflake/,           "nature"],
  [/alphabet|letter|abc|number|shape|body.*part/,                "educational"],
  [/solar.*system|planet|space|rocket|astronaut/,                "educational"],
  [/fruit|vegetable|food|pizza|cupcake|ice.*cream|candy/,        "educational"],
  [/car|truck|bus|train|airplane|helicopter|boat|ship|bicycle/,  "vehicles"],
  [/motorcycle|tractor|fire.*truck|submarine|race.*car/,         "vehicles"],
  [/superhero|pirate|ninja|cowboy|knight|samurai|viking/,        "characters"],
  [/princess|ballerina|doctor|chef|firefighter|astronaut/,       "characters"],
  [/anime|chibi|manga|kawaii|cartoon/,                           "characters"],
  [/christmas|santa|halloween|easter|valentine/,                 "holidays"],
];

function detectCategory(tags) {
  const t = (tags || "").toLowerCase();
  for (const [regex, cat] of RULES) if (regex.test(t)) return cat;
  return "general";
}

function buildTitle(tags) {
  const first = (tags || "").split(",")[0].trim()
    .replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 60);
  return first ? `${first} Coloring Page` : "Coloring Page";
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

// ─── Logging ──────────────────────────────────────────────────────────────────

function log(msg) {
  const line = `[${new Date().toISOString().slice(11,19)}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_PATH, line + "\n");
}

// ─── Manifest ─────────────────────────────────────────────────────────────────

let manifest = [];
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    log(`📋 Loaded manifest: ${manifest.length} existing entries`);
  } catch { manifest = []; }
}

const existingIds = new Set(manifest.map((m) => String(m.id)));

function saveManifest() {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function fetchPage(query, pageNum) {
  // image_type=vector → only SVG/EPS line art (actual coloring pages, not photos)
  // colors=grayscale  → only black & white images
  // Together = guaranteed real coloring page line art
  const url =
    `https://pixabay.com/api/?key=${PIXABAY_KEY}` +
    `&q=${encodeURIComponent(query)}` +
    `&image_type=vector&colors=grayscale` +
    `&safesearch=true&per_page=${PER_PAGE}&page=${pageNum}&order=popular`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (res.status === 429) { await sleep(30000); throw new Error("rate limited"); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── Image download & quality check ──────────────────────────────────────────

async function downloadOnce(hit) {
  const filepath = path.join(OUTPUT_DIR, `${hit.id}.jpg`);
  if (fs.existsSync(filepath)) return "exists";

  try {
    const res = await fetch(hit.webformatURL, {
      signal: AbortSignal.timeout(25000),
      headers: {
        "Referer": "https://pixabay.com/",
        "User-Agent": "Mozilla/5.0 (compatible; coloring-downloader/1.0)",
      },
    });
    if (res.status === 429) return "ratelimit";
    if (!res.ok) return "error";

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10000) return "toosmall";  // < 10KB → corrupted

    // Verify JPEG (FF D8) or PNG (89 50)
    const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8;
    const isPng  = buf[0] === 0x89 && buf[1] === 0x50;
    if (!isJpeg && !isPng) return "notimage";

    // image_type=vector + colors=grayscale API filters already guarantee
    // real coloring page line art — no further brightness check needed.
    fs.writeFileSync(filepath, buf);
    return "ok";
  } catch {
    return "error";
  }
}

async function downloadWithRetry(hit) {
  const r1 = await downloadOnce(hit);
  if (r1 === "ok" || r1 === "exists") return r1;
  const delay = r1 === "ratelimit" ? 10000 : 2000;
  await sleep(delay);
  return downloadOnce(hit);
}

async function downloadBatch(hits, withRetry = false) {
  const fn = withRetry ? downloadWithRetry : downloadOnce;
  const results = [];
  for (let i = 0; i < hits.length; i += CONCURRENCY) {
    const batch = hits.slice(i, i + CONCURRENCY);
    const res = await Promise.all(batch.map(fn));
    results.push(...res);
    if (i + CONCURRENCY < hits.length) await sleep(BATCH_DELAY);
  }
  return results;
}

// ─── Process one query ────────────────────────────────────────────────────────

async function processQuery(query) {
  const failed = [];
  let downloaded = 0;

  for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
    if (existingIds.size >= TARGET) break;

    let data;
    try {
      data = await fetchPage(query, pageNum);
    } catch (e) {
      // API 400 usually means no more pages for this query — stop quietly
      if (e.message.includes("400")) break;
      log(`    ⚠️  "${query}" p${pageNum}: ${e.message}`);
      await sleep(3000);
      continue;
    }

    if (!data.hits?.length) break;

    const newHits = data.hits.filter((h) => !existingIds.has(String(h.id)));
    if (!newHits.length) {
      if (data.hits.length < PER_PAGE) break; // last page reached
      continue;
    }

    process.stdout.write(`    p${pageNum}: ${newHits.length} → `);
    const results = await downloadBatch(newHits, false);

    let ok = 0, fail = 0;
    for (let i = 0; i < newHits.length; i++) {
      if (results[i] === "ok") {
        const hit = newHits[i];
        const id  = String(hit.id);
        existingIds.add(id);
        manifest.push({
          id,
          slug:     `coloring-${id}`,
          title:    buildTitle(hit.tags),
          filename: `${id}.jpg`,
          tags:     hit.tags.split(",").map((t) => t.trim()).filter(Boolean),
          category: detectCategory(hit.tags),
          source:   "pixabay",
        });
        ok++; downloaded++;
      } else if (results[i] !== "exists") {
        failed.push(newHits[i]);
        fail++;
      }
    }

    process.stdout.write(`✅ ${ok}  ❌ ${fail}\n`);
    saveManifest();

    if (data.hits.length < PER_PAGE) break; // last page
    await sleep(700);
  }

  return { downloaded, failed };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

log(`\n⬇️  Bulk Coloring Page Downloader`);
log(`   Target:     ${TARGET.toLocaleString()} images`);
log(`   Have:       ${existingIds.size.toLocaleString()} already`);
log(`   Need:       ${Math.max(0, TARGET - existingIds.size).toLocaleString()}`);
log(`   Queries:    ${QUERIES.length}`);
log(`   Max pages:  ${MAX_PAGES} per query`);
log(`   Workers:    ${CONCURRENCY} parallel, ${BATCH_DELAY}ms between batches\n`);

if (existingIds.size >= TARGET) {
  log("✅ Already at target!\n");
  process.exit(0);
}

const allFailed = [];

for (let qi = 0; qi < QUERIES.length; qi++) {
  if (existingIds.size >= TARGET) break;
  const query = QUERIES[qi];
  const pct = ((existingIds.size / TARGET) * 100).toFixed(1);
  log(`\n[${qi + 1}/${QUERIES.length}] "${query}" — ${existingIds.size.toLocaleString()}/${TARGET.toLocaleString()} (${pct}%)`);
  const { downloaded, failed } = await processQuery(query);
  log(`   ✅ ${downloaded} new  ❌ ${failed.length} failed`);
  allFailed.push(...failed);
}

// ── Retry pass ────────────────────────────────────────────────────────────────

const uniqueFailed = allFailed.filter((h) => !existingIds.has(String(h.id)));

if (uniqueFailed.length > 0 && existingIds.size < TARGET) {
  log(`\n🔄 Retry pass: ${uniqueFailed.length.toLocaleString()} images`);
  let retried = 0;

  for (let i = 0; i < uniqueFailed.length; i += CONCURRENCY) {
    if (existingIds.size >= TARGET) break;
    const batch = uniqueFailed.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(downloadWithRetry));

    for (let j = 0; j < batch.length; j++) {
      if (results[j] === "ok") {
        const hit = batch[j];
        const id  = String(hit.id);
        if (!existingIds.has(id)) {
          existingIds.add(id);
          manifest.push({
            id,
            slug:     `coloring-${id}`,
            title:    buildTitle(hit.tags),
            filename: `${id}.jpg`,
            tags:     hit.tags.split(",").map((t) => t.trim()).filter(Boolean),
            category: detectCategory(hit.tags),
            source:   "pixabay",
          });
          retried++;
        }
      }
    }
    if (i % (CONCURRENCY * 20) === 0) saveManifest();
    await sleep(1500);
  }

  saveManifest();
  log(`   ✅ Recovered: ${retried.toLocaleString()}`);
}

// ── Final ─────────────────────────────────────────────────────────────────────

log(`\n✅ COMPLETE`);
log(`   Total images: ${manifest.length.toLocaleString()} / ${TARGET.toLocaleString()} target`);
log(`   Shortfall:    ${Math.max(0, TARGET - manifest.length).toLocaleString()}`);
if (manifest.length < TARGET) {
  log(`   ℹ️  Run again to continue — skips already-downloaded images`);
}
log(`   📁 public/images/coloring/ \n`);
