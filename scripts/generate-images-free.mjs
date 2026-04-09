/**
 * FREE Coloring Page Generator — Pollinations.ai
 *
 * ✅ 100% Free — no API key, no signup, no credit card
 * ✅ Uses Flux (best free image model available)
 * ✅ Unlimited images
 * ✅ Auto-skips already-generated images
 *
 * Usage:
 *   node scripts/generate-images-free.mjs                        → all pages
 *   node scripts/generate-images-free.mjs --category=animal-mandalas
 *   node scripts/generate-images-free.mjs lion-mandala
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_PAGES } from "./pages-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/images/coloring");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Parse args
const args = process.argv.slice(2);
const categoryFlag = args.find((a) => a.startsWith("--category="))?.split("=")[1];
const slugArg = args.find((a) => !a.startsWith("--"));

let pages = ALL_PAGES;
if (categoryFlag) pages = ALL_PAGES.filter((p) => p.category === categoryFlag);
else if (slugArg) pages = ALL_PAGES.filter((p) => p.slug === slugArg);

const toGen = pages.filter((p) => !fs.existsSync(path.join(OUTPUT_DIR, `${p.slug}.png`)));

console.log(`\n🎨 FREE Coloring Page Generator (Pollinations.ai + Flux)`);
console.log(`   No API key needed — 100% free`);
console.log(`   Selected:     ${pages.length} pages`);
console.log(`   Already done: ${pages.length - toGen.length}`);
console.log(`   To generate:  ${toGen.length}\n`);

if (toGen.length === 0) { console.log("✅ All done!\n"); process.exit(0); }

async function generate(page, attempt = 1) {
  const out = path.join(OUTPUT_DIR, `${page.slug}.png`);

  const subject = page.prompt
    .replace(/Coloring book page,.*$/i, "")
    .replace(/\.\s*Coloring book.*$/i, "")
    .split(".")[0]
    .trim()
    .slice(0, 200);

  const prompt = encodeURIComponent(
    `${subject}. Coloring book page. Black and white line art only. Bold thick outlines. No color fills. No shading. Pure white background. Printable quality.`
  );

  const url = `https://image.pollinations.ai/prompt/${prompt}?width=1024&height=1024&model=flux&nologo=true&seed=${Math.floor(Math.random() * 9999)}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(90000) });

    if (res.status === 429) {
      // Rate limited — wait longer before retry
      const wait = 30000 * attempt;
      process.stdout.write(`⏳ rate limit, waiting ${wait/1000}s... `);
      await new Promise((r) => setTimeout(r, wait));
      if (attempt <= 4) return generate(page, attempt + 1);
      return false;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) throw new Error(`Not an image: ${contentType}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 10000) throw new Error(`Too small (${buffer.length}b)`);
    fs.writeFileSync(out, buffer);
    return true;
  } catch (e) {
    if (attempt <= 3) {
      await new Promise((r) => setTimeout(r, 15000 * attempt));
      return generate(page, attempt + 1);
    }
    return false;
  }
}

let done = 0, failed = 0;
for (let i = 0; i < toGen.length; i++) {
  const page = toGen[i];
  process.stdout.write(`  [${i + 1}/${toGen.length}] ${page.slug}... `);
  const ok = await generate(page);
  if (ok) { console.log("✅"); done++; }
  else { console.log("❌"); failed++; }
  // 15 second gap — stays well within Pollinations rate limits
  if (i < toGen.length - 1) await new Promise((r) => setTimeout(r, 15000));
}

console.log(`\n✅ Done! Generated: ${done}  ❌ Failed: ${failed}`);
console.log(`📁 Saved to: public/images/coloring/\n`);
