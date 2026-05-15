'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Poppy from './Poppy';
import { LifeStage, StageResult } from '../page';

interface StageConfig {
  id: LifeStage;
  label: string;
  age: string;
  gradient: string;
  emoji: string;
}

interface Props {
  stage: StageConfig;
  stageIndex: number;
  onComplete: (result: StageResult) => void;
  onQuit: () => void;
}

type Encounter = {
  id: number;
  type: 'treat' | 'trick' | 'obstacle';
  x: number;
  emoji: string;
  label: string;
  collected: boolean;
  passed: boolean;
};

const SCENE_LENGTH = 3000;
const WALK_SPEED = 2.5;
const ENCOUNTER_TYPES: Record<LifeStage, { treats: string[]; tricks: string[]; obstacles: string[] }> = {
  puppy: {
    treats: ['🦴', '🧸', '🥛'],
    tricks: ['🐾', '📣', '🎾'],
    obstacles: ['🪨', '💧', '🐱'],
  },
  junior: {
    treats: ['🦴', '🌭', '🍖'],
    tricks: ['🎾', '🦮', '🏃'],
    obstacles: ['🚗', '🌊', '🐕'],
  },
  adolescent: {
    treats: ['🍖', '🧀', '🍗'],
    tricks: ['🎯', '💨', '🦮'],
    obstacles: ['🌧️', '🐍', '🚧'],
  },
  adult: {
    treats: ['🥩', '🧀', '🍖'],
    tricks: ['🏆', '🎪', '🦮'],
    obstacles: ['🌩️', '🐻', '🚜'],
  },
  senior: {
    treats: ['🦴', '🛋️', '☀️'],
    tricks: ['🐾', '🎵', '💤'],
    obstacles: ['🪨', '🌧️', '🐈'],
  },
};

function generateEncounters(stage: LifeStage): Encounter[] {
  const types = ENCOUNTER_TYPES[stage];
  const encounters: Encounter[] = [];
  let id = 0;
  const spacing = SCENE_LENGTH / 16;

  for (let i = 1; i <= 14; i++) {
    const x = spacing * i + (Math.random() - 0.5) * spacing * 0.4;
    const roll = Math.random();
    let type: 'treat' | 'trick' | 'obstacle';
    let pool: string[];

    if (roll < 0.4) {
      type = 'treat';
      pool = types.treats;
    } else if (roll < 0.7) {
      type = 'trick';
      pool = types.tricks;
    } else {
      type = 'obstacle';
      pool = types.obstacles;
    }

    const emoji = pool[Math.floor(Math.random() * pool.length)];
    const labels: Record<string, string> = {
      treat: 'Treat!',
      trick: 'Trick!',
      obstacle: 'Watch out!',
    };

    encounters.push({
      id: id++,
      type,
      x,
      emoji,
      label: labels[type],
      collected: false,
      passed: false,
    });
  }

  return encounters.sort((a, b) => a.x - b.x);
}

const SKY_COLORS: Record<LifeStage, { top: string; mid: string; bottom: string }> = {
  puppy: { top: '#065F46', mid: '#10B981', bottom: '#6EE7B7' },
  junior: { top: '#92400E', mid: '#F59E0B', bottom: '#FDE68A' },
  adolescent: { top: '#4C1D95', mid: '#8B5CF6', bottom: '#DDD6FE' },
  adult: { top: '#1E3A5F', mid: '#3B82F6', bottom: '#93C5FD' },
  senior: { top: '#9D174D', mid: '#F472B6', bottom: '#FECDD3' },
};

const GROUND_COLORS: Record<LifeStage, { grass: string; dirt: string; path: string }> = {
  puppy: { grass: '#059669', dirt: '#92400E', path: '#D97706' },
  junior: { grass: '#65A30D', dirt: '#78350F', path: '#A16207' },
  adolescent: { grass: '#7C3AED', dirt: '#581C87', path: '#A855F7' },
  adult: { grass: '#2563EB', dirt: '#1E3A5F', path: '#60A5FA' },
  senior: { grass: '#DB2777', dirt: '#9D174D', path: '#F9A8D4' },
};

function SceneryItem({ type, x, stage }: { type: string; x: number; stage: LifeStage }) {
  const colors = GROUND_COLORS[stage];
  switch (type) {
    case 'tree':
      return (
        <g transform={`translate(${x}, 0)`}>
          <rect x={-3} y={-35} width={6} height={35} rx={2} fill="#78350F" />
          <circle cx={0} cy={-42} r={16} fill={colors.grass} opacity={0.9} />
          <circle cx={-8} cy={-36} r={12} fill={colors.grass} opacity={0.8} />
          <circle cx={8} cy={-36} r={12} fill={colors.grass} opacity={0.8} />
        </g>
      );
    case 'bush':
      return (
        <g transform={`translate(${x}, 0)`}>
          <ellipse cx={0} cy={-6} rx={12} ry={8} fill={colors.grass} opacity={0.7} />
          <ellipse cx={6} cy={-4} rx={8} ry={6} fill={colors.grass} opacity={0.6} />
        </g>
      );
    case 'flower':
      return (
        <g transform={`translate(${x}, 0)`}>
          <line x1={0} y1={0} x2={0} y2={-14} stroke="#059669" strokeWidth={1.5} />
          <circle cx={0} cy={-16} r={4} fill="#F472B6" />
          <circle cx={0} cy={-16} r={2} fill="#FBBF24" />
        </g>
      );
    case 'rock':
      return (
        <g transform={`translate(${x}, 0)`}>
          <ellipse cx={0} cy={-3} rx={8} ry={5} fill="#9CA3AF" />
          <ellipse cx={-2} cy={-5} rx={5} ry={3} fill="#D1D5DB" />
        </g>
      );
    default:
      return null;
  }
}

function generateScenery(stage: LifeStage): { type: string; x: number; layer: number }[] {
  const items: { type: string; x: number; layer: number }[] = [];
  const types = ['tree', 'bush', 'flower', 'rock'];
  for (let i = 0; i < 40; i++) {
    items.push({
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * SCENE_LENGTH,
      layer: Math.random() < 0.5 ? 0 : 1,
    });
  }
  return items.sort((a, b) => a.x - b.x);
}

export default function GameScene({ stage, stageIndex, onComplete, onQuit }: Props) {
  const [scrollX, setScrollX] = useState(0);
  const [encounters, setEncounters] = useState<Encounter[]>(() => generateEncounters(stage.id));
  const [scenery] = useState(() => generateScenery(stage.id));
  const [score, setScore] = useState(0);
  const [treats, setTreats] = useState(0);
  const [tricks, setTricks] = useState(0);
  const [stars, setStars] = useState(0);
  const [popup, setPopup] = useState<{ text: string; color: string; key: number } | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [jumpY, setJumpY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [stageComplete, setStageComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const animRef = useRef<number>(0);
  const walkingRef = useRef(false);
  const scrollRef = useRef(0);
  const popupKey = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sky = SKY_COLORS[stage.id];
  const ground = GROUND_COLORS[stage.id];
  const progress = Math.min(scrollX / SCENE_LENGTH, 1);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEncounter = useCallback((enc: Encounter) => {
    if (enc.collected || enc.passed) return;

    setEncounters(prev =>
      prev.map(e => (e.id === enc.id ? { ...e, collected: true } : e))
    );

    popupKey.current++;
    const key = popupKey.current;

    if (enc.type === 'treat') {
      setScore(s => s + 10);
      setTreats(t => t + 1);
      setPopup({ text: `${enc.emoji} +10`, color: '#34D399', key });
    } else if (enc.type === 'trick') {
      setScore(s => s + 25);
      setTricks(t => t + 1);
      setStars(s => Math.min(s + 1, 3));
      setPopup({ text: `${enc.emoji} +25`, color: '#A78BFA', key });
    } else {
      setScore(s => Math.max(0, s - 15));
      setPopup({ text: `${enc.emoji} -15`, color: '#F87171', key });
    }

    setTimeout(() => setPopup(p => (p?.key === key ? null : p)), 1200);
  }, []);

  const handleJump = useCallback(() => {
    if (isJumping) return;
    setIsJumping(true);
    let t = 0;
    const jumpAnim = () => {
      t += 0.06;
      const y = Math.sin(t * Math.PI) * 30;
      setJumpY(y);
      if (t < 1) {
        requestAnimationFrame(jumpAnim);
      } else {
        setJumpY(0);
        setIsJumping(false);
      }
    };
    requestAnimationFrame(jumpAnim);
  }, [isJumping]);

  useEffect(() => {
    const tick = () => {
      if (walkingRef.current && scrollRef.current < SCENE_LENGTH) {
        scrollRef.current = Math.min(scrollRef.current + WALK_SPEED, SCENE_LENGTH);
        setScrollX(scrollRef.current);
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const poppyX = scrollRef.current;
    encounters.forEach(enc => {
      if (!enc.collected && !enc.passed && Math.abs(enc.x - poppyX) < 40) {
        if (enc.type === 'obstacle' && isJumping) {
          setEncounters(prev =>
            prev.map(e => (e.id === enc.id ? { ...e, passed: true } : e))
          );
          setScore(s => s + 15);
          popupKey.current++;
          setPopup({ text: '✨ Dodged! +15', color: '#60A5FA', key: popupKey.current });
          const k = popupKey.current;
          setTimeout(() => setPopup(p => (p?.key === k ? null : p)), 1200);
        } else {
          handleEncounter(enc);
        }
      }
    });
  }, [scrollX, encounters, isJumping, handleEncounter]);

  useEffect(() => {
    if (scrollRef.current >= SCENE_LENGTH && !stageComplete) {
      setStageComplete(true);
      setIsWalking(false);
      walkingRef.current = false;
      setTimeout(() => {
        onComplete({
          stage: stage.id,
          score,
          treats,
          tricks,
          stars: Math.min(Math.floor(score / 50) + 1, 3),
        });
      }, 1500);
    }
  }, [scrollX, stageComplete, onComplete, stage.id, score, treats, tricks]);

  const startWalking = () => {
    if (showIntro || stageComplete) return;
    setIsWalking(true);
    walkingRef.current = true;
  };
  const stopWalking = () => {
    setIsWalking(false);
    walkingRef.current = false;
  };

  const viewWidth = 400;
  const cameraX = Math.max(0, scrollX - viewWidth * 0.3);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={startWalking}
      onPointerUp={stopWalking}
      onPointerLeave={stopWalking}
    >
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.mid} 50%, ${sky.bottom} 100%)`,
        }}
      />

      {/* Clouds */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-30"
          style={{
            width: 80 + i * 30,
            height: 25 + i * 5,
            background: 'white',
            top: `${8 + i * 6}%`,
            left: `${((i * 23 + scrollX * (0.05 + i * 0.01)) % (window?.innerWidth ? window.innerWidth + 200 : 600)) - 100}px`,
            filter: 'blur(4px)',
          }}
        />
      ))}

      {/* Main scene SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '65%' }}
        viewBox={`${cameraX} 0 ${viewWidth} 200`}
        preserveAspectRatio="xMidYMax meet"
      >
        {/* Background hills */}
        <path
          d={`M${cameraX - 50},200 ${Array.from({ length: 20 }, (_, i) => {
            const x = cameraX - 50 + i * 60;
            const h = 80 + Math.sin(x * 0.01 + stageIndex) * 30;
            return `Q${x + 30},${200 - h} ${x + 60},200`;
          }).join(' ')} Z`}
          fill={ground.grass}
          opacity={0.3}
        />

        {/* Midground hills */}
        <path
          d={`M${cameraX - 50},200 ${Array.from({ length: 25 }, (_, i) => {
            const x = cameraX - 50 + i * 40;
            const h = 50 + Math.sin(x * 0.02 + stageIndex * 2) * 20;
            return `Q${x + 20},${200 - h} ${x + 40},200`;
          }).join(' ')} Z`}
          fill={ground.grass}
          opacity={0.5}
        />

        {/* Ground plane */}
        <rect x={cameraX - 50} y={160} width={viewWidth + 100} height={40} fill={ground.dirt} />
        <rect x={cameraX - 50} y={155} width={viewWidth + 100} height={10} fill={ground.grass} rx={3} />

        {/* Path/road */}
        <rect x={cameraX - 50} y={162} width={viewWidth + 100} height={8} fill={ground.path} opacity={0.5} rx={2} />

        {/* Background scenery */}
        {scenery
          .filter(s => s.layer === 0 && s.x > cameraX - 60 && s.x < cameraX + viewWidth + 60)
          .map((s, i) => (
            <g key={`bg-${i}`} transform={`translate(0, 140)`} opacity={0.5}>
              <SceneryItem type={s.type} x={s.x} stage={stage.id} />
            </g>
          ))}

        {/* Foreground scenery */}
        {scenery
          .filter(s => s.layer === 1 && s.x > cameraX - 60 && s.x < cameraX + viewWidth + 60)
          .map((s, i) => (
            <g key={`fg-${i}`} transform={`translate(0, 155)`}>
              <SceneryItem type={s.type} x={s.x} stage={stage.id} />
            </g>
          ))}

        {/* Encounters */}
        {encounters
          .filter(e => !e.collected && !e.passed && e.x > cameraX - 30 && e.x < cameraX + viewWidth + 30)
          .map(enc => (
            <g key={enc.id}>
              {enc.type === 'obstacle' && (
                <rect
                  x={enc.x - 8}
                  y={140}
                  width={16}
                  height={20}
                  rx={3}
                  fill="#EF4444"
                  opacity={0.3}
                />
              )}
              <text
                x={enc.x}
                y={enc.type === 'obstacle' ? 148 : 145}
                textAnchor="middle"
                fontSize={enc.type === 'obstacle' ? 18 : 16}
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }}
              >
                {enc.emoji}
              </text>
              {enc.type !== 'obstacle' && (
                <motion.circle
                  cx={enc.x}
                  cy={148}
                  r={12}
                  fill="none"
                  stroke={enc.type === 'treat' ? '#34D399' : '#A78BFA'}
                  strokeWidth={1.5}
                  opacity={0.5}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </g>
          ))}

        {/* Poppy character */}
        <g transform={`translate(${scrollX}, ${130 - jumpY})`}>
          <Poppy
            stage={stage.id}
            pose={stageComplete ? 'wag' : isJumping ? 'jump' : isWalking ? 'walk' : 'stand'}
            size={55}
          />
        </g>

        {/* Finish flag */}
        {SCENE_LENGTH > cameraX - 30 && SCENE_LENGTH < cameraX + viewWidth + 30 && (
          <g transform={`translate(${SCENE_LENGTH}, 130)`}>
            <line x1={0} y1={0} x2={0} y2={-30} stroke="white" strokeWidth={2} />
            <rect x={0} y={-30} width={16} height={10} fill="#F43F5E" rx={1} />
            <text x={8} y={-22} textAnchor="middle" fontSize={6} fill="white">🏁</text>
          </g>
        )}
      </svg>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-20">
        <button
          onClick={onQuit}
          className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white/90 bg-white/15 backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-white/15 backdrop-blur-md border border-white/20">
            {stage.emoji} {stage.label}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-sm font-bold text-amber-200 bg-white/15 backdrop-blur-md border border-white/20">
            ⭐ {score}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-14 left-4 right-4 z-20">
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${sky.top}, ${sky.bottom})` }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Jump button */}
      {!showIntro && !stageComplete && (
        <motion.button
          className="absolute bottom-8 right-6 z-30 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-2xl font-bold text-white active:scale-90 transition-transform"
          onPointerDown={e => {
            e.stopPropagation();
            handleJump();
          }}
          whileTap={{ scale: 0.85 }}
        >
          ↑
        </motion.button>
      )}

      {/* Hold to walk hint */}
      {!showIntro && !stageComplete && !isWalking && scrollX < 50 && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 text-sm font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Hold anywhere to walk
        </motion.div>
      )}

      {/* Score popup */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup.key}
            initial={{ y: 0, opacity: 1, scale: 0.8 }}
            animate={{ y: -40, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl font-bold text-lg"
            style={{ color: popup.color, textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
          >
            {popup.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="text-6xl mb-3">{stage.emoji}</div>
              <h2 className="text-3xl font-black text-white mb-1">{stage.label}</h2>
              <p className="text-white/70 text-lg">{stage.age}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage complete overlay */}
      <AnimatePresence>
        {stageComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="text-5xl mb-2">🎉</div>
              <h2 className="text-2xl font-black text-white">Stage Complete!</h2>
              <p className="text-amber-200 text-lg font-bold mt-1">Score: {score}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
