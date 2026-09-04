import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from "@/auth" // import auth.js setup
import { checkRateLimit, RATE_LIMIT_POLICIES, type RateLimitPolicy } from '@/lib/rate-limiter'

// Use Auth.js wrapper
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');
  const isAiRoute = req.nextUrl.pathname.startsWith('/api/chat') || req.nextUrl.pathname.startsWith('/api/optimize-prompt');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/');

  // Rate Limiting berdasarkan IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';

  let policy: RateLimitPolicy = RATE_LIMIT_POLICIES.GLOBAL;
  let category = 'global';

  if (isAuthRoute || isApiAuthRoute) {
    policy = RATE_LIMIT_POLICIES.AUTH;
    category = 'auth';
  } else if (isAiRoute) {
    policy = RATE_LIMIT_POLICIES.AI;
    category = 'ai';
  } else if (isApiRoute) {
    policy = RATE_LIMIT_POLICIES.API;
    category = 'api';
  }

  const rateCheck = checkRateLimit(`${clientIp}:${category}`, policy);

  if (!rateCheck.success) {
    return new NextResponse(
      JSON.stringify({
        error: 'Terlalu banyak permintaan (Rate limit exceeded). Silakan tunggu sejenak demi keamanan sistem.',
        retryAfterSeconds: rateCheck.retryAfterSeconds,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(rateCheck.retryAfterSeconds),
          'X-RateLimit-Limit': String(rateCheck.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateCheck.resetTime),
        },
      }
    );
  }

  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', String(rateCheck.limit));
  response.headers.set('X-RateLimit-Remaining', String(rateCheck.remaining));
  return response;
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
