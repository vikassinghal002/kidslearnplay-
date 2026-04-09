// Dynamic YouTube thumbnail for a worksheet.
// Route: GET /thumbnail/worksheets/<slug>
// Returns a 1280x720 PNG tuned for YouTube custom thumbnails.

import { getWorksheetBySlug } from "@/lib/data";
import { getWorksheetVisual } from "@/lib/pinVisuals";
import { renderThumbnailImage } from "@/lib/thumbnailImage";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const ws = getWorksheetBySlug(slug);
  if (!ws) {
    return new Response("Worksheet not found", { status: 404 });
  }

  return renderThumbnailImage({
    title: ws.title,
    subtitle: `${ws.grade} · ${ws.subject}`,
    visual: { ...getWorksheetVisual(ws), badge: "FREE PRINTABLE" },
  });
}
