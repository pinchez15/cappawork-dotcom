import { ExternalLink, Calendar } from "lucide-react"
import { getSubstackPosts } from "@/lib/substack"

export default async function Blog() {
  // Add error handling for the async data fetching
  let blogPosts
  try {
    blogPosts = await getSubstackPosts()
  } catch (error) {
    console.error('Error loading blog posts:', error)
    // Use empty array as fallback - the getSubstackPosts function has its own fallback
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
    if (!excerpt || typeof excerpt !== 'string') {
      return "1 min read"
    }
    const wordsPerMinute = 200
    const wordCount = excerpt.split(" ").length
    const readTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readTime} min read`
  }

  // If no posts are available, show a message
  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section id="blog" className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">Thoughts on Building Well</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-6">
              Reflections on product development, technology, and human flourishing.
            </p>
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
          <div className="text-center">
            <p className="text-stone-600 mb-8">Recent posts are loading... Please visit Substack directly for now.</p>
            <a
              href="https://natepinches.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-6 py-3 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200"
            >
              Visit Substack
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">Thoughts on Building Well</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-6">
            Reflections on product development, technology, and human flourishing.
          </p>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
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

              <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                {post.title || 'Untitled Post'}
              </h3>

              <p className="text-stone-600 leading-relaxed mb-4 line-clamp-3">
                {post.excerpt || 'No excerpt available.'}
              </p>

              <a
                href={post.url || 'https://natepinches.substack.com/'}
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

        <div className="text-center mt-12">
          <a
            href="https://natepinches.substack.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-6 py-3 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200"
          >
            Subscribe to the Newsletter
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}
