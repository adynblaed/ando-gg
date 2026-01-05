/**
 * Clerk Authentication Middleware
 * 
 * Provides authentication state throughout the application via Clerk's middleware.
 * All routes are public by default; protection must be opted-in per route.
 * 
 * @see https://clerk.com/docs/nextjs/middleware
 * 
 * Note: For Next.js ≤15, rename this file to `middleware.ts` instead of `proxy.ts`.
 * The code remains the same; only the filename changes.
 */
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

/**
 * Middleware matcher configuration
 * 
 * - Skips Next.js internals and static files (unless found in search params)
 * - Always runs for API routes and tRPC routes
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

