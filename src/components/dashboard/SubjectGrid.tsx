'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SUBJECTS } from '@/lib/subjects';
import { AVATARS, getAvatarBySubjectId } from '@/lib/avatars';
import { getSubjectTheme } from '@/lib/designSystem';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SubjectProgress {
  subjectId: string;
  level: number;
  progress: number;
  xp: number;
  miniGamesCompleted: number;
}

interface SubjectGridProps {
  userProgress: Record<string, SubjectProgress>;
  onSubjectSelect: (subjectId: string) => void;
  selectedSubject?: string;
  onDialogOpen?: (subjectId: string) => void;
  onStartMiniGame?: (subjectId: string) => void;
}

const PatternBg = ({ pattern, color }: { pattern: string; color: string }) => {
  const svgPatterns: Record<string, string> = {
    grid: `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="${color}" stroke-width="0.5" opacity="0.3"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    `,
    lines: `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="lines" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="10" stroke="${color}" stroke-width="0.5" opacity="0.2"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#lines)" />
      </svg>
    `,
    molecules: `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.5" fill="${color}" opacity="0.3"/>
          <circle cx="25" cy="25" r="1.5" fill="${color}" opacity="0.3"/>
          <line x1="5" y1="5" x2="25" y2="25" stroke="${color}" stroke-width="0.5" opacity="0.2"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    `,
    code: `
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="code" width="15" height="15" patternUnits="userSpaceOnUse">
          <text x="0" y="10" font-size="8" fill="${color}" opacity="0.15">&lt;/&gt;</text>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#code)" />
      </svg>
    `,
  };

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgPatterns[pattern] || '' }}
      className="absolute inset-0"
    />
  );
};

export function SubjectGrid({
  userProgress,
  onSubjectSelect,
  selectedSubject,
  onDialogOpen,
  onStartMiniGame,
}: SubjectGridProps) {
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -12,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 10,
      },
    },
  };

  const getAvatarForSubject = (subjectId: string) => {
    return getAvatarBySubjectId(subjectId);
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {SUBJECTS.map((subject) => {
        const theme = getSubjectTheme(subject.id);
        const progress = userProgress[subject.id] || {
          subjectId: subject.id,
          level: 1,
          progress: 0,
          xp: 0,
          miniGamesCompleted: 0,
        };

        const avatar = getAvatarForSubject(subject.id);
        const isSelected = selectedSubject === subject.id;
        const isHovered = hoveredSubject === subject.id;

        return (
          <motion.div
            key={subject.id}
            variants={cardVariants}
            whileHover="hover"
            onMouseEnter={() => setHoveredSubject(subject.id)}
            onMouseLeave={() => setHoveredSubject(null)}
            onClick={() => onSubjectSelect(subject.id)}
            className="cursor-pointer group"
          >
            <div
              className={`relative overflow-hidden rounded-2xl h-full transition-all duration-300 border-2 ${
                isSelected
                  ? 'border-2 shadow-2xl'
                  : 'border-transparent hover:border-opacity-50'
              }`}
              style={
                isSelected
                  ? {
                      borderColor: theme.colors.primary,
                      boxShadow: `0 0 20px ${theme.glowColor}`,
                    }
                  : {
                      borderColor: `${theme.colors.primary}40`,
                    }
              }
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.colors.gradient} opacity-90`}
              />

              {/* Pattern Overlay */}
              <PatternBg pattern={theme.pattern} color="white" />

              {/* Animated Glow */}
              {isHovered && (
                <motion.div
                  className="absolute inset-0 opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${theme.colors.primary}, transparent)`,
                  }}
                />
              )}

              {/* Content */}
              <div className="relative p-5 h-full flex flex-col text-white z-10 justify-between">
                {/* Avatar Image - Top Center */}
                {avatar && avatar.imageUrl && (
                  <motion.div
                    className="flex justify-center mb-3"
                    animate={isHovered ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="w-24 h-24 object-cover rounded-full border-3 border-white/40 shadow-lg"
                      onError={(e) => {
                        // Se a imagem não carregar, não mostrar erro
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </motion.div>
                )}

                {/* Header: Large Emoji + Name */}
                <div className="mb-4">
                  <motion.div
                    className="text-6xl mb-2"
                    animate={isHovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {subject.emoji}
                  </motion.div>
                  <h3 className="font-black text-2xl leading-tight drop-shadow-lg">
                    {subject.name}
                  </h3>
                  <motion.p
                    className="text-sm font-bold mt-1 text-white/80"
                    animate={isHovered ? { x: 5 } : { x: 0 }}
                  >
                    Nível {progress.level}
                  </motion.p>
                </div>

                {/* Progress Bar with Animation */}
                <div className="mb-4 flex-grow">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-white/90">Progresso</span>
                    <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                      {progress.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white/80 shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.progress}%` }}
                      transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white/15 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                    <p className="text-xs text-white/70">XP</p>
                    <p className="text-lg font-bold">{progress.xp}</p>
                  </div>
                  <div className="bg-white/15 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                    <p className="text-xs text-white/70">Jogos</p>
                    <p className="text-lg font-bold">{progress.miniGamesCompleted}</p>
                  </div>
                </div>

                {/* Avatar Info + Buttons */}
                {avatar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2 mt-auto"
                  >
                    <motion.div 
                      className="text-xs font-bold text-center py-2 px-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 opacity-0 sm:opacity-100 transition-opacity"
                      animate={isHovered ? { opacity: 1, scale: 1.05 } : { opacity: 0.6, scale: 1 }}
                    >
                      👨‍🏫 {avatar.name}
                    </motion.div>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartMiniGame?.(subject.id);
                      }}
                      className="w-full text-xs sm:text-sm font-bold py-2 sm:py-3 px-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 backdrop-blur-sm border border-white/60 transition-all duration-200 text-white hover:shadow-xl font-semibold shadow-lg"
                      animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      🎮 Mini-game
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Selection Badge */}
              {isSelected && (
                <motion.div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-lg"
                  layoutId="selectedBadge"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  ✓
                </motion.div>
              )}

              {/* Hover Indicator */}
              {isHovered && !isSelected && (
                <motion.div
                  className="absolute inset-0 border-2 border-white/50 rounded-2xl pointer-events-none"
                  animate={{
                    borderColor: ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.3)'],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
