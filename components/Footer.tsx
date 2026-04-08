import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-3">
              <span className="text-2xl">🌈</span>
              <span>KidsLearnPlay</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Free coloring pages, educational games and printable worksheets for kids of all ages.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Coloring Pages</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/coloring-pages/animals" className="hover:text-white transition-colors">Animal Coloring</Link></li>
              <li><Link href="/coloring-pages/characters" className="hover:text-white transition-colors">Character Coloring</Link></li>
              <li><Link href="/coloring-pages/holidays" className="hover:text-white transition-colors">Holiday Coloring</Link></li>
              <li><Link href="/coloring-pages/for-adults" className="hover:text-white transition-colors">Adult Coloring</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Games</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/games" className="hover:text-white transition-colors">All Games</Link></li>
              <li><Link href="/games/maths-play" className="hover:text-white transition-colors">Maths Play</Link></li>
              <li><Link href="/games/color-by-number" className="hover:text-white transition-colors">Colour by Number</Link></li>
              <li><Link href="/games/math-addition" className="hover:text-white transition-colors">Math Games</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Worksheets</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/worksheets" className="hover:text-white transition-colors">All Worksheets</Link></li>
              <li><Link href="/worksheets/kindergarten-math-worksheets" className="hover:text-white transition-colors">Kindergarten Math</Link></li>
              <li><Link href="/worksheets/multiplication-worksheets" className="hover:text-white transition-colors">Multiplication</Link></li>
              <li><Link href="/worksheets/alphabet-worksheets" className="hover:text-white transition-colors">Alphabet</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} KidsLearnPlay. All rights reserved.</p>
          <p>Free printable resources for parents, teachers and kids.</p>
        </div>
      </div>
    </footer>
  );
}
