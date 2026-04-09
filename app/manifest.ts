import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JiggyJoy — Free Kids Games & Coloring Pages",
    short_name: "JiggyJoy",
    description: "Free online games, coloring pages and worksheets for kids.",
    start_url: "/",
    display: "standalone",
    background_color: "#7c3aed",
    theme_color: "#7c3aed",
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
  };
}
