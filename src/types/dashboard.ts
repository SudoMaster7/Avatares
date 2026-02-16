/**
 * Dashboard Types
 * Tipos para o sistema de dashboard e progresso do aluno
 */

export interface UserSubjectProgress {
  subjectId: string;
  subjectName: string;
  totalXP: number;
  level: number;
  nextLevelXP: number;
  progressPercentage: number;
  miniGamesCompleted: number;
  totalMiniGames: number;
  badgesEarned: string[];
  currentStreak: number;
  lastActivityDate: string;
  avatarId: string;
}

export interface UserDashboardStats {
  totalXP: number;
  totalLevel: number;
  totalBadges: number;
  currentStreak: number;
  subjectsCompleted: number;
  miniGamesPlayed: number;
  leaderboardRank: number;
}

export interface SubjectCardProps {
  subjectId: string;
  subjectName: string;
  emoji: string;
  color: string;
  progress: number;
  level: number;
  avatarId: string;
  onSelect: (subjectId: string) => void;
  isSelected?: boolean;
}

export interface DashboardContextType {
  userStats: UserDashboardStats;
  subjectProgress: Record<string, UserSubjectProgress>;
  selectedSubject: string | null;
  setSelectedSubject: (subjectId: string | null) => void;
  refreshStats: () => Promise<void>;
}
