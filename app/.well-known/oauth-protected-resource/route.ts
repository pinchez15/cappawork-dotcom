import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728).
 */
export async function GET() {
  const base = getSiteUrl()
  const issuer = process.env.OPENID_ISSUER?.replace(/\/$/, "")

  const body = {
    resource: `${base}/api`,
    authorization_servers: issuer ? [issuer] : [],
    scopes_supported: ["openid", "profile", "email"],
    bearer_methods_supported: ["header"],
  }

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
