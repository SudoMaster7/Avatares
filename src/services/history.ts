import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from './auth-service';

export interface ConversationHistory {
    id: string;
    started_at: string;
    avatar_id: string;
}

export async function getOrCreateConversation(avatarId: string, scenarioId?: string): Promise<string | null> {
    const userId = getCurrentUserId();
    if (!userId) return null;

    try {
        // 1. Check for active conversation
        let query = supabase
            .from('conversations')
            .select('id')
            .eq('student_id', userId)
            .eq('avatar_id', avatarId)
            .eq('status', 'active')
            .order('started_at', { ascending: false })
            .limit(1);

        if (scenarioId) {
            query = query.eq('scenario_id', scenarioId);
        } else {
            query = query.is('scenario_id', null);
        }

        const { data } = await query.single();

        if (data) {
            return data.id;
        }

        // 2. Create new conversation if none active
        const { data: newConv, error } = await supabase
            .from('conversations')
            .insert({
                student_id: userId,
                avatar_id: avatarId,
                scenario_id: scenarioId || null,
                status: 'active'
            })
            .select('id')
            .single();

        if (error) {
            console.error('Error creating conversation:', error);
            return null;
        }

        return newConv.id;
    } catch (error) {
        console.error('History service error:', error);
        return null;
    }
}

export async function saveMessage(conversationId: string, content: string, senderType: 'student' | 'avatar') {
    if (!conversationId) return;

    await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_type: senderType,
        content: content,
        language: 'pt-BR' // TODO: Get from context
    });
}

export async function loadConversationHistory(conversationId: string) {
    const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    return data || [];
}
