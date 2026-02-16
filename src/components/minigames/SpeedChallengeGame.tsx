'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import type { MiniGame, GameResult } from '@/types/minigames';

interface SpeedChallengeGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function SpeedChallengeGame({ game, onComplete, onQuit }: SpeedChallengeGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.duration);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [questionTime, setQuestionTime] = useState(5); // 5 segundos por pergunta

  const currentQuestion = game.questions[currentIndex];
  const options = currentQuestion?.options || [];

  useEffect(() => {
    if (timeLeft <= 0 || currentIndex >= game.questions.length) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, currentIndex]);

  useEffect(() => {
    setQuestionTime(5);
    setAnswered(false);
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (answered) return;

    const isCorrectAnswer = answer === currentQuestion?.correctAnswer;
    setIsCorrect(isCorrectAnswer);
    setAnswered(true);

    if (isCorrectAnswer) {
      const speedBonus = Math.max(0, (questionTime / 5) * 50);
      const streakBonus = Math.min(streak * 10, 100);
      setScore(score + 100 + Math.floor(speedBonus) + streakBonus);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < game.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    onComplete({
      gameId: game.id,
      score,
      maxScore: game.questions.length * 200,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Desafio Relâmpago
            </h2>
            <Zap className="w-6 h-6 text-yellow-500 animate-pulse" />
          </div>
          <div className="text-xl font-bold text-blue-600">
            {timeLeft}s
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pontos</p>
            <p className="text-2xl font-bold text-blue-600">{score}</p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Seqüência</p>
            <p className="text-2xl font-bold text-orange-600">{streak}x</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pergunta</p>
            <p className="text-2xl font-bold text-green-600">{currentIndex + 1}/{game.questions.length}</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
            animate={{ width: `${((currentIndex + 1) / game.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-blue-300 dark:border-blue-600"
      >
        <p className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {currentQuestion?.text}
        </p>
      </motion.div>

      {/* Options */}
      <div className="mb-8 space-y-3">
        {options.map((option, idx) => (
          <motion.button
            key={idx}
            onClick={() => handleAnswer(option)}
            disabled={answered}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`w-full p-4 rounded-lg font-semibold transition-all text-lg ${
              answered
                ? option === currentQuestion?.correctAnswer
                  ? 'bg-green-500 text-white'
                  : !isCorrect && option !== currentQuestion?.correctAnswer
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-700'
                : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>

      {/* Result */}
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg font-semibold mb-6 text-center ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}
        >
          {isCorrect ? '✅ Acerto! +' + (100 + Math.floor(Math.max(0, (questionTime / 5) * 50))) : '❌ Errado!'}
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onQuit}
          variant="outline"
          className="flex-1"
        >
          Sair
        </Button>
        {answered && (
          <Button
            onClick={handleNext}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {currentIndex < game.questions.length - 1 ? 'Próxima ⚡' : 'Finalizar'}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
