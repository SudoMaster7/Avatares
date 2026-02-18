/**
 * POST /api/stripe/checkout  – Create a Stripe Checkout session
 * Requires: authenticated user (session cookie / Bearer token)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createCheckoutSession } from '@/services/stripe';
import { PLANS } from '@/types/plans';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId, interval = 'month' } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId obrigatório.' }, { status: 400 });
        }

        // Fetch user
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('id, email, plan')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
        }

        if (user.plan === 'pro') {
            return NextResponse.json({ error: 'Usuário já é Pro.' }, { status: 400 });
        }

        // Get correct Stripe Price ID from plan config
        const proPlan = PLANS.find((p) => p.id === 'pro')!;
        const priceId =
            interval === 'year'
                ? proPlan.stripePriceIdAnnual
                : proPlan.stripePriceIdMonthly;

        if (!priceId) {
            return NextResponse.json(
                { error: 'Preço não configurado. Verifique NEXT_PUBLIC_STRIPE_PRICE_MONTHLY.' },
                { status: 500 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

        const checkoutUrl = await createCheckoutSession({
            userId: user.id,
            userEmail: user.email,
            priceId,
            successUrl: `${baseUrl}/dashboard?upgrade=success`,
            cancelUrl: `${baseUrl}/planos?upgrade=cancelled`,
        });

        return NextResponse.json({ url: checkoutUrl });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido.';
        console.error('[stripe/checkout]', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
