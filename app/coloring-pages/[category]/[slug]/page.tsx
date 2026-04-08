import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coloringCategories, getCategoryBySlug, getAllColoringPages } from "@/lib/data";
import PrintButton from "@/components/PrintButton";
import ColoringCanvas from "@/components/ColoringCanvas";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  return getAllColoringPages().map((page) => ({
    category: page.category,
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAllColoringPages().find((p) => p.slug === slug);
  if (!page) return {};
  return {
    title: `${page.title} — Free Printable`,
    description: page.description,
    keywords: [...page.tags, "free printable", "coloring page", "print and colour"],
  };
}

export default async function ColoringPageDetail({ params }: Props) {
  const { category, slug } = await params;
  const cat = getCategoryBySlug(category);
  const page = getAllColoringPages().find((p) => p.slug === slug);
  if (!cat || !page) notFound();

  // Related pages from same category
  const related = cat.pages.filter((p) => p.slug !== slug).slice(0, 4);

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-600">Home</Link>
          {" / "}
          <Link href="/coloring-pages" className="hover:text-purple-600">Coloring Pages</Link>
          {" / "}
          <Link href={`/coloring-pages/${cat.slug}`} className="hover:text-purple-600">{cat.title}</Link>
          {" / "}
          <span className="text-gray-800 font-medium">{page.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main coloring area */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{page.title}</h1>
          <p className="text-gray-500 mb-4">{page.description}</p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <PrintButton />
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-purple-200 text-purple-700 rounded-full font-semibold hover:bg-purple-50 transition-colors text-sm"
            >
              ⬇️ Download PDF
            </a>
          </div>

          {/* Interactive or static coloring image */}
          <ColoringCanvas slug={page.slug} title={page.title} emoji={cat.icon} />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {page.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">How to Use</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Click <strong>Print Page</strong> to print directly</li>
              <li>Or click <strong>Download PDF</strong> to save</li>
              <li>Use crayons, coloured pencils or markers</li>
              <li>Share your coloured creation!</li>
            </ol>
          </div>

          {/* Related pages */}
          {related.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">More {cat.title}</h3>
              <div className="space-y-2">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/coloring-pages/${cat.slug}/${rel.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{rel.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other categories */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Other Categories</h3>
            <div className="space-y-2">
              {coloringCategories
                .filter((c) => c.slug !== cat.slug)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/coloring-pages/${c.slug}`}
                    className={`${c.color} flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-80 transition-opacity`}
                  >
                    {c.icon} {c.title}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
