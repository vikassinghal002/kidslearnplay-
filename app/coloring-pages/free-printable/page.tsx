import type { Metadata } from "next";
import Link from "next/link";
import { coloringCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Printable Coloring Pages for Kids | JiggyJoy",
  description:
    "Thousands of free printable coloring pages for kids! Animals, characters, holidays, mandalas and more. Print instantly — no signup, no cost.",
};

export default function FreePrintableColoringPages() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 py-14 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 flex justify-center gap-3">
            <span>🖍️</span>
            <span>🎨</span>
            <span>🌈</span>
            <span>✏️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Free Printable Coloring Pages
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto text-white/90">
            Over 12,000 free coloring pages — print or colour online! Animals,
            holidays, characters, mandalas and more.
          </p>
        </div>
      </section>

      {/* Trust stats bar */}
      <div className="bg-purple-50 border-b border-purple-100 py-4 px-4">
        <p className="text-center text-sm font-semibold text-purple-700 tracking-wide">
          12,701 Coloring Pages · 100% Free · No Signup · Print Instantly
        </p>
      </div>

      {/* Category grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Browse All Categories
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Click any category to see free printable coloring pages — no login
          needed.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coloringCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/coloring-pages/${cat.slug}`}
              className={`${cat.color} rounded-2xl p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform shadow-sm`}
            >
              <span className="text-5xl flex-shrink-0">{cat.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {cat.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {cat.description}
                </p>
                <span className="inline-block text-xs bg-white/60 text-gray-700 px-3 py-1 rounded-full font-medium">
                  {cat.pages.length} free pages →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="max-w-3xl mx-auto px-4 pb-14">
        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Free Printable Coloring Pages for All Ages
            </h2>
            <p className="mb-3">
              JiggyJoy offers thousands of free printable coloring pages
              covering every theme imaginable — from simple animal outlines for
              toddlers to intricate mandala designs for adults and older children.
              Every page is available to download and print at no cost, with no
              account, subscription or email address required.
            </p>
            <p className="mb-3">
              Our collection spans popular characters like Bluey, Pokemon and
              Hello Kitty; seasonal themes for Christmas, Halloween and Easter;
              detailed mandalas for mindful colouring; and educational pages
              covering the alphabet, numbers and the solar system.
            </p>
            <p>
              Whether you are a parent looking for a rainy-day activity, a
              teacher preparing classroom resources, or an adult who enjoys
              therapeutic colouring, you will find something perfect here — and
              it is always free.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              How to Print Our Coloring Pages
            </h2>
            <p className="mb-3">
              Printing from JiggyJoy is straightforward. Open the coloring
              page you want, then use your browser's print function
              (Ctrl+P on Windows, Cmd+P on Mac) or tap the print icon on mobile.
              For the best results, select &quot;fit to page&quot; and choose
              white paper in portrait orientation. Most pages are designed for
              standard A4 or US Letter paper.
            </p>
            <p>
              You can also colour digitally on a tablet using a stylus — simply
              open the page in your browser and use a drawing or colouring app
              alongside it. All our images are high resolution, so they look
              crisp whether printed or used on screen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Why Kids Love Coloring
            </h2>
            <p className="mb-3">
              Colouring is one of the most beneficial activities for young
              children. It develops fine motor control, hand-eye coordination
              and pencil grip — all skills that directly support writing
              readiness. It also builds concentration and encourages children
              to sit with a task and complete it, which is increasingly valuable
              in a world of short-form distractions.
            </p>
            <p>
              Beyond the physical benefits, colouring stimulates creativity and
              self-expression. Choosing colours, deciding how to fill a page,
              and producing a finished artwork gives children a genuine sense of
              pride and accomplishment. And for adults, the repetitive focus of
              colouring is clinically associated with reduced anxiety and
              improved mindfulness.
            </p>
          </div>
        </div>
      </section>

      {/* Back links */}
      <section className="border-t border-gray-200 py-8 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/coloring-pages" className="text-purple-600 hover:underline">
            ← All Coloring Pages
          </Link>
          <Link href="/coloring-pages/easy" className="text-purple-600 hover:underline">
            Easy Coloring Pages →
          </Link>
          <Link href="/games" className="text-purple-600 hover:underline">
            Free Kids Games →
          </Link>
        </div>
      </section>
    </div>
  );
}
