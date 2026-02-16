import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech } from '@/services/elevenlabs';

export async function POST(request: NextRequest) {
    try {
        const { text, voiceId, modelId, stability, similarityBoost } = await request.json();

        if (!process.env.ELEVENLABS_API_KEY) {
            throw new Error('ElevenLabs API key not configured');
        }

        if (!text || !voiceId) {
            return NextResponse.json(
                { error: 'Text and voiceId are required' },
                { status: 400 }
            );
        }

        // Generate speech using ElevenLabs
        const audioBuffer = await generateSpeech({
            text,
            voiceId,
            modelId,
            stability,
            similarityBoost,
        });

        // Return audio as base64
        return NextResponse.json({
            audio: audioBuffer.toString('base64'),
            contentType: 'audio/mpeg',
        });
    } catch (error: any) {
        console.error('Error generating speech with ElevenLabs:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate speech' },
            { status: 500 }
        );
    }
}