/**
 * Transcription service with fallback options
 * Supports Web Speech API and Whisper API
 */

export interface TranscriptionResult {
    text: string;
    confidence?: number;
    method: 'webspeech' | 'whisper' | 'error';
}

// Check if transcription is available
export function isTranscriptionAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognition;
}

// Get transcription service info
export function getTranscriptionInfo(): string {
    if (typeof window === 'undefined') {
        return 'Transcrição não disponível no servidor';
    }
    
    if (window.SpeechRecognition) {
        return 'Web Speech API (Nativa)';
    } else if (window.webkitSpeechRecognition) {
        return 'Web Speech API (WebKit)';
    } else {
        return 'Transcrição não suportada neste navegador';
    }
}