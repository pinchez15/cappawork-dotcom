import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Navigation from "../../components/navigation"
import Footer from "../../components/footer"
import Link from "next/link"
import { getPostBySlug, getAllPostSlugs } from "@/lib/blog/posts"
import CodeBlockWithCopy from "../../components/code-block-with-copy"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Post Not Found | CappaWork",
    }
  }

  return {
    title: `${post.title} | CappaWork Blog`,
    description: post.description,
    keywords: post.tags.join(", "),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://cappawork.com/blog/${post.slug}`,
      publishedTime: post.date,
      tags: post.tags,
      siteName: "CappaWork",
      images: [
        {
          url: "https://cappawork.com/CW_homepage.png",
          width: 2400,
          height: 1600,
          alt: post.title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["https://cappawork.com/CW_homepage.png"],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
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

  // JSON-LD schema for BlogPosting
  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Nate Pinches",
    },
    publisher: {
      "@type": "Organization",
      name: "CappaWork",
      url: "https://cappawork.com",
    },
    url: `https://cappawork.com/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostSchema) }}
      />
      <main className="min-h-screen bg-stone-50">
        <Navigation />
        <article className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-8 text-sm font-medium"
            >
              ← Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-4">
                {post.title}
              </h1>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
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
            </header>

            {/* Content */}
            <div className="prose prose-stone prose-lg max-w-none">
              <CodeBlockWithCopy html={post.content} />
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-stone-200">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
              >
                ← Back to Blog
              </Link>
            </div>
          </div>
        </article>
        <Footer />
      </main>
    </>
  )
}

