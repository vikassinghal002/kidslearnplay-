import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coloringCategories, getCategoryBySlug } from "@/lib/data";
import ColoringThumbnail from "@/components/ColoringThumbnail";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  return coloringCategories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.title} — Free Printable`,
    description: cat.description,
    keywords: [cat.keywords, "free printable", "coloring pages", "printable coloring sheets"],
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  return (
    <div>
      {/* Header */}
      <section className={`${cat.color} py-12 px-4`}>
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-purple-600">Home</Link>
            {" / "}
            <Link href="/coloring-pages" className="hover:text-purple-600">Coloring Pages</Link>
            {" / "}
            <span className="text-gray-800 font-medium">{cat.title}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{cat.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{cat.title}</h1>
              <p className="text-gray-600 mt-1">{cat.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pages Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-gray-500 mb-6 text-sm">
          Showing {cat.pages.length} free printable {cat.title.toLowerCase()}. Click any image to download and print.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cat.pages.map((page) => (
            <Link
              key={page.slug}
              href={`/coloring-pages/${cat.slug}/${page.slug}`}
              className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white"
            >
              <ColoringThumbnail slug={page.slug} title={page.title} fallbackEmoji={cat.icon} />
              <div className="p-3">
                <h2 className="font-semibold text-gray-800 text-sm">{page.title}</h2>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    Free
                  </span>
                  <span className="text-xs text-gray-500">Printable PDF</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Related categories */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">More Coloring Pages</h2>
          <div className="flex flex-wrap gap-3">
            {coloringCategories
              .filter((c) => c.slug !== cat.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/coloring-pages/${c.slug}`}
                  className={`${c.color} px-4 py-2 rounded-full font-medium text-sm hover:scale-105 transition-transform`}
                >
                  {c.icon} {c.title}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
