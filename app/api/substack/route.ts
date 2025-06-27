import { NextResponse } from "next/server"

export async function GET() {
  try {
    const rssUrl = "https://natepinches.substack.com/feed"

    // Fetch the RSS feed directly from the server
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "CappaWork-Website/1.0",
      },
      // Cache for 1 hour
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch RSS feed")
    }

    const xmlText = await response.text()

    // Parse XML to extract post data
    const posts = parseRSSFeed(xmlText)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching Substack RSS:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

function parseRSSFeed(xmlText: string) {
  // Simple XML parsing - in production, you might want to use a proper XML parser
  const items = xmlText.match(/<item>(.*?)<\/item>/gs) || []

  return items.slice(0, 3).map((item, index) => {
    const title =
      item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || "Untitled"

    const description =
      item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
      item.match(/<description>(.*?)<\/description>/)?.[1] ||
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
