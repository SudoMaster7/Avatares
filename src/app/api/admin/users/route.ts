import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service-role client — bypasses RLS, only used server-side
function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Verify the caller is an admin
async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) return false;
    const token = authHeader.replace('Bearer ', '');
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user } } = await anonClient.auth.getUser(token);
    return user?.user_metadata?.role === 'admin';
}

// GET /api/admin/users — list all users
export async function GET(req: NextRequest) {
    if (!(await verifyAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const users = data.users.map(u => ({
        id: u.id,
        email: u.email ?? '',
        name: u.user_metadata?.name ?? '',
        plan: u.user_metadata?.plan ?? 'free',
        role: u.user_metadata?.role ?? '',
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
        confirmed: !!u.email_confirmed_at,
    }));

    return NextResponse.json({ users });
}

// PATCH /api/admin/users — update a user's plan or role
export async function PATCH(req: NextRequest) {
    if (!(await verifyAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId, updates } = await req.json();
    if (!userId || !updates) {
        return NextResponse.json({ error: 'userId and updates required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: updates,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ user: data.user });
}

// DELETE /api/admin/users — delete a user
export async function DELETE(req: NextRequest) {
    if (!(await verifyAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const supabase = getServiceClient();
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}

// POST /api/admin/users — create a new user
export async function POST(req: NextRequest) {
    if (!(await verifyAdmin(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { email, password, name, plan, role } = await req.json();
    if (!email || !password) {
        return NextResponse.json({ error: 'email and password required' }, { status: 400 });
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: name ?? '', plan: plan ?? 'free', role: role ?? '' },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ user: data.user });
}
