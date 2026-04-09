// Dynamic Pinterest pin for a worksheet.
// Route: GET /pin/worksheets/<slug>
// Returns a 1000x1500 PNG tuned for Pinterest.

import { getWorksheetBySlug } from "@/lib/data";
import { getWorksheetVisual } from "@/lib/pinVisuals";
import { renderPinImage } from "@/lib/pinImage";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const ws = getWorksheetBySlug(slug);
  if (!ws) {
    return new Response("Worksheet not found", { status: 404 });
  }

  return renderPinImage({
    title: ws.title,
    subtitle: `${ws.grade} · ${ws.subject}`,
    visual: getWorksheetVisual(ws),
  });
}
