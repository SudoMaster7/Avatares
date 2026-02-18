/**
 * SUDO Education – Persuasive Upsell Components
 * Uses proven conversion psychology techniques for family-friendly education upsells.
 * 
 * Techniques used:
 * - Social proof (other students are learning)
 * - Scarcity (limited demo, daily tokens)
 * - Loss aversion (show what they're missing)
 * - Progress visualization (you're almost there)
 * - Value anchoring (compare to tutoring costs)
 */
'use client';

import React, { useState, useEffect } from 'react';
import { PLANS } from '@/types/plans';
import { TOKEN_LIMITS } from '@/lib/tokens';

// ─────────────────────────────────────────────────────────
// Social Proof Banner
// ─────────────────────────────────────────────────────────

interface SocialProofBannerProps {
    className?: string;
}

export function SocialProofBanner({ className = '' }: SocialProofBannerProps) {
    const [studentsOnline, setStudentsOnline] = useState(0);

    useEffect(() => {
        // Simulate realistic-ish numbers (would be real in production)
        setStudentsOnline(Math.floor(Math.random() * 200) + 150);
    }, []);

    return (
        <div className={`flex items-center justify-center gap-2 text-sm ${className}`}>
            <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-white/60">
                <strong className="text-white">{studentsOnline}</strong> alunos aprendendo agora na Vila do Saber
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Value Comparison Card (anchoring)
// ─────────────────────────────────────────────────────────

export function ValueComparisonCard() {
    const proPlan = PLANS.find((p) => p.id === 'pro')!;

    return (
        <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-950/30 to-slate-900 p-6">
            <h3 className="mb-4 text-center text-lg font-bold text-white">
                Compare o valor
            </h3>
            
            <div className="space-y-3">
                {/* Traditional tutoring */}
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                    <span className="text-white/70">Aula particular de 1h</span>
                    <span className="font-bold text-white/50 line-through">R$ 80-150</span>
                </div>
                
                {/* Online course */}
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
                    <span className="text-white/70">Curso online tradicional</span>
                    <span className="font-bold text-white/50 line-through">R$ 200-500</span>
                </div>
                
                {/* Vila do Saber Pro */}
                <div className="flex items-center justify-between rounded-lg border border-amber-400/50 bg-amber-400/10 px-4 py-3">
                    <span className="font-medium text-amber-400">
                        Vila do Saber Pro (ilimitado)
                    </span>
                    <span className="text-xl font-bold text-amber-400">
                        R$ {proPlan.priceMonthly.toFixed(2)}/mês
                    </span>
                </div>
            </div>
            
            <p className="mt-4 text-center text-xs text-white/40">
                ✓ Acesso a todos os avatares ✓ Uso ilimitado ✓ Voz premium ✓ Relatórios para pais
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Token Scarcity Indicator
// ─────────────────────────────────────────────────────────

interface TokenScarcityProps {
    tokensRemaining: number;
    plan: 'guest' | 'free' | 'pro';
    onUpgrade?: () => void;
}

export function TokenScarcityIndicator({ tokensRemaining, plan, onUpgrade }: TokenScarcityProps) {
    if (plan === 'pro') return null;

    const maxTokens = plan === 'guest' 
        ? TOKEN_LIMITS.guest.dailyTokens 
        : TOKEN_LIMITS.free.dailyTokens;
    
    const percentage = (tokensRemaining / maxTokens) * 100;
    const isLow = percentage <= 20;
    const isCritical = percentage <= 10;

    return (
        <div className={`rounded-xl border p-4 ${
            isCritical 
                ? 'border-red-500/50 bg-red-500/10' 
                : isLow 
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-white/10 bg-white/5'
        }`}>
            <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-white/70">
                    {plan === 'guest' ? 'Demonstração' : 'Tokens restantes hoje'}
                </span>
                <span className={`font-bold ${
                    isCritical ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-white'
                }`}>
                    {tokensRemaining} / {maxTokens}
                </span>
            </div>
            
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                    className={`h-full rounded-full transition-all ${
                        isCritical 
                            ? 'bg-red-500' 
                            : isLow 
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {isLow && (
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-white/50">
                        {isCritical 
                            ? '⚠️ Últimos tokens! Seus tokens serão renovados amanhã.'
                            : '⏳ Tokens acabando...'}
                    </span>
                    {onUpgrade && (
                        <button
                            onClick={onUpgrade}
                            className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-bold text-black transition hover:bg-amber-300"
                        >
                            Upgrade Pro
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Feature Lock Overlay
// ─────────────────────────────────────────────────────────

interface FeatureLockOverlayProps {
    featureName: string;
    featureDescription?: string;
    onUpgrade?: () => void;
}

export function FeatureLockOverlay({ featureName, featureDescription, onUpgrade }: FeatureLockOverlayProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <div className="mb-4 text-4xl">🔒</div>
            <h3 className="mb-2 text-lg font-bold text-white">{featureName}</h3>
            {featureDescription && (
                <p className="mb-4 text-sm text-white/60">{featureDescription}</p>
            )}
            <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold text-amber-400">
                ⭐ Exclusivo Pro
            </span>
            {onUpgrade && (
                <button
                    onClick={onUpgrade}
                    className="rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
                >
                    Desbloquear com Pro
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Avatar Quality Banner (shows what they're missing)
// ─────────────────────────────────────────────────────────

interface QualityBannerProps {
    currentQuality: 'basic' | 'premium';
}

export function QualityBanner({ currentQuality }: QualityBannerProps) {
    if (currentQuality === 'premium') return null;

    return (
        <div className="flex items-center gap-3 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-2 text-sm">
            <span className="text-amber-400">💡</span>
            <span className="text-white/70">
                Você está usando o modo <strong className="text-white">básico</strong>.
            </span>
            <span className="text-white/50">
                No Pro: respostas mais detalhadas + voz natural
            </span>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Progress Teaser (show what they've learned, what's next)
// ─────────────────────────────────────────────────────────

interface ProgressTeaserProps {
    messagesExchanged: number;
    topicsLearned: string[];
    onUpgrade?: () => void;
}

export function ProgressTeaser({ messagesExchanged, topicsLearned, onUpgrade }: ProgressTeaserProps) {
    const lockedAchievements = [
        '🏆 Mestre da Matemática',
        '🌟 Explorador da História',
        '🚀 Cientista Curioso',
    ];

    return (
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
                Seu progresso na Vila do Saber
            </h3>

            {/* Stats */}
            <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/5 p-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">{messagesExchanged}</div>
                    <div className="text-xs text-white/50">Mensagens trocadas</div>
                </div>
                <div className="rounded-lg bg-white/5 p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">{topicsLearned.length}</div>
                    <div className="text-xs text-white/50">Tópicos explorados</div>
                </div>
            </div>

            {/* Locked achievements */}
            <div className="mb-4">
                <p className="mb-2 text-sm text-white/60">Medalhas que você pode ganhar:</p>
                <div className="flex flex-wrap gap-2">
                    {lockedAchievements.map((achievement) => (
                        <span
                            key={achievement}
                            className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-white/40"
                        >
                            🔒 {achievement}
                        </span>
                    ))}
                </div>
            </div>

            {/* CTA */}
            {onUpgrade && (
                <button
                    onClick={onUpgrade}
                    className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 text-sm font-bold text-black transition hover:opacity-90"
                >
                    Desbloquear todas as medalhas com Pro →
                </button>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Trial Ending Warning (for Pro trial users)
// ─────────────────────────────────────────────────────────

interface TrialWarningProps {
    daysRemaining: number;
    onKeepPro?: () => void;
}

export function TrialWarning({ daysRemaining, onKeepPro }: TrialWarningProps) {
    if (daysRemaining > 3) return null;

    const urgency = daysRemaining <= 1 ? 'critical' : 'warning';

    return (
        <div className={`rounded-xl border p-4 ${
            urgency === 'critical'
                ? 'border-red-500/50 bg-red-500/10'
                : 'border-amber-500/50 bg-amber-500/10'
        }`}>
            <div className="flex items-center justify-between">
                <div>
                    <span className={`text-sm font-medium ${
                        urgency === 'critical' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                        {daysRemaining === 0
                            ? '⚠️ Seu teste Pro termina HOJE!'
                            : daysRemaining === 1
                                ? '⏰ Último dia do teste Pro!'
                                : `📅 ${daysRemaining} dias restantes no teste Pro`}
                    </span>
                    <p className="text-xs text-white/50">
                        Não perca acesso a todos os avatares, voz premium e tokens ilimitados.
                    </p>
                </div>
                {onKeepPro && (
                    <button
                        onClick={onKeepPro}
                        className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                            urgency === 'critical'
                                ? 'bg-red-500 text-white hover:bg-red-400'
                                : 'bg-amber-400 text-black hover:bg-amber-300'
                        }`}
                    >
                        Manter Pro
                    </button>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────
// Parent Email Teaser
// ─────────────────────────────────────────────────────────

export function ParentReportTeaser() {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">
                    📊
                </div>
                <div>
                    <h3 className="mb-1 font-bold text-white">Relatórios para os pais</h3>
                    <p className="mb-3 text-sm text-white/60">
                        No Plano Pro, os pais recebem por e-mail um resumo semanal do progresso do filho:
                    </p>
                    <ul className="space-y-1 text-sm text-white/50">
                        <li>✓ Tempo dedicado ao estudo</li>
                        <li>✓ Tópicos abordados</li>
                        <li>✓ Pontuação nos quizzes</li>
                        <li>✓ Sugestões de melhoria</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
