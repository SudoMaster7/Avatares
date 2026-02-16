'use client';

import { useGamification } from '@/hooks/useGamification';
import { useToast } from '@/components/Toast';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Crown, Zap, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { calculateStreakBonus } from '@/lib/badges-streaks';

interface GamificationHUDProps {
  streakCount?: number;
  newBadges?: string[];
}

export function GamificationHUD({ streakCount = 0, newBadges = [] }: GamificationHUDProps) {
    const { stats, currentLevelTitle, nextLevelXP } = useGamification();
    const { success } = useToast();
    const progressPercentage = (stats.xp / nextLevelXP) * 100;
    const [userName, setUserName] = useState('Visitante');
    const [previousXP, setPreviousXP] = useState(stats.xp);
    const [showXPPopup, setShowXPPopup] = useState(false);
    const [xpGain, setXpGain] = useState(0);
    const [displayStreak, setDisplayStreak] = useState(streakCount);
    const streakBonus = calculateStreakBonus(displayStreak);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const id = localStorage.getItem('voice_sync_guest_id');
            if (id) {
                setUserName(`Aluno ${id.substring(0, 4)}`);
            }
        }
    }, []);

    useEffect(() => {
        setDisplayStreak(streakCount);
    }, [streakCount]);

    // Detect XP changes and show popup
    useEffect(() => {
        if (stats.xp > previousXP) {
            const gain = stats.xp - previousXP;
            setXpGain(gain);
            setShowXPPopup(true);
            success(`+${gain} XP!`);
            
            setTimeout(() => setShowXPPopup(false), 2000);
            setPreviousXP(stats.xp);
        }
    }, [stats.xp, previousXP, success]);

    return (
        <div className="fixed top-20 right-2 sm:right-4 z-50 w-56 sm:w-64 pointer-events-none">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="pointer-events-auto"
                >
                    <Card className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl shadow-xl p-4 pointer-events-auto border-2 border-purple-200/50 dark:from-slate-800/95 dark:to-slate-900/80 dark:border-purple-600/30">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <motion.div 
                                className="relative"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-purple-300 shadow-lg">
                                    {stats.level}
                                </div>
                                <motion.div 
                                    className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1 shadow-md"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                >
                                    <Star className="w-4 h-4 text-white fill-white" />
                                </motion.div>
                            </motion.div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <motion.h3 
                                        className="text-sm font-bold text-gray-900 dark:text-white"
                                        animate={{ x: [0, 2, -2, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        {currentLevelTitle}
                                    </motion.h3>
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full font-semibold">
                                        {userName}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Zap className="w-3 h-3 text-yellow-500" />
                                        {stats.xp}
                                    </span>
                                    <span className="text-gray-400">/ {nextLevelXP}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <motion.div
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Progress value={progressPercentage} className="h-2.5 mb-3 bg-gray-200 dark:bg-slate-700" />
                        </motion.div>

                        {/* Streak Display */}
                        {displayStreak > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-3 p-2 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-lg border border-orange-300 dark:border-orange-700"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                                            <Flame className="w-4 h-4 text-red-500" />
                                        </motion.div>
                                        <span className="text-xs font-bold text-orange-700 dark:text-orange-300">
                                            Sequência x{displayStreak}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                                        {streakBonus.multiplier}x XP
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* XP Popup */}
                        <AnimatePresence>
                            {showXPPopup && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                    className="text-center py-2 mb-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-300 dark:border-green-700"
                                >
                                    <p className="text-sm font-bold text-green-700 dark:text-green-300">
                                        🎉 +{xpGain} XP!
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* New Badges Notification */}
                        {newBadges.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-3 p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-300 dark:border-purple-700"
                            >
                                <p className="text-[10px] font-bold text-purple-700 dark:text-purple-300 mb-1">
                                    🏆 NOVO BADGE!
                                </p>
                                <div className="flex gap-1 flex-wrap">
                                    {newBadges.map((badge, idx) => (
                                        <motion.div
                                            key={badge}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="text-lg"
                                        >
                                            🎖️
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Achievements */}
                        {stats.unlockedAchievements.length > 0 && (
                            <motion.div 
                                className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300 mb-2 font-semibold">
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                    </motion.div>
                                    <span>Últimas Conquistas</span>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {stats.unlockedAchievements.slice(-4).map((id, idx) => (
                                        <motion.div 
                                            key={id}
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ 
                                                delay: idx * 0.1,
                                                type: 'spring',
                                                stiffness: 300,
                                                damping: 15
                                            }}
                                            whileHover={{ scale: 1.2 }}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center text-base shadow-md cursor-pointer hover:shadow-lg transition-shadow" 
                                            title={id}
                                        >
                                            🏆
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default GamificationHUD;
