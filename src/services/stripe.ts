/**
 * SUDO Education – Stripe Service
 * Handles: checkout session creation, customer portal, subscription queries.
 * All calls are server-side only (uses SECRET key).
 */

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
});

// ─────────────────────────────────────────────────────────
// Create a Stripe Checkout Session (subscription)
// ─────────────────────────────────────────────────────────

export interface CheckoutOptions {
    userId: string;
    userEmail: string;
    priceId: string;                  // From PLANS in types/plans.ts
    successUrl: string;
    cancelUrl: string;
    trialDays?: number;
}

export async function createCheckoutSession(opts: CheckoutOptions): Promise<string> {
    const { userId, userEmail, priceId, successUrl, cancelUrl, trialDays } = opts;

    // Look up or create a Stripe customer
    let customerId: string | undefined;
    const existing = await stripe.customers.list({ email: userEmail, limit: 1 });
    if (existing.data.length > 0) {
        customerId = existing.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        customer_email: customerId ? undefined : userEmail,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        subscription_data: {
            trial_period_days: trialDays,
            metadata: { userId },
        },
        metadata: { userId },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        // Pix support (Brazil): enable when using Stripe + Pix beta
        payment_method_types: ['card'],
        locale: 'pt-BR',
    });

    return session.url!;
}

// ─────────────────────────────────────────────────────────
// Customer Portal (manage / cancel subscription)
// ─────────────────────────────────────────────────────────

export async function createPortalSession(
    stripeCustomerId: string,
    returnUrl: string
): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: returnUrl,
    });
    return session.url;
}

// ─────────────────────────────────────────────────────────
// Retrieve a subscription's details
// ─────────────────────────────────────────────────────────

export async function getSubscription(stripeSubscriptionId: string) {
    return stripe.subscriptions.retrieve(stripeSubscriptionId);
}
