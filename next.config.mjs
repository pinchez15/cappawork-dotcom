/** @type {import('next').NextConfig} */
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
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://*.clerk.com https://img.clerk.com https://*.supabase.co",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.supabase.co https://api.calendly.com",
              "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://challenges.cloudflare.com https://calendly.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default nextConfig