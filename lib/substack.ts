/**
 * Substack RSS feed integration
 * Handles fetching and parsing of blog posts from Substack RSS feed
 */

export interface SubstackPost {
  title: string
  excerpt: string
  publishedDate: string
  url: string
  guid: string
}

export async function getSubstackPosts(): Promise<SubstackPost[]> {
  try {
    const rssUrl = "https://natepinches.substack.com/feed"
    
    console.log('Fetching RSS directly from:', rssUrl)

    // Fetch RSS feed directly from Substack
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "CappaWork-Website/1.0",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
      // Cache for 1 hour to avoid hitting Substack too frequently
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      console.warn(`RSS fetch failed with status: ${response.status}`)
      return getFallbackPosts()
    }

    const xmlText = await response.text()
    console.log('RSS XML fetched successfully, length:', xmlText.length)

    // Parse the RSS feed
    const posts = parseRSSFeed(xmlText)
    console.log('Parsed posts count:', posts.length)

    if (posts.length === 0) {
      console.warn('No posts found in RSS feed, using fallback')
      return getFallbackPosts()
    }

    return posts.slice(0, 3).map((item: any) => ({
      title: sanitizeString(item.title || 'Untitled'),
      excerpt: sanitizeString(item.excerpt || 'No excerpt available'),
      publishedDate: item.publishedDate || new Date().toISOString(),
      url: sanitizeUrl(item.url || ''),
      guid: item.guid || `fallback-${Date.now()}`,
    }))
  } catch (error) {
    console.error('Error fetching Substack posts:', error)
    return getFallbackPosts()
  }
}

/**
 * Parse RSS XML feed and extract post data
 */
function parseRSSFeed(xmlText: string) {
  try {
    // Extract items from RSS feed
    const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || []

    return itemMatches.map((item, index) => {
      const title =
        item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || 
        item.match(/<title>(.*?)<\/title>/)?.[1] || 
        "Untitled"

      const description =
        item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
        item.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
        ""

      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ""
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString()
      const guid = item.match(/<guid.*?>(.*?)<\/guid>/)?.[1] || `post-${index}`

      // Strip HTML tags and create excerpt
      const excerpt = description
        .replace(/<[^>]*>/g, "")
        .replace(/&[^;]+;/g, "") // Remove HTML entities
        .trim()
        .substring(0, 200)

      return {
        title: title.trim(),
        excerpt: excerpt + (excerpt.length >= 200 ? "..." : ""),
        publishedDate: pubDate,
        url: link.trim(),
        guid,
      }
    })
  } catch (error) {
    console.error('Error parsing RSS feed:', error)
    return []
  }
}

/**
 * Sanitize string input to prevent XSS
 */
function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 500) // Limit length
}

/**
 * Sanitize URL to ensure it's a valid HTTPS URL
 */
function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)
    // Only allow HTTPS URLs from trusted domains
    if (parsedUrl.protocol === 'https:' && 
        (parsedUrl.hostname === 'natepinches.substack.com' || 
         parsedUrl.hostname === 'substack.com')) {
      return parsedUrl.toString()
    }
  } catch {
    // Invalid URL
  }
  return 'https://natepinches.substack.com'
}

/**
 * Secure fallback posts with static content
 */
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
