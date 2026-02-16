// Client-side TTS service optimized for Vercel deployment
export interface TTSOptions {
    text: string;
    language?: string;
    // ElevenLabs options
    elevenLabsVoiceId?: string;
    elevenLabsModelId?: string;
    stability?: number;
    similarityBoost?: number;
}

/**
 * Main TTS function - uses ElevenLabs with Web Speech fallback
 */
export async function speak(options: TTSOptions): Promise<void> {
    const { text, elevenLabsVoiceId } = options;
    
    if (!text || text.trim().length === 0) {
        console.warn('Empty text provided to TTS service');
        return;
    }

    // Try ElevenLabs first if voice ID is provided
    if (elevenLabsVoiceId) {
        try {
            console.log('Using ElevenLabs TTS');
            await speakWithElevenLabs(options);
            return;
        } catch (error) {
            console.warn('ElevenLabs failed, falling back to Web Speech:', error);
        }
    }
    
    // Fallback to Web Speech API
    console.log('Using Web Speech API');
    await speakWithWebSpeech(options);
}

/**
 * Speak text using ElevenLabs TTS (highest quality, most realistic)
 */
export async function speakWithElevenLabs(options: TTSOptions): Promise<void> {
    const { 
        text, 
        elevenLabsVoiceId,
        elevenLabsModelId = 'eleven_multilingual_v2',
        stability = 0.6, // Para vozes mais animadas
        similarityBoost = 0.8 // Para características únicas
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
 * Web Speech API fallback (built into browsers)
 */
export async function speakWithWebSpeech(options: TTSOptions): Promise<void> {
    const { text, language = 'pt-BR' } = options;

    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('Web Speech API not available');
        throw new Error('Web Speech API not supported');
    }

    return new Promise((resolve, reject) => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => {
            console.log('Web Speech synthesis completed');
            resolve();
        };

        utterance.onerror = (event) => {
            console.error('Web Speech synthesis error:', event.error);
            reject(new Error(`Web Speech error: ${event.error}`));
        };

        // Start speaking
        window.speechSynthesis.speak(utterance);
    });
}

/**
 * Stop current speech
 */
export function stopSpeaking(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
}

/**
 * Check if currently speaking
 */
export function isSpeaking(): boolean {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return false;
    }
    return window.speechSynthesis.speaking;
}

/**
 * Get available voices for Web Speech API
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return [];
    }

    return window.speechSynthesis.getVoices();
}

/**
 * Initialize TTS service (for Web Speech API voices)
 */
export function initializeTTS(): Promise<void> {
    console.log('TTS service initialized with ElevenLabs + Web Speech fallback');
    
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            resolve();
            return;
        }

        const synth = window.speechSynthesis;

        if (synth.getVoices().length > 0) {
            resolve();
            return;
        }

        synth.onvoiceschanged = () => {
            resolve();
        };

        // Timeout fallback
        setTimeout(() => resolve(), 1000);
    });
}

// Helper function to convert base64 to blob
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
