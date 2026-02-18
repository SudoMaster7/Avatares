import { useState, useEffect, useRef } from 'react';
import { UserStats, ACHIEVEMENTS, calculateLevel, LEVELS } from '@/lib/gamification';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/services/auth-service';
import {
    saveGameStatsToCloud,
    loadGameStatsFromCloud,
    saveGameStatsLocally,
    loadGameStatsLocally,
    mergeGameStats,
} from '@/services/user-data';

const DEFAULT_STATS: UserStats = {
    xp: 0,
    level: 1,
    messagesSent: 0,
    scenariosCompleted: 0,
    daysStreak: 0,
    lastLoginDate: new Date().toISOString(),
    unlockedAchievements: [],
};

export function useGamification() {
    const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Load from localStorage + Supabase on mount
    useEffect(() => {
        const loadStats = async () => {
            // 1. Load local stats first (fast)
            const localStats = loadGameStatsLocally();
            if (localStats) {
                setStats(localStats);
            }

            // 2. Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setIsAuthenticated(true);

                // 3. Load cloud stats and merge
                const cloudStats = await loadGameStatsFromCloud();
                const merged = mergeGameStats(localStats, cloudStats);

                setStats(merged);
                saveGameStatsLocally(merged);

                // 4. If cloud was behind, save merged data back
                if (cloudStats && merged.xp > cloudStats.xp) {
                    await saveGameStatsToCloud(merged);
                }
            }

            // 5. Update streak
            if (localStats || session?.user) {
                const currentStats = localStats || DEFAULT_STATS;
                const today = new Date().toISOString().slice(0, 10);
                const lastLogin = currentStats.lastLoginDate?.slice(0, 10);

                if (lastLogin !== today) {
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().slice(0, 10);

                    setStats(prev => ({
                        ...prev,
                        lastLoginDate: new Date().toISOString(),
                        daysStreak: lastLogin === yesterdayStr ? prev.daysStreak + 1 : 1,
                    }));
                }
            }
        };
        loadStats();
    }, []);

    // Save to localStorage + Supabase on change (debounced cloud save)
    useEffect(() => {
        // Always save locally immediately
        saveGameStatsLocally(stats);

        // Debounce cloud save (2 seconds)
        if (isAuthenticated) {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            saveTimerRef.current = setTimeout(() => {
                saveGameStatsToCloud(stats);
            }, 2000);
        }

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [stats, isAuthenticated]);

    const addXP = (amount: number) => {
        setStats(prev => {
            const newXP = prev.xp + amount;
            const newLevelObj = calculateLevel(newXP);

            if (newLevelObj.level > prev.level) {
                toast.success(`🎉 Level Up! Você agora é ${newLevelObj.title} (Nível ${newLevelObj.level})!`);
            }

            return { ...prev, xp: newXP, level: newLevelObj.level };
        });
    };

    const trackMessageSent = () => {
        setStats(prev => {
            const newStats = { ...prev, messagesSent: prev.messagesSent + 1 };
            checkAchievements(newStats);
            return newStats;
        });
        addXP(10); // 10 XP per message
    };

    const trackScenarioCompleted = () => {
        setStats(prev => {
            const newStats = { ...prev, scenariosCompleted: prev.scenariosCompleted + 1 };
            checkAchievements(newStats);
            return newStats;
        });
        addXP(100); // 100 XP per scenario
    };

    const trackChallengeCompleted = (score: number) => {
        // Score is 0-3
        const xp = score * 50; // 50 XP per correct answer
        const bonus = score === 3 ? 100 : 0; // 100 XP bonus for perfect score

        if (score > 0) {
            if (score === 3) toast.success('🌟 Perfeito! +250 XP');
            else toast.success(`👍 Bom trabalho! +${xp} XP`);
            addXP(xp + bonus);
        }
    };

    const checkAchievements = (currentStats: UserStats) => {
        ACHIEVEMENTS.forEach(achievement => {
            if (!currentStats.unlockedAchievements.includes(achievement.id) && achievement.condition(currentStats)) {
                toast.success(`🏆 Conquista Desbloqueada: ${achievement.title}!`);
                setStats(prev => ({
                    ...prev,
                    unlockedAchievements: [...prev.unlockedAchievements, achievement.id]
                }));
                addXP(50); // Bonus XP for achievement
            }
        });
    };

    return {
        stats,
        addXP,
        trackMessageSent,
        trackScenarioCompleted,
        trackChallengeCompleted,
        currentLevelTitle: calculateLevel(stats.xp).title,
        nextLevelXP: LEVELS.find(l => l.level === stats.level + 1)?.xp || 10000,
    };
}
