/**
 * FREE Coloring Page Generator — HuggingFace Inference API (FLUX)
 *
 * ✅ 100% Free — no credit card needed
 * ✅ Uses FLUX.1-schnell (same model as Pollinations, direct access)
 * ✅ No rate limit issues
 *
 * Setup (2 minutes):
 *   1. Sign up free at huggingface.co (email only)
 *   2. Go to huggingface.co/settings/tokens → New token → Read → copy it
 *   3. Run: HF_TOKEN=your_token node scripts/generate-images-hf.mjs
 *
 * Generate only 10 samples first:
 *   HF_TOKEN=your_token node scripts/generate-images-hf.mjs --limit=10
 *
 * Generate by category:
 *   HF_TOKEN=your_token node scripts/generate-images-hf.mjs --category=animal-mandalas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ALL_PAGES } from "./pages-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/images/coloring");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error("\n❌ Missing HF_TOKEN");
  console.error("   1. Sign up free at huggingface.co (no card needed)");
  console.error("   2. Go to huggingface.co/settings/tokens");
  console.error("   3. Click New Token → Read access → copy it");
  console.error("   4. Run: HF_TOKEN=your_token node scripts/generate-images-hf.mjs\n");
  process.exit(1);
}

// Parse args
const args = process.argv.slice(2);
const categoryFlag = args.find((a) => a.startsWith("--category="))?.split("=")[1];
const limitFlag = parseInt(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? "9999");
const slugArg = args.find((a) => !a.startsWith("--"));

let pages = ALL_PAGES;
if (categoryFlag) pages = ALL_PAGES.filter((p) => p.category === categoryFlag);
else if (slugArg) pages = ALL_PAGES.filter((p) => p.slug === slugArg);

const toGen = pages
  .filter((p) => !fs.existsSync(path.join(OUTPUT_DIR, `${p.slug}.png`)))
  .slice(0, limitFlag);

console.log(`\n🎨 FREE Coloring Page Generator (HuggingFace + FLUX)`);
console.log(`   No credit card needed`);
console.log(`   Selected:     ${pages.length} pages`);
console.log(`   Already done: ${pages.length - toGen.length - Math.max(0, pages.filter(p => !fs.existsSync(path.join(OUTPUT_DIR, `${p.slug}.png`))).length - toGen.length)}`);
console.log(`   To generate:  ${toGen.length}\n`);

if (toGen.length === 0) { console.log("✅ All done!\n"); process.exit(0); }

// HuggingFace model — FLUX.1-schnell is fast and free
const MODEL = "black-forest-labs/FLUX.1-schnell";
const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

async function generate(page, attempt = 1) {
  const out = path.join(OUTPUT_DIR, `${page.slug}.png`);

  // Clean, concise prompt — FLUX works best without overly long prompts
  const subject = page.prompt
    .replace(/Coloring book page,.*$/i, "")
    .replace(/\.\s*Coloring book.*$/i, "")
    .split(".")[0]
    .trim()
    .slice(0, 150);

  const prompt = `${subject}. Children's coloring book illustration. Black and white line art. Bold thick outlines only. No color fills, no shading, no gray tones. Pure white background. Printable coloring page.`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 1024,
          num_inference_steps: 4,
          guidance_scale: 0,
        },
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (res.status === 503) {
      // Model loading — wait and retry
      process.stdout.write(`⏳ model loading... `);
      await new Promise((r) => setTimeout(r, 20000));
      if (attempt <= 3) return generate(page, attempt + 1);
      return false;
    }

    if (res.status === 429) {
      const wait = 30000 * attempt;
      process.stdout.write(`⏳ rate limit, waiting ${wait/1000}s... `);
      await new Promise((r) => setTimeout(r, wait));
      if (attempt <= 4) return generate(page, attempt + 1);
      return false;
    }

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`HTTP ${res.status}: ${err.slice(0, 80)}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) {
      const body = await res.text();
      throw new Error(`Not an image: ${body.slice(0, 80)}`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 5000) throw new Error(`Too small: ${buffer.length} bytes`);
    fs.writeFileSync(out, buffer);
    return true;

  } catch (e) {
    if (attempt <= 3) {
      await new Promise((r) => setTimeout(r, 10000 * attempt));
      return generate(page, attempt + 1);
    }
    throw e;
  }
}

let done = 0, failed = 0;
for (let i = 0; i < toGen.length; i++) {
  const page = toGen[i];
  process.stdout.write(`  [${i + 1}/${toGen.length}] ${page.slug}... `);
  try {
    const ok = await generate(page);
    if (ok) { console.log("✅"); done++; }
    else { console.log("❌ skipped"); failed++; }
  } catch (e) {
    console.log(`❌ ${e.message?.slice(0, 60)}`);
    failed++;
  }
  if (i < toGen.length - 1) await new Promise((r) => setTimeout(r, 3000));
}

console.log(`\n✅ Generated: ${done}  ❌ Failed: ${failed}`);
console.log(`📁 Saved to: public/images/coloring/`);
if (done < toGen.length) {
  console.log(`\nRun again to continue — already-done images are skipped automatically.`);
}
console.log();
