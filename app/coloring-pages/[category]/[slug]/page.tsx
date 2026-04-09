import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coloringCategories, getCategoryBySlug, getAllColoringPages } from "@/lib/data";
import { getBulkPageBySlug, getBulkPagesByCategory, getBulkCategoryMeta } from "@/lib/bulk-data";
import PrintButton from "@/components/PrintButton";
import PinItButton from "@/components/PinItButton";
import ColoringCanvas from "@/components/ColoringCanvas";
import Image from "next/image";

const SITE_URL = "https://www.jiggyjoy.com";

type Props = { params: Promise<{ category: string; slug: string }> };

// Pre-generate only the curated 148 pages — bulk pages render dynamically
export async function generateStaticParams() {
  return getAllColoringPages().map((page) => ({
    category: page.category,
    slug: page.slug,
  }));
}

export const dynamicParams = true; // allow dynamic rendering for bulk slugs

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;

  const curated = getAllColoringPages().find((p) => p.slug === slug);
  if (curated) {
    const pageUrl = `${SITE_URL}/coloring-pages/${curated.category}/${curated.slug}`;
    const pinUrl  = `${SITE_URL}/pin/coloring/${curated.category}/${curated.slug}`;
    const title   = `${curated.title} — Free Printable`;
    return {
      title,
      description: curated.description,
      keywords: [...curated.tags, "free printable", "coloring page", "print and color"],
      alternates: { canonical: pageUrl },
      openGraph: {
        title,
        description: curated.description,
        url: pageUrl,
        type: "article",
        siteName: "JiggyJoy",
        images: [
          { url: pinUrl, width: 1000, height: 1500, alt: curated.title },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: curated.description,
        images: [pinUrl],
      },
      other: {
        "article:published_time": "2025-01-01T00:00:00Z",
        "article:author":         "JiggyJoy",
        "article:section":        "Coloring Pages",
        "pinterest:description":  curated.description,
        "pinterest:media":        pinUrl,
      },
    };
  }

  const bulk = getBulkPageBySlug(slug);
  if (bulk) {
    const pageUrl = `${SITE_URL}/coloring-pages/${bulk.category}/${bulk.slug}`;
    const pinUrl  = `${SITE_URL}/pin/coloring/${bulk.category}/${bulk.slug}`;
    const title   = `${bulk.title} — Free Printable Coloring Page`;
    const desc    = `Free printable ${bulk.title.toLowerCase()} — download and print instantly.`;
    return {
      title,
      description: desc,
      keywords: [...bulk.tags, "free printable", "coloring page"],
      alternates: { canonical: pageUrl },
      openGraph: {
        title,
        description: desc,
        url: pageUrl,
        type: "article",
        siteName: "JiggyJoy",
        images: [
          { url: pinUrl, width: 1000, height: 1500, alt: bulk.title },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: desc,
        images: [pinUrl],
      },
      other: {
        "article:published_time": "2025-01-01T00:00:00Z",
        "article:author":         "JiggyJoy",
        "article:section":        "Coloring Pages",
        "pinterest:description":  desc,
        "pinterest:media":        pinUrl,
      },
    };
  }

  // Reference `category` for the unused-var check (stable canonical even on 404)
  void category;
  return {};
}

export default async function ColoringPageDetail({ params }: Props) {
  const { category, slug } = await params;

  // ── Curated page ────────────────────────────────────────────────────────────
  const cat     = getCategoryBySlug(category);
  const curated = getAllColoringPages().find((p) => p.slug === slug);

  if (cat && curated) {
    const related = cat.pages.filter((p) => p.slug !== slug).slice(0, 4);
    const pageUrl     = `${SITE_URL}/coloring-pages/${cat.slug}/${curated.slug}`;
    const pinImageUrl = `${SITE_URL}/pin/coloring/${cat.slug}/${curated.slug}`;
    const pinDesc     = `${curated.title} — Free printable coloring page. ${curated.description} Print for free at jiggyjoy.com`;

    return (
      <div>
        <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-purple-600">Home</Link>{" / "}
            <Link href="/coloring-pages" className="hover:text-purple-600">Coloring Pages</Link>{" / "}
            <Link href={`/coloring-pages/${cat.slug}`} className="hover:text-purple-600">{cat.title}</Link>{" / "}
            <span className="text-gray-800 font-medium">{curated.title}</span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{curated.title}</h1>
            <p className="text-gray-500 mb-4">{curated.description}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <PrintButton />
              <a
                href="#"
                className="flex items-center gap-2 px-5 py-2.5 border-2 border-purple-200 text-purple-700 rounded-full font-semibold hover:bg-purple-50 transition-colors text-sm"
              >
                ⬇️ Download PDF
              </a>
              <PinItButton pageUrl={pageUrl} mediaUrl={pinImageUrl} description={pinDesc} />
            </div>

            <ColoringCanvas slug={curated.slug} title={curated.title} emoji={cat.icon} />

            <div className="flex flex-wrap gap-2 mt-6">
              {curated.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-3">How to Use</h3>
              <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                <li>Click <strong>Print Page</strong> to print directly</li>
                <li>Or click <strong>Download PDF</strong> to save</li>
                <li>Use crayons, colored pencils or markers</li>
                <li>Share your colored creation!</li>
              </ol>
            </div>

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

            <div>
              <h3 className="font-bold text-gray-900 mb-3">Other Categories</h3>
              <div className="space-y-2">
                {coloringCategories.filter((c) => c.slug !== cat.slug).map((c) => (
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

  // ── Bulk page ───────────────────────────────────────────────────────────────
  const bulk = getBulkPageBySlug(slug);
  if (!bulk) notFound();

  const bulkMeta = getBulkCategoryMeta(bulk.category);
  const related  = getBulkPagesByCategory(bulk.category, 1, 4).filter((p) => p.slug !== slug);
  const bulkPageUrl     = `${SITE_URL}/coloring-pages/${bulk.category}/${bulk.slug}`;
  const bulkPinImageUrl = `${SITE_URL}/pin/coloring/${bulk.category}/${bulk.slug}`;
  const bulkPinDesc     = `${bulk.title} — Free printable coloring page. Download and print instantly from jiggyjoy.com`;

  return (
    <div>
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-600">Home</Link>{" / "}
          <Link href="/coloring-pages" className="hover:text-purple-600">Coloring Pages</Link>{" / "}
          <Link href={`/coloring-pages/${bulk.category}`} className="hover:text-purple-600">{bulkMeta.title}</Link>{" / "}
          <span className="text-gray-800 font-medium">{bulk.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{bulk.title}</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <PrintButton />
            <PinItButton pageUrl={bulkPageUrl} mediaUrl={bulkPinImageUrl} description={bulkPinDesc} />
          </div>

          {/* Static image — print-ready */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden print:border-0">
            <div className="relative w-full aspect-square">
              <Image
                src={`/images/coloring/${bulk.id}.jpg`}
                alt={bulk.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {bulk.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-blue-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">How to Use</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Click <strong>Print Page</strong> to print directly</li>
              <li>Use crayons, colored pencils or markers</li>
              <li>Share your colored creation!</li>
            </ol>
          </div>

          {related.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">More {bulkMeta.title}</h3>
              <div className="space-y-2">
                {related.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/coloring-pages/${bulk.category}/${rel.slug}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <span className="text-2xl">{bulkMeta.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{rel.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/coloring-pages/${bulk.category}`}
            className={`block text-center px-4 py-3 ${bulkMeta.color} rounded-xl font-semibold hover:opacity-80 transition-opacity text-gray-800`}
          >
            {bulkMeta.icon} All {bulkMeta.title} →
          </Link>
        </aside>
      </div>
    </div>
  );
}
