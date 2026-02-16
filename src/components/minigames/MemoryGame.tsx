'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface Card {
  id: string;
  value: string;
  flipped: boolean;
  matched: boolean;
}

interface MemoryGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function MemoryGame({ game, onComplete, onQuit }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.duration);
  const [moves, setMoves] = useState(0);

  // Inicializar cartas
  useEffect(() => {
    try {
      // Filtrar perguntas que têm correctAnswer válido
      const validQuestions = game.questions.filter(q => q.correctAnswer && q.id);
      
      if (validQuestions.length === 0) {
        console.error('Memory Game: Nenhuma questão válida encontrada', game.questions);
        onQuit();
        return;
      }

      const pairs = validQuestions.map((q) => ({
        id: q.id!,
        value: q.correctAnswer as string,
      }));

      const cardList: Card[] = [];
      pairs.forEach((pair) => {
        cardList.push({ id: `${pair.id}-1`, value: pair.value, flipped: false, matched: false });
        cardList.push({ id: `${pair.id}-2`, value: pair.value, flipped: false, matched: false });
      });

      setCards(cardList.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Memory Game initialization error:', error);
      onQuit();
    }
  }, [game, onQuit]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || matched.length === cards.length) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, matched, cards]);

  const handleCardClick = (id: string) => {
    if (flipped.includes(id) || matched.includes(id)) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard?.value === secondCard?.value) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        setScore(score + 100);
      } else {
        setTimeout(() => setFlipped([]), 1000);
        setScore(Math.max(0, score - 10));
      }
    }
  };

  const finishGame = () => {
    onComplete({
      gameId: game.id,
      score: Math.max(0, score),
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
            Jogo da Memória
          </h2>
          <div className="text-xl font-bold text-blue-600">
            {timeLeft}s
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pares Encontrados</p>
            <p className="text-2xl font-bold text-green-600">{matched.length / 2}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Movimentos</p>
            <p className="text-2xl font-bold text-orange-600">{moves}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pontuação</p>
            <p className="text-2xl font-bold text-blue-600">{score}</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <motion.div
        className="grid grid-cols-4 gap-3 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {cards.map((card) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square rounded-lg font-bold text-lg transition-all ${
              matched.includes(card.id)
                ? 'bg-green-500 text-white cursor-default'
                : flipped.includes(card.id)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-400'
            }`}
            whileHover={!matched.includes(card.id) ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
            disabled={matched.includes(card.id)}
          >
            {flipped.includes(card.id) || matched.includes(card.id) ? (
              <motion.span
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
              >
                {card.value}
              </motion.span>
            ) : (
              '?'
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onQuit}
          variant="outline"
          className="flex-1"
        >
          Sair
        </Button>
        {matched.length === cards.length && (
          <Button
            onClick={finishGame}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            ✅ Completado!
          </Button>
        )}
      </div>
    </motion.div>
  );
}
