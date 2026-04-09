/**
 * Coloring Page Generator — Ideogram API
 * Free tier: 25 images/day, no credit card needed.
 *
 * Setup:
 *   1. Go to ideogram.ai → sign up free
 *   2. Go to ideogram.ai/manage-api → copy your API key
 *   3. Run: IDEOGRAM_API_KEY=your_key node scripts/generate-images-ideogram.mjs
 *
 * Or target one category:
 *   IDEOGRAM_API_KEY=your_key node scripts/generate-images-ideogram.mjs --category=animal-mandalas
 *
 * Free quota: 25/day. Run once per day, all 133 images done in ~6 days.
 * Script auto-skips already-generated images.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/images/coloring");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Import page list from main script
import { ALL_PAGES } from "./generate-images.mjs";

const API_KEY = process.env.IDEOGRAM_API_KEY;
if (!API_KEY) {
  console.error("\n❌ Missing IDEOGRAM_API_KEY");
  console.error("   1. Sign up free at ideogram.ai");
  console.error("   2. Go to ideogram.ai/manage-api → copy key");
  console.error("   3. Run: IDEOGRAM_API_KEY=your_key node scripts/generate-images-ideogram.mjs\n");
  process.exit(1);
}

// Ideogram-optimised suffix for coloring pages
const IDEOGRAM_SUFFIX = "coloring book page illustration, clean black and white line art, bold thick outlines, no color, no shading, no gray, pure white background, suitable for printing and coloring";

const args = process.argv.slice(2);
const categoryFlag = args.find((a) => a.startsWith("--category="))?.split("=")[1];
const slugArg = args.find((a) => !a.startsWith("--"));

let pages = ALL_PAGES;
if (categoryFlag) pages = ALL_PAGES.filter((p) => p.category === categoryFlag);
else if (slugArg) pages = ALL_PAGES.filter((p) => p.slug === slugArg);

const toGen = pages.filter((p) => !fs.existsSync(path.join(OUTPUT_DIR, `${p.slug}.png`)));
const already = pages.length - toGen.length;

console.log(`\n🎨 Ideogram Coloring Page Generator`);
console.log(`   Selected:     ${pages.length} pages`);
console.log(`   Already done: ${already}`);
console.log(`   To generate:  ${toGen.length}`);
console.log(`   Free quota:   25/day\n`);

if (toGen.length === 0) { console.log("✅ All done!\n"); process.exit(0); }

async function generate(page) {
  const out = path.join(OUTPUT_DIR, `${page.slug}.png`);
  process.stdout.write(`  [${page.category}] ${page.slug}... `);

  // Strip the Gemini-style suffix and use Ideogram-optimised one
  const basePrompt = page.prompt
    .replace(/Coloring book page,.*$/i, "")
    .replace(/\. \w.*quality\.$/, "")
    .trim();
  const prompt = `${basePrompt}. ${IDEOGRAM_SUFFIX}`;

  try {
    const res = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: {
        "Api-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_request: {
          prompt,
          aspect_ratio: "ASPECT_1_1",
          model: "V_2",
          magic_prompt_option: "OFF",
          style_type: "ILLUSTRATION",
          color_palette: { preset: "NOIR" },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      if (res.status === 429) {
        console.log(`⚠️  Daily limit reached (25/day). Run again tomorrow.`);
        process.exit(0);
      }
      console.log(`❌ ${res.status} ${err.slice(0, 60)}`);
      return false;
    }

    const data = await res.json();
    const url = data.data?.[0]?.url;
    if (!url) { console.log(`❌ No URL in response`); return false; }

    // Download the image
    const imgRes = await fetch(url);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(out, buffer);
    console.log(`✅`);
    return true;
  } catch (e) {
    console.log(`❌ ${e.message?.slice(0, 60)}`);
    return false;
  }
}

let done = 0, failed = 0;
for (let i = 0; i < toGen.length; i++) {
  if (i > 0) await new Promise((r) => setTimeout(r, 3000));
  const ok = await generate(toGen[i]);
  ok ? done++ : failed++;
}

console.log(`\n✅ Generated: ${done}  ❌ Failed: ${failed}`);
console.log(`\nRun tomorrow to continue (script skips already-done images):`);
console.log(`  IDEOGRAM_API_KEY=your_key node scripts/generate-images-ideogram.mjs\n`);
