/**
 * SUDO Education – Auth Service v2
 * Supports: regular students, parental accounts, child sub-profiles
 * LGPD / COPPA compliant: requires parental consent for users < 13
 */

import { supabase } from '@/lib/supabase';
import { PlanType } from '@/types/plans';

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    plan: PlanType;
    isChild: boolean;
    parentId: string | null;
    parentalConsent: boolean;
    dateOfBirth: string | null;
    ageVerified: boolean;
}

export interface ParentSignUpPayload {
    email: string;
    password: string;
    name: string;
    /** Optional: used to enforce LGPD/COPPA compliance for the parent */
    dateOfBirth?: string;
}

export interface ChildSignUpPayload {
    name: string;
    dateOfBirth: string;
    /** The invite token sent to the parent */
    inviteToken: string;
}

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const MINIMUM_CHILD_AGE = 5;
const COPPA_AGE_THRESHOLD = 13; // Under 13 requires parental consent (COPPA / LGPD art. 14)
const GUEST_KEY = 'sudo_guest_id';

// ─────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────

function calcAge(dob: string): number {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

// ─────────────────────────────────────────────────────────
// Parent registration (creates the billing account)
// ─────────────────────────────────────────────────────────

export async function signUpParent(payload: ParentSignUpPayload): Promise<UserProfile> {
    const { email, password, name, dateOfBirth } = payload;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role_extended: 'parent',
                date_of_birth: dateOfBirth ?? null,
                plan: 'free',
                is_child: false,
                parental_consent: true, // parent gives consent for themselves
            },
        },
    });

    if (error) throw new Error(error.message);

    // Insert into public users table (handled by Supabase Auth trigger in production,
    // or manually here for simplicity)
    const userId = data.user!.id;
    await supabase.from('users').upsert({
        id: userId,
        email,
        name,
        role: 'student',
        role_extended: 'parent',
        plan: 'free',
        is_child: false,
        parental_consent: true,
        date_of_birth: dateOfBirth ?? null,
        age_verified: dateOfBirth ? calcAge(dateOfBirth) >= 18 : false,
    });

    return {
        id: userId,
        name,
        email,
        role: 'parent',
        plan: 'free',
        isChild: false,
        parentId: null,
        parentalConsent: true,
        dateOfBirth: dateOfBirth ?? null,
        ageVerified: dateOfBirth ? calcAge(dateOfBirth) >= 18 : false,
    };
}

// ─────────────────────────────────────────────────────────
// Create a child profile (linked to parent, no auth login)
// ─────────────────────────────────────────────────────────

export async function createChildProfile(
    parentId: string,
    payload: { name: string; dateOfBirth: string }
): Promise<{ id: string; name: string }> {
    const age = calcAge(payload.dateOfBirth);

    if (age < MINIMUM_CHILD_AGE) {
        throw new Error(`Crianças com menos de ${MINIMUM_CHILD_AGE} anos não podem usar o sistema.`);
    }
    if (age >= COPPA_AGE_THRESHOLD) {
        // Old enough → can register as a normal student with their own account
        throw new Error('Para maiores de 13 anos, crie uma conta de aluno diretamente.');
    }

    // Verify the parent exists
    const { data: parent, error: pErr } = await supabase
        .from('users')
        .select('id, plan, role_extended')
        .eq('id', parentId)
        .single();

    if (pErr || !parent) throw new Error('Conta do responsável não encontrada.');
    if (parent.role_extended !== 'parent') throw new Error('A conta do responsável não é do tipo "parent".');

    // Create child row in users table (no auth.users entry – managed by parent)
    const childId = generateUUID();
    const { error: insertErr } = await supabase.from('users').insert({
        id: childId,
        email: `child_${childId.substring(0, 8)}@interno.sudoeducation`,
        name: payload.name,
        password_hash: 'PARENTAL_MANAGED', // not used for direct login
        role: 'student',
        role_extended: 'student',
        plan: parent.plan, // inherit parent plan
        is_child: true,
        parent_id: parentId,
        parental_consent: true,
        consent_given_at: new Date().toISOString(),
        date_of_birth: payload.dateOfBirth,
        age_verified: true,
    });

    if (insertErr) throw new Error(insertErr.message);

    // Create student profile
    await supabase.from('student_profiles').insert({
        user_id: childId,
        preferred_language: 'pt-BR',
        total_points: 0,
    });

    return { id: childId, name: payload.name };
}

// ─────────────────────────────────────────────────────────
// Standard student sign-up (age >= 13)
// ─────────────────────────────────────────────────────────

export async function signUpStudent(
    email: string,
    password: string,
    name: string,
    dateOfBirth: string
): Promise<UserProfile> {
    const age = calcAge(dateOfBirth);

    if (age < COPPA_AGE_THRESHOLD) {
        throw new Error(
            'Para menores de 13 anos, o responsável precisa criar uma conta de Familiar e adicionar o perfil da criança.'
        );
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                role_extended: 'student',
                date_of_birth: dateOfBirth,
                plan: 'free',
                is_child: false,
                parental_consent: true,
            },
        },
    });

    if (error) throw new Error(error.message);

    const userId = data.user!.id;
    await supabase.from('users').upsert({
        id: userId,
        email,
        name,
        role: 'student',
        role_extended: 'student',
        plan: 'free',
        is_child: false,
        date_of_birth: dateOfBirth,
        age_verified: true,
        parental_consent: true,
    });

    return {
        id: userId,
        name,
        email,
        role: 'student',
        plan: 'free',
        isChild: false,
        parentId: null,
        parentalConsent: true,
        dateOfBirth,
        ageVerified: true,
    };
}

// ─────────────────────────────────────────────────────────
// Sign in (email + password)
// ─────────────────────────────────────────────────────────

export async function signIn(email: string, password: string): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const { data: user, error: uErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user!.id)
        .single();

    if (uErr || !user) throw new Error('Perfil de usuário não encontrado.');

    return mapDbToProfile(user);
}

// ─────────────────────────────────────────────────────────
// Sign out
// ─────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
        localStorage.removeItem(GUEST_KEY);
    }
}

// ─────────────────────────────────────────────────────────
// Get current user (auth session preferred, guest fallback)
// ─────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<UserProfile | null> {
    // 1. Active auth session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
        if (user) return mapDbToProfile(user);
    }

    // 2. Guest (local only)
    if (typeof window !== 'undefined') {
        let guestId = localStorage.getItem(GUEST_KEY);
        if (!guestId) {
            guestId = generateUUID();
            localStorage.setItem(GUEST_KEY, guestId);
        }
        return {
            id: guestId,
            name: 'Visitante',
            email: `guest_${guestId.substring(0, 8)}@sudoeducation.app`,
            role: 'student',
            plan: 'free',
            isChild: false,
            parentId: null,
            parentalConsent: false,
            dateOfBirth: null,
            ageVerified: false,
        };
    }

    return null;
}

// ─────────────────────────────────────────────────────────
// List children for a parent
// ─────────────────────────────────────────────────────────

export async function getChildProfiles(parentId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('id, name, date_of_birth, plan, created_at')
        .eq('parent_id', parentId)
        .eq('is_child', true);

    if (error) throw new Error(error.message);
    return data ?? [];
}

// ─────────────────────────────────────────────────────────
// Internal mapper
// ─────────────────────────────────────────────────────────

function mapDbToProfile(user: Record<string, unknown>): UserProfile {
    return {
        id: user.id as string,
        name: user.name as string,
        email: user.email as string,
        role: (user.role_extended ?? user.role) as UserRole,
        plan: (user.plan ?? 'free') as PlanType,
        isChild: Boolean(user.is_child),
        parentId: (user.parent_id as string | null) ?? null,
        parentalConsent: Boolean(user.parental_consent),
        dateOfBirth: (user.date_of_birth as string | null) ?? null,
        ageVerified: Boolean(user.age_verified),
    };
}
