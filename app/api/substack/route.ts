import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rssUrl = "https://natepinches.substack.com/feed"
    
    console.log('API Route: Fetching RSS from:', rssUrl) // Debug log

    // Fetch the RSS feed directly from the server
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "CappaWork-Website/1.0",
      },
      // Remove cache for debugging
      // cache: 'force-cache',
    })

    console.log('RSS Response status:', response.status) // Debug log

    if (!response.ok) {
      console.error('RSS fetch failed with status:', response.status)
      throw new Error(`Failed to fetch RSS feed: ${response.status}`)
    }

    const xmlText = await response.text()
    console.log('RSS XML length:', xmlText.length) // Debug log

    // Parse XML to extract post data
    const posts = parseRSSFeed(xmlText)
    console.log('Parsed posts count:', posts.length) // Debug log

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error("Error fetching Substack RSS:", error)
    return NextResponse.json({ 
      error: "Failed to fetch posts", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function parseRSSFeed(xmlText: string) {
  // Simple XML parsing - using compatible regex flags
  const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || []

  return itemMatches.slice(0, 3).map((item, index) => {
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

    // Strip HTML and truncate description
    const excerpt =
      description
        .replace(/<[^>]*>/g, "")
        .trim()
        .substring(0, 200) + "..."

    return {
      title: title.trim(),
      excerpt,
      publishedDate: pubDate,
      url: link.trim(),
      guid,
    }
  })
}

// Add revalidation for Next.js App Router
export const revalidate = 86400 // 24 hours
