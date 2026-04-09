/* JiggyJoy Service Worker
 * Versioned cache busts on deploy. Strategy:
 *  - Pre-cache the app shell on install
 *  - Cache-first for /games/[slug] pages (offline game play)
 *  - Cache-first for /_next/static/* (hashed assets)
 *  - Network-first with cache fallback for everything else
 */

const VERSION = "jiggyjoy-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const STATIC_CACHE = `${VERSION}-static`;
const GAMES_CACHE = `${VERSION}-games`;

const SHELL_URLS = [
  "/",
  "/games",
  "/coloring-pages",
  "/worksheets",
  "/manifest.webmanifest",
  "/icon",
  "/apple-icon",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) =>
        // addAll() is atomic — if any fail, none are cached. Use individual
        // puts so a single 404/network hiccup doesn't kill install.
        Promise.all(
          SHELL_URLS.map((url) =>
            fetch(url, { cache: "no-cache" })
              .then((res) => {
                if (res && res.ok) {
                  return cache.put(url, res.clone());
                }
              })
              .catch(() => {
                /* swallow — best effort pre-cache */
              })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const allowlist = new Set([SHELL_CACHE, RUNTIME_CACHE, STATIC_CACHE, GAMES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => (allowlist.has(key) ? null : caches.delete(key))))
      )
      .then(() => self.clients.claim())
  );
});

function isGamePage(url) {
  // /games/<slug> but not /games itself or the category indexes
  return /^\/games\/[^/]+\/?$/.test(url.pathname);
}

function isNextStatic(url) {
  return url.pathname.startsWith("/_next/static/");
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const network = await fetch(request);
    if (network && network.ok) {
      cache.put(request, network.clone());
    }
    return network;
  } catch (err) {
    // Last-ditch fallback to shell for navigations
    if (request.mode === "navigate") {
      const shell = await caches.open(SHELL_CACHE);
      const fallback = await shell.match("/");
      if (fallback) return fallback;
    }
    throw err;
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const network = await fetch(request);
    if (network && network.ok && request.method === "GET") {
      cache.put(request, network.clone());
    }
    return network;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const shell = await caches.open(SHELL_CACHE);
      const fallback = await shell.match("/");
      if (fallback) return fallback;
    }
    throw err;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET from same origin
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip Next.js HMR / dev / data endpoints
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;
  if (url.pathname.startsWith("/api/")) return;

  if (isNextStatic(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (isGamePage(url)) {
    event.respondWith(cacheFirst(request, GAMES_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
