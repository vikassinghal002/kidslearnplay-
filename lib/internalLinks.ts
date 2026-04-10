// ─── Internal linking generator ──────────────────────────────────────────────
//
// Central utility that returns a diverse set of contextually relevant internal
// links for any programmatic page. Scoring is a simple keyword-token overlap
// between the source page's target keyword and every candidate's title/label,
// with a diversity guard that ensures the result contains a mix of page types
// (games, worksheets/printables, learn/activity guides) whenever possible.
//
// Dense topical clusters are one of Google's strongest ranking signals for
// "YMYL-adjacent" content (parenting, education, kids). Every programmatic
// page should internally link to 10–15 related URLs, spread across content
// types — that is exactly what this function produces.
//
// ─────────────────────────────────────────────────────────────────────────────

import { games, worksheets, coloringCategories } from "@/lib/data";
import * as ProgrammaticContent from "@/lib/programmaticContent";
import {
  activityPages,
  freeWorksheetTopics,
  printablePages,
  learnTopics,
} from "@/lib/programmaticContent";

export type InternalLinkType =
  | "game"
  | "worksheet"
  | "coloring"
  | "activity"
  | "printable"
  | "learn"
  | "blog";

export type InternalLink = {
  href: string;
  label: string;
  type: InternalLinkType;
};

type Candidate = InternalLink & {
  text: string;          // pre-lowercased text used for scoring
};

// Words with no topical signal — filtered before scoring.
const STOPWORDS = new Set([
  "the", "a", "an", "of", "for", "to", "with", "and", "or", "in", "on",
  "kids", "children", "free", "how", "teach", "teaching", "at", "by", "is",
  "are", "your", "you", "best", "top", "new", "guide", "printable",
  "printables", "online", "game", "games", "worksheet", "worksheets",
  "page", "pages",
]);

function tokenize(text: string): Set<string> {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
  return new Set(tokens);
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  let count = 0;
  for (const t of a) if (b.has(t)) count += 1;
  return count;
}

// Optional export from programmaticContent — another agent may add a
// `coloringTopicPages` array. We resolve it defensively through a namespace
// import so missing exports simply yield `undefined` at runtime instead of a
// compile error.
type MaybeColoringTopic = { slug: string; h1?: string; title?: string; keyword?: string };
function safeGetColoringTopicPages(): MaybeColoringTopic[] {
  const maybe = (ProgrammaticContent as unknown as Record<string, unknown>)["coloringTopicPages"];
  if (Array.isArray(maybe)) {
    return maybe as MaybeColoringTopic[];
  }
  return [];
}

function buildCandidates(): Candidate[] {
  const out: Candidate[] = [];

  for (const g of games) {
    if (!g?.slug) continue;
    out.push({
      href: `/games/${g.slug}`,
      label: g.title ?? g.slug,
      type: "game",
      text: `${g.title ?? ""} ${g.category ?? ""} ${(g.tags ?? []).join(" ")}`,
    });
  }

  for (const w of worksheets) {
    if (!w?.slug) continue;
    out.push({
      href: `/worksheets/${w.slug}`,
      label: w.title ?? w.slug,
      type: "worksheet",
      text: `${w.title ?? ""} ${w.category ?? ""} ${w.subject ?? ""} ${(w.tags ?? []).join(" ")}`,
    });
  }

  for (const c of coloringCategories) {
    if (!c?.slug) continue;
    out.push({
      href: `/coloring-pages/${c.slug}`,
      label: c.title ?? c.slug,
      type: "coloring",
      text: `${c.title ?? ""} ${c.keywords ?? ""} ${c.description ?? ""}`,
    });
  }

  for (const a of activityPages) {
    if (!a?.slug) continue;
    out.push({
      href: `/activities/${a.slug}`,
      label: a.h1 ?? a.slug,
      type: "activity",
      text: `${a.h1 ?? ""} ${a.keyword ?? ""}`,
    });
  }

  for (const p of printablePages) {
    if (!p?.slug) continue;
    out.push({
      href: `/printables/${p.slug}`,
      label: p.h1 ?? p.slug,
      type: "printable",
      text: `${p.h1 ?? ""} ${p.keyword ?? ""}`,
    });
  }

  for (const w of freeWorksheetTopics) {
    if (!w?.slug) continue;
    out.push({
      href: `/worksheets/free/${w.slug}`,
      label: w.h1 ?? w.slug,
      type: "worksheet",
      text: `${w.h1 ?? ""} ${w.keyword ?? ""}`,
    });
  }

  for (const t of learnTopics) {
    if (!t?.slug) continue;
    out.push({
      href: `/learn/${t.slug}`,
      label: t.h1 ?? t.slug,
      type: "learn",
      text: `${t.h1 ?? ""} ${t.keyword ?? ""}`,
    });
  }

  for (const c of safeGetColoringTopicPages()) {
    if (!c?.slug) continue;
    out.push({
      href: `/coloring-pages/topics/${c.slug}`,
      label: (c.h1 ?? c.title ?? c.slug) as string,
      type: "coloring",
      text: `${c.h1 ?? ""} ${c.title ?? ""} ${c.keyword ?? ""}`,
    });
  }

  return out;
}

type PageType =
  | "activity"
  | "worksheet-topic"
  | "printable"
  | "learn"
  | "coloring-topic"
  | "game";

// Which href prefix corresponds to the current page, so we exclude the page
// itself from its own related-links list.
function currentHref(pageType: PageType, slug: string): string {
  switch (pageType) {
    case "activity":        return `/activities/${slug}`;
    case "worksheet-topic": return `/worksheets/free/${slug}`;
    case "printable":       return `/printables/${slug}`;
    case "learn":           return `/learn/${slug}`;
    case "coloring-topic":  return `/coloring-pages/topics/${slug}`;
    case "game":            return `/games/${slug}`;
  }
}

export function getRelatedLinks(options: {
  pageType: PageType;
  slug: string;
  keyword: string;
  limit?: number;
}): InternalLink[] {
  const { pageType, slug, keyword } = options;
  const limit = Math.max(1, options.limit ?? 12);

  const pageTokens = tokenize(keyword ?? "");
  const exclude = currentHref(pageType, slug);

  const candidates = buildCandidates()
    .filter((c) => c.href !== exclude)
    .map((c) => ({
      c,
      score: overlapScore(pageTokens, tokenize(c.text)),
    }))
    // keep everything even if score is 0 so we can still fill the grid when
    // the keyword produces no tokens (rare, but possible with short slugs).
    .sort((a, b) => b.score - a.score);

  // Diversity guard: make sure we include at least 2 games, 2 worksheets or
  // printables, and 2 learn/activity guides when such candidates exist.
  const picked: InternalLink[] = [];
  const seenHrefs = new Set<string>();

  const takeTopFromBucket = (predicate: (t: InternalLinkType) => boolean, want: number) => {
    for (const { c } of candidates) {
      if (picked.length >= limit) return;
      if (want <= 0) return;
      if (seenHrefs.has(c.href)) continue;
      if (!predicate(c.type)) continue;
      picked.push({ href: c.href, label: c.label, type: c.type });
      seenHrefs.add(c.href);
      want -= 1;
    }
  };

  // Seed the diversity minimums first.
  takeTopFromBucket((t) => t === "game", 2);
  takeTopFromBucket((t) => t === "worksheet" || t === "printable", 2);
  takeTopFromBucket((t) => t === "learn" || t === "activity", 2);

  // Then fill the remaining slots with the highest-scoring candidates left.
  for (const { c } of candidates) {
    if (picked.length >= limit) break;
    if (seenHrefs.has(c.href)) continue;
    picked.push({ href: c.href, label: c.label, type: c.type });
    seenHrefs.add(c.href);
  }

  // Final safety: if for some reason we still have nothing (empty dataset),
  // return an empty array rather than crashing the page.
  return picked.slice(0, limit);
}
