import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navigation from "../../components/navigation";
import Footer from "../../components/footer";
import Link from "next/link";
import MarketingShell from "../../components/marketing-shell";
import { GlyphKey, OrbStation } from "../../components/glyphs";
import { getBlogPostBySlug } from "@/server/repos/blog";
import { renderTipTapContent } from "@/lib/blog/tiptap-renderer";
import CodeBlockWithCopy from "../../components/code-block-with-copy";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

  const dateStr = post.published_at || post.created_at;

  return {
    title: `${post.title} | CappaWork Blog`,
    description: post.description || undefined,
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      type: "article",
      url: `https://cappawork.com/blog/${post.slug}`,
      publishedTime: dateStr,
      siteName: "CappaWork",
      images: [
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
      images: ["https://cappawork.com/og-image.png"],
    },
  };
}

function estimateReadTime(content: any): string {
  const text =
    typeof content === "string"
      ? content.replace(/<[^>]*>/g, "")
      : JSON.stringify(content);
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 250));
  return `${minutes} min read`;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug, true);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
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

  const dateStr = post.published_at || post.created_at;

  // Render content: HTML string used directly, TipTap JSON rendered to HTML
  const htmlContent =
    typeof post.content === "string"
      ? post.content
      : renderTipTapContent(post.content);

  // JSON-LD schema for BlogPosting
  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: dateStr,
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
      <MarketingShell>
      <main className="min-h-screen bg-warm-white">
        <Navigation />
        <article className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-stone-600 hover:text-gold transition-colors mb-8 text-sm font-medium"
            >
              ← Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <OrbStation kind="agent" label={post.title} />
                <GlyphKey />
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
                <time dateTime={dateStr}>
                  {formatDate(dateStr)}
                </time>
                <span>·</span>
                <span>{estimateReadTime(post.content)}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-navy mb-4 font-display">
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
            <div className="mt-12 pt-8 border-t border-card-border">
              <div className="mb-4">
                <OrbStation kind="human" label="Discovery call" />
              </div>
              <Link
                href="/#discovery"
                className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
              >
                Book a Discovery Call
              </Link>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-stone-700 hover:text-gold transition-colors font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </article>
        <Footer />
      </main>
      </MarketingShell>
    </>
  );
}
