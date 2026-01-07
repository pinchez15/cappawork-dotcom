import Link from "next/link"
import { getPublishedPosts } from "@/lib/blog/posts"

export default function Blog() {
  const blogPosts = getPublishedPosts().slice(0, 3) // Show 3 most recent posts

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid Date"
    }
  }

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
        </div>

        {/* Blog Post Previews */}
        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white p-6 rounded-sm border border-stone-200 hover:border-stone-300 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-stone-600 leading-relaxed mb-4 line-clamp-3">
                  {post.description}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-stone-100 text-stone-700 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors font-medium text-sm"
                >
                  Read article →
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-stone-600 mb-4">New articles coming soon.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
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
