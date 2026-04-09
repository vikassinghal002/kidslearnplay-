import type { Metadata } from "next";
import Link from "next/link";
import { coloringCategories, getAllColoringPages } from "@/lib/data";
import { getBulkCategories, getBulkTotal } from "@/lib/bulk-data";

export const metadata: Metadata = {
  title: "Free Printable Coloring Pages for Kids",
  description:
    "Hundreds of free printable coloring pages for kids — animals, characters, holidays, and more. Download and print instantly, no signup needed!",
  keywords: [
    "free coloring pages",
    "printable coloring pages",
    "coloring sheets",
    "kids coloring pages",
    "free printable coloring pages",
  ],
};

export default function ColoringPagesHubPage() {
  const allPages   = getAllColoringPages();
  const bulkCats   = getBulkCategories();
  const bulkTotal  = getBulkTotal();
  const grandTotal = allPages.length + bulkTotal;

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            🎨 Free Coloring Pages
          </h1>
          <p className="text-lg text-white/90">
            {grandTotal.toLocaleString()}+ free printable coloring pages for kids and adults.
            Print instantly — no login, no cost.
          </p>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coloringCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/coloring-pages/${cat.slug}`}
              className={`${cat.color} rounded-2xl p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform shadow-sm`}
            >
              <span className="text-6xl">{cat.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-xl mb-1">{cat.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{cat.description}</p>
                <span className="inline-block text-xs bg-white/60 text-gray-700 px-3 py-1 rounded-full font-medium">
                  {cat.pages.length} free pages →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bulk Categories (shown only when manifest has images) */}
      {bulkCats.length > 0 && (
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">More Coloring Pages</h2>
                <p className="text-gray-500 text-sm mt-1">{bulkTotal.toLocaleString()} additional pages across all categories</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bulkCats.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/coloring-pages/${cat.slug}`}
                  className={`${cat.color} rounded-2xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform shadow-sm`}
                >
                  <span className="text-4xl mb-2">{cat.icon}</span>
                  <h3 className="font-bold text-gray-800 text-sm">{cat.title}</h3>
                  <span className="text-xs text-gray-500 mt-1">{cat.count.toLocaleString()} pages</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Pages */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Popular Coloring Pages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allPages.slice(0, 12).map((page) => {
              const cat = coloringCategories.find((c) => c.slug === page.category)!;
              return (
                <Link
                  key={page.slug}
                  href={`/coloring-pages/${page.category}/${page.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:border-purple-300 hover:shadow-sm transition-all text-center"
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-gray-800 text-sm">{page.title}</h3>
                  <span className="text-xs text-purple-600 font-medium mt-1 block">Free printable</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEO Info Block */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Free Printable Coloring Pages — About
        </h2>
        <div className="prose text-gray-600 leading-relaxed space-y-4">
          <p>
            KidsLearnPlay offers hundreds of <strong>free printable coloring pages</strong> for
            children of all ages. Our coloring sheets are designed to be simple enough for
            toddlers yet detailed enough for older kids and adults.
          </p>
          <p>
            Every coloring page is completely <strong>free to download and print</strong>.
            No subscription, no email, no watermarks. Just click, print, and colour!
          </p>
          <p>
            We add new coloring pages every week covering popular characters like{" "}
            <Link href="/coloring-pages/characters/hello-kitty-coloring-pages" className="text-purple-600 hover:underline">
              Hello Kitty
            </Link>,{" "}
            <Link href="/coloring-pages/characters/pokemon-coloring-pages" className="text-purple-600 hover:underline">
              Pokemon
            </Link>, and{" "}
            <Link href="/coloring-pages/characters/bluey-coloring-pages" className="text-purple-600 hover:underline">
              Bluey
            </Link>, as well as holiday themes for{" "}
            <Link href="/coloring-pages/holidays/christmas-coloring-pages" className="text-purple-600 hover:underline">
              Christmas
            </Link> and{" "}
            <Link href="/coloring-pages/holidays/easter-coloring-pages" className="text-purple-600 hover:underline">
              Easter
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
