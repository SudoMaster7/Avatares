/**
 * User Data Persistence Service
 * Saves/loads gamification stats and dashboard data using Supabase user metadata.
 * No schema changes required - uses auth.users raw_user_meta_data.
 */

import { supabase } from '@/lib/supabase';
import type { UserStats } from '@/lib/gamification';

const LOCAL_STATS_KEY = 'avatar_user_stats';
const LOCAL_DASHBOARD_KEY = 'avatar_dashboard_data';

export interface DashboardData {
    subjectProgress: Record<string, SubjectProgressData>;
    stats: DashboardStats;
    lastUpdated: string;
}

export interface SubjectProgressData {
    subjectId: string;
    level: number;
    progress: number;
    xp: number;
    miniGamesCompleted: number;
    messagesExchanged: number;
    lastActivityAt?: string;
}

export interface DashboardStats {
    totalXP: number;
    totalLevel: number;
    totalBadges: number;
    currentStreak: number;
    subjectsCompleted: number;
    miniGamesPlayed: number;
    leaderboardRank: number;
}

// ─── Save game stats to Supabase user metadata ──────────────────────────

export async function saveGameStatsToCloud(gameStats: UserStats): Promise<boolean> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return false;

        const { error } = await supabase.auth.updateUser({
            data: {
                game_stats: gameStats,
                game_stats_updated_at: new Date().toISOString(),
            },
        });

        if (error) {
            console.error('Error saving game stats to cloud:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error saving game stats:', err);
        return false;
    }
}

// ─── Load game stats from Supabase user metadata ────────────────────────

export async function loadGameStatsFromCloud(): Promise<UserStats | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const gameStats = session.user.user_metadata?.game_stats;
        if (!gameStats) return null;

        return gameStats as UserStats;
    } catch (err) {
        console.error('Error loading game stats from cloud:', err);
        return null;
    }
}

// ─── Save dashboard data to Supabase user metadata ──────────────────────

export async function saveDashboardDataToCloud(data: DashboardData): Promise<boolean> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return false;

        const { error } = await supabase.auth.updateUser({
            data: {
                dashboard_data: data,
                dashboard_updated_at: new Date().toISOString(),
            },
        });

        if (error) {
            console.error('Error saving dashboard data to cloud:', error);
            return false;
        }

        // Also save locally
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_DASHBOARD_KEY, JSON.stringify(data));
        }

        return true;
    } catch (err) {
        console.error('Error saving dashboard data:', err);
        return false;
    }
}

// ─── Load dashboard data from Supabase user metadata ────────────────────

export async function loadDashboardDataFromCloud(): Promise<DashboardData | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return null;

        const dashboardData = session.user.user_metadata?.dashboard_data;
        if (!dashboardData) return null;

        // Also update local cache
        if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_DASHBOARD_KEY, JSON.stringify(dashboardData));
        }

        return dashboardData as DashboardData;
    } catch (err) {
        console.error('Error loading dashboard data from cloud:', err);
        return null;
    }
}

// ─── Local storage helpers ──────────────────────────────────────────────

export function saveGameStatsLocally(stats: UserStats): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
    }
}

export function loadGameStatsLocally(): UserStats | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(LOCAL_STATS_KEY);
    if (!saved) return null;
    try {
        return JSON.parse(saved) as UserStats;
    } catch {
        return null;
    }
}

export function saveDashboardLocally(data: DashboardData): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_DASHBOARD_KEY, JSON.stringify(data));
    }
}

export function loadDashboardLocally(): DashboardData | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(LOCAL_DASHBOARD_KEY);
    if (!saved) return null;
    try {
        return JSON.parse(saved) as DashboardData;
    } catch {
        return null;
    }
}

// ─── Merge local and cloud data (cloud wins for higher values) ──────────

export function mergeGameStats(local: UserStats | null, cloud: UserStats | null): UserStats {
    if (!local && !cloud) {
        return {
            xp: 0,
            level: 1,
            messagesSent: 0,
            scenariosCompleted: 0,
            daysStreak: 0,
            lastLoginDate: new Date().toISOString(),
            unlockedAchievements: [],
        };
    }
    if (!local) return cloud!;
    if (!cloud) return local;

    // Take the higher values (user may have progressed on different devices)
    return {
        xp: Math.max(local.xp, cloud.xp),
        level: Math.max(local.level, cloud.level),
        messagesSent: Math.max(local.messagesSent, cloud.messagesSent),
        scenariosCompleted: Math.max(local.scenariosCompleted, cloud.scenariosCompleted),
        daysStreak: Math.max(local.daysStreak, cloud.daysStreak),
        lastLoginDate: local.lastLoginDate > cloud.lastLoginDate ? local.lastLoginDate : cloud.lastLoginDate,
        unlockedAchievements: [...new Set([...local.unlockedAchievements, ...cloud.unlockedAchievements])],
    };
}

export function mergeDashboardData(local: DashboardData | null, cloud: DashboardData | null): DashboardData | null {
    if (!local && !cloud) return null;
    if (!local) return cloud;
    if (!cloud) return local;

    // Cloud data wins if it's newer
    const localTime = new Date(local.lastUpdated || 0).getTime();
    const cloudTime = new Date(cloud.lastUpdated || 0).getTime();
    return cloudTime >= localTime ? cloud : local;
}
