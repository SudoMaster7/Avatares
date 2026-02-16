import { useState, useEffect } from 'react';
import { UserStats, ACHIEVEMENTS, calculateLevel, LEVELS } from '@/lib/gamification';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/services/auth-service';

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

    // Load from localStorage or Supabase on mount
    useEffect(() => {
        const loadStats = async () => {
            // 1. Try local storage first (faster)
            const saved = typeof window !== 'undefined' ? localStorage.getItem('avatar_user_stats') : null;
            if (saved) {
                setStats(JSON.parse(saved));
            }

            // 2. Try Supabase if user exists - DISABLED until database is set up
            // const userId = getCurrentUserId();
            // if (userId) {
            //     const { data } = await supabase
            //         .from('student_profiles')
            //         .select('total_points')
            //         .eq('user_id', userId)
            //         .single();

            //     if (data) {
            //         // Start with server XP if local is missing or lower (simple sync conflict resolution)
            //         // Ideally we'd merge, but for now server wins if local is empty
            //         if (!saved) {
            //             setStats(prev => calculateStatsFromXP(data.total_points));
            //         }
            //     }
            // }
        };
        loadStats();
    }, []);

    // Save to localStorage AND Supabase on change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('avatar_user_stats', JSON.stringify(stats));
        }

        // DISABLED until database is set up
        // const userId = getCurrentUserId();
        // if (userId) {
        //     // Updates Supabase directly (debounce could be added for optimization)
        //     supabase.from('student_profiles')
        //         .upsert({
        //             user_id: userId,
        //             total_points: stats.xp,
        //             // We would map other fields if schema supported them
        //         }, { onConflict: 'user_id' })
        //         .then(({ error }) => {
        //             if (error) console.error('Error syncing XP:', error);
        //         });
        // }
    }, [stats]);

    // Helper to reconstruct stats from just XP (since schema is limited)
    const calculateStatsFromXP = (xp: number): UserStats => {
        const levelObj = calculateLevel(xp);
        return {
            ...DEFAULT_STATS,
            xp,
            level: levelObj.level,
        };
    };

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
