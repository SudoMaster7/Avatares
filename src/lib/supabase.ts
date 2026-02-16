import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
    signUp: async (email: string, password: string, metadata?: any) => {
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
    },

    signIn: async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({
            email,
            password,
        });
    },

    signOut: async () => {
        return await supabase.auth.signOut();
    },

    getUser: async () => {
        return await supabase.auth.getUser();
    },

    getSession: async () => {
        return await supabase.auth.getSession();
    },
};

// Database helpers
export const db = {
    // Users
    getUser: async (id: string) => {
        return await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
    },

    // Avatars
    getAvatars: async () => {
        return await supabase
            .from('avatars')
            .select('*')
            .eq('is_active', true);
    },

    getAvatar: async (id: string) => {
        return await supabase
            .from('avatars')
            .select('*')
            .eq('id', id)
            .single();
    },

    // Scenarios
    getScenarios: async (filters?: { subject?: string; language?: string; difficulty?: string }) => {
        let query = supabase
            .from('scenarios')
            .select('*, avatars(*)')
            .eq('is_active', true);

        if (filters?.subject) {
            query = query.eq('subject', filters.subject);
        }
        if (filters?.language) {
            query = query.eq('language', filters.language);
        }
        if (filters?.difficulty) {
            query = query.eq('difficulty_level', filters.difficulty);
        }

        return await query;
    },

    // Conversations
    createConversation: async (data: {
        student_id: string;
        avatar_id: string;
        scenario_id?: string;
    }) => {
        return await supabase
            .from('conversations')
            .insert(data)
            .select()
            .single();
    },

    updateConversation: async (id: string, data: any) => {
        return await supabase
            .from('conversations')
            .update(data)
            .eq('id', id)
            .select()
            .single();
    },

    // Messages
    createMessage: async (data: {
        conversation_id: string;
        sender_type: 'student' | 'avatar';
        content: string;
        transcription?: string;
        language?: string;
    }) => {
        return await supabase
            .from('messages')
            .insert(data)
            .select()
            .single();
    },

    getMessages: async (conversationId: string) => {
        return await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
    },

    // Student Progress
    getStudentProgress: async (studentId: string) => {
        return await supabase
            .from('student_progress')
            .select('*')
            .eq('student_id', studentId);
    },

    updateProgress: async (studentId: string, subject: string, language: string, data: any) => {
        return await supabase
            .from('student_progress')
            .upsert({
                student_id: studentId,
                subject,
                language,
                ...data,
            })
            .select()
            .single();
    },
};

export default supabase;
