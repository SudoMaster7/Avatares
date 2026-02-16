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
        if (!isSupported) {
            console.error('❌ Browser does not support speech recognition');
            return;
        }
        
        if (isRecording) {
            console.warn('⚠️ Already recording');
            return;
        }

        // Clean up any existing recognition first
        cleanup();

        // Reset transcript
        finalTranscriptRef.current = '';
        setCurrentTranscript('');
        
        console.log('🚀 Starting speech recognition...');
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            // Configure recognition for longer, more reliable recording
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';
            recognition.maxAlternatives = 1;
            
            // Add longer timeout for mobile devices
            if ('webkitSpeechRecognition' in window) {
                // Chrome/Safari mobile - give more time
                (recognition as any).serviceURI = null; // Let browser decide
            }

            recognition.addEventListener('start', () => {
                console.log('🎤 Recording started successfully');
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
                    console.log('✅ Final transcript updated:', finalTranscript);
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
                    errorMessage = 'Permissão de microfone negada';
                } else if (errorEvent.error === 'network') {
                    errorMessage = 'Erro de conexão';
                }
                
                setCurrentTranscript(errorMessage);
                // Don't immediately cleanup on mobile - wait longer
                setTimeout(() => {
                    if (errorEvent.error !== 'aborted') { // Don't cleanup if user manually stopped
                        cleanup();
                        setCurrentTranscript('');
                    }
                }, 5000); // Increased from 3000ms to 5000ms
            });

            recognition.addEventListener('end', () => {
                console.log('🛑 Recognition ended naturally');
                if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                }
                setIsRecording(false);
                setRecordingDuration(0);
            });

            recognitionRef.current = recognition;
            
            // Start immediately without delay for better user experience
            try {
                recognition.start();
                console.log('🚀 Recognition started immediately');
            } catch (startError) {
                console.error('❌ Error starting recognition:', startError);
                // Try once more after a tiny delay
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (retryError) {
                        console.error('❌ Retry failed:', retryError);
                        cleanup();
                    }
                }, 50);
            }
            
        } catch (error) {
            console.error('❌ Failed to create speech recognition:', error);
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
            let resolved = false;
            
            // Set up event listener for when recognition actually ends
            const onEnd = () => {
                if (resolved) return;
                resolved = true;
                
                const finalText = finalTranscriptRef.current.trim();
                console.log('🏁 Recognition ended - Final text:', finalText);
                
                cleanup();
                setCurrentTranscript(''); // Clear display
                resolve(finalText || null);
            };
            
            recognition.addEventListener('end', onEnd, { once: true });
            
            try {
                // Give much more time for final results to come in before stopping
                setTimeout(() => {
                    const finalText = finalTranscriptRef.current.trim();
                    console.log('📝 Stopping - Final text before stop:', finalText);
                    
                    if (finalText && finalText.length > 3) {
                        // We have substantial text, stop soon
                        setTimeout(() => recognition.stop(), 500);
                    } else {
                        // Wait much longer for results, then force stop
                        setTimeout(() => recognition.stop(), 2000);
                    }
                }, 1500); // Increased from 800ms to 1.5s
                
                // Much longer safety timeout
                setTimeout(() => {
                    if (!resolved) {
                        console.log('⏰ Safety timeout triggered after 8 seconds');
                        onEnd();
                    }
                }, 8000); // Increased from 3s to 8s
                
            } catch (error) {
                console.error('Error stopping recognition:', error);
                if (!resolved) {
                    onEnd();
                }
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