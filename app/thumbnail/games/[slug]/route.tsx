// Dynamic YouTube thumbnail for a game.
// Route: GET /thumbnail/games/<slug>
// Returns a 1280x720 PNG tuned for YouTube custom thumbnails.
//
// Even before a real video has been uploaded, every game already has a
// branded fallback thumbnail at this URL. Once a video exists, the user can
// either keep using this auto-generated image or upload a custom one to
// YouTube.

import { getGameBySlug } from "@/lib/data";
import { getGamePinVisual } from "@/lib/pinVisuals";
import { renderThumbnailImage } from "@/lib/thumbnailImage";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) {
    return new Response("Game not found", { status: 404 });
  }

  // Use a short title (drop the long descriptive subtitle) so the headline
  // reads cleanly at YouTube thumbnail size.
  const shortTitle = game.title.split("—")[0].trim();

  return renderThumbnailImage({
    title: shortTitle,
    subtitle: `Ages ${game.ageRange}`,
    visual: getGamePinVisual(slug),
  });
}
