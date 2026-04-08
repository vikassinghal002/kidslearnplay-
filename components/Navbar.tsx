"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/coloring-pages", label: "Coloring Pages", emoji: "🎨" },
  { href: "/games", label: "Games", emoji: "🎮" },
  { href: "/worksheets", label: "Worksheets", emoji: "📄" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-purple-600">
          <span className="text-2xl">🌈</span>
          <span>KidsLearnPlay</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}
          <Link
            href="/worksheets"
            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Free Download
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700 mb-1" />
          <div className="w-5 h-0.5 bg-gray-700" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
            >
              <span>{link.emoji}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
