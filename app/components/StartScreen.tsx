'use client';

import { motion } from 'framer-motion';
import Poppy from './Poppy';

interface Props {
  onPlay: () => void;
  onJournal: () => void;
  treats: number;
  collectedCount: number;
}

const FLOATING_EMOJIS = ['🦴', '🐾', '⭐', '🎾', '❤️', '🌟', '🐶', '💛', '🏆', '✨', '🎀', '🌈'];

export default function StartScreen({ onPlay, onJournal, treats, collectedCount }: Props) {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #FF8A65 15%, #FBBF24 30%, #4ADE80 50%, #38BDF8 70%, #A78BFA 85%, #EC4899 100%)',
      }}
    >
      {/* Animated pixel pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full pixel-art" viewBox="0 0 200 200" preserveAspectRatio="none">
          {Array.from({ length: 20 }, (_, i) =>
            Array.from({ length: 20 }, (_, j) => (
              (i + j) % 3 === 0 ? <rect key={`${i}-${j}`} x={i * 10} y={j * 10} width={10} height={10} fill="white" /> : null
            ))
          )}
        </svg>
      </div>

      {/* Floating emoji particles */}
      {FLOATING_EMOJIS.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: `${8 + (i * 7.5) % 85}%`,
            top: `${10 + (i * 13) % 75}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, i % 2 === 0 ? 10 : -10, 0],
            rotate: [0, i % 2 === 0 ? 15 : -15, 0],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.div>
      ))}

      {/* Colourful circles background */}
      {[
        { color: '#FF6B9D', x: '10%', y: '15%', size: 180 },
        { color: '#FBBF24', x: '75%', y: '10%', size: 140 },
        { color: '#4ADE80', x: '85%', y: '60%', size: 160 },
        { color: '#38BDF8', x: '5%', y: '70%', size: 120 },
        { color: '#A78BFA', x: '50%', y: '80%', size: 200 },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20 blur-xl"
          style={{ left: c.x, top: c.y, width: c.size, height: c.size, backgroundColor: c.color }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* Title */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="text-center z-10 mb-4"
      >
        <motion.h1
          className="text-6xl font-black tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #FFF 0%, #FDE047 30%, #FFF 50%, #F472B6 70%, #FFF 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
          }}
        >
          Poppy
        </motion.h1>
        <motion.p
          className="text-xl font-bold text-white/90 mt-1 drop-shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          the Dachshund
        </motion.p>
      </motion.div>

      {/* Poppy */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className="z-10 my-4"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Poppy pose="wag" size={220} />
        </motion.div>
      </motion.div>

      {/* Stats bar */}
      {(treats > 0 || collectedCount > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="z-10 flex items-center gap-3 mb-4"
        >
          <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur text-white font-bold text-sm flex items-center gap-1.5">
            🦴 {treats} treats
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur text-white font-bold text-sm flex items-center gap-1.5">
            ⭐ {collectedCount} found
          </div>
        </motion.div>
      )}

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-white/80 text-sm text-center max-w-xs px-4 z-10 mb-6 font-medium drop-shadow"
      >
        Take Poppy on pixel adventures around town!
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        className="z-10 flex flex-col items-center gap-3"
      >
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onPlay}
          className="px-14 py-4 rounded-2xl text-xl font-black text-white shadow-xl active:shadow-md transition-shadow"
          style={{
            background: 'linear-gradient(135deg, #FF6B9D, #FF3D7F)',
            boxShadow: '0 8px 24px rgba(255,61,127,0.4)',
          }}
        >
          Let&apos;s Go! 🐾
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onJournal}
          className="px-8 py-3 rounded-xl text-sm font-bold text-white/90 bg-white/20 backdrop-blur border border-white/30 active:bg-white/30"
        >
          📖 Collection Journal
        </motion.button>
      </motion.div>

      {/* Bottom paw prints */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-30">
        {['🐾', '🐾', '🐾', '🐾', '🐾'].map((p, i) => (
          <motion.span
            key={i}
            className="text-2xl"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {p}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
