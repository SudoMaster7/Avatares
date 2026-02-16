'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getSubjectTheme } from '@/lib/designSystem';

interface FloatingCardProps {
  subjectId: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'featured' | 'compact';
}

export function FloatingCard({
  subjectId,
  title,
  description,
  action,
  variant = 'compact',
}: FloatingCardProps) {
  const theme = getSubjectTheme(subjectId);

  const cardVariants = {
    initial: { y: 0 },
    hover: {
      y: -12,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 10,
      },
    },
  };

  const shadowVariants = {
    initial: { boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1)` },
    hover: {
      boxShadow: `0 24px 48px ${theme.glowColor}`,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 10,
      },
    },
  };

  if (variant === 'featured') {
    return (
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer"
      >
        {/* Background gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.colors.gradient}`}
        />

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12" />
        </div>

        {/* Content */}
        <div className="relative h-full p-8 flex flex-col justify-between text-white">
          <div>
            <div className="text-5xl mb-3">{theme.emoji}</div>
            <h3 className="text-2xl font-black drop-shadow-lg">{title}</h3>
          </div>
          <p className="text-white/90 text-sm drop-shadow-lg">{description}</p>
        </div>

        {/* Bottom accent */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-white/50"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="group"
    >
      <motion.div
        variants={shadowVariants}
        initial="initial"
        whileHover="hover"
        className="bg-white dark:bg-slate-800 rounded-2xl p-4 border-2 border-gray-100 dark:border-slate-700"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{theme.emoji}</div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {title}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        {action && <div className="mt-4">{action}</div>}
      </motion.div>
    </motion.div>
  );
}
