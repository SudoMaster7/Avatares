'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface TrueFalseGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function TrueFalseGame({ game, onComplete, onQuit }: TrueFalseGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = game.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === game.questions.length - 1;

  const handleAnswer = (answer: boolean) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);

    const correct = answer === (currentQuestion.correctAnswer === 'verdadeiro');
    if (correct) {
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
        className="bg-white dark:bg-slate-800 rounded-2xl p-12 mb-8 shadow-lg text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {currentQuestion.text}
        </h2>

        {/* True/False Buttons */}
        <div className="flex gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(true)}
            disabled={answered}
            className={`px-12 py-6 rounded-2xl text-xl font-bold transition-all ${
              selectedAnswer === true
                ? currentQuestion.correctAnswer === 'verdadeiro'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : answered && currentQuestion.correctAnswer === 'verdadeiro'
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            ✓ Verdadeiro
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswer(false)}
            disabled={answered}
            className={`px-12 py-6 rounded-2xl text-xl font-bold transition-all ${
              selectedAnswer === false
                ? currentQuestion.correctAnswer === 'falso'
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : answered && currentQuestion.correctAnswer === 'falso'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            } ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          >
            ✗ Falso
          </motion.button>
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
