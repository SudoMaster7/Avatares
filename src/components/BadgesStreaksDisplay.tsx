import React from 'react';
import { motion } from 'framer-motion';
import type { UserBadges, BadgeType } from '@/lib/badges-streaks';
import { BADGES, calculateStreakBonus } from '@/lib/badges-streaks';

interface BadgesStreaksDisplayProps {
  userBadges: UserBadges;
  showAnimation?: boolean;
}

export function BadgesStreaksDisplay({ userBadges, showAnimation = true }: BadgesStreaksDisplayProps) {
  const streakBonus = calculateStreakBonus(userBadges.currentStreak);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={showAnimation ? containerVariants : undefined}
      initial={showAnimation ? 'hidden' : undefined}
      animate={showAnimation ? 'show' : undefined}
      className="space-y-6"
    >
      {/* Streak Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="text-sm opacity-90">Sequência Atual</p>
              <p className="text-2xl font-bold">{userBadges.currentStreak}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">Melhor Sequência</p>
            <p className="text-xl font-bold">{userBadges.bestStreak}</p>
          </div>
        </div>
        <div className="bg-black/20 rounded p-2 text-sm">
          <p>Multiplicador: {streakBonus.multiplier}x XP</p>
          <p>Bônus: +{streakBonus.xpBonus} XP por vitória</p>
        </div>
      </motion.div>

      {/* XP & Stats Section */}
      <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm opacity-90">Total XP</p>
            <p className="text-2xl font-bold">{userBadges.totalXp.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm opacity-90">Jogos Jogados</p>
            <p className="text-2xl font-bold">{userBadges.totalGamesPlayed}</p>
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-lg font-bold dark:text-white">🏆 Badges Desbloqueados</h3>
        {userBadges.unlockedBadges.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Continue jogando para desbloquear badges!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {userBadges.unlockedBadges.map((badgeId) => {
              const badge = BADGES[badgeId];
              return (
                <motion.div
                  key={badgeId}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-br ${badge.color} rounded-lg p-4 text-white text-center cursor-pointer hover:shadow-lg transition-shadow`}
                >
                  <p className="text-2xl mb-1">{badge.icon}</p>
                  <p className="text-xs font-semibold line-clamp-2">{badge.name}</p>
                  <p className="text-xs opacity-75 mt-1">+{badge.xpReward} XP</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Available Badges */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-lg font-bold dark:text-white">🎯 Badges Disponíveis</h3>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {Object.entries(BADGES)
            .filter(([id]) => !userBadges.unlockedBadges.includes(id as BadgeType))
            .slice(0, 5)
            .map(([id, badge]) => (
              <div key={id} className="bg-gray-100 dark:bg-gray-800 rounded p-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{badge.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold dark:text-white">{badge.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{badge.requirement}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Game Type Stats */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-lg font-bold dark:text-white">📊 Estatísticas por Tipo</h3>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(userBadges.gameTypeStats).map(([type, stats]) => (
            <div key={type} className="bg-gray-100 dark:bg-gray-800 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold dark:text-white capitalize">{type}</p>
                <span className="text-sm text-blue-600 dark:text-blue-400">{stats.won}/{stats.played} vitórias</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                  style={{ width: `${(stats.won / Math.max(stats.played, 1)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stats.totalXp} XP total</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Subject Mastery */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-lg font-bold dark:text-white">🎓 Domínio de Disciplinas</h3>
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(userBadges.subjectMastery)
            .sort(([, a], [, b]) => b.xp - a.xp)
            .slice(0, 5)
            .map(([subject, mastery]) => (
              <div key={subject} className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold dark:text-white">{subject}</p>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Nível {mastery.level}</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((mastery.xp / (mastery.level * 500)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{mastery.xp} XP</p>
              </div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default BadgesStreaksDisplay;
