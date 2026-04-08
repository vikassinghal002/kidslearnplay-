/**
 * Research-Backed Coloring Page Generator
 * 500-page plan based on competitor analysis of SuperColoring, ColoringNation,
 * Etsy bestsellers, Amazon KDP top 50, and Teachers Pay Teachers.
 *
 * PRIORITY ORDER (based on what competitors charge for):
 *   1. animal-mandalas    → Etsy #1 paid niche ($4–12/bundle)
 *   2. floral-mandalas    → Etsy #2 paid niche
 *   3. bold-easy          → Amazon #1 format (Coco Wyo - 20 of top 50)
 *   4. cozy-animals       → Amazon cozy/cute aesthetic (underserved free)
 *   5. fantasy            → Jade Summer's Amazon territory
 *   6. low-comp           → Cottagecore, zodiac, dark academia, witchy, dog breeds
 *   7. characters         → Bluey, Demon Slayer, Stitch, Pokemon etc.
 *   8. animals            → SuperColoring's biggest category (19,959 pages)
 *   9. holidays           → Seasonal traffic spikes
 *  10. educational        → TPT Color by Number format
 *
 * Usage:
 *   GEMINI_API_KEY=key node scripts/generate-images.mjs                    all pages
 *   GEMINI_API_KEY=key node scripts/generate-images.mjs --category=animal-mandalas
 *   GEMINI_API_KEY=key node scripts/generate-images.mjs lion-mandala
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "../public/images/coloring");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const S = "Coloring book page, black and white line art only, bold thick outlines, NO color fills, NO shading, NO gray tones, clean white background, printable quality.";

// ─── TIER 1: ANIMAL MANDALAS ─────────────────────────────────────────────────
// Etsy's #1 paid niche. Bundles of 100 pages sell for $4–12.
// coloringbliss.com charges $60/yr for this. We offer FREE.
const ANIMAL_MANDALAS = [
  { slug: "lion-mandala", category: "animal-mandalas", prompt: `A majestic lion face mandala — the lion's mane transforms into intricate mandala petals and geometric patterns radiating outward, detailed adult coloring page. ${S}` },
  { slug: "elephant-mandala", category: "animal-mandalas", prompt: `An elephant silhouette filled with ornate mandala patterns — floral designs, geometric shapes, and swirls within the elephant body outline, detailed adult coloring page. ${S}` },
  { slug: "owl-mandala", category: "animal-mandalas", prompt: `An owl with wings spread, each feather containing detailed mandala patterns, intricate zentangle designs filling the body, adult coloring page. ${S}` },
  { slug: "wolf-mandala", category: "animal-mandalas", prompt: `A wolf howling at the moon, the wolf's silhouette filled with intricate mandala and geometric patterns, detailed adult coloring page. ${S}` },
  { slug: "butterfly-mandala", category: "animal-mandalas", prompt: `A butterfly with wings designed as two detailed mandalas — intricate floral and geometric patterns in each wing, symmetrical adult coloring page. ${S}` },
  { slug: "horse-mandala", category: "animal-mandalas", prompt: `A horse head mandala — the mane flows into ornate mandala patterns, intricate floral designs radiate from the horse portrait, adult coloring page. ${S}` },
  { slug: "fox-mandala", category: "animal-mandalas", prompt: `A fox face mandala — the fox's fluffy tail curves around into a mandala pattern, intricate geometric fills, adult coloring page. ${S}` },
  { slug: "cat-mandala", category: "animal-mandalas", prompt: `A cat sitting in lotus pose surrounded by a detailed circular mandala, intricate patterns inside the cat silhouette, adult coloring page. ${S}` },
  { slug: "dolphin-mandala", category: "animal-mandalas", prompt: `Two dolphins leaping in a circular mandala composition, ocean wave patterns and intricate geometric designs, adult coloring page. ${S}` },
  { slug: "peacock-mandala", category: "animal-mandalas", prompt: `A peacock with tail feathers fanning into an elaborate mandala pattern — each feather eye a small detailed mandala, adult coloring page. ${S}` },
  { slug: "dragon-mandala", category: "animal-mandalas", prompt: `A dragon coiled into a circular mandala shape, scales filled with intricate patterns, flames becoming ornate floral designs, adult coloring page. ${S}` },
  { slug: "hummingbird-mandala", category: "animal-mandalas", prompt: `A hummingbird at the center of a floral mandala, intricate flower patterns radiating outward, delicate detailed adult coloring page. ${S}` },
  { slug: "bear-mandala", category: "animal-mandalas", prompt: `A bear face mandala with ornate patterned fur, forest and nature motifs forming the mandala petals around it, adult coloring page. ${S}` },
  { slug: "turtle-mandala", category: "animal-mandalas", prompt: `A sea turtle with shell designed as an intricate mandala pattern, geometric and floral fills throughout, adult coloring page. ${S}` },
  { slug: "deer-mandala", category: "animal-mandalas", prompt: `A deer with antlers that branch into an elaborate mandala tree pattern, floral and leaf motifs filling the design, adult coloring page. ${S}` },
];

// ─── TIER 2: FLORAL / BOTANICAL MANDALAS ─────────────────────────────────────
// Etsy's #2 paid niche. 30-page bundles sell for $3–5 each.
const FLORAL_MANDALAS = [
  { slug: "rose-mandala", category: "floral-mandalas", prompt: `A rose mandala — a large detailed rose at the center with rose petals and leaves forming concentric mandala rings, adult coloring page. ${S}` },
  { slug: "lotus-mandala", category: "floral-mandalas", prompt: `A lotus flower mandala with multiple layers of petals, intricate details within each petal, symmetrical concentric rings, adult coloring page. ${S}` },
  { slug: "sunflower-mandala", category: "floral-mandalas", prompt: `A sunflower mandala — detailed sunflower at center with petals transforming into geometric mandala patterns radiating outward, adult coloring page. ${S}` },
  { slug: "dahlia-mandala", category: "floral-mandalas", prompt: `An elaborate dahlia flower mandala with layer upon layer of pointed petals in complex geometric arrangements, adult coloring page. ${S}` },
  { slug: "peony-mandala", category: "floral-mandalas", prompt: `A peony blossom mandala with full ruffled petals forming concentric mandala rings, intricate leaf patterns surrounding, adult coloring page. ${S}` },
  { slug: "wildflower-mandala", category: "floral-mandalas", prompt: `A wildflower mandala featuring daisies, lavender, poppies and herbs arranged in circular mandala composition, adult coloring page. ${S}` },
  { slug: "botanical-coloring-pages", category: "floral-mandalas", prompt: `A full-page botanical illustration with roses, ferns, leaves and detailed flowers in botanical art style, adult coloring page. ${S}` },
  { slug: "floral-coloring-pages", category: "floral-mandalas", prompt: `A lush arrangement of peonies, dahlias, roses and decorative leaves filling the page, detailed floral adult coloring page. ${S}` },
  { slug: "art-nouveau-flowers", category: "floral-mandalas", prompt: `An Art Nouveau style design with flowing organic lily and iris flowers, decorative border frames, swirling stems, adult coloring page. ${S}` },
  { slug: "garden-coloring-pages", category: "floral-mandalas", prompt: `A detailed garden scene viewed from above — flower beds, a stone path, butterfly, bee, bird bath, adult coloring page. ${S}` },
];

// ─── TIER 3: BOLD & EASY / STRESS RELIEF ─────────────────────────────────────
// Amazon's #1 format. Coco Wyo holds 20 of top 50 Amazon bestsellers with this.
// "Bold and Easy" framing = $7.99–9.99 books with thousands of reviews.
const BOLD_EASY = [
  { slug: "stress-relief-coloring-pages", category: "bold-easy", prompt: `A simple bold stress relief coloring page featuring large flowers, leaves and simple swirl patterns — thick outlines, simple large shapes for easy relaxing coloring, adult coloring page. ${S}` },
  { slug: "easy-mandala-coloring-pages", category: "bold-easy", prompt: `A simple bold mandala with large easy-to-color sections, thick outlines, not too detailed — designed for relaxation and beginners, adult coloring page. ${S}` },
  { slug: "mindfulness-colouring", category: "bold-easy", prompt: `A mindfulness coloring page with large simple shapes — the word BREATHE in decorative letters surrounded by simple flowers and leaves, adult coloring page. ${S}` },
  { slug: "large-print-coloring-pages", category: "bold-easy", prompt: `A large print coloring page with very thick outlines, simple large flowers and leaves, easy shapes for seniors or beginners to color, adult coloring page. ${S}` },
  { slug: "simple-flower-coloring-pages", category: "bold-easy", prompt: `Large simple flowers with thick bold outlines — sunflowers, daisies and tulips with big easy sections to color, relaxing adult coloring page. ${S}` },
  { slug: "easy-animal-coloring-pages", category: "bold-easy", prompt: `Simple bold cute animals — a cat, dog, and bird with thick outlines and large easy sections to color, suitable for beginners and stress relief. ${S}` },
  { slug: "adult-coloring-pages", category: "bold-easy", prompt: `A simple bold adult coloring page with a large decorative butterfly, simple swirls and flower patterns, thick outlines, relaxing to color. ${S}` },
  { slug: "calming-coloring-pages", category: "bold-easy", prompt: `A calming ocean scene with gentle waves, a lighthouse, seagulls and simple shells — bold outlines, easy to color, adult coloring page. ${S}` },
  { slug: "nature-coloring-pages", category: "bold-easy", prompt: `A simple peaceful nature scene — rolling hills, a tree, sun, clouds and birds — bold thick outlines, easy relaxing adult coloring page. ${S}` },
  { slug: "zen-coloring-pages", category: "bold-easy", prompt: `A zen garden coloring page with large simple sand ripple patterns, a stone, bamboo leaves — bold outlines, minimal detail, calming adult coloring page. ${S}` },
];

// ─── TIER 4: COZY / CUTE ANIMALS ─────────────────────────────────────────────
// Coco Wyo's winning Amazon formula. "Cozy Friends", "Girl Moments".
// Barely any FREE website covers this aesthetic.
const COZY_ANIMALS = [
  { slug: "cozy-cat-coloring-pages", category: "cozy-animals", prompt: `A cozy cat curled up in a cute armchair with a cup of tea and books — kawaii cute style, simple charming adult coloring page. ${S}` },
  { slug: "cozy-fox-coloring-pages", category: "cozy-animals", prompt: `A cute fox in a cozy autumn scene — wearing a scarf, holding a warm drink, surrounded by fall leaves and mushrooms, kawaii adult coloring page. ${S}` },
  { slug: "cozy-bear-coloring-pages", category: "cozy-animals", prompt: `An adorable bear in a cozy kitchen scene baking cookies — apron, oven mitts, cookies on a tray, cute daily life adult coloring page. ${S}` },
  { slug: "cozy-bunny-coloring-pages", category: "cozy-animals", prompt: `A cute bunny having a tea party in a flower garden — tiny teacups, cakes, flowers everywhere, cozy kawaii adult coloring page. ${S}` },
  { slug: "cozy-hedgehog-coloring-pages", category: "cozy-animals", prompt: `An adorable hedgehog in a cozy cottage reading a book by a fireplace, mushrooms and flowers around it, kawaii adult coloring page. ${S}` },
  { slug: "kawaii-coloring-pages", category: "cozy-animals", prompt: `A page of kawaii cute food characters — a smiling strawberry, happy ramen bowl, cute sushi, adorable bubble tea — simple kawaii coloring page. ${S}` },
  { slug: "cute-animal-coloring-pages", category: "cozy-animals", prompt: `Four cute animals doing cozy activities — a cat reading, a fox painting, a bear cooking, a bunny gardening — simple charming coloring page. ${S}` },
  { slug: "cottagecore-coloring-pages", category: "cozy-animals", prompt: `A cottagecore scene with a small cottage, garden, mushrooms, wildflowers, a cat, butterfly and bee — whimsical cozy adult coloring page. ${S}` },
];

// ─── TIER 5: FANTASY ─────────────────────────────────────────────────────────
// Jade Summer's Amazon territory — fairies, mermaids, unicorns, dragons.
// Each Jade Summer title has 10,000+ five-star reviews at $7.99.
const FANTASY = [
  { slug: "fairy-coloring-pages", category: "fantasy", prompt: `A beautiful fairy with large detailed wings sitting on a mushroom in an enchanted forest, flowers and fireflies around her, detailed adult coloring page. ${S}` },
  { slug: "mermaid-coloring-pages", category: "fantasy", prompt: `A beautiful mermaid with flowing hair and an elaborate scaled tail sitting on a rock, ocean waves and fish around her, detailed adult coloring page. ${S}` },
  { slug: "unicorn-coloring-pages", category: "fantasy", prompt: `A majestic unicorn with flowing mane, a spiral horn and stars around it, detailed and beautiful, adult coloring page. ${S}` },
  { slug: "dragon-coloring-pages", category: "fantasy", prompt: `A detailed dragon with large wings spread, intricate scale patterns, perched on a mountain peak, adult coloring page. ${S}` },
  { slug: "fantasy-forest-coloring-pages", category: "fantasy", prompt: `An enchanted fantasy forest scene with giant mushrooms, fairy doors in tree trunks, glowing flowers and small fairies, detailed adult coloring page. ${S}` },
  { slug: "phoenix-coloring-pages", category: "fantasy", prompt: `A majestic phoenix bird with elaborate feathers and wings spread wide, intricate feather patterns, adult coloring page. ${S}` },
  { slug: "witch-coloring-pages", category: "fantasy", prompt: `A beautiful witch in flowing robes with a cat, cauldron, crystal ball, moon and stars around her, detailed adult coloring page. ${S}` },
  { slug: "magical-castle-coloring-pages", category: "fantasy", prompt: `A fairy tale castle with towers, a drawbridge, surrounded by a moat, flowers and trees, beautiful detailed adult coloring page. ${S}` },
  { slug: "forest-fairy-coloring-pages", category: "fantasy", prompt: `A detailed fairy with dragonfly wings, flower crown, sitting among giant flowers and leaves, ethereal adult coloring page. ${S}` },
  { slug: "celestial-coloring-pages", category: "fantasy", prompt: `A celestial design with the moon, sun, stars and planets arranged in an ornate circular pattern, moon phases, adult coloring page. ${S}` },
];

// ─── TIER 6: LOW COMPETITION NICHES ──────────────────────────────────────────
// Research shows these have under 200–400 competitors but strong demand.
// These can rank fast because major free sites don't cover them.
const LOW_COMP = [
  // Zodiac Mandalas (12 signs = 12 URLs, only ~200 competitors each)
  { slug: "aries-mandala", category: "zodiac", prompt: `An Aries zodiac ram mandala — a bold ram head at center with intricate mandala patterns radiating outward, stars and constellation dots, adult coloring page. ${S}` },
  { slug: "taurus-mandala", category: "zodiac", prompt: `A Taurus zodiac bull mandala — elegant bull at center with floral and geometric mandala patterns, adult coloring page. ${S}` },
  { slug: "gemini-mandala", category: "zodiac", prompt: `A Gemini zodiac twins mandala — two figures mirrored in a circular mandala composition with stars and patterns, adult coloring page. ${S}` },
  { slug: "cancer-mandala", category: "zodiac", prompt: `A Cancer zodiac crab mandala — detailed crab at center with ocean wave mandala patterns radiating outward, adult coloring page. ${S}` },
  { slug: "leo-mandala", category: "zodiac", prompt: `A Leo zodiac lion mandala — majestic lion face with mane becoming elaborate mandala petals, sun motifs, adult coloring page. ${S}` },
  { slug: "virgo-mandala", category: "zodiac", prompt: `A Virgo zodiac mandala — a woman figure surrounded by wheat, flowers and detailed geometric mandala patterns, adult coloring page. ${S}` },
  { slug: "libra-mandala", category: "zodiac", prompt: `A Libra zodiac scales mandala — ornate scales of justice at center with balance motifs and intricate patterns, adult coloring page. ${S}` },
  { slug: "scorpio-mandala", category: "zodiac", prompt: `A Scorpio zodiac scorpion mandala — detailed scorpion at center with dark intricate patterns radiating outward, adult coloring page. ${S}` },
  { slug: "sagittarius-mandala", category: "zodiac", prompt: `A Sagittarius zodiac centaur archer mandala — archer figure with bow, stars and arrow patterns in circular design, adult coloring page. ${S}` },
  { slug: "capricorn-mandala", category: "zodiac", prompt: `A Capricorn zodiac sea-goat mandala — half goat half fish figure with mountain and ocean mandala patterns, adult coloring page. ${S}` },
  { slug: "aquarius-mandala", category: "zodiac", prompt: `An Aquarius zodiac water bearer mandala — flowing water patterns and wave mandalas, star and air motifs, adult coloring page. ${S}` },
  { slug: "pisces-mandala", category: "zodiac", prompt: `A Pisces zodiac fish mandala — two fish swimming in a circular yin-yang mandala with ocean patterns, adult coloring page. ${S}` },
  // Dog Breeds (150–400 competitors per breed, passionate buyers)
  { slug: "golden-retriever-coloring-page", category: "dog-breeds", prompt: `A realistic and cute Golden Retriever dog portrait with detailed fur texture, sitting happily, dog coloring page. ${S}` },
  { slug: "french-bulldog-coloring-page", category: "dog-breeds", prompt: `An adorable French Bulldog with bat ears, wrinkled face, sitting cutely, detailed dog portrait coloring page. ${S}` },
  { slug: "corgi-coloring-page", category: "dog-breeds", prompt: `A fluffy Corgi with its signature large ears and short legs, happy expression, detailed dog portrait coloring page. ${S}` },
  { slug: "labrador-coloring-page", category: "dog-breeds", prompt: `A friendly Labrador retriever sitting and smiling with a ball, detailed fur, dog portrait coloring page. ${S}` },
  { slug: "husky-coloring-page", category: "dog-breeds", prompt: `A striking Siberian Husky with beautiful eyes and thick coat, wolf-like features, detailed dog portrait coloring page. ${S}` },
  { slug: "dachshund-coloring-page", category: "dog-breeds", prompt: `An adorable Dachshund with its characteristic long body and short legs, floppy ears, cute dog portrait coloring page. ${S}` },
  { slug: "poodle-coloring-page", category: "dog-breeds", prompt: `An elegant Poodle with fluffy curly coat, proud posture, detailed fur texture dog portrait coloring page. ${S}` },
  { slug: "german-shepherd-coloring-page", category: "dog-breeds", prompt: `A noble German Shepherd in alert standing pose, detailed fur pattern, dog portrait coloring page. ${S}` },
  // Dark Academia / Gothic (under 50 competitors — essentially unclaimed)
  { slug: "dark-academia-coloring-pages", category: "dark-academia", prompt: `A dark academia aesthetic coloring page — gothic library with tall bookshelves, an antique globe, candles, skulls, and ivy-covered windows, detailed adult coloring page. ${S}` },
  { slug: "gothic-architecture-coloring-pages", category: "dark-academia", prompt: `A stunning Gothic cathedral with pointed arches, rose window, flying buttresses and intricate stone carvings, detailed architectural adult coloring page. ${S}` },
  { slug: "moon-and-stars-coloring-pages", category: "dark-academia", prompt: `A mystical moon and stars coloring page — a large crescent moon face with intricate patterns, surrounded by different moon phases, constellations and detailed stars, adult coloring page. ${S}` },
  { slug: "crystal-ball-coloring-pages", category: "dark-academia", prompt: `A mystical still life with a crystal ball, tarot cards, moon, candles, crystals and celestial maps, intricate dark aesthetic adult coloring page. ${S}` },
  // Cottagecore (under 200 competitors, Gen Z/Millennial driven)
  { slug: "mushroom-coloring-pages", category: "cottagecore", prompt: `An enchanting cottagecore mushroom scene — giant toadstools with fairy doors, snails, moss, wildflowers and small woodland animals, adult coloring page. ${S}` },
  { slug: "cottage-coloring-pages", category: "cottagecore", prompt: `A cozy English cottage with a thatched roof, rambling roses, a vegetable garden, picket fence and cat at the door, charming adult coloring page. ${S}` },
  { slug: "fairy-garden-coloring-pages", category: "cottagecore", prompt: `A magical fairy garden with miniature furniture, tiny doors, toadstools, flowers and hidden fairies, whimsical adult coloring page. ${S}` },
];

// ─── TIER 7: TRENDING CHARACTERS 2025 ────────────────────────────────────────
// Based on ColoringNation's most-visited sections + 2025 movie/show releases
const CHARACTERS = [
  { slug: "bluey-coloring-pages", category: "characters", prompt: `Bluey the blue heeler puppy cartoon character from the Australian TV show, standing happily with big eyes, simple kids coloring page. ${S}` },
  { slug: "bluey-and-bingo", category: "characters", prompt: `Bluey and Bingo the cartoon puppy sisters playing together, simple cute style kids coloring page. ${S}` },
  { slug: "stitch-coloring-pages", category: "characters", prompt: `Stitch from Lilo and Stitch — the cute blue alien with large ears and big eyes, simple kids coloring page. ${S}` },
  { slug: "stitch-and-lilo", category: "characters", prompt: `Stitch and Lilo together, Stitch hugging Lilo, simple sweet kids coloring page. ${S}` },
  { slug: "demon-slayer-coloring-pages", category: "characters", prompt: `Tanjiro Kamado from Demon Slayer anime in his distinctive checkered haori with his sword, action pose, anime coloring page. ${S}` },
  { slug: "nezuko-coloring-page", category: "characters", prompt: `Nezuko Kamado from Demon Slayer in her kimono, bamboo muzzle, cute expression, anime coloring page. ${S}` },
  { slug: "pokemon-coloring-pages", category: "characters", prompt: `Pikachu the electric mouse Pokemon standing with lightning bolt tail, happy expression, kids coloring page. ${S}` },
  { slug: "charizard-coloring-page", category: "characters", prompt: `Charizard the fire dragon Pokemon flying with wings spread, flames from tail, bold kids coloring page. ${S}` },
  { slug: "eevee-coloring-page", category: "characters", prompt: `Eevee the fluffy evolution Pokemon with large bushy tail and collar fur, cute expression, kids coloring page. ${S}` },
  { slug: "minecraft-coloring-pages", category: "characters", prompt: `Minecraft Steve holding a pickaxe with a grass block, blocky pixel art style, kids coloring page. ${S}` },
  { slug: "minecraft-creeper", category: "characters", prompt: `A Minecraft Creeper with its iconic pixelated square face in blocky style, kids coloring page. ${S}` },
  { slug: "peppa-pig-coloring-pages", category: "characters", prompt: `Peppa Pig in her dress jumping in a muddy puddle, simple round cartoon style, kids coloring page. ${S}` },
  { slug: "paw-patrol-coloring-pages", category: "characters", prompt: `Chase the police dog PAW Patrol puppy in his hat and uniform, simple cute kids coloring page. ${S}` },
  { slug: "hello-kitty-coloring-pages", category: "characters", prompt: `Hello Kitty with her signature red bow, simple round face with no mouth, holding a flower, kids coloring page. ${S}` },
  { slug: "spongebob-coloring-pages", category: "characters", prompt: `SpongeBob SquarePants with his big smile, square pants, and spatula, simple fun kids coloring page. ${S}` },
  { slug: "inside-out-coloring-pages", category: "characters", prompt: `Joy and Anxiety from Inside Out 2 — two emotion characters side by side, simple cartoon style kids coloring page. ${S}` },
  { slug: "gabbys-dollhouse-coloring-pages", category: "characters", prompt: `Gabby from Gabby's Dollhouse with her cat ears headband and Pandy Paws her stuffed cat, simple kids coloring page. ${S}` },
  { slug: "disney-princess-coloring-pages", category: "characters", prompt: `Moana in her traditional Polynesian outfit with a wave behind her, simple kids coloring page. ${S}` },
  { slug: "my-little-pony-coloring-pages", category: "characters", prompt: `A My Little Pony unicorn with flowing rainbow mane and tail, stars around it, kids coloring page. ${S}` },
];

// ─── TIER 8: ANIMALS ─────────────────────────────────────────────────────────
// SuperColoring's #1 category with 19,959 pages. Per-species pages rank well.
const ANIMALS = [
  { slug: "cat-coloring-pages", category: "animals", prompt: `A cute sitting cat with pointy ears, long whiskers and curled tail, simple kids coloring page. ${S}` },
  { slug: "dog-coloring-pages", category: "animals", prompt: `A happy dog with floppy ears and wagging tail sitting and smiling, simple kids coloring page. ${S}` },
  { slug: "horse-coloring-pages", category: "animals", prompt: `A beautiful horse standing majestically with flowing mane and tail, simple kids coloring page. ${S}` },
  { slug: "dinosaur-coloring-pages", category: "animals", prompt: `A friendly T-Rex dinosaur standing upright with a big smile, simple cute kids coloring page. ${S}` },
  { slug: "elephant-coloring-pages", category: "animals", prompt: `A cute cartoon elephant with big ears and a curled trunk, simple kids coloring page. ${S}` },
  { slug: "lion-coloring-pages", category: "animals", prompt: `A cartoon lion with a big fluffy mane sitting proudly, simple kids coloring page. ${S}` },
  { slug: "tiger-coloring-pages", category: "animals", prompt: `A friendly cartoon tiger with stripes and a big smile, simple kids coloring page. ${S}` },
  { slug: "giraffe-coloring-pages", category: "animals", prompt: `A tall cartoon giraffe with patches eating leaves from a tree, simple kids coloring page. ${S}` },
  { slug: "panda-coloring-pages", category: "animals", prompt: `A cute cartoon panda sitting and eating bamboo, simple kids coloring page. ${S}` },
  { slug: "penguin-coloring-pages", category: "animals", prompt: `A cute penguin family on an iceberg, adult and baby penguins, simple kids coloring page. ${S}` },
  { slug: "owl-coloring-pages", category: "animals", prompt: `A cute cartoon owl perched on a branch at night with big round eyes, simple kids coloring page. ${S}` },
  { slug: "rabbit-coloring-pages", category: "animals", prompt: `A cute bunny rabbit with long ears holding a carrot, simple kids coloring page. ${S}` },
  { slug: "fox-coloring-pages", category: "animals", prompt: `A cute cartoon fox with a bushy tail sitting in autumn leaves, simple kids coloring page. ${S}` },
  { slug: "butterfly-coloring-pages", category: "animals", prompt: `A beautiful butterfly with large patterned wings, symmetrical design, simple kids coloring page. ${S}` },
  { slug: "fish-coloring-pages", category: "animals", prompt: `A happy fish with decorative scales and fins with bubbles, simple kids coloring page. ${S}` },
  { slug: "shark-coloring-pages", category: "animals", prompt: `A friendly cartoon shark with a big smile and dorsal fin, simple kids coloring page. ${S}` },
  { slug: "dolphin-coloring-pages", category: "animals", prompt: `A playful cartoon dolphin jumping out of ocean waves, simple kids coloring page. ${S}` },
  { slug: "turtle-coloring-pages", category: "animals", prompt: `A cute cartoon sea turtle swimming with a patterned shell, simple kids coloring page. ${S}` },
  { slug: "frog-coloring-pages", category: "animals", prompt: `A cute cartoon frog sitting on a lily pad in a pond, simple kids coloring page. ${S}` },
  { slug: "farm-animals-coloring-pages", category: "animals", prompt: `A farmyard scene with a cow, pig, chicken and sheep in front of a red barn, simple kids coloring page. ${S}` },
  { slug: "bear-coloring-pages", category: "animals", prompt: `A friendly cartoon bear standing and waving, simple cute kids coloring page. ${S}` },
  { slug: "unicorn-coloring-pages", category: "animals", prompt: `A magical unicorn with a spiral horn, flowing mane and stars, simple kids coloring page. ${S}` },
  { slug: "triceratops-coloring-page", category: "animals", prompt: `A friendly Triceratops dinosaur with three horns and a neck frill, simple kids coloring page. ${S}` },
  { slug: "monkey-coloring-pages", category: "animals", prompt: `A playful cartoon monkey swinging from a vine in a jungle, simple kids coloring page. ${S}` },
  { slug: "bird-coloring-pages", category: "animals", prompt: `A cute cartoon bird perched on a flower branch singing, simple kids coloring page. ${S}` },
];

// ─── TIER 9: HOLIDAYS ────────────────────────────────────────────────────────
// Seasonal traffic spikes. Christmas peaks in December. Easter in April.
const HOLIDAYS = [
  { slug: "christmas-coloring-pages", category: "holidays", prompt: `A Christmas tree with ornaments, garland, star on top and wrapped presents below, detailed kids coloring page. ${S}` },
  { slug: "christmas-coloring-pictures", category: "holidays", prompt: `Santa Claus in his sleigh pulled by reindeer flying over snowy rooftops on Christmas night, kids coloring page. ${S}` },
  { slug: "santa-claus-coloring-pages", category: "holidays", prompt: `Santa Claus with his sack of toys, jolly expression, sitting by a fireplace with stockings, kids coloring page. ${S}` },
  { slug: "snowman-coloring-pages", category: "holidays", prompt: `A cheerful snowman with a carrot nose, scarf, top hat and stick arms, simple kids coloring page. ${S}` },
  { slug: "halloween-coloring-pages", category: "holidays", prompt: `A jack-o-lantern pumpkin with carved face, bats flying and full moon, fun kids coloring page. ${S}` },
  { slug: "halloween-witch-coloring-pages", category: "holidays", prompt: `A friendly witch on a broomstick with a black cat and stars, not scary, kids coloring page. ${S}` },
  { slug: "halloween-ghost-coloring-pages", category: "holidays", prompt: `Three friendly ghosts with a haunted house and bats, fun Halloween kids coloring page. ${S}` },
  { slug: "easter-coloring-pages", category: "holidays", prompt: `A large decorated Easter egg with flower patterns surrounded by spring flowers, detailed kids coloring page. ${S}` },
  { slug: "easter-bunny-coloring-pages", category: "holidays", prompt: `The Easter bunny carrying a basket of decorated Easter eggs, simple kids coloring page. ${S}` },
  { slug: "easter-egg-coloring-pages", category: "holidays", prompt: `Six Easter eggs each with unique decorative patterns — stripes, spots, flowers, kids coloring page. ${S}` },
  { slug: "valentines-day-coloring-pages", category: "holidays", prompt: `Two cute animals holding a large heart with flowers and love hearts around them, kids coloring page. ${S}` },
  { slug: "thanksgiving-coloring-pages", category: "holidays", prompt: `A cartoon turkey with a fan of colourful tail feathers in autumn leaves, simple kids coloring page. ${S}` },
  { slug: "diwali-coloring-pages", category: "holidays", prompt: `A Diwali celebration coloring page with diya lamps, rangoli pattern, fireworks and lotus flowers, kids coloring page. ${S}` },
  { slug: "spring-coloring-pages", category: "holidays", prompt: `A spring scene with a tree in bloom, tulips, butterflies, a robin and baby animals, simple kids coloring page. ${S}` },
];

// ─── TIER 10: EDUCATIONAL / COLOR BY NUMBER ──────────────────────────────────
// TPT's #1 format. Teachers buy these weekly. Color by Number integration
// drives return traffic and educational use.
const EDUCATIONAL = [
  { slug: "color-by-number-coloring-pages", category: "educational", prompt: `A color by number coloring page featuring a cute cartoon cat — the image divided into numbered sections, each number corresponding to a color, clear numbering, simple kids activity page. ${S}` },
  { slug: "alphabet-coloring-pages", category: "educational", prompt: `The letters A through F each illustrated as a large decorative letter with a matching object (A=apple, B=bear, C=cat), kids educational coloring page. ${S}` },
  { slug: "numbers-coloring-pages", category: "educational", prompt: `Numbers 1 through 10 each illustrated with matching objects (1 sun, 2 stars, 3 fish) cute style, kids educational coloring page. ${S}` },
  { slug: "solar-system-coloring-pages", category: "educational", prompt: `The solar system with the sun and all 8 planets in order each labeled with its name, kids educational coloring page. ${S}` },
  { slug: "ocean-coloring-pages", category: "educational", prompt: `An underwater ocean scene with a whale, octopus, clownfish, coral and seaweed, kids educational coloring page. ${S}` },
  { slug: "space-coloring-pages", category: "educational", prompt: `A space scene with a rocket ship, astronaut, planets, stars and the moon, kids educational coloring page. ${S}` },
  { slug: "shapes-coloring-pages", category: "educational", prompt: `Basic shapes (circle, square, triangle, star, heart, diamond) each as a cute smiling character, kids educational coloring page. ${S}` },
  { slug: "map-coloring-pages", category: "educational", prompt: `A simple world map outline with continents labeled, animals from each continent illustrated within, kids educational coloring page. ${S}` },
  { slug: "body-parts-coloring-page", category: "educational", prompt: `A simple cartoon child with labeled arrows pointing to body parts (head, arms, hands, legs, feet, eyes), kids educational coloring page. ${S}` },
  { slug: "food-coloring-pages", category: "educational", prompt: `A fruit and vegetable coloring page — apple, banana, orange, carrot, broccoli each labeled and illustrated simply, kids educational coloring page. ${S}` },
];

// ─── ALL PAGES ────────────────────────────────────────────────────────────────
export const ALL_PAGES = [
  ...ANIMAL_MANDALAS,
  ...FLORAL_MANDALAS,
  ...BOLD_EASY,
  ...COZY_ANIMALS,
  ...FANTASY,
  ...LOW_COMP,
  ...CHARACTERS,
  ...ANIMALS,
  ...HOLIDAYS,
  ...EDUCATIONAL,
];

// ─── GENERATOR ────────────────────────────────────────────────────────────────
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("\n❌ Missing GEMINI_API_KEY");
  console.error("   Get free key: https://aistudio.google.com/app/apikey");
  console.error("   Run: GEMINI_API_KEY=your_key node scripts/generate-images.mjs\n");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const args = process.argv.slice(2);
const categoryFlag = args.find((a) => a.startsWith("--category="))?.split("=")[1];
const slugArg = args.find((a) => !a.startsWith("--"));

let pages = ALL_PAGES;
if (categoryFlag) pages = ALL_PAGES.filter((p) => p.category === categoryFlag);
else if (slugArg) pages = ALL_PAGES.filter((p) => p.slug === slugArg);

if (pages.length === 0) {
  console.error(`❌ Nothing found. Categories: animal-mandalas, floral-mandalas, bold-easy, cozy-animals, fantasy, zodiac, dog-breeds, dark-academia, cottagecore, characters, animals, holidays, educational`);
  process.exit(1);
}

const toGen = pages.filter((p) => !fs.existsSync(path.join(OUTPUT_DIR, `${p.slug}.png`)));
const already = pages.length - toGen.length;

console.log(`\n🎨 Coloring Page Generator (Research-Backed)`);
console.log(`   Plan total:   ${ALL_PAGES.length} pages`);
console.log(`   Selected:     ${pages.length} pages`);
console.log(`   Already done: ${already}`);
console.log(`   To generate:  ${toGen.length}`);
console.log(`   Free quota:   1,500/day from Gemini\n`);

if (toGen.length === 0) { console.log("✅ All done!\n"); process.exit(0); }

async function generate(page, attempt = 1) {
  const out = path.join(OUTPUT_DIR, `${page.slug}.png`);
  if (attempt === 1) process.stdout.write(`  [${page.category}] ${page.slug}... `);

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: page.prompt }] }],
      config: { responseModalities: ["IMAGE", "TEXT"] },
    });
    const parts = res.candidates?.[0]?.content?.parts ?? [];
    const img = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
    if (!img?.inlineData?.data) {
      const txt = parts.find((p) => p.text)?.text?.slice(0, 60) ?? "no image";
      console.log(`❌ (${txt})`); return false;
    }
    fs.writeFileSync(out, Buffer.from(img.inlineData.data, "base64"));
    console.log(`✅`); return true;
  } catch (e) {
    const msg = e.message ?? "";
    if (msg.includes("429") && attempt <= 5) {
      // Exponential backoff: 15s, 30s, 60s, 120s, 240s
      const wait = 15000 * Math.pow(2, attempt - 1);
      process.stdout.write(`⏳ rate limit, waiting ${wait/1000}s... `);
      await new Promise((r) => setTimeout(r, wait));
      return generate(page, attempt + 1);
    }
    console.log(`❌ ${msg.slice(0, 60)}`); return false;
  }
}

// Daily quota: 2,000 images. RPM limit handled via exponential backoff in generate().
let done = 0, failed = 0;
for (let i = 0; i < toGen.length; i++) {
  if (i > 0) await new Promise((r) => setTimeout(r, 8000)); // 8s between requests to avoid RPM spikes
  const ok = await generate(toGen[i]);
  ok ? done++ : failed++;
}

console.log(`\n✅ Generated: ${done}  ❌ Failed: ${failed}`);
console.log(`\nRun by priority category:`);
console.log(`  --category=animal-mandalas   (Etsy #1 paid niche)`);
console.log(`  --category=floral-mandalas   (Etsy #2 paid niche)`);
console.log(`  --category=bold-easy         (Amazon #1 format)`);
console.log(`  --category=cozy-animals      (Coco Wyo style)`);
console.log(`  --category=fantasy           (Jade Summer style)`);
console.log(`  --category=zodiac            (12 signs, low competition)`);
console.log(`  --category=dog-breeds        (per breed, passionate buyers)`);
console.log(`  --category=dark-academia     (under 50 competitors!)`);
console.log(`  --category=characters        (trending 2025)`);
console.log(`  --category=animals           (high volume)`);
console.log(`  --category=holidays          (seasonal spikes)\n`);
