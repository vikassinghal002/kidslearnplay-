import type { Metadata } from "next";
import Link from "next/link";
import { coloringCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Easy Coloring Pages for Kids — Free Printable | JiggyJoy",
  description:
    "Simple, easy coloring pages for young kids and beginners! Large areas, bold outlines — perfect for toddlers, preschoolers and kindergartners. Free to print.",
};

const easyCategories = coloringCategories.filter(
  (cat) => cat.audience === "kids"
);

export default function EasyColoringPages() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero — light gradient with dark text */}
      <section className="bg-gradient-to-br from-sky-400 via-blue-400 to-indigo-400 py-14 px-4 text-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4 flex justify-center gap-3">
            <span>🐱</span>
            <span>🐶</span>
            <span>🌟</span>
            <span>🌈</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Easy Coloring Pages for Kids
          </h1>
          <p className="text-lg mb-6 max-w-xl mx-auto text-gray-800">
            Simple bold outlines perfect for little hands! Our easy coloring
            pages are great for toddlers and preschoolers.
          </p>
        </div>
      </section>

      {/* Feature callout */}
      <div className="bg-sky-50 border-b border-sky-100 py-4 px-4">
        <p className="text-center text-sm font-semibold text-sky-700 tracking-wide">
          Large Areas · Bold Outlines · Perfect for Ages 2–6
        </p>
      </div>

      {/* Category grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Simple Coloring Pages for Beginners
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Showing our simplest coloring categories — great for beginners:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {easyCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/coloring-pages/${cat.slug}`}
              className={`${cat.color} rounded-2xl p-6 flex items-center gap-5 hover:scale-[1.02] transition-transform shadow-sm`}
            >
              <span className="text-5xl flex-shrink-0">{cat.icon}</span>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {cat.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {cat.description}
                </p>
                <span className="inline-block text-xs bg-white/60 text-gray-700 px-3 py-1 rounded-full font-medium">
                  {cat.pages.length} free pages →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO copy */}
      <section className="max-w-3xl mx-auto px-4 pb-14">
        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Easy Coloring Pages for Toddlers
            </h2>
            <p className="mb-3">
              The best coloring pages for toddlers have three things in common:
              large areas to fill, bold thick outlines that are easy to colour
              inside, and friendly recognisable subjects that children love —
              animals, characters and simple everyday objects. All of our
              easy coloring pages are designed with exactly these principles in
              mind, making them ideal for children aged 2 to 6.
            </p>
            <p className="mb-3">
              Young children are still developing the fine motor control needed
              to colour within small areas, so oversized shapes and thick borders
              give them the freedom to colour with confidence. Every successful
              page they complete builds pride, perseverance and the fine motor
              skills that directly support writing readiness.
            </p>
            <p>
              All pages are free to download and print — no account or signup
              needed. Just click, print and colour!
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Preschool Coloring Pages
            </h2>
            <p className="mb-3">
              Preschool educators have long used coloring as a core classroom
              activity — and for good reason. Colouring develops pencil grip,
              concentration and the ability to follow visual instructions, all
              of which are foundational for the school years ahead. Our animal,
              character and holiday coloring pages are popular choices for
              preschool classrooms and home learning alike.
            </p>
            <p>
              Holiday themed pages — Christmas trees, Easter eggs, Halloween
              pumpkins — are particularly popular because they tie colouring
              to real-world events children are excited about. Colouring a Santa
              or an Easter bunny is never just colouring: it's connected,
              meaningful activity that children remember.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Simple Animal Coloring Pages for Kids
            </h2>
            <p className="mb-3">
              Animals are by far the most popular coloring subject for young
              children. Our animals category includes cats, dogs, horses,
              dinosaurs, elephants, lions, butterflies and many more — each
              drawn in a simple, friendly cartoon style that is easy to colour
              at any skill level. The dinosaur and butterfly pages are
              perennial favourites with both toddlers and early primary
              school children.
            </p>
            <p>
              For children who love popular characters, our characters category
              offers easy-to-colour pages featuring Bluey, PAW Patrol, Hello
              Kitty, Pokemon and more. These pages combine the fun of favourite
              characters with the developmental benefits of colouring, making
              them a win for children and parents alike.
            </p>
          </div>
        </div>
      </section>

      {/* Back links */}
      <section className="border-t border-gray-200 py-8 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/coloring-pages" className="text-blue-600 hover:underline">
            ← All Coloring Pages
          </Link>
          <Link href="/coloring-pages/free-printable" className="text-blue-600 hover:underline">
            Free Printable Coloring Pages →
          </Link>
          <Link href="/games" className="text-blue-600 hover:underline">
            Free Kids Games →
          </Link>
        </div>
      </section>
    </div>
  );
}
