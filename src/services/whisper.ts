// Browser-based Speech-to-Text using Whisper (Transformers.js)
// Runs completely in the browser - NO API COSTS!

import { pipeline, AutomaticSpeechRecognitionPipeline } from '@xenova/transformers';

let transcriber: AutomaticSpeechRecognitionPipeline | null = null;

export interface TranscriptionOptions {
    language?: string;
    task?: 'transcribe' | 'translate';
}

export interface TranscriptionResult {
    text: string;
    chunks?: Array<{
        text: string;
        timestamp: [number, number];
    }>;
}

/**
 * Initialize the Whisper model (only needs to be called once)
 * Downloads ~75MB on first use, then cached in browser
 */
export async function initializeWhisper(): Promise<void> {
    if (transcriber) return;

    console.log('Loading Whisper model...');
    transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-small', // ~250MB, good balance
        // Alternative models:
        // 'Xenova/whisper-tiny' - ~75MB, faster but less accurate
        // 'Xenova/whisper-base' - ~150MB
        // 'Xenova/whisper-medium' - ~1.5GB, best quality but slow
    );
    console.log('Whisper model loaded!');
}

/**
 * Transcribe audio from various sources
 * @param audio - Can be: Blob, File, ArrayBuffer, or URL
 * @param options - Transcription options
 */
export async function transcribeAudio(
    audio: Blob | File | ArrayBuffer | string,
    options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
    if (!transcriber) {
        await initializeWhisper();
    }

    const {
        language = 'portuguese',
        task = 'transcribe',
    } = options;

    try {
        const result = await transcriber!(audio as any, {
            language,
            task,
            chunk_length_s: 30,
            stride_length_s: 5,
            return_timestamps: true,
        });

        const singleResult = Array.isArray(result) ? result[0] : (result as any);

        return {
            text: singleResult?.text || '',
            chunks: singleResult?.chunks || [],
        };
    } catch (error) {
        console.error('Error transcribing audio:', error);
        throw new Error('Failed to transcribe audio');
    }
}

/**
 * Transcribe from microphone stream (real-time)
 * Returns a stream of transcription results
 */
export async function* transcribeStream(
    stream: MediaStream,
    options: TranscriptionOptions = {}
): AsyncGenerator<string> {
    if (!transcriber) {
        await initializeWhisper();
    }

    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    // Record in 3-second chunks
    mediaRecorder.start(3000);

    while (mediaRecorder.state !== 'inactive') {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            audioChunks.length = 0; // Clear chunks

            try {
                const result = await transcribeAudio(audioBlob, options);
                if (result.text.trim()) {
                    yield result.text;
                }
            } catch (error) {
                console.error('Error in stream transcription:', error);
            }
        }
    }
}

/**
 * Get microphone stream
 */
export async function getMicrophoneStream(): Promise<MediaStream> {
    try {
        return await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw new Error('Failed to access microphone');
    }
}

// Language codes mapping
export const SUPPORTED_LANGUAGES = {
    'pt-BR': 'portuguese',
    'en': 'english',
    'es': 'spanish',
    'fr': 'french',
    'de': 'german',
    'it': 'italian',
    'ja': 'japanese',
    'ko': 'korean',
    'zh': 'chinese',
} as const;
