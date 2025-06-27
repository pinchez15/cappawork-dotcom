import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rssUrl = "https://natepinches.substack.com/feed"

    // Fetch the RSS feed directly from the server
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "CappaWork-Website/1.0",
      },
      // Add cache control headers
      cache: 'force-cache',
    })

    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed")
    }

    const xmlText = await response.text()

    // Parse XML to extract post data
    const posts = parseRSSFeed(xmlText)

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error("Error fetching Substack RSS:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
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
