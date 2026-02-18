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
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
        if (recognitionRef.current) {
            recognitionRef.current = null;
        }
        setIsRecording(false);
        setRecordingDuration(0);
    }, []);

    const startRecording = useCallback(() => {
        if (!isSupported || isRecording) return;

        finalTranscriptRef.current = '';
        setCurrentTranscript('');
        
        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'pt-BR';

            (recognition as any).onstart = () => {
                console.log('🎤 Recording started');
                setIsRecording(true);
                startTimeRef.current = Date.now();
                durationIntervalRef.current = setInterval(() => {
                    setRecordingDuration(Date.now() - startTimeRef.current);
                }, 100);
            };

            (recognition as any).onresult = (event: any) => {
                console.log('🎯 Speech result:', event.results.length, 'results');
                
                let allText = '';
                let finalText = '';
                
                // Capture ALL text (final + interim)
                for (let i = 0; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    allText += transcript + ' ';
                    
                    if (event.results[i].isFinal) {
                        finalText += transcript + ' ';
                        console.log('✅ Final:', transcript);
                    } else {
                        console.log('🔄 Interim:', transcript);
                    }
                }
                
                // Always save something - prefer final, fallback to all
                if (finalText.trim()) {
                    finalTranscriptRef.current = finalText.trim();
                    console.log('📝 Saved final text:', finalText.trim());
                } else if (allText.trim()) {
                    finalTranscriptRef.current = allText.trim();
                    console.log('📝 Saved interim text:', allText.trim());
                }
                
                // Update display
                setCurrentTranscript(allText.trim());
            };

            (recognition as any).onerror = (event: any) => {
                console.error('\u274C Speech error:', event.error);
                cleanup();
            };

            (recognition as any).onend = () => {
                console.log('🛑 Recording ended');
                cleanup();
            };

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

            // Capture text BEFORE any cleanup
            let finalText = finalTranscriptRef.current.trim();
            
            // If no final text, try to get from current transcript
            if (!finalText && currentTranscript) {
                finalText = currentTranscript.trim();
                console.log('📝 Using current transcript as fallback:', finalText);
            }
            
            console.log('📝 Text captured before stop:', finalText);
            
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Error stopping:', error);
            }
            
            // Clean up AFTER capturing text
            cleanup();
            resolve(finalText || null);
        });
    }, [isRecording, cleanup, currentTranscript]);

    return {
        isRecording,
        recordingDuration,
        currentTranscript,
        startRecording,
        stopRecording,
        isSupported,
    };
}