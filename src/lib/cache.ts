/**
 * SUDO Education – Redis Cache Layer
 * Uses Upstash Redis (serverless, Vercel-compatible).
 * Falls back gracefully to no-op when not configured
 * so the app works locally without Redis.
 *
 * Install: pnpm add @upstash/redis
 * Env vars: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from '@upstash/redis';

// ─────────────────────────────────────────────────────────
// Client (singleton)
// ─────────────────────────────────────────────────────────

let redis: Redis | null = null;

function getRedis(): Redis | null {
    if (redis) return redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        // Running locally without Redis – silently degrade
        return null;
    }

    redis = new Redis({ url, token });
    return redis;
}

// ─────────────────────────────────────────────────────────
// TTLs (seconds)
// ─────────────────────────────────────────────────────────

const TTL = {
    chatHistory: 60 * 60,          // 1 hour  – conversation context window
    userPlan: 60 * 5,              // 5 min   – cached plan/quota
    dailyMessageCount: 60 * 60 * 2, // 2 hours – reset by DB trigger nightly
    avatarList: 60 * 30,           // 30 min  – avatar catalogue
};

// ─────────────────────────────────────────────────────────
// Chat session: store last N messages to reduce DB reads
// ─────────────────────────────────────────────────────────

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export async function getCachedChatHistory(conversationId: string): Promise<ChatMessage[]> {
    const r = getRedis();
    if (!r) return [];

    try {
        const data = await r.get<ChatMessage[]>(`chat:${conversationId}`);
        return data ?? [];
    } catch {
        return [];
    }
}

export async function setCachedChatHistory(
    conversationId: string,
    messages: ChatMessage[]
): Promise<void> {
    const r = getRedis();
    if (!r) return;

    // Keep only last 20 messages to save memory
    const trimmed = messages.slice(-20);

    try {
        await r.set(`chat:${conversationId}`, trimmed, { ex: TTL.chatHistory });
    } catch {
        // Non-fatal
    }
}

export async function appendToChatHistory(
    conversationId: string,
    message: ChatMessage
): Promise<void> {
    const history = await getCachedChatHistory(conversationId);
    history.push(message);
    await setCachedChatHistory(conversationId, history);
}

export async function clearChatHistory(conversationId: string): Promise<void> {
    const r = getRedis();
    if (!r) return;
    try {
        await r.del(`chat:${conversationId}`);
    } catch {
        // Non-fatal
    }
}

// ─────────────────────────────────────────────────────────
// User plan cache (avoid DB on every message)
// ─────────────────────────────────────────────────────────

interface CachedUserPlan {
    plan: 'free' | 'pro';
    dailyMsgCount: number;
    dailyMsgReset: string;
}

export async function getCachedUserPlan(userId: string): Promise<CachedUserPlan | null> {
    const r = getRedis();
    if (!r) return null;

    try {
        return await r.get<CachedUserPlan>(`plan:${userId}`);
    } catch {
        return null;
    }
}

export async function setCachedUserPlan(userId: string, data: CachedUserPlan): Promise<void> {
    const r = getRedis();
    if (!r) return;

    try {
        await r.set(`plan:${userId}`, data, { ex: TTL.userPlan });
    } catch {
        // Non-fatal
    }
}

export async function invalidateUserPlan(userId: string): Promise<void> {
    const r = getRedis();
    if (!r) return;
    try {
        await r.del(`plan:${userId}`);
    } catch {
        // Non-fatal
    }
}

// ─────────────────────────────────────────────────────────
// Generic helpers
// ─────────────────────────────────────────────────────────

export async function cacheGet<T>(key: string): Promise<T | null> {
    const r = getRedis();
    if (!r) return null;
    try {
        return await r.get<T>(key);
    } catch {
        return null;
    }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const r = getRedis();
    if (!r) return;
    try {
        await r.set(key, value, { ex: ttlSeconds });
    } catch {
        // Non-fatal
    }
}

export async function cacheDel(key: string): Promise<void> {
    const r = getRedis();
    if (!r) return;
    try {
        await r.del(key);
    } catch {
        // Non-fatal
    }
}
