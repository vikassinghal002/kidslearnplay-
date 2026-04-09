/**
 * Import DigiKam tags → rebuild manifest.json
 *
 * After DigiKam auto-tags images and writes XMP sidecar files, run this
 * script to read those tags and assign categories to every image.
 *
 * DigiKam must be configured to write XMP sidecar files:
 *   Settings → Configure DigiKam → Metadata → Write to sidecar files (XMP)
 *
 * Usage:
 *   node scripts/import-digikam-tags.mjs
 *
 * The script reads:
 *   public/images/coloring/<id>.xmp   (DigiKam XMP sidecar)
 * and writes:
 *   public/images/coloring/manifest.json
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const COLORING_DIR = path.join(__dirname, "../public/images/coloring");
const MANIFEST_PATH = path.join(COLORING_DIR, "manifest.json");

// ─── Tag → Category mapping ───────────────────────────────────────────────────
// DigiKam AI uses English labels. Map them to our 8 app categories.

const TAG_RULES = [
  // Mandalas / patterns
  [/mandala|zentangle|doodle|celtic|henna|paisley|kaleidoscope|geometric.*pattern|ornament|motif/, "mandalas"],

  // Holidays
  [/christmas|santa|xmas|snowman|reindeer|christmas.tree/,      "holidays"],
  [/halloween|pumpkin|ghost|skeleton|witch|haunted|bat/,         "holidays"],
  [/easter|bunny.*egg|easter.egg/,                               "holidays"],
  [/valentine|heart.*love|cupid/,                                "holidays"],
  [/thanksgiving|turkey/,                                        "holidays"],
  [/diwali|firework|birthday.cake/,                              "holidays"],

  // Fantasy
  [/unicorn|pegasus|dragon|fairy|mermaid|phoenix|elf|wizard|castle|knight|princess|angel|vampire|zombie|monster|alien|robot|griffin|centaur|gnome|troll/, "fantasy"],

  // Animals — broad
  [/dinosaur|dino|t.rex|triceratop|stegosaur|pterodactyl|velociraptor/, "animals"],
  [/cat|kitten|kitty|feline/,                   "animals"],
  [/dog|puppy|corgi|husky|labrador|poodle|dachshund|canine/, "animals"],
  [/horse|pony|zebra|donkey|stallion|mare/,     "animals"],
  [/lion|tiger|cheetah|leopard|jaguar|panther|cougar/, "animals"],
  [/elephant|hippo|rhino|giraffe|camel|llama|bison|buffalo/, "animals"],
  [/bear|panda|koala|fox|wolf|deer|moose|elk|reindeer/, "animals"],
  [/rabbit|bunny|squirrel|hamster|mouse|rat|hedgehog|mole/, "animals"],
  [/bird|owl|eagle|parrot|flamingo|peacock|penguin|duck|toucan|hummingbird|robin|pigeon|sparrow|hawk|falcon/, "animals"],
  [/fish|shark|dolphin|whale|octopus|crab|lobster|starfish|jellyfish|turtle|frog|toad|snake|lizard|gecko|crocodile|alligator|chameleon|iguana|salamander/, "animals"],
  [/gorilla|monkey|chimpanzee|orangutan|kangaroo|koala|wombat|pig|cow|bull|sheep|goat|chicken|rooster|turkey.*bird|llama|alpaca|bison|moose/, "animals"],
  [/insect|butterfly|bee|ladybug|dragonfly|spider|ant|caterpillar|snail|beetle|moth|cricket|grasshopper|firefly|scorpion/, "animals"],
  [/animal|wildlife|creature|beast|mammal|reptile|amphibian|bird|fish/, "animals"],

  // Nature
  [/flower|rose|sunflower|tulip|daisy|lily|orchid|blossom|cherry.blossom|hibiscus|lavender|peony|dahlia|lotus|wildflower/, "nature"],
  [/tree|forest|jungle|leaf|leaves|garden|mushroom|cactus|plant|fern|moss|vine|bush|shrub|bamboo/, "nature"],
  [/ocean|sea|mountain|waterfall|rainbow|cloud|snowflake|river|lake|beach|sunset|sunrise|landscape|nature|sky/, "nature"],
  [/mushroom|fungi|toadstool/,                  "nature"],

  // Educational
  [/alphabet|letter|abc|number|numeral|shape|circle|square|triangle/, "educational"],
  [/solar.system|planet|space|rocket|astronaut|moon|star|galaxy|constellation/, "educational"],
  [/fruit|vegetable|food|pizza|cupcake|ice.cream|candy|cake|bread|burger|sushi/, "educational"],
  [/body.part|skeleton|anatomy|organ/,          "educational"],
  [/map|globe|flag|country/,                    "educational"],
  [/school|classroom|book|pencil|science|math|chemistry|lab|laboratory/, "educational"],

  // Vehicles
  [/car|truck|bus|train|airplane|helicopter|boat|ship|bicycle|motorbike|motorcycle|tractor|submarine|rocket.ship|fire.truck|police.car|ambulance|race.car|tank|van|scooter|skateboard/, "vehicles"],

  // Characters / people
  [/superhero|pirate|ninja|cowboy|knight|samurai|viking|soldier|warrior/, "characters"],
  [/princess|ballerina|dancer|doctor|nurse|chef|firefighter|astronaut|clown|magician|sailor|caveman/, "characters"],
  [/anime|chibi|manga|kawaii|cartoon|comic/,    "characters"],
  [/person|people|human|child|boy|girl|man|woman|face|portrait/, "characters"],
];

function detectCategory(tags) {
  const t = tags.join(" ").toLowerCase();
  for (const [regex, cat] of TAG_RULES) {
    if (regex.test(t)) return cat;
  }
  return "general";
}

// ─── Parse XMP sidecar ────────────────────────────────────────────────────────
// Extracts all <rdf:li> values from dc:subject and digiKam:TagsList blocks.

function parseXMP(xmpText) {
  const tags = new Set();

  // Match any <rdf:li>VALUE</rdf:li> inside dc:subject or digiKam:TagsList
  const blocks = xmpText.match(/<(dc:subject|digiKam:TagsList|lr:hierarchicalSubject)[\s\S]*?<\/\1>/g) || [];
  for (const block of blocks) {
    const matches = block.matchAll(/<rdf:li[^>]*>([^<]+)<\/rdf:li>/g);
    for (const m of matches) {
      // DigiKam uses "Animals/Cat" style hierarchical tags — take all parts
      m[1].split("/").forEach((part) => tags.add(part.trim().toLowerCase()));
    }
  }

  // Also grab any flat dc:subject attr-style: subject="Cat, Dog"
  const flat = xmpText.match(/dc:subject="([^"]+)"/);
  if (flat) flat[1].split(",").forEach((t) => tags.add(t.trim().toLowerCase()));

  return [...tags].filter(Boolean);
}

// ─── Build title from tags ────────────────────────────────────────────────────

function buildTitle(tags) {
  if (!tags.length) return "Coloring Page";
  const first = tags[0].replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 60);
  return `${first} Coloring Page`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

// All .jpg files on disk
const jpgFiles = fs.readdirSync(COLORING_DIR).filter((f) => /^\d+\.jpg$/.test(f));
console.log(`📁 Images on disk: ${jpgFiles.length.toLocaleString()}`);

// Count XMP sidecars
const xmpFiles = new Set(
  fs.readdirSync(COLORING_DIR).filter((f) => f.endsWith(".xmp")).map((f) => f.replace(/\.xmp$/, ""))
);
console.log(`🏷️  XMP sidecar files: ${xmpFiles.size.toLocaleString()}`);

if (xmpFiles.size === 0) {
  console.error(`
❌ No XMP sidecar files found in:
   ${COLORING_DIR}

Please complete DigiKam tagging first:
  1. Settings → Configure DigiKam → Metadata
     → Enable "Write metadata to sidecar files" (XMP)
  2. Import album: ${COLORING_DIR}
  3. Tools → Image Recognition → run auto-tagging on all images
  4. Re-run this script after DigiKam finishes
`);
  process.exit(1);
}

// Load existing manifest (preserve any entries not covered by XMP files)
let existingManifest = [];
if (fs.existsSync(MANIFEST_PATH) && fs.statSync(MANIFEST_PATH).size > 2) {
  try { existingManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")); } catch { /**/ }
}
const existingById = Object.fromEntries(existingManifest.map((p) => [p.id, p]));

// Process every jpg
const manifest = [];
const stats = { tagged: 0, untagged: 0, noXmp: 0 };
const catCounts = {};

for (const file of jpgFiles) {
  const id  = file.replace(".jpg", "");
  const xmpPath = path.join(COLORING_DIR, `${id}.xmp`);

  let tags = [];
  let category = "general";

  if (fs.existsSync(xmpPath)) {
    const xmpText = fs.readFileSync(xmpPath, "utf8");
    tags = parseXMP(xmpText);
    category = detectCategory(tags);
    if (tags.length > 0) stats.tagged++; else stats.untagged++;
  } else {
    // No XMP — keep existing manifest entry if available, else general
    if (existingById[id]) {
      manifest.push(existingById[id]);
      catCounts[existingById[id].category] = (catCounts[existingById[id].category] ?? 0) + 1;
      stats.noXmp++;
      continue;
    }
    stats.noXmp++;
  }

  manifest.push({
    id,
    slug:     `coloring-${id}`,
    title:    buildTitle(tags),
    filename: `${id}.jpg`,
    tags,
    category,
    source:   "pixabay",
  });

  catCounts[category] = (catCounts[category] ?? 0) + 1;
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`\n✅ manifest.json rebuilt — ${manifest.length.toLocaleString()} entries`);
console.log(`\n   XMP tagged:    ${stats.tagged.toLocaleString()}`);
console.log(`   XMP no tags:   ${stats.untagged.toLocaleString()}`);
console.log(`   No XMP file:   ${stats.noXmp.toLocaleString()}`);
console.log(`\n   Category breakdown:`);
for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
  const bar = "█".repeat(Math.round(count / manifest.length * 40));
  console.log(`     ${cat.padEnd(15)} ${String(count).padStart(5)}  ${bar}`);
}
