import { useState, useRef, useCallback } from 'react';

export interface UseSimpleRecorderResult {
    isRecording: boolean;
    recordingDuration: number;
    currentTranscript: string;
    startRecording: () => void;
    stopRecording: () => Promise<string | null>;
    isSupported: boolean;
}

export function useSimpleRecorder(): UseSimpleRecorderResult {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentTranscript, setCurrentTranscript] = useState('');
    
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const transcriptRef = useRef<string>('');
    const startTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isSupported = typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    const cleanup = useCallback(() => {
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        setIsRecording(false);
        setRecordingDuration(0);
    }, []);

    const startRecording = useCallback(() => {
        if (!isSupported || isRecording) return;

        // Reset transcript
        transcriptRef.current = '';
        setCurrentTranscript('');
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            // Configure recognition
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';
            recognition.maxAlternatives = 1;

            recognition.addEventListener('start', () => {
                console.log('Recording started successfully');
                setIsRecording(true);
                startTimeRef.current = Date.now();

                // Update duration every 100ms
                durationIntervalRef.current = setInterval(() => {
                    setRecordingDuration(Date.now() - startTimeRef.current);
                }, 100);
            });

            recognition.addEventListener('result', (event) => {
                const speechEvent = event as unknown as SpeechRecognitionEvent;
                let currentTranscript = '';
                
                // Collect all results
                for (let i = 0; i < speechEvent.results.length; i++) {
                    const result = speechEvent.results[i][0];
                    currentTranscript += result.transcript;
                }

                // Update current transcript state for real-time display
                setCurrentTranscript(currentTranscript);
                
                // Store in ref for final result
                transcriptRef.current = currentTranscript;
                
                console.log('Real-time transcript:', currentTranscript);
            });

            recognition.addEventListener('error', (event) => {
                const errorEvent = event as unknown as SpeechRecognitionErrorEvent;
                console.error('Speech recognition error:', errorEvent.error);
                
                cleanup();
                
                let errorMessage = 'Erro na transcrição. Tente novamente.';
                
                if (errorEvent.error === 'no-speech') {
                    errorMessage = 'Nenhuma fala detectada. Tente falar mais alto.';
                } else if (errorEvent.error === 'not-allowed') {
                    errorMessage = 'Permissão negada. Permita acesso ao microfone.';
                } else if (errorEvent.error === 'network') {
                    errorMessage = 'Erro de conexão. Verifique sua internet.';
                }
                
                // Show error temporarily
                setCurrentTranscript(errorMessage);
                setTimeout(() => setCurrentTranscript(''), 3000);
            });

            recognition.addEventListener('end', () => {
                console.log('Speech recognition ended');
                cleanup();
            });

            recognitionRef.current = recognition;
            recognition.start();
            
        } catch (error) {
            console.error('Failed to start recording:', error);
            cleanup();
        }
    }, [isSupported, isRecording, cleanup]);

    const stopRecording = useCallback((): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!recognitionRef.current || !isRecording) {
                resolve(null);
                return;
            }

            // Capture current transcript BEFORE stopping
            const finalTranscript = transcriptRef.current.trim();
            console.log('Stopping recording, captured transcript:', finalTranscript);

            const recognition = recognitionRef.current;

            recognition.addEventListener('end', () => {
                console.log('Speech recognition ended, final transcript:', finalTranscript);
                cleanup();
                
                // Resolve with the captured transcript
                resolve(finalTranscript || null);
            });

            try {
                recognition.stop();
            } catch (error) {
                console.error('Error stopping recognition:', error);
                cleanup();
                resolve(finalTranscript || null);
            }
        });
    }, [isRecording, cleanup]);

    return {
        isRecording,
        recordingDuration,
        currentTranscript,
        startRecording,
        stopRecording,
        isSupported,
    };
}