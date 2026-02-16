// Web Speech API type declarations
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }

    interface SpeechRecognition extends EventTarget {
        continuous: boolean;
        interimResults: boolean;
        lang: string;
        maxAlternatives: number;
        start(): void;
        stop(): void;
        addEventListener<K extends keyof SpeechRecognitionEventMap>(
            type: K,
            listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
    }

    interface SpeechRecognitionEventMap {
        result: SpeechRecognitionEvent;
        error: SpeechRecognitionErrorEvent;
        start: Event;
        end: Event;
    }

    interface SpeechRecognitionEvent extends Event {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent extends Event {
        error: string;
    }

    interface SpeechRecognitionResultList {
        readonly length: number;
        item(index: number): SpeechRecognitionResult;
        [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionResult {
        readonly length: number;
        item(index: number): SpeechRecognitionAlternative;
        [index: number]: SpeechRecognitionAlternative;
        readonly isFinal: boolean;
    }

    interface SpeechRecognitionAlternative {
        readonly transcript: string;
        readonly confidence: number;
    }

    const SpeechRecognition: {
        prototype: SpeechRecognition;
        new(): SpeechRecognition;
    };
}

export {};