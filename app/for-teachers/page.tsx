import type { Metadata } from "next";
import Link from "next/link";
import {
  JsonLd,
  breadcrumbSchema,
  faqPageSchema,
  collectionPageSchema,
} from "@/lib/schemas";
import CopyButton from "@/components/CopyButton";

const BASE_URL = "https://www.jiggyjoy.com";

export const metadata: Metadata = {
  title: "For Teachers — Free Worksheets, Games & Coloring Pages for Your Classroom",
  description:
    "JiggyJoy is free for teachers, librarians and homeschoolers. Print our worksheets, share our games, and grab a free badge to link to JiggyJoy from your blog or class site.",
  alternates: { canonical: `${BASE_URL}/for-teachers` },
  openGraph: {
    title: "For Teachers — Free Worksheets, Games & Coloring Pages",
    description:
      "Free for classrooms, libraries and homeschoolers. No accounts, no ads at kids, fully printable.",
    url: `${BASE_URL}/for-teachers`,
    type: "article",
  },
};

const TEACHER_FAQS = [
  {
    question: "Can I use JiggyJoy worksheets in my classroom?",
    answer:
      "Yes — every worksheet, game and coloring page on JiggyJoy is free for non-commercial classroom, library and homeschool use. Print as many copies as you need, share the link with parents, project the games on a smartboard. No permission needed.",
  },
  {
    question: "Do my students need accounts to play the games?",
    answer:
      "No. JiggyJoy never asks kids for an email, a password, or any personal information. Open the link and play. This is a deliberate COPPA-conscious design choice.",
  },
  {
    question: "Are there any ads shown to kids?",
    answer:
      "No advertising is targeted at children on JiggyJoy. The site is built so a child can use it from start to finish without seeing an ad aimed at them.",
  },
  {
    question: "Can I link to JiggyJoy from my school or class blog?",
    answer:
      "Please do — it helps other teachers find us. Grab one of the free copy-paste badges below and paste it into your blog, class newsletter or school site. The badge links back to JiggyJoy and helps us stay free.",
  },
  {
    question: "How much does JiggyJoy cost?",
    answer:
      "Nothing. JiggyJoy is 100% free, with no premium tier and no plan to add one. Donations of a backlink, a tweet or a kind word from a teacher are the only currency we accept.",
  },
];

// Pre-rendered badge HTML snippets — three sizes so a teacher can pick whichever
// fits their blog sidebar / footer / class page header.
const BADGES = [
  {
    id: "small",
    label: "Small (180 × 50)",
    note: "Perfect for blog sidebars and email signatures.",
    html: `<a href="https://www.jiggyjoy.com" target="_blank" rel="noopener" title="Free games, coloring pages and worksheets for kids — JiggyJoy">
  <img src="https://www.jiggyjoy.com/badge/jiggyjoy-180x50.png" alt="Free kids games, coloring pages and worksheets — JiggyJoy" width="180" height="50" />
</a>`,
  },
  {
    id: "medium",
    label: "Medium (300 × 90)",
    note: "Great for class blog footers and resource pages.",
    html: `<a href="https://www.jiggyjoy.com" target="_blank" rel="noopener" title="Free games, coloring pages and worksheets for kids — JiggyJoy">
  <img src="https://www.jiggyjoy.com/badge/jiggyjoy-300x90.png" alt="Free kids games, coloring pages and worksheets — JiggyJoy" width="300" height="90" />
</a>`,
  },
  {
    id: "text",
    label: "Text link (no image)",
    note: "Cleanest option — looks good in any layout, accessible by default.",
    html: `<p>
  We use <a href="https://www.jiggyjoy.com" target="_blank" rel="noopener">JiggyJoy</a> for free printable worksheets, games and coloring pages — no signup, no ads aimed at kids.
</p>`,
  },
];

const TEACHER_RESOURCES = [
  {
    href: "/worksheets",
    title: "Free Worksheets",
    desc: "Printable PDF worksheets — math, alphabet, tracing, reading, science. Sorted by grade.",
    emoji: "📄",
  },
  {
    href: "/coloring-pages",
    title: "Free Coloring Pages",
    desc: "Hundreds of printable coloring sheets — animals, characters, holidays, vehicles.",
    emoji: "🎨",
  },
  {
    href: "/games",
    title: "Free Educational Games",
    desc: "Browser-based games for ages 2–14. Math, alphabet, memory, arcade. Smartboard-friendly.",
    emoji: "🎮",
  },
  {
    href: "/learn",
    title: "How-to-Teach Guides",
    desc: "Plain-English guides on teaching multiplication, phonics, addition and more.",
    emoji: "📚",
  },
  {
    href: "/printables",
    title: "Activity Packs",
    desc: "Themed bundles — Halloween word search, Christmas coloring bundle, Easter activity pack.",
    emoji: "🎁",
  },
];

export default function ForTeachersPage() {
  return (
    <div>
      <JsonLd
        data={collectionPageSchema({
          name: "For Teachers — Free Resources from JiggyJoy",
          description:
            "Free worksheets, games and coloring pages for classrooms, libraries and homeschoolers.",
          url: "/for-teachers",
          numberOfItems: TEACHER_RESOURCES.length,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "For Teachers", url: "/for-teachers" },
        ])}
      />
      <JsonLd data={faqPageSchema(TEACHER_FAQS)} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-14 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4" aria-hidden="true">🍎</div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
            Free for your classroom.<br />
            <span className="text-yellow-200">Forever.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/95 font-semibold mb-6 max-w-2xl mx-auto">
            JiggyJoy is free for teachers, librarians and homeschoolers. Print
            our worksheets, share our games, project our coloring pages on a
            smartboard. No accounts, no ads at kids, no catch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/worksheets"
              className="px-7 py-3 bg-yellow-300 text-emerald-900 font-extrabold rounded-full text-lg hover:bg-yellow-200 transition-colors"
            >
              📄 Browse Worksheets
            </Link>
            <a
              href="#badges"
              className="px-7 py-3 bg-white/15 border-2 border-white text-white font-extrabold rounded-full text-lg hover:bg-white/25 transition-colors"
            >
              🔗 Get a Free Badge
            </a>
          </div>
        </div>
      </section>

      {/* What teachers get */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-2 text-center">
          Everything is free. No exceptions.
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Five resource libraries, all browser-based, all printable, all
          classroom-friendly. Pick a card to jump in.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEACHER_RESOURCES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group block rounded-3xl bg-white border-2 border-gray-100 p-6 hover:border-emerald-300 hover:shadow-xl transition-all"
            >
              <div className="text-5xl mb-3" aria-hidden="true">{r.emoji}</div>
              <h3 className="font-extrabold text-gray-900 text-xl mb-2 group-hover:text-emerald-600 transition-colors">
                {r.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Permission strip */}
      <section className="bg-emerald-50 border-y border-emerald-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl font-extrabold text-emerald-900 mb-4">
            ✅ Permission, in plain English
          </h2>
          <ul className="space-y-3 text-emerald-900/90">
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                <strong>Print as many copies as you need.</strong> For your class,
                your library, your homeschool group, your tutoring sessions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                <strong>Share the links freely</strong> with parents, students and
                colleagues. Email them, post them on Google Classroom, project
                them on a smartboard.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                <strong>Use them in lesson plans</strong> — credit JiggyJoy with a
                link if you publish the lesson plan online.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold">•</span>
              <span>
                <strong>One ask:</strong> please don't repost the worksheet PDFs
                on a paid site or sell them. JiggyJoy stays free because the
                originals stay here.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Badges */}
      <section id="badges" className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-2 text-center">
          🔗 Free Badges — Help Other Teachers Find Us
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Pick a badge, copy the snippet, paste it into your class blog or
          school resource page. Every link helps another teacher find a free
          alternative to paid worksheet sites.
        </p>

        <div className="space-y-6">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className="rounded-3xl bg-white border-2 border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">
                    {badge.label}
                  </h3>
                  <p className="text-gray-500 text-sm">{badge.note}</p>
                </div>
                <CopyButton text={badge.html} label="Copy snippet" />
              </div>
              <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">
                {badge.html}
              </pre>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          The badge images sit at <code className="bg-gray-100 px-2 py-0.5 rounded">jiggyjoy.com/badge/</code>{" "}
          and load instantly. Free forever, no tracking, no JS.
        </p>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-extrabold text-gray-900 mb-6 text-center">
            Teacher FAQ
          </h2>
          <div className="space-y-4">
            {TEACHER_FAQS.map((qa) => (
              <details
                key={qa.question}
                className="group rounded-2xl bg-white border border-gray-200 p-5"
              >
                <summary className="font-bold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {qa.question}
                  <span className="text-emerald-600 group-open:rotate-45 transition-transform text-2xl leading-none">+</span>
                </summary>
                <p className="text-gray-600 mt-3 leading-relaxed">{qa.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold mb-3">Save this page</h2>
          <p className="text-emerald-100 mb-6">
            Bookmark <code className="bg-emerald-800 px-2 py-1 rounded">jiggyjoy.com/for-teachers</code>{" "}
            and share it with one colleague who's tired of paying for worksheets.
          </p>
          <Link
            href="/worksheets"
            className="px-8 py-3 bg-white text-emerald-700 font-extrabold rounded-full text-lg hover:bg-emerald-50 transition-colors inline-block"
          >
            📄 Start with Worksheets →
          </Link>
        </div>
      </section>
    </div>
  );
}
