// Client-side TTS service optimized for Vercel deployment
export interface TTSOptions {
    text: string;
    language?: string;
    preferFemale?: boolean;  // hint for Web Speech / Google voice selection
    // ElevenLabs options
    elevenLabsVoiceId?: string;
    elevenLabsModelId?: string;
    stability?: number;
    similarityBoost?: number;
    // Lemonfox options
    lemonfoxVoiceId?: string;
    speed?: number;
    pitch?: number;
    // Google Neural2 options
    googleVoiceName?: string;  // override e.g. 'pt-BR-Neural2-A'
    speakingRate?: number;     // 0.25–4.0
}

export type TTSProvider = 'elevenlabs' | 'lemonfox' | 'google' | 'google-neural2' | 'web';

/**
 * Main TTS function - uses ElevenLabs, Lemonfox, or Web Speech based on config
 */
export async function speak(options: TTSOptions): Promise<void> {
    const { text, elevenLabsVoiceId, lemonfoxVoiceId } = options;
    
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
            console.warn('ElevenLabs failed, trying Lemonfox:', error);
        }
    }

    // Try Lemonfox if voice ID is provided
    if (lemonfoxVoiceId) {
        try {
            console.log('Using Lemonfox TTS');
            await speakWithLemonfox(options);
            return;
        } catch (error) {
            console.warn('Lemonfox failed, falling back to Web Speech:', error);
        }
    }
    
    // Fallback to Web Speech API
    console.log('Using Web Speech API');
    await speakWithWebSpeech(options);
}

/**
 * Speak text using Google Cloud TTS Neural2 — high quality, 1M chars/month free
 * Voices: pt-BR-Neural2-C (F), pt-BR-Neural2-B (M), en-US-Neural2-C (F), en-US-Neural2-D (M)
 */
export async function speakWithGoogleTTS(options: TTSOptions): Promise<void> {
    const {
        text,
        language = 'pt-BR',
        preferFemale,
        googleVoiceName,
        speakingRate = 0.95,
        pitch = 0,
    } = options;

    try {
        const response = await fetch('/api/google-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                language,
                voiceName: googleVoiceName,
                preferMale: preferFemale === false,
                speakingRate,
                pitch,
            }),
        });

        if (!response.ok) {
            throw new Error(`Google TTS API error: ${response.status}`);
        }

        const data = await response.json();
        const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        return new Promise((resolve, reject) => {
            audio.onended = () => { URL.revokeObjectURL(audioUrl); resolve(); };
            audio.onerror = reject;
            audio.play();
        });
    } catch (error) {
        console.error('Google TTS error:', error);
        throw error;
    }
}

/**
 * Speak text using Lemonfox TTS (high quality, good value)
 */
export async function speakWithLemonfox(options: TTSOptions): Promise<void> {
    const { 
        text, 
        lemonfoxVoiceId = 'fernanda',
        speed = 1.0,
        pitch = 1.0,
    } = options;

    try {
        const response = await fetch('/api/lemonfox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                voiceId: lemonfoxVoiceId,
                language: options.language,
                speed,
                pitch,
            }),
        });

        if (!response.ok) {
            throw new Error('Lemonfox API failed');
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
        console.error('Lemonfox TTS error:', error);
        throw error;
    }
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
 * Web Speech API — uses browser native voices (Chrome has 'Google português do Brasil')
 */
export async function speakWithWebSpeech(options: TTSOptions): Promise<void> {
    const { text, language = 'pt-BR', preferFemale } = options;

    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('Web Speech API not available');
        throw new Error('Web Speech API not supported');
    }

    // Pick the best available voice for this language
    const pickVoice = (): SpeechSynthesisVoice | null => {
        const voices = window.speechSynthesis.getVoices();
        const lang = language.toLowerCase().replace('_', '-');
        // Prefer exact locale match, then partial match
        const matches = voices.filter(v => v.lang.toLowerCase().startsWith(lang.substring(0, 5)));
        if (matches.length === 0) return null;
        // Prefer Google voices (highest quality in Chrome)
        const google = matches.filter(v => v.name.toLowerCase().includes('google'));
        const pool = google.length > 0 ? google : matches;
        if (preferFemale === true)  return pool.find(v => /female|feminina|feminin/i.test(v.name)) ?? pool[0];
        if (preferFemale === false) return pool.find(v => /male|masculino|masculo/i.test(v.name)) ?? pool[0];
        return pool[0];
    };

    return new Promise((resolve, reject) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Voices may not be loaded yet — wait up to 300 ms
        const applyVoice = () => {
            const voice = pickVoice();
            if (voice) {
                utterance.voice = voice;
                console.log(`[WebSpeech] using voice: ${voice.name} (${voice.lang})`);
            } else {
                console.warn(`[WebSpeech] no native voice found for ${language}, browser will pick default`);
            }
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            applyVoice();
        } else {
            window.speechSynthesis.onvoiceschanged = () => { applyVoice(); window.speechSynthesis.onvoiceschanged = null; };
        }

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Web Speech error: ${event.error}`));

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
