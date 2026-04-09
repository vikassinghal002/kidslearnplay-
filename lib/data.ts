// ─── Types ────────────────────────────────────────────────────────────────────

export type ColoringPage = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
};

export type ColoringCategory = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  icon: string;
  color: string;
  audience: "kids" | "adults" | "both";
  pages: ColoringPage[];
};

export type Game = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  component?: string;
  embedUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  ageRange: string;
};

export type Worksheet = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  grade: string;
  subject: string;
};

// ─── Coloring Categories ──────────────────────────────────────────────────────

export const coloringCategories: ColoringCategory[] = [

  // ── ADULT / PREMIUM (what competitors charge for) ──────────────────────────

  {
    slug: "animal-mandalas",
    title: "Animal Mandala Coloring Pages",
    description: "Free printable animal mandala coloring pages for adults. Intricate lion, wolf, owl, elephant and butterfly mandalas — what other sites charge $10/month for, we offer free.",
    keywords: "animal mandala coloring pages",
    icon: "🦁",
    color: "bg-amber-50",
    audience: "adults",
    pages: [
      { slug: "lion-mandala", title: "Lion Mandala Coloring Page", description: "A majestic lion face mandala with intricate petal patterns.", category: "animal-mandalas", tags: ["lion", "mandala", "adult", "printable"] },
      { slug: "elephant-mandala", title: "Elephant Mandala Coloring Page", description: "An elephant silhouette filled with ornate mandala patterns.", category: "animal-mandalas", tags: ["elephant", "mandala", "adult", "zentangle"] },
      { slug: "owl-mandala", title: "Owl Mandala Coloring Page", description: "An owl with wings spread, each feather containing mandala patterns.", category: "animal-mandalas", tags: ["owl", "mandala", "adult", "feathers"] },
      { slug: "wolf-mandala", title: "Wolf Mandala Coloring Page", description: "A wolf howling with its silhouette filled with intricate mandala patterns.", category: "animal-mandalas", tags: ["wolf", "mandala", "adult", "geometric"] },
      { slug: "butterfly-mandala", title: "Butterfly Mandala Coloring Page", description: "A butterfly with wings designed as two detailed mandalas.", category: "animal-mandalas", tags: ["butterfly", "mandala", "adult", "symmetrical"] },
      { slug: "horse-mandala", title: "Horse Mandala Coloring Page", description: "A horse head mandala with mane flowing into ornate patterns.", category: "animal-mandalas", tags: ["horse", "mandala", "adult", "floral"] },
      { slug: "fox-mandala", title: "Fox Mandala Coloring Page", description: "A fox face mandala with geometric fills and flowing patterns.", category: "animal-mandalas", tags: ["fox", "mandala", "adult", "geometric"] },
      { slug: "cat-mandala", title: "Cat Mandala Coloring Page", description: "A cat in lotus pose surrounded by a detailed circular mandala.", category: "animal-mandalas", tags: ["cat", "mandala", "adult", "zen"] },
      { slug: "dolphin-mandala", title: "Dolphin Mandala Coloring Page", description: "Two dolphins leaping in a circular mandala composition.", category: "animal-mandalas", tags: ["dolphin", "mandala", "adult", "ocean"] },
      { slug: "peacock-mandala", title: "Peacock Mandala Coloring Page", description: "A peacock with tail feathers fanning into an elaborate mandala.", category: "animal-mandalas", tags: ["peacock", "mandala", "adult", "feathers"] },
      { slug: "dragon-mandala", title: "Dragon Mandala Coloring Page", description: "A dragon coiled into a circular mandala with scale patterns.", category: "animal-mandalas", tags: ["dragon", "mandala", "adult", "fantasy"] },
      { slug: "hummingbird-mandala", title: "Hummingbird Mandala Coloring Page", description: "A hummingbird at the center of a floral mandala.", category: "animal-mandalas", tags: ["hummingbird", "mandala", "adult", "floral"] },
      { slug: "bear-mandala", title: "Bear Mandala Coloring Page", description: "A bear face mandala with ornate patterned fur and forest motifs.", category: "animal-mandalas", tags: ["bear", "mandala", "adult", "forest"] },
      { slug: "turtle-mandala", title: "Turtle Mandala Coloring Page", description: "A sea turtle with shell designed as an intricate mandala.", category: "animal-mandalas", tags: ["turtle", "mandala", "adult", "ocean"] },
      { slug: "deer-mandala", title: "Deer Mandala Coloring Page", description: "A deer with antlers branching into an elaborate mandala tree.", category: "animal-mandalas", tags: ["deer", "mandala", "adult", "nature"] },
    ],
  },

  {
    slug: "floral-mandalas",
    title: "Floral Mandala Coloring Pages",
    description: "Free printable floral and botanical mandala coloring pages for adults. Rose, lotus, dahlia and wildflower mandalas — premium quality, completely free.",
    keywords: "floral mandala coloring pages",
    icon: "🌸",
    color: "bg-pink-50",
    audience: "adults",
    pages: [
      { slug: "rose-mandala", title: "Rose Mandala Coloring Page", description: "A large detailed rose mandala with petals forming concentric rings.", category: "floral-mandalas", tags: ["rose", "mandala", "floral", "adult"] },
      { slug: "lotus-mandala", title: "Lotus Mandala Coloring Page", description: "A lotus flower mandala with multiple layers of petals.", category: "floral-mandalas", tags: ["lotus", "mandala", "zen", "adult"] },
      { slug: "sunflower-mandala", title: "Sunflower Mandala Coloring Page", description: "A sunflower mandala with petals transforming into geometric patterns.", category: "floral-mandalas", tags: ["sunflower", "mandala", "floral", "adult"] },
      { slug: "dahlia-mandala", title: "Dahlia Mandala Coloring Page", description: "An elaborate dahlia mandala with layers of pointed petals.", category: "floral-mandalas", tags: ["dahlia", "mandala", "floral", "adult"] },
      { slug: "peony-mandala", title: "Peony Mandala Coloring Page", description: "A peony blossom mandala with full ruffled petals.", category: "floral-mandalas", tags: ["peony", "mandala", "floral", "adult"] },
      { slug: "wildflower-mandala", title: "Wildflower Mandala Coloring Page", description: "Daisies, lavender, poppies and herbs in a circular mandala.", category: "floral-mandalas", tags: ["wildflower", "mandala", "botanical", "adult"] },
      { slug: "botanical-coloring-pages", title: "Botanical Coloring Pages", description: "Detailed botanical illustration with roses, ferns and flowers.", category: "floral-mandalas", tags: ["botanical", "floral", "adult", "printable"] },
      { slug: "floral-coloring-pages", title: "Floral Coloring Pages for Adults", description: "Lush peonies, dahlias and roses filling the page.", category: "floral-mandalas", tags: ["floral", "adult", "roses", "printable"] },
      { slug: "art-nouveau-flowers", title: "Art Nouveau Flower Coloring Page", description: "Art Nouveau style flowing lilies and decorative borders.", category: "floral-mandalas", tags: ["art nouveau", "floral", "adult", "vintage"] },
      { slug: "garden-coloring-pages", title: "Garden Coloring Pages", description: "A detailed garden scene with flower beds, stone path and butterfly.", category: "floral-mandalas", tags: ["garden", "floral", "adult", "nature"] },
    ],
  },

  {
    slug: "bold-easy",
    title: "Stress Relief Coloring Pages",
    description: "Free bold and easy stress relief coloring pages for adults and beginners. Large simple designs with thick outlines — relaxing, no frustration. The format that sells 15,000+ copies on Amazon, free here.",
    keywords: "stress relief coloring pages",
    icon: "😌",
    color: "bg-blue-50",
    audience: "adults",
    pages: [
      { slug: "stress-relief-coloring-pages", title: "Stress Relief Coloring Pages", description: "Simple bold flowers and swirls for easy relaxing coloring.", category: "bold-easy", tags: ["stress relief", "adult", "easy", "mindfulness"] },
      { slug: "easy-mandala-coloring-pages", title: "Easy Mandala Coloring Pages", description: "Simple bold mandala with large sections — perfect for beginners.", category: "bold-easy", tags: ["mandala", "easy", "beginner", "adult"] },
      { slug: "mindfulness-colouring", title: "Mindfulness Colouring Pages", description: "Mindfulness coloring page with BREATHE text and simple flowers.", category: "bold-easy", tags: ["mindfulness", "breathe", "adult", "zen"] },
      { slug: "large-print-coloring-pages", title: "Large Print Coloring Pages", description: "Very thick outlines and simple large shapes for seniors or beginners.", category: "bold-easy", tags: ["large print", "seniors", "easy", "adult"] },
      { slug: "simple-flower-coloring-pages", title: "Simple Flower Coloring Pages", description: "Large simple flowers with thick bold outlines — sunflowers and daisies.", category: "bold-easy", tags: ["flowers", "simple", "easy", "adult"] },
      { slug: "easy-animal-coloring-pages", title: "Easy Animal Coloring Pages", description: "Simple bold animals for beginners — cat, dog and bird.", category: "bold-easy", tags: ["animals", "easy", "simple", "adult"] },
      { slug: "adult-coloring-pages", title: "Adult Coloring Pages", description: "Simple bold butterfly with swirls and flower patterns.", category: "bold-easy", tags: ["adult", "butterfly", "simple", "relaxing"] },
      { slug: "calming-coloring-pages", title: "Calming Coloring Pages", description: "Peaceful ocean scene with lighthouse and gentle waves.", category: "bold-easy", tags: ["calming", "ocean", "adult", "easy"] },
      { slug: "nature-coloring-pages", title: "Nature Coloring Pages", description: "Simple peaceful hills, trees and clouds — bold thick outlines.", category: "bold-easy", tags: ["nature", "simple", "easy", "adult"] },
      { slug: "zen-coloring-pages", title: "Zen Coloring Pages", description: "Zen garden with sand ripples, stone and bamboo — calming adult coloring.", category: "bold-easy", tags: ["zen", "garden", "calm", "adult"] },
    ],
  },

  {
    slug: "cozy-animals",
    title: "Cozy Animal Coloring Pages",
    description: "Free cute and cozy animal coloring pages — kawaii foxes, cats, bears and bunnies in cozy daily life scenes. The style Amazon's #1 bestseller brand (Coco Wyo) sells for $7.99 a book, free here.",
    keywords: "cute animal coloring pages",
    icon: "🦊",
    color: "bg-orange-50",
    audience: "kids",
    pages: [
      { slug: "cozy-cat-coloring-pages", title: "Cozy Cat Coloring Pages", description: "A cat curled up in an armchair with tea and books — kawaii style.", category: "cozy-animals", tags: ["cat", "cozy", "kawaii", "cute"] },
      { slug: "cozy-fox-coloring-pages", title: "Cozy Fox Coloring Pages", description: "A cute fox in autumn wearing a scarf with fall leaves.", category: "cozy-animals", tags: ["fox", "cozy", "autumn", "cute"] },
      { slug: "cozy-bear-coloring-pages", title: "Cozy Bear Coloring Pages", description: "An adorable bear baking cookies in a cozy kitchen.", category: "cozy-animals", tags: ["bear", "cozy", "kitchen", "cute"] },
      { slug: "cozy-bunny-coloring-pages", title: "Cozy Bunny Coloring Pages", description: "A cute bunny having a tea party in a flower garden.", category: "cozy-animals", tags: ["bunny", "tea party", "cozy", "cute"] },
      { slug: "cozy-hedgehog-coloring-pages", title: "Cozy Hedgehog Coloring Pages", description: "An adorable hedgehog reading by a fireplace in a cottage.", category: "cozy-animals", tags: ["hedgehog", "cozy", "cottage", "cute"] },
      { slug: "kawaii-coloring-pages", title: "Kawaii Coloring Pages", description: "Kawaii food characters — strawberry, ramen, sushi and bubble tea.", category: "cozy-animals", tags: ["kawaii", "food", "cute", "japanese"] },
      { slug: "cute-animal-coloring-pages", title: "Cute Animal Coloring Pages", description: "Four cute animals doing cozy activities — reading, painting, cooking.", category: "cozy-animals", tags: ["cute", "animals", "cozy", "printable"] },
      { slug: "cottagecore-coloring-pages", title: "Cottagecore Coloring Pages", description: "A cottagecore scene with cottage, mushrooms, wildflowers and a cat.", category: "cozy-animals", tags: ["cottagecore", "cozy", "nature", "cottage"] },
    ],
  },

  {
    slug: "fantasy",
    title: "Fantasy Coloring Pages",
    description: "Free fantasy coloring pages — fairies, mermaids, unicorns, dragons and enchanted forests. Premium quality illustrations, completely free to print.",
    keywords: "fantasy coloring pages",
    icon: "🧚",
    color: "bg-purple-50",
    audience: "kids",
    pages: [
      { slug: "fairy-coloring-pages", title: "Fairy Coloring Pages", description: "A beautiful fairy with large wings in an enchanted forest.", category: "fantasy", tags: ["fairy", "fantasy", "enchanted", "adult"] },
      { slug: "mermaid-coloring-pages", title: "Mermaid Coloring Pages", description: "A beautiful mermaid with elaborate scaled tail on a rock.", category: "fantasy", tags: ["mermaid", "fantasy", "ocean", "adult"] },
      { slug: "unicorn-coloring-pages", title: "Unicorn Coloring Pages", description: "A majestic unicorn with flowing mane and spiral horn.", category: "fantasy", tags: ["unicorn", "fantasy", "magical", "kids"] },
      { slug: "dragon-coloring-pages", title: "Dragon Coloring Pages", description: "A detailed dragon with large wings perched on a mountain.", category: "fantasy", tags: ["dragon", "fantasy", "adult", "intricate"] },
      { slug: "fantasy-forest-coloring-pages", title: "Enchanted Forest Coloring Pages", description: "Giant mushrooms, fairy doors and glowing flowers.", category: "fantasy", tags: ["enchanted forest", "fairy", "fantasy", "adult"] },
      { slug: "phoenix-coloring-pages", title: "Phoenix Coloring Pages", description: "A majestic phoenix with elaborate feathers and wings spread.", category: "fantasy", tags: ["phoenix", "fantasy", "bird", "adult"] },
      { slug: "witch-coloring-pages", title: "Witch Coloring Pages", description: "A beautiful witch with a cat, cauldron and stars around her.", category: "fantasy", tags: ["witch", "fantasy", "halloween", "adult"] },
      { slug: "magical-castle-coloring-pages", title: "Magical Castle Coloring Pages", description: "A fairy tale castle with towers and surrounding gardens.", category: "fantasy", tags: ["castle", "fairy tale", "fantasy", "kids"] },
      { slug: "forest-fairy-coloring-pages", title: "Forest Fairy Coloring Pages", description: "A detailed fairy with dragonfly wings among giant flowers.", category: "fantasy", tags: ["fairy", "forest", "fantasy", "adult"] },
      { slug: "celestial-coloring-pages", title: "Celestial Coloring Pages", description: "Moon, sun, stars and planets in an ornate circular pattern.", category: "fantasy", tags: ["celestial", "moon", "stars", "adult"] },
    ],
  },

  // ── LOW COMPETITION NICHES ─────────────────────────────────────────────────

  {
    slug: "zodiac",
    title: "Zodiac Mandala Coloring Pages",
    description: "Free zodiac sign mandala coloring pages — all 12 signs as intricate mandalas. Aries, Taurus, Gemini and more. A niche with only ~200 competitors that we cover for free.",
    keywords: "zodiac coloring pages",
    icon: "♈",
    color: "bg-indigo-50",
    audience: "adults",
    pages: [
      { slug: "aries-mandala", title: "Aries Mandala Coloring Page", description: "Aries ram mandala with intricate geometric patterns and stars.", category: "zodiac", tags: ["aries", "zodiac", "mandala", "adult"] },
      { slug: "taurus-mandala", title: "Taurus Mandala Coloring Page", description: "Taurus bull mandala with floral and geometric patterns.", category: "zodiac", tags: ["taurus", "zodiac", "mandala", "adult"] },
      { slug: "gemini-mandala", title: "Gemini Mandala Coloring Page", description: "Gemini twins mandala in a circular composition with stars.", category: "zodiac", tags: ["gemini", "zodiac", "mandala", "adult"] },
      { slug: "cancer-mandala", title: "Cancer Mandala Coloring Page", description: "Cancer crab mandala with ocean wave patterns.", category: "zodiac", tags: ["cancer", "zodiac", "mandala", "adult"] },
      { slug: "leo-mandala", title: "Leo Mandala Coloring Page", description: "Leo lion mandala with mane becoming elaborate mandala petals.", category: "zodiac", tags: ["leo", "zodiac", "mandala", "lion"] },
      { slug: "virgo-mandala", title: "Virgo Mandala Coloring Page", description: "Virgo mandala with wheat, flowers and geometric patterns.", category: "zodiac", tags: ["virgo", "zodiac", "mandala", "adult"] },
      { slug: "libra-mandala", title: "Libra Mandala Coloring Page", description: "Libra scales mandala with balance motifs and intricate patterns.", category: "zodiac", tags: ["libra", "zodiac", "mandala", "adult"] },
      { slug: "scorpio-mandala", title: "Scorpio Mandala Coloring Page", description: "Scorpio mandala with dark intricate patterns radiating outward.", category: "zodiac", tags: ["scorpio", "zodiac", "mandala", "adult"] },
      { slug: "sagittarius-mandala", title: "Sagittarius Mandala Coloring Page", description: "Sagittarius archer mandala with stars and arrow patterns.", category: "zodiac", tags: ["sagittarius", "zodiac", "mandala", "adult"] },
      { slug: "capricorn-mandala", title: "Capricorn Mandala Coloring Page", description: "Capricorn sea-goat mandala with mountain and ocean patterns.", category: "zodiac", tags: ["capricorn", "zodiac", "mandala", "adult"] },
      { slug: "aquarius-mandala", title: "Aquarius Mandala Coloring Page", description: "Aquarius water bearer mandala with flowing wave patterns.", category: "zodiac", tags: ["aquarius", "zodiac", "mandala", "adult"] },
      { slug: "pisces-mandala", title: "Pisces Mandala Coloring Page", description: "Pisces fish mandala — two fish in a yin-yang ocean pattern.", category: "zodiac", tags: ["pisces", "zodiac", "mandala", "fish"] },
    ],
  },

  {
    slug: "dog-breeds",
    title: "Dog Breed Coloring Pages",
    description: "Free printable dog breed coloring pages — Golden Retriever, French Bulldog, Corgi, Husky, Labrador and more. One detailed portrait per breed, completely free to print.",
    keywords: "dog coloring pages",
    icon: "🐕",
    color: "bg-yellow-50",
    audience: "adults",
    pages: [
      { slug: "golden-retriever-coloring-page", title: "Golden Retriever Coloring Page", description: "A realistic cute Golden Retriever dog portrait.", category: "dog-breeds", tags: ["golden retriever", "dog", "portrait", "printable"] },
      { slug: "french-bulldog-coloring-page", title: "French Bulldog Coloring Page", description: "An adorable French Bulldog with bat ears and wrinkled face.", category: "dog-breeds", tags: ["french bulldog", "dog", "portrait", "printable"] },
      { slug: "corgi-coloring-page", title: "Corgi Coloring Page", description: "A fluffy Corgi with signature large ears and short legs.", category: "dog-breeds", tags: ["corgi", "dog", "portrait", "printable"] },
      { slug: "labrador-coloring-page", title: "Labrador Coloring Page", description: "A friendly Labrador retriever sitting with a ball.", category: "dog-breeds", tags: ["labrador", "dog", "portrait", "printable"] },
      { slug: "husky-coloring-page", title: "Husky Coloring Page", description: "A striking Siberian Husky with beautiful eyes and thick coat.", category: "dog-breeds", tags: ["husky", "dog", "portrait", "printable"] },
      { slug: "dachshund-coloring-page", title: "Dachshund Coloring Page", description: "An adorable Dachshund with its characteristic long body.", category: "dog-breeds", tags: ["dachshund", "sausage dog", "portrait", "printable"] },
      { slug: "poodle-coloring-page", title: "Poodle Coloring Page", description: "An elegant Poodle with fluffy curly coat and proud posture.", category: "dog-breeds", tags: ["poodle", "dog", "portrait", "printable"] },
      { slug: "german-shepherd-coloring-page", title: "German Shepherd Coloring Page", description: "A noble German Shepherd in alert standing pose.", category: "dog-breeds", tags: ["german shepherd", "dog", "portrait", "printable"] },
    ],
  },

  {
    slug: "dark-academia",
    title: "Dark Academia Coloring Pages",
    description: "Free dark academia and gothic aesthetic coloring pages — gothic libraries, celestial maps, crystal balls, moon phases. Under 50 competitors exist for this aesthetic.",
    keywords: "dark academia coloring pages",
    icon: "🌙",
    color: "bg-slate-100",
    audience: "adults",
    pages: [
      { slug: "dark-academia-coloring-pages", title: "Dark Academia Coloring Pages", description: "Gothic library with bookshelves, candles, skull and ivy windows.", category: "dark-academia", tags: ["dark academia", "gothic", "library", "adult"] },
      { slug: "gothic-architecture-coloring-pages", title: "Gothic Architecture Coloring Pages", description: "Stunning Gothic cathedral with rose window and flying buttresses.", category: "dark-academia", tags: ["gothic", "architecture", "cathedral", "adult"] },
      { slug: "moon-and-stars-coloring-pages", title: "Moon and Stars Coloring Pages", description: "Mystical crescent moon face with constellations and moon phases.", category: "dark-academia", tags: ["moon", "stars", "celestial", "adult"] },
      { slug: "crystal-ball-coloring-pages", title: "Crystal Ball Coloring Pages", description: "Mystical still life with crystal ball, tarot cards and candles.", category: "dark-academia", tags: ["crystal ball", "mystical", "tarot", "adult"] },
    ],
  },

  // ── KIDS CHARACTERS ────────────────────────────────────────────────────────

  {
    slug: "characters",
    title: "Character Coloring Pages",
    description: "Free printable character coloring pages — Bluey, Pokemon, Stitch, Minecraft, PAW Patrol, Peppa Pig, SpongeBob and more trending 2025 characters.",
    keywords: "character coloring pages",
    icon: "⭐",
    color: "bg-pink-100",
    audience: "kids",
    pages: [
      { slug: "bluey-coloring-pages", title: "Bluey Coloring Pages", description: "Bluey the blue heeler puppy from the Australian TV show.", category: "characters", tags: ["bluey", "cartoon", "kids", "printable"] },
      { slug: "bluey-and-bingo", title: "Bluey and Bingo Coloring Page", description: "Bluey and Bingo the cartoon puppy sisters playing together.", category: "characters", tags: ["bluey", "bingo", "cartoon", "kids"] },
      { slug: "stitch-coloring-pages", title: "Stitch Coloring Pages", description: "Stitch from Lilo and Stitch — the cute blue alien.", category: "characters", tags: ["stitch", "disney", "lilo", "kids"] },
      { slug: "stitch-and-lilo", title: "Stitch and Lilo Coloring Page", description: "Stitch and Lilo together, sweet kids coloring page.", category: "characters", tags: ["stitch", "lilo", "disney", "kids"] },
      { slug: "demon-slayer-coloring-pages", title: "Demon Slayer Coloring Pages", description: "Tanjiro Kamado from Demon Slayer in his checkered haori.", category: "characters", tags: ["demon slayer", "tanjiro", "anime", "manga"] },
      { slug: "nezuko-coloring-page", title: "Nezuko Coloring Page", description: "Nezuko Kamado from Demon Slayer in her kimono.", category: "characters", tags: ["nezuko", "demon slayer", "anime", "manga"] },
      { slug: "pokemon-coloring-pages", title: "Pokemon Coloring Pages", description: "Pikachu the electric mouse Pokemon standing happily.", category: "characters", tags: ["pikachu", "pokemon", "kids", "printable"] },
      { slug: "charizard-coloring-page", title: "Charizard Coloring Page", description: "Charizard the fire dragon Pokemon with wings spread.", category: "characters", tags: ["charizard", "pokemon", "dragon", "kids"] },
      { slug: "eevee-coloring-page", title: "Eevee Coloring Page", description: "Eevee the fluffy evolution Pokemon with bushy tail.", category: "characters", tags: ["eevee", "pokemon", "cute", "kids"] },
      { slug: "minecraft-coloring-pages", title: "Minecraft Coloring Pages", description: "Minecraft Steve with pickaxe and grass block, blocky pixel art.", category: "characters", tags: ["minecraft", "steve", "gaming", "kids"] },
      { slug: "minecraft-creeper", title: "Minecraft Creeper Coloring Page", description: "A Minecraft Creeper with iconic pixelated face.", category: "characters", tags: ["minecraft", "creeper", "gaming", "kids"] },
      { slug: "peppa-pig-coloring-pages", title: "Peppa Pig Coloring Pages", description: "Peppa Pig in her dress jumping in a muddy puddle.", category: "characters", tags: ["peppa pig", "cartoon", "toddler", "kids"] },
      { slug: "paw-patrol-coloring-pages", title: "PAW Patrol Coloring Pages", description: "Chase the police dog PAW Patrol puppy in his uniform.", category: "characters", tags: ["paw patrol", "chase", "kids", "printable"] },
      { slug: "hello-kitty-coloring-pages", title: "Hello Kitty Coloring Pages", description: "Hello Kitty with her signature red bow holding a flower.", category: "characters", tags: ["hello kitty", "sanrio", "kawaii", "kids"] },
      { slug: "spongebob-coloring-pages", title: "SpongeBob Coloring Pages", description: "SpongeBob SquarePants with his big smile and spatula.", category: "characters", tags: ["spongebob", "cartoon", "kids", "printable"] },
      { slug: "inside-out-coloring-pages", title: "Inside Out Coloring Pages", description: "Joy and Anxiety from Inside Out 2 — the emotion characters.", category: "characters", tags: ["inside out", "disney", "pixar", "kids"] },
      { slug: "gabbys-dollhouse-coloring-pages", title: "Gabby's Dollhouse Coloring Pages", description: "Gabby with her cat ears headband and Pandy Paws.", category: "characters", tags: ["gabby", "dollhouse", "netflix", "kids"] },
      { slug: "disney-princess-coloring-pages", title: "Disney Princess Coloring Pages", description: "Moana in her traditional Polynesian outfit with ocean waves.", category: "characters", tags: ["disney", "princess", "moana", "kids"] },
      { slug: "my-little-pony-coloring-pages", title: "My Little Pony Coloring Pages", description: "A My Little Pony unicorn with flowing rainbow mane.", category: "characters", tags: ["my little pony", "unicorn", "kids", "printable"] },
    ],
  },

  // ── ANIMALS ────────────────────────────────────────────────────────────────

  {
    slug: "animals",
    title: "Animal Coloring Pages",
    description: "Free printable animal coloring pages for kids — cats, dogs, horses, dinosaurs, elephants, lions and more. Simple fun designs for children of all ages.",
    keywords: "animal coloring pages",
    icon: "🦁",
    color: "bg-green-50",
    audience: "kids",
    pages: [
      { slug: "cat-coloring-pages", title: "Cat Coloring Pages", description: "A cute sitting cat with pointy ears and curled tail.", category: "animals", tags: ["cat", "kitten", "kids", "printable"] },
      { slug: "dog-coloring-pages", title: "Dog Coloring Pages", description: "A happy dog with floppy ears and wagging tail.", category: "animals", tags: ["dog", "puppy", "kids", "printable"] },
      { slug: "horse-coloring-pages", title: "Horse Coloring Pages", description: "A beautiful horse with flowing mane and tail.", category: "animals", tags: ["horse", "kids", "printable"] },
      { slug: "dinosaur-coloring-pages", title: "Dinosaur Coloring Pages", description: "A friendly T-Rex dinosaur with a big smile.", category: "animals", tags: ["dinosaur", "t-rex", "kids", "printable"] },
      { slug: "elephant-coloring-pages", title: "Elephant Coloring Pages", description: "A cute cartoon elephant with big ears and curled trunk.", category: "animals", tags: ["elephant", "kids", "printable"] },
      { slug: "lion-coloring-pages", title: "Lion Coloring Pages", description: "A cartoon lion with a big fluffy mane.", category: "animals", tags: ["lion", "jungle", "kids", "printable"] },
      { slug: "tiger-coloring-pages", title: "Tiger Coloring Pages", description: "A friendly cartoon tiger with stripes and big smile.", category: "animals", tags: ["tiger", "jungle", "kids", "printable"] },
      { slug: "giraffe-coloring-pages", title: "Giraffe Coloring Pages", description: "A tall cartoon giraffe eating leaves from a tree.", category: "animals", tags: ["giraffe", "safari", "kids", "printable"] },
      { slug: "panda-coloring-pages", title: "Panda Coloring Pages", description: "A cute panda sitting and eating bamboo.", category: "animals", tags: ["panda", "kids", "printable"] },
      { slug: "penguin-coloring-pages", title: "Penguin Coloring Pages", description: "A cute penguin family on an iceberg.", category: "animals", tags: ["penguin", "arctic", "kids", "printable"] },
      { slug: "owl-coloring-pages", title: "Owl Coloring Pages", description: "A cute owl perched on a branch at night.", category: "animals", tags: ["owl", "bird", "kids", "printable"] },
      { slug: "rabbit-coloring-pages", title: "Rabbit Coloring Pages", description: "A cute bunny rabbit with long ears and a carrot.", category: "animals", tags: ["rabbit", "bunny", "kids", "printable"] },
      { slug: "fox-coloring-pages", title: "Fox Coloring Pages", description: "A cute fox with a bushy tail in autumn leaves.", category: "animals", tags: ["fox", "autumn", "kids", "printable"] },
      { slug: "butterfly-coloring-pages", title: "Butterfly Coloring Pages", description: "A beautiful butterfly with large patterned wings.", category: "animals", tags: ["butterfly", "insect", "kids", "printable"] },
      { slug: "fish-coloring-pages", title: "Fish Coloring Pages", description: "A happy fish with decorative scales and bubbles.", category: "animals", tags: ["fish", "ocean", "kids", "printable"] },
      { slug: "shark-coloring-pages", title: "Shark Coloring Pages", description: "A friendly cartoon shark with a big smile.", category: "animals", tags: ["shark", "ocean", "kids", "printable"] },
      { slug: "dolphin-coloring-pages", title: "Dolphin Coloring Pages", description: "A playful dolphin jumping out of ocean waves.", category: "animals", tags: ["dolphin", "ocean", "kids", "printable"] },
      { slug: "turtle-coloring-pages", title: "Turtle Coloring Pages", description: "A cute sea turtle swimming with a patterned shell.", category: "animals", tags: ["turtle", "ocean", "kids", "printable"] },
      { slug: "frog-coloring-pages", title: "Frog Coloring Pages", description: "A cute frog sitting on a lily pad in a pond.", category: "animals", tags: ["frog", "pond", "kids", "printable"] },
      { slug: "farm-animals-coloring-pages", title: "Farm Animals Coloring Pages", description: "A farmyard scene with cow, pig, chicken and sheep.", category: "animals", tags: ["farm", "animals", "kids", "printable"] },
      { slug: "bear-coloring-pages", title: "Bear Coloring Pages", description: "A friendly cartoon bear standing and waving.", category: "animals", tags: ["bear", "forest", "kids", "printable"] },
      { slug: "unicorn-coloring-pages", title: "Unicorn Coloring Pages", description: "A magical unicorn with spiral horn and flowing mane.", category: "animals", tags: ["unicorn", "magical", "kids", "printable"] },
      { slug: "triceratops-coloring-page", title: "Triceratops Coloring Page", description: "A friendly Triceratops with three horns and neck frill.", category: "animals", tags: ["triceratops", "dinosaur", "kids", "printable"] },
      { slug: "monkey-coloring-pages", title: "Monkey Coloring Pages", description: "A playful monkey swinging from a vine in a jungle.", category: "animals", tags: ["monkey", "jungle", "kids", "printable"] },
      { slug: "bird-coloring-pages", title: "Bird Coloring Pages", description: "A cute bird perched on a flower branch singing.", category: "animals", tags: ["bird", "nature", "kids", "printable"] },
    ],
  },

  // ── HOLIDAYS ───────────────────────────────────────────────────────────────

  {
    slug: "holidays",
    title: "Holiday Coloring Pages",
    description: "Free printable holiday coloring pages — Christmas, Halloween, Easter, Valentine's Day, Thanksgiving and Diwali. New pages for every seasonal peak.",
    keywords: "holiday coloring pages",
    icon: "🎄",
    color: "bg-red-50",
    audience: "kids",
    pages: [
      { slug: "christmas-coloring-pages", title: "Christmas Coloring Pages", description: "Christmas tree with ornaments and presents below.", category: "holidays", tags: ["christmas", "xmas", "kids", "printable"] },
      { slug: "christmas-coloring-pictures", title: "Santa's Sleigh Coloring Page", description: "Santa in his sleigh pulled by reindeer over rooftops.", category: "holidays", tags: ["santa", "christmas", "kids", "printable"] },
      { slug: "santa-claus-coloring-pages", title: "Santa Claus Coloring Pages", description: "Santa with his sack of toys by a fireplace with stockings.", category: "holidays", tags: ["santa", "christmas", "kids", "printable"] },
      { slug: "snowman-coloring-pages", title: "Snowman Coloring Pages", description: "A cheerful snowman with scarf, top hat and stick arms.", category: "holidays", tags: ["snowman", "winter", "christmas", "kids"] },
      { slug: "halloween-coloring-pages", title: "Halloween Coloring Pages", description: "Jack-o-lantern pumpkin with carved face, bats and full moon.", category: "holidays", tags: ["halloween", "pumpkin", "kids", "printable"] },
      { slug: "halloween-witch-coloring-pages", title: "Halloween Witch Coloring Pages", description: "A friendly witch on a broomstick with a black cat.", category: "holidays", tags: ["halloween", "witch", "kids", "printable"] },
      { slug: "halloween-ghost-coloring-pages", title: "Halloween Ghost Coloring Pages", description: "Three friendly ghosts with a haunted house and bats.", category: "holidays", tags: ["halloween", "ghost", "kids", "printable"] },
      { slug: "easter-coloring-pages", title: "Easter Coloring Pages", description: "A large decorated Easter egg with flower patterns.", category: "holidays", tags: ["easter", "spring", "kids", "printable"] },
      { slug: "easter-bunny-coloring-pages", title: "Easter Bunny Coloring Pages", description: "The Easter bunny carrying a basket of decorated eggs.", category: "holidays", tags: ["easter", "bunny", "kids", "printable"] },
      { slug: "easter-egg-coloring-pages", title: "Easter Egg Coloring Pages", description: "Six Easter eggs each with unique decorative patterns.", category: "holidays", tags: ["easter", "eggs", "kids", "printable"] },
      { slug: "valentines-day-coloring-pages", title: "Valentine's Day Coloring Pages", description: "Cute animals holding a large heart with flowers.", category: "holidays", tags: ["valentines", "love", "kids", "printable"] },
      { slug: "thanksgiving-coloring-pages", title: "Thanksgiving Coloring Pages", description: "A cartoon turkey with fan of tail feathers in autumn leaves.", category: "holidays", tags: ["thanksgiving", "turkey", "kids", "printable"] },
      { slug: "diwali-coloring-pages", title: "Diwali Coloring Pages", description: "Diwali diya lamps, rangoli pattern, fireworks and lotus flowers.", category: "holidays", tags: ["diwali", "festival", "india", "kids"] },
      { slug: "spring-coloring-pages", title: "Spring Coloring Pages", description: "A spring scene with blooming trees, tulips and butterflies.", category: "holidays", tags: ["spring", "flowers", "kids", "printable"] },
    ],
  },

  // ── EDUCATIONAL ────────────────────────────────────────────────────────────

  {
    slug: "educational",
    title: "Educational Coloring Pages",
    description: "Free educational coloring pages — color by number, alphabet, numbers, space, ocean and shapes. Perfect for teachers, parents and homeschoolers.",
    keywords: "educational coloring pages",
    icon: "📚",
    color: "bg-teal-50",
    audience: "kids",
    pages: [
      { slug: "color-by-number-coloring-pages", title: "Color by Number Coloring Pages", description: "A color by number page featuring a cute cartoon cat.", category: "educational", tags: ["color by number", "kids", "educational", "printable"] },
      { slug: "alphabet-coloring-pages", title: "Alphabet Coloring Pages", description: "Letters A–F each illustrated with a matching object.", category: "educational", tags: ["alphabet", "letters", "kids", "educational"] },
      { slug: "numbers-coloring-pages", title: "Numbers Coloring Pages", description: "Numbers 1–10 illustrated with matching objects.", category: "educational", tags: ["numbers", "counting", "kids", "educational"] },
      { slug: "solar-system-coloring-pages", title: "Solar System Coloring Pages", description: "The solar system with all 8 planets labeled.", category: "educational", tags: ["solar system", "space", "science", "kids"] },
      { slug: "ocean-coloring-pages", title: "Ocean Coloring Pages", description: "Underwater scene with whale, octopus and coral.", category: "educational", tags: ["ocean", "sea", "underwater", "kids"] },
      { slug: "space-coloring-pages", title: "Space Coloring Pages", description: "A space scene with rocket, astronaut, planets and stars.", category: "educational", tags: ["space", "rocket", "planets", "kids"] },
      { slug: "shapes-coloring-pages", title: "Shapes Coloring Pages", description: "Basic shapes as cute smiling characters.", category: "educational", tags: ["shapes", "learning", "kids", "preschool"] },
      { slug: "map-coloring-pages", title: "World Map Coloring Pages", description: "A world map with continents labeled and animals illustrated.", category: "educational", tags: ["map", "world", "geography", "kids"] },
      { slug: "body-parts-coloring-page", title: "Body Parts Coloring Page", description: "A cartoon child with labeled body parts.", category: "educational", tags: ["body parts", "science", "kids", "educational"] },
      { slug: "food-coloring-pages", title: "Food Coloring Pages", description: "Fruits and vegetables each labeled and illustrated.", category: "educational", tags: ["food", "fruit", "vegetables", "kids"] },
    ],
  },
];

// ─── Games ────────────────────────────────────────────────────────────────────

export const games: Game[] = [
  {
    slug: "multiplication-blast",
    title: "Multiplication Blast",
    description: "Shoot the asteroid showing the correct multiplication answer! Race to clear the sky before the asteroids reach the ground. How many can you blast?",
    category: "Math Games",
    tags: ["multiplication", "math", "asteroid", "shooting", "times tables"],
    component: "MultiplicationBlastGame",
    difficulty: "medium",
    ageRange: "6–12",
  },
  {
    slug: "math-quiz",
    title: "Math Quiz Challenge",
    description: "10 questions, 8 seconds each — can you ace the math quiz? Mixed addition, subtraction and multiplication. Race the clock and beat your best score!",
    category: "Math Games",
    tags: ["math quiz", "quiz", "mental math", "addition", "subtraction", "multiplication"],
    component: "MathQuizGame",
    difficulty: "medium",
    ageRange: "6–14",
  },
  {
    slug: "times-tables-challenge",
    title: "Times Tables Challenge",
    description: "Race the clock! Answer times tables questions as fast as you can. 30 seconds per round — how high can you score? Perfect for practising multiplication facts.",
    category: "Math Games",
    tags: ["times tables", "multiplication", "math", "quiz", "speed"],
    component: "TimesChallengeGame",
    difficulty: "medium",
    ageRange: "6–12",
  },
  {
    slug: "easter-egg-hunt",
    title: "Easter Egg Hunt",
    description: "Find the hidden Easter eggs in a beautiful spring garden! Use the hot-and-cold hints to track down every egg. Find the rare golden egg for a huge bonus!",
    category: "Educational Games",
    tags: ["easter", "hidden objects", "puzzle", "spring", "seasonal"],
    component: "EasterEggHuntGame",
    difficulty: "easy",
    ageRange: "4–10",
  },
  {
    slug: "maths-play",
    title: "Maths Play — Times Tables & Mixed Maths",
    description: "The ultimate maths playground! Practice addition, subtraction and multiplication. Choose your operation and beat your high score.",
    category: "Math Games",
    tags: ["math", "maths play", "addition", "subtraction", "multiplication", "times tables"],
    component: "MathsPlayGame",
    difficulty: "medium",
    ageRange: "5–10",
  },
  {
    slug: "counting-game",
    title: "Counting Stars",
    description: "Count the stars on screen and pick the right number. Perfect for toddlers and preschoolers learning to count!",
    category: "Math Games",
    tags: ["counting", "numbers", "toddler", "preschool"],
    component: "CountingGame",
    difficulty: "easy",
    ageRange: "2–5",
  },
  {
    slug: "alphabet-match",
    title: "Alphabet Match",
    description: "Match uppercase and lowercase letters in this fun memory card game for early learners.",
    category: "Educational Games",
    tags: ["alphabet", "letters", "memory", "reading"],
    component: "AlphabetMatchGame",
    difficulty: "easy",
    ageRange: "3–6",
  },
  {
    slug: "math-addition",
    title: "Addition Adventure",
    description: "Practice addition with fun animated questions. Solve problems and build your streak!",
    category: "Math Games",
    tags: ["math", "addition", "educational", "numbers"],
    component: "MathsPlayGame",
    difficulty: "easy",
    ageRange: "5–8",
  },
  {
    slug: "math-subtraction",
    title: "Subtraction Quest",
    description: "Master subtraction through exciting questions. Answer correctly to build your score!",
    category: "Math Games",
    tags: ["math", "subtraction", "educational"],
    component: "MathsPlayGame",
    difficulty: "easy",
    ageRange: "5–8",
  },
  {
    slug: "shape-sorter",
    title: "Shape Sorter",
    description: "Click the matching shape hole! Learn circles, squares, triangles, stars, hearts and diamonds in this fun sorting game.",
    category: "Toddler Games",
    tags: ["shapes", "sorting", "toddler", "preschool"],
    component: "ShapeSorterGame",
    difficulty: "easy",
    ageRange: "2–5",
  },
  {
    slug: "animal-sounds",
    title: "Animal Sounds",
    description: "Tap each animal to discover what sound it makes! Meet 12 animals — cats, dogs, lions, elephants and more.",
    category: "Toddler Games",
    tags: ["animals", "sounds", "toddler", "preschool"],
    component: "AnimalSoundsGame",
    difficulty: "easy",
    ageRange: "1–4",
  },
  {
    slug: "bubble-pop-abc",
    title: "Bubble Pop ABCs",
    description: "Pop the letter bubbles in A-B-C order! A colourful, bouncy way to learn the alphabet.",
    category: "Toddler Games",
    tags: ["alphabet", "letters", "abc", "toddler"],
    component: "BubblePopABCGame",
    difficulty: "easy",
    ageRange: "3–6",
  },
  {
    slug: "colour-match",
    title: "Colour Match",
    description: "Tap the bucket that matches the colour on screen! Learn red, blue, yellow, green, purple and orange.",
    category: "Toddler Games",
    tags: ["colours", "colors", "matching", "toddler"],
    component: "ColorMatchGame",
    difficulty: "easy",
    ageRange: "2–5",
  },
  {
    slug: "memory-match-animals",
    title: "Memory Match Animals",
    description: "Flip the cards and find the matching animal pairs! Three difficulty levels — easy, medium and hard.",
    category: "Toddler Games",
    tags: ["memory", "animals", "matching", "concentration"],
    component: "MemoryMatchAnimalsGame",
    difficulty: "easy",
    ageRange: "3–7",
  },
  {
    slug: "connect-the-dots",
    title: "Connect the Dots",
    description: "Tap the numbered dots in order to reveal a hidden picture! Draw a star, house or heart.",
    category: "Toddler Games",
    tags: ["numbers", "drawing", "dots", "toddler"],
    component: "ConnectDotsGame",
    difficulty: "easy",
    ageRange: "3–6",
  },
  {
    slug: "word-spell",
    title: "Word Spell",
    description: "See the picture, then click letter tiles to spell the word! Three levels — easy 3-letter, medium 4-letter, hard 5-letter words. Hints available!",
    category: "Educational Games",
    tags: ["spelling", "words", "literacy", "reading", "letters"],
    component: "WordSpellGame",
    difficulty: "medium",
    ageRange: "4–8",
  },
  {
    slug: "pattern-wizard",
    title: "Pattern Wizard",
    description: "Complete the colour and shape sequences! Patterns get more complex each level — from simple AB to tricky ABBA and ABCBA. 8 levels of challenge!",
    category: "Educational Games",
    tags: ["patterns", "sequences", "logic", "maths", "shapes"],
    component: "PatternWizardGame",
    difficulty: "medium",
    ageRange: "4–8",
  },
  {
    slug: "sorting-frenzy",
    title: "Sorting Frenzy",
    description: "Items are falling — sort them into the right buckets before they hit the ground! 3 category sets, gets faster as you score. How long can you last?",
    category: "Educational Games",
    tags: ["sorting", "categories", "real-time", "animals", "food", "vehicles"],
    component: "SortingFrenzyGame",
    difficulty: "hard",
    ageRange: "5–10",
  },
  {
    slug: "story-adventure",
    title: "Story Adventure",
    description: "Help Zara survive her first day at school! Make choices at every turn — your decisions shape the story and your Kindness Score. Multiple endings!",
    category: "Educational Games",
    tags: ["story", "choices", "social skills", "emotions", "reading"],
    component: "StoryAdventureGame",
    difficulty: "easy",
    ageRange: "4–8",
  },
  {
    slug: "space-defender",
    title: "Space Defender",
    description: "Defend Earth from waves of alien invaders! Smooth 60fps action — move your ship, dodge enemy bombs, collect power-ups, and survive endless waves. With particle explosions and chiptune music!",
    category: "Arcade Games",
    tags: ["space", "shooter", "action", "arcade", "aliens"],
    component: "SpaceDefenderGame",
    difficulty: "medium",
    ageRange: "7–14",
  },
  {
    slug: "brick-breaker",
    title: "Brick Breaker",
    description: "Classic brick breaker with 5 levels, real ball physics, and power-ups! Wide paddle, laser mode, slow motion, extra lives — break every brick to advance!",
    category: "Arcade Games",
    tags: ["bricks", "paddle", "ball", "arcade", "physics"],
    component: "BrickBreakerGame",
    difficulty: "medium",
    ageRange: "6–14",
  },
  {
    slug: "dino-run",
    title: "Dino Run",
    description: "An endless runner with parallax scrolling, day/night cycle, and double-jump! Dodge cacti and flying birds as the speed keeps increasing. How far can you go?",
    category: "Arcade Games",
    tags: ["runner", "endless", "dinosaur", "jump", "arcade"],
    component: "DinoRunGame",
    difficulty: "medium",
    ageRange: "6–14",
  },
  {
    slug: "pumpkin-smash",
    title: "Pumpkin Smash",
    description: "Smash pumpkins, catch ghosts and avoid bats in this spooky whack-a-mole Halloween game! Combo multipliers and golden pumpkins await — can you get an SS rank?",
    category: "Arcade Games",
    tags: ["halloween", "whack-a-mole", "arcade", "spooky", "seasonal"],
    component: "PumpkinSmashGame",
    difficulty: "easy",
    ageRange: "4–12",
  },
  {
    slug: "present-catcher",
    title: "Present Catcher",
    description: "Santa's dropping presents! Catch golden gifts, candy canes and stars — but watch out for coal! A festive Christmas arcade game with 60 seconds of jolly fun.",
    category: "Arcade Games",
    tags: ["christmas", "catch", "arcade", "festive", "seasonal"],
    component: "PresentCatcherGame",
    difficulty: "easy",
    ageRange: "5–12",
  },
  {
    slug: "snake",
    title: "Snake — Classic Cool Math Game",
    description: "The classic snake game with a modern twist! Gradient snake body, 3 types of food (🍎⭐💎), 10 speed levels, chiptune music, and swipe controls on mobile.",
    category: "Arcade Games",
    tags: ["snake", "classic", "arcade", "strategy", "cool math games"],
    component: "SnakeGame",
    difficulty: "medium",
    ageRange: "7–14",
  },
  {
    slug: "super-jumper",
    title: "Super Jumper — Platform Adventure",
    description: "A Mario-style platformer! Run and jump across platforms, stomp enemies, collect coins and reach the flag. 6 zones of scrolling action with mobile controls.",
    category: "Arcade Games",
    tags: ["platformer", "jumping", "arcade", "coins", "adventure", "mario"],
    component: "SuperJumperGame",
    difficulty: "medium",
    ageRange: "5–14",
  },
];

// ─── Worksheets ───────────────────────────────────────────────────────────────

export const worksheets: Worksheet[] = [
  { slug: "kindergarten-math-worksheets", title: "Kindergarten Math Worksheets", description: "Free printable kindergarten math worksheets — counting, number recognition and simple addition.", category: "Math", tags: ["kindergarten", "math", "counting"], grade: "Kindergarten", subject: "Math" },
  { slug: "preschool-tracing-worksheets", title: "Preschool Tracing Worksheets", description: "Free printable preschool tracing worksheets for letters, numbers and shapes.", category: "Writing", tags: ["preschool", "tracing", "letters"], grade: "Preschool", subject: "Writing" },
  { slug: "multiplication-worksheets", title: "Multiplication Worksheets", description: "Free printable multiplication worksheets — times tables 1 through 12 with answer keys.", category: "Math", tags: ["multiplication", "times tables", "math"], grade: "Grade 2–4", subject: "Math" },
  { slug: "math-worksheets-grade-1", title: "Grade 1 Math Worksheets", description: "Free printable Grade 1 math worksheets — addition, subtraction and number bonds.", category: "Math", tags: ["grade 1", "math", "addition"], grade: "Grade 1", subject: "Math" },
  { slug: "alphabet-worksheets", title: "Alphabet Worksheets", description: "Free printable alphabet worksheets — trace and write A to Z.", category: "Writing", tags: ["alphabet", "letters", "writing"], grade: "Preschool–Kindergarten", subject: "Writing" },
  { slug: "place-value-worksheets", title: "Place Value Worksheets", description: "Free printable place value worksheets — ones, tens and hundreds.", category: "Math", tags: ["place value", "math", "grade 2"], grade: "Grade 2–3", subject: "Math" },
  { slug: "preschool-math-worksheets", title: "Preschool Math Worksheets", description: "Free printable preschool math worksheets — counting objects, comparing sizes, and number recognition 1-10.", category: "Math", tags: ["preschool", "math", "counting", "numbers"], grade: "Preschool", subject: "Math" },
  { slug: "addition-worksheets", title: "Addition Worksheets", description: "Free printable addition worksheets for beginners — single digit and double digit addition with pictures.", category: "Math", tags: ["addition", "math", "grade 1", "printable"], grade: "Grade 1–2", subject: "Math" },
  { slug: "subtraction-worksheets", title: "Subtraction Worksheets", description: "Free printable subtraction worksheets — take-away problems with visual aids for early learners.", category: "Math", tags: ["subtraction", "math", "grade 1", "printable"], grade: "Grade 1–2", subject: "Math" },
  { slug: "number-bonds-worksheets", title: "Number Bonds Worksheets", description: "Free printable number bonds worksheets — part-whole models for numbers to 10 and 20.", category: "Math", tags: ["number bonds", "math", "foundation", "reception"], grade: "Kindergarten–Grade 1", subject: "Math" },
  { slug: "shapes-worksheets", title: "Shapes Worksheets", description: "Free printable 2D and 3D shapes worksheets — identify, colour and count shapes.", category: "Math", tags: ["shapes", "geometry", "preschool", "kindergarten"], grade: "Preschool–Kindergarten", subject: "Math" },
  { slug: "counting-worksheets", title: "Counting Worksheets", description: "Free printable counting worksheets — count and circle, count and write, count up to 20.", category: "Math", tags: ["counting", "numbers", "preschool", "toddler"], grade: "Preschool", subject: "Math" },
  { slug: "letter-tracing-worksheets", title: "Letter Tracing Worksheets", description: "Free printable letter tracing worksheets — trace uppercase and lowercase letters A-Z with directional arrows.", category: "Writing", tags: ["tracing", "letters", "alphabet", "handwriting"], grade: "Preschool–Kindergarten", subject: "Writing" },
  { slug: "number-tracing-worksheets", title: "Number Tracing Worksheets", description: "Free printable number tracing worksheets — trace numbers 1-20 with dotted guidelines.", category: "Writing", tags: ["tracing", "numbers", "preschool", "handwriting"], grade: "Preschool", subject: "Writing" },
  { slug: "sight-words-worksheets", title: "Sight Words Worksheets", description: "Free printable sight words worksheets — read, trace and write the Dolch sight word list.", category: "Reading", tags: ["sight words", "reading", "kindergarten", "dolch"], grade: "Kindergarten–Grade 1", subject: "Reading" },
  { slug: "rhyming-words-worksheets", title: "Rhyming Words Worksheets", description: "Free printable rhyming words worksheets — match rhyming pairs and fill in the rhyme.", category: "Reading", tags: ["rhyming", "reading", "phonics", "kindergarten"], grade: "Kindergarten", subject: "Reading" },
  { slug: "color-by-number-worksheets", title: "Colour by Number Worksheets", description: "Free printable colour-by-number worksheets — colour fun pictures using the number key.", category: "Art", tags: ["colouring", "numbers", "preschool", "art"], grade: "Preschool–Kindergarten", subject: "Art" },
  { slug: "pattern-worksheets", title: "Pattern Worksheets", description: "Free printable pattern worksheets — complete and extend AB, ABC and ABBC patterns.", category: "Math", tags: ["patterns", "math", "preschool", "logical thinking"], grade: "Preschool–Kindergarten", subject: "Math" },
  { slug: "grade-2-math-worksheets", title: "Grade 2 Math Worksheets", description: "Free printable Grade 2 math worksheets — addition and subtraction to 100, basic multiplication, money.", category: "Math", tags: ["grade 2", "math", "multiplication", "money"], grade: "Grade 2", subject: "Math" },
  { slug: "grade-3-math-worksheets", title: "Grade 3 Math Worksheets", description: "Free printable Grade 3 math worksheets — multiplication tables, division intro, fractions, time.", category: "Math", tags: ["grade 3", "math", "multiplication", "fractions"], grade: "Grade 3", subject: "Math" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getAllColoringPages(): ColoringPage[] {
  return coloringCategories.flatMap((cat) => cat.pages);
}

export function getCategoryBySlug(slug: string): ColoringCategory | undefined {
  return coloringCategories.find((c) => c.slug === slug);
}

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug);
}

export function getWorksheetBySlug(slug: string): Worksheet | undefined {
  return worksheets.find((w) => w.slug === slug);
}

export function getPageBySlug(slug: string): ColoringPage | undefined {
  return getAllColoringPages().find((p) => p.slug === slug);
}

export const adultCategories = coloringCategories.filter((c) => c.audience === "adults" || c.audience === "both");
export const kidsCategories = coloringCategories.filter((c) => c.audience === "kids" || c.audience === "both");
