// ─── Programmatic SEO content ────────────────────────────────────────────────
//
// Lever 1 of the 1-lakh-DAU growth plan. Each entry in this file becomes a
// fully-rendered, indexable page with unique intro copy, FAQs, structured
// data and internal links to existing lib/data.ts content.
//
// Data is intentionally flat, author-written, and not templated — Google's
// Helpful Content Update punishes fill-in-the-blank doorway pages. When the
// pipeline scales to thousands of entries, that content still needs to
// pass the "unique value per URL" bar.
//
// ─────────────────────────────────────────────────────────────────────────────

export type FaqEntry = {
  question: string;
  answer: string;
};

export type ProgrammaticPage = {
  slug: string;              // URL segment, e.g. "3-year-olds" or "addition"
  keyword: string;           // Primary target keyword (for GSC tracking)
  searchVolume: number;      // Approx. monthly searches (from keyword planner)
  h1: string;                // On-page <h1>
  title: string;             // <title> tag
  metaDescription: string;   // <meta description>
  intro: string[];           // 150–250 words, each array item is a <p>
  faqs: FaqEntry[];          // 3–5 entries, rendered as FAQPage schema
  linkedGameSlugs: string[];       // pointers into lib/data.ts games
  linkedWorksheetSlugs: string[];  // pointers into lib/data.ts worksheets
  linkedColoringCategorySlugs: string[]; // pointers into coloringCategories
};

// ─── Age activities pages ────────────────────────────────────────────────────
//
// Target keyword cluster: "activities for N year olds" / "N year old
// activities". Ages 2–11 (10 pages). Each has ~50K monthly searches in the
// core buckets (ages 3–7), dropping to 5K on the tails.
//
// These pages target homeschool parents searching broadly, not parents who
// already know they want games or worksheets. So the page leads with a
// list-style resource hub (mix of games, worksheets, coloring) rather than
// a pure games grid — that's what differentiates this from the existing
// /games/3-year-olds page.

export const activityPages: ProgrammaticPage[] = [
  {
    slug: "2-year-olds",
    keyword: "activities for 2 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 2 Year Olds — Games, Printables & More",
    title: "Free Activities for 2 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 2 year olds — simple tap games, colouring sheets and tracing printables. Safe, no ads, no signup. Perfect for toddlers.",
    intro: [
      "Two-year-olds are curious about everything and bored by almost nothing — for about four minutes. The trick at this age is not to fill the day with one perfect activity; it's to have ten good ones ready so you can switch the second attention wobbles. That's what this page is for.",
      "Every activity linked below is free, loads instantly in a browser, and is built for tiny fingers. No logins, no ads pointed at children, no in-app purchases. Tap-to-respond games cover colours, animal sounds and basic shapes. Printable sheets give your toddler something to do with a fat crayon at the kitchen table. And our large-outline colouring pages are forgiving enough that scribbling still looks like a finished picture.",
      "We've pulled together the activities two-year-olds genuinely return to — the ones where the controls are just 'touch the screen' and the reward is an immediate animation or sound. Rotate through them over a rainy afternoon, print a couple for quiet time after lunch, and keep a few bookmarked for the next supermarket queue.",
    ],
    faqs: [
      {
        question: "What games are safe for 2 year olds to play online?",
        answer:
          "Games with single-tap controls, no text instructions, and no ads or sign-up prompts. JiggyJoy's Animal Sounds, Colour Match and Shape Sorter all fit — they respond to one touch and have big, forgiving targets.",
      },
      {
        question: "How long should a 2 year old play screen games?",
        answer:
          "The AAP guideline is under one hour per day of high-quality screen time for under-5s, ideally alongside a parent. We recommend 10–15 minute sessions, mixed with printable activities and physical play.",
      },
      {
        question: "Are JiggyJoy activities really free?",
        answer:
          "Yes — every game, worksheet and colouring page on JiggyJoy is free to play and print. No account, no trial, no 'unlock full version'.",
      },
      {
        question: "Do these work on a tablet?",
        answer:
          "Yes. All games are touch-friendly and scale to phone, tablet and desktop. For toddlers, a tablet is usually the easiest device to hand over.",
      },
    ],
    linkedGameSlugs: ["animal-sounds", "colour-match", "shape-sorter", "counting-game"],
    linkedWorksheetSlugs: ["preschool-tracing-worksheets", "counting-worksheets", "shapes-worksheets"],
    linkedColoringCategorySlugs: ["bold-easy", "cozy-animals"],
  },
  {
    slug: "3-year-olds",
    keyword: "activities for 3 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 3 Year Olds — Games, Printables & More",
    title: "Free Activities for 3 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 3 year olds — alphabet games, counting, tracing worksheets and colouring. Safe, no signup, no ads. Perfect for preschool.",
    intro: [
      "At three, the world gets sorted. Colours have names, animals have sounds, letters are starting to look like something other than squiggles. It's the age where educational play actually starts to teach — a 3-year-old will tap the letter B on a bubble because it's fun, and then remember it an hour later at dinner.",
      "This page is a rotation of the best free activities we've built for three-year-olds: bubble-pop alphabet games for early letter recognition, colour-match and pattern games for visual thinking, and simple counting games with friendly numbers up to 10. On the printable side, our tracing sheets introduce pencil grip without the frustration of fiddly tasks, and our large-outline colouring pages give endless quiet-time options.",
      "Three-year-olds have longer attention spans than toddlers, but still fall off a cliff if something is too hard. Everything here is sized to that reality — short, immediate-reward activities they can succeed at in one sitting, with nothing that expects reading.",
    ],
    faqs: [
      {
        question: "What activities help a 3 year old's development?",
        answer:
          "Colour and shape recognition, basic counting, alphabet introduction, and fine-motor practice (tracing, colouring). JiggyJoy covers all four with Colour Match, Shape Sorter, Bubble Pop ABCs, Counting Stars and our tracing worksheets.",
      },
      {
        question: "Can a 3 year old learn the alphabet from games?",
        answer:
          "Yes — repetition is how 3-year-olds learn, and a game that asks them to tap letter A 20 times in a row is doing exactly that. Combine with physical letter toys and reading aloud for the best results.",
      },
      {
        question: "Do I need to download anything?",
        answer:
          "No. Every JiggyJoy game runs straight in the browser. Tap the link, the game loads, your child plays.",
      },
      {
        question: "How are these different from the games for 3 year olds on your /games page?",
        answer:
          "The /games/3-year-olds page is a pure games grid. This activities page is a broader resource hub — it also links to printables, colouring pages and offline ideas for variety across a whole afternoon.",
      },
    ],
    linkedGameSlugs: ["bubble-pop-abc", "colour-match", "shape-sorter", "counting-game", "animal-sounds", "memory-match-animals"],
    linkedWorksheetSlugs: ["preschool-tracing-worksheets", "shapes-worksheets", "counting-worksheets", "preschool-math-worksheets"],
    linkedColoringCategorySlugs: ["bold-easy", "cozy-animals", "fantasy"],
  },
  {
    slug: "4-year-olds",
    keyword: "activities for 4 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 4 Year Olds — Games, Printables & More",
    title: "Free Activities for 4 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 4 year olds — letters, numbers, logic games and printable worksheets. Pre-K ready. No signup, no ads, 100% free.",
    intro: [
      "Four is the age where preschool starts to feel real. Kids are stringing sentences together, recognising most letters, counting past ten, and starting to ask 'why' on a loop. They can follow two-step instructions in a game, which unlocks a whole tier of activities that simply didn't work last year.",
      "The activities on this page lean into that. Pattern Wizard introduces simple logic sequences (AB, ABC, ABBA). Bubble Pop ABCs drills letter recognition the way a 4-year-old's brain actually works: fast, loud and repetitive. Memory Match Animals builds working memory, which is one of the strongest predictors of kindergarten readiness. And Story Adventure lets them make narrative choices — the first time most kids experience cause-and-effect in a digital setting.",
      "On the printable side, we've pulled together tracing sheets that prepare their hands for writing, number-recognition worksheets that go up to 20, and beginner colouring pages with enough detail to hold attention for a full 15 minutes. Together, these give you a rotation of screen and offline activities for an entire pre-K week.",
    ],
    faqs: [
      {
        question: "What should a 4 year old be learning?",
        answer:
          "Letter recognition, counting to 20, simple patterns, basic shapes, and holding a pencil correctly. JiggyJoy's 4-year-old activities target all five — no drilling, just play.",
      },
      {
        question: "Are these activities good for Pre-K preparation?",
        answer:
          "Yes. Pattern Wizard, Memory Match and our counting/tracing worksheets all hit skills on standard pre-K readiness checklists.",
      },
      {
        question: "Can my 4 year old play without me?",
        answer:
          "Most games can. Controls are simple and there are no external links or ads. We still recommend sitting with them for the first few plays of any new game.",
      },
      {
        question: "How many activities should I rotate through?",
        answer:
          "Three to five per session is a good rule. 4-year-olds love variety and switch interests quickly — having options on the page lets you pivot before boredom hits.",
      },
    ],
    linkedGameSlugs: ["bubble-pop-abc", "pattern-wizard", "memory-match-animals", "story-adventure", "counting-game", "connect-the-dots", "word-spell"],
    linkedWorksheetSlugs: ["preschool-math-worksheets", "letter-tracing-worksheets", "number-tracing-worksheets", "pattern-worksheets", "shapes-worksheets"],
    linkedColoringCategorySlugs: ["cozy-animals", "fantasy", "bold-easy"],
  },
  {
    slug: "5-year-olds",
    keyword: "activities for 5 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 5 Year Olds — Games, Printables & More",
    title: "Free Activities for 5 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 5 year olds — kindergarten games, spelling, addition and printable worksheets. 100% free, no signup, no ads. Works on any device.",
    intro: [
      "Five-year-olds sit right on the line between preschool and real school. They can read simple words, count well past 20, do single-digit addition, and sit through a whole activity without needing an adult to restart it every 30 seconds. This is the age where learning games start to do genuine academic lifting.",
      "Everything on this page maps to kindergarten standards. Word Spell turns picture-word matching into a game of tiles, which is exactly how sight-word reading is taught in classrooms. Addition Adventure introduces the 1–10 number bonds that underpin all of Grade 1 maths. Sorting Frenzy teaches categorisation — a skill that quietly shows up everywhere from science class to library organisation. And Story Adventure builds social-emotional reasoning through choose-your-own-adventure storytelling.",
      "For offline variety, we've linked kindergarten-ready worksheets (counting, sight words, simple addition, beginner handwriting) and colouring pages with more detail than the toddler range. A 5-year-old can now sit with a single activity for 20+ minutes, so these are genuinely useful for quiet time, waiting rooms, and rainy Sunday afternoons.",
    ],
    faqs: [
      {
        question: "What should a 5 year old know before starting kindergarten?",
        answer:
          "Letter names and sounds, counting to 20, recognising shapes, writing their name, and taking turns. Our 5-year-old activities cover the first four — the last one's on you!",
      },
      {
        question: "What's a good free learning game for a 5 year old?",
        answer:
          "Word Spell for reading, Addition Adventure for maths, and Memory Match for cognitive skills. All three are free on JiggyJoy with no signup or ads.",
      },
      {
        question: "Are these activities educational or just fun?",
        answer:
          "Both. Every game here targets a real skill on the kindergarten readiness checklist, but is structured as a game so kids don't experience it as 'work'.",
      },
      {
        question: "Can these be used in the classroom?",
        answer:
          "Yes — many kindergarten teachers use JiggyJoy on classroom tablets as a free alternative to subscription sites. No classroom login required.",
      },
    ],
    linkedGameSlugs: ["word-spell", "math-addition", "pattern-wizard", "sorting-frenzy", "story-adventure", "memory-match-animals", "connect-the-dots"],
    linkedWorksheetSlugs: ["kindergarten-math-worksheets", "sight-words-worksheets", "letter-tracing-worksheets", "addition-worksheets", "number-bonds-worksheets"],
    linkedColoringCategorySlugs: ["cozy-animals", "fantasy", "bold-easy"],
  },
  {
    slug: "6-year-olds",
    keyword: "activities for 6 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 6 Year Olds — Games, Printables & More",
    title: "Free Activities for 6 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 6 year olds — Grade 1 maths, reading games, puzzles and printable worksheets. 100% free, no signup. Perfect for home or classroom.",
    intro: [
      "Six-year-olds are readers. Not fluent ones, but they can sound out short words, recognise a growing list of sight words, and follow written instructions on a screen. That changes what a learning game can do: we can finally add rules, scores and multi-step challenges without losing them.",
      "This page pulls together the activities that make the most of Grade 1 brains. Math Quiz Challenge drills mental arithmetic under a timer — exactly how fact fluency gets built. Addition Adventure and Subtraction Quest cover the operations side of the curriculum. Word Spell scales up to 4-letter words. Pumpkin Smash and Brick Breaker keep the reaction-time muscle warm, which sounds frivolous until you realise it's the same muscle used in timed maths drills.",
      "On the printable side, Grade 1 worksheets fill out the offline half of the day: addition and subtraction to 20, number bonds, sight words from the Dolch list, and handwriting practice. A 6-year-old can self-direct for 30 minutes at a time with the right worksheet, which buys you actual silence.",
    ],
    faqs: [
      {
        question: "What are the best online games for 6 year olds?",
        answer:
          "Math Quiz Challenge, Addition Adventure, Word Spell and Pattern Wizard — all free on JiggyJoy, all hit Grade 1 learning targets without feeling like homework.",
      },
      {
        question: "How do I get a 6 year old interested in maths?",
        answer:
          "Short, timed games with a visible score. Six-year-olds are competitive with themselves, and a 60-second Math Quiz round is more engaging than a worksheet for most kids.",
      },
      {
        question: "What should a 6 year old know in reading?",
        answer:
          "Sight words (around 100 by end of Grade 1), sounding out CVC words, and reading simple sentences. Word Spell and our sight word worksheets both help.",
      },
      {
        question: "Are these free forever?",
        answer:
          "Yes. JiggyJoy is ad-supported for adults only and we never charge for access to games, worksheets or colouring pages.",
      },
    ],
    linkedGameSlugs: ["math-quiz", "math-addition", "math-subtraction", "word-spell", "pattern-wizard", "pumpkin-smash", "brick-breaker"],
    linkedWorksheetSlugs: ["math-worksheets-grade-1", "addition-worksheets", "subtraction-worksheets", "sight-words-worksheets", "number-bonds-worksheets"],
    linkedColoringCategorySlugs: ["cozy-animals", "fantasy"],
  },
  {
    slug: "7-year-olds",
    keyword: "activities for 7 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 7 Year Olds — Games, Printables & More",
    title: "Free Activities for 7 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 7 year olds — Grade 2 maths, times tables, spelling and printable worksheets. 100% free, no signup, no ads.",
    intro: [
      "Seven is where times tables enter the chat. Grade 2 curricula across the US, UK and India all introduce multiplication around this age, and it's the single biggest maths milestone of the primary years. A kid who gets fluent at times tables by 8 has an easier time with every maths topic that follows.",
      "We built Times Tables Challenge and Multiplication Blast specifically for this moment. Times Tables Challenge is a straight speed drill — 30 seconds, how many can you answer. Multiplication Blast wraps the same facts in an asteroid shooter, which is the difference between 'doing maths' and 'playing a game that happens to involve maths'. Math Quiz Challenge mixes in addition and subtraction for variety, so a daily 10-minute session covers all the operations.",
      "Beyond maths, 7-year-olds are in the reading sweet spot — decoding is automatic but vocabulary is still growing. Word Spell goes up to 5-letter words at its hardest level. Grade 2 worksheets round out the rotation with place value, two-digit addition, and multiplication tables on paper. And for when they need a screen break, our Arcade Games section gives them Snake, Brick Breaker and Dino Run — all the good stuff from our own childhoods, age-appropriate and ad-free.",
    ],
    faqs: [
      {
        question: "How do I help my 7 year old learn times tables?",
        answer:
          "Short daily sessions with a game — Times Tables Challenge is designed for exactly this. 5 minutes a day for a month will get most 7-year-olds fluent in the 2, 5 and 10 times tables.",
      },
      {
        question: "What are good free learning games for 7 year olds?",
        answer:
          "Multiplication Blast, Math Quiz Challenge, Word Spell and Times Tables Challenge. All free, all on JiggyJoy, all map to Grade 2 curriculum.",
      },
      {
        question: "What's a good activity rotation for a 7 year old?",
        answer:
          "15 minutes of a maths game, 15 minutes of a worksheet, 15 minutes of colouring or drawing, 15 minutes of an arcade game. Repeat daily.",
      },
      {
        question: "Do 7 year olds still enjoy colouring pages?",
        answer:
          "Yes — especially detailed fantasy and animal pages. Avoid the toddler-style large-outline ones and look at our intermediate range.",
      },
    ],
    linkedGameSlugs: ["times-tables-challenge", "multiplication-blast", "math-quiz", "word-spell", "snake", "brick-breaker", "memory-match-animals"],
    linkedWorksheetSlugs: ["grade-2-math-worksheets", "multiplication-worksheets", "place-value-worksheets", "sight-words-worksheets"],
    linkedColoringCategorySlugs: ["fantasy", "cozy-animals"],
  },
  {
    slug: "8-year-olds",
    keyword: "activities for 8 year olds",
    searchVolume: 50000,
    h1: "Free Activities for 8 Year Olds — Games, Printables & More",
    title: "Free Activities for 8 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 8 year olds — Grade 3 maths, multiplication, puzzles and printable worksheets. 100% free, no signup, no ads.",
    intro: [
      "Eight-year-olds are miniature adults when it comes to games. They can learn complex rules in a single explanation, handle abstract concepts, and — crucially — get genuinely competitive with themselves over a high score. This is the age where learning games stop needing to be disguised and can just be games that happen to teach.",
      "The maths side of this page focuses on Grade 3 territory: times tables up to 12, division as the inverse of multiplication, fractions, and two-step word problems. Multiplication Blast and Times Tables Challenge are the daily-driver games — five minutes a day for a few weeks turns shaky 6× tables into automatic ones. Math Quiz Challenge mixes operations for variety, and our Grade 3 worksheets provide written practice that's still genuinely useful at this age.",
      "For the non-maths hours, 8-year-olds love arcade games with real skill ceilings — Snake, Space Defender, Super Jumper and Dino Run all scratch that itch. Word Spell goes right up to hard 5-letter words for spelling practice. And Story Adventure introduces moral-choice narrative thinking, which is a skill worth developing at exactly this age.",
    ],
    faqs: [
      {
        question: "What should an 8 year old know in maths?",
        answer:
          "Times tables to 10 (ideally 12), two-digit addition and subtraction, basic fractions, and telling time. Our Grade 3 worksheets and maths games cover all of it.",
      },
      {
        question: "What's a good fun learning game for 8 year olds?",
        answer:
          "Multiplication Blast is the most popular one for this age — it's a real shooter game that also drills times tables. Also try Math Quiz Challenge and Pattern Wizard.",
      },
      {
        question: "Can 8 year olds play Snake and arcade games safely?",
        answer:
          "Yes. JiggyJoy arcade games have no chat, no ads targeted at kids, and no in-app purchases. They're the same classic games you remember, just modern and safe.",
      },
      {
        question: "How long should an 8 year old play learning games per day?",
        answer:
          "30–60 minutes is a reasonable cap, ideally broken into two sessions. Long enough to actually learn, short enough not to crowd out reading, outdoor play and homework.",
      },
    ],
    linkedGameSlugs: ["multiplication-blast", "times-tables-challenge", "math-quiz", "word-spell", "snake", "space-defender", "super-jumper", "pattern-wizard"],
    linkedWorksheetSlugs: ["grade-3-math-worksheets", "multiplication-worksheets", "place-value-worksheets"],
    linkedColoringCategorySlugs: ["fantasy", "cozy-animals"],
  },
  {
    slug: "9-year-olds",
    keyword: "activities for 9 year olds",
    searchVolume: 5000,
    h1: "Free Activities for 9 Year Olds — Games, Printables & More",
    title: "Free Activities for 9 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 9 year olds — Grade 4 maths, logic games, arcade classics and printable worksheets. 100% free, no signup.",
    intro: [
      "By nine, most kids are past the 'learning game' label. They want games that are actually good — the kind with scoring systems, power-ups, and enough challenge that they can brag about their high score. The upside is that a game that's fun for a 9-year-old is usually the best teacher, because they'll come back to it voluntarily.",
      "For maths, nine is when multiplication fluency starts to really pay off. Multiplication Blast and Times Tables Challenge should still be in the rotation — the 9s, 11s and 12s are often shaky even for kids who think they're done. Math Quiz Challenge adds mixed-operation speed drills that prep them for mental arithmetic in Grade 5 and beyond. Our Grade 3 worksheets still have useful fractions and division content, and we're adding Grade 4 material to the roadmap.",
      "On the non-maths side, this is peak arcade age. Snake has a real learning curve. Space Defender rewards reflexes and pattern recognition. Dino Run and Super Jumper test timing. None of these are 'educational' in the narrow sense, but they build the focus and persistence that show up everywhere else. Pair with Word Spell (hard level) for vocabulary and you've got a well-rounded 30 minutes.",
    ],
    faqs: [
      {
        question: "What are good free games for 9 year olds?",
        answer:
          "Snake, Space Defender, Multiplication Blast, Math Quiz Challenge and Super Jumper. All free on JiggyJoy, all have enough depth to hold a 9-year-old's attention.",
      },
      {
        question: "Should my 9 year old still be using learning games?",
        answer:
          "Yes, but the ratio shifts. Aim for one maths game in the rotation rather than three. Fact fluency still matters at this age, but overall skill-building comes from mixed play.",
      },
      {
        question: "Are there worksheets for 9 year olds here?",
        answer:
          "Yes — our Grade 3 maths worksheets cover multiplication, division intro, fractions and time, all of which map to what most 9-year-olds are learning. Grade 4 worksheets coming soon.",
      },
      {
        question: "Are the arcade games really free?",
        answer:
          "Yes. No signup, no login, no ads targeted at kids. Just open the game and play.",
      },
    ],
    linkedGameSlugs: ["multiplication-blast", "times-tables-challenge", "math-quiz", "snake", "space-defender", "super-jumper", "dino-run", "word-spell"],
    linkedWorksheetSlugs: ["grade-3-math-worksheets", "multiplication-worksheets"],
    linkedColoringCategorySlugs: ["fantasy"],
  },
  {
    slug: "10-year-olds",
    keyword: "activities for 10 year olds",
    searchVolume: 5000,
    h1: "Free Activities for 10 Year Olds — Games, Printables & More",
    title: "Free Activities for 10 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 10 year olds — maths quizzes, arcade classics, logic games and printables. 100% free, no signup.",
    intro: [
      "Ten-year-olds are in a weird sweet spot. They're still kids — they'll happily spend an hour colouring a detailed mandala or playing a silly memory game — but they also want grown-up content, especially anything involving real skill or scoring. The challenge is finding free stuff that doesn't either talk down to them or push them to content that's genuinely too mature.",
      "On JiggyJoy, the best fits for this age are the arcade games with real skill ceilings and the maths quizzes that double as speed challenges. Snake rewards planning. Space Defender tests reaction time. Brick Breaker has actual physics. Math Quiz Challenge and Multiplication Blast are where learning hides inside a game, and at this age kids can see the trick but still enjoy the game enough to keep playing. It's the best kind of educational content — the kind where the learning is a side effect.",
      "For anything offline, our fantasy and mandala colouring pages hold up to 10-year-old attention because the designs are intricate enough to feel like real art, and our Grade 3 worksheets still have useful fractions and time content. Pair an hour here with 30 minutes of reading and you've got a legitimately good weekend afternoon.",
    ],
    faqs: [
      {
        question: "What activities do 10 year olds actually enjoy?",
        answer:
          "Games with real skill ceilings (Snake, Space Defender, Brick Breaker), speed challenges (Math Quiz, Times Tables), and detailed colouring (mandalas, fantasy). They've outgrown toddler content but still enjoy classics.",
      },
      {
        question: "Are there free maths games for 10 year olds?",
        answer:
          "Yes — Math Quiz Challenge, Multiplication Blast and Times Tables Challenge are all free and appropriate for the mental-arithmetic speed that Grade 4/5 maths needs.",
      },
      {
        question: "Are colouring pages still good at this age?",
        answer:
          "Our fantasy and mandala designs are detailed enough to hold a 10-year-old's attention for a full hour. Skip the toddler large-outline ones.",
      },
      {
        question: "What about screen time limits?",
        answer:
          "The AAP suggests 'consistent limits' for school-age kids without a specific number. 60–90 minutes of recreational screen time on a regular day is a common rule of thumb for 10-year-olds.",
      },
    ],
    linkedGameSlugs: ["math-quiz", "multiplication-blast", "times-tables-challenge", "snake", "space-defender", "brick-breaker", "super-jumper", "dino-run"],
    linkedWorksheetSlugs: ["grade-3-math-worksheets", "multiplication-worksheets", "place-value-worksheets"],
    linkedColoringCategorySlugs: ["fantasy", "animal-mandalas", "floral-mandalas"],
  },
  {
    slug: "11-year-olds",
    keyword: "activities for 11 year olds",
    searchVolume: 5000,
    h1: "Free Activities for 11 Year Olds — Games, Printables & More",
    title: "Free Activities for 11 Year Olds | JiggyJoy",
    metaDescription:
      "Free online activities for 11 year olds — maths quizzes, arcade classics, detailed colouring and logic games. 100% free, no signup.",
    intro: [
      "Eleven is the last year of 'kid' before middle school changes everything. They're reading young adult novels, doing real algebra prep, and picking their own activities. The content that works for this age is content that respects them — fast, challenging, and ideally with a high score that means something to other 11-year-olds.",
      "For maths, the focus shifts from fact drilling to mental fluency under pressure. Math Quiz Challenge's 8-second-per-question format is roughly the pace they'll need for Grade 6 mental arithmetic. Multiplication Blast and Times Tables Challenge still work for the kids who are shaky on 7s and 8s (there are more of these than teachers admit). The arcade games — Snake, Space Defender, Super Jumper, Brick Breaker — are genuinely competitive at the high scores, and 11-year-olds will grind them for an afternoon trying to beat their friends.",
      "For a quiet activity, our adult mandala and floral colouring pages are a surprisingly good fit. The intricate designs feel grown-up, the concentration is real, and the result is legitimately worth framing. Skip anything marked 'toddler' or 'large print' — this age wants detail.",
    ],
    faqs: [
      {
        question: "What do 11 year olds like to do online?",
        answer:
          "Competitive games with high scores, speed challenges, and anything with a real skill ceiling. They're past 'educational games' as a category but still play ones that happen to be fun.",
      },
      {
        question: "Are there free games that actually challenge an 11 year old?",
        answer:
          "Yes — Snake at level 10, Space Defender's later waves, and Math Quiz Challenge at high speed. All free on JiggyJoy.",
      },
      {
        question: "What about reading and writing activities?",
        answer:
          "Our worksheets are aimed at younger grades, so for an 11-year-old we recommend pairing JiggyJoy games with library books and a journal. Word Spell on hard mode is still a good spelling refresher.",
      },
      {
        question: "Is JiggyJoy safe for this age group?",
        answer:
          "Yes. No chat, no user-generated content, no ads targeted at children, no signup. Parents can walk away from the screen without worrying.",
      },
    ],
    linkedGameSlugs: ["math-quiz", "multiplication-blast", "times-tables-challenge", "snake", "space-defender", "brick-breaker", "super-jumper", "word-spell"],
    linkedWorksheetSlugs: ["grade-3-math-worksheets", "multiplication-worksheets"],
    linkedColoringCategorySlugs: ["animal-mandalas", "floral-mandalas", "fantasy"],
  },
];

// ─── Free worksheets topic pages ─────────────────────────────────────────────
//
// Target keyword cluster: "free [topic] worksheets" / "[topic] worksheets
// free". Taps into the 93K/month worksheet search bucket identified in
// GROWTH-STRATEGY.md. These are SEO landing pages that aggregate existing
// worksheets by topic (rather than by grade level, which is what the
// existing /worksheets/kindergarten-style pages do).

export const freeWorksheetTopics: ProgrammaticPage[] = [
  {
    slug: "addition",
    keyword: "free addition worksheets",
    searchVolume: 10000,
    h1: "Free Addition Worksheets — Printable PDF",
    title: "Free Addition Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable addition worksheets for Pre-K, Kindergarten, Grade 1 and Grade 2. Single-digit to two-digit addition with answer keys. No signup, instant download.",
    intro: [
      "Addition is the first real piece of maths a child learns, and it's also the one where repetition does almost all the work. A 6-year-old doesn't need a clever explanation of what 4 + 3 is — they need to see it enough times that the answer arrives before the question finishes. That's what worksheets are for. Not homework, not busywork: practice reps.",
      "This page collects every free addition worksheet on JiggyJoy in one place, sorted from easiest to hardest. The Pre-K and Kindergarten sheets start with picture-based counting (four apples plus three apples) so kids who can't read yet can still do the problem. Grade 1 and Grade 2 sheets move into pure numeric addition, starting with single-digit sums and working up to two-digit addition with regrouping.",
      "Every sheet prints to a single page, has clear large digits, and comes with an answer key at the bottom for parents. No logins, no paywalls, no 'free preview' that's actually 2 out of 20 questions. Pair the sheets with our Addition Adventure and Math Quiz Challenge games for a mix of written and screen practice — kids learn faster when they do both.",
    ],
    faqs: [
      {
        question: "Are these addition worksheets really free?",
        answer:
          "Yes. Every worksheet on this page is free to download, print and copy for home or classroom use. No signup, no email required.",
      },
      {
        question: "What grade level are these for?",
        answer:
          "The easiest sheets work for Pre-K and Kindergarten (picture-based addition). The harder ones cover Grade 1 (single-digit) and Grade 2 (two-digit with regrouping).",
      },
      {
        question: "Do the worksheets come with answer keys?",
        answer:
          "Yes — every sheet has an answer key for parents and teachers, usually printed at the bottom of the page.",
      },
      {
        question: "Can I use these in a classroom?",
        answer:
          "Yes. JiggyJoy worksheets are free for teachers to copy and distribute to their students. No classroom license needed.",
      },
    ],
    linkedGameSlugs: ["math-addition", "math-quiz", "maths-play", "counting-game"],
    linkedWorksheetSlugs: ["addition-worksheets", "math-worksheets-grade-1", "kindergarten-math-worksheets", "number-bonds-worksheets", "preschool-math-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "subtraction",
    keyword: "free subtraction worksheets",
    searchVolume: 5000,
    h1: "Free Subtraction Worksheets — Printable PDF",
    title: "Free Subtraction Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable subtraction worksheets for Kindergarten, Grade 1 and Grade 2. Single and two-digit subtraction with answer keys. No signup, instant download.",
    intro: [
      "Subtraction is addition in reverse, but children don't learn it that way — they learn it as a whole new thing, and the first few weeks are rough. The mental move from 'combine' to 'take away' is genuinely hard, and kids need to see it on paper in lots of different ways before it clicks.",
      "The subtraction worksheets on this page are designed around that reality. Kindergarten sheets use pictures — four apples with two crossed out equals two — so the take-away concept is visible. Grade 1 sheets move to written numerals with single-digit subtraction, and Grade 2 introduces two-digit subtraction including the first exposure to borrowing. Every sheet has an answer key.",
      "We recommend pairing worksheet practice with Subtraction Quest and Math Quiz Challenge — writing and tapping activate different parts of the brain, and kids who do both become fluent faster than kids who only do one. Everything on this page is free to print, copy, and use in homework or classroom packets.",
    ],
    faqs: [
      {
        question: "At what age should a child start subtraction worksheets?",
        answer:
          "Most children are ready for basic subtraction by the end of Kindergarten (age 5–6), starting with picture-based problems before moving to written numerals.",
      },
      {
        question: "Do these cover subtraction with regrouping?",
        answer:
          "Yes — our Grade 2 sheets include two-digit subtraction with regrouping (borrowing), which is typically taught mid-Grade 2.",
      },
      {
        question: "Are answer keys included?",
        answer:
          "Yes. Every worksheet comes with an answer key for easy parent and teacher checking.",
      },
      {
        question: "Can I combine these with online subtraction games?",
        answer:
          "Yes — our Subtraction Quest game pairs well with the worksheets. Doing both types of practice speeds up fluency.",
      },
    ],
    linkedGameSlugs: ["math-subtraction", "math-quiz", "maths-play"],
    linkedWorksheetSlugs: ["subtraction-worksheets", "math-worksheets-grade-1", "grade-2-math-worksheets", "number-bonds-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "counting",
    keyword: "free counting worksheets",
    searchVolume: 5000,
    h1: "Free Counting Worksheets — Printable PDF",
    title: "Free Counting Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable counting worksheets for toddlers, preschool and kindergarten. Count to 10, count to 20, count and match. No signup, instant PDF download.",
    intro: [
      "Counting is the gateway skill for everything in early maths. Before a child can add, they need to know what 'five' actually is — not the word, but the quantity, the idea that it means five objects. That understanding only comes from counting real things over and over: pebbles, buttons, fingers, and yes, printed pictures on a worksheet.",
      "This page collects all our free counting worksheets in one place. The easiest sheets are 'count the objects' — toddlers look at a row of shapes and circle the right number. Middle-range sheets go up to counting twenty and include 'count and write' activities. The hardest introduce skip counting (by 2s, 5s, 10s), which is the bridge from counting to multiplication.",
      "Pair these with our Counting Stars game for on-screen practice, or use them as quiet-time activities in between other learning. Every worksheet is free, prints instantly, and is safe for home or classroom use.",
    ],
    faqs: [
      {
        question: "At what age should a child start counting worksheets?",
        answer:
          "Most 3-year-olds enjoy counting pictures up to 5 or 10. By age 4–5 they're ready to count to 20 and start writing the numerals.",
      },
      {
        question: "Do these cover skip counting?",
        answer:
          "Yes — our most advanced counting sheets include skip counting by 2s, 5s and 10s, which helps prepare for multiplication.",
      },
      {
        question: "Are these good for toddlers?",
        answer:
          "The easiest sheets (count and circle) work well for 2–3 year olds. Look for the 'preschool' labelled worksheets first.",
      },
      {
        question: "Can I use these for homeschooling?",
        answer:
          "Absolutely — homeschool parents use our counting worksheets as core maths curriculum for Pre-K and Kindergarten.",
      },
    ],
    linkedGameSlugs: ["counting-game", "math-addition", "connect-the-dots"],
    linkedWorksheetSlugs: ["counting-worksheets", "preschool-math-worksheets", "kindergarten-math-worksheets", "number-tracing-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "alphabet-tracing",
    keyword: "free alphabet tracing worksheets",
    searchVolume: 10000,
    h1: "Free Alphabet Tracing Worksheets — Printable PDF",
    title: "Free Alphabet Tracing Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable alphabet tracing worksheets A–Z. Uppercase and lowercase with directional arrows. Preschool and kindergarten ready. No signup required.",
    intro: [
      "Handwriting starts with tracing, and tracing starts with the alphabet. Before a child can write the letter B from memory, they need to have moved their pencil along the shape of a B hundreds of times. Dotted-line tracing worksheets are how that practice gets structured — they give the pencil somewhere to go.",
      "This page collects our free alphabet tracing worksheets, both uppercase and lowercase, with directional arrows showing which stroke comes first. The arrows matter: children who learn the correct stroke order in Pre-K have noticeably faster handwriting by Grade 2. Every letter gets multiple repetitions on the same sheet, starting with solid grey letters and fading to dotted outlines, then blank practice space.",
      "For kids just starting, we recommend doing 2–3 letters per session rather than the whole alphabet at once. Pair with our Bubble Pop ABCs game for letter recognition practice, and our Alphabet Match memory game for uppercase/lowercase pairing. Everything is free — no signup, no email gate, no 'premium' version.",
    ],
    faqs: [
      {
        question: "At what age should a child start alphabet tracing?",
        answer:
          "Most children are ready for alphabet tracing around age 3–4, once they can hold a pencil with a reasonable grip. Start with large letters and lots of repetition.",
      },
      {
        question: "Uppercase or lowercase first?",
        answer:
          "Teachers typically start with uppercase because the shapes are simpler and more distinct. Our worksheets cover both so you can pick.",
      },
      {
        question: "Do the worksheets show stroke order?",
        answer:
          "Yes — all our alphabet tracing sheets include directional arrows showing the correct stroke order for each letter.",
      },
      {
        question: "Are these free for teachers to use?",
        answer:
          "Yes. JiggyJoy worksheets are free for any home or classroom use. Print as many copies as you need.",
      },
    ],
    linkedGameSlugs: ["bubble-pop-abc", "alphabet-match", "word-spell"],
    linkedWorksheetSlugs: ["letter-tracing-worksheets", "alphabet-worksheets", "preschool-tracing-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "number-tracing",
    keyword: "free number tracing worksheets",
    searchVolume: 5000,
    h1: "Free Number Tracing Worksheets — Printable PDF",
    title: "Free Number Tracing Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable number tracing worksheets 1–20. Dotted lines with directional arrows. Preschool and kindergarten ready. No signup, instant download.",
    intro: [
      "Writing numbers is harder than writing letters. There are only ten of them, which sounds easy, but each one has to be recognisably distinct from the others even when a 4-year-old draws it wobbly. A '1' that's slightly curved looks like a '7'. A '6' and a '9' depend entirely on which end is up. The only fix is practice.",
      "This page collects our free number tracing worksheets — 1 through 20, with dotted lines and directional arrows. Each number gets its own section with a demonstration, several dotted-line traces, and blank practice space. The lower-number sheets (1–10) are designed for ages 3–5. The higher-number sheets (11–20) are for kindergarten and early Grade 1.",
      "Pair tracing practice with our Counting Stars game for quantity recognition and Connect the Dots for number-order reinforcement. All worksheets are free, print-ready, and safe for classroom use with no license or signup needed.",
    ],
    faqs: [
      {
        question: "When should a child start number tracing?",
        answer:
          "Usually around age 3–4, after they can recognise the numbers visually. Start with the simpler numerals (1, 7, 10) before moving to curved ones (3, 6, 8, 9).",
      },
      {
        question: "Do these go past 10?",
        answer:
          "Yes — we have tracing sheets for numbers 11–20 aimed at kindergarten-age children.",
      },
      {
        question: "Are the worksheets left-handed friendly?",
        answer:
          "The directional arrows show the correct stroke direction, which is the same for both hands. Left-handed children can use the same sheets.",
      },
      {
        question: "Do I need to pay for the PDF?",
        answer:
          "No — every number tracing worksheet on JiggyJoy is free to download and print. No signup required.",
      },
    ],
    linkedGameSlugs: ["counting-game", "connect-the-dots", "math-addition"],
    linkedWorksheetSlugs: ["number-tracing-worksheets", "counting-worksheets", "preschool-math-worksheets", "kindergarten-math-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "shapes",
    keyword: "free shapes worksheets",
    searchVolume: 5000,
    h1: "Free Shapes Worksheets — Printable PDF",
    title: "Free Shapes Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable shapes worksheets for preschool and kindergarten. Identify, trace and count 2D and 3D shapes. No signup, instant PDF download.",
    intro: [
      "Shape recognition is one of those skills that looks trivial from the outside — of course everyone knows what a triangle is — and is actually foundational for geometry, handwriting, and even reading. Children who can reliably tell circles from ovals and triangles from rectangles have an easier time with letter recognition, because letters are basically just combinations of shapes.",
      "The worksheets on this page cover the full preschool-to-kindergarten shape curriculum. The easiest sheets ask children to circle all the triangles on a page, colour the squares, or match shapes to their names. More advanced sheets introduce 3D shapes (cubes, spheres, cones) and ask children to identify shapes in real-world objects — a door is a rectangle, a ball is a sphere.",
      "Pair these worksheets with our Shape Sorter game for on-screen practice, and Pattern Wizard for sequence recognition using shapes. Everything here is free and safe for classroom use — print as many copies as you need.",
    ],
    faqs: [
      {
        question: "What shapes should a preschooler know?",
        answer:
          "Circle, square, triangle, rectangle and star are the core five. By kindergarten, most children also know oval, diamond (rhombus), heart and pentagon.",
      },
      {
        question: "Do the worksheets include 3D shapes?",
        answer:
          "Yes — our advanced shape worksheets introduce cubes, spheres, cylinders and cones, usually taught in late kindergarten.",
      },
      {
        question: "What age are these for?",
        answer:
          "Age 3 through kindergarten (around age 6). The easier sheets work for toddlers and the harder ones for kindergarten.",
      },
      {
        question: "Are they really free?",
        answer:
          "Yes. All JiggyJoy worksheets are free to download, print and copy.",
      },
    ],
    linkedGameSlugs: ["shape-sorter", "pattern-wizard", "colour-match"],
    linkedWorksheetSlugs: ["shapes-worksheets", "pattern-worksheets", "preschool-math-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "sight-words",
    keyword: "free sight words worksheets",
    searchVolume: 10000,
    h1: "Free Sight Words Worksheets — Printable PDF",
    title: "Free Sight Words Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable sight words worksheets. Dolch list for Kindergarten, Grade 1 and Grade 2. Read, trace and write. No signup, instant download.",
    intro: [
      "Sight words are the 100 or so most common words in English — 'the', 'and', 'to', 'of', 'you' — and learning them is different from learning to sound out words. You can't sound out 'the'. You either know it on sight or you don't, and fluent reading depends on knowing almost all of them automatically.",
      "The worksheets on this page are built around the Dolch sight word list, which is the standard used in most US and UK classrooms. Each sheet focuses on a small group of words with three activities: read the word, trace the word, write the word in your own handwriting. That triple-reinforcement approach is how sight words get moved from 'I recognise this' to 'automatic'.",
      "Pair with Word Spell for on-screen reading practice and our letter tracing worksheets for handwriting support. Start with the Kindergarten list (around 40 words), move to the Grade 1 list (around 40 more), and finish with Grade 2 before the child is 'done' with the Dolch corpus. Everything is free, instant, and safe for classroom use.",
    ],
    faqs: [
      {
        question: "What are sight words?",
        answer:
          "Sight words are high-frequency words that children are expected to recognise by sight rather than sound out. The Dolch list and Fry list are the two most common sight word lists used in schools.",
      },
      {
        question: "How many sight words should a kindergartener know?",
        answer:
          "Most kindergarten curricula target around 40 sight words by end of year, covering the simplest Dolch list (the, and, to, I, a, is, you, etc.).",
      },
      {
        question: "Do these worksheets use the Dolch list?",
        answer:
          "Yes — all our sight word worksheets are based on the standard Dolch sight word list, grouped by grade level.",
      },
      {
        question: "Can I combine these with a reading game?",
        answer:
          "Yes — our Word Spell game works well as a complement to sight word worksheets. Different activation, same vocabulary.",
      },
    ],
    linkedGameSlugs: ["word-spell", "alphabet-match", "bubble-pop-abc"],
    linkedWorksheetSlugs: ["sight-words-worksheets", "rhyming-words-worksheets", "letter-tracing-worksheets", "alphabet-worksheets"],
    linkedColoringCategorySlugs: [],
  },
  {
    slug: "multiplication",
    keyword: "free multiplication worksheets",
    searchVolume: 10000,
    h1: "Free Multiplication Worksheets — Printable PDF",
    title: "Free Multiplication Worksheets (Printable PDF) | JiggyJoy",
    metaDescription:
      "Free printable multiplication worksheets — times tables 1 to 12 with answer keys. Grade 2, 3, 4. No signup, instant PDF download.",
    intro: [
      "Times tables fluency is the single most useful thing a child learns in primary school maths. Once multiplication facts are automatic, everything after — long multiplication, division, fractions, algebra — gets dramatically easier. Kids who don't memorise their times tables struggle with every maths topic for the next ten years.",
      "This page collects our free multiplication worksheets in one place. Sheets are organised by times table (2s, 5s, 10s are easy; 3s, 4s, 6s are medium; 7s, 8s, 9s are hard; 11s and 12s round out the set). Each sheet has 30+ problems with an answer key at the bottom, and is sized to fit on a single page for fast printing.",
      "Written practice is essential, but it's not sufficient on its own — fluency comes from speed, and speed comes from games. Pair these worksheets with our Times Tables Challenge and Multiplication Blast games for timed practice. 10 minutes of worksheets plus 10 minutes of timed games daily will get a Grade 3 child fluent in a month. Everything is free and classroom-safe.",
    ],
    faqs: [
      {
        question: "At what grade should a child learn times tables?",
        answer:
          "Multiplication is usually introduced in Grade 2 and times tables are drilled through Grade 3 and Grade 4. Fluency up to 12×12 by end of Grade 4 is a common goal.",
      },
      {
        question: "Which times tables should a child learn first?",
        answer:
          "The 2s, 5s and 10s are easiest and are usually taught first. Then 3s, 4s and 11s. The hardest are 6s, 7s, 8s, 9s and 12s — save these for last and drill them with games.",
      },
      {
        question: "Do these include answer keys?",
        answer:
          "Yes — every multiplication worksheet has an answer key at the bottom of the page for easy parent/teacher marking.",
      },
      {
        question: "Can I combine with online multiplication games?",
        answer:
          "Yes — we strongly recommend pairing our worksheets with Times Tables Challenge and Multiplication Blast. Written plus timed practice builds fluency faster than either alone.",
      },
    ],
    linkedGameSlugs: ["times-tables-challenge", "multiplication-blast", "maths-play", "math-quiz"],
    linkedWorksheetSlugs: ["multiplication-worksheets", "grade-2-math-worksheets", "grade-3-math-worksheets"],
    linkedColoringCategorySlugs: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getActivityPageBySlug(slug: string): ProgrammaticPage | undefined {
  return activityPages.find((p) => p.slug === slug);
}

export function getFreeWorksheetTopicBySlug(slug: string): ProgrammaticPage | undefined {
  return freeWorksheetTopics.find((p) => p.slug === slug);
}
