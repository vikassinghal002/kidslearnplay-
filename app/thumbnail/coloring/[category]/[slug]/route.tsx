// Dynamic YouTube thumbnail for a coloring page.
// Route: GET /thumbnail/coloring/<category>/<slug>
// Returns a 1280x720 PNG tuned for YouTube custom thumbnails.
//
// Falls back to bulk manifest pages and finally to a category thumbnail so
// any URL under /thumbnail/coloring/* renders something rather than 404.

import { getCategoryBySlug, getAllColoringPages } from "@/lib/data";
import { getBulkPageBySlug, getBulkCategoryMeta } from "@/lib/bulk-data";
import { getColoringPageVisual, getColoringCategoryVisual } from "@/lib/pinVisuals";
import { renderThumbnailImage } from "@/lib/thumbnailImage";

type Ctx = { params: Promise<{ category: string; slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { category, slug } = await params;

  // Curated coloring page
  const curated = getAllColoringPages().find((p) => p.slug === slug);
  if (curated) {
    const cat = getCategoryBySlug(curated.category);
    return renderThumbnailImage({
      title: curated.title,
      subtitle: cat ? cat.title : "Coloring Page",
      visual: { ...getColoringPageVisual(curated, cat), badge: "FREE COLORING PAGE" },
    });
  }

  // Bulk manifest page
  const bulk = getBulkPageBySlug(slug);
  if (bulk) {
    const meta = getBulkCategoryMeta(bulk.category);
    const base = getColoringCategoryVisual(bulk.category);
    const fauxPage = {
      slug: bulk.slug,
      title: bulk.title,
      description: "",
      category: bulk.category,
      tags: bulk.tags,
    };
    const visual = getColoringPageVisual(fauxPage);
    return renderThumbnailImage({
      title: bulk.title,
      subtitle: meta.title,
      visual: { ...visual, gradient: base.gradient, sparkles: base.sparkles, badge: "FREE COLORING PAGE" },
    });
  }

  // Category fallback
  const cat = getCategoryBySlug(category);
  if (cat) {
    const base = getColoringCategoryVisual(cat.slug);
    return renderThumbnailImage({
      title: cat.title,
      subtitle: "Free Printable",
      visual: { ...base, badge: "FREE COLORING PAGES" },
    });
  }

  return new Response("Coloring page not found", { status: 404 });
}
