'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onComplete?: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-red-600',
};

const rarityBorderColors = {
  common: 'border-gray-500',
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
};

export function AchievementNotification({ achievement, onComplete }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: -100, scale: 0.5 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, y: -100, scale: 0.5 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="fixed top-24 right-4 z-40"
        >
          <div className={`
            bg-gradient-to-br ${rarityColors[achievement.rarity]}
            border-2 ${rarityBorderColors[achievement.rarity]}
            rounded-xl p-4 w-80 shadow-2xl
            overflow-hidden relative
          `}>
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1,
                ease: 'easeInOut',
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                {achievement.icon}
              </motion.div>

              <div className="flex-1">
                <motion.h3
                  className="text-white font-bold text-lg"
                  animate={{ opacity: [0.8, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  🎉 Conquista Desbloqueada!
                </motion.h3>
                <p className="text-white/90 font-semibold text-sm mt-1">{achievement.title}</p>
                <p className="text-white/70 text-xs mt-1">{achievement.description}</p>
              </div>
            </div>

            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/50"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3.5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface AchievementQueueProps {
  achievements: Achievement[];
  onAllComplete?: () => void;
}

export function AchievementQueue({ achievements, onAllComplete }: AchievementQueueProps) {
  const [queue, setQueue] = useState<Achievement[]>(achievements);
  const [current, setCurrent] = useState<Achievement | null>(queue[0] || null);

  useEffect(() => {
    setQueue(achievements);
    if (achievements.length > 0) {
      setCurrent(achievements[0]);
    }
  }, [achievements]);

  const handleAchievementComplete = () => {
    const remaining = queue.slice(1);
    setQueue(remaining);
    setCurrent(remaining[0] || null);

    if (remaining.length === 0) {
      onAllComplete?.();
    }
  };

  return (
    <>
      {current && (
        <AchievementNotification
          achievement={current}
          onComplete={handleAchievementComplete}
        />
      )}
    </>
  );
}
