'use client';

import { motion } from 'framer-motion';
import Poppy from './Poppy';
import { StageResult, STAGES } from '../page';

interface Props {
  results: StageResult[];
  onRestart: () => void;
}

export default function ResultsScreen({ results, onRestart }: Props) {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const totalTreats = results.reduce((sum, r) => sum + r.treats, 0);
  const totalTricks = results.reduce((sum, r) => sum + r.tricks, 0);
  const avgStars = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.stars, 0) / results.length)
    : 0;

  return (
    <div className="relative h-full w-full flex flex-col items-center overflow-y-auto bg-gradient-to-b from-indigo-900 via-purple-800 to-fuchsia-700 py-10 px-4">
      {/* Stars background */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center z-10 mb-6"
      >
        <h1 className="text-4xl font-black text-white mb-1">Journey Complete!</h1>
        <p className="text-white/60 text-sm">Poppy&apos;s life adventure</p>
      </motion.div>

      {/* Poppy celebration */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="z-10 mb-6"
      >
        <Poppy stage="adult" pose="wag" size={120} />
      </motion.div>

      {/* Total score card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="z-10 w-full max-w-sm bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-5 mb-4"
      >
        <div className="text-center mb-3">
          <div className="text-amber-300 text-4xl font-black">{totalScore}</div>
          <div className="text-white/60 text-sm">Total Score</div>
        </div>
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl">{'⭐'.repeat(avgStars)}</div>
            <div className="text-white/50 text-xs mt-0.5">Stars</div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-300">{totalTreats}</div>
            <div className="text-white/50 text-xs mt-0.5">Treats</div>
          </div>
          <div>
            <div className="text-xl font-bold text-violet-300">{totalTricks}</div>
            <div className="text-white/50 text-xs mt-0.5">Tricks</div>
          </div>
        </div>
      </motion.div>

      {/* Stage breakdown */}
      <div className="z-10 w-full max-w-sm space-y-2 mb-6">
        {results.map((result, i) => {
          const stageInfo = STAGES.find(s => s.id === result.stage);
          return (
            <motion.div
              key={result.stage}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3"
            >
              <span className="text-xl">{stageInfo?.emoji}</span>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{stageInfo?.label}</div>
                <div className="text-white/40 text-xs">{stageInfo?.age}</div>
              </div>
              <div className="text-right">
                <div className="text-amber-200 font-bold text-sm">{result.score}</div>
                <div className="text-white/40 text-xs">
                  {result.treats}🦴 {result.tricks}🎯
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Play again button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="z-10 px-10 py-3.5 rounded-2xl text-lg font-bold text-purple-700 bg-white shadow-xl shadow-black/20 active:shadow-lg transition-shadow"
      >
        Play Again
      </motion.button>

      <div className="h-10" />
    </div>
  );
}
