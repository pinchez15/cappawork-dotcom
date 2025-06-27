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
    // Use our secure server-side API route instead of third-party service
    // This works in Server Components (which blog.tsx is)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : 'https://cappawork.com'
        
    const response = await fetch(`${baseUrl}/api/substack`, {
      // Use Next.js 13+ fetch options for server components
      cache: 'force-cache',
      next: { 
        revalidate: 86400 // 24 hours - this is valid in server components
      }
    })

    if (!response.ok) {
      console.warn('Failed to fetch posts from API route, using fallback')
      return getFallbackPosts()
    }

    const posts = await response.json()
    
    // Validate the response structure
    if (!Array.isArray(posts)) {
      console.warn('Invalid response format, using fallback')
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
    // Return secure fallback data if API fails
    return getFallbackPosts()
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
