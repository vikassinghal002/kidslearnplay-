/**
 * Categorize coloring images using Gemma vision via Ollama (local, free)
 *
 * Prerequisites:
 *   1. Install Ollama: https://ollama.com
 *   2. Pull a vision model: ollama pull gemma3:4b
 *      (or: llava, llava:13b, moondream, minicpm-v)
 *
 * Usage:
 *   node scripts/categorize-with-gemma.mjs
 *   MODEL=llava node scripts/categorize-with-gemma.mjs          # different model
 *   WORKERS=4 node scripts/categorize-with-gemma.mjs            # parallel workers
 *   ONLY_GENERAL=1 node scripts/categorize-with-gemma.mjs       # re-do only "general"
 *
 * Resumes automatically — skips images already categorized (non-general).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname    = path.dirname(fileURLToPath(import.meta.url));
const COLORING_DIR = path.join(__dirname, "../public/images/coloring");
const MANIFEST_PATH = path.join(COLORING_DIR, "manifest.json");

const MODEL       = process.env.MODEL    ?? "gemma3:4b";
const WORKERS     = parseInt(process.env.WORKERS ?? "2");    // parallel requests
const ONLY_GENERAL = process.env.ONLY_GENERAL === "1";       // re-categorize only "general"
const OLLAMA_URL  = process.env.OLLAMA_URL ?? "http://localhost:11434";

const CATEGORIES = ["animals", "nature", "holidays", "fantasy", "mandalas", "vehicles", "characters", "educational", "general"];

const PROMPT = `Look at this coloring page image. It is black and white line art meant to be colored in.

Classify it into EXACTLY ONE of these categories:
- animals     : any animal, bird, insect, fish, dinosaur, pet
- nature      : flowers, plants, trees, landscapes, weather, ocean, mountains
- holidays    : Christmas, Halloween, Easter, Valentine's Day, Thanksgiving, birthdays, Diwali
- fantasy     : unicorns, dragons, fairies, mermaids, wizards, castles, monsters, superheroes
- mandalas    : mandalas, zentangles, geometric patterns, kaleidoscopes, abstract patterns
- vehicles    : cars, trucks, trains, planes, boats, bikes, rockets, buses
- characters  : people, cartoon characters, anime, chibi, superheroes, professions (doctor, chef...)
- educational : alphabet, numbers, shapes, planets, food, body parts, maps, science
- general     : anything that doesn't fit above

Reply with ONLY the category word, nothing else. Example: animals`;

// ─── Ollama API ───────────────────────────────────────────────────────────────

async function classifyImage(imagePath) {
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: PROMPT,
      images: [imageData],
      stream: false,
      options: { temperature: 0, num_predict: 10 },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw  = (data.response ?? "").trim().toLowerCase().replace(/[^a-z]/g, "");
  return CATEGORIES.includes(raw) ? raw : "general";
}

// ─── Load manifest ────────────────────────────────────────────────────────────

let manifest = [];
if (fs.existsSync(MANIFEST_PATH) && fs.statSync(MANIFEST_PATH).size > 2) {
  try { manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")); } catch { /**/ }
}

// Images to process
const queue = manifest.filter((p) =>
  ONLY_GENERAL ? p.category === "general" : p.category === "general"
);

console.log(`🤖 Model:    ${MODEL}`);
console.log(`⚡ Workers:  ${WORKERS}`);
console.log(`📋 Total in manifest: ${manifest.length.toLocaleString()}`);
console.log(`🔍 To categorize:     ${queue.length.toLocaleString()}`);
if (queue.length === 0) { console.log("✅ Nothing to do!"); process.exit(0); }

// ─── Check Ollama is running ──────────────────────────────────────────────────

try {
  const ping = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
  if (!ping.ok) throw new Error();
  const tags = await ping.json();
  const available = tags.models?.map((m) => m.name) ?? [];
  console.log(`✅ Ollama running — models: ${available.join(", ") || "none"}`);

  if (!available.some((m) => m.startsWith(MODEL.split(":")[0]))) {
    console.warn(`⚠️  Model "${MODEL}" not found. Pull it with:\n   ollama pull ${MODEL}\n`);
    console.warn(`   Available vision models to try: llava, llava:13b, moondream, minicpm-v, gemma3:4b`);
    process.exit(1);
  }
} catch {
  console.error(`❌ Ollama not running. Start it with: ollama serve\n   Or install from: https://ollama.com`);
  process.exit(1);
}

// ─── Index manifest by id for fast updates ───────────────────────────────────

const manifestById = Object.fromEntries(manifest.map((p) => [p.id, p]));

function saveManifest() {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

// ─── Progress ─────────────────────────────────────────────────────────────────

let done = 0;
let errors = 0;
const startTime = Date.now();
const catCounts = {};

function progress(id, category, isError = false) {
  done++;
  if (!isError) catCounts[category] = (catCounts[category] ?? 0) + 1;
  const pct   = ((done / queue.length) * 100).toFixed(1);
  const elapsed = (Date.now() - startTime) / 1000;
  const rate  = done / elapsed;
  const remaining = Math.round((queue.length - done) / rate);
  const eta   = remaining > 60
    ? `${Math.floor(remaining / 60)}m ${remaining % 60}s`
    : `${remaining}s`;
  process.stdout.write(`\r[${done}/${queue.length}] ${pct}% | ${id} → ${category.padEnd(12)} | ${rate.toFixed(1)}/s | ETA ${eta}  `);
}

// ─── Worker ───────────────────────────────────────────────────────────────────

async function processItem(entry) {
  const imgPath = path.join(COLORING_DIR, entry.filename);
  if (!fs.existsSync(imgPath)) {
    manifestById[entry.id].category = "general";
    progress(entry.id, "general", true);
    return;
  }

  try {
    const category = await classifyImage(imgPath);
    manifestById[entry.id].category = category;

    // Update title if it was generic
    if (manifestById[entry.id].title === "Coloring Page" || manifestById[entry.id].title === "Coloring Pages Coloring Page") {
      manifestById[entry.id].title = category.charAt(0).toUpperCase() + category.slice(1) + " Coloring Page";
    }

    progress(entry.id, category);
  } catch (err) {
    errors++;
    progress(entry.id, "general", true);
  }
}

// ─── Parallel worker pool ─────────────────────────────────────────────────────

async function runPool(items, concurrency) {
  let index = 0;
  let saveCounter = 0;

  async function worker() {
    while (index < items.length) {
      const item = items[index++];
      await processItem(item);
      saveCounter++;
      // Save every 50 images
      if (saveCounter % 50 === 0) saveManifest();
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
}

await runPool(queue, WORKERS);

saveManifest();

// ─── Final summary ────────────────────────────────────────────────────────────

console.log(`\n\n✅ DONE`);
console.log(`   Processed: ${done.toLocaleString()}  |  Errors: ${errors}`);
console.log(`\n   New category breakdown:`);

// Full manifest counts
const allCats = {};
for (const p of manifest) allCats[p.category] = (allCats[p.category] ?? 0) + 1;
for (const [cat, count] of Object.entries(allCats).sort((a, b) => b[1] - a[1])) {
  const bar = "█".repeat(Math.round(count / manifest.length * 40));
  console.log(`     ${cat.padEnd(15)} ${String(count).padStart(5)}  ${bar}`);
}
