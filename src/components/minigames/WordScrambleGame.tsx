'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { MiniGame, GameResult } from '@/types/minigames';

interface WordScrambleGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function WordScrambleGame({ game, onComplete, onQuit }: WordScrambleGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.duration);
  const [scrambled, setScrambled] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = game.questions[currentIndex];
  const correctWord = currentQuestion.correctAnswer as string;

  useEffect(() => {
    if (currentQuestion) {
      setScrambled(shuffleWord(correctWord));
      setInput('');
      setAnswered(false);
    }
  }, [currentIndex, currentQuestion]);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const shuffleWord = (word: string) => {
    return word
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const handleSubmit = () => {
    const isCorrectAnswer = input.toLowerCase().trim() === correctWord.toLowerCase().trim();
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
            Embaralhador de Palavras
          </h2>
          <div className="text-xl font-bold text-blue-600">
            {timeLeft}s
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / game.questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Pergunta {currentIndex + 1} de {game.questions.length}
        </p>
      </div>

      {/* Scrambled Word Display */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8 p-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-300 dark:border-purple-600"
      >
        <p className="text-gray-700 dark:text-gray-300 text-center mb-4 font-medium">
          {currentQuestion?.text}
        </p>
        <div className="text-4xl font-bold text-center text-purple-600 dark:text-purple-400 tracking-widest">
          {scrambled}
        </div>
        {currentQuestion?.hint && (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-3 italic">
            💡 Dica: {currentQuestion.hint}
          </p>
        )}
      </motion.div>

      {/* Input */}
      <div className="mb-6 space-y-3">
        <Input
          type="text"
          placeholder="Digite a palavra..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !answered && handleSubmit()}
          disabled={answered}
          className="text-lg py-3"
        />
        
        {answered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg font-semibold ${
              isCorrect
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}
          >
            {isCorrect ? (
              <>✅ Correto! A palavra é "{correctWord}"</>
            ) : (
              <>❌ Incorreto! A resposta correta é "{correctWord}"</>
            )}
          </motion.div>
        )}
      </div>

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
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Enviar
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
