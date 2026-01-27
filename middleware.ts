import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

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
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/substack(.*)',
  '/studio(.*)',
])

export default clerkMiddleware(async (auth, req) => {
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

