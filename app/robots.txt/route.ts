import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

function block(): string {
  const base = getSiteUrl()
  return [
    "User-agent: *",
    "Content-Signal: ai-train=no, search=yes, ai-input=no",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /admin/",
    "Disallow: /dashboard",
    "Disallow: /dashboard/",
    "Disallow: /projects",
    "Disallow: /projects/",
    "Disallow: /api/",
    "Disallow: /sign-in",
    "Disallow: /sign-up",
    "",
    "User-agent: GPTBot",
    "Content-Signal: ai-train=no, search=yes, ai-input=no",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /dashboard/",
    "Disallow: /projects/",
    "Disallow: /api/",
    "",
    "User-agent: OAI-SearchBot",
    "Content-Signal: ai-train=no, search=yes, ai-input=no",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /dashboard/",
    "Disallow: /projects/",
    "Disallow: /api/",
    "",
    "User-agent: Claude-Web",
    "Content-Signal: ai-train=no, search=yes, ai-input=no",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /dashboard/",
    "Disallow: /projects/",
    "Disallow: /api/",
    "",
    "User-agent: Google-Extended",
    "Content-Signal: ai-train=no, search=yes, ai-input=no",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /dashboard/",
    "Disallow: /projects/",
    "Disallow: /api/",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n")
}

export async function GET() {
  return new NextResponse(block(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
