'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface FillBlankGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function FillBlankGame({ game, onComplete, onQuit }: FillBlankGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = game.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === game.questions.length - 1;

  const handleSubmit = () => {
    if (answered || !userAnswer.trim()) return;
    
    setAnswered(true);
    const correct = userAnswer.toLowerCase().trim() === 
                   (currentQuestion.correctAnswer as string).toLowerCase().trim();
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
      setUserAnswer('');
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

        {/* Input Field */}
        <div className="mb-6">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            disabled={answered}
            placeholder="Digite sua resposta aqui..."
            className={`w-full px-6 py-4 rounded-xl border-2 text-lg font-medium transition-all ${
              answered
                ? userAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer as string).toLowerCase().trim()
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-white'
            } dark:bg-slate-700 dark:border-slate-600 dark:text-white`}
            autoFocus
          />
        </div>

        {/* Feedback */}
        {answered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl text-center font-semibold ${
              userAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer as string).toLowerCase().trim()
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {userAnswer.toLowerCase().trim() === (currentQuestion.correctAnswer as string).toLowerCase().trim()
              ? '✓ Correto!'
              : `✗ Incorreto. Resposta: ${currentQuestion.correctAnswer}`}
          </motion.div>
        )}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onQuit}>
          Sair
        </Button>
        {!answered ? (
          <Button
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Enviar
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
