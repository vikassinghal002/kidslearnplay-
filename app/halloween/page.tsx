import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { games, coloringCategories, getCategoryBySlug } from "@/lib/data";

const BASE_URL = "https://www.jiggyjoy.com";
const CANONICAL = `${BASE_URL}/halloween`;

export const metadata: Metadata = {
  title: "Halloween Games, Coloring Pages & Worksheets for Kids — Free | JiggyJoy",
  description:
    "Free Halloween games for kids, printable Halloween coloring pages and spooky worksheets. No signup, no ads aimed at children. Pumpkins, ghosts, witches and more — perfect for ages 3–12.",
  keywords: [
    "halloween games for kids",
    "halloween games for kids free",
    "halloween coloring pages",
    "halloween worksheets",
    "halloween activities for kids",
    "free halloween printables",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Halloween Games, Coloring Pages & Worksheets for Kids — Free",
    description:
      "Free Halloween games, printable coloring pages and spooky worksheets for kids. Pumpkins, ghosts, witches and more — no signup required.",
    url: CANONICAL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Halloween Games & Printables for Kids — Free",
    description:
      "Free Halloween games, coloring pages and worksheets for kids. Pumpkins, ghosts, witches and more.",
  },
};

// ── FAQ data ──────────────────────────────────────────────────────────────
const halloweenFaqs = [
  {
    question: "Are these Halloween games safe for young children?",
    answer:
      "Yes. Every Halloween game on JiggyJoy uses friendly, cartoon-style artwork — no jump scares, no gore and no frightening sounds. Games like Pumpkin Smash use a whack-a-mole format with cute pumpkins and ghosts that kids aged 4 and up enjoy without getting scared. There are no third-party ads targeted at children and no signup forms.",
  },
  {
    question: "Can I print the Halloween coloring pages for free?",
    answer:
      "Yes — all of our Halloween coloring pages are completely free to print, with no watermarks and no email required. Open the page, click print, and your child has a spooky activity ready in seconds. For best results print on 80gsm paper or thicker so markers don't bleed through.",
  },
  {
    question: "What age are the Halloween games and activities for?",
    answer:
      "We recommend the Halloween hub for ages 3 to 12. Toddlers and preschoolers enjoy the friendly ghost and pumpkin coloring pages; ages 5–8 love the arcade-style Pumpkin Smash game; and older kids (8–12) can tackle more detailed coloring sheets and witch-themed printables. Every activity lists a suggested age range.",
  },
  {
    question: "Do I need to sign up or create an account?",
    answer:
      "No. JiggyJoy is free and signup-free. You don't need an email address, a parent account or a subscription — just open the page and start playing, printing or coloring. We built the site this way specifically so parents and teachers can hand a tablet to a child without worrying about data collection.",
  },
  {
    question: "When should I start Halloween activities with my child?",
    answer:
      "Most families start Halloween crafts and coloring in late September or early October, with games and decorations picking up through the month. Early October is ideal — children get about four weeks of Halloween excitement without rushing, and you'll have plenty of printable coloring pages to rotate through the weeks leading up to the 31st.",
  },
  {
    question: "Are there more Halloween games coming?",
    answer:
      "Yes. We're actively building more Halloween-themed games for the 2026 season, including a ghost maze adventure and a witch's potion match-3 puzzle. Check back in September or follow our updates to be the first to play.",
  },
];

// ── Curated activity tips ─────────────────────────────────────────────────
const halloweenActivities: string[] = [
  "Host a pumpkin decorating party using paint, googly eyes and glitter — a mess-free alternative to carving for younger children.",
  "Print out our Halloween coloring pages and turn them into homemade bunting by punching holes in the top and threading ribbon through.",
  "Set up a spooky sensory bin with black beans, plastic spiders, mini pumpkins and a measuring cup for pouring play.",
  "Bake pumpkin cookies together and let kids decorate with orange and black icing — a sneaky counting lesson if you practice measuring.",
  "Create a Halloween scavenger hunt around the house or garden with printed clues leading to a small treat.",
  "Make ghost finger puppets from old socks and put on a mini puppet show — great for speech and storytelling practice.",
  "Try Halloween-themed letter tracing — print tracing worksheets with spooky borders for letter recognition practice.",
  "Play a Halloween freeze dance — pause the music and kids freeze in a spooky pose. Gross motor wins on a rainy afternoon.",
  "Craft paper plate pumpkin masks using orange paint, black triangle eyes and a green pipe-cleaner stem.",
  "Count the candy — a classic post-trick-or-treat lesson in sorting, grouping and basic addition.",
  "Read a Halloween picture book before bed (not too scary!) to wind down after a sugar-filled day.",
  "Make a gratitude pumpkin: write one thing your child is thankful for on a paper pumpkin every day in October.",
];

export default function HalloweenHubPage() {
  // Pull halloween games from lib/data (only those tagged "halloween").
  const halloweenGames = games.filter((g) =>
    (g.tags ?? []).some((t) => t.toLowerCase() === "halloween")
  );

  // Pull halloween coloring pages from the holidays category.
  const holidays = getCategoryBySlug("holidays");
  const halloweenColoringPages = (holidays?.pages ?? []).filter((p) =>
    (p.tags ?? []).some((t) => t.toLowerCase() === "halloween")
  );

  // Also include the fantasy witch coloring as a bonus.
  const fantasy = getCategoryBySlug("fantasy");
  const fantasyWitchPage = (fantasy?.pages ?? []).find(
    (p) =>
      p.slug === "witch-coloring-pages" ||
      (p.tags ?? []).some((t) => t.toLowerCase() === "halloween")
  );

  // Pull some kid-friendly coloring categories to suggest alongside.
  const suggestedCategories = coloringCategories
    .filter((c) =>
      ["holidays", "fantasy", "cozy-animals", "bold-easy"].includes(c.slug)
    )
    .slice(0, 4);

  // ── JSON-LD ────────────────────────────────────────────────────────────
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Halloween Games & Printables for Kids",
    description:
      "Free Halloween games for kids, printable Halloween coloring pages and spooky worksheets. Pumpkins, ghosts, witches and more.",
    url: CANONICAL,
    isPartOf: {
      "@type": "WebSite",
      name: "JiggyJoy",
      url: BASE_URL,
    },
    about: {
      "@type": "Thing",
      name: "Halloween activities for children",
    },
    hasPart: [
      ...halloweenGames.map((g) => ({
        "@type": "Game",
        name: g.title,
        url: `${BASE_URL}/games/${g.slug}`,
        description: g.description,
        audience: { "@type": "PeopleAudience", suggestedMinAge: 4 },
      })),
      ...halloweenColoringPages.map((p) => ({
        "@type": "CreativeWork",
        name: p.title,
        url: `${BASE_URL}/coloring-pages/${p.category}/${p.slug}`,
        description: p.description,
      })),
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: halloweenFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Halloween", item: CANONICAL },
    ],
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <Script
        id="ld-collection"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-orange-600 via-amber-700 to-purple-900 py-16 px-4 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[12rem] leading-none pointer-events-none select-none">
          <div className="absolute top-4 left-6">🎃</div>
          <div className="absolute top-4 right-6">👻</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">🦇</div>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <nav className="text-sm text-white/80 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <span className="text-white font-medium">Halloween</span>
          </nav>
          <div className="text-5xl md:text-6xl mb-3">🎃 👻 🦇</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Halloween Games &amp; Printables for Kids
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
            Free Halloween games, printable coloring pages and spooky worksheets —
            pumpkins, ghosts, witches and more. No signup, no scary ads. Perfect
            for ages 3–12.
          </p>
          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            <span className="bg-black/30 px-4 py-2 rounded-full">✓ 100% Free</span>
            <span className="bg-black/30 px-4 py-2 rounded-full">✓ No Signup</span>
            <span className="bg-black/30 px-4 py-2 rounded-full">✓ Kid-Safe</span>
            <span className="bg-black/30 px-4 py-2 rounded-full">✓ Print &amp; Play</span>
          </div>
        </div>
      </section>

      {/* Intro copy */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed">
          <p className="mb-5">
            Halloween is one of the most magical times of the year for children —
            a rare holiday where dressing up, being a little bit scared and
            eating far too much candy are all officially encouraged. But as any
            parent of a three-year-old knows, a whole month of pumpkin season
            also needs filling with activities that aren&apos;t too spooky, cost
            nothing, and can be pulled out at 4pm on a rainy Saturday. That&apos;s
            what this Halloween hub is for. Every game, coloring page, worksheet
            and tip on this page is 100% free, signup-free, and built for kids
            from toddlers to tweens.
          </p>
          <p className="mb-5">
            Younger children (ages 3–5) get the most out of our{" "}
            <Link href="/coloring-pages/holidays" className="text-orange-400 hover:text-orange-300 underline">
              Halloween coloring pages
            </Link>{" "}
            — big bold outlines of friendly ghosts, smiling jack-o&apos;-lanterns
            and witches on broomsticks that small hands can fill in successfully.
            Preschoolers also love{" "}
            <Link href="/games/pumpkin-smash" className="text-orange-400 hover:text-orange-300 underline">
              Pumpkin Smash
            </Link>
            , our whack-a-mole style arcade game that rewards quick taps with
            satisfying combo effects — all with cartoon artwork nobody finds
            actually scary. Older children (ages 6–12) can enjoy more detailed
            coloring pages, Halloween-themed worksheets and creative craft
            activities.
          </p>
          <p className="mb-5">
            Halloween activities aren&apos;t just about entertainment. Coloring
            develops fine motor skills; counting candy teaches early math;
            spooky stories build reading confidence; and dressing up nurtures
            imaginative play that researchers link to stronger language
            development. Every activity on this page is picked with those
            benefits in mind — fun first, learning always. Browse the games,
            download the printables, and make this October the one where your
            child asks for &quot;just one more round&quot; instead of complaining about
            screen time limits. Ready? Let&apos;s get spooky.
          </p>
        </div>
      </section>

      {/* Halloween games */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          🎃 Free Halloween Games for Kids
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Spooky arcade fun with cartoon artwork — no jump scares, no ads, no
          signup. Perfect for ages 4 and up.
        </p>
        {halloweenGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {halloweenGames.map((g) => (
              <Link
                key={g.slug}
                href={`/games/${g.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-4xl mb-3">🎃</div>
                <div className="text-xs uppercase tracking-wide text-orange-400 font-semibold mb-2">
                  {g.category}
                </div>
                <div className="text-lg font-bold text-white mb-2">{g.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{g.description}</div>
                <div className="text-xs text-gray-500 mt-3">
                  Ages {g.ageRange} · {g.difficulty}
                </div>
              </Link>
            ))}
          </div>
        ) : null}
        <div className="mt-6 bg-gray-900 border border-dashed border-gray-700 rounded-2xl p-6 text-gray-300">
          <strong className="text-orange-300">More Halloween games coming soon.</strong>{" "}
          We&apos;re building a ghost maze adventure and a witch&apos;s potion
          match-3 for the 2026 season. In the meantime, browse our{" "}
          <Link href="/games" className="text-orange-400 hover:text-orange-300 underline">
            full games library
          </Link>{" "}
          — many of the arcade games (like{" "}
          <Link href="/games/snake" className="text-orange-400 hover:text-orange-300 underline">
            Snake
          </Link>{" "}
          and{" "}
          <Link href="/games/dino-run" className="text-orange-400 hover:text-orange-300 underline">
            Dino Run
          </Link>
          ) fit nicely into a spooky evening of play.
        </div>
      </section>

      {/* Halloween coloring pages */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          👻 Printable Halloween Coloring Pages
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Friendly ghosts, jack-o&apos;-lanterns and witches with bold outlines
          that small hands can fill in. Print as many copies as you like — they&apos;re
          all free.
        </p>
        {(halloweenColoringPages.length > 0 || fantasyWitchPage) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {halloweenColoringPages.map((p) => (
              <Link
                key={p.slug}
                href={`/coloring-pages/${p.category}/${p.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-4xl mb-3">🎃</div>
                <div className="text-xs uppercase tracking-wide text-orange-400 font-semibold mb-2">
                  Halloween
                </div>
                <div className="text-lg font-bold text-white mb-2">{p.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{p.description}</div>
              </Link>
            ))}
            {fantasyWitchPage && (
              <Link
                key={fantasyWitchPage.slug}
                href={`/coloring-pages/${fantasyWitchPage.category}/${fantasyWitchPage.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-4xl mb-3">🧙‍♀️</div>
                <div className="text-xs uppercase tracking-wide text-purple-400 font-semibold mb-2">
                  Fantasy · Halloween
                </div>
                <div className="text-lg font-bold text-white mb-2">{fantasyWitchPage.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{fantasyWitchPage.description}</div>
              </Link>
            )}
          </div>
        )}
        <p className="text-gray-400 text-sm">
          Looking for more? Head over to our{" "}
          <Link href="/coloring-pages/holidays" className="text-orange-400 hover:text-orange-300 underline">
            Holiday coloring category
          </Link>{" "}
          for Christmas, Easter, Diwali and more seasonal printables. Parents of
          older kids should also check the{" "}
          <Link href="/coloring-pages/fantasy" className="text-orange-400 hover:text-orange-300 underline">
            Fantasy coloring pages
          </Link>{" "}
          for more detailed witches, dragons and haunted castles.
        </p>
      </section>

      {/* Suggested categories */}
      {suggestedCategories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Related Coloring Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/coloring-pages/${c.slug}`}
                className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-pink-500 hover:bg-gray-800 transition-colors"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="text-lg font-bold text-white mb-2">{c.title}</div>
                <div className="text-sm text-gray-400 line-clamp-3">{c.description}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Halloween worksheets */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          📝 Halloween Worksheets &amp; Activities
        </h2>
        <p className="text-gray-400 mb-6 max-w-2xl">
          Spooky-themed worksheets are a great way to turn routine learning into
          a Halloween treat. While we&apos;re still building out our dedicated
          Halloween worksheet set, the activities below from our main library
          work beautifully with a pumpkin sticker and an orange pen.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/worksheets/letter-tracing-worksheets"
            className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500 hover:bg-gray-800 transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-orange-400 font-semibold mb-2">
              Writing
            </div>
            <div className="text-lg font-bold text-white mb-2">Letter Tracing Worksheets</div>
            <div className="text-sm text-gray-400">
              Trace A–Z with directional arrows — great for spelling &quot;pumpkin&quot;
              and &quot;ghost&quot; in October.
            </div>
          </Link>
          <Link
            href="/worksheets/counting-worksheets"
            className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500 hover:bg-gray-800 transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-orange-400 font-semibold mb-2">
              Math
            </div>
            <div className="text-lg font-bold text-white mb-2">Counting Worksheets</div>
            <div className="text-sm text-gray-400">
              Count and circle — perfect for counting candy, bats and pumpkins.
            </div>
          </Link>
          <Link
            href="/worksheets/color-by-number-worksheets"
            className="block bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-orange-500 hover:bg-gray-800 transition-colors"
          >
            <div className="text-xs uppercase tracking-wide text-orange-400 font-semibold mb-2">
              Art · Math
            </div>
            <div className="text-lg font-bold text-white mb-2">Colour by Number</div>
            <div className="text-sm text-gray-400">
              Reveal spooky pictures by colouring squares by number.
            </div>
          </Link>
        </div>
        <p className="text-gray-400 text-sm mt-4">
          Browse everything in our{" "}
          <Link href="/worksheets" className="text-orange-400 hover:text-orange-300 underline">
            printable worksheets library
          </Link>
          .
        </p>
      </section>

      {/* Activity tips */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          🦇 12 Halloween Activity Ideas for Home
        </h2>
        <p className="text-gray-400 mb-6">
          Low-prep Halloween activities you can pull together with things you
          already have at home. Mix and match to fill an afternoon — or a whole
          October week.
        </p>
        <ul className="space-y-3">
          {halloweenActivities.map((tip, i) => (
            <li
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-gray-300 leading-relaxed"
            >
              <span className="text-orange-400 font-bold mr-2">{i + 1}.</span>
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Halloween FAQs
        </h2>
        <div className="space-y-4">
          {halloweenFaqs.map((f, i) => (
            <details
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 group"
            >
              <summary className="font-semibold text-white cursor-pointer list-none flex items-center justify-between">
                <span>{f.question}</span>
                <span className="text-orange-400 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-gray-300 leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Internal linking footer */}
      <section className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold mb-6">
            Keep Exploring JiggyJoy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <Link
              href="/games"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Games →</div>
              <div className="text-gray-400">Free arcade, math and learning games</div>
            </Link>
            <Link
              href="/coloring-pages"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Colouring Pages →</div>
              <div className="text-gray-400">Hundreds of free printable sheets</div>
            </Link>
            <Link
              href="/worksheets"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 text-white"
            >
              <div className="font-bold mb-1">All Worksheets →</div>
              <div className="text-gray-400">Printable PDFs by grade and subject</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
