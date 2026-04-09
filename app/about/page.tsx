import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About KidsLearnPlay — Free Coloring Pages & Games",
  description: "About KidsLearnPlay — our mission to make free, high-quality educational content for every child.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-600">Home</Link> / <span className="text-gray-800">About</span>
      </nav>

      <div className="text-center mb-10">
        <div className="text-6xl mb-4">🌈</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">About KidsLearnPlay</h1>
        <p className="text-gray-500 text-lg">Free coloring pages, games &amp; worksheets for every child</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">

        <section className="bg-purple-50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
          <p>Every child deserves access to quality educational activities — regardless of whether their parents can afford a subscription. KidsLearnPlay makes hundreds of coloring pages, games, and printable worksheets available completely free, forever.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <div className="font-bold text-gray-800">130+ Coloring Pages</div>
              <div className="text-sm text-gray-500 mt-1">Kids, adults, mandalas, holidays and more</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🎮</div>
              <div className="font-bold text-gray-800">Educational Games</div>
              <div className="text-sm text-gray-500 mt-1">Math, counting, and alphabet games</div>
            </div>
            <div className="border border-gray-200 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">📄</div>
              <div className="font-bold text-gray-800">Printable Worksheets</div>
              <div className="text-sm text-gray-500 mt-1">Kindergarten through Grade 5</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Get in Touch</h2>
          <p>We&apos;d love to hear from you — whether you&apos;re a parent, teacher, or just a fan of coloring pages.</p>
          <p className="mt-2">Email us at: <strong className="text-purple-700">hello@kidslearnplay.com</strong></p>
        </section>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/coloring-pages"
          className="inline-block px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors"
        >
          Browse Free Coloring Pages →
        </Link>
      </div>
    </div>
  );
}
