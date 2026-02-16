'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface PuzzleGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function PuzzleGame({ game, onComplete, onQuit }: PuzzleGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.duration);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = game.questions[currentIndex];
  const parts = currentQuestion?.items || [];

  useEffect(() => {
    setUserAnswers([]);
    setAnswered(false);
  }, [currentIndex]);

  useEffect(() => {
    if (timeLeft <= 0 || currentIndex >= game.questions.length) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, currentIndex]);

  const handlePartClick = (part: string) => {
    if (answered) return;
    setUserAnswers([...userAnswers, part]);
  };

  const handleRemovePart = (idx: number) => {
    const newAnswers = [...userAnswers];
    newAnswers.splice(idx, 1);
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    const correctSequence = parts;
    const isCorrectAnswer = JSON.stringify(userAnswers) === JSON.stringify(correctSequence);
    setIsCorrect(isCorrectAnswer);
    setAnswered(true);

    if (isCorrectAnswer) {
      const timeBonus = Math.max(0, (timeLeft / game.duration) * 50);
      setScore(score + 100 + Math.floor(timeBonus));
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
      maxScore: game.questions.length * 100,
    });
  };

  const remainingParts = parts.filter((p) => !userAnswers.includes(p));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quebra-Cabeça de Conceitos
          </h2>
          <div className="text-xl font-bold text-blue-600">
            {timeLeft}s
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            animate={{ width: `${((currentIndex + 1) / game.questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Pergunta {currentIndex + 1} de {game.questions.length}
        </p>
      </div>

      {/* Question */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl border-2 border-indigo-300 dark:border-indigo-600"
      >
        <p className="text-gray-700 dark:text-gray-300 text-center font-medium">
          {currentQuestion?.text}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3">
          Clique nos fragmentos na ordem correta
        </p>
      </motion.div>

      {/* Your Answer Assembly */}
      <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-600">
        <p className="font-semibold text-gray-900 dark:text-white mb-3">Sua Resposta:</p>
        <div className="flex flex-wrap gap-2 min-h-[50px] items-center">
          {userAnswers.length > 0 ? (
            userAnswers.map((answer, idx) => (
              <motion.button
                key={idx}
                onClick={() => handleRemovePart(idx)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                {answer}
              </motion.button>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">Clique nos fragmentos abaixo...</p>
          )}
        </div>
      </div>

      {/* Parts to Choose From */}
      <div className="mb-8">
        <p className="font-semibold text-gray-900 dark:text-white mb-3">Fragmentos disponíveis:</p>
        <div className="grid grid-cols-2 gap-3">
          {remainingParts.map((part, idx) => (
            <motion.button
              key={idx}
              onClick={() => handlePartClick(part)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              {part}
            </motion.button>
          ))}
        </div>
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
          {isCorrect ? '✅ Sequência correta!' : '❌ Sequência incorreta!'}
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
        {!answered ? (
          <Button
            onClick={handleSubmit}
            disabled={userAnswers.length === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Verificar
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {currentIndex < game.questions.length - 1 ? 'Próxima' : 'Finalizar'}
          </Button>
        )}
      </div>

      {/* Score */}
      <motion.div
        className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-center text-gray-700 dark:text-gray-300">
          Pontuação: <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
