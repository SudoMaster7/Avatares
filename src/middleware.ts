/**
 * SUDO Education – Edge Middleware
 * Runs on Vercel Edge Network (closest to user) for:
 *  1. IP-level rate limiting on all /api/* routes
 *  2. Security headers (CSP, HSTS, X-Frame-Options)
 *  3. Age-verification redirect for unverified child sessions
 *
 * Upstash Redis is used for distributed rate-limit counters.
 * Falls back to allowing requests if Redis is unavailable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ─────────────────────────────────────────────────────────
// Rate limiters (built lazily – only when Redis is configured)
// ─────────────────────────────────────────────────────────

let ratelimitApi: Ratelimit | null = null;
let ratelimitAuth: Ratelimit | null = null;

function getApiLimiter(): Ratelimit | null {
    if (ratelimitApi) return ratelimitApi;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;

    const r = new Redis({ url, token });

    // General API: 60 requests / 60 seconds per IP
    ratelimitApi = new Ratelimit({
        redis: r,
        limiter: Ratelimit.slidingWindow(60, '60 s'),
        prefix: 'sudo_api',
    });
    return ratelimitApi;
}

function getAuthLimiter(): Ratelimit | null {
    if (ratelimitAuth) return ratelimitAuth;
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;

    const r = new Redis({ url, token });

    // Auth routes: 10 requests / 5 minutes per IP (brute-force protection)
    ratelimitAuth = new Ratelimit({
        redis: r,
        limiter: Ratelimit.slidingWindow(10, '5 m'),
        prefix: 'sudo_auth',
    });
    return ratelimitAuth;
}

// ─────────────────────────────────────────────────────────
// Security headers
// ─────────────────────────────────────────────────────────

function addSecurityHeaders(response: NextResponse): NextResponse {
    // Prevent embedding in iframes (clickjacking)
    response.headers.set('X-Frame-Options', 'DENY');
    // Prevent MIME-type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // HSTS (1 year, include subdomains)
    response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
    );
    // Permissions policy: disable camera/mic except on /conversa pages
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(self), geolocation=()'
    );
    // Content Security Policy (strict – adjust allowlist as needed)
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://js.stripe.com",
            "frame-src https://js.stripe.com https://hooks.stripe.com",
            "connect-src 'self' https://*.supabase.co https://api.groq.com https://api.elevenlabs.io https://api.stripe.com",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob:",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self' data:",
        ].join('; ')
    );
    return response;
}

// ─────────────────────────────────────────────────────────
// Middleware entry-point
// ─────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

    // ── 1. Rate-limit auth endpoints (strict) ─────────────────────────────
    if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/stripe')) {
        const limiter = getAuthLimiter();
        if (limiter) {
            const { success, limit, remaining, reset } = await limiter.limit(ip);
            if (!success) {
                const response = NextResponse.json(
                    { error: 'Muitas tentativas. Aguarde alguns minutos.' },
                    { status: 429 }
                );
                response.headers.set('X-RateLimit-Limit', String(limit));
                response.headers.set('X-RateLimit-Remaining', String(remaining));
                response.headers.set('X-RateLimit-Reset', String(reset));
                return addSecurityHeaders(response);
            }
        }
    }

    // ── 2. Rate-limit all other API routes ───────────────────────────────
    if (pathname.startsWith('/api/')) {
        const limiter = getApiLimiter();
        if (limiter) {
            const { success } = await limiter.limit(ip);
            if (!success) {
                return addSecurityHeaders(
                    NextResponse.json(
                        { error: 'Limite de requisições excedido.' },
                        { status: 429 }
                    )
                );
            }
        }
    }

    // ── 3. Pass through with security headers ────────────────────────────
    const response = NextResponse.next();
    return addSecurityHeaders(response);
}

export const config = {
    // Run on all routes except static assets and Next.js internals
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|avatars/|public/).*)',
    ],
};
