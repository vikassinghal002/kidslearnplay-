import { MetadataRoute } from "next";
import { coloringCategories, getAllColoringPages, games, worksheets } from "@/lib/data";
import { blogPosts } from "@/lib/blog-posts";
import { activityPages, freeWorksheetTopics } from "@/lib/programmaticContent";
import { videos } from "@/lib/videos";

const BASE_URL = "https://www.jiggyjoy.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/coloring-pages`,            priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/coloring-pages/free-printable`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/coloring-pages/easy`,       priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games`,                     priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/math`,                priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/kindergarten`,        priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/3-year-olds`,         priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/4-year-olds`,         priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/5-year-olds`,         priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/halloween`,           priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/christmas`,           priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games/easter`,              priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets`,                priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets/preschool`,      priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets/kindergarten`,   priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets/math`,           priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets/tracing`,        priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets/alphabet`,       priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/blog`,                      priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/videos`,                    priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/about`,                     priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/privacy-policy`,            priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/terms`,                     priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const blogPages = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const categoryPages = coloringCategories.map((cat) => ({
    url: `${BASE_URL}/coloring-pages/${cat.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
  }));

  const coloringPages = getAllColoringPages().map((page) => ({
    url: `${BASE_URL}/coloring-pages/${page.category}/${page.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  const gamePages = games.map((game) => ({
    url: `${BASE_URL}/games/${game.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const worksheetPages = worksheets.map((ws) => ({
    url: `${BASE_URL}/worksheets/${ws.slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  // Lever 4 — YouTube traffic infrastructure (individual video pages)
  const videoPages = videos.map((v) => ({
    url: `${BASE_URL}/videos/${v.id}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  // Lever 1 — programmatic SEO pages
  const activityAgePages = activityPages.map((p) => ({
    url: `${BASE_URL}/activities/${p.slug}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  const freeWorksheetTopicPages = freeWorksheetTopics.map((p) => ({
    url: `${BASE_URL}/worksheets/free/${p.slug}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...coloringPages,
    ...gamePages,
    ...worksheetPages,
    ...activityAgePages,
    ...freeWorksheetTopicPages,
    ...videoPages,
    ...blogPages,
  ];
}
