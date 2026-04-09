import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JiggyJoy — Free Kids Games & Coloring Pages",
    short_name: "JiggyJoy",
    description: "Free online games, coloring pages and worksheets for kids.",
    start_url: "/?utm_source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#7c3aed",
    theme_color: "#7c3aed",
    categories: ["education", "games", "kids"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "JiggyJoy — free kids games, coloring pages and worksheets",
      },
      {
        src: "/opengraph-image",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "narrow",
        label: "JiggyJoy on mobile",
      },
    ],
    shortcuts: [
      {
        name: "Math Games",
        short_name: "Math",
        description: "Fun math games for kids",
        url: "/games/math?utm_source=pwa_shortcut",
      },
      {
        name: "Coloring Pages",
        short_name: "Coloring",
        description: "Free printable coloring pages",
        url: "/coloring-pages?utm_source=pwa_shortcut",
      },
      {
        name: "Worksheets",
        short_name: "Worksheets",
        description: "Printable worksheets for kids",
        url: "/worksheets?utm_source=pwa_shortcut",
      },
      {
        name: "Halloween Games",
        short_name: "Halloween",
        description: "Spooky Halloween games",
        url: "/games/halloween?utm_source=pwa_shortcut",
      },
    ],
  };
}
