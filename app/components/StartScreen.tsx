'use client';

import { motion } from 'framer-motion';
import Poppy from './Poppy';

interface Props {
  onPlay: () => void;
}

export default function StartScreen({ onPlay }: Props) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-violet-600 via-fuchsia-500 to-orange-400">
      {/* Floating decorative circles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: 60 + i * 40,
            height: 60 + i * 40,
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
            background: `radial-gradient(circle, rgba(255,255,255,0.4), transparent)`,
          }}
          animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        />
      ))}

      {/* Title */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="text-center z-10 mb-4"
      >
        <h1 className="text-6xl font-black text-white tracking-tight drop-shadow-lg">
          Poppy
        </h1>
        <p className="text-xl font-medium text-white/80 mt-1">the Dachshund</p>
      </motion.div>

      {/* Poppy character */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="z-10 my-6"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <Poppy stage="puppy" pose="wag" size={180} />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/70 text-sm text-center max-w-xs px-4 z-10 mb-8"
      >
        Walk through five life stages of adventure, tricks, and treats!
      </motion.p>

      {/* Play button */}
      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlay}
        className="z-10 px-12 py-4 rounded-2xl text-xl font-bold text-violet-700 bg-white shadow-xl shadow-black/20 active:shadow-lg transition-shadow"
      >
        Play
      </motion.button>

      {/* Ground decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-500/40 to-transparent" />
    </div>
  );
}
