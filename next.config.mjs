/** @type {import('next').NextConfig} */
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cappawork.com').replace(/\/$/, '')

const nextConfig = {
  eslint: {
    // Re-enable ESLint for security
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Build env may lack Clerk keys causing runtime errors during prerender.
    // Type safety enforced via `npx tsc --noEmit` in CI instead.
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: [
              `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"`,
              `<${siteUrl}/.well-known/agent-skills/index.json>; rel="item"`,
              `<${siteUrl}/sitemap.xml>; rel="sitemap"`,
              `<${siteUrl}/.well-known/oauth-protected-resource>; rel="oauth-protected-resource"`,
              `<${siteUrl}/.well-known/openid-configuration>; rel="openid-configuration"`,
            ].join(', '),
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
          // CSP intentionally omitted — Clerk loads resources from dynamic
          // subdomains (*.clerk.com, *.clerk.accounts.dev, *.cloudflare.com)
          // that break with a static allowlist. Revisit when Clerk publishes
          // a stable CSP-compatible origin list.
        ]
      }
    ]
  }
}

export default nextConfig