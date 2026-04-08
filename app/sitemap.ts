import { MetadataRoute } from "next";
import { coloringCategories, getAllColoringPages, games, worksheets } from "@/lib/data";

const BASE_URL = "https://www.kidslearnplay.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/coloring-pages`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/games`, priority: 0.9, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/worksheets`, priority: 0.9, changeFrequency: "weekly" as const },
  ];

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

  return [
    ...staticPages,
    ...categoryPages,
    ...coloringPages,
    ...gamePages,
    ...worksheetPages,
  ];
}
