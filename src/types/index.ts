// Database Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

// Web Speech API Types
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
        onresult: ((event: SpeechRecognitionEvent) => void) | null;
        onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
        onend: (() => void) | null;
    }

    interface SpeechRecognitionEvent {
        resultIndex: number;
        results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionErrorEvent {
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
        isFinal: boolean;
    }

    interface SpeechRecognitionAlternative {
        transcript: string;
        confidence: number;
    }

    const SpeechRecognition: {
        prototype: SpeechRecognition;
        new(): SpeechRecognition;
    };
}

export interface StudentProfile {
    id: string;
    userId: string;
    gradeLevel: string;
    preferredLanguage: string;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TeacherProfile {
    id: string;
    userId: string;
    subjects: string[];
    schoolName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Avatar {
    id: string;
    name: string;
    type: 'teacher' | 'tutor' | 'historical' | 'cultural';
    subject?: string;
    language: string;
    personalityPrompt: string;
    voiceId?: string;
    avatarModelUrl?: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
}

export interface Scenario {
    id: string;
    title: string;
    description?: string;
    subject: string;
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    language: string;
    avatarId: string;
    learningObjectives: string[];
    contextPrompt: string;
    estimatedDurationMinutes?: number;
    isActive: boolean;
    createdAt: Date;
}

export interface Conversation {
    id: string;
    studentId: string;
    avatarId: string;
    scenarioId?: string;
    startedAt: Date;
    endedAt?: Date;
    durationSeconds?: number;
    totalMessages: number;
    status: 'active' | 'completed' | 'abandoned';
}

export interface Message {
    id: string;
    conversationId: string;
    senderType: 'student' | 'avatar';
    content: string;
    audioUrl?: string;
    transcription?: string;
    language?: string;
    createdAt: Date;
}

export interface Assessment {
    id: string;
    conversationId: string;
    studentId: string;
    scenarioId?: string;
    participationScore?: number;
    fluencyScore?: number;
    comprehensionScore?: number;
    vocabularyScore?: number;
    overallScore?: number;
    totalWordsSpoken?: number;
    avgResponseTimeSeconds?: number;
    grammarErrorsCount?: number;
    aiFeedback?: string;
    strengths?: string[];
    areasForImprovement?: string[];
    createdAt: Date;
}

export interface StudentProgress {
    id: string;
    studentId: string;
    subject: string;
    language?: string;
    level?: string;
    totalConversations: number;
    totalTimeMinutes: number;
    averageScore?: number;
    lastActivityAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface Achievement {
    id: string;
    name: string;
    description?: string;
    iconUrl?: string;
    points: number;
    criteria: Record<string, any>;
    createdAt: Date;
}

export interface StudentAchievement {
    id: string;
    studentId: string;
    achievementId: string;
    unlockedAt: Date;
}

// API Response Types
export interface ConversationResponse {
    text: string;
    audioUrl?: string;
    emotion?: string;
    suggestions?: string[];
}

export interface TranscriptionResult {
    text: string;
    confidence: number;
    language?: string;
}

export interface TTSResult {
    audioUrl: string;
    duration: number;
}

export interface AssessmentResult extends Assessment {
    avatar: Avatar;
    scenario?: Scenario;
}
