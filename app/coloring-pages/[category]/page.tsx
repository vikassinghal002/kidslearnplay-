import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { coloringCategories, getCategoryBySlug } from "@/lib/data";
import {
  getBulkPagesByCategory,
  getBulkPageCount,
  getBulkCategoryMeta,
  BULK_PER_PAGE,
} from "@/lib/bulk-data";
import ColoringThumbnail from "@/components/ColoringThumbnail";

const CURATED_PER_PAGE = 24;

type Props = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  // Pre-generate curated categories; bulk categories are served dynamically
  return coloringCategories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (cat) {
    return {
      title: `${cat.title} — Free Printable`,
      description: cat.description,
      keywords: [cat.keywords, "free printable", "coloring pages"],
    };
  }
  // Bulk category
  const meta = getBulkCategoryMeta(category);
  return {
    title: `${meta.title} — Free Printable`,
    description: `Free printable ${meta.title.toLowerCase()} — download and print instantly.`,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1"));

  const cat = getCategoryBySlug(category);
  const bulkMeta = getBulkCategoryMeta(category);

  // ── Curated category ──────────────────────────────────────────────────────
  if (cat) {
    const bulkPages     = getBulkPagesByCategory(category, currentPage, BULK_PER_PAGE);
    const bulkTotal     = getBulkPageCount(category);
    const curatedPages  = cat.pages;

    // First page shows all curated pages, subsequent pages show bulk
    const showCurated   = currentPage === 1;
    const totalBulkPages = Math.ceil(bulkTotal / BULK_PER_PAGE);
    const totalPages    = bulkTotal > 0 ? 1 + totalBulkPages : 1;

    return (
      <div>
        {/* Header */}
        <section className={`${cat.color} py-12 px-4`}>
          <div className="max-w-3xl mx-auto">
            <nav className="text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-purple-600">Home</Link>{" / "}
              <Link href="/coloring-pages" className="hover:text-purple-600">Coloring Pages</Link>{" / "}
              <span className="text-gray-800 font-medium">{cat.title}</span>
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-6xl">{cat.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{cat.title}</h1>
                <p className="text-gray-600 mt-1">{cat.description}</p>
                <p className="text-sm text-purple-600 font-medium mt-1">
                  {curatedPages.length + bulkTotal} free pages total
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pages Grid */}
        <section className="max-w-6xl mx-auto px-4 py-10">
          {showCurated && curatedPages.length > 0 && (
            <>
              {bulkTotal > 0 && (
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                  Featured Pages
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
                {curatedPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/coloring-pages/${cat.slug}/${page.slug}`}
                    className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <ColoringThumbnail slug={page.slug} title={page.title} fallbackEmoji={cat.icon} />
                    <div className="p-3">
                      <h2 className="font-semibold text-gray-800 text-sm">{page.title}</h2>
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                        Free
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Bulk pages */}
          {bulkPages.length > 0 && (
            <>
              {showCurated && bulkTotal > 0 && (
                <h2 className="text-lg font-bold text-gray-700 mb-4">
                  More {cat.title} ({bulkTotal.toLocaleString()} pages)
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {bulkPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/coloring-pages/${category}/${page.slug}`}
                    className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white"
                  >
                    <ColoringThumbnail
                      slug={page.id}
                      title={page.title}
                      fallbackEmoji={cat.icon}
                    />
                    <div className="p-3">
                      <h2 className="font-semibold text-gray-800 text-sm line-clamp-2">{page.title}</h2>
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                        Free
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination current={currentPage} total={totalPages} base={`/coloring-pages/${category}`} />
          )}
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

  // ── Bulk-only category ────────────────────────────────────────────────────
  const bulkPages  = getBulkPagesByCategory(category, currentPage, BULK_PER_PAGE);
  const bulkTotal  = getBulkPageCount(category);

  if (bulkTotal === 0) notFound();

  const totalPages = Math.ceil(bulkTotal / BULK_PER_PAGE);

  return (
    <div>
      <section className={`${bulkMeta.color} py-12 px-4`}>
        <div className="max-w-3xl mx-auto">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-purple-600">Home</Link>{" / "}
            <Link href="/coloring-pages" className="hover:text-purple-600">Coloring Pages</Link>{" / "}
            <span className="text-gray-800 font-medium">{bulkMeta.title}</span>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-6xl">{bulkMeta.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{bulkMeta.title}</h1>
              <p className="text-sm text-purple-600 font-medium mt-1">
                {bulkTotal.toLocaleString()} free printable pages
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {bulkPages.map((page) => (
            <Link
              key={page.slug}
              href={`/coloring-pages/${category}/${page.slug}`}
              className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white"
            >
              <ColoringThumbnail
                slug={page.id}
                title={page.title}
                fallbackEmoji={bulkMeta.icon}
              />
              <div className="p-3">
                <h2 className="font-semibold text-gray-800 text-sm line-clamp-2">{page.title}</h2>
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block">
                  Free
                </span>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination current={currentPage} total={totalPages} base={`/coloring-pages/${category}`} />
        )}
      </section>
    </div>
  );
}

// ─── Pagination component ──────────────────────────────────────────────────────

function Pagination({ current, total, base }: { current: number; total: number; base: string }) {
  const pages: (number | "…")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("…");
    pages.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {current > 1 && (
        <Link
          href={`${base}?page=${current - 1}`}
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-purple-50 font-medium text-sm"
        >
          ← Prev
        </Link>
      )}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
        ) : (
          <Link
            key={p}
            href={`${base}?page=${p}`}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
              p === current
                ? "bg-purple-600 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-purple-50"
            }`}
          >
            {p}
          </Link>
        )
      )}
      {current < total && (
        <Link
          href={`${base}?page=${current + 1}`}
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-purple-50 font-medium text-sm"
        >
          Next →
        </Link>
      )}
    </div>
  );
}
