import type { MetadataRoute } from "next";

/**
 * robots.txt for JiggyJoy.
 *
 * We *explicitly* allow the major AI crawlers (GPTBot, ClaudeBot, Perplexity,
 * Google-Extended, Apple-Extended, etc.) so JiggyJoy content can be cited in
 * ChatGPT, Claude, Perplexity, Google AI Overviews and Apple Intelligence.
 *
 * The default for these bots is "respect robots.txt" — and several CDNs and
 * WAFs now block them by default. Listing them by name with `Allow: /` is the
 * cleanest signal that we WANT to be in their training and retrieval indexes.
 *
 * `host` pins the canonical hostname (apex vs www) for crawlers that honor it.
 */
export default function robots(): MetadataRoute.Robots {
  const allowAll = { allow: ["/"], disallow: [] as string[] };

  return {
    rules: [
      // Default: every crawler is welcome.
      { userAgent: "*", ...allowAll },

      // Generative AI crawlers — explicit invite.
      { userAgent: "GPTBot", ...allowAll }, // OpenAI (training)
      { userAgent: "ChatGPT-User", ...allowAll }, // OpenAI (live browsing)
      { userAgent: "OAI-SearchBot", ...allowAll }, // OpenAI (search index)
      { userAgent: "ClaudeBot", ...allowAll }, // Anthropic (training)
      { userAgent: "Claude-Web", ...allowAll }, // Anthropic (live)
      { userAgent: "anthropic-ai", ...allowAll }, // Anthropic (legacy)
      { userAgent: "PerplexityBot", ...allowAll }, // Perplexity
      { userAgent: "Perplexity-User", ...allowAll }, // Perplexity (live)
      { userAgent: "Google-Extended", ...allowAll }, // Google Gemini / AI Overviews
      { userAgent: "Applebot-Extended", ...allowAll }, // Apple Intelligence
      { userAgent: "CCBot", ...allowAll }, // Common Crawl (feeds many LLMs)
      { userAgent: "Bytespider", ...allowAll }, // ByteDance / Doubao
      { userAgent: "PetalBot", ...allowAll }, // Huawei / Petal Search
      { userAgent: "Amazonbot", ...allowAll }, // Amazon / Alexa
      { userAgent: "YouBot", ...allowAll }, // You.com
      { userAgent: "DuckAssistBot", ...allowAll }, // DuckDuckGo AI
      { userAgent: "Diffbot", ...allowAll }, // Diffbot KG
    ],
    sitemap: "https://www.jiggyjoy.com/sitemap.xml",
    host: "https://www.jiggyjoy.com",
  };
}
