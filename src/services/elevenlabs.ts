import { ElevenLabsClient } from 'elevenlabs';

const elevenlabs = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

export interface TTSOptions {
    voiceId: string;
    text: string;
    modelId?: string;
    stability?: number;
    similarityBoost?: number;
}

export async function generateSpeech(options: TTSOptions): Promise<Buffer> {
    const {
        voiceId,
        text,
        modelId = 'eleven_multilingual_v2',
        stability = 0.5,
        similarityBoost = 0.75,
    } = options;

    try {
        const audio = await elevenlabs.generate({
            voice: voiceId,
            text,
            model_id: modelId,
            voice_settings: {
                stability,
                similarity_boost: similarityBoost,
            },
        });

        const chunks: Buffer[] = [];
        for await (const chunk of audio) {
            chunks.push(chunk);
        }

        return Buffer.concat(chunks);
    } catch (error) {
        console.error('Error generating speech with ElevenLabs:', error);
        throw new Error(`ElevenLabs TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function generateSpeechStream(options: TTSOptions): Promise<AsyncIterable<Buffer>> {
    const {
        voiceId,
        text,
        modelId = 'eleven_multilingual_v2',
        stability = 0.5,
        similarityBoost = 0.75,
    } = options;

    try {
        const audio = await elevenlabs.generate({
            voice: voiceId,
            text,
            model_id: modelId,
            voice_settings: {
                stability,
                similarity_boost: similarityBoost,
            },
            stream: true,
        });

        return audio;
    } catch (error) {
        console.error('Error generating speech stream:', error);
        throw new Error('Failed to generate speech stream');
    }
}

// Voice IDs comuns (você pode adicionar mais)
export const VOICE_IDS = {
    MALE_TEACHER: '21m00Tcm4TlvDq8ikWAM', // Rachel
    FEMALE_TEACHER: 'EXAVITQu4vr4xnSDxMaL', // Bella
    MALE_HISTORICAL: 'VR6AewLTigWG4xSOukaG', // Arnold
    FEMALE_CULTURAL: 'pNInz6obpgDQGcFmaJgB', // Adam
} as const;
