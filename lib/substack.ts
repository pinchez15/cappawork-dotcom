export interface SubstackPost {
  title: string
  excerpt: string
  publishedDate: string
  url: string
  guid: string
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    // Substack RSS feed URL
    const rssUrl = "https://natepinches.substack.com/feed"

    // Use a CORS proxy or RSS-to-JSON service for client-side requests
    // For production, you'd want to use this in a server component or API route
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed")
    }

    const data = await response.json()

    return data.items.slice(0, 3).map((item: any) => ({
      title: item.title,
      excerpt: stripHtml(item.description).substring(0, 200) + "...",
      publishedDate: item.pubDate,
      url: item.link,
      guid: item.guid,
    }))
  } catch (error) {
    console.error("Error fetching Substack posts:", error)
    // Return fallback data if RSS fetch fails
    return getFallbackPosts()
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim()
}

function getFallbackPosts(): SubstackPost[] {
  return [
    {
      title: "Building Products That Last: Lessons from Traditional Craftsmanship",
      excerpt:
        "What medieval cathedral builders can teach us about software development and the importance of building for the long term.",
      publishedDate: "2024-01-15T00:00:00Z",
      url: "https://natepinches.substack.com/p/building-products-that-last",
      guid: "fallback-1",
    },
    {
      title: "The Rhythm of Work: Why Rest Makes Us More Productive",
      excerpt: "Exploring how the monastic tradition of work and prayer can inform modern product development cycles.",
      publishedDate: "2024-01-08T00:00:00Z",
      url: "https://natepinches.substack.com/p/rhythm-of-work",
      guid: "fallback-2",
    },
    {
      title: "Technology in Service of Human Flourishing",
      excerpt: "A framework for evaluating whether our digital tools are helping or hindering human development.",
      publishedDate: "2024-01-01T00:00:00Z",
      url: "https://natepinches.substack.com/p/technology-human-flourishing",
      guid: "fallback-3",
    },
  ]
}
