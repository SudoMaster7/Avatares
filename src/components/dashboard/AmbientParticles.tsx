'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
  id: string;
  emoji: string;
  delay: number;
}

const Particle = ({ emoji, delay }: ParticleProps) => {
  return (
    <motion.div
      className="text-2xl fixed pointer-events-none"
      initial={{
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        opacity: 0,
      }}
      animate={{
        y: -100,
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        ease: 'easeOut',
      }}
    >
      {emoji}
    </motion.div>
  );
};

export function AmbientParticles() {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const emojis = ['⭐', '✨', '🎓', '🎯', '🏆', '💡', '🚀', '⚡'];
    const initialParticles = Array.from({ length: 5 }, (_, i) => ({
      id: `particle-${i}`,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: i * 0.3,
    }));
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles((prev) => {
        const newParticles = [...prev];
        const randomIndex = Math.floor(Math.random() * newParticles.length);
        newParticles[randomIndex] = {
          id: `particle-${Date.now()}-${randomIndex}`,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          delay: 0,
        };
        return newParticles;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map((particle) => (
        <Particle key={particle.id} {...particle} />
      ))}
    </>
  );
}
