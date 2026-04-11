/**
 * Schema.org JSON-LD builders for JiggyJoy.
 *
 * Each builder returns a self-contained schema object (including @context) so
 * it can be emitted standalone via the <JsonLd> component below. Google and
 * other search engines accept multiple JSON-LD blocks per page, so we prefer
 * N small blocks over one @graph super-object.
 *
 * Reference:
 *   - https://schema.org
 *   - https://developers.google.com/search/docs/appearance/structured-data
 */

import React from "react";

export const SITE_URL = "https://www.jiggyjoy.com";
const SITE_NAME = "JiggyJoy";

// ── Site-wide schemas (emitted from root layout) ───────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    description:
      "Free online educational games, coloring pages, and printable worksheets for kids — no signup, no ads, 100% free.",
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Free games, coloring pages and worksheets for kids. No signup, no download — just open and play.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "en",
  };
}

// ── Page-level schemas ─────────────────────────────────────────────────────

type BreadcrumbItem = { name: string; url: string };
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

type CollectionOpts = {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
};
export function collectionPageSchema(opts: CollectionOpts) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: opts.name,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: opts.numberOfItems,
    },
  };
}

type FAQ = { question: string; answer: string };
export function faqPageSchema(qas: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  };
}

// ── JSX helper ─────────────────────────────────────────────────────────────

/**
 * Render a single JSON-LD block. Server-rendered as an inline <script>, so
 * it ships with the HTML on first load (no client JS needed).
 */
export function JsonLd({ data }: { data: unknown }) {
  // Scrub `<` → `\u003c` per Next.js JSON-LD guidance — prevents any
  // accidentally-embedded HTML tag from breaking out of the script block.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
