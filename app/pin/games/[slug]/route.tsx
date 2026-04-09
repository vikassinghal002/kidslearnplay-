// Dynamic Pinterest pin for a game.
// Route: GET /pin/games/<slug>
// Returns a 1000x1500 PNG tuned for Pinterest.

import { getGameBySlug } from "@/lib/data";
import { getGamePinVisual } from "@/lib/pinVisuals";
import { renderPinImage } from "@/lib/pinImage";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) {
    return new Response("Game not found", { status: 404 });
  }

  return renderPinImage({
    title: game.title,
    subtitle: `Ages ${game.ageRange} · ${game.category}`,
    visual: getGamePinVisual(slug),
  });
}
