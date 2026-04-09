"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const gamesMenu = [
  { href: "/games", label: "All Games", emoji: "🎮", desc: "Browse every game" },
  { href: "/games/math", label: "Math Games", emoji: "🔢", desc: "Times tables, quizzes & more" },
  { href: "/games/kindergarten", label: "Kindergarten", emoji: "🎒", desc: "Ages 3–6" },
  { href: "/games/3-year-olds", label: "Ages 3–4", emoji: "🧸", desc: "Toddler favourites" },
  { href: "/games/5-year-olds", label: "Ages 5–6", emoji: "⭐", desc: "Pre-school & early KS1" },
  { href: "/games/halloween", label: "Halloween", emoji: "🎃", desc: "Spooky seasonal fun" },
  { href: "/games/christmas", label: "Christmas", emoji: "🎄", desc: "Festive games" },
  { href: "/games/easter", label: "Easter", emoji: "🐣", desc: "Spring activities" },
];

const worksheetsMenu = [
  { href: "/worksheets", label: "All Worksheets", emoji: "📄", desc: "Browse every worksheet" },
  { href: "/worksheets/preschool", label: "Preschool", emoji: "🌸", desc: "Ages 3–5" },
  { href: "/worksheets/kindergarten", label: "Kindergarten", emoji: "🎒", desc: "Ages 5–6" },
  { href: "/worksheets/math", label: "Math", emoji: "🔢", desc: "Numbers & operations" },
  { href: "/worksheets/tracing", label: "Tracing", emoji: "✏️", desc: "Letters & numbers" },
  { href: "/worksheets/alphabet", label: "Alphabet", emoji: "🔤", desc: "A to Z printables" },
];

function DropdownMenu({ items }: { items: typeof gamesMenu }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
      <div className="grid grid-cols-1 divide-y divide-gray-50">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors group"
          >
            <span className="text-xl shrink-0">{item.emoji}</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-purple-700">{item.label}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavDropdown({ label, emoji, items }: { label: string; emoji: string; items: typeof gamesMenu }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
      >
        <span>{emoji}</span>
        <span>{label}</span>
        <svg className={`w-3.5 h-3.5 ml-0.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </button>
      {open && <DropdownMenu items={items} />}
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<"games" | "worksheets" | null>(null);
  const pathname = usePathname();

  // Hide on individual game pages
  if (pathname?.match(/^\/games\/[^/]+/) &&
      !pathname.match(/^\/games\/(math|kindergarten|halloween|christmas|easter|3-year-olds|4-year-olds|5-year-olds)$/)) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-purple-600 shrink-0">
          <span className="text-2xl">🌈</span>
          <span>KidsLearnPlay</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/coloring-pages"
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <span>🎨</span>
            <span>Coloring</span>
          </Link>

          <NavDropdown label="Games" emoji="🎮" items={gamesMenu} />
          <NavDropdown label="Worksheets" emoji="📄" items={worksheetsMenu} />

          <Link
            href="/blog"
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <span>📝</span>
            <span>Blog</span>
          </Link>

          <Link
            href="/games/times-tables-challenge"
            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            🔢 Times Tables
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => { setMobileOpen(!mobileOpen); setMobileSection(null); }}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          <Link href="/coloring-pages" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
            🎨 Coloring Pages
          </Link>

          {/* Games section */}
          <button
            onClick={() => setMobileSection(mobileSection === "games" ? null : "games")}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium w-full text-left"
          >
            <span>🎮 Games</span>
            <svg className={`w-4 h-4 transition-transform ${mobileSection === "games" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </button>
          {mobileSection === "games" && (
            <div className="pl-4 flex flex-col gap-1">
              {gamesMenu.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-700 text-sm">
                  {item.emoji} {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Worksheets section */}
          <button
            onClick={() => setMobileSection(mobileSection === "worksheets" ? null : "worksheets")}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium w-full text-left"
          >
            <span>📄 Worksheets</span>
            <svg className={`w-4 h-4 transition-transform ${mobileSection === "worksheets" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </button>
          {mobileSection === "worksheets" && (
            <div className="pl-4 flex flex-col gap-1">
              {worksheetsMenu.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-700 text-sm">
                  {item.emoji} {item.label}
                </Link>
              ))}
            </div>
          )}

          <Link href="/blog" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium">
            📝 Blog
          </Link>

          <Link href="/games/times-tables-challenge" onClick={() => setMobileOpen(false)}
            className="mt-1 px-3 py-2 bg-purple-600 text-white rounded-lg font-semibold text-center hover:bg-purple-700 transition-colors">
            🔢 Times Tables Challenge
          </Link>
        </div>
      )}
    </header>
  );
}
