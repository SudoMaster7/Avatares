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
    const finalTranscriptRef = useRef<string>('');
    const startTimeRef = useRef<number>(0);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isSupported = typeof window !== 'undefined' && 
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    const cleanup = useCallback(() => {
        // Clear interval
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        
        // Remove event listeners and cleanup recognition
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) {
                // Ignore errors during cleanup
            }
            recognitionRef.current = null;
        }
        
        setIsRecording(false);
        setRecordingDuration(0);
    }, []);

    const startRecording = useCallback(() => {
        if (!isSupported || isRecording) return;

        // Clean up any existing recognition first
        cleanup();

        // Reset transcript
        finalTranscriptRef.current = '';
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
                console.log('🎤 Recording started');
                setIsRecording(true);
                startTimeRef.current = Date.now();

                // Update duration every 100ms
                durationIntervalRef.current = setInterval(() => {
                    setRecordingDuration(Date.now() - startTimeRef.current);
                }, 100);
            });

            recognition.addEventListener('result', (event) => {
                const speechEvent = event as unknown as SpeechRecognitionEvent;
                let finalTranscript = '';
                let interimTranscript = '';
                
                // Separate final and interim results to avoid duplication
                for (let i = 0; i < speechEvent.results.length; i++) {
                    const transcript = speechEvent.results[i][0].transcript;
                    if (speechEvent.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Store only final transcript in ref
                if (finalTranscript) {
                    finalTranscriptRef.current = finalTranscript;
                    console.log('✅ Final transcript:', finalTranscript);
                }

                // Show final + interim for real-time feedback
                const displayTranscript = (finalTranscriptRef.current + interimTranscript).trim();
                setCurrentTranscript(displayTranscript);
            });

            recognition.addEventListener('error', (event) => {
                const errorEvent = event as unknown as SpeechRecognitionErrorEvent;
                console.error('❌ Speech error:', errorEvent.error);
                
                let errorMessage = 'Erro na transcrição';
                if (errorEvent.error === 'no-speech') {
                    errorMessage = 'Nenhuma fala detectada';
                } else if (errorEvent.error === 'not-allowed') {
                    errorMessage = 'Permissão negada';
                } else if (errorEvent.error === 'network') {
                    errorMessage = 'Erro de conexão';
                }
                
                setCurrentTranscript(errorMessage);
                setTimeout(cleanup, 2000);
            });

            recognition.addEventListener('end', () => {
                console.log('🛑 Recording ended');
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                }
                setIsRecording(false);
                setRecordingDuration(0);
            });

            recognitionRef.current = recognition;
            recognition.start();
            
        } catch (error) {
            console.error('❌ Failed to start recording:', error);
            cleanup();
        }
    }, [isSupported, isRecording, cleanup]);

    const stopRecording = useCallback((): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!recognitionRef.current || !isRecording) {
                resolve(null);
                return;
            }

            const recognition = recognitionRef.current;
            
            // Give a moment for final results then stop
            setTimeout(() => {
                const finalText = finalTranscriptRef.current.trim();
                console.log('📝 Stopping - Final text:', finalText);
                
                try {
                    recognition.stop();
                } catch (error) {
                    console.error('Error stopping recognition:', error);
                }
                
                // Clean up and resolve
                cleanup();
                setCurrentTranscript(''); // Clear display
                resolve(finalText || null);
            }, 300);
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