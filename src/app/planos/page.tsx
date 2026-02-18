/**
 * PlansPage – /planos
 * Shows Free vs Pro comparison and a Checkout CTA.
 */
'use client';

import React, { useState } from 'react';
import { PLANS } from '@/types/plans';
import { usePlan } from '@/hooks/usePlan';

// Replace with real user context hook
const MOCK_USER_ID: string | null = null; // TODO: connect to your auth context

export default function PlansPage() {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
    const { plan, isPro, startUpgrade, openPortal } = usePlan(MOCK_USER_ID);

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="mb-3 text-4xl font-extrabold text-white">
                        Escolha seu plano na Vila do Saber
                    </h1>
                    <p className="text-lg text-white/60">
                        Aprenda com os maiores gênios da história. Comece grátis, evolua no seu ritmo.
                    </p>

                    {/* Billing toggle */}
                    <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                        {(['month', 'year'] as const).map((i) => (
                            <button
                                key={i}
                                onClick={() => setBillingInterval(i)}
                                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
                                    billingInterval === i
                                        ? 'bg-amber-400 text-black'
                                        : 'text-white/50 hover:text-white'
                                }`}
                            >
                                {i === 'month' ? 'Mensal' : 'Anual'}{' '}
                                {i === 'year' && (
                                    <span className="ml-1 rounded bg-green-500 px-1.5 py-0.5 text-xs font-bold text-white">
                                        -33%
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Plan cards */}
                <div className="grid gap-8 sm:grid-cols-2">
                    {PLANS.map((p) => {
                        const price =
                            billingInterval === 'year' ? p.priceAnnual : p.priceMonthly;
                        const isCurrent = plan === p.id;
                        const isPro = p.id === 'pro';

                        return (
                            <div
                                key={p.id}
                                className={`relative rounded-3xl border p-8 ${
                                    isPro
                                        ? 'border-amber-400/60 bg-gradient-to-br from-amber-950/40 to-slate-900'
                                        : 'border-white/10 bg-white/5'
                                }`}
                            >
                                {isPro && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-black">
                                        MAIS POPULAR
                                    </span>
                                )}

                                {/* Badge */}
                                <span
                                    className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase"
                                    style={{ backgroundColor: p.badgeColor + '33', color: p.badgeColor }}
                                >
                                    {p.label}
                                </span>

                                {/* Price */}
                                <div className="mb-1">
                                    <span className="text-4xl font-extrabold text-white">
                                        {price === 0 ? 'Grátis' : `R$\u00A0${price.toFixed(2)}`}
                                    </span>
                                    {price > 0 && (
                                        <span className="ml-1 text-sm text-white/50">/mês</span>
                                    )}
                                </div>
                                {billingInterval === 'year' && price > 0 && (
                                    <p className="mb-4 text-xs text-white/40">
                                        Cobrado anualmente (R${(price * 12).toFixed(2)}/ano)
                                    </p>
                                )}

                                <p className="mb-6 text-sm text-white/60">{p.description}</p>

                                {/* Features */}
                                <ul className="mb-8 space-y-2">
                                    {p.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                                            <span className={isPro ? 'text-amber-400' : 'text-emerald-400'}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                {isCurrent ? (
                                    <button
                                        className="w-full rounded-xl border border-white/20 py-3 text-sm font-semibold text-white/50"
                                        disabled
                                    >
                                        Plano atual
                                    </button>
                                ) : isPro ? (
                                    <button
                                        onClick={() => startUpgrade(billingInterval)}
                                        className="w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
                                    >
                                        Assinar Plano Pro →
                                    </button>
                                ) : (
                                    <button
                                        className="w-full rounded-xl border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
                                        onClick={() => (window.location.href = '/')}
                                    >
                                        Começar grátis
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Manage subscription (Pro users) */}
                {isPro && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-white/40">
                            Você é um assinante Pro.{' '}
                            <button
                                onClick={openPortal}
                                className="text-amber-400 underline underline-offset-2 hover:text-amber-300"
                            >
                                Gerenciar assinatura
                            </button>
                        </p>
                    </div>
                )}

                {/* Trust signals */}
                <div className="mt-14 flex flex-wrap justify-center gap-6 text-center text-xs text-white/30">
                    <span>🔒 Pagamento seguro via Stripe</span>
                    <span>📜 Conforme com a LGPD</span>
                    <span>👨‍👩‍👧 Seguro para crianças (COPPA)</span>
                    <span>🔁 Cancele a qualquer momento</span>
                </div>
            </div>
        </main>
    );
}
