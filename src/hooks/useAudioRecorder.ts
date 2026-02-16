import { useState, useRef, useCallback } from 'react';

export interface UseAudioRecorderResult {
    isRecording: boolean;
    isTranscribing: boolean;
    recordingDuration: number;
    startRecording: (deviceId?: string) => Promise<void>;
    stopRecording: () => Promise<string | null>;
    cancelRecording: () => void;
    audioBlob: Blob | null;
}

export function useAudioRecorder(): UseAudioRecorderResult {
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
    const transcriptionRef = useRef<string>('');

    const startRecording = useCallback(async (deviceId?: string) => {
        try {
            // Check if we're in the browser environment
            if (typeof window === 'undefined') {
                throw new Error('Speech Recognition só está disponível no navegador.');
            }

            // Check if browser supports Speech Recognition
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            if (!SpeechRecognition) {
                throw new Error('Speech Recognition não é suportado neste navegador. Use Chrome, Firefox ou Safari.');
            }

            // Request permission for specific device if provided
            if (deviceId && navigator?.mediaDevices) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: { deviceId: { exact: deviceId } }
                    });
                    // Close the stream immediately as we just needed to test the device
                    stream.getTracks().forEach(track => track.stop());
                } catch (error) {
                    console.error('Error accessing specified microphone:', error);
                    throw new Error('Erro ao acessar o microfone selecionado. Tente outro dispositivo.');
                }
            }

            // Create recognition instance
            const recognition = new SpeechRecognition();
            recognitionRef.current = recognition;
            transcriptionRef.current = '';

            // Configure recognition
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';
            recognition.maxAlternatives = 1;

            // Handle results
            recognition.onresult = (event) => {
                console.log('Speech recognition result:', event);
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    console.log(`Result ${i}: ${transcript} (final: ${event.results[i].isFinal})`);
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                const currentTranscript = finalTranscript || interimTranscript;
                transcriptionRef.current = currentTranscript;
                console.log('Current transcription:', currentTranscript);
            };

            // Handle errors
            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error, event);
                setIsRecording(false);
                setIsTranscribing(false);
                
                let errorMessage = 'Erro na gravação. Tente novamente.';
                
                if (event.error === 'no-speech') {
                    errorMessage = 'Nenhum áudio detectado. Tente falar mais alto.';
                } else if (event.error === 'not-allowed') {
                    errorMessage = 'Permissão de microfone negada. Permita acesso ao microfone.';
                } else if (event.error === 'network') {
                    errorMessage = 'Erro de rede. Verifique sua conexão.';
                } else if (event.error === 'aborted') {
                    errorMessage = 'Gravação cancelada.';
                }
                
                transcriptionRef.current = errorMessage;
            };

            // Add event handlers for better debugging
            recognition.onstart = () => {
                console.log('Speech recognition started');
                setIsRecording(true);
            };

            recognition.onend = () => {
                console.log('Speech recognition ended');
                if (isRecording) {
                    setIsRecording(false);
                }
            };

            // Start recognition
            console.log('Starting speech recognition...');
            recognition.start();
            startTimeRef.current = Date.now();

            // Update duration every 100ms
            durationIntervalRef.current = setInterval(() => {
                setRecordingDuration(Date.now() - startTimeRef.current);
            }, 100);

        } catch (error) {
            console.error('Error starting recording:', error);
            throw error;
        }
    }, []);

    const stopRecording = useCallback(async (): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!recognitionRef.current || !isRecording) {
                resolve(null);
                return;
            }

            const recognition = recognitionRef.current;

            recognition.onend = () => {
                cleanup();
                setIsTranscribing(false);
                
                const finalText = transcriptionRef.current.trim();
                resolve(finalText || null);
            };

            // Simulate transcribing state for better UX
            setIsTranscribing(true);
            
            // Stop recognition after a short delay to get final results
            setTimeout(() => {
                recognition.stop();
            }, 500);
        });
    }, [isRecording]);

    const cancelRecording = useCallback(() => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            cleanup();
        }
    }, [isRecording]);

    const cleanup = useCallback(() => {
        // Stop duration timer
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }

        // Reset state
        setIsRecording(false);
        setRecordingDuration(0);
        recognitionRef.current = null;
        transcriptionRef.current = '';
    }, []);

    return {
        isRecording,
        isTranscribing,
        recordingDuration,
        startRecording,
        stopRecording,
        cancelRecording,
        audioBlob,
    };
}