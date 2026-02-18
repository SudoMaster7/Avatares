import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

async function verifyAdmin(req: NextRequest) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return false;
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await anonClient.auth.getUser(token);
    return user?.user_metadata?.role === 'admin';
}

// Coupons stored in Supabase table `coupons`
// Schema: id, code, discount_pct, max_uses, uses_count, expires_at, created_at, active

export async function GET(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const supabase = getServiceClient();
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ coupons: [], note: 'Table may not exist yet' });
    return NextResponse.json({ coupons: data });
}

export async function POST(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const { code, discount_pct, max_uses, expires_at } = body;
    if (!code || !discount_pct) return NextResponse.json({ error: 'code and discount_pct required' }, { status: 400 });

    const supabase = getServiceClient();
    const { data, error } = await supabase.from('coupons').insert({
        code: code.toUpperCase().trim(),
        discount_pct,
        max_uses: max_uses ?? null,
        uses_count: 0,
        expires_at: expires_at ?? null,
        active: true,
    }).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ coupon: data });
}

export async function DELETE(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const supabase = getServiceClient();
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
