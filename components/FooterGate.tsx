"use client";

import { usePathname } from "next/navigation";

/**
 * Tiny client wrapper that hides the (server-rendered) footer on individual
 * game pages where the fullscreen game needs every pixel. Everything else
 * in the footer stays on the server side of the RSC boundary.
 *
 * Children are rendered unchanged on all other routes — no content is
 * duplicated or re-fetched just for this check.
 */
export default function FooterGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isIndividualGame =
    !!pathname?.match(/^\/games\/[^/]+/) &&
    !pathname.match(/^\/games\/(math|kindergarten|halloween|christmas|easter|3-year-olds|4-year-olds|5-year-olds|preschool)$/);

  if (isIndividualGame) return null;
  return <>{children}</>;
}
