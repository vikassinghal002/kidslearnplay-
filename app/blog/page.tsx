import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "JiggyJoy Blog — Free Resources & Tips for Parents",
  description:
    "Free resources, activity ideas and tips for parents and teachers. Math games, coloring pages, worksheets and more for kids aged 2–12.",
  keywords: [
    "kids learning resources",
    "free printables for kids",
    "math games for kids",
    "educational activities",
    "coloring pages",
    "worksheets for kids",
  ],
};

const categoryColors: Record<string, string> = {
  "Math Games": "bg-blue-100 text-blue-700",
  "Coloring Pages": "bg-pink-100 text-pink-700",
  "Worksheets": "bg-green-100 text-green-700",
};

export default function BlogPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            JiggyJoy Blog
          </h1>
          <p className="text-lg text-white/90 max-w-xl mx-auto">
            Free resources, activity ideas and expert tips for parents and teachers raising curious kids aged 2–12.
          </p>
        </div>
      </section>

      {/* Blog post grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post) => {
            const categoryClass =
              categoryColors[post.category] ?? "bg-gray-100 text-gray-700";
            const formattedDate = new Date(post.date).toLocaleDateString(
              "en-GB",
              { day: "numeric", month: "long", year: "numeric" }
            );

            return (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <time
                    dateTime={post.date}
                    className="text-xs text-gray-400 font-medium"
                  >
                    {formattedDate}
                  </time>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{post.readingTime}</span>
                </div>

                <span
                  className={`self-start text-xs font-semibold px-3 py-1 rounded-full mb-3 ${categoryClass}`}
                >
                  {post.category}
                </span>

                <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {post.title}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                  {post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors mt-auto"
                >
                  Read More →
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* SEO section */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Free Learning Resources for Kids
          </h2>
          <div className="prose text-gray-600 leading-relaxed space-y-3">
            <p>
              The JiggyJoy blog covers everything parents and teachers need to support learning at home and in the classroom. From{" "}
              <Link href="/games/math" className="text-indigo-600 hover:underline">
                free maths games
              </Link>{" "}
              to{" "}
              <Link href="/coloring-pages" className="text-indigo-600 hover:underline">
                printable coloring pages
              </Link>{" "}
              and{" "}
              <Link href="/worksheets" className="text-indigo-600 hover:underline">
                worksheets for every age
              </Link>
              , we share practical ideas you can use today.
            </p>
            <p>
              All resources featured on this blog are free — no subscription, no email, no catch.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
