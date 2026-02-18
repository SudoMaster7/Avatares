// Client-side service that calls our API route
// This avoids exposing API keys in the browser

import { supabase } from '@/lib/supabase';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface GenerateResponseOptions {
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
    model?: string;
    userId?: string | null;
    avatarId?: string;
    userMessage?: string;  // For content filtering
}

export interface ChatApiResponse {
    content: string;
    meta?: {
        plan: string;
        modelQuality: string;
        tokensRemaining: number;
        canUseTTS: boolean;
        ttsType: 'google' | 'elevenlabs' | 'lemonfox' | null;
    };
    error?: string;
    upgradeRequired?: boolean;
    demoComplete?: boolean;
    showSignupModal?: boolean;
}

export async function generateResponse(options: GenerateResponseOptions): Promise<ChatApiResponse> {
    const {
        messages,
        temperature = 0.7,
        maxTokens = 500,
        model = 'llama-3.3-70b-versatile',
        userId,
        avatarId,
        userMessage,
    } = options;

    try {
        // Get session token so server can verify user role (admin check)
        let authToken: string | undefined;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            authToken = session?.access_token;
        } catch { /* non-critical */ }

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify({
                messages,
                temperature,
                maxTokens,
                model,
                userId,
                avatarId,
                userMessage,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            // Return error response so caller can handle upgrade/signup prompts
            if (response.status === 402) {
                return {
                    content: '',
                    error: errorData.error,
                    upgradeRequired: errorData.upgradeRequired,
                    demoComplete: errorData.demoComplete,
                    showSignupModal: errorData.showSignupModal,
                };
            }
            throw new Error(errorData.error || 'Failed to generate AI response');
        }

        const data = await response.json();
        return {
            content: data.content,
            meta: data.meta,
        };
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}

export async function generateStreamResponse(
    options: GenerateResponseOptions
): Promise<AsyncIterable<any>> {
    // TODO: Implement streaming if needed
    throw new Error('Streaming not implemented yet');
}

import { Scenario } from '@/lib/scenarios';

export function createAvatarSystemPrompt(
    avatarName: string,
    personality: string,
    subject?: string,
    language: string = 'pt-BR',
    scenario?: Scenario
): string {
    let prompt = `Você é ${avatarName}, um avatar educacional interativo.

Personalidade e Contexto:
${personality}

${subject ? `Disciplina: ${subject}` : ''}
Idioma: ${language}`;

    if (scenario) {
        prompt += `\n\nCENÁRIO ATUAL: ${scenario.title}
Descrição: ${scenario.description}
Objetivos de Aprendizagem:
${scenario.learningObjectives.map(o => `- ${o}`).join('\n')}

IMPORTANTE: Mantenha o foco neste cenário. Atue conforme a descrição e ajude o usuário a atingir os objetivos de forma natural.`;
    }

    prompt += `\n\nInstruções:
1. Mantenha conversas naturais e educativas
2. Adapte sua linguagem ao nível do aluno
3. Faça perguntas para verificar compreensão
4. Forneça feedback construtivo
5. Seja encorajador e paciente
6. Use exemplos práticos e relevantes
7. Mantenha respostas concisas (2-3 frases)

Responda de forma natural e conversacional.`;

    return prompt;
}

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // Index 0-3
    explanation: string;
}

export async function generateQuiz(
    topic: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<QuizQuestion[]> {
    const prompt = `You are a quiz generator. Generate a JSON array of 3 multiple-choice questions about "${topic}" for a "${difficulty}" level student.
    
    RETURN ONLY RAW JSON. NO MARKDOWN. NO EXPLANATIONS.
    
    Format:
    [
        {
            "id": "1",
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Why this is correct."
        }
    ]`;

    try {
        const apiResponse = await generateResponse({
            messages: [{ role: 'system', content: prompt }],
            temperature: 0.1,
            model: 'llama-3.3-70b-versatile',
        });

        const content = apiResponse.content;
        console.log('Quiz Raw output:', content);

        // Robust JSON extraction
        let jsonString = content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        }

        const quizData = JSON.parse(jsonString);

        // Basic validation
        if (!Array.isArray(quizData) || quizData.length === 0 || !quizData[0].question) {
            throw new Error('Invalid quiz format');
        }

        return quizData;
    } catch (error) {
        console.error('Error generating quiz:', error);
        // Fallback quiz in case of error
        return [
            {
                id: 'error-fallback',
                question: 'Não foi possível gerar o quiz sobre este tópico. Tente outro tema.',
                options: ['Tentar Novamente', 'Tentar Novamente', 'Tentar Novamente', 'Tentar Novamente'],
                correctAnswer: 0,
                explanation: 'Ocorreu um erro na IA. Por favor, tente novamente.',
            },
        ];
    }
}
