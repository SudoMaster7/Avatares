/**
 * PlanGate – Component
 * Wraps any feature that requires a specific plan.
 * Shows an upgrade prompt if the user's plan is insufficient.
 *
 * Usage:
 *   <PlanGate requiredPlan="pro" userId={user.id}>
 *     <CustomAvatarCreator />
 *   </PlanGate>
 */
'use client';

import React from 'react';
import { usePlan } from '@/hooks/usePlan';
import { PlanType, PLANS } from '@/types/plans';

interface PlanGateProps {
    requiredPlan: PlanType;
    userId: string | null;
    children: React.ReactNode;
    /** Custom message shown on the upgrade wall */
    message?: string;
    /** If true, renders children with a lock overlay instead of hiding them */
    overlay?: boolean;
}

export function PlanGate({ requiredPlan, userId, children, message, overlay = false }: PlanGateProps) {
    const { plan, isLoading, startUpgrade } = usePlan(userId);

    if (isLoading) return null;

    // Access granted
    if (requiredPlan === 'free' || plan === 'pro') {
        return <>{children}</>;
    }

    // Pro required – show upgrade prompt
    const proPlan = PLANS.find((p) => p.id === 'pro')!;
    const defaultMsg = message ?? 'Esse recurso é exclusivo do Plano Pro da Vila do Saber.';

    const UpgradeWall = (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-950/30 to-amber-900/20 p-8 text-center">
            {/* Pro badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                ⭐ Pro
            </span>

            <h3 className="text-xl font-bold text-white">{defaultMsg}</h3>

            <ul className="space-y-1.5 text-sm text-white/70">
                {proPlan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-2">
                        <span className="text-amber-400">✓</span> {f}
                    </li>
                ))}
            </ul>

            <div className="flex flex-col gap-2 sm:flex-row">
                <button
                    onClick={() => startUpgrade('month')}
                    className="rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
                >
                    Assinar por R$&nbsp;{proPlan.priceMonthly.toFixed(2)}/mês
                </button>
                <button
                    onClick={() => startUpgrade('year')}
                    className="rounded-xl border border-amber-400/50 px-6 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-400/10"
                >
                    Anual (R$&nbsp;{proPlan.priceAnnual.toFixed(2)}/mês)
                </button>
            </div>
        </div>
    );

    if (overlay) {
        return (
            <div className="relative">
                <div className="pointer-events-none select-none opacity-30 blur-sm">{children}</div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    {UpgradeWall}
                </div>
            </div>
        );
    }

    return UpgradeWall;
}
