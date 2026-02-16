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

            recognition.onstart = () => {
                console.log('🎤 Recording started');
                setIsRecording(true);
                startTimeRef.current = Date.now();
                durationIntervalRef.current = setInterval(() => {
                    setRecordingDuration(Date.now() - startTimeRef.current);
                }, 100);
            };

            recognition.onresult = (event) => {
                let transcript = '';
                for (let i = 0; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                if (transcript) {
                    finalTranscriptRef.current = transcript;
                    setCurrentTranscript(transcript);
                }
            };

            recognition.onerror = (event) => {
                console.error('❌ Speech error:', event.error);
                cleanup();
            };

            recognition.onend = () => {
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

            const finalText = finalTranscriptRef.current.trim();
            
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error('Error stopping:', error);
            }
            
            cleanup();
            resolve(finalText || null);
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