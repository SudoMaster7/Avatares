/**
 * SUDO Education – Token System
 * Controls usage quotas for Guest, Free, and Pro users.
 *
 * Token costs:
 *  - Chat message:  1 token
 *  - TTS (basic):   2 tokens
 *  - TTS (premium): 5 tokens
 *  - Custom avatar creation: 50 tokens
 */

import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet, cacheDel } from '@/lib/cache';

// ─────────────────────────────────────────────────────────
// Token limits by plan
// ─────────────────────────────────────────────────────────

export const TOKEN_LIMITS = {
    guest: {
        dailyTokens: 5,              // ~5 messages demo
        maxMessagesTotal: 3,         // Hard cap for unregistered
        canUseTTS: false,
        ttsType: null as null,
        modelQuality: 'basic' as const,
        availableAvatars: 1,         // Only Prof. Carlos
    },
    free: {
        dailyTokens: 50,             // ~50 messages/day
        maxMessagesTotal: Infinity,
        canUseTTS: true,
        ttsType: 'lemonfox' as const, // Lemonfox TTS (good quality, free tier)
        modelQuality: 'basic' as const,
        availableAvatars: 3,         // Einstein, Da Vinci, Santos Dumont
    },
    pro: {
        dailyTokens: Infinity,       // Unlimited
        maxMessagesTotal: Infinity,
        canUseTTS: true,
        ttsType: 'elevenlabs' as const, // Premium TTS (best quality)
        modelQuality: 'premium' as const,
        availableAvatars: Infinity,
    },
} as const;

export type PlanTier = keyof typeof TOKEN_LIMITS;
export type ModelQuality = 'basic' | 'premium';
export type TTSType = 'google' | 'elevenlabs' | 'lemonfox' | null;

// ─────────────────────────────────────────────────────────
// Token costs
// ─────────────────────────────────────────────────────────

export const TOKEN_COSTS = {
    chat: 1,
    ttsBasic: 2,
    ttsPremium: 5,
    customAvatarCreation: 50,
    minigame: 0, // Free
} as const;

// ─────────────────────────────────────────────────────────
// Model configuration by quality
// ─────────────────────────────────────────────────────────

export const MODEL_CONFIG = {
    basic: {
        model: 'llama-3.1-8b-instant',
        maxTokens: 300,
        temperature: 0.7,
        description: 'Respostas rápidas e simples',
    },
    premium: {
        model: 'llama-3.3-70b-versatile',
        maxTokens: 600,
        temperature: 0.7,
        description: 'Respostas detalhadas e avançadas',
    },
} as const;

// ─────────────────────────────────────────────────────────
// User token state
// ─────────────────────────────────────────────────────────

export interface TokenState {
    userId: string;
    plan: PlanTier;
    dailyTokensUsed: number;
    dailyTokensRemaining: number;
    totalMessagesUsed: number;
    lastResetDate: string;
    canSendMessage: boolean;
    canUseTTS: boolean;
    ttsType: TTSType;
    modelQuality: ModelQuality;
}

// ─────────────────────────────────────────────────────────
// Get user's token state
// ─────────────────────────────────────────────────────────

export async function getTokenState(userId: string | null): Promise<TokenState> {
    // Guest user (no userId or localStorage guest)
    if (!userId || userId.startsWith('guest_')) {
        const guestKey = `guest_tokens_${userId ?? 'anon'}`;
        const cached = await cacheGet<{ used: number; messages: number; date: string }>(guestKey);
        const today = new Date().toISOString().slice(0, 10);

        let used = 0;
        let messages = 0;

        if (cached && cached.date === today) {
            used = cached.used;
            messages = cached.messages;
        }

        const limits = TOKEN_LIMITS.guest;
        const remaining = Math.max(0, limits.dailyTokens - used);
        const canSend = messages < limits.maxMessagesTotal && remaining > 0;

        return {
            userId: userId ?? 'guest',
            plan: 'guest',
            dailyTokensUsed: used,
            dailyTokensRemaining: remaining,
            totalMessagesUsed: messages,
            lastResetDate: today,
            canSendMessage: canSend,
            canUseTTS: limits.canUseTTS,
            ttsType: limits.ttsType,
            modelQuality: limits.modelQuality,
        };
    }

    // Authenticated user – check cache first
    const cacheKey = `tokens:${userId}`;
    const cached = await cacheGet<TokenState>(cacheKey);
    const today = new Date().toISOString().slice(0, 10);

    if (cached && cached.lastResetDate === today) {
        return cached;
    }

    // Fetch from DB
    const { data: user } = await supabase
        .from('users')
        .select('plan, role, daily_tokens_used, daily_tokens_reset, total_messages_sent')
        .eq('id', userId)
        .single();

    // Admins always get pro-level access regardless of their plan field
    const isAdmin = user?.role === 'admin';
    const plan: PlanTier = isAdmin ? 'pro' : ((user?.plan as PlanTier) ?? 'free');
    const limits = TOKEN_LIMITS[plan];

    // Reset if new day
    let dailyUsed = user?.daily_tokens_used ?? 0;
    const resetDate = user?.daily_tokens_reset ?? today;

    if (resetDate !== today) {
        dailyUsed = 0;
        // Fire-and-forget reset
        void supabase
            .from('users')
            .update({ daily_tokens_used: 0, daily_tokens_reset: today })
            .eq('id', userId);
    }

    const remaining = plan === 'pro' ? Infinity : Math.max(0, limits.dailyTokens - dailyUsed);
    const totalMessages = user?.total_messages_sent ?? 0;

    const state: TokenState = {
        userId,
        plan,
        dailyTokensUsed: dailyUsed,
        dailyTokensRemaining: remaining,
        totalMessagesUsed: totalMessages,
        lastResetDate: today,
        canSendMessage: remaining > 0,
        canUseTTS: limits.canUseTTS,
        ttsType: limits.ttsType,
        modelQuality: limits.modelQuality,
    };

    // Cache for 2 minutes
    await cacheSet(cacheKey, state, 120);

    return state;
}

// ─────────────────────────────────────────────────────────
// Consume tokens
// ─────────────────────────────────────────────────────────

export async function consumeTokens(
    userId: string | null,
    amount: number,
    action: 'chat' | 'tts' | 'avatar'
): Promise<{ success: boolean; remaining: number; error?: string }> {
    const state = await getTokenState(userId);

    // Pro users have unlimited tokens
    if (state.plan === 'pro') {
        // Still track for analytics
        if (userId && !userId.startsWith('guest_')) {
            void supabase.rpc('increment_user_tokens', { user_id: userId, amount });
        }
        return { success: true, remaining: Infinity };
    }

    // Check if enough tokens
    if (state.dailyTokensRemaining < amount) {
        return {
            success: false,
            remaining: state.dailyTokensRemaining,
            error: state.plan === 'guest'
                ? 'Você atingiu o limite de demonstração. Crie uma conta grátis para continuar!'
                : 'Tokens diários esgotados. Faça upgrade para o Pro para uso ilimitado!',
        };
    }

    // Guest user – update cache only
    if (!userId || userId.startsWith('guest_')) {
        const guestKey = `guest_tokens_${userId ?? 'anon'}`;
        const today = new Date().toISOString().slice(0, 10);
        await cacheSet(guestKey, {
            used: state.dailyTokensUsed + amount,
            messages: state.totalMessagesUsed + (action === 'chat' ? 1 : 0),
            date: today,
        }, 86400); // 24h TTL

        return {
            success: true,
            remaining: state.dailyTokensRemaining - amount,
        };
    }

    // Authenticated user – update DB
    const { error } = await supabase
        .from('users')
        .update({
            daily_tokens_used: state.dailyTokensUsed + amount,
            total_messages_sent: state.totalMessagesUsed + (action === 'chat' ? 1 : 0),
        })
        .eq('id', userId);

    if (error) {
        return { success: false, remaining: state.dailyTokensRemaining, error: error.message };
    }

    // Invalidate cache
    await cacheDel(`tokens:${userId}`);

    return {
        success: true,
        remaining: state.dailyTokensRemaining - amount,
    };
}

// ─────────────────────────────────────────────────────────
// Check if user can perform action
// ─────────────────────────────────────────────────────────

export async function canPerformAction(
    userId: string | null,
    action: keyof typeof TOKEN_COSTS
): Promise<{ allowed: boolean; reason?: string; tokensNeeded: number }> {
    const state = await getTokenState(userId);
    const cost = TOKEN_COSTS[action];

    // Guest hard limit on total messages
    if (state.plan === 'guest' && state.totalMessagesUsed >= TOKEN_LIMITS.guest.maxMessagesTotal) {
        return {
            allowed: false,
            reason: 'demo_limit_reached',
            tokensNeeded: cost,
        };
    }

    if (state.dailyTokensRemaining < cost) {
        return {
            allowed: false,
            reason: state.plan === 'guest' ? 'guest_limit' : 'daily_limit',
            tokensNeeded: cost,
        };
    }

    return { allowed: true, tokensNeeded: cost };
}
