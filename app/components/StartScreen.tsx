'use client';

import { motion } from 'framer-motion';
import Poppy from './Poppy';

interface Props {
  onPlay: () => void;
}

export default function StartScreen({ onPlay }: Props) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-10"
          style={{
            width: 200 + i * 60,
            height: 200 + i * 60,
            borderRadius: '50%',
            left: `${30 + i * 5}%`,
            top: `${20 + (i % 3) * 15}%`,
            background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="text-center z-10 mb-6"
      >
        <h1 className="text-5xl font-black text-amber-900 tracking-tight">Poppy</h1>
        <p className="text-lg font-medium text-amber-700/70 mt-1">the Dachshund</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        className="z-10 my-4"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        <Poppy pose="wag" size={200} />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-amber-800/60 text-sm text-center max-w-xs px-4 z-10 mb-8"
      >
        Take Poppy on adventures around town!
      </motion.p>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlay}
        className="z-10 px-12 py-4 rounded-2xl text-xl font-bold text-white bg-amber-600 shadow-lg shadow-amber-600/30 active:shadow-md transition-shadow"
      >
        Let&apos;s Go!
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-200/50 to-transparent" />
    </div>
  );
}
