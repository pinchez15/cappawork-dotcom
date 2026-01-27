import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import { getBlogPostBySlug } from "@/server/repos/blog";
import { renderTipTapContent } from "@/lib/blog/tiptap-renderer";
import CodeBlockWithCopy from "../../components/code-block-with-copy";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, true);

  if (!post) {
    return {
      title: "Post Not Found | CappaWork",
    };
  }

  return {
    title: `${post.title} | CappaWork Blog`,
    description: post.description || undefined,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      type: "article",
      url: `https://cappawork.com/blog/${post.slug}`,
      publishedTime: post.published_at || undefined,
      siteName: "CappaWork",
      images: post.featured_image_url
        ? [
            {
              url: post.featured_image_url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [
            {
              url: "https://cappawork.com/og-image.png",
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || undefined,
      images: post.featured_image_url
        ? [post.featured_image_url]
        : ["https://cappawork.com/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, true);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const htmlContent = renderTipTapContent(post.content);

  // JSON-LD schema for BlogPosting
  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.published_at,
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
  };

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
              {post.published_at && (
                <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                  <time dateTime={post.published_at}>
                    {formatDate(post.published_at)}
                  </time>
                </div>
              )}

              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-4">
                {post.title}
              </h1>

              {post.description && (
                <p className="text-lg text-stone-600">{post.description}</p>
              )}
            </header>

            {/* Content */}
            <div className="prose prose-stone prose-lg max-w-none">
              <CodeBlockWithCopy html={htmlContent} />
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
  );
}
