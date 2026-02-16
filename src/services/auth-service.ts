import { supabase } from '@/lib/supabase';

const GUEST_KEY = 'voice_sync_guest_id';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: 'student';
}

export async function initializeGuestSession(): Promise<UserProfile | null> {
    try {
        // 1. Check for active Supabase Auth session first
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            return {
                id: session.user.id,
                name: session.user.user_metadata.name || 'Aluno',
                email: session.user.email || '',
                role: 'student',
            };
        }

        // 2. Check if guest ID exists in localStorage
        let guestId = localStorage.getItem(GUEST_KEY);

        if (guestId) {
            // Check if user exists in DB
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', guestId)
                .single();

            if (data && !error) {
                return data as UserProfile;
            }
        }

        // 3. Create new guest user
        const newGuestId = crypto.randomUUID();
        const guestUser = {
            id: newGuestId,
            name: 'Visitante',
            email: `guest_${newGuestId.substring(0, 8)}@voice.sync`,
            password_hash: 'guest_no_auth',
            role: 'student' as const,
        };

        const { error: createError } = await supabase
            .from('users')
            .insert(guestUser);

        if (createError) {
            console.error('Error creating guest user:', createError);
            return null;
        }

        // 4. Save to localStorage
        localStorage.setItem(GUEST_KEY, newGuestId);

        // 5. Create student profile
        await supabase.from('student_profiles').insert({
            user_id: newGuestId,
            grade_level: 'N/A',
        });

        return guestUser;
    } catch (error) {
        console.error('Failed to initialize guest session:', error);
        return null;
    }
}

export function getCurrentUserId(): string | null {
    if (typeof window === 'undefined') return null;
    // Check local storage for guest key first to maintain guest session if not fully logged out
    // BUT we should prefer auth session if available
    // For synchronous check, we use local storage guest key or maybe a session token if we had one
    // Since supabase.auth.getUser() is async, we can't use it here easily without refactoring everything to async

    // Compromise: check guest key. If missing, we might be logged in via Supabase but we need async to verify.
    // For now, let's trust the guest key if it exists, otherwise return null.
    // Ideally we should refactor hooks to be async.
    return localStorage.getItem(GUEST_KEY);
}

// Helper to get async user
export async function getCurrentUser(): Promise<UserProfile | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        return {
            id: session.user.id,
            name: session.user.user_metadata.name || 'Aluno',
            email: session.user.email || '',
            role: 'student',
        };
    }

    const guestId = localStorage.getItem(GUEST_KEY);
    if (guestId) {
        const { data } = await supabase.from('users').select('*').eq('id', guestId).single();
        return data as UserProfile;
    }
    return null;
}

// Full Auth Functions

export async function signUpCommand(email: string, password: string, name: string) {
    // 1. SignUp in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { name },
        },
    });

    if (authError) throw authError;
    // Note: if email confirmation is enabled, user might be created but session null
    if (!authData.user) throw new Error('Verifique seu email para confirmar o cadastro (se necessário) ou tente novamente.');

    // 2. Create record in public.users (sync)
    // Supabase might have triggers for this, but we do it manually to be safe with our custom schema
    const { error: dbError } = await supabase.from('users').insert({
        id: authData.user.id,
        name: name,
        email: email,
        password_hash: 'managed_by_supabase_auth',
        role: 'student',
    });

    if (dbError) {
        console.error('Error syncing public.users:', dbError);
    }

    // 3. Create student profile
    await supabase.from('student_profiles').insert({
        user_id: authData.user.id,
        grade_level: 'N/A',
    });

    // 4. Migrate Guest Data
    const guestId = localStorage.getItem(GUEST_KEY);
    if (guestId) {
        await migrateGuestData(guestId, authData.user.id);
        localStorage.removeItem(GUEST_KEY); // Clear guest ID
    }

    return authData.user;
}

export async function signInCommand(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;

    // Migrate if needed (e.g. user was guest, decided to login to existing account)
    const guestId = localStorage.getItem(GUEST_KEY);
    if (guestId && data.user) {
        await migrateGuestData(guestId, data.user.id);
        localStorage.removeItem(GUEST_KEY);
    }

    return data.user;
}

export async function signOutCommand() {
    await supabase.auth.signOut();
    localStorage.removeItem(GUEST_KEY);
    localStorage.removeItem('avatar_user_stats');
    window.location.reload();
}

async function migrateGuestData(guestId: string, newUserId: string) {
    console.log(`Migrating data from ${guestId} to ${newUserId}`);

    try {
        // 1. Conversations
        const { error: convError } = await supabase
            .from('conversations')
            .update({ student_id: newUserId })
            .eq('student_id', guestId);

        if (convError) console.error('Error migrating conversations:', convError);

        // 2. XP / Profiles
        // Get guest XP
        const { data: guestProfile } = await supabase
            .from('student_profiles')
            .select('total_points')
            .eq('user_id', guestId)
            .single();

        if (guestProfile && guestProfile.total_points > 0) {
            // Get new user XP
            const { data: userProfile } = await supabase
                .from('student_profiles')
                .select('total_points')
                .eq('user_id', newUserId)
                .single();

            const currentXP = userProfile?.total_points || 0;
            const newXP = currentXP + guestProfile.total_points;

            await supabase
                .from('student_profiles')
                .update({ total_points: newXP })
                .eq('user_id', newUserId);
        }

        // Clean up guest entries if migration successful
        // await supabase.from('users').delete().eq('id', guestId);

    } catch (error) {
        console.error('Migration failed:', error);
    }
}
