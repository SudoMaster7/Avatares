// Client-side TTS service with ElevenLabs and Google Cloud TTS fallback
export interface TTSOptions {
    text: string;
    language?: string;
    // ElevenLabs options
    elevenLabsVoiceId?: string;
    elevenLabsModelId?: string;
    stability?: number;
    similarityBoost?: number;
    // Google TTS fallback options
    voiceName?: string;
}

/**
 * Speak text using ElevenLabs TTS (highest quality, most realistic)
 */
export async function speakWithElevenLabs(options: TTSOptions): Promise<void> {
    const { 
        text, 
        elevenLabsVoiceId,
        elevenLabsModelId = 'eleven_multilingual_v2',
        stability = 0.6,
        similarityBoost = 0.8
    } = options;

    if (!elevenLabsVoiceId) {
        throw new Error('ElevenLabs voice ID is required');
    }

    try {
        const response = await fetch('/api/elevenlabs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voiceId: elevenLabsVoiceId,
                modelId: elevenLabsModelId,
                stability,
                similarityBoost,
            }),
        });

        if (!response.ok) {
            throw new Error('ElevenLabs API failed');
        }

        const data = await response.json();

        // Convert base64 to audio and play
        const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        return new Promise((resolve, reject) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            audio.onerror = reject;
            audio.play();
        });
    } catch (error) {
        console.error('ElevenLabs TTS error:', error);
        throw error;
    }
}

/**
 * Speak text using Google Cloud TTS (premium quality)
 */
export async function speakWithGoogleTTS(options: TTSOptions): Promise<void> {
    const { text, language = 'pt-BR', voiceName } = options;

    try {
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                language,
                voiceName,
            }),
        });

        if (!response.ok) {
            throw new Error('TTS API failed');
        }

        const data = await response.json();

        // Convert base64 to audio and play
        const audioBlob = base64ToBlob(data.audio, 'audio/mp3');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        return new Promise((resolve, reject) => {
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            audio.onerror = reject;
            audio.play();
        });
    } catch (error) {
        console.error('Google TTS error, falling back to Web Speech:', error);
        // Fallback to Web Speech API
        return speakWithWebSpeech(options);
    }
}

/**
 * Fallback: Web Speech API
 */
function speakWithWebSpeech(options: TTSOptions): Promise<void> {
    const { text, language = 'pt-BR' } = options;

    return new Promise((resolve, reject) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.lang = language;
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);

        synth.speak(utterance);
    });
}

/**
 * Main speak function (tries ElevenLabs first, then Google TTS, then Web Speech)
 */
export async function speak(options: TTSOptions): Promise<void> {
    // Try ElevenLabs first if voice ID is provided
    if (options.elevenLabsVoiceId) {
        try {
            return await speakWithElevenLabs(options);
        } catch (error) {
            console.warn('ElevenLabs failed, falling back to Google TTS:', error);
        }
    }
    
    // Fallback to Google TTS
    try {
        return await speakWithGoogleTTS(options);
    } catch (error) {
        console.warn('Google TTS failed, falling back to Web Speech:', error);
        return speakWithWebSpeech(options);
    }
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
    window.speechSynthesis.cancel();
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
    return window.speechSynthesis.speaking;
}

/**
 * Initialize TTS (for Web Speech API voices)
 */
export function initializeTTS(): Promise<void> {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;

        if (synth.getVoices().length > 0) {
            resolve();
            return;
        }

        synth.onvoiceschanged = () => {
            resolve();
        };

        setTimeout(() => resolve(), 1000);
    });
}

// Helper function
function base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
}

// Voice configurations for avatars
export const GOOGLE_TTS_VOICES = {
    'pt-BR': {
        male: 'pt-BR-Wavenet-B',
        female: 'pt-BR-Wavenet-A',
    },
    'en': {
        male: 'en-US-Wavenet-D',
        female: 'en-US-Wavenet-C',
    },
} as const;
