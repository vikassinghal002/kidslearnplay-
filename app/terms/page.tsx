import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use — KidsLearnPlay",
  description: "Terms of Use for KidsLearnPlay free coloring pages, games and worksheets.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-600">Home</Link> / <span className="text-gray-800">Terms of Use</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: April 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Free Personal Use</h2>
          <p>All coloring pages, games, and worksheets on KidsLearnPlay are free for personal and classroom use. You may print, download, and share them for non-commercial educational purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">What You May Do</h2>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Print coloring pages for personal or classroom use</li>
            <li>Share printed copies with students or family members</li>
            <li>Use worksheets as part of home or classroom education</li>
            <li>Play all games freely online</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">What You May Not Do</h2>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Sell or redistribute our content for commercial gain</li>
            <li>Claim our content as your own original work</li>
            <li>Use our content in products sold online without permission</li>
            <li>Scrape or bulk-download our images or content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Disclaimer</h2>
          <p>KidsLearnPlay provides content &ldquo;as is&rdquo; without warranties. We are not liable for any damages arising from use of this website.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contact</h2>
          <p>Questions? Email us at <strong>hello@kidslearnplay.com</strong></p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/" className="text-purple-600 hover:underline font-medium">← Back to Home</Link>
      </div>
    </div>
  );
}
