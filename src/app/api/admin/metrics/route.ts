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

export async function GET(req: NextRequest) {
    if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = getServiceClient();

    // Fetch all users for metrics
    const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const users = usersData?.users ?? [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const totalUsers = users.length;
    const proUsers = users.filter(u => u.user_metadata?.plan === 'pro').length;
    const freeUsers = totalUsers - proUsers;
    const newUsersLast30d = users.filter(u => u.created_at >= thirtyDaysAgo).length;
    const newUsersLast7d = users.filter(u => u.created_at >= sevenDaysAgo).length;
    const activeUsersLast7d = users.filter(u => u.last_sign_in_at && u.last_sign_in_at >= sevenDaysAgo).length;
    const conversionRate = totalUsers > 0 ? ((proUsers / totalUsers) * 100).toFixed(1) : '0';

    // Signups per day (last 30 days)
    const signupsByDay: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split('T')[0];
        signupsByDay[key] = 0;
    }
    users.forEach(u => {
        const day = u.created_at.split('T')[0];
        if (day in signupsByDay) signupsByDay[day]++;
    });

    // Fetch conversation history if table exists
    const { data: historyData } = await supabase
        .from('conversation_history')
        .select('id, created_at, user_id')
        .gte('created_at', thirtyDaysAgo);

    const totalConversations = historyData?.length ?? 0;

    // Coupon usage
    const { data: couponsData } = await supabase
        .from('coupons')
        .select('code, uses_count, discount_pct, active');
    const totalCouponUses = (couponsData ?? []).reduce((s, c) => s + (c.uses_count ?? 0), 0);

    return NextResponse.json({
        users: {
            total: totalUsers,
            pro: proUsers,
            free: freeUsers,
            newLast30d: newUsersLast30d,
            newLast7d: newUsersLast7d,
            activeLast7d: activeUsersLast7d,
            conversionRate: parseFloat(conversionRate),
        },
        charts: {
            signupsByDay: Object.entries(signupsByDay).map(([date, count]) => ({ date, count })),
        },
        conversations: {
            totalLast30d: totalConversations,
        },
        coupons: {
            totalUses: totalCouponUses,
            activeCoupons: (couponsData ?? []).filter(c => c.active).length,
        },
    });
}
