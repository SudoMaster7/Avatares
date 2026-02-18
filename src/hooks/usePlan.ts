/**
 * usePlan – React hook
 * Returns the current user's plan details, token quota, quality tier, and upgrade helpers.
 * Now uses the token system for proper guest/free/pro differentiation.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PlanType, canUseAvatar } from '@/types/plans';
import { TOKEN_LIMITS, type PlanTier, type TokenState, type ModelQuality, type TTSType } from '@/lib/tokens';

interface PlanState {
    // Identity
    plan: PlanTier;
    isLoading: boolean;
    isPro: boolean;
    isFree: boolean;
    isGuest: boolean;

    // Tokens
    tokensUsed: number;
    tokensRemaining: number;
    totalMessages: number;
    canSendMessage: boolean;

    // Quality
    modelQuality: ModelQuality;
    ttsType: TTSType;
    canUseTTS: boolean;

    // Legacy compatibility
    dailyMsgCount: number;
    remainingMessages: number;

    // Actions
    canUseAvatar: (avatarId: string) => boolean;
    startUpgrade: (interval?: 'month' | 'year') => Promise<void>;
    openPortal: () => Promise<void>;
    refresh: () => void;
}

export function usePlan(userId: string | null): PlanState {
    const [plan, setPlan] = useState<PlanTier>('guest');
    const [tokensUsed, setTokensUsed] = useState(0);
    const [totalMessages, setTotalMessages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlan = useCallback(async () => {
        // Guest user (no userId)
        if (!userId) {
            setPlan('guest');
            setTokensUsed(0);
            setTotalMessages(0);
            setIsLoading(false);
            return;
        }

        try {
            // Check if user is admin via auth metadata – admins always get Pro
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser?.user_metadata?.role === 'admin') {
                setPlan('pro');
                setTokensUsed(0);
                setTotalMessages(0);
                setIsLoading(false);
                return;
            }

            const { data } = await supabase
                .from('users')
                .select('plan, role, daily_tokens_used, daily_tokens_reset, total_messages_sent')
                .eq('id', userId)
                .single();

            if (data) {
                // role='admin' in users table also grants pro access
                const userPlan: PlanTier = data.role === 'admin' ? 'pro' : ((data.plan as PlanTier) ?? 'free');
                setPlan(userPlan);

                // Reset counter if new day
                const today = new Date().toISOString().slice(0, 10);
                const used = data.daily_tokens_reset === today 
                    ? (data.daily_tokens_used ?? 0) 
                    : 0;
                setTokensUsed(used);
                setTotalMessages(data.total_messages_sent ?? 0);
            }
        } catch (error) {
            console.error('Error fetching plan:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchPlan();
    }, [fetchPlan]);

    // ── Realtime subscription to users updates ──────────────────────────
    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`plan-${userId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
                (payload) => {
                    if (payload.new && typeof payload.new === 'object') {
                        const u = payload.new as { 
                            plan?: string; 
                            daily_tokens_used?: number;
                            total_messages_sent?: number;
                        };
                        if (u.plan) setPlan(u.plan as PlanTier);
                        if (typeof u.daily_tokens_used === 'number') setTokensUsed(u.daily_tokens_used);
                        if (typeof u.total_messages_sent === 'number') setTotalMessages(u.total_messages_sent);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    // ── Upgrade action ───────────────────────────────────────────────────
    const startUpgrade = useCallback(
        async (interval: 'month' | 'year' = 'month') => {
            if (!userId) {
                // Guest – redirect to signup first
                window.location.href = '/auth/signup?redirect=/planos';
                return;
            }

            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, interval }),
            });

            const { url, error } = await res.json();
            if (error) { alert(error); return; }
            window.location.href = url;
        },
        [userId]
    );

    // ── Customer portal ──────────────────────────────────────────────────
    const openPortal = useCallback(async () => {
        if (!userId) return;

        const res = await fetch('/api/stripe/portal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        const { url, error } = await res.json();
        if (error) { alert(error); return; }
        window.location.href = url;
    }, [userId]);

    // ── Derived values ───────────────────────────────────────────────────
    const limits = TOKEN_LIMITS[plan];
    const tokensRemaining = plan === 'pro' 
        ? Infinity 
        : Math.max(0, limits.dailyTokens - tokensUsed);
    
    const canSendMessage = plan === 'pro' || tokensRemaining > 0;

    return {
        // Identity
        plan,
        isLoading,
        isPro: plan === 'pro',
        isFree: plan === 'free',
        isGuest: plan === 'guest',

        // Tokens
        tokensUsed,
        tokensRemaining,
        totalMessages,
        canSendMessage,

        // Quality
        modelQuality: limits.modelQuality,
        ttsType: limits.ttsType,
        canUseTTS: limits.canUseTTS,

        // Legacy compatibility
        dailyMsgCount: tokensUsed,
        remainingMessages: tokensRemaining === Infinity ? Infinity : tokensRemaining,

        // Actions
        canUseAvatar: (avatarId: string) => {
            if (plan === 'pro') return true;
            if (plan === 'guest') return avatarId === 'demo-prof-carlos';
            return canUseAvatar('free', avatarId);
        },
        startUpgrade,
        openPortal,
        refresh: fetchPlan,
    };
}
