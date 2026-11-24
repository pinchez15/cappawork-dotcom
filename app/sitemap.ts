import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site"
import { getAllBlogPosts } from "@/server/repos/blog"

export const runtime = "nodejs"

const STATIC_PATHS = [
  "/",
  "/llms.txt",
  "/about",
  "/blog",
  "/contact",
  "/fulfillment-policy",
  "/privacy",
  "/terms",
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }))

  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllBlogPosts(true)
    blogEntries = posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at || p.published_at || p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  } catch {
    /* Supabase may be unavailable during local builds */
  }

  return [...staticEntries, ...blogEntries]
}
