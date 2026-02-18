/**
 * POST /api/google-tts
 * Proxy server-side para Google Cloud Text-to-Speech Neural2.
 * Mantém a API key segura no servidor.
 *
 * Plano gratuito: 1 milhão de caracteres/mês com vozes Neural2.
 * Documentação: https://cloud.google.com/text-to-speech/docs/voices
 */

import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;

// Mapeamento de locale → voz Neural2 padrão
const DEFAULT_VOICES: Record<string, { name: string; gender: 'FEMALE' | 'MALE' }> = {
    'pt-BR': { name: 'pt-BR-Neural2-C', gender: 'FEMALE' },
    'pt-br': { name: 'pt-BR-Neural2-C', gender: 'FEMALE' },
    'en':    { name: 'en-US-Neural2-C', gender: 'FEMALE' },
    'en-US': { name: 'en-US-Neural2-C', gender: 'FEMALE' },
    'en-us': { name: 'en-US-Neural2-C', gender: 'FEMALE' },
};

const MALE_VOICES: Record<string, string> = {
    'pt-BR': 'pt-BR-Neural2-B',
    'pt-br': 'pt-BR-Neural2-B',
    'en':    'en-US-Neural2-D',
    'en-US': 'en-US-Neural2-D',
    'en-us': 'en-US-Neural2-D',
};

interface GoogleTTSRequest {
    text: string;
    language?: string;
    voiceName?: string;       // override opcional (ex: 'pt-BR-Neural2-A')
    preferMale?: boolean;
    speakingRate?: number;    // 0.25–4.0, default 1.0
    pitch?: number;           // -20.0–20.0, default 0
}

export async function POST(request: NextRequest) {
    if (!GOOGLE_API_KEY) {
        return NextResponse.json({ error: 'GOOGLE_CLOUD_TTS_API_KEY not configured' }, { status: 500 });
    }

    let body: GoogleTTSRequest;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { text, language = 'pt-BR', voiceName, preferMale, speakingRate = 1.0, pitch = 0 } = body;

    if (!text || text.trim().length === 0) {
        return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    // Resolve voice
    const lang = language.toLowerCase();
    const langKey = Object.keys(DEFAULT_VOICES).find(k => k.toLowerCase() === lang) ?? 'pt-BR';
    const resolvedVoiceName =
        voiceName ??
        (preferMale ? MALE_VOICES[langKey] : DEFAULT_VOICES[langKey]?.name) ??
        'pt-BR-Neural2-C';

    const languageCode = resolvedVoiceName.substring(0, 5); // e.g. 'pt-BR', 'en-US'

    const googlePayload = {
        input: { text },
        voice: {
            languageCode,
            name: resolvedVoiceName,
        },
        audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: Math.max(0.25, Math.min(4.0, speakingRate)),
            pitch: Math.max(-20, Math.min(20, pitch)),
            effectsProfileId: ['headphone-class-device'],
        },
    };

    try {
        const res = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(googlePayload),
            }
        );

        if (!res.ok) {
            const errText = await res.text();
            console.error('[google-tts] API error:', errText);
            return NextResponse.json({ error: 'Google TTS API error', details: errText }, { status: res.status });
        }

        const data = await res.json();
        // data.audioContent is base64-encoded MP3
        return NextResponse.json({ audio: data.audioContent, voice: resolvedVoiceName });
    } catch (error) {
        console.error('[google-tts] Fetch error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
