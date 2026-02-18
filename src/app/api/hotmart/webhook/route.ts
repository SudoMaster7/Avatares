/**
 * POST /api/hotmart/webhook
 * Recebe postbacks da Hotmart e promove o usuário para Pro no Supabase.
 *
 * Configuração no painel Hotmart:
 *   Produto → Configurações → Notificações → URL do Webhook:
 *   https://<seu-dominio>/api/hotmart/webhook
 *   (opcional) Bearer Token → configure HOTMART_HOTTOK no .env e ative no painel
 *
 * Eventos tratados:
 *   PURCHASE_APPROVED  – compra aprovada (cartão, PIX aprovado)
 *   PURCHASE_COMPLETE  – compra concluída (confirmação final)
 *   PURCHASE_REFUNDED  – reembolso → rebaixa para free
 *   PURCHASE_CHARGEBACK – chargeback → rebaixa para free
 *   SUBSCRIPTION_CANCELLATION – cancelamento → rebaixa para free
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const HOTMART_HOTTOK = process.env.HOTMART_HOTTOK; // token configurado no painel Hotmart

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Types ──────────────────────────────────────────────────────────────────────

interface HotmartPostback {
    /** Token de validação configurado no painel Hotmart */
    hottok?: string;
    event: string;
    data: {
        buyer?: {
            email?: string;
            name?:  string;
        };
        purchase?: {
            transaction?: string;
            status?:      string;
            price?: {
                value?:    number;
                currency_value?: string;
            };
        };
        subscription?: {
            subscriber?: {
                code?: string;
            };
            status?: string;
        };
        product?: {
            id?:   number;
            name?: string;
        };
    };
}

const UPGRADE_EVENTS   = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);
const DOWNGRADE_EVENTS = new Set(['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'SUBSCRIPTION_CANCELLATION']);

// ── Handler ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
    let payload: HotmartPostback;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // 1. Validate hottok (if configured)
    if (HOTMART_HOTTOK) {
        const receivedToken = payload.hottok ?? request.headers.get('x-hotmart-hottok');
        if (receivedToken !== HOTMART_HOTTOK) {
            console.warn('[hotmart/webhook] Invalid hottok');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const event     = payload.event ?? '';
    const buyerEmail = payload.data?.buyer?.email;

    console.log('[hotmart/webhook] Event:', event, '| buyer:', buyerEmail);

    if (!buyerEmail) {
        console.warn('[hotmart/webhook] No buyer email in payload for event:', event);
        return NextResponse.json({ received: true, warning: 'no buyer email' });
    }

    // 2. Find user by email
    const { data: authData } = await supabaseAdmin.auth.admin.listUsers();
    const authUser = authData?.users?.find(u => u.email?.toLowerCase() === buyerEmail.toLowerCase());

    if (!authUser) {
        // User may not have signed up yet — log and accept gracefully
        console.warn('[hotmart/webhook] No auth user found for email:', buyerEmail);
        return NextResponse.json({ received: true, warning: 'user not found' });
    }

    const userId = authUser.id;

    // 3. Handle upgrade / downgrade
    if (UPGRADE_EVENTS.has(event)) {
        await supabaseAdmin
            .from('users')
            .upsert({
                id:         userId,
                email:      buyerEmail,
                plan:       'pro',
                updated_at: new Date().toISOString(),
            }, { onConflict: 'id' });

        await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { plan: 'pro' },
        });

        console.log(`[hotmart/webhook] ✅ User ${userId} (${buyerEmail}) upgraded to Pro`);

    } else if (DOWNGRADE_EVENTS.has(event)) {
        await supabaseAdmin
            .from('users')
            .update({ plan: 'free', updated_at: new Date().toISOString() })
            .eq('id', userId);

        await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { plan: 'free' },
        });

        console.log(`[hotmart/webhook] ⬇️ User ${userId} (${buyerEmail}) downgraded to Free (${event})`);
    }

    return NextResponse.json({ received: true });
}
