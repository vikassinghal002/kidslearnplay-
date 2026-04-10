/**
 * Games whose playfield really needs landscape on small screens.
 *
 * Portrait is fine for tap/quiz games (math quiz, memory match, word spell,
 * time teller, etc.) because they stack vertically. The games below are
 * wide-playfield canvas games — side-scrollers, shooters, paddle games,
 * falling-object catchers — that become unplayable when the viewport is
 * taller than it is wide.
 *
 * This list is kept in one place so the <OrientationLock /> overlay in
 * app/games/[slug]/page.tsx can decide whether to nag the kid to rotate.
 *
 * — Genius Gamer (2026-04-10)
 */
export const LANDSCAPE_GAMES = new Set<string>([
  // Arcade — all wide playfield
  "space-defender",
  "brick-breaker",
  "dino-run",
  "snake",
  "super-jumper",
  "stack-attack",

  // Seasonal catchers / smash games
  "pumpkin-smash",
  "present-catcher",
  "easter-egg-hunt",

  // Math arcade (asteroid / train / combat)
  "addition-attack",
  "multiplication-blast",
  "subtraction-station",
  "division-duel",
]);

export function needsLandscape(slug: string): boolean {
  return LANDSCAPE_GAMES.has(slug);
}
