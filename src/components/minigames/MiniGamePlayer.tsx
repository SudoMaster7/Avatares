'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { QuizGame } from './QuizGame';
import { TrueFalseGame } from './TrueFalseGame';
import { FillBlankGame } from './FillBlankGame';
import { MatchingGame } from './MatchingGame';
import { WordScrambleGame } from './WordScrambleGame';
import { MemoryGame } from './MemoryGame';
import { TimelineGame } from './TimelineGame';
import { SpeedChallengeGame } from './SpeedChallengeGame';
import { DragDropGame } from './DragDropGame';
import { PuzzleGame } from './PuzzleGame';
import { GameCompletionOverlay } from '@/components/GameCompletionOverlay';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { MiniGame, GameResult } from '@/types/minigames';
import type { BadgeType } from '@/lib/badges-streaks';
import { MINI_GAMES } from '@/lib/minigames';
import { getMiniGamesBySubject, type MiniGameData } from '@/lib/minigames-data';
import { processGameResult } from '@/lib/badges-streaks';

// ─── Shuffle helper ────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle questions array and shuffle options within each question
function randomizeGame(game: MiniGame): MiniGame {
  const shuffledQuestions = shuffle(game.questions).map(q => {
    if (!q.options || q.options.length === 0) return q;
    // Shuffle the options, preserving correctAnswer value
    const shuffledOptions = shuffle(q.options);
    return { ...q, options: shuffledOptions };
  });
  return { ...game, questions: shuffledQuestions };
}

interface MiniGamePlayerProps {
  subjectId: string;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
  userStats?: {
    currentStreak: number;
    bestStreak: number;
    gameTypeStats: Record<string, { played: number; won: number; totalXp: number }>;
    subjectMastery: Record<string, { level: number; xp: number }>;
    totalXp: number;
    totalGamesPlayed: number;
    unlockedBadges: BadgeType[];
  };
  onStreakUpdate?: (streak: number, bestStreak: number) => void;
  onBadgeUnlock?: (badges: BadgeType[]) => void;
}

// Convert MiniGameData to MiniGame format
function convertGameData(gameData: MiniGameData): MiniGame {
  const allQuestions: any[] = [];
  
  gameData.questions.forEach((q, idx) => {
    // Para Timeline, cada evento vira uma questão
    if (q.events && q.events.length > 0) {
      q.events.forEach((evt, eIdx) => {
        allQuestions.push({
          id: `${gameData.id}-${idx}-${eIdx}`,
          text: evt.event,
          type: gameData.type as any,
          options: undefined,
          correctAnswer: evt.order,
          items: undefined,
          image: undefined,
          hint: undefined,
        });
      });
    } else if (q.items && (q.categories || gameData.type === 'dragdrop')) {
      // Para DragDrop com items e categories
      const questionId = q.id || `${gameData.id}-${idx}`;
      allQuestions.push({
        id: questionId,
        text: gameData.description || 'Classificar items',
        type: gameData.type as any,
        options: q.categories ? Object.keys(q.categories) : [],
        correctAnswer: q.categories,
        items: q.items,
        image: q.image,
        hint: q.hint,
      });
    } else {
      // Para outros tipos de jogos
      const questionId = q.id || `${gameData.id}-${idx}`;
      allQuestions.push({
        id: questionId,
        text: q.question || `Questão ${idx + 1}`,
        type: gameData.type as any,
        options: q.options,
        correctAnswer: q.correctAnswer,
        items: q.items,
        image: q.image,
        hint: q.hint,
      });
    }
  });

  return {
    id: gameData.id,
    title: gameData.title,
    description: gameData.description,
    type: gameData.type as any,
    subject: gameData.subject,
    difficulty: gameData.difficulty as 'fácil' | 'médio' | 'difícil',
    duration: gameData.timeLimit || 120,
    xpReward: gameData.maxScore,
    questions: allQuestions,
    streakBonus: gameData.streakBonus ? 10 : undefined,
    speedBonus: gameData.speedBonus,
  };
}

export function MiniGamePlayer({ 
  subjectId, 
  onComplete, 
  onQuit,
  userStats,
  onStreakUpdate,
  onBadgeUnlock,
}: MiniGamePlayerProps) {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [completionData, setCompletionData] = useState<{
    xpEarned: number;
    streakCount: number;
    streakBonus: number;
    newBadges: BadgeType[];
    speedBonus: number;
  } | null>(null);

  // Priorizar nova base de dados, fallback para antiga
  const gamesForSubject = useMemo(() => {
    const newGames = getMiniGamesBySubject(subjectId);
    
    if (newGames && newGames.length > 0) {
      return newGames.map(convertGameData);
    }
    
    // Fallback para MINI_GAMES antiga se não encontrar na nova base
    const oldGames = MINI_GAMES.filter((g) => g.subject === subjectId);
    return oldGames;
  }, [subjectId]);

  // Fetch AI-generated questions and merge with static game
  const loadGameWithAI = async (game: MiniGame): Promise<MiniGame> => {
    // Only AI-enhance compatible types
    const aiCompatible = ['quiz', 'truefalse', 'fillblank', 'speedchallenge'];
    if (!aiCompatible.includes(game.type)) {
      return randomizeGame(game);
    }

    try {
      const res = await fetch('/api/minigame-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectId,
          gameType: game.type,
          difficulty: game.difficulty === 'fácil' ? 'fácil' : game.difficulty === 'difícil' ? 'difícil' : 'médio',
          count: 5,
        }),
      });

      if (!res.ok) throw new Error('AI fetch failed');
      const data = await res.json();

      if (data.questions && data.questions.length > 0) {
        // Mix AI questions (first 5) with shuffled static questions (last few)
        const staticShuffled = shuffle(game.questions).slice(0, 3);
        const mixed = shuffle([...data.questions, ...staticShuffled]);
        return { ...game, questions: mixed };
      }
    } catch (err) {
      console.warn('AI questions failed, using static:', err);
    }

    // Fallback: just shuffle static questions
    return randomizeGame(game);
  };

  const handleStartGame = async (game: MiniGame) => {
    setAiLoading(true);
    try {
      const enriched = await loadGameWithAI(game);
      setSelectedGame(enriched);
      setGameStarted(true);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGameComplete = (gameResult: GameResult) => {
    setResult(gameResult);
    
    if (userStats && selectedGame) {
      // Process result through badges/streaks system
      const processed = processGameResult(
        gameResult,
        selectedGame.type,
        subjectId,
        {
          unlockedBadges: userStats.unlockedBadges,
          currentStreak: userStats.currentStreak,
          bestStreak: userStats.bestStreak,
          totalGamesPlayed: userStats.totalGamesPlayed,
          totalXp: userStats.totalXp,
          gameTypeStats: userStats.gameTypeStats,
          subjectMastery: userStats.subjectMastery,
        },
        userStats.currentStreak
      );

      // Update callbacks
      if (onStreakUpdate) {
        onStreakUpdate(processed.streakUpdate.current, processed.streakUpdate.best);
      }
      if (onBadgeUnlock && processed.newBadges.length > 0) {
        onBadgeUnlock(processed.newBadges);
      }

      // Show completion overlay
      setCompletionData({
        xpEarned: processed.xpEarned,
        streakCount: processed.streakUpdate.current,
        streakBonus: processed.streakUpdate.current > 1 ? processed.streakUpdate.current * 10 : 0,
        newBadges: processed.newBadges,
        speedBonus: gameResult.duration ? Math.max(0, 60 - gameResult.duration) * 2 : 0,
      });
      setShowCompletion(true);
      
      // Store result for later use in onClose
      setResult(gameResult);
    }
  };

  if (showCompletion && completionData) {
    return (
      <>
        <GameCompletionOverlay
          isVisible={true}
          xpEarned={completionData.xpEarned}
          streakCount={completionData.streakCount}
          streakBonus={completionData.streakBonus}
          newBadges={completionData.newBadges}
          speedBonus={completionData.speedBonus}
          onClose={() => {
            setShowCompletion(false);
            setSelectedGame(null);
            setGameStarted(false);
            if (result) {
              onComplete(result);
            }
            setResult(null);
            setCompletionData(null);
          }}
        />
        <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800" />
      </>
    );
  }

  if (result) {
    const percentage = result.correct && result.total ? Math.round((result.correct / result.total) * 100) : Math.round((result.score / result.maxScore) * 100);
    const scoreDisplay = result.correct && result.total ? `${result.correct}/${result.total} corretas` : `${result.score} pontos`;
    const xpDisplay = result.xpEarned || Math.floor((result.score / result.maxScore) * 100);
    
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}
          </motion.div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {percentage >= 80
              ? 'Excelente!'
              : percentage >= 60
              ? 'Muito Bom!'
              : 'Bom esforço!'}
          </h1>

          <p className="text-2xl font-bold text-blue-600 mb-4">
            {scoreDisplay}
          </p>

          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
            +{xpDisplay} XP ganho! 🚀
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onQuit} className="flex-1">
              Voltar
            </Button>
            <Button
              onClick={() => {
                setSelectedGame(null);
                setGameStarted(false);
                setResult(null);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Novo Jogo
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameStarted && selectedGame) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="w-full">
          {selectedGame.type === 'quiz' && (
            <QuizGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'truefalse' && (
            <TrueFalseGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'fillblank' && (
            <FillBlankGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'matching' && (
            <MatchingGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'wordscramble' && (
            <WordScrambleGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'memory' && (
            <MemoryGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'timeline' && (
            <TimelineGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'speedchallenge' && (
            <SpeedChallengeGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'dragdrop' && (
            <DragDropGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
          {selectedGame.type === 'puzzle' && (
            <PuzzleGame
              game={selectedGame}
              onComplete={(result) => {
                handleGameComplete(result);
              }}
              onQuit={() => {
                setGameStarted(false);
                setSelectedGame(null);
              }}
            />
          )}
        </div>
      </div>
    );
  }

  if (aiLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <Loader2 className="w-14 h-14 animate-spin text-blue-600 mx-auto mb-5" />
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Gerando perguntas com IA...</p>
          <p className="text-gray-500 dark:text-gray-400">Preparando um jogo único para você ✨</p>
        </div>
      </div>
    );
  }

  if (selectedGame && !gameStarted) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl"
        >
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            {selectedGame.title}
          </h1>
          <p className="text-gray-700 dark:text-gray-400 mb-2">
            Dificuldade: <span className="font-bold">{selectedGame.difficulty}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-400 mb-6">
            {selectedGame.questions.length} perguntas | {selectedGame.duration}s
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {selectedGame.description}
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">+{selectedGame.xpReward} XP</p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setSelectedGame(null)} className="flex-1">
              Voltar
            </Button>
            <Button
              onClick={() => handleStartGame(selectedGame!)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg"
            >
              Começar 🚀
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Games selection
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <motion.button
            onClick={onQuit}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Voltar ao Dashboard
          </motion.button>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Mini-games Disponíveis 🎮
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-400">
            Escolha um mini-game para começar a aprender se divertindo!
          </p>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {gamesForSubject.map((game, idx) => (
            <motion.button
              key={game.id}
              onClick={() => handleStartGame(game)}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.05, y: -8 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all text-left border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-4xl mb-3">
                {game.type === 'quiz' ? '❓'
                  : game.type === 'truefalse' ? '✅'
                  : game.type === 'fillblank' ? '📝'
                  : game.type === 'matching' ? '🔗'
                  : game.type === 'memory' ? '🧠'
                  : game.type === 'timeline' ? '📅'
                  : game.type === 'speedchallenge' ? '⚡'
                  : game.type === 'wordscramble' ? '🔤'
                  : game.type === 'dragdrop' ? '🖱️'
                  : game.type === 'puzzle' ? '🧩'
                  : '🎯'}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {game.title}
              </h3>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {game.description}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  {game.difficulty}
                </span>
                <span className="font-bold text-blue-600">+{game.xpReward} XP</span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {game.questions.length} perguntas
              </div>
            </motion.button>
          ))}
        </motion.div>

        {gamesForSubject.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Nenhum mini-game disponível para esta matéria ainda.
            </p>
            <Button onClick={onQuit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Voltar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
