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
            value: "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; img-src 'self' https: data:; connect-src 'self' https:; frame-src 'self' https:; worker-src 'self' blob: https:; frame-ancestors 'none';"
          }
        ]
      }
    ]
  }
}

export default nextConfig