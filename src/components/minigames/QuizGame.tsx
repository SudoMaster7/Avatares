'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface QuizGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function QuizGame({ game, onComplete, onQuit }: QuizGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = game.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === game.questions.length - 1;

  const handleAnswerClick = (option: string) => {
    if (answered) return;
    setSelectedAnswer(option);
    setAnswered(true);

    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const duration = (Date.now() - startTime) / 1000;
      const result: GameResult = {
        gameId: game.id,
        score,
        maxScore: game.questions.length,
        xpEarned: Math.round((score / game.questions.length) * game.xpReward),
        duration,
        completedAt: new Date(),
        correct: score,
        total: game.questions.length,
      };
      onComplete(result);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {currentQuestion.text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswerClick(option)}
              disabled={answered}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                selectedAnswer === option
                  ? option === currentQuestion.correctAnswer
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : answered && option === currentQuestion.correctAnswer
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
              } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onQuit}>
          Sair
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answered}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLastQuestion ? 'Finalizar' : 'Próxima'}
        </Button>
      </div>
    </div>
  );
}
