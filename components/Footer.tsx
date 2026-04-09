"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PushPermission from "@/components/PushPermission";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.match(/^\/games\/[^/]+/) &&
      !pathname.match(/^\/games\/(math|kindergarten|halloween|christmas|easter|3-year-olds|4-year-olds|5-year-olds|preschool)$/)) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span className="text-2xl">🌈</span>
              <span>JiggyJoy</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free games, coloring pages and worksheets for kids. No signup, no cost.
            </p>
          </div>

          {/* Games */}
          <div>
            <h3 className="font-semibold text-white mb-3">Games</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/games" className="hover:text-white transition-colors">All Games</Link></li>
              <li><Link href="/games/math" className="hover:text-white transition-colors">Math Games</Link></li>
              <li><Link href="/games/kindergarten" className="hover:text-white transition-colors">Kindergarten Games</Link></li>
              <li><Link href="/games/3-year-olds" className="hover:text-white transition-colors">Games for 3 Year Olds</Link></li>
              <li><Link href="/games/halloween" className="hover:text-white transition-colors">Halloween Games</Link></li>
              <li><Link href="/games/christmas" className="hover:text-white transition-colors">Christmas Games</Link></li>
              <li><Link href="/games/easter" className="hover:text-white transition-colors">Easter Games</Link></li>
            </ul>
          </div>

          {/* Top Games */}
          <div>
            <h3 className="font-semibold text-white mb-3">Top Games</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/games/times-tables-challenge" className="hover:text-white transition-colors">Times Tables Challenge</Link></li>
              <li><Link href="/games/multiplication-blast" className="hover:text-white transition-colors">Multiplication Blast</Link></li>
              <li><Link href="/games/math-quiz" className="hover:text-white transition-colors">Math Quiz</Link></li>
              <li><Link href="/games/snake" className="hover:text-white transition-colors">Snake</Link></li>
              <li><Link href="/games/maths-play" className="hover:text-white transition-colors">Maths Play</Link></li>
              <li><Link href="/games/counting-game" className="hover:text-white transition-colors">Counting Stars</Link></li>
            </ul>
          </div>

          {/* Worksheets */}
          <div>
            <h3 className="font-semibold text-white mb-3">Worksheets</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/worksheets" className="hover:text-white transition-colors">All Worksheets</Link></li>
              <li><Link href="/worksheets/preschool" className="hover:text-white transition-colors">Preschool</Link></li>
              <li><Link href="/worksheets/kindergarten" className="hover:text-white transition-colors">Kindergarten</Link></li>
              <li><Link href="/worksheets/math" className="hover:text-white transition-colors">Math Worksheets</Link></li>
              <li><Link href="/worksheets/tracing" className="hover:text-white transition-colors">Tracing</Link></li>
              <li><Link href="/worksheets/alphabet" className="hover:text-white transition-colors">Alphabet</Link></li>
            </ul>
          </div>

          {/* Coloring + Blog */}
          <div>
            <h3 className="font-semibold text-white mb-3">Coloring Pages</h3>
            <ul className="space-y-2 text-sm mb-5">
              <li><Link href="/coloring-pages" className="hover:text-white transition-colors">All Coloring Pages</Link></li>
              <li><Link href="/coloring-pages/free-printable" className="hover:text-white transition-colors">Free Printable</Link></li>
              <li><Link href="/coloring-pages/easy" className="hover:text-white transition-colors">Easy Coloring</Link></li>
              <li><Link href="/coloring-pages/animals" className="hover:text-white transition-colors">Animals</Link></li>
              <li><Link href="/coloring-pages/holidays" className="hover:text-white transition-colors">Holidays</Link></li>
            </ul>
            <h3 className="font-semibold text-white mb-3">More</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/printables" className="hover:text-white transition-colors">Free Printables</Link></li>
              <li><Link href="/learn" className="hover:text-white transition-colors">How to Teach Guides</Link></li>
              <li><Link href="/activities/5-year-olds" className="hover:text-white transition-colors">Activities by Age</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex justify-center mb-6">
            <PushPermission />
          </div>
          <div className="text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-2">
            <p>© {new Date().getFullYear()} JiggyJoy. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
