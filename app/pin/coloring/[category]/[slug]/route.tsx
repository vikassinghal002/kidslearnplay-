// Dynamic Pinterest pin for a coloring page.
// Route: GET /pin/coloring/<category>/<slug>
// Returns a 1000x1500 PNG tuned for Pinterest.
//
// Falls back to bulk manifest pages when the slug isn't in the curated set.

import { getCategoryBySlug, getAllColoringPages } from "@/lib/data";
import { getBulkPageBySlug, getBulkCategoryMeta } from "@/lib/bulk-data";
import { getColoringPageVisual, getColoringCategoryVisual } from "@/lib/pinVisuals";
import { renderPinImage } from "@/lib/pinImage";

type Ctx = { params: Promise<{ category: string; slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { category, slug } = await params;

  // ── Curated coloring page ─────────────────────────────────────────────────
  const curated = getAllColoringPages().find((p) => p.slug === slug);
  if (curated) {
    const cat = getCategoryBySlug(curated.category);
    return renderPinImage({
      title: curated.title,
      subtitle: cat ? cat.title : "Coloring Page",
      visual: getColoringPageVisual(curated, cat),
    });
  }

  // ── Bulk manifest page ────────────────────────────────────────────────────
  const bulk = getBulkPageBySlug(slug);
  if (bulk) {
    const meta = getBulkCategoryMeta(bulk.category);
    const base = getColoringCategoryVisual(bulk.category);
    // Build a synthetic ColoringPage shape so we can reuse overrides.
    const fauxPage = {
      slug: bulk.slug,
      title: bulk.title,
      description: "",
      category: bulk.category,
      tags: bulk.tags,
    };
    const visual = getColoringPageVisual(fauxPage);
    return renderPinImage({
      title: bulk.title,
      subtitle: meta.title,
      visual: { ...visual, gradient: base.gradient, sparkles: base.sparkles },
    });
  }

  // ── Category-level fallback ───────────────────────────────────────────────
  // If someone hits /pin/coloring/<category>/<unknown-slug>, render a
  // category pin so the request never 404s when used as og:image.
  const cat = getCategoryBySlug(category);
  if (cat) {
    const base = getColoringCategoryVisual(cat.slug);
    return renderPinImage({
      title: cat.title,
      subtitle: "Free Printable",
      visual: { ...base, badge: "FREE PRINTABLE" },
    });
  }

  return new Response("Coloring page not found", { status: 404 });
}
