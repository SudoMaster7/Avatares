/**
 * SUDO Education – Plan Types & Feature Gates
 * Single source-of-truth for Guest, Free, and Pro limits.
 * Now uses token-based system instead of simple message counts.
 */

import { TOKEN_LIMITS, MODEL_CONFIG, type PlanTier } from '@/lib/tokens';

// ─────────────────────────────────────────────────────────
// Core type (extended to include guest)
// ─────────────────────────────────────────────────────────

export type PlanType = 'free' | 'pro';
export type { PlanTier }; // Re-export for convenience

// ─────────────────────────────────────────────────────────
// Plan limits (now references token system)
// ─────────────────────────────────────────────────────────

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free: {
        dailyTokens: TOKEN_LIMITS.free.dailyTokens,
        dailyMessages: 50,           // ~50 messages with token system
        maxAvatars: 3,               // Einstein, Da Vinci, Santos Dumont
        canCreateCustomAvatar: false,
        canAccessAllAvatars: false,
        quizAccess: 'basic',
        learningReports: false,
        exclusiveBadges: false,
        communityRanking: false,
        youtubeIntegration: 'limited',
        ttsType: 'lemonfox',         // Good quality TTS for free users
        modelQuality: 'basic',
    },
    pro: {
        dailyTokens: Infinity,
        dailyMessages: Infinity,
        maxAvatars: Infinity,
        canCreateCustomAvatar: true,
        canAccessAllAvatars: true,
        quizAccess: 'full',
        learningReports: true,
        exclusiveBadges: true,
        communityRanking: true,
        youtubeIntegration: 'full',
        ttsType: 'elevenlabs',       // Premium TTS for pro users
        modelQuality: 'premium',
    },
};

export interface PlanLimits {
    dailyTokens: number;
    dailyMessages: number;
    maxAvatars: number;
    canCreateCustomAvatar: boolean;
    canAccessAllAvatars: boolean;
    quizAccess: 'basic' | 'full';
    learningReports: boolean;
    exclusiveBadges: boolean;
    communityRanking: boolean;
    youtubeIntegration: 'limited' | 'full';
    ttsType: 'google' | 'elevenlabs' | 'lemonfox';
    modelQuality: 'basic' | 'premium';
}

// ─────────────────────────────────────────────────────────
// Free-tier fixed avatars (Vila do Saber stars)
// ─────────────────────────────────────────────────────────

export const FREE_AVATAR_IDS: readonly string[] = [
    'prof-matematica',
    'tutor-ingles',
    'dom-pedro-ii',
] as const;

// ─────────────────────────────────────────────────────────
// Plan display names & pricing
// ─────────────────────────────────────────────────────────

export interface PlanInfo {
    id: PlanType;
    label: string;
    description: string;
    priceMonthly: number;   // BRL
    priceAnnual: number;    // BRL / month equivalent
    stripePriceIdMonthly: string;
    stripePriceIdAnnual: string;
    features: string[];
    badgeColor: string;
}

export const PLANS: PlanInfo[] = [
    {
        id: 'free',
        label: 'Grátis',
        description: 'Comece sua jornada na Vila do Saber',
        priceMonthly: 0,
        priceAnnual: 0,
        stripePriceIdMonthly: '',
        stripePriceIdAnnual: '',
        features: [
            '3 personagens (Prof. de Matemática, Tutor de Inglês, Dom Pedro II)',
            '50 tokens/dia (~50 mensagens)',
            'Quizzes básicos',
            'Voz Google TTS (qualidade padrão)',
            'Modelo de IA básico (respostas simples)',
            'Integração limitada com vídeos da Vila do Saber',
        ],
        badgeColor: '#6B7280',
    },
    {
        id: 'pro',
        label: 'Pro',
        description: 'Aprendizado ilimitado para toda a família',
        priceMonthly: 29.9,
        priceAnnual: 19.9, // ~33% off
        stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? '',
        stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? '',
        features: [
            'Todos os personagens da biblioteca (Tesla, Marie Curie, LeBron James e mais)',
            '✨ Tokens ilimitados',
            '✨ Modelo de IA avançado (respostas detalhadas e personalizadas)',
            '✨ Voz ElevenLabs (qualidade premium, super realista)',
            'Criação de avatares personalizados',
            'Quizzes completos e avançados',
            'Relatórios de progresso por e-mail para os pais',
            'Medalhas exclusivas e Ranking da Comunidade Aprender',
            'Integração completa com a Vila do Saber',
        ],
        badgeColor: '#F59E0B',
    },
];

// ─────────────────────────────────────────────────────────
// Feature gate helpers (used app-wide)
// ─────────────────────────────────────────────────────────

export function canUseAvatar(plan: PlanType, avatarId: string): boolean {
    if (plan === 'pro') return true;
    return FREE_AVATAR_IDS.includes(avatarId as string);
}

export function canSendMessage(plan: PlanType, dailyCount: number): boolean {
    if (plan === 'pro') return true;
    return dailyCount < PLAN_LIMITS.free.dailyMessages;
}

export function canCreateCustomAvatar(plan: PlanType): boolean {
    return PLAN_LIMITS[plan].canCreateCustomAvatar;
}

export function canAccessFeature(plan: PlanType, feature: keyof PlanLimits): boolean {
    const limit = PLAN_LIMITS[plan][feature];
    if (typeof limit === 'boolean') return limit;
    if (typeof limit === 'number') return limit > 0;
    return true; // string-based features are always available in some form
}

export function getRemainingMessages(plan: PlanType, dailyCount: number): number {
    if (plan === 'pro') return Infinity;
    return Math.max(0, PLAN_LIMITS.free.dailyMessages - dailyCount);
}
