import Link from "next/link"

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-4">
            Helper Articles for Builders
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8">
            Practical guides for PMs and Designers who are building their own products. From
            discovery to launch, these articles help you move faster and avoid common pitfalls.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-all duration-200"
          >
            View all articles
          </Link>
        </div>
      </div>
    </section>
  )
}
