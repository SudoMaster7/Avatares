'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import type { MiniGame, GameResult } from '@/types/minigames';

interface TimelineItem {
  id: string;
  text: string;
  position: number;
}

interface TimelineGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function TimelineGame({ game, onComplete, onQuit }: TimelineGameProps) {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.duration);
  const [submitted, setSubmitted] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Inicializar itens
  useEffect(() => {
    try {
      const timelineItems = game.questions
        .filter(q => q.text)
        .map((q, idx) => ({
          id: `item-${idx}`,
          text: q.text || `Evento ${idx + 1}`,
          position: idx,
        }));

      if (timelineItems.length === 0) {
        console.error('Timeline Game: Nenhum evento válido encontrado', game.questions);
        onQuit();
        return;
      }

      // Embaralhar
      setItems(timelineItems.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error('Timeline Game initialization error:', error);
      onQuit();
    }
  }, [game, onQuit]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const draggedIdx = items.findIndex((i) => i.id === draggedId);
    const targetIdx = items.findIndex((i) => i.id === targetId);

    if (draggedIdx > -1 && targetIdx > -1) {
      const newItems = [...items];
      [newItems[draggedIdx], newItems[targetIdx]] = [newItems[targetIdx], newItems[draggedIdx]];
      setItems(newItems);
    }
  };

  const handleDrop = () => {
    setDraggedId(null);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    items.forEach((item, idx) => {
      if (item.position === idx) correctCount++;
    });

    const percentage = (correctCount / items.length) * 100;
    const gameScore = Math.floor((percentage / 100) * game.xpReward);
    setScore(gameScore);
    setSubmitted(true);
  };

  const finishGame = () => {
    onComplete({
      gameId: game.id,
      score,
      maxScore: game.xpReward,
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
            Ordem Cronológica
          </h2>
          <div className="text-xl font-bold text-blue-600">
            {timeLeft}s
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Arraste os itens para colocá-los em ordem cronológica
        </p>
      </div>

      {/* Timeline Items */}
      <motion.div className="mb-8 space-y-3">
        <AnimatePresence>
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDrop={handleDrop}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`p-4 rounded-lg border-2 cursor-move transition-all ${
                submitted
                  ? item.position === idx
                    ? 'bg-green-100 dark:bg-green-900/30 border-green-500'
                    : 'bg-red-100 dark:bg-red-900/30 border-red-500'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{idx + 1}.</p>
                  <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                </div>
                {submitted && (
                  item.position === idx ? (
                    <span className="text-2xl">✅</span>
                  ) : (
                    <span className="text-2xl">❌</span>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Result Message */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-lg font-semibold mb-6 text-center ${
              score >= game.xpReward * 0.8
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
            }`}
          >
            Pontuação: {score}/{game.xpReward}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onQuit}
          variant="outline"
          className="flex-1"
        >
          Sair
        </Button>
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Verificar
          </Button>
        ) : (
          <Button
            onClick={finishGame}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Finalizar
          </Button>
        )}
      </div>
    </motion.div>
  );
}
