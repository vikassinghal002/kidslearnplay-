import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — KidsLearnPlay",
  description: "Privacy Policy for KidsLearnPlay. Learn how we protect your children's privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-600">Home</Link> / <span className="text-gray-800">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: April 2026</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Overview</h2>
          <p>KidsLearnPlay (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates kidslearnplay.com. We are committed to protecting the privacy of children and families who use our website. This policy explains what information we collect and how we use it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Information We Collect</h2>
          <p>We do <strong>not</strong> require registration, login, or any personal information to use our site. All coloring pages, games, and worksheets are accessible without an account.</p>
          <p className="mt-2">We may collect anonymous usage data (pages visited, time on site) through standard analytics tools to help us improve the site. This data contains no personally identifiable information.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Children&apos;s Privacy (COPPA)</h2>
          <p>KidsLearnPlay is designed for use by children with parental supervision. We do not knowingly collect personal information from children under 13. We do not display behaviorally targeted advertising to children. If you believe we have inadvertently collected information from a child, please contact us immediately and we will delete it.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cookies</h2>
          <p>We use essential cookies to make the site function properly. We may use analytics cookies (such as Google Analytics) to understand how visitors use our site. These analytics cookies collect anonymous data only and do not identify individual users.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Advertising</h2>
          <p>We may display advertisements through Google AdSense. Google&apos;s advertising policies prohibit interest-based ads on pages with content directed primarily at children under 13. We configure our ad placements accordingly.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Third-Party Links</h2>
          <p>Our site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage parents to review their privacy policies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at: <strong>hello@kidslearnplay.com</strong></p>
        </section>
      </div>

      <div className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/" className="text-purple-600 hover:underline font-medium">← Back to Home</Link>
      </div>
    </div>
  );
}
