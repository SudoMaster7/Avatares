'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BadgesStreaksDisplay from '@/components/BadgesStreaksDisplay';
import GameCompletionOverlay from '@/components/GameCompletionOverlay';
import { Button } from '@/components/ui/button';
import type { UserBadges, BadgeType } from '@/lib/badges-streaks';

export function BadgesDemoPage() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [mockStats, setMockStats] = useState<UserBadges>({
    unlockedBadges: ['memorypro', 'wordmaster', 'speed-demon'],
    currentStreak: 7,
    bestStreak: 12,
    totalGamesPlayed: 24,
    totalXp: 2850,
    gameTypeStats: {
      memory: { played: 5, won: 5, totalXp: 450 },
      wordscramble: { played: 4, won: 3, totalXp: 320 },
      speedchallenge: { played: 6, won: 5, totalXp: 680 },
      timeline: { played: 3, won: 2, totalXp: 240 },
      dragdrop: { played: 4, won: 3, totalXp: 380 },
      puzzle: { played: 2, won: 1, totalXp: 180 },
    },
    subjectMastery: {
      'Matemática': { level: 4, xp: 850 },
      'Português': { level: 3, xp: 620 },
      'Inglês': { level: 2, xp: 380 },
      'História': { level: 5, xp: 1000 },
    },
  });

  const handleAddStreak = () => {
    setMockStats(prev => ({
      ...prev,
      currentStreak: Math.min(prev.currentStreak + 1, 15),
      bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1),
    }));
  };

  const handleUnlockBadge = () => {
    const allBadges: BadgeType[] = [
      'wordmaster',
      'memorypro',
      'speed-demon',
      'puzzle-master',
      'timeline-expert',
      'dragdrop-champion',
      'subject-master',
      'streak-builder',
      'xp-collector',
      'perfect-game',
    ];

    const newBadge = allBadges.find(b => !mockStats.unlockedBadges.includes(b));
    if (newBadge) {
      setMockStats(prev => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, newBadge],
      }));
    }
  };

  const handleAddXP = (amount: number) => {
    setMockStats(prev => ({
      ...prev,
      totalXp: prev.totalXp + amount,
      totalGamesPlayed: prev.totalGamesPlayed + 1,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-4">
            🏆 Badges & Streaks Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Teste o sistema completo de gamificação com badges, streaks e XP bonuses
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <BadgesStreaksDisplay userBadges={mockStats} showAnimation={true} />
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              🎮 Controles de Demo
            </h2>

            <div className="space-y-3">
              <Button
                onClick={() => setShowOverlay(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
              >
                🎉 Simular Conclusão de Jogo
              </Button>

              <Button
                onClick={handleAddStreak}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
              >
                🔥 Aumentar Sequência
              </Button>

              <Button
                onClick={handleUnlockBadge}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              >
                🏆 Desbloquear Badge
              </Button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={() => handleAddXP(50)}
                  variant="outline"
                  className="text-sm"
                >
                  +50 XP
                </Button>
                <Button
                  onClick={() => handleAddXP(100)}
                  variant="outline"
                  className="text-sm"
                >
                  +100 XP
                </Button>
                <Button
                  onClick={() => handleAddXP(250)}
                  variant="outline"
                  className="text-sm"
                >
                  +250 XP
                </Button>
                <Button
                  onClick={() => handleAddXP(500)}
                  variant="outline"
                  className="text-sm"
                >
                  +500 XP
                </Button>
              </div>

              <Button
                onClick={() => setMockStats({
                  unlockedBadges: [],
                  currentStreak: 0,
                  bestStreak: 0,
                  totalGamesPlayed: 0,
                  totalXp: 0,
                  gameTypeStats: {},
                  subjectMastery: {},
                })}
                variant="outline"
                className="w-full mt-4"
              >
                🔄 Resetar Tudo
              </Button>
            </div>

            {/* Stats Display */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-slate-900 rounded-lg space-y-2">
              <p className="text-sm">
                <span className="font-semibold">Sequência Atual:</span>
                {' '}
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {mockStats.currentStreak}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Melhor Sequência:</span>
                {' '}
                <span className="text-orange-600 dark:text-orange-400 font-bold">
                  {mockStats.bestStreak}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Total XP:</span>
                {' '}
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  {mockStats.totalXp.toLocaleString()}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Badges:</span>
                {' '}
                <span className="text-purple-600 dark:text-purple-400 font-bold">
                  {mockStats.unlockedBadges.length}/10
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              ⚡ Streak System
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Ganhe multiplicadores de XP mantendo sequências. 1x → 3x para sequências de 10+.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              🏆 10 Badges
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Desbloqueie badges únicos: Pro da Memória, Demônio da Velocidade, Mestre dos Quebra-cabeças, etc.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              📈 Domínio por Disciplina
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Alcance nível 10 em qualquer disciplina. Progresso rastreado separadamente por matéria.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Game Completion Overlay Demo */}
      <GameCompletionOverlay
        isVisible={showOverlay}
        xpEarned={285}
        streakCount={mockStats.currentStreak + 1}
        streakBonus={50}
        newBadges={mockStats.unlockedBadges.length < 10 ? ['memorypro'] : []}
        speedBonus={28}
        onClose={() => {
          setShowOverlay(false);
          handleAddStreak();
          handleAddXP(285);
        }}
      />
    </div>
  );
}

export default BadgesDemoPage;
