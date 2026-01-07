import { ExternalLink, Calendar } from "lucide-react"
import { getSubstackPosts } from "@/lib/substack"

export default async function SubstackSection() {
  // Fetch Substack posts with error handling
  let blogPosts: Array<any>
  try {
    blogPosts = await getSubstackPosts()
  } catch (error) {
    console.error("Error loading Substack posts:", error)
    blogPosts = []
  }

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

  const estimateReadTime = (excerpt: string) => {
    if (!excerpt || typeof excerpt !== "string") {
      return "1 min read"
    }
    const wordsPerMinute = 200
    const wordCount = excerpt.split(" ").length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  // Show up to 4 recent posts
  const displayPosts = blogPosts.slice(0, 4)

  return (
    <section className="mt-16 pt-16 border-t border-stone-200">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-stone-900 mb-4">Also by Nate</h2>
        <p className="text-stone-600 leading-relaxed">
          I also write about product development, technology, and building well on Substack.
        </p>
      </div>

      {displayPosts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-stone-600 mb-4">Recent posts are loading...</p>
          <a
            href="https://natepinches.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
          >
            Visit Substack
            <ExternalLink size={16} />
          </a>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {displayPosts.map((post, index) => (
              <article
                key={post.guid || `post-${index}`}
                className="bg-white p-6 rounded-sm border border-stone-200 hover:border-stone-300 transition-all duration-200 hover:shadow-sm group"
              >
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-3">
                  <Calendar size={14} />
                  <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>
                  <span>•</span>
                  <span>{estimateReadTime(post.excerpt)}</span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                  {post.title || "Untitled Post"}
                </h3>

                <p className="text-stone-600 leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt || "No excerpt available."}
                </p>

                <a
                  href={post.url || "https://natepinches.substack.com/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors font-medium text-sm"
                >
                  Read on Substack
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </article>
            ))}
          </div>

          <div className="text-center">
            <a
              href="https://natepinches.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
            >
              Read all posts on Substack
              <ExternalLink size={16} />
            </a>
          </div>
        </>
      )}
    </section>
  )
}

