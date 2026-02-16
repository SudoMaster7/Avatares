/**
 * Mini-Games Types
 */

export interface MiniGame {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'matching' | 'fillblank' | 'sequencing' | 'truefalse' | 'dragdrop' | 'wordscramble' | 'memory' | 'timeline' | 'speedchallenge' | 'puzzle';
  subject: string;
  difficulty: 'fácil' | 'médio' | 'difícil';
  duration: number; // segundos
  xpReward: number;
  questions: Question[];
  streakBonus?: number; // XP extra para acertos consecutivos
  speedBonus?: boolean; // bônus XP se completar rápido
}

export interface Question {
  id: string;
  text: string;
  type: 'quiz' | 'matching' | 'fillblank' | 'sequencing' | 'truefalse' | 'dragdrop' | 'wordscramble' | 'memory' | 'timeline' | 'speedchallenge' | 'puzzle';
  options?: string[];
  correctAnswer?: string | number | string[];
  pairs?: { left: string; right: string }[];
  items?: string[];
  image?: string;
  hint?: string;
}

export interface GameResult {
  gameId: string;
  score: number;
  maxScore: number;
  xpEarned?: number;
  duration?: number;
  completedAt?: Date;
  correct?: number;
  total?: number;
}
