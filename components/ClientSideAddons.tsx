"use client";

import dynamic from "next/dynamic";

/**
 * Lazy-loads the non-critical client-side addons that live on every page:
 *
 *  - ServiceWorkerRegister: kicks off SW registration after window.load
 *  - InstallPrompt: PWA add-to-home-screen banner (3+ visits gated)
 *
 * Wrapping them in next/dynamic with `ssr: false` pushes them into their
 * own JS chunks and keeps them out of the main document response, so LCP
 * and TTI aren't paying for features the kid doesn't need on first paint.
 *
 * We render this component once from the root layout. It returns null
 * during SSR and hydrates the addons after the main content is on screen.
 */
const ServiceWorkerRegister = dynamic(
  () => import("./ServiceWorkerRegister"),
  { ssr: false }
);

const InstallPrompt = dynamic(
  () => import("./InstallPrompt"),
  { ssr: false }
);

export default function ClientSideAddons() {
  return (
    <>
      <ServiceWorkerRegister />
      <InstallPrompt />
    </>
  );
}
