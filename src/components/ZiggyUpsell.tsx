/**
 * ZiggyUpsell – Vila do Saber Sales Agent Component
 * Shows after:
 *  • End of a free-user conversation
 *  • When the daily message quota is nearly exhausted (≤ 2 messages left)
 *  • When a free user tries to access a Pro avatar
 *
 * Ziggy presents contextual Pro benefits and a one-click upgrade CTA.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { usePlan } from '@/hooks/usePlan';
import { PLANS } from '@/types/plans';

// ─────────────────────────────────────────────────────────
// Ziggy's motivational messages (rotated randomly)
// ─────────────────────────────────────────────────────────

const ZIGGY_MESSAGES = [
    'Ei! Você está indo muito bem! 🌟 Quer continuar aprendendo sem limites? No Plano Pro você conversa com TODOS os gênios da história!',
    'Uau, você fez ótimas perguntas hoje! 🚀 Com o Plano Pro, sem limite de mensagens, imagine o quanto você pode aprender!',
    'Você acabou suas mensagens de hoje, mas não precisa parar! ⭐ Assine o Plano Pro e aprenda o quanto quiser!',
    'Que tal conhecer Marie Curie, Tesla e LeBron James? 🏆 Eles estão esperando por você no Plano Pro!',
    'No Plano Pro, seus pais recebem relatórios do seu progresso por e-mail. Eles vão adorar ver como você está evoluindo! 📊',
];

function getRandomMessage() {
    return ZIGGY_MESSAGES[Math.floor(Math.random() * ZIGGY_MESSAGES.length)];
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

interface ZiggyUpsellProps {
    userId: string | null;
    /** Show immediately (e.g. when quota is hit) */
    forceShow?: boolean;
    /** Called when the user dismisses Ziggy */
    onDismiss?: () => void;
    /** Class name for outer wrapper */
    className?: string;
}

export function ZiggyUpsell({ userId, forceShow = false, onDismiss, className = '' }: ZiggyUpsellProps) {
    const { plan, remainingMessages, startUpgrade, isLoading } = usePlan(userId);
    const [visible, setVisible] = useState(false);
    const [message] = useState(() => getRandomMessage());
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

    // Show when quota is low (≤ 2) OR forced
    useEffect(() => {
        if (isLoading) return;
        if (plan === 'pro') return;
        if (forceShow || remainingMessages <= 2) {
            setVisible(true);
        }
    }, [isLoading, plan, remainingMessages, forceShow]);

    if (!visible || plan === 'pro') return null;

    const proPlan = PLANS.find((p) => p.id === 'pro')!;
    const price = billingInterval === 'year' ? proPlan.priceAnnual : proPlan.priceMonthly;

    const handleDismiss = () => {
        setVisible(false);
        onDismiss?.();
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-950/50 to-slate-900 p-6 shadow-2xl ${className}`}
        >
            {/* Dismiss button */}
            <button
                onClick={handleDismiss}
                aria-label="Fechar"
                className="absolute right-3 top-3 rounded-full p-1 text-white/30 transition hover:text-white/70"
            >
                ✕
            </button>

            {/* Ziggy avatar */}
            <div className="mb-4 flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/20 text-3xl">
                    🤖
                </div>
                <div>
                    <p className="mb-0.5 text-xs font-bold uppercase tracking-widest text-amber-400">
                        Ziggy – seu guia
                    </p>
                    <p className="text-sm leading-relaxed text-white/80">{message}</p>
                </div>
            </div>

            {/* Quota bar (free users) */}
            {plan === 'free' && (
                <div className="mb-4">
                    <div className="mb-1 flex justify-between text-xs text-white/40">
                        <span>Mensagens de hoje</span>
                        <span>{remainingMessages} restantes</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-amber-400 transition-all"
                            style={{ width: `${((10 - remainingMessages) / 10) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Billing toggle */}
            <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-white/5 p-1 text-xs">
                {(['month', 'year'] as const).map((i) => (
                    <button
                        key={i}
                        onClick={() => setBillingInterval(i)}
                        className={`rounded-full px-3 py-1 font-semibold transition ${
                            billingInterval === i ? 'bg-amber-400 text-black' : 'text-white/50'
                        }`}
                    >
                        {i === 'month' ? 'Mensal' : 'Anual -33%'}
                    </button>
                ))}
            </div>

            {/* CTA */}
            <button
                onClick={() => startUpgrade(billingInterval)}
                className="w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-black transition hover:bg-amber-300 active:scale-95"
            >
                🚀 Assinar Plano Pro por R$&nbsp;{price.toFixed(2)}/mês
            </button>

            <p className="mt-2 text-center text-xs text-white/30">
                Cancele a qualquer momento · Pagamento seguro via Stripe
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// MessageLimitBanner – inline banner inside the chat UI
// ─────────────────────────────────────────────────────────

interface MessageLimitBannerProps {
    userId: string | null;
    onUpgrade?: () => void;
}

export function MessageLimitBanner({ userId, onUpgrade }: MessageLimitBannerProps) {
    const { plan, remainingMessages, startUpgrade } = usePlan(userId);

    if (plan === 'pro' || remainingMessages > 3) return null;

    const handleUpgrade = async () => {
        onUpgrade?.();
        await startUpgrade('month');
    };

    return (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 text-sm">
            <span className="text-amber-300">
                {remainingMessages === 0
                    ? '⚠️ Você atingiu o limite diário de mensagens grátis.'
                    : `⚡ ${remainingMessages} mensagem${remainingMessages !== 1 ? 's' : ''} restante${remainingMessages !== 1 ? 's' : ''} hoje.`}
            </span>
            <button
                onClick={handleUpgrade}
                className="flex-shrink-0 rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-black hover:bg-amber-300"
            >
                Upgrade Pro
            </button>
        </div>
    );
}
