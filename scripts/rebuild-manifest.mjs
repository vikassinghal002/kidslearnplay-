/**
 * Rebuild manifest.json from existing images
 *
 * Scans all numeric .jpg files already downloaded, then re-queries Pixabay
 * with the same search terms to recover tags/categories — no re-downloading.
 *
 * Usage:
 *   PIXABAY_KEY=your_key node scripts/rebuild-manifest.mjs
 *
 * Resumes automatically if interrupted (reads existing manifest first).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR   = path.join(__dirname, "../public/images/coloring");
const MANIFEST_PATH = path.join(OUTPUT_DIR, "manifest.json");

const PIXABAY_KEY  = process.env.PIXABAY_KEY;
if (!PIXABAY_KEY) { console.error("❌ Missing PIXABAY_KEY\nUsage: PIXABAY_KEY=your_key node scripts/rebuild-manifest.mjs"); process.exit(1); }

const PER_PAGE    = 200;
const MAX_PAGES   = 5;
const BATCH_DELAY = 600; // ms between API calls

// ─── Category detection (mirrors download-bulk.mjs) ──────────────────────────

const RULES = [
  [/mandala|zentangle|doodle|celtic|henna|paisley|kaleidoscope/, "mandalas"],
  [/christmas|santa|snowman|xmas|reindeer/,                      "holidays"],
  [/halloween|pumpkin|ghost|witch|skeleton|bat|haunted/,         "holidays"],
  [/easter|bunny.*egg|egg.*bunny/,                               "holidays"],
  [/valentine|heart.*love/,                                      "holidays"],
  [/thanksgiving|turkey.*thanks/,                                "holidays"],
  [/diwali|fireworks|birthday/,                                  "holidays"],
  [/unicorn|pegasus/,                                            "fantasy"],
  [/fairy|mermaid|dragon|castle|phoenix|elf|wizard/,             "fantasy"],
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
  [/fish|shark|dolphin|whale|octopus|crab|turtle|frog|snake/,    "animals"],
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
  [/princess|ballerina|doctor|chef|firefighter/,                 "characters"],
  [/anime|chibi|manga|kawaii|cartoon/,                           "characters"],
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

// ─── Same queries as download-bulk.mjs ───────────────────────────────────────

const QUERIES = [
  "coloring page", "coloring sheet", "coloring book page", "kids coloring page",
  "printable coloring page", "free coloring page", "adult coloring page",
  "coloring page outline", "line art coloring", "black white coloring page",
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
  "bird coloring page", "owl coloring page", "eagle coloring page",
  "parrot coloring page", "flamingo coloring page", "peacock coloring page",
  "penguin coloring page", "toucan coloring page", "hummingbird coloring page",
  "duck coloring page", "chicken coloring page", "robin coloring page",
  "fish coloring page", "shark coloring page", "dolphin coloring page",
  "whale coloring page", "octopus coloring page", "crab coloring page",
  "lobster coloring page", "starfish coloring page", "jellyfish coloring page",
  "turtle coloring page", "frog coloring page", "crocodile coloring page",
  "snake coloring page", "lizard coloring page", "chameleon coloring page",
  "butterfly coloring page", "bee coloring page", "ladybug coloring page",
  "dragonfly coloring page", "spider coloring page", "ant coloring page",
  "caterpillar coloring page", "snail coloring page", "beetle coloring page",
  "dinosaur coloring page", "t-rex coloring page", "triceratops coloring page",
  "stegosaurus coloring page", "brachiosaurus coloring page",
  "velociraptor coloring page", "pterodactyl coloring page",
  "dragon coloring page", "unicorn coloring page", "fairy coloring page",
  "mermaid coloring page", "witch coloring page", "wizard coloring page",
  "castle coloring page", "knight coloring page", "princess coloring page",
  "phoenix coloring page", "pegasus coloring page", "elf coloring page",
  "angel coloring page", "vampire coloring page", "zombie coloring page",
  "monster coloring page", "alien coloring page", "robot coloring page",
  "mandala coloring page", "lotus mandala coloring", "flower mandala coloring",
  "animal mandala coloring", "geometric mandala coloring", "star mandala coloring",
  "moon mandala coloring", "sun mandala coloring", "butterfly mandala coloring",
  "heart mandala coloring", "feather mandala coloring", "simple mandala coloring",
  "complex mandala coloring", "zentangle coloring page", "doodle art coloring",
  "celtic pattern coloring", "tribal pattern coloring", "henna coloring page",
  "flower coloring page", "rose coloring page", "sunflower coloring page",
  "tulip coloring page", "daisy coloring page", "lily coloring page",
  "orchid coloring page", "cherry blossom coloring", "hibiscus coloring page",
  "lavender coloring page", "mushroom coloring page", "cactus coloring page",
  "tree coloring page", "forest coloring page", "leaf coloring page",
  "autumn leaf coloring", "garden coloring page", "jungle coloring page",
  "ocean coloring page", "mountain coloring page", "waterfall coloring page",
  "rainbow coloring page", "cloud coloring page", "sun coloring page",
  "moon stars coloring page", "snowflake coloring page",
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
  "superhero coloring page", "pirate coloring page", "astronaut coloring page",
  "firefighter coloring page", "doctor coloring page", "nurse coloring page",
  "chef coloring page", "ballerina coloring page", "cowboy coloring page",
  "ninja coloring page", "clown coloring page", "magician coloring page",
  "mummy coloring page", "sailor coloring page", "soldier coloring page",
  "caveman coloring page", "viking coloring page", "samurai coloring page",
  "alphabet coloring page", "number coloring page", "shape coloring page",
  "solar system coloring page", "planet coloring page",
  "space rocket coloring page", "map coloring page", "food coloring page",
  "fruit coloring page", "vegetable coloring page", "body parts coloring page",
  "clothes coloring page", "house coloring page", "school coloring page",
  "car coloring page", "truck coloring page", "bus coloring page",
  "train coloring page", "airplane coloring page", "helicopter coloring page",
  "boat coloring page", "ship coloring page", "bicycle coloring page",
  "motorcycle coloring page", "tractor coloring page", "fire truck coloring page",
  "police car coloring page", "ambulance coloring page",
  "race car coloring page", "submarine coloring page",
  "anime coloring page", "chibi coloring page", "manga coloring page",
  "kawaii coloring page", "cartoon coloring page",
  "geometric coloring page", "abstract coloring page",
  "stained glass coloring page", "pattern coloring page",
  "art nouveau coloring", "paisley coloring page",
  "mosaic coloring page", "kaleidoscope coloring page",
  "dream catcher coloring page", "zodiac coloring page",
  "crystal coloring page", "gem coloring page",
  "farm coloring page", "barn coloring page",
  "fruits coloring page", "vegetables coloring page",
  "pizza coloring page", "cupcake coloring page", "ice cream coloring page",
  "candy coloring page",
  "sport coloring page", "football coloring page", "basketball coloring page",
  "soccer coloring page", "tennis coloring page", "swimming coloring page",
  "dancing coloring page", "music coloring page",
  "guitar coloring page", "piano coloring page",
  "underwater coloring page", "safari coloring page",
  "circus coloring page", "fairy tale coloring page",
  "village coloring page", "city coloring page",
  "pirate ship coloring page", "treasure coloring page",
  "lighthouse coloring page", "windmill coloring page",
  "cottage coloring page", "playground coloring page",
  "birthday coloring page", "gift coloring page",
];

// ─── Load existing state ──────────────────────────────────────────────────────

// All .jpg files already on disk (numeric IDs)
const diskIds = new Set(
  fs.readdirSync(OUTPUT_DIR)
    .filter((f) => /^\d+\.jpg$/.test(f))
    .map((f) => f.replace(".jpg", ""))
);
console.log(`📁 Images on disk: ${diskIds.size.toLocaleString()}`);

// Load existing manifest (resume support)
let manifest = [];
if (fs.existsSync(MANIFEST_PATH) && fs.statSync(MANIFEST_PATH).size > 2) {
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    console.log(`📋 Existing manifest entries: ${manifest.length.toLocaleString()}`);
  } catch { manifest = []; }
}

const resolvedIds = new Set(manifest.map((m) => String(m.id)));
const unresolved  = new Set([...diskIds].filter((id) => !resolvedIds.has(id)));
console.log(`🔍 Images needing metadata: ${unresolved.size.toLocaleString()}\n`);

if (unresolved.size === 0) {
  console.log("✅ All images already have metadata!");
  process.exit(0);
}

function saveManifest() {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

// ─── Fetch one query page ─────────────────────────────────────────────────────

async function fetchPage(query, pageNum) {
  const url =
    `https://pixabay.com/api/?key=${PIXABAY_KEY}` +
    `&q=${encodeURIComponent(query)}` +
    `&image_type=vector&colors=grayscale` +
    `&safesearch=true&per_page=${PER_PAGE}&page=${pageNum}&order=popular`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (res.status === 429) { await sleep(60000); throw new Error("rate limited"); }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── Main loop ────────────────────────────────────────────────────────────────

let recovered = 0;

for (let qi = 0; qi < QUERIES.length; qi++) {
  if (unresolved.size === 0) break;

  const query = QUERIES[qi];
  const pct = (((diskIds.size - unresolved.size) / diskIds.size) * 100).toFixed(1);
  process.stdout.write(`[${qi + 1}/${QUERIES.length}] "${query}" (${pct}% done) — `);

  let found = 0;
  for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
    if (unresolved.size === 0) break;

    let data;
    try {
      data = await fetchPage(query, pageNum);
    } catch (e) {
      if (e.message.includes("400")) break;
      process.stdout.write(`⚠️ ${e.message}  `);
      await sleep(3000);
      continue;
    }

    if (!data.hits?.length) break;

    for (const hit of data.hits) {
      const id = String(hit.id);
      if (unresolved.has(id)) {
        unresolved.delete(id);
        resolvedIds.add(id);
        manifest.push({
          id,
          slug:     `coloring-${id}`,
          title:    buildTitle(hit.tags),
          filename: `${id}.jpg`,
          tags:     hit.tags.split(",").map((t) => t.trim()).filter(Boolean),
          category: detectCategory(hit.tags),
          source:   "pixabay",
        });
        found++;
        recovered++;
      }
    }

    if (data.hits.length < PER_PAGE) break;
    await sleep(BATCH_DELAY);
  }

  process.stdout.write(`+${found}\n`);
  if (found > 0) saveManifest();
  await sleep(300);
}

// ─── Remaining unresolved → assign "general" ─────────────────────────────────

if (unresolved.size > 0) {
  console.log(`\n⚠️  ${unresolved.size} images not found in Pixabay — assigning "general" category`);
  for (const id of unresolved) {
    manifest.push({
      id,
      slug:     `coloring-${id}`,
      title:    "Coloring Page",
      filename: `${id}.jpg`,
      tags:     [],
      category: "general",
      source:   "pixabay",
    });
  }
  saveManifest();
}

// ─── Summary ─────────────────────────────────────────────────────────────────

const cats = {};
for (const p of manifest) cats[p.category] = (cats[p.category] ?? 0) + 1;

console.log(`\n✅ DONE — manifest.json rebuilt`);
console.log(`   Total entries: ${manifest.length.toLocaleString()}`);
console.log(`\n   Category breakdown:`);
for (const [cat, count] of Object.entries(cats).sort((a, b) => b[1] - a[1])) {
  console.log(`     ${cat.padEnd(15)} ${count.toLocaleString()}`);
}
