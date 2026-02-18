/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events to activate / deactivate Pro status.
 *
 * Register in Stripe Dashboard:
 *   Endpoint URL: https://yourdomain.com/api/stripe/webhook
 *   Events: checkout.session.completed, customer.subscription.updated,
 *           customer.subscription.deleted, invoice.payment_failed
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/services/stripe';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Disable body parsing – Stripe needs the raw body to verify signature
export const config = { api: { bodyParser: false } };

export async function POST(request: NextRequest) {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature') ?? '';

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Signature invalid';
        console.error('[stripe/webhook] Invalid signature:', msg);
        return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Idempotency: skip already-processed events
    const { data: existing } = await supabaseAdmin
        .from('payment_events')
        .select('id')
        .eq('stripe_event_id', event.id)
        .single();

    if (existing) {
        return NextResponse.json({ received: true, skipped: true });
    }

    // Log raw event
    await supabaseAdmin.from('payment_events').insert({
        stripe_event_id: event.id,
        event_type: event.type,
        payload: event,
        processed: false,
    });

    try {
        switch (event.type) {
            // ── User completes checkout ──────────────────────────────────────
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                const subscriptionId = session.subscription as string;

                if (!userId || !subscriptionId) break;

                const sub = await stripe.subscriptions.retrieve(subscriptionId);
                await upsertSubscription(userId, sub, 'pro');
                break;
            }

            // ── Subscription renewed or changed ─────────────────────────────
            case 'customer.subscription.updated': {
                const sub = event.data.object as Stripe.Subscription;
                const userId = sub.metadata?.userId;
                if (!userId) break;

                const plan = sub.status === 'active' ? 'pro' : 'free';
                await upsertSubscription(userId, sub, plan);
                break;
            }

            // ── Subscription cancelled ───────────────────────────────────────
            case 'customer.subscription.deleted': {
                const sub = event.data.object as Stripe.Subscription;
                const userId = sub.metadata?.userId;
                if (!userId) break;

                await upsertSubscription(userId, sub, 'free');
                break;
            }

            // ── Payment failed ───────────────────────────────────────────────
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                // Mark subscription as past_due in our DB
                await supabaseAdmin
                    .from('subscriptions')
                    .update({ status: 'past_due', updated_at: new Date().toISOString() })
                    .eq('stripe_customer_id', customerId);

                // TODO: trigger e-mail notification to parent
                break;
            }

            default:
                // Unhandled event – safe to ignore
                break;
        }

        // Mark as processed
        await supabaseAdmin
            .from('payment_events')
            .update({ processed: true, processed_at: new Date().toISOString() })
            .eq('stripe_event_id', event.id);

        return NextResponse.json({ received: true });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Handler error';
        console.error('[stripe/webhook] Processing error:', msg);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

// ─────────────────────────────────────────────────────────
// Helper: upsert subscription record
// ─────────────────────────────────────────────────────────

async function upsertSubscription(
    userId: string,
    sub: Stripe.Subscription,
    plan: 'free' | 'pro'
) {
    const priceId = sub.items.data[0]?.price?.id;
    const interval = (sub.items.data[0]?.price?.recurring?.interval ?? 'month') as 'month' | 'year';

    // Use type assertion for period fields (field names changed in Stripe API 2024+)
    const subAny = sub as unknown as Record<string, unknown>;
    const periodStart: number | undefined = subAny['current_period_start'] as number | undefined;
    const periodEnd: number | undefined = subAny['current_period_end'] as number | undefined;

    await supabaseAdmin.from('subscriptions').upsert(
        {
            user_id: userId,
            stripe_customer_id: sub.customer as string,
            stripe_subscription_id: sub.id,
            stripe_price_id: priceId,
            plan,
            status: sub.status,
            billing_interval: interval,
            current_period_start: periodStart
                ? new Date(periodStart * 1000).toISOString()
                : null,
            current_period_end: periodEnd
                ? new Date(periodEnd * 1000).toISOString()
                : null,
            cancel_at_period_end: sub.cancel_at_period_end,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'stripe_subscription_id' }
    );

    // The DB trigger sync_user_plan handles users.plan automatically.
}
