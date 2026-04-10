"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ColoringCategory } from "@/lib/data";

type Mode = "kids" | "adults";
const STORAGE_KEY = "jj_coloring_mode";

type Props = {
  kidsCategories: ColoringCategory[];
  adultCategories: ColoringCategory[];
};

export default function HomeColoringTabs({ kidsCategories, adultCategories }: Props) {
  // Start in "kids" to match SSR; hydrate from localStorage after mount.
  const [mode, setMode] = useState<Mode>("kids");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "kids" || saved === "adults") setMode(saved);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  function pick(next: Mode) {
    setMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }

  const active = mode === "kids" ? kidsCategories : adultCategories;

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      {/* Header + tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === "kids" ? "🎨 Kids Coloring Pages" : "🌸 Detailed & Mindful Coloring"}
          </h2>
          <p className="text-gray-600 mt-1 text-base">
            {mode === "kids"
              ? "Characters, animals, holidays — print for free"
              : "Mandalas, stress relief, zodiac & fantasy — completely free"}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Coloring audience"
          className="inline-flex bg-gray-100 rounded-full p-1 self-start sm:self-auto"
        >
          <button
            role="tab"
            aria-selected={mode === "kids"}
            onClick={() => pick("kids")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              mode === "kids"
                ? "bg-white text-purple-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🧒 For Kids
          </button>
          <button
            role="tab"
            aria-selected={mode === "adults"}
            onClick={() => pick("adults")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              mode === "adults"
                ? "bg-white text-purple-700 shadow"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🌸 For Adults
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {active.map((cat) => (
          <Link
            key={cat.slug}
            href={`/coloring-pages/${cat.slug}`}
            className={`${cat.color} rounded-2xl p-5 flex flex-col items-center text-center hover:scale-105 transition-transform shadow-sm ${
              mode === "adults" ? "border border-white" : ""
            }`}
          >
            <span className="text-5xl mb-2">{cat.icon}</span>
            <h3 className="font-bold text-gray-900 text-base">{cat.title}</h3>
            <span
              className={`text-sm font-semibold mt-1 ${
                mode === "adults" ? "text-purple-700" : "text-gray-700"
              }`}
            >
              {cat.pages.length} {mode === "adults" ? "free pages" : "pages"}
            </span>
          </Link>
        ))}
      </div>

      {/* View all */}
      <div className="mt-6 text-center">
        <Link
          href="/coloring-pages"
          className="inline-block px-6 py-3 bg-white border-2 border-purple-200 text-purple-700 font-bold rounded-full hover:bg-purple-50 transition-colors"
        >
          View all coloring pages →
        </Link>
      </div>

      {/* Keep hydration-sensitive markup stable */}
      {!hydrated && <span className="sr-only">Loading preferences…</span>}
    </section>
  );
}
