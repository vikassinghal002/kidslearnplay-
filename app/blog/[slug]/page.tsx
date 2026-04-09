import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPostBySlug, getRelatedPosts } from "@/lib/blog-posts";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: ["KidsLearnPlay"],
      tags: post.tags,
    },
  };
}

const categoryColors: Record<string, string> = {
  "Math Games": "bg-blue-100 text-blue-700",
  "Coloring Pages": "bg-pink-100 text-pink-700",
  "Worksheets": "bg-green-100 text-green-700",
};

const categoryLinks: Record<string, { href: string; label: string }[]> = {
  "Math Games": [
    { href: "/games/math", label: "Maths Games" },
    { href: "/games/maths-play", label: "Maths Play Game" },
    { href: "/games/math-addition", label: "Addition Adventure" },
  ],
  "Coloring Pages": [
    { href: "/coloring-pages", label: "All Coloring Pages" },
    { href: "/coloring-pages/characters", label: "Character Coloring Pages" },
    { href: "/coloring-pages/bold-easy", label: "Easy Coloring Pages" },
  ],
  "Worksheets": [
    { href: "/worksheets", label: "All Worksheets" },
    { href: "/worksheets/preschool", label: "Preschool Worksheets" },
    { href: "/worksheets/alphabet-worksheets", label: "Alphabet Worksheets" },
  ],
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.category);
  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const categoryClass =
    categoryColors[post.category] ?? "bg-gray-100 text-gray-700";
  const relatedLinks = categoryLinks[post.category] ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "KidsLearnPlay",
      url: "https://www.kidslearnplay.com",
    },
    publisher: {
      "@type": "Organization",
      name: "KidsLearnPlay",
      url: "https://www.kidslearnplay.com",
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-2">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>
          {" / "}
          <Link href="/blog" className="hover:text-indigo-600">
            Blog
          </Link>
          {" / "}
          <span className="text-gray-800 font-medium">{post.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main article */}
        <div className="lg:col-span-2">
          {/* Article hero */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <time
                dateTime={post.date}
                className="text-sm text-gray-500 font-medium"
              >
                {formattedDate}
              </time>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-500">{post.readingTime}</span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryClass}`}
              >
                {post.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-3">
              {post.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {post.description}
            </p>
          </div>

          {/* Article content */}
          <article
            className="prose prose-lg prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-ul:text-gray-700 prose-strong:text-gray-900 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="bg-indigo-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">Related Posts</h3>
              <div className="space-y-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="block group"
                  >
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors leading-snug mb-1">
                      {related.title}
                    </div>
                    <div className="text-xs text-gray-500">{related.readingTime}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Relevant resources */}
          {relatedLinks.length > 0 && (
            <div className="bg-purple-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 mb-4">
                Free Resources
              </h3>
              <ul className="space-y-2">
                {relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Back to blog */}
          <Link
            href="/blog"
            className="block text-center px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            ← All Blog Posts
          </Link>
        </aside>
      </div>
    </>
  );
}
