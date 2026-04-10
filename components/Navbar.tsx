"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

const gamesMenu = [
  { href: "/games", label: "All Games", emoji: "🎮", desc: "Browse every game" },
  { href: "/games/math", label: "Math Games", emoji: "🔢", desc: "Times tables, quizzes & more" },
  { href: "/games/halloween", label: "Halloween", emoji: "🎃", desc: "Spooky seasonal fun" },
  { href: "/games/christmas", label: "Christmas", emoji: "🎄", desc: "Festive games" },
  { href: "/games/easter", label: "Easter", emoji: "🐣", desc: "Spring activities" },
];

// Age shortcut bar — the thing kids (and parents) actually want
const ageShortcuts = [
  { href: "/games/3-year-olds",   label: "Ages 3–4", emoji: "🧸", dot: "bg-green-400",  ring: "ring-green-200" },
  { href: "/games/5-year-olds",   label: "Ages 5–6", emoji: "⭐", dot: "bg-yellow-400", ring: "ring-yellow-200" },
  { href: "/games/kindergarten",  label: "K–2",      emoji: "🎒", dot: "bg-yellow-400", ring: "ring-yellow-200" },
  { href: "/games/math",          label: "Ages 7+",  emoji: "🔢", dot: "bg-blue-400",   ring: "ring-blue-200" },
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
              <p className="text-base font-bold text-gray-900 group-hover:text-purple-700">{item.label}</p>
              <p className="text-sm text-gray-600">{item.desc}</p>
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

  // Hide the secondary "By age" strip on pages that already own a
  // first-class age filter (the /games listing). Two age pickers in a row
  // is confusing — the page-level one wins because it actually filters
  // in place instead of navigating away.
  const hideAgeStrip = pathname === "/games";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-purple-600 shrink-0">
          <span className="text-2xl" aria-hidden="true">🌈</span>
          <span>JiggyJoy</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/coloring-pages"
            className="flex items-center gap-1 px-3 lg:px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <span aria-hidden="true">🎨</span>
            <span>Coloring</span>
          </Link>

          <NavDropdown label="Games" emoji="🎮" items={gamesMenu} />
          <NavDropdown label="Worksheets" emoji="📄" items={worksheetsMenu} />

          <Link
            href="/blog"
            className="flex items-center gap-1 px-3 lg:px-4 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            <span aria-hidden="true">📝</span>
            <span>Blog</span>
          </Link>

          <Link
            href="/games/times-tables-challenge"
            className="ml-1 lg:ml-2 px-3 lg:px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-extrabold hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            🔢 Times Tables
          </Link>
        </nav>

        {/* Mobile hamburger — 56×56 tap target (Maya's min for ages 5–7) */}
        <button
          className="md:hidden flex flex-col items-center justify-center gap-1.5 w-14 h-14 rounded-2xl hover:bg-purple-50 active:bg-purple-100 -mr-2 touch-manipulation"
          onClick={() => { setMobileOpen(!mobileOpen); setMobileSection(null); }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <span className={`block w-7 h-[3px] bg-gray-800 rounded-full transition-transform ${mobileOpen ? "translate-y-[9px] rotate-45" : ""}`} />
          <span className={`block w-7 h-[3px] bg-gray-800 rounded-full transition-opacity ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`block w-7 h-[3px] bg-gray-800 rounded-full transition-transform ${mobileOpen ? "-translate-y-[9px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Age shortcut strip — visible on ALL screens. The #1 affordance for kids.
          Hidden on /games where the page has its own (richer) age filter. */}
      {!hideAgeStrip && (
      <div className="border-t border-gray-100 bg-gradient-to-r from-purple-50/70 via-white to-pink-50/70">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none snap-x">
          <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wider text-gray-500 pr-2 whitespace-nowrap">
            By age:
          </span>
          {ageShortcuts.map((a) => {
            const active = pathname === a.href;
            return (
              <Link
                key={a.href}
                href={a.href}
                className={`flex items-center gap-1.5 shrink-0 snap-start min-h-[44px] px-4 py-2 rounded-full text-sm sm:text-base font-extrabold border-2 transition-colors touch-manipulation ${
                  active
                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                    : "bg-white text-gray-800 border-gray-200 hover:border-purple-300 hover:bg-purple-50 active:bg-purple-100"
                }`}
              >
                <span className="text-base" aria-hidden="true">{a.emoji}</span>
                <span className={`w-2.5 h-2.5 rounded-full ${a.dot} ring-2 ${a.ring}`} aria-hidden="true" />
                <span className="whitespace-nowrap">{a.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      )}

      {/* Mobile menu — full-height sheet. Offset accounts for header (4rem) + age strip (~3.25rem). */}
      {mobileOpen && (
        <div
          className={`md:hidden fixed inset-x-0 bottom-0 ${hideAgeStrip ? "top-16" : "top-[7.5rem]"} z-40 bg-white overflow-y-auto`}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="px-5 pt-5 pb-24 flex flex-col gap-5">
            {/* Age shortcut chips — top of the sheet */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Pick your age
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ageShortcuts.map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-purple-50 border-2 border-purple-100 font-bold text-gray-900 hover:bg-purple-100"
                  >
                    <span className="text-2xl" aria-hidden="true">{a.emoji}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${a.dot} ring-2 ${a.ring}`} aria-hidden="true" />
                    <span>{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Main sections */}
            <div className="flex flex-col gap-1">
              <Link
                href="/coloring-pages"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 text-lg font-bold hover:bg-purple-50"
              >
                <span className="text-2xl">🎨</span>
                <span>Coloring Pages</span>
              </Link>

              {/* Games section */}
              <button
                onClick={() => setMobileSection(mobileSection === "games" ? null : "games")}
                className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 text-lg font-bold hover:bg-purple-50 w-full text-left"
                aria-expanded={mobileSection === "games"}
              >
                <span className="flex items-center gap-3"><span className="text-2xl">🎮</span>Games</span>
                <svg className={`w-5 h-5 transition-transform ${mobileSection === "games" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              {mobileSection === "games" && (
                <div className="pl-4 flex flex-col gap-1 mb-1">
                  {gamesMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-purple-50 text-base font-semibold"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Worksheets section */}
              <button
                onClick={() => setMobileSection(mobileSection === "worksheets" ? null : "worksheets")}
                className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 text-lg font-bold hover:bg-purple-50 w-full text-left"
                aria-expanded={mobileSection === "worksheets"}
              >
                <span className="flex items-center gap-3"><span className="text-2xl">📄</span>Worksheets</span>
                <svg className={`w-5 h-5 transition-transform ${mobileSection === "worksheets" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                </svg>
              </button>
              {mobileSection === "worksheets" && (
                <div className="pl-4 flex flex-col gap-1 mb-1">
                  {worksheetsMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 hover:bg-purple-50 text-base font-semibold"
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-gray-200 text-gray-900 text-lg font-bold hover:bg-purple-50"
              >
                <span className="text-2xl">📝</span>
                <span>Blog</span>
              </Link>
            </div>

            {/* Primary CTA */}
            <Link
              href="/games/times-tables-challenge"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-6 py-4 bg-purple-600 text-white rounded-full font-extrabold text-center hover:bg-purple-700 transition-colors text-lg shadow-lg"
            >
              🔢 Times Tables Challenge
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
