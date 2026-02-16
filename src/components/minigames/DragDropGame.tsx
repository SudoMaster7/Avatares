'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { MiniGame, GameResult } from '@/types/minigames';

interface DragItem {
  id: string;
  text: string;
  category?: string;
}

interface DragDropGameProps {
  game: MiniGame;
  onComplete: (result: GameResult) => void;
  onQuit: () => void;
}

export function DragDropGame({ game, onComplete, onQuit }: DragDropGameProps) {
  const [items, setItems] = useState<DragItem[]>([]);
  const [dropZones, setDropZones] = useState<Record<string, DragItem[]>>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.duration);
  const [submitted, setSubmitted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  useEffect(() => {
    try {
      if (!game.questions || game.questions.length === 0) {
        console.error('DragDrop: No questions found');
        return;
      }

      const question = game.questions[0];
      
      // Para DragDrop, items vem em q.items e categorias em q.options
      const itemsList: DragItem[] = [];
      const categoriesMap = new Map<string, string[]>();

      // Se tem items array, mapear cada item
      if (question.items && Array.isArray(question.items)) {
        question.items.forEach((item: string) => {
          itemsList.push({
            id: `item-${item}`,
            text: item,
            category: undefined,
          });
        });
      }

      // Se tem options como categorias (keys do correctAnswer)
      if (question.options && Array.isArray(question.options)) {
        question.options.forEach((cat: string) => {
          categoriesMap.set(cat, []);
        });
      }

      // Se tem correctAnswer como mapa de categories
      if (question.correctAnswer && typeof question.correctAnswer === 'object') {
        Object.keys(question.correctAnswer).forEach((cat) => {
          categoriesMap.set(cat, []);
        });
      }

      setItems(itemsList);

      // Inicializar zonas de drop com as categorias
      const zones: Record<string, DragItem[]> = {};
      categoriesMap.forEach((_, cat) => {
        zones[cat] = [];
      });
      
      // Se não tem categorias, criar default
      if (Object.keys(zones).length === 0) {
        zones['default'] = [];
      }

      setDropZones(zones);
    } catch (error) {
      console.error('DragDrop initialization error:', error);
    }
  }, [game]);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishGame();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleDragStart = (item: DragItem) => {
    setDraggedItem(item);
  };

  const handleDropZone = (zone: string) => {
    if (!draggedItem) return;

    const newDropZones = { ...dropZones };
    if (!newDropZones[zone]) newDropZones[zone] = [];

    // Remover do dropdown anterior se existir
    Object.keys(newDropZones).forEach((z) => {
      newDropZones[z] = newDropZones[z].filter((i) => i.id !== draggedItem.id);
    });

    // Adicionar à nova zona
    newDropZones[zone] = [...newDropZones[zone], draggedItem];
    setDropZones(newDropZones);
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    items.forEach((item) => {
      if (dropZones[item.category || 'default']?.some((i) => i.id === item.id)) {
        correctCount++;
      }
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

  const zones = Object.keys(dropZones);
  const unplacedItems = items.filter(
    (item) => !Object.values(dropZones).some((zone) => zone.some((i) => i.id === item.id))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Arraste e Solte
          </h2>
          <div className="text-xl font-bold text-blue-600">
            {timeLeft}s
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Arraste os itens para suas categorias corretas
        </p>
      </div>

      {/* Items to Drag */}
      <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="font-semibold text-gray-900 dark:text-white mb-3">Itens para classificar:</p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {unplacedItems.map((item) => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold cursor-move hover:shadow-lg transition-shadow"
              >
                {item.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {zones.map((zone) => (
          <motion.div
            key={zone}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDropZone(zone)}
            className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg min-h-[200px] bg-gray-50 dark:bg-gray-900/50"
          >
            <p className="font-semibold text-gray-900 dark:text-white mb-3 capitalize">
              {zone}
            </p>
            <div className="space-y-2">
              <AnimatePresence>
                {dropZones[zone]?.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`p-3 rounded-lg font-semibold ${
                      submitted && item.category === zone
                        ? 'bg-green-500 text-white'
                        : submitted
                        ? 'bg-red-500 text-white'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}
                  >
                    {item.text}
                    {submitted && (
                      <span className="ml-2">{item.category === zone ? '✅' : '❌'}</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
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
            Finalizar ({score}/{game.xpReward})
          </Button>
        )}
      </div>
    </motion.div>
  );
}
