/**
 * POST /api/stripe/portal
 * Redirects a Pro user to Stripe's Customer Portal to manage their subscription.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createPortalSession } from '@/services/stripe';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId obrigatório.' }, { status: 400 });
        }

        const { data: sub, error } = await supabaseAdmin
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single();

        if (error || !sub?.stripe_customer_id) {
            return NextResponse.json(
                { error: 'Assinatura ativa não encontrada.' },
                { status: 404 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
        const portalUrl = await createPortalSession(
            sub.stripe_customer_id,
            `${baseUrl}/dashboard`
        );

        return NextResponse.json({ url: portalUrl });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido.';
        console.error('[stripe/portal]', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
