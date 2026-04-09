#!/usr/bin/env node
/**
 * Tiny CLI to trigger a push fan-out through /api/push/send.
 *
 * Usage:
 *   node scripts/send-push.mjs "Title here" "Body here" [optional-url] [optional-tag]
 *
 * Env:
 *   PUSH_ADMIN_TOKEN   required — shared secret that matches the server env var
 *   SITE_URL           optional — base URL, defaults to http://localhost:3000
 *
 * Examples:
 *   node scripts/send-push.mjs "New game unlocked" "Play Dino Run now" "/games/dino-run"
 *   SITE_URL=https://www.jiggyjoy.com node scripts/send-push.mjs "Weekend update" "3 new games"
 */

const [, , titleArg, bodyArg, urlArg, tagArg] = process.argv;

if (!titleArg || !bodyArg) {
  console.error(
    'Usage: node scripts/send-push.mjs "Title" "Body" [url] [tag]',
  );
  process.exit(1);
}

const siteUrl = (process.env.SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);
const adminToken = process.env.PUSH_ADMIN_TOKEN;

if (!adminToken) {
  console.error(
    "ERROR: PUSH_ADMIN_TOKEN env var is required. Set it in your shell or .env.local and `source` it first.",
  );
  process.exit(1);
}

const payload = {
  title: titleArg,
  body: bodyArg,
  url: urlArg || "/",
  ...(tagArg ? { tag: tagArg } : {}),
};

const endpoint = `${siteUrl}/api/push/send`;
console.log(`[send-push] POST ${endpoint}`);
console.log(`[send-push] payload:`, payload);

try {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": adminToken,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = text;
  }

  console.log(`[send-push] ${res.status} ${res.statusText}`);
  console.log(parsed);

  process.exit(res.ok ? 0 : 2);
} catch (err) {
  console.error("[send-push] request failed:", err);
  process.exit(3);
}
