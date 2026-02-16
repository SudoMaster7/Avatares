'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface MatchingGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function MatchingGame({ game, onComplete, onQuit }: MatchingGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = game.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === game.questions.length - 1;
  const pairs = currentQuestion.pairs || [];

  const handleMatch = (left: string, right: string) => {
    if (answered) return;
    const newMatches = { ...matches };
    if (newMatches[left] === right) {
      delete newMatches[left];
    } else {
      newMatches[left] = right;
    }
    setMatches(newMatches);
  };

  const handleSubmit = () => {
    if (answered) return;
    
    let correct = 0;
    pairs.forEach(({ left, right }) => {
      if (matches[left] === right) {
        correct++;
      }
    });

    setScore(score + correct);
    setAnswered(true);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const duration = (Date.now() - startTime) / 1000;
      const result: GameResult = {
        gameId: game.id,
        score,
        maxScore: game.questions.length * 5, // Assumindo 5 pares por questão
        xpEarned: Math.round((score / (game.questions.length * 5)) * game.xpReward),
        duration,
        completedAt: new Date(),
        correct: score,
        total: game.questions.length * 5,
      };
      onComplete(result);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMatches({});
      setAnswered(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Pergunta {currentQuestionIndex + 1}/{game.questions.length}
          </span>
          <span className="font-semibold text-blue-600">Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / game.questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Emparethe os itens relacionados:
        </h2>

        {/* Matching Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Side */}
          <div className="space-y-3">
            {pairs.map(({ left }) => (
              <button
                key={left}
                onClick={() => {
                  // Lógica de seleção simplificada
                  if (pairs[0]?.right) {
                    handleMatch(left, pairs[0].right);
                  }
                }}
                className={`w-full p-4 rounded-xl font-medium text-left transition-all ${
                  Object.values(matches).includes(left)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200'
                } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {left}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="space-y-3">
            {pairs.map(({ right }) => (
              <button
                key={right}
                className={`w-full p-4 rounded-xl font-medium text-left transition-all ${
                  Object.values(matches).includes(right)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200'
                } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {right}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onQuit}>
          Sair
        </Button>
        {!answered ? (
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Verificar
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLastQuestion ? 'Finalizar' : 'Próxima'}
          </Button>
        )}
      </div>
    </div>
  );
}
