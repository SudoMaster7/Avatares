import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from './auth-service';

export interface ConversationHistory {
    id: string;
    started_at: string;
    avatar_id: string;
}

export async function getOrCreateConversation(avatarId: string, scenarioId?: string): Promise<string | null> {
    // TEMPORARY: Return a mock conversation ID until database is set up
    const mockConversationId = `mock_conv_${Date.now()}`;
    console.log('Mock conversation created:', mockConversationId);
    return mockConversationId;
}

export async function saveMessage(conversationId: string, content: string, senderType: 'student' | 'avatar') {
    // TEMPORARY: Log messages until database is set up
    console.log('Mock message saved:', { conversationId, content, senderType });
    return;
}

export async function loadConversationHistory(conversationId: string) {
    // TEMPORARY: Return empty history until database is set up
    console.log('Mock conversation history loaded for:', conversationId);
    return [];
}
