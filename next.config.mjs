/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Re-enable ESLint for security
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Temporarily disabled for initial launch - re-enable after fixing types
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.com https://clerk.com https://challenges.cloudflare.com https://*.cloudflare.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://clerk-telemetry.com https://challenges.cloudflare.com https://*.cloudflare.com https://natepinches.substack.com https://api.rss2json.com https://formspree.io; frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://clerk.com https://challenges.cloudflare.com https://*.cloudflare.com; frame-ancestors 'none';"
          }
        ]
      }
    ]
  }
}

export default nextConfig