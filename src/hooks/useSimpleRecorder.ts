import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseSimpleRecorderResult {
    isRecording: boolean;
    recordingDuration: number;
    currentTranscript: string;
    startRecording: () => void;
    stopRecording: () => Promise<string | null>;
    isSupported: boolean;
}

export function useSimpleRecorder(): UseSimpleRecorderResult {
    const [isRecording, setIsRecording]       = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentTranscript, setCurrentTranscript] = useState('');

    const recognitionRef      = useRef<SpeechRecognition | null>(null);
    const finalTranscriptRef  = useRef<string>('');
    const startTimeRef        = useRef<number>(0);
    const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /** true while the user wants recording to stay active */
    const shouldBeRecordingRef = useRef(false);
    /** resolve callback for the stopRecording() promise */
    const resolveStopRef = useRef<((text: string | null) => void) | null>(null);

    const isSupported =
        typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    // ── timer helpers ──────────────────────────────────────────────────────────

    const clearTimer = () => {
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
    };

    /** Full teardown — called only when recording is completely finished */
    const finalCleanup = useCallback(() => {
        clearTimer();
        recognitionRef.current = null;
        setIsRecording(false);
        setRecordingDuration(0);
    }, []);

    // ── build a fresh SpeechRecognition instance ───────────────────────────────

    // We need a stable ref to buildRecognition so onend can call it recursively
    const buildRef = useRef<() => SpeechRecognition | null>(() => null);

    buildRef.current = () => {
        if (!isSupported) return null;

        const SR =
            (window as typeof window & { SpeechRecognition?: typeof window.webkitSpeechRecognition })
                .SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return null;

        const rec = new SR();
        rec.continuous     = true;
        rec.interimResults = true;
        rec.lang           = 'pt-BR';

        rec.addEventListener('start', () => {
            console.log('🎤 Recognition started');
            setIsRecording(true);
            // Start the wall-clock timer only once per user-initiated recording
            if (!startTimeRef.current) {
                startTimeRef.current = Date.now();
                durationIntervalRef.current = setInterval(() => {
                    setRecordingDuration(Date.now() - startTimeRef.current);
                }, 100);
            }
        });

        rec.addEventListener('result', (event: SpeechRecognitionEvent) => {
            let allText = '', finalText = '';
            for (let i = 0; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                allText += t + ' ';
                if (event.results[i].isFinal) finalText += t + ' ';
            }
            const best = (finalText || allText).trim();
            if (best) {
                finalTranscriptRef.current = best;
                console.log('📝 Captured:', best);
            }
            setCurrentTranscript(allText.trim());
        });

        rec.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
            console.error('❌ Speech error:', event.error);
            // no-speech / aborted are non-fatal — onend will handle restart
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
                shouldBeRecordingRef.current = false;
            }
        });

        rec.addEventListener('end', () => {
            console.log('🛑 onend fired. shouldBeRecording:', shouldBeRecordingRef.current);

            if (shouldBeRecordingRef.current) {
                // Natural pause — restart to keep listening
                console.log('🔄 Auto-restarting...');
                setIsRecording(false); // brief; onstart will flip it back
                try {
                    const next = buildRef.current();
                    if (next) { recognitionRef.current = next; next.start(); }
                } catch (e) {
                    console.error('Restart failed:', e);
                    shouldBeRecordingRef.current = false;
                    finalCleanup();
                    resolveStopRef.current?.(finalTranscriptRef.current.trim() || null);
                    resolveStopRef.current = null;
                }
            } else {
                // stopRecording() was called — resolve the promise
                finalCleanup();
                const text = finalTranscriptRef.current.trim() || null;
                console.log('✅ Resolving stop with:', text);
                resolveStopRef.current?.(text);
                resolveStopRef.current = null;
            }
        });

        return rec;
    };

    // ── public API ─────────────────────────────────────────────────────────────

    const startRecording = useCallback(() => {
        if (!isSupported || shouldBeRecordingRef.current) return;

        finalTranscriptRef.current = '';
        startTimeRef.current       = 0;
        setCurrentTranscript('');
        shouldBeRecordingRef.current = true;

        try {
            const rec = buildRef.current();
            if (!rec) { shouldBeRecordingRef.current = false; return; }
            recognitionRef.current = rec;
            rec.start();
        } catch (err) {
            console.error('Failed to start recording:', err);
            shouldBeRecordingRef.current = false;
            finalCleanup();
        }
    }, [isSupported, finalCleanup]);

    const stopRecording = useCallback((): Promise<string | null> => {
        return new Promise((resolve) => {
            if (!shouldBeRecordingRef.current) {
                // Already stopped or never started — return whatever we captured
                resolve(finalTranscriptRef.current.trim() || null);
                return;
            }

            shouldBeRecordingRef.current = false;
            resolveStopRef.current       = resolve;

            try {
                recognitionRef.current?.stop();
            } catch (err) {
                console.error('Error stopping recognition:', err);
                // onend may not fire — resolve immediately
                finalCleanup();
                resolve(finalTranscriptRef.current.trim() || null);
                resolveStopRef.current = null;
            }
        });
    }, [finalCleanup]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            shouldBeRecordingRef.current = false;
            try { recognitionRef.current?.stop(); } catch { /* ignore */ }
            clearTimer();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { isRecording, recordingDuration, currentTranscript, startRecording, stopRecording, isSupported };
}