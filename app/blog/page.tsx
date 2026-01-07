import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import Link from "next/link"
import { getPublishedPosts } from "@/lib/blog/posts"

export const metadata: Metadata = {
  title: "Blog - Helper Articles for Builders | CappaWork",
  description:
    "Practical guides for PMs and Designers who are building their own products. From discovery to launch, these articles help you move faster and avoid common pitfalls.",
  keywords:
    "product management, product design, MVP development, product discovery, design handoffs, product launch, builder guides, PM guides, designer guides",
  openGraph: {
    title: "Blog - Helper Articles for Builders | CappaWork",
    description:
      "Practical guides for PMs and Designers who are building their own products. From discovery to launch, these articles help you move faster and avoid common pitfalls.",
    type: "website",
    url: "https://cappawork.com/blog",
    siteName: "CappaWork",
    images: [
      {
        url: "https://cappawork.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CappaWork Blog - Helper Articles for Builders",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Helper Articles for Builders | CappaWork",
    description:
      "Practical guides for PMs and Designers who are building their own products. From discovery to launch, these articles help you move faster and avoid common pitfalls.",
    images: ["https://cappawork.com/og-image.png"],
  },
}

export default function BlogPage() {
  const blogPosts = getPublishedPosts()

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

  // JSON-LD schema for Blog
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Helper Articles for Builders",
    description:
      "Practical guides for PMs and Designers who are building their own products. From discovery to launch, these articles help you move faster and avoid common pitfalls.",
    url: "https://cappawork.com/blog",
    publisher: {
      "@type": "Organization",
      name: "CappaWork",
      url: "https://cappawork.com",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <main className="min-h-screen bg-stone-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-4">
                Helper Articles for Builders
              </h1>
              <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                Practical guides for PMs and Designers who are building their own products. From
                discovery to launch, these articles help you move faster and avoid common pitfalls.
              </p>
            </div>

            {/* Posts Grid or Empty State */}
            {blogPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <p className="text-stone-600 text-lg mb-8">
                    New articles coming soon. Check back for guides on product discovery, MVP
                    scoping, design handoffs, and more.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full font-medium hover:bg-stone-800 transition-all duration-200"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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

                    <h2 className="text-xl font-semibold tracking-tight text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    <p className="text-stone-600 leading-relaxed mb-4">{post.description}</p>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
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
                      Read article
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    </>
  )
}

