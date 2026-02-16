import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { messages, temperature = 0.7, maxTokens = 500, model = 'llama-3.3-70b-versatile' } = await request.json();

        const completion = await groq.chat.completions.create({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
        });

        return NextResponse.json({
            content: completion.choices[0]?.message?.content || '',
        });
    } catch (error: any) {
        console.error('Error generating response with Groq:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate AI response' },
            { status: 500 }
        );
    }
}
