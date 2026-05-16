'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface Props {
  type: 'fetch' | 'dig' | 'chase';
  emoji: string;
  label: string;
  onComplete: (success: boolean) => void;
}

/* ─── FETCH: tap when the emoji crosses the target zone ─── */
function FetchGame({ emoji, onComplete }: { emoji: string; onComplete: (s: boolean) => void }) {
  const [pos, setPos] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hits, setHits] = useState(0);
  const dir = useRef(1);
  const posRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      posRef.current += dir.current * 4;
      if (posRef.current > 100 || posRef.current < 0) dir.current *= -1;
      setPos(posRef.current);
    }, 30);
    return () => clearInterval(id);
  }, []);

  const handleTap = () => {
    const inZone = posRef.current > 40 && posRef.current < 60;
    if (inZone) {
      setHits(h => {
        if (h + 1 >= 3) setTimeout(() => onComplete(true), 300);
        return h + 1;
      });
    }
    setAttempts(a => {
      if (a + 1 >= 6 && hits < 3) setTimeout(() => onComplete(false), 300);
      return a + 1;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full" onPointerDown={handleTap}>
      <p className="text-white font-bold text-sm">Tap when {emoji} is in the green zone!</p>
      <div className="relative w-[80%] h-12 bg-black/30 rounded-full overflow-hidden">
        <div className="absolute left-[40%] w-[20%] h-full bg-green-500/40 rounded" />
        <motion.div
          className="absolute top-1 text-3xl"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
        >
          {emoji}
        </motion.div>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full ${i < hits ? 'bg-green-400' : 'bg-white/20'}`} />
        ))}
      </div>
      <p className="text-white/60 text-xs">{attempts}/6 attempts</p>
    </div>
  );
}

/* ─── DIG: tap rapidly to fill the bar ─── */
function DigGame({ emoji, onComplete }: { emoji: string; onComplete: (s: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const progRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(id);
          setTimeout(() => onComplete(progRef.current >= 100), 300);
          return 0;
        }
        // Progress decays slowly
        progRef.current = Math.max(0, progRef.current - 1);
        setProgress(progRef.current);
        return +(t - 0.1).toFixed(1);
      });
    }, 100);
    return () => clearInterval(id);
  }, [onComplete]);

  const handleTap = () => {
    progRef.current = Math.min(100, progRef.current + 8);
    setProgress(progRef.current);
    if (progRef.current >= 100) {
      setTimeout(() => onComplete(true), 200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full" onPointerDown={handleTap}>
      <p className="text-white font-bold text-sm">Tap fast to dig up the {emoji}!</p>
      <div className="text-5xl animate-bounce">{emoji}</div>
      <div className="w-[80%] h-6 bg-black/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
          animate={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-white/60 text-xs">{timeLeft.toFixed(1)}s left</p>
    </div>
  );
}

/* ─── CHASE: tap the moving emoji 3 times ─── */
function ChaseGame({ emoji, onComplete }: { emoji: string; onComplete: (s: boolean) => void }) {
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const [hits, setHits] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(id);
          setTimeout(() => onComplete(false), 300);
          return 0;
        }
        return +(t - 0.1).toFixed(1);
      });
    }, 100);
    return () => clearInterval(id);
  }, [onComplete]);

  // Move target randomly every 1.2 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setTargetPos({ x: 15 + Math.random() * 70, y: 20 + Math.random() * 60 });
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const handleCatch = (e: React.PointerEvent) => {
    e.stopPropagation();
    setHits(h => {
      if (h + 1 >= 3) setTimeout(() => onComplete(true), 300);
      return h + 1;
    });
    setTargetPos({ x: 15 + Math.random() * 70, y: 20 + Math.random() * 60 });
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full h-full relative">
      <p className="text-white font-bold text-sm z-10">Tap the {emoji} three times!</p>
      <div className="flex gap-2 z-10">
        {[0, 1, 2].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full ${i < hits ? 'bg-green-400' : 'bg-white/20'}`} />
        ))}
      </div>
      <motion.div
        className="absolute text-5xl cursor-pointer z-10"
        style={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
        animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        onPointerDown={handleCatch}
      >
        {emoji}
      </motion.div>
      <p className="absolute bottom-4 text-white/60 text-xs z-10">{timeLeft.toFixed(1)}s</p>
    </div>
  );
}

export default function MiniGame({ type, emoji, label, onComplete }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-[85%] max-w-sm h-[60%] bg-black/40 backdrop-blur rounded-3xl p-6 flex flex-col items-center justify-center">
        {type === 'fetch' && <FetchGame emoji={emoji} onComplete={onComplete} />}
        {type === 'dig' && <DigGame emoji={emoji} onComplete={onComplete} />}
        {type === 'chase' && <ChaseGame emoji={emoji} onComplete={onComplete} />}
      </div>
    </motion.div>
  );
}
