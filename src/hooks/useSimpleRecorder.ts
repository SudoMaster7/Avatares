import { useState, useCallback, useRef } from 'react';
import { transcribeAudio, isTranscriptionAvailable, getTranscriptionInfo } from '@/services/transcription';

export interface UseSimpleRecorderResult {
    isRecording: boolean;
    isTranscribing: boolean;
    recordingDuration: number;
    currentTranscript: string;
    startRecording: (deviceId?: string) => Promise<void>;
    stopRecording: () => Promise<string | null>;
    cancelRecording: () => void;
    isAvailable: boolean;
    serviceInfo: string;
}

export function useSimpleRecorder(): UseSimpleRecorderResult {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentTranscript, setCurrentTranscript] = useState('');

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const deviceIdRef = useRef<string | undefined>();
    const transcriptionRef = useRef<string>('');

    const startRecording = useCallback(async (deviceId?: string) => {
        if (isRecording) return;
        
        if (!isTranscriptionAvailable()) {
            throw new Error('Transcrição não disponível neste navegador. Use Chrome, Firefox ou Safari.');
        }

        try {
            console.log('Starting recording with device:', deviceId);
            deviceIdRef.current = deviceId;
            transcriptionRef.current = '';

            // Request permission for specific device if provided
            if (deviceId && navigator.mediaDevices) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: { deviceId: { exact: deviceId } }
                    });
                    // Close stream immediately as Web Speech API manages its own audio
                    stream.getTracks().forEach(track => track.stop());
                } catch (error) {
                    throw new Error('Erro ao acessar o microfone selecionado. Tente outro dispositivo.');
                }
            }

            // Create Web Speech Recognition instance
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                console.log('Recording started successfully');
                setIsRecording(true);
                startTimeRef.current = Date.now();

                // Update duration every 100ms
                durationIntervalRef.current = setInterval(() => {
                    setRecordingDuration(Date.now() - startTimeRef.current);
                }, 100);
            };

            recognition.onresult = (event) => {
                console.log('Speech recognition result received:', event);
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const currentTranscript = finalTranscript || interimTranscript;
                transcriptionRef.current = currentTranscript;
                setCurrentTranscript(currentTranscript);
                console.log('Current transcription updated:', currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error('Recording error:', event.error);
                cleanup();
                
                let errorMessage = 'Erro na gravação';
                switch (event.error) {
                    case 'not-allowed':
                        errorMessage = 'Permissão de microfone negada. Permita acesso ao microfone.';
                        break;
                    case 'no-speech':
                        errorMessage = 'Nenhuma fala detectada. Fale após iniciar a gravação.';
                        break;
                    case 'network':
                        errorMessage = 'Erro de conexão. Verifique sua internet.';
                        break;
                    case 'aborted':
                        errorMessage = 'Gravação foi interrompida.';
                        break;
                }
                
                console.error('Speech recognition error:', errorMessage);
                // Don't throw here, just log the error
            };

            recognition.onend = () => {
                console.log('Speech recognition ended');
                setIsRecording(false);
            };

            recognition.start();
        } catch (error) {
            cleanup();
            console.error('Failed to start recording:', error);
            throw error;
        }
    }, [isRecording]);

    const stopRecording = useCallback(async (): Promise<string | null> => {
        if (!isRecording || !recognitionRef.current) {
            console.log('No active recording to stop');
            return null;
        }

        return new Promise((resolve) => {
            const recognition = recognitionRef.current;
            if (!recognition) {
                cleanup();
                resolve(null);
                return;
            }

            console.log('Stopping recording...');
            setIsTranscribing(true);

            // Set up the end handler before stopping
            recognition.onend = () => {
                console.log('Recognition ended, cleaning up...');
                
                // Capture the text BEFORE cleanup
                const finalText = transcriptionRef.current ? transcriptionRef.current.trim() : '';
                console.log('Final transcription:', finalText);
                
                cleanup();
                resolve(finalText || null);
            };

            // Stop the recognition after a short delay to get final results
            setTimeout(() => {
                recognition.stop();
            }, 300);
        });
    }, [isRecording]);

    const cancelRecording = useCallback(() => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
        }
        cleanup();
    }, [isRecording]);

    const cleanup = useCallback(() => {
        // Stop duration timer
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        // Reset state
        setIsRecording(false);
        setIsTranscribing(false);
        setRecordingDuration(0);
        setCurrentTranscript('');
        recognitionRef.current = null;
        deviceIdRef.current = undefined;
        transcriptionRef.current = '';
    }, []);

    return {
        isRecording,
        isTranscribing,
        recordingDuration,
        currentTranscript,
        startRecording,
        stopRecording,
        cancelRecording,
        isAvailable: isTranscriptionAvailable(),
        serviceInfo: getTranscriptionInfo(),
    };
}