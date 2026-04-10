#!/usr/bin/env node
/**
 * IndexNow submitter — pings Bing, Yandex, and any other IndexNow-compatible
 * search engines with every URL in the live sitemap.
 *
 * Run manually after a deploy:   npm run indexnow
 *
 * IndexNow spec: https://www.indexnow.org/documentation
 * Bing accepts up to 10,000 URLs per request.
 */

const HOST = "www.jiggyjoy.com";
const KEY = "d72b06359ee9bdc6a2787352d2623aeed3e1cf60d26b2d22cc99571a3184683a";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
];

async function fetchSitemapUrls() {
  console.log(`→ Fetching sitemap from ${SITEMAP_URL}`);
  const res = await fetch(SITEMAP_URL, {
    headers: { "User-Agent": "JiggyJoy-IndexNow/1.0" },
  });
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // If it's a sitemap index, recursively fetch child sitemaps.
  const childIndexMatches = [...xml.matchAll(/<sitemap>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/sitemap>/g)];
  if (childIndexMatches.length > 0) {
    console.log(`→ Sitemap index detected (${childIndexMatches.length} children)`);
    const children = childIndexMatches.map((m) => m[1]);
    const all = [];
    for (const child of children) {
      const childRes = await fetch(child, {
        headers: { "User-Agent": "JiggyJoy-IndexNow/1.0" },
      });
      if (!childRes.ok) {
        console.warn(`  ! Skipping ${child}: ${childRes.status}`);
        continue;
      }
      const childXml = await childRes.text();
      const childUrls = [...childXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
      all.push(...childUrls);
    }
    return all;
  }
  return urls;
}

async function pingEndpoint(endpoint, urls) {
  const body = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  return { status: res.status, ok: res.ok, endpoint };
}

async function main() {
  const urls = await fetchSitemapUrls();
  console.log(`→ Found ${urls.length} URLs`);
  if (urls.length === 0) {
    console.error("✗ No URLs found in sitemap. Aborting.");
    process.exit(1);
  }
  if (urls.length > 10000) {
    console.warn(`! Sitemap has ${urls.length} URLs — IndexNow limit is 10,000/request. Trimming.`);
    urls.length = 10000;
  }

  for (const endpoint of ENDPOINTS) {
    try {
      const result = await pingEndpoint(endpoint, urls);
      const mark = result.ok ? "✓" : "✗";
      console.log(`${mark} ${result.endpoint} → HTTP ${result.status}`);
    } catch (err) {
      console.log(`✗ ${endpoint} → ${err.message}`);
    }
  }
  console.log(`→ Done. Submitted ${urls.length} URLs.`);
}

main().catch((err) => {
  console.error("✗ IndexNow submission failed:", err);
  process.exit(1);
});
