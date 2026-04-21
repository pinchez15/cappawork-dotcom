import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { isMarkdownNegotiationPath, prefersMarkdown } from '@/lib/agents/accept'

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/projects(.*)',
  '/dashboard(.*)',
])

// Routes that are public (marketing pages)
const isPublicRoute = createRouteMatcher([
  '/',
  '/about(.*)',
  '/blog(.*)',
  '/cohort(.*)',
  '/contact(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/transformation(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/substack(.*)',
  '/api/scorecard-lead',
  '/api/service-inquiry',
  '/scorecard(.*)',
  '/services(.*)',
  '/fulfillment-policy',
  '/studio(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl

  if (url.pathname === '/api/agents/markdown') {
    return NextResponse.next()
  }

  if (
    req.method === 'GET' &&
    prefersMarkdown(req.headers.get('accept')) &&
    isMarkdownNegotiationPath(url.pathname)
  ) {
    const rewrite = new URL('/api/agents/markdown', url.origin)
    rewrite.searchParams.set('path', url.pathname)
    return NextResponse.rewrite(rewrite)
  }

  const { userId, redirectToSignIn } = await auth()
  
  // If trying to access protected route without auth, redirect to sign-in
  if (isProtectedRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

