'use client';

import { motion } from 'framer-motion';
import Poppy from './Poppy';
import { LOCATIONS } from '../types';
import type { Location } from '../types';

interface Props {
  visited: Location[];
  onPick: (loc: Location) => void;
  onQuit: () => void;
}

export default function LocationPicker({ visited, onPick, onQuit }: Props) {
  const available = LOCATIONS.filter(l => !visited.includes(l.id));

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 px-6">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-4 z-10"
      >
        <h2 className="text-2xl font-black text-amber-900">Where to next?</h2>
        <p className="text-amber-700/60 text-sm mt-1">Choose Poppy&apos;s next adventure</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="z-10 mb-6"
      >
        <Poppy pose="wag" size={100} />
      </motion.div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm z-10">
        {available.map((loc, i) => (
          <motion.button
            key={loc.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPick(loc.id)}
            className="flex flex-col items-center gap-1 py-4 px-3 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/50 shadow-md active:shadow-sm transition-shadow"
          >
            <span className="text-3xl">{loc.emoji}</span>
            <span className="text-amber-900 font-bold text-sm">{loc.label}</span>
          </motion.button>
        ))}
      </div>

      {available.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center z-10"
        >
          <p className="text-amber-800 text-lg font-bold mb-4">🎉 You&apos;ve explored everywhere!</p>
          <button
            onClick={onQuit}
            className="px-8 py-3 rounded-2xl text-lg font-bold text-white bg-amber-600 shadow-lg"
          >
            Play Again
          </button>
        </motion.div>
      )}

      <button
        onClick={onQuit}
        className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-amber-900/70 bg-white/60 backdrop-blur-md border border-white/40"
      >
        ✕
      </button>
    </div>
  );
}
