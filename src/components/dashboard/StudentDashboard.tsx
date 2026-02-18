'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SubjectGrid } from './SubjectGrid';
import { PageHeader } from './PageHeader';
import { AmbientParticles } from './AmbientParticles';
import { MiniGamePlayer } from '@/components/minigames';
import { AVATARS } from '@/lib/avatars';
import { SUBJECTS } from '@/lib/subjects';
import { supabase } from '@/lib/supabase';
import {
  loadDashboardDataFromCloud,
  saveDashboardDataToCloud,
  loadDashboardLocally,
  saveDashboardLocally,
  loadGameStatsFromCloud,
  loadGameStatsLocally,
  mergeDashboardData,
  type DashboardData,
  type SubjectProgressData,
  type DashboardStats,
} from '@/services/user-data';
import { calculateLevel } from '@/lib/gamification';
import type { UserDashboardStats, UserSubjectProgress } from '@/types/dashboard';

interface StudentDashboardProps {
  userId?: string;
  onNavigateTo?: (view: 'avatars' | 'mini-games' | 'conversation', subjectId?: string) => void;
}

// Default empty progress for each subject
function createDefaultSubjectProgress(): Record<string, SubjectProgressData> {
  const result: Record<string, SubjectProgressData> = {};
  for (const subject of SUBJECTS) {
    result[subject.id] = {
      subjectId: subject.id,
      level: 1,
      progress: 0,
      xp: 0,
      miniGamesCompleted: 0,
      messagesExchanged: 0,
    };
  }
  return result;
}

export function StudentDashboard({ userId, onNavigateTo }: StudentDashboardProps) {
  const [stats, setStats] = useState<UserDashboardStats>({
    totalXP: 0,
    totalLevel: 1,
    totalBadges: 0,
    currentStreak: 0,
    subjectsCompleted: 0,
    miniGamesPlayed: 0,
    leaderboardRank: 0,
  });

  const [subjectProgress, setSubjectProgress] = useState<
    Record<string, any>
  >({});
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playingMiniGame, setPlayingMiniGame] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use a ref to track pending saves so we can access latest state
  const pendingSaveRef = React.useRef<{ progress: Record<string, any>; stats: UserDashboardStats } | null>(null);

  // Auto-save whenever subjectProgress or stats change (debounced)
  useEffect(() => {
    if (isLoading) return;
    const timeout = setTimeout(() => {
      const dashData: DashboardData = {
        subjectProgress: subjectProgress,
        stats: stats,
        lastUpdated: new Date().toISOString(),
      };
      saveDashboardLocally(dashData);
      if (isAuthenticated) {
        saveDashboardDataToCloud(dashData);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectProgress, stats, isAuthenticated]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check auth status
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);

        // Load gamification stats (from local or cloud)
        const localGameStats = loadGameStatsLocally();
        let gameXP = localGameStats?.xp ?? 0;
        let gameLevel = localGameStats?.level ?? 1;
        let messagesSent = localGameStats?.messagesSent ?? 0;
        let scenariosCompleted = localGameStats?.scenariosCompleted ?? 0;
        let daysStreak = localGameStats?.daysStreak ?? 0;
        let badges = localGameStats?.unlockedAchievements?.length ?? 0;

        if (session?.user) {
          const cloudGameStats = await loadGameStatsFromCloud();
          if (cloudGameStats) {
            gameXP = Math.max(gameXP, cloudGameStats.xp);
            gameLevel = Math.max(gameLevel, cloudGameStats.level);
            messagesSent = Math.max(messagesSent, cloudGameStats.messagesSent);
            scenariosCompleted = Math.max(scenariosCompleted, cloudGameStats.scenariosCompleted);
            daysStreak = Math.max(daysStreak, cloudGameStats.daysStreak);
            badges = Math.max(badges, cloudGameStats.unlockedAchievements?.length ?? 0);
          }
        }

        // Load dashboard-specific data (subject progress)
        const localDashboard = loadDashboardLocally();
        let dashboardData: DashboardData | null = localDashboard;

        if (session?.user) {
          const cloudDashboard = await loadDashboardDataFromCloud();
          dashboardData = mergeDashboardData(localDashboard, cloudDashboard);
        }

        // Set subject progress
        if (dashboardData?.subjectProgress && Object.keys(dashboardData.subjectProgress).length > 0) {
          setSubjectProgress(dashboardData.subjectProgress);
        } else {
          setSubjectProgress(createDefaultSubjectProgress());
        }

        // Calculate total mini games across subjects
        let totalMiniGames = 0;
        if (dashboardData?.subjectProgress) {
          Object.values(dashboardData.subjectProgress).forEach(p => {
            totalMiniGames += p.miniGamesCompleted || 0;
          });
        }

        // Count subjects with progress > 0
        let subjectsExplored = 0;
        if (dashboardData?.subjectProgress) {
          Object.values(dashboardData.subjectProgress).forEach(p => {
            if (p.xp > 0 || p.miniGamesCompleted > 0) subjectsExplored++;
          });
        }

        // Calculate global level from XP
        const levelObj = calculateLevel(gameXP);

        setStats({
          totalXP: gameXP,
          totalLevel: levelObj.level,
          totalBadges: badges,
          currentStreak: daysStreak,
          subjectsCompleted: subjectsExplored,
          miniGamesPlayed: totalMiniGames,
          leaderboardRank: 0, // Could be computed later
        });

      } catch (err) {
        console.error('Error loading dashboard data:', err);
        // Fallback to empty defaults
        setSubjectProgress(createDefaultSubjectProgress());
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          className="text-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-6xl mb-4">✨</div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Carregando seu universo educacional...
          </p>
        </motion.div>
      </div>
    );
  }

  // Mini-game player view
  if (playingMiniGame && selectedSubject) {
    return (
      <MiniGamePlayer
        subjectId={selectedSubject}
        onComplete={(result) => {
          console.log('Mini-game completed:', result);
          
          // Update subject progress (auto-save effect will persist)
          setSubjectProgress(prev => {
            const current = prev[selectedSubject] || {
              subjectId: selectedSubject,
              level: 1,
              progress: 0,
              xp: 0,
              miniGamesCompleted: 0,
              messagesExchanged: 0,
            };
            const xpGained = result?.xpEarned ?? result?.score ?? 50;
            const newXp = (current.xp || 0) + xpGained;
            const newLevel = Math.floor(newXp / 200) + 1; // level up every 200 xp
            return {
              ...prev,
              [selectedSubject]: {
                ...current,
                miniGamesCompleted: (current.miniGamesCompleted || 0) + 1,
                xp: newXp,
                level: newLevel,
                progress: Math.min(100, (current.progress || 0) + 5),
                lastActivityAt: new Date().toISOString(),
              },
            };
          });

          // Update global stats
          setStats(prev => ({
            ...prev,
            miniGamesPlayed: prev.miniGamesPlayed + 1,
            totalXP: prev.totalXP + (result?.xpEarned ?? result?.score ?? 50),
          }));

          setPlayingMiniGame(false);
        }}
        onQuit={() => {
          setPlayingMiniGame(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-10 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Ambient Particles */}
      <AmbientParticles />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header com Menu */}
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-0 flex-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Bem-vindo ao AvatarES!
              </span>
              {' '}
              <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl inline-block">🎓</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-400 mt-2 px-1 sm:px-0">
              Explore 13 matérias com mentores especializados e ganhe pontos, badges e poderes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full sm:w-auto"
          >
            <Button
              onClick={() => onNavigateTo?.('avatars')}
              className="hidden sm:flex bg-gradient-to-r from-slate-400 to-slate-600 text-white hover:shadow-lg text-sm"
            >
              🏠 Voltar à Home
            </Button>
            <Button
              onClick={() => onNavigateTo?.('avatars')}
              className="sm:hidden w-full bg-gradient-to-r from-slate-400 to-slate-600 text-white hover:shadow-lg px-3 py-2 h-auto text-sm"
              title="Voltar à Home"
            >
              🏠 Voltar
            </Button>
          </motion.div>
        </motion.div>

        {/* Main Stats - Enhanced Layout */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: 'XP Total',
                value: stats.totalXP,
                icon: '⭐',
                gradient: 'from-yellow-400 to-yellow-600',
                bgGradient: 'from-yellow-50 to-yellow-100',
              },
              {
                label: 'Nível Global',
                value: stats.totalLevel,
                icon: '🚀',
                gradient: 'from-blue-400 to-blue-600',
                bgGradient: 'from-blue-50 to-blue-100',
              },
              {
                label: 'Badges Ganhos',
                value: stats.totalBadges,
                icon: '🏅',
                gradient: 'from-purple-400 to-purple-600',
                bgGradient: 'from-purple-50 to-purple-100',
              },
              {
                label: 'Sequência 🔥',
                value: `${stats.currentStreak}d`,
                icon: '⚡',
                gradient: 'from-red-400 to-red-600',
                bgGradient: 'from-red-50 to-red-100',
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className={`bg-gradient-to-br ${stat.bgGradient} dark:from-slate-700 dark:to-slate-600 rounded-2xl p-4 border-2 border-opacity-20 relative overflow-hidden group cursor-pointer`}
                >
                  {/* Animated Gradient Border on Hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{stat.icon}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1">
                      {stat.label}
                    </p>
                    <motion.p
                      className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                      key={stat.value}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.value}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Posição no Ranking',
                value: `#${stats.leaderboardRank}`,
                icon: '📊',
                color: 'from-indigo-500 to-blue-600',
              },
              {
                label: 'Mini-games Jogados',
                value: stats.miniGamesPlayed,
                icon: '🎮',
                color: 'from-pink-500 to-red-600',
              },
              {
                label: 'Matérias Exploradas',
                value: `${stats.subjectsCompleted} / 13`,
                icon: '📚',
                color: 'from-green-500 to-emerald-600',
              },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`bg-gradient-to-br ${stat.color} text-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                        {stat.label}
                      </p>
                      <motion.p
                        className="text-2xl font-black mt-1"
                        key={stat.value}
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <span className="text-4xl opacity-80">{stat.icon}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Subjects Section */}
        <motion.div variants={itemVariants}>
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
              Suas 13 Matérias 📖
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              Cada matéria tem um mentor especializado. Clique em uma para começar a aprender!
            </p>
          </div>

          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/20">
            <SubjectGrid
              userProgress={subjectProgress}
              onSubjectSelect={handleSubjectSelect}
              selectedSubject={selectedSubject || undefined}
              onStartMiniGame={(subjectId) => {
                setSelectedSubject(subjectId);
                setPlayingMiniGame(true);
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
