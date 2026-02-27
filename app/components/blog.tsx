import Link from "next/link"
import { getAllBlogPosts } from "@/server/repos/blog"

function estimateReadTime(content: any): string {
  const text =
    typeof content === "string"
      ? content.replace(/<[^>]*>/g, "")
      : JSON.stringify(content)
  const words = text.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 250))
  return `${minutes} min read`
}

export default async function Blog() {
  const allPosts = await getAllBlogPosts(true)
  const blogPosts = allPosts.slice(0, 3) // Show 3 most recent posts

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
    <section id="blog" className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy mb-4">
            Insights
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8">
            Practical insights on operational efficiency, AI transformation, and scaling
            your business without scaling your headcount.
          </p>
        </div>

        {/* Blog Post Previews */}
        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-card-light p-6 rounded-2xl border border-card-border hover:border-stone-300 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                  <time dateTime={post.published_at || post.created_at}>
                    {formatDate(post.published_at || post.created_at)}
                  </time>
                  <span>•</span>
                  <span>{estimateReadTime(post.content)}</span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-navy mb-3 group-hover:text-stone-700 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-stone-600 leading-relaxed mb-4 line-clamp-3">
                  {post.description}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-navy hover:text-gold transition-colors font-medium text-sm"
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
            className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full font-medium hover:bg-navy/90 transition-all duration-200"
          >
            View all articles
          </Link>
        </div>
      </div>
    </section>
  )
}
