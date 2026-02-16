'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  emoji?: string;
  actionButton?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  emoji,
  actionButton,
}: PageHeaderProps) {
  return (
    <motion.div
      className="mb-12 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {/* Decorative blur bg */}
      <div className="absolute -inset-20 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-pink-200/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-4">
            {emoji && (
              <motion.span
                className="text-6xl"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {emoji}
              </motion.span>
            )}
            <div>
              <motion.h1
                className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {title}
              </motion.h1>
              <motion.p
                className="text-lg text-gray-700 dark:text-gray-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {subtitle}
              </motion.p>
            </div>
          </div>
        </div>
        {actionButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {actionButton}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
