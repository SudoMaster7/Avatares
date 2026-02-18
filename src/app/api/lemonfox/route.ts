/**
 * Lemonfox TTS API Route
 * High-quality text-to-speech with multiple voice options
 * https://www.lemonfox.ai/apis/text-to-speech
 * 
 * Voices available (Portuguese):
 * - pt-BR: Fernanda, Ricardo, Vitória
 * - en-US: Emma, James, Olivia, William
 */

import { NextRequest, NextResponse } from 'next/server';

const LEMONFOX_API_KEY = process.env.LEMONFOX_API_KEY;
const LEMONFOX_API_URL = 'https://api.lemonfox.ai/v1/audio/speech';

// Voice presets — real Lemonfox voice names (use language param for PT-BR)
export const LEMONFOX_VOICES = {
    // Female voices (PT-BR or EN depending on language param)
    'bella':   { id: 'bella',   description: 'Feminina, natural, professora' },
    'nova':    { id: 'nova',    description: 'Feminina, animada, jovem' },
    'sarah':   { id: 'sarah',   description: 'Female, warm, teacher' },
    'jessica': { id: 'jessica', description: 'Female, friendly, guide' },
    // Male voices
    'michael': { id: 'michael', description: 'Masculino, calmo, educador' },
    'liam':    { id: 'liam',    description: 'Masculino, enérgico, dinâmico' },
    'eric':    { id: 'eric',    description: 'Male, authoritative, professor' },
    'echo':    { id: 'echo',    description: 'Male, steady, narrator' },
} as const;

export type LemonfoxVoiceId = keyof typeof LEMONFOX_VOICES;

// Map from avatar language codes to Lemonfox language codes
const LANG_MAP: Record<string, string> = {
    'pt-BR': 'pt-br',
    'pt-br': 'pt-br',
    'en':    'en-us',
    'en-US': 'en-us',
    'en-us': 'en-us',
    'es':    'es-es',
    'es-ES': 'es-es',
};

interface LemonfoxRequest {
    text: string;
    voiceId?: LemonfoxVoiceId;
    language?: string;  // avatar language code, e.g. 'pt-BR', 'en'
    speed?: number;     // 0.5 - 2.0
    pitch?: number;     // 0.5 - 2.0
}

export async function POST(request: NextRequest) {
    // Check API key
    if (!LEMONFOX_API_KEY) {
        return NextResponse.json(
            { error: 'Lemonfox TTS not configured' },
            { status: 503 }
        );
    }

    try {
        const body: LemonfoxRequest = await request.json();
        const { 
            text, 
            voiceId = 'bella',
            language,
            speed = 1.0,
            pitch = 1.0,
        } = body;

        // Resolve Lemonfox language code (required for PT-BR voices)
        const lemonfoxLang = (language && LANG_MAP[language]) ?? 'pt-br';

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Limit text length to avoid excessive API usage
        const truncatedText = text.slice(0, 1000);

        const response = await fetch(LEMONFOX_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LEMONFOX_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: truncatedText,
                voice: voiceId,
                language: lemonfoxLang,
                speed: speed,
                response_format: 'mp3',
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Lemonfox API error:', errorText);
            return NextResponse.json(
                { error: 'Failed to generate speech' },
                { status: response.status }
            );
        }

        // Get audio as ArrayBuffer
        const audioBuffer = await response.arrayBuffer();
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return NextResponse.json({
            audio: base64Audio,
            format: 'mp3',
            voiceId,
        });
    } catch (error) {
        console.error('Lemonfox TTS error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET endpoint to list available voices
export async function GET() {
    return NextResponse.json({
        voices: Object.entries(LEMONFOX_VOICES).map(([voiceId, config]) => ({
            voiceId,
            ...config,
        })),
    });
}
