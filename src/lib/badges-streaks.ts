// Badge and Streak System for educational gamification
import type { GameResult } from '@/types/minigames';

export type BadgeType = 
  | 'wordmaster' 
  | 'memorypro' 
  | 'speed-demon' 
  | 'puzzle-master' 
  | 'timeline-expert' 
  | 'dragdrop-champion'
  | 'subject-master'
  | 'streak-builder'
  | 'xp-collector'
  | 'perfect-game';

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirement: string;
  xpReward: number;
}

export interface UserBadges {
  unlockedBadges: BadgeType[];
  currentStreak: number;
  bestStreak: number;
  totalGamesPlayed: number;
  totalXp: number;
  gameTypeStats: Record<string, { played: number; won: number; totalXp: number }>;
  subjectMastery: Record<string, { level: number; xp: number }>;
}

export interface StreakBonus {
  currentStreak: number;
  multiplier: number; // 1x, 1.5x, 2x, 2.5x, 3x
  xpBonus: number;
}

// Badge Definitions
export const BADGES: Record<BadgeType, Badge> = {
  wordmaster: {
    id: 'wordmaster',
    name: 'Mestre de Palavras',
    description: 'Complete 5 jogos de Word Scramble com 80%+ de acurácia',
    icon: '📚',
    color: 'from-purple-500 to-pink-500',
    requirement: '5 Word Scramble wins',
    xpReward: 100,
  },
  memorypro: {
    id: 'memorypro',
    name: 'Pro da Memória',
    description: 'Complete 5 jogos de Memory com menos de 20 movimentos',
    icon: '🧠',
    color: 'from-blue-500 to-cyan-500',
    requirement: '5 Memory wins',
    xpReward: 100,
  },
  'speed-demon': {
    id: 'speed-demon',
    name: 'Demônio da Velocidade',
    description: 'Acumule uma sequência de 5 vitórias consecutivas em Speed Challenge',
    icon: '⚡',
    color: 'from-yellow-500 to-orange-500',
    requirement: '5 Speed Challenge streak',
    xpReward: 150,
  },
  'puzzle-master': {
    id: 'puzzle-master',
    name: 'Mestre dos Quebra-cabeças',
    description: 'Complete 5 jogos de Puzzle com 90%+ de precisão',
    icon: '🧩',
    color: 'from-green-500 to-emerald-500',
    requirement: '5 Puzzle wins',
    xpReward: 100,
  },
  'timeline-expert': {
    id: 'timeline-expert',
    name: 'Especialista em Timeline',
    description: 'Complete 5 jogos de Timeline com acerto na primeira tentativa',
    icon: '📜',
    color: 'from-red-500 to-pink-500',
    requirement: '5 Timeline perfect games',
    xpReward: 125,
  },
  'dragdrop-champion': {
    id: 'dragdrop-champion',
    name: 'Campeão de Drag & Drop',
    description: 'Complete 5 jogos de Drag & Drop sem erros',
    icon: '🎯',
    color: 'from-indigo-500 to-blue-500',
    requirement: '5 Drag Drop perfect games',
    xpReward: 125,
  },
  'subject-master': {
    id: 'subject-master',
    name: 'Mestre de Disciplina',
    description: 'Alcance nível 10 em qualquer disciplina',
    icon: '🏆',
    color: 'from-yellow-400 to-yellow-600',
    requirement: 'Level 10 in any subject',
    xpReward: 200,
  },
  'streak-builder': {
    id: 'streak-builder',
    name: 'Construtor de Sequências',
    description: 'Mantenha uma sequência de 10 vitórias consecutivas',
    icon: '🔥',
    color: 'from-orange-500 to-red-600',
    requirement: '10 game streak',
    xpReward: 250,
  },
  'xp-collector': {
    id: 'xp-collector',
    name: 'Coletor de XP',
    description: 'Acumule 5000 XP total',
    icon: '💎',
    color: 'from-cyan-500 to-blue-500',
    requirement: '5000 total XP',
    xpReward: 0,
  },
  'perfect-game': {
    id: 'perfect-game',
    name: 'Jogo Perfeito',
    description: 'Complete qualquer jogo com pontuação perfeita 3 vezes',
    icon: '⭐',
    color: 'from-pink-500 to-rose-500',
    requirement: '3 perfect games',
    xpReward: 175,
  },
};

// Streak System
export function calculateStreakBonus(streak: number): StreakBonus {
  let multiplier = 1;
  let xpBonus = 0;

  if (streak >= 10) {
    multiplier = 3;
    xpBonus = 150;
  } else if (streak >= 7) {
    multiplier = 2.5;
    xpBonus = 125;
  } else if (streak >= 5) {
    multiplier = 2;
    xpBonus = 100;
  } else if (streak >= 3) {
    multiplier = 1.5;
    xpBonus = 50;
  }

  return {
    currentStreak: streak,
    multiplier,
    xpBonus,
  };
}

// XP Calculation with bonuses
export function calculateXpWithBonuses(
  baseXp: number,
  streak: number,
  speedBonus: boolean = false,
  speedBonusValue: number = 0
): number {
  const streakBonus = calculateStreakBonus(streak);
  let totalXp = baseXp * streakBonus.multiplier + streakBonus.xpBonus;

  if (speedBonus && speedBonusValue > 0) {
    totalXp += speedBonusValue;
  }

  return Math.round(totalXp);
}

// Badge Unlock Logic
export function checkBadgeUnlock(
  badgeId: BadgeType,
  stats: UserBadges
): boolean {
  switch (badgeId) {
    case 'wordmaster':
      return stats.gameTypeStats['wordscramble']?.won >= 5;
    case 'memorypro':
      return stats.gameTypeStats['memory']?.won >= 5;
    case 'speed-demon':
      return stats.currentStreak >= 5;
    case 'puzzle-master':
      return stats.gameTypeStats['puzzle']?.won >= 5;
    case 'timeline-expert':
      return stats.gameTypeStats['timeline']?.won >= 5;
    case 'dragdrop-champion':
      return stats.gameTypeStats['dragdrop']?.won >= 5;
    case 'subject-master':
      return Object.values(stats.subjectMastery).some(s => s.level >= 10);
    case 'streak-builder':
      return stats.bestStreak >= 10;
    case 'xp-collector':
      return stats.totalXp >= 5000;
    case 'perfect-game':
      // This would need additional tracking for perfect games
      return false;
    default:
      return false;
  }
}

// Subject Mastery Levels
export function calculateSubjectLevel(xp: number): { level: number; nextLevelXp: number } {
  const levels = [
    { level: 1, xp: 0 },
    { level: 2, xp: 100 },
    { level: 3, xp: 250 },
    { level: 4, xp: 450 },
    { level: 5, xp: 700 },
    { level: 6, xp: 1000 },
    { level: 7, xp: 1350 },
    { level: 8, xp: 1750 },
    { level: 9, xp: 2200 },
    { level: 10, xp: 3000 },
  ];

  let currentLevel = 1;
  let nextLevelXp = 100;

  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      currentLevel = levels[i].level;
      if (i < levels.length - 1) {
        nextLevelXp = levels[i + 1].xp;
      }
      break;
    }
  }

  return { level: currentLevel, nextLevelXp };
}

// Game Result Processing
export function processGameResult(
  result: GameResult,
  gameType: string,
  subject: string,
  currentStats: UserBadges,
  streak: number
): {
  xpEarned: number;
  newBadges: BadgeType[];
  streakUpdate: { current: number; best: number };
  subjectUpdate: { level: number; nextLevelXp: number };
} {
  // Calculate base XP from score
  const maxScore = result.maxScore || 100;
  const percentage = Math.min((result.score / maxScore) * 100, 100);
  let baseXp = Math.round((percentage / 100) * 100); // 0-100 XP based on score

  // Speed bonus for certain game types
  const speedBonusValue = result.duration ? Math.max(0, 60 - result.duration) * 2 : 0;

  // Calculate total XP with bonuses
  const xpEarned = calculateXpWithBonuses(
    baseXp,
    streak,
    gameType.includes('speed'),
    speedBonusValue
  );

  // Update stats
  const gameStats = currentStats.gameTypeStats[gameType] || { played: 0, won: 0, totalXp: 0 };
  gameStats.played++;
  gameStats.totalXp += xpEarned;

  if (percentage >= 70) {
    gameStats.won++;
  }

  // Check new streaks
  let newStreak = percentage >= 70 ? streak + 1 : 0;
  let newBestStreak = Math.max(currentStats.bestStreak, newStreak);

  // Update subject mastery
  const subjectXp = (currentStats.subjectMastery[subject]?.xp || 0) + xpEarned;
  const subjectLevel = calculateSubjectLevel(subjectXp);

  // Check badges
  const newBadges: BadgeType[] = [];
  const updatedStats: UserBadges = {
    ...currentStats,
    currentStreak: newStreak,
    bestStreak: newBestStreak,
    gameTypeStats: { ...currentStats.gameTypeStats, [gameType]: gameStats },
    subjectMastery: {
      ...currentStats.subjectMastery,
      [subject]: { level: subjectLevel.level, xp: subjectXp },
    },
    totalXp: currentStats.totalXp + xpEarned,
  };

  for (const [badgeId, badge] of Object.entries(BADGES)) {
    if (!currentStats.unlockedBadges.includes(badgeId as BadgeType)) {
      if (checkBadgeUnlock(badgeId as BadgeType, updatedStats)) {
        newBadges.push(badgeId as BadgeType);
      }
    }
  }

  return {
    xpEarned,
    newBadges,
    streakUpdate: { current: newStreak, best: newBestStreak },
    subjectUpdate: subjectLevel,
  };
}
