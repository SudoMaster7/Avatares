/**
 * SUDO Education – Chat API Route (v3)
 * - Token-based usage control (guest/free/pro)
 * - Quality tiers (basic vs premium models)
 * - Content guardrails (child-safe)
 * - Avatar plan gate
 * - Safety system prompt injection
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { createClient } from '@supabase/supabase-js';
import {
    filterInput,
    sanitiseOutput,
    buildSafeSystemPrompt,
    BLOCKED_RESPONSE_MSG,
} from '@/lib/guardrails';
import {
    getTokenState,
    consumeTokens,
    canPerformAction,
    TOKEN_COSTS,
    MODEL_CONFIG,
    TOKEN_LIMITS,
} from '@/lib/tokens';
import { canUseAvatar, FREE_AVATAR_IDS } from '@/types/plans';

// ─── Supabase service-role client (server-side only) ────────────────────────
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Supabase anon client for JWT verification ───────────────────────────────
// Uses anon key — sufficient for auth.getUser(jwt) which validates via Supabase public keys
const supabaseVerify = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Groq LLM client ─────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── In-memory IP-based fallback rate limiter (Vercel Edge friendly) ─────────
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkIpRateLimit(ip: string, maxPerMin = 20): boolean {
    const now = Date.now();
    const entry = ipHits.get(ip);
    if (!entry || entry.resetAt < now) {
        ipHits.set(ip, { count: 1, resetAt: now + 60_000 });
        return true;
    }
    if (entry.count >= maxPerMin) return false;
    entry.count++;
    return true;
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    try {
        // ── 0. IP rate limit ────────────────────────────────────────────────
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
        if (!checkIpRateLimit(ip)) {
            return NextResponse.json(
                { error: 'Muitas requisições. Aguarde um momento.' },
                { status: 429 }
            );
        }

        // ── 1. Parse body ───────────────────────────────────────────────────
        const {
            messages,
            userId,           // null for guest, string for authenticated
            avatarId,         // which avatar is being used
            userMessage,      // raw latest user message for filtering
            isDemo,           // flag for demo mode (pre-login)
        } = await request.json();

        // ── 2. Input guardrail ──────────────────────────────────────────────
        if (userMessage) {
            const filterResult = filterInput(userMessage);
            if (!filterResult.safe) {
                // Log to moderation_log (fire-and-forget)
                if (userId) {
                    void supabaseAdmin.from('moderation_log').insert({
                        user_id: userId,
                        message_text: userMessage,
                        flagged_reason: filterResult.reason ?? 'policy_violation',
                        action_taken: 'blocked',
                    });
                }
                return NextResponse.json({ content: BLOCKED_RESPONSE_MSG });
            }
        }

        // ── 3. Detect admin ─────────────────────────────────────────────────
        // Strategy A: decode JWT payload directly (no network call, always works)
        let isAdmin = false;
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
            try {
                const jwt = authHeader.slice(7);
                const payload = JSON.parse(
                    Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8')
                );
                // Supabase stores user_metadata inside the JWT payload
                if (payload?.user_metadata?.role === 'admin' || payload?.app_metadata?.role === 'admin') {
                    isAdmin = true;
                }
            } catch { /* malformed jwt, ignore */ }
        }

        // Strategy B: check users table role column (fallback)
        if (!isAdmin && userId) {
            try {
                const { data: dbUser } = await supabaseAdmin
                    .from('users')
                    .select('role')
                    .eq('id', userId)
                    .single();
                if (dbUser?.role === 'admin') isAdmin = true;
            } catch { /* table might not have role col, ignore */ }
        }

        // ── 4. Get token state; admins bypass entirely ──────────────────────
        const tokenState = await getTokenState(userId);
        // plan='pro' if either: DB says pro, DB role=admin, or JWT says admin
        const plan: 'guest' | 'free' | 'pro' = (isAdmin || tokenState.plan === 'pro') ? 'pro' : tokenState.plan as 'guest' | 'free';

        // Check if user can send message (token check) – pro/admin users bypass limits
        const canChat = plan === 'pro'
            ? { allowed: true as const, reason: undefined as string | undefined, tokensNeeded: 0 }
            : await canPerformAction(userId, 'chat');
        if (!canChat.allowed) {
            // Guest limit reached – prompt signup
            if (canChat.reason === 'demo_limit_reached' || canChat.reason === 'guest_limit') {
                return NextResponse.json(
                    {
                        error: 'Você completou a demonstração! Crie uma conta grátis para continuar.',
                        demoComplete: true,
                        showSignupModal: true,
                    },
                    { status: 402 }
                );
            }
            // Free user daily limit – prompt upgrade
            return NextResponse.json(
                {
                    error: 'Seus tokens diários acabaram. Faça upgrade para Pro e tenha uso ilimitado!',
                    upgradeRequired: true,
                    tokensRemaining: 0,
                },
                { status: 402 }
            );
        }

        // ── 4. Avatar plan gate ─────────────────────────────────────────────
        // Guests can only use demo avatar
        if (plan === 'guest' && avatarId && avatarId !== 'demo-prof-carlos') {
            return NextResponse.json(
                {
                    error: 'Crie uma conta grátis para conversar com outros personagens!',
                    showSignupModal: true,
                },
                { status: 402 }
            );
        }

        // Free users restricted to 3 avatars
        if (plan === 'free' && avatarId && !canUseAvatar('free', avatarId)) {
            return NextResponse.json(
                {
                    error: `O personagem "${avatarId}" é exclusivo do Plano Pro.`,
                    upgradeRequired: true,
                    lockedAvatar: avatarId,
                },
                { status: 402 }
            );
        }

        // ── 5. Select model based on quality tier ──────────────────────────────────────────────────
        // pro plan (includes admins) always gets premium model
        const modelQuality: 'basic' | 'premium' = plan === 'pro' ? 'premium' : tokenState.modelQuality;
        const modelConfig = MODEL_CONFIG[modelQuality];

        // ── 6. Inject safety suffix into system prompt ──────────────────────
        const safeMessages = messages.map((m: { role: string; content: string }) => {
            if (m.role === 'system') {
                return { ...m, content: buildSafeSystemPrompt(m.content) };
            }
            return m;
        });

        // ── 7. Call Groq LLM with appropriate model ─────────────────────────
        const completion = await groq.chat.completions.create({
            model: modelConfig.model,
            messages: safeMessages,
            temperature: modelConfig.temperature,
            max_tokens: modelConfig.maxTokens,
        });

        const raw = completion.choices[0]?.message?.content ?? '';

        // ── 8. Output guardrail ─────────────────────────────────────────────
        const clean = sanitiseOutput(raw);

        // ── 9. Consume tokens (after successful response) – pro/admin have unlimited ────────────────
        const consumeResult = plan === 'pro'
            ? { remaining: Infinity }
            : await consumeTokens(userId, TOKEN_COSTS.chat, 'chat');

        // ── 10. Return response with metadata ─────────────────────────────────────────────────────
        return NextResponse.json({
            content: clean,
            meta: {
                plan,
                modelQuality,
                tokensRemaining: consumeResult.remaining,
                canUseTTS: plan === 'pro' ? true : tokenState.canUseTTS,
                ttsType: plan === 'pro' ? 'elevenlabs' : tokenState.ttsType,
            },
        });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Erro inesperado';
        console.error('[chat/route] Error:', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
