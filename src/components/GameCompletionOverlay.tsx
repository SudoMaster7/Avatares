import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BadgeType } from '@/lib/badges-streaks';
import { BADGES } from '@/lib/badges-streaks';

interface GameCompletionOverlayProps {
  isVisible: boolean;
  xpEarned: number;
  streakCount: number;
  streakBonus: number;
  newBadges: BadgeType[];
  speedBonus?: number;
  onClose: () => void;
}

export function GameCompletionOverlay({
  isVisible,
  xpEarned,
  streakCount,
  streakBonus,
  newBadges,
  speedBonus = 0,
  onClose,
}: GameCompletionOverlayProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, newBadges.length > 0 ? 5000 : 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, newBadges, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black pointer-events-auto cursor-pointer"
            onClick={onClose}
          />

          {/* Main Content */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 pointer-events-auto"
          >
            {/* Confetti Animation */}
            <motion.div
              animate={{ y: [-20, 0] }}
              transition={{ duration: 0.6 }}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-4xl"
            >
              🎉
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold text-center mb-6 dark:text-white"
            >
              Parabéns! 🎊
            </motion.h2>

            {/* XP Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 mb-6 text-white text-center"
            >
              <p className="text-sm opacity-90">XP Ganho</p>
              <motion.p
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl font-bold"
              >
                +{xpEarned}
              </motion.p>
              {streakCount > 1 && (
                <p className="text-sm mt-2 opacity-90">
                  Sequência de {streakCount}! Bônus: +{streakBonus}
                </p>
              )}
              {speedBonus > 0 && (
                <p className="text-sm mt-1 opacity-90">Bônus de velocidade: +{speedBonus}</p>
              )}
            </motion.div>

            {/* Streak Display */}
            {streakCount > 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 mb-6 text-center"
              >
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="font-bold text-lg dark:text-white">
                    Sequência de {streakCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mantenha para maiores bônus!
                  </p>
                </div>
              </motion.div>
            )}

            {/* New Badges */}
            {newBadges.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 mb-6"
              >
                <p className="text-sm font-bold text-purple-600 dark:text-purple-400 text-center">
                  🏆 NOVO BADGE DESBLOQUEADO!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {newBadges.map((badgeId, idx) => {
                    const badge = BADGES[badgeId];
                    return (
                      <motion.div
                        key={badgeId}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          delay: 0.5 + idx * 0.1,
                        }}
                        className={`bg-gradient-to-br ${badge.color} rounded-lg p-4 text-white text-center min-w-[100px]`}
                      >
                        <p className="text-2xl mb-1">{badge.icon}</p>
                        <p className="text-xs font-bold">{badge.name}</p>
                        <p className="text-xs opacity-75 mt-1">+{badge.xpReward} XP</p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-shadow"
            >
              Continuar
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GameCompletionOverlay;
