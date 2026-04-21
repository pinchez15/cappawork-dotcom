import { NextResponse } from "next/server"

export const revalidate = 3600

/**
 * Proxies IdP discovery when OPENID_ISSUER is set (e.g. Clerk issuer URL).
 * Set OPENID_ISSUER to your Clerk Frontend API / Accounts URL without a trailing slash.
 */
export async function GET() {
  const issuer = process.env.OPENID_ISSUER?.replace(/\/$/, "")
  if (!issuer) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Set OPENID_ISSUER to your OpenID Provider issuer (for example your Clerk issuer URL) to enable discovery.",
      },
      { status: 503 }
    )
  }

  const upstream = await fetch(`${issuer}/.well-known/openid-configuration`, {
    next: { revalidate: 3600 },
  })

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream_discovery_failed", status: upstream.status },
      { status: 502 }
    )
  }

  const json = await upstream.json()
  return NextResponse.json(json, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
