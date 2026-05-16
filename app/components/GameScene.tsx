'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Poppy from './Poppy';
import MiniGame from './MiniGame';
import type { LocationConfig, GameItem, Location, Rarity } from '../types';
import { RARITY_TREATS, RARITY_COLORS } from '../types';

interface Props {
  location: LocationConfig;
  collectedItems: string[];
  onSceneEnd: (treatsEarned: number, newCollected: string[]) => void;
  onQuit: () => void;
}

const WORLD_W = 2000;
const MOVE_SPEED = 3.5;
const POPPY_SIZE = 160;

type ItemDef = GameItem & { miniGame?: 'fetch' | 'dig' | 'chase'; reaction?: 'wag' | 'jump' | 'sniff' | 'sit' };

const LOCATION_ITEMS: Record<Location, ItemDef[]> = {
  house: [
    { id: 'couch', emoji: '🛋️', label: 'Couch', xPos: 10, depth: 40, rarity: 'common', reaction: 'jump', message: 'Poppy jumps on the couch! So comfy!' },
    { id: 'shoe', emoji: '👟', label: 'Shoe', xPos: 18, depth: 65, rarity: 'common', reaction: 'sniff', message: 'Poppy found a shoe! Her favourite chew toy!' },
    { id: 'tv', emoji: '📺', label: 'TV', xPos: 28, depth: 25, rarity: 'uncommon', reaction: 'sit', message: 'Poppy tilts her head at the TV.' },
    { id: 'bowl', emoji: '🥣', label: 'Food Bowl', xPos: 38, depth: 70, rarity: 'common', reaction: 'sniff', message: 'Poppy checks her bowl. Dinnertime?' },
    { id: 'crumb', emoji: '🍪', label: 'Cookie', xPos: 48, depth: 55, rarity: 'common', reaction: 'sniff', message: 'A crumb! Delicious floor snack!' },
    { id: 'bin', emoji: '🗑️', label: 'Bin', xPos: 55, depth: 30, rarity: 'common', reaction: 'sniff', message: 'Poppy eyes the bin mischievously...' },
    { id: 'bed', emoji: '🛏️', label: 'Bed', xPos: 65, depth: 45, rarity: 'uncommon', reaction: 'jump', message: 'No dogs allowed on the bed... oops!' },
    { id: 'sock', emoji: '🧦', label: 'Sock', xPos: 75, depth: 75, rarity: 'common', reaction: 'wag', message: "Poppy's found a stinky sock! Favourite!" },
    { id: 'teddy', emoji: '🧸', label: 'Teddy', xPos: 84, depth: 50, rarity: 'uncommon', reaction: 'wag', miniGame: 'fetch', message: 'Poppy carries the teddy proudly!' },
    { id: 'ball', emoji: '🎾', label: 'Ball', xPos: 92, depth: 35, rarity: 'rare', reaction: 'jump', miniGame: 'fetch', message: "A tennis ball! Poppy's tail goes wild!" },
  ],
  garden: [
    { id: 'butterfly', emoji: '🦋', label: 'Butterfly', xPos: 12, depth: 25, rarity: 'rare', reaction: 'jump', miniGame: 'chase', message: 'Poppy chases a butterfly! Almost got it!' },
    { id: 'flower', emoji: '🌻', label: 'Sunflower', xPos: 22, depth: 55, rarity: 'common', reaction: 'sniff', message: 'Poppy stops to smell the flowers. Achoo!' },
    { id: 'puddle', emoji: '💦', label: 'Puddle', xPos: 35, depth: 70, rarity: 'common', reaction: 'jump', message: 'Splish splash! Poppy loves puddles!' },
    { id: 'bone', emoji: '🦴', label: 'Bone', xPos: 48, depth: 60, rarity: 'uncommon', reaction: 'sniff', miniGame: 'dig', message: 'Poppy digs up a bone she buried last week!' },
    { id: 'squirrel', emoji: '🐿️', label: 'Squirrel', xPos: 60, depth: 20, rarity: 'rare', reaction: 'jump', miniGame: 'chase', message: 'SQUIRREL! Poppy goes absolutely mental!' },
    { id: 'stick', emoji: '🪵', label: 'Stick', xPos: 72, depth: 65, rarity: 'common', reaction: 'wag', miniGame: 'fetch', message: 'The perfect stick! Poppy is so proud.' },
    { id: 'hose', emoji: '💧', label: 'Hose', xPos: 82, depth: 45, rarity: 'uncommon', reaction: 'jump', message: 'Poppy bites the water from the hose!' },
    { id: 'ladybug', emoji: '🐞', label: 'Ladybug', xPos: 92, depth: 75, rarity: 'common', reaction: 'sniff', message: 'A tiny ladybug! Poppy watches carefully.' },
  ],
  beach: [
    { id: 'wave', emoji: '🌊', label: 'Wave', xPos: 10, depth: 30, rarity: 'common', reaction: 'jump', message: 'Poppy barks at the waves!' },
    { id: 'crab', emoji: '🦀', label: 'Crab', xPos: 22, depth: 65, rarity: 'uncommon', reaction: 'jump', miniGame: 'chase', message: 'A crab! Poppy jumps back startled!' },
    { id: 'shell', emoji: '🐚', label: 'Shell', xPos: 35, depth: 75, rarity: 'common', reaction: 'sniff', message: 'A pretty shell. Poppy sniffs it curiously.' },
    { id: 'seagull', emoji: '🕊️', label: 'Seagull', xPos: 48, depth: 20, rarity: 'rare', reaction: 'jump', miniGame: 'chase', message: 'Poppy chases the seagull down the beach!' },
    { id: 'sandcastle', emoji: '🏰', label: 'Sandcastle', xPos: 60, depth: 55, rarity: 'uncommon', reaction: 'wag', message: 'Poppy tramples through a sandcastle. Oops!' },
    { id: 'icecream', emoji: '🍦', label: 'Ice Cream', xPos: 72, depth: 50, rarity: 'uncommon', reaction: 'sniff', message: 'Dropped ice cream! Poppy licks it up fast!' },
    { id: 'driftwood', emoji: '🪵', label: 'Driftwood', xPos: 85, depth: 70, rarity: 'common', reaction: 'wag', miniGame: 'fetch', message: 'The biggest stick ever! Poppy is thrilled!' },
    { id: 'rockpool', emoji: '🪸', label: 'Rockpool', xPos: 93, depth: 40, rarity: 'common', reaction: 'sniff', message: 'Poppy peers into the rockpool!' },
  ],
  park: [
    { id: 'duck', emoji: '🦆', label: 'Duck', xPos: 10, depth: 35, rarity: 'common', reaction: 'sniff', message: 'Poppy stares at the ducks. Must. Chase.' },
    { id: 'frisbee', emoji: '🥏', label: 'Frisbee', xPos: 22, depth: 50, rarity: 'rare', reaction: 'jump', miniGame: 'fetch', message: 'Poppy catches the frisbee! Good girl!' },
    { id: 'picnic', emoji: '🧺', label: 'Picnic', xPos: 35, depth: 65, rarity: 'common', reaction: 'sniff', message: 'Poppy sneaks a sausage from the picnic!' },
    { id: 'fountain', emoji: '⛲', label: 'Fountain', xPos: 48, depth: 30, rarity: 'uncommon', reaction: 'sit', message: 'Poppy drinks from the fountain. Refreshing!' },
    { id: 'jogger', emoji: '🏃', label: 'Jogger', xPos: 58, depth: 55, rarity: 'common', reaction: 'wag', message: 'Poppy runs alongside the jogger!' },
    { id: 'dog-friend', emoji: '🐕', label: 'Dog Friend', xPos: 70, depth: 60, rarity: 'uncommon', reaction: 'wag', message: 'Poppy found a friend! Bum sniffs all round!' },
    { id: 'kite', emoji: '🪁', label: 'Kite', xPos: 82, depth: 20, rarity: 'rare', reaction: 'jump', miniGame: 'chase', message: 'A kite! Poppy barks at it in the sky!' },
    { id: 'bench', emoji: '🪑', label: 'Bench', xPos: 93, depth: 70, rarity: 'common', reaction: 'sit', message: 'Poppy sits under the bench for a rest.' },
  ],
  cafe: [
    { id: 'puppuccino', emoji: '☕', label: 'Puppuccino', xPos: 12, depth: 40, rarity: 'uncommon', reaction: 'sniff', message: 'A puppuccino! Poppy laps it up!' },
    { id: 'croissant', emoji: '🥐', label: 'Croissant', xPos: 24, depth: 65, rarity: 'common', reaction: 'sniff', message: 'Poppy snatches a croissant crumb!' },
    { id: 'cat', emoji: '🐱', label: 'Café Cat', xPos: 38, depth: 30, rarity: 'rare', reaction: 'sniff', miniGame: 'chase', message: 'A cat! Poppy and the cat have a stare-off.' },
    { id: 'chair-leg', emoji: '🪑', label: 'Chair Leg', xPos: 50, depth: 55, rarity: 'common', reaction: 'sniff', message: 'Poppy chews on the chair leg. Naughty!' },
    { id: 'cake', emoji: '🍰', label: 'Cake', xPos: 62, depth: 25, rarity: 'uncommon', reaction: 'jump', message: 'Cake on the counter! Poppy leaps for it!' },
    { id: 'newspaper', emoji: '📰', label: 'Newspaper', xPos: 74, depth: 70, rarity: 'common', reaction: 'sit', message: "Poppy sits on someone's newspaper." },
    { id: 'baby', emoji: '👶', label: 'Baby', xPos: 85, depth: 45, rarity: 'uncommon', reaction: 'wag', message: 'A baby! Poppy gives gentle kisses!' },
    { id: 'treat-jar', emoji: '🍪', label: 'Treat Jar', xPos: 94, depth: 20, rarity: 'rare', reaction: 'jump', miniGame: 'dig', message: 'The café has a dog treat jar! Jackpot!' },
  ],
};

/* ─── Pixel art helpers ─── */
function px(x: number, y: number, w: number, h: number, fill: string) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} />;
}

/* ─── 2.5D Pixel World Backgrounds ─── */
function PixelWorld({ location, cameraX, cameraY, viewW, viewH }: {
  location: Location; cameraX: number; cameraY: number; viewW: number; viewH: number;
}) {
  const parallax = (speed: number) => -cameraX * speed;

  const skyColors: Record<Location, [string, string]> = {
    house: ['#FFE566', '#FFF2B3'],
    garden: ['#38BDF8', '#7DD3FC'],
    beach: ['#0EA5E9', '#38BDF8'],
    park: ['#38BDF8', '#BAE6FD'],
    cafe: ['#FBBF24', '#FDE68A'],
  };
  const groundColors: Record<Location, [string, string]> = {
    house: ['#F59E0B', '#FBBF24'],
    garden: ['#22C55E', '#4ADE80'],
    beach: ['#FDE68A', '#FBBF24'],
    park: ['#4ADE80', '#86EFAC'],
    cafe: ['#F97316', '#FB923C'],
  };
  const [sky1, sky2] = skyColors[location];
  const [gnd1, gnd2] = groundColors[location];

  return (
    <>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${sky1} 0%, ${sky2} 50%, ${gnd1} 100%)` }} />

      {/* Ground perspective grid */}
      <svg className="absolute inset-0 w-full h-full pixel-art" viewBox={`0 0 ${viewW} ${viewH}`} preserveAspectRatio="none">
        {/* Perspective ground tiles */}
        {Array.from({ length: 20 }, (_, row) => {
          const yPct = 0.35 + (row / 20) * 0.65;
          const y = yPct * viewH;
          const h = (viewH * 0.65) / 20;
          const tileW = 30 + row * 3;
          const offset = (parallax(0.1 + row * 0.02)) % (tileW * 2);
          return Array.from({ length: Math.ceil(viewW / tileW) + 2 }, (_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * tileW + offset - tileW}
              y={y}
              width={tileW}
              height={h + 1}
              fill={(row + col) % 2 === 0 ? gnd1 : gnd2}
              opacity={0.6 + (row / 20) * 0.4}
            />
          ));
        })}
      </svg>

      {/* Decorations per location */}
      <svg className="absolute inset-0 w-full h-full pixel-art" viewBox={`0 0 ${viewW} ${viewH}`}>
        {location === 'house' && <>
          {/* Wall trim */}
          <rect x={0} y={viewH * 0.33} width={viewW} height={4} fill="#E879F9" />
          {/* Windows */}
          {[0.15, 0.45, 0.75].map((xp, i) => (
            <g key={i} transform={`translate(${xp * viewW + parallax(0.05)}, ${viewH * 0.12})`}>
              <rect x={0} y={0} width={60} height={50} fill="#87CEEB" rx={3} />
              <rect x={28} y={0} width={4} height={50} fill="#D97706" />
              <rect x={0} y={23} width={60} height={4} fill="#D97706" />
              <rect x={-3} y={-3} width={66} height={4} fill="#D97706" />
            </g>
          ))}
          {/* Big furniture silhouettes in background */}
          <rect x={parallax(0.08) + viewW * 0.1} y={viewH * 0.2} width={80} height={50} rx={4} fill="#FF6B9D" opacity={0.3} />
          <rect x={parallax(0.08) + viewW * 0.5} y={viewH * 0.15} width={40} height={70} rx={3} fill="#4F46E5" opacity={0.3} />
          <rect x={parallax(0.08) + viewW * 0.8} y={viewH * 0.18} width={70} height={45} rx={3} fill="#A855F7" opacity={0.3} />
        </>}

        {location === 'garden' && <>
          {/* Trees at back */}
          {[0.08, 0.25, 0.45, 0.65, 0.85].map((xp, i) => (
            <g key={i} transform={`translate(${xp * viewW + parallax(0.05)}, ${viewH * 0.1})`}>
              <rect x={20} y={40} width={12} height={50} fill="#92400E" />
              <rect x={0} y={0} width={52} height={16} fill={i % 2 === 0 ? '#22C55E' : '#16A34A'} />
              <rect x={-6} y={16} width={64} height={14} fill={i % 2 === 0 ? '#16A34A' : '#15803D'} />
              <rect x={0} y={30} width={52} height={12} fill={i % 2 === 0 ? '#22C55E' : '#4ADE80'} />
            </g>
          ))}
          {/* Flowers at back */}
          {Array.from({ length: 15 }, (_, i) => {
            const x = (i / 15) * viewW + parallax(0.03);
            const colors = ['#FF6B9D', '#FBBF24', '#A855F7', '#EF4444', '#EC4899'];
            return <circle key={i} cx={x} cy={viewH * 0.32 + (i % 3) * 6} r={4} fill={colors[i % 5]} />;
          })}
        </>}

        {location === 'beach' && <>
          {/* Ocean waves at back */}
          {Array.from({ length: 30 }, (_, i) => (
            <rect key={i} x={i * 50 + parallax(0.03)} y={viewH * 0.25 + (i % 3) * 6}
              width={40} height={6} rx={3} fill={i % 2 === 0 ? '#0284C7' : '#0EA5E9'} opacity={0.7} />
          ))}
          {/* Beach umbrellas */}
          {[0.2, 0.6].map((xp, i) => (
            <g key={i} transform={`translate(${xp * viewW + parallax(0.06)}, ${viewH * 0.25})`}>
              <rect x={20} y={20} width={4} height={40} fill="#92400E" />
              <rect x={0} y={10} width={44} height={8} rx={4} fill={i === 0 ? '#EF4444' : '#3B82F6'} />
              <rect x={6} y={4} width={32} height={8} rx={3} fill={i === 0 ? '#F97316' : '#60A5FA'} />
            </g>
          ))}
        </>}

        {location === 'park' && <>
          {/* Big trees */}
          {[0.1, 0.35, 0.6, 0.85].map((xp, i) => (
            <g key={i} transform={`translate(${xp * viewW + parallax(0.04)}, ${viewH * 0.05})`}>
              <rect x={22} y={50} width={16} height={60} fill="#92400E" />
              <rect x={0} y={10} width={60} height={18} fill={i % 2 === 0 ? '#22C55E' : '#10B981'} />
              <rect x={-8} y={28} width={76} height={14} fill={i % 2 === 0 ? '#16A34A' : '#059669'} />
              <rect x={4} y={42} width={52} height={10} fill={i % 2 === 0 ? '#22C55E' : '#4ADE80'} />
            </g>
          ))}
          {/* Pond */}
          <ellipse cx={viewW * 0.3 + parallax(0.05)} cy={viewH * 0.32} rx={40} ry={15} fill="#0EA5E9" opacity={0.6} />
          <ellipse cx={viewW * 0.3 + parallax(0.05)} cy={viewH * 0.30} rx={30} ry={8} fill="#38BDF8" opacity={0.4} />
        </>}

        {location === 'cafe' && <>
          {/* Art on walls */}
          {[0.15, 0.4, 0.65, 0.9].map((xp, i) => (
            <g key={i} transform={`translate(${xp * viewW + parallax(0.04)}, ${viewH * 0.08})`}>
              <rect x={0} y={0} width={40} height={30} fill={['#EF4444', '#8B5CF6', '#EC4899', '#3B82F6'][i]} rx={2} />
              <rect x={3} y={3} width={34} height={24} fill={['#FCA5A5', '#C4B5FD', '#FBCFE8', '#93C5FD'][i]} rx={1} />
            </g>
          ))}
          {/* Pendant lights */}
          {[0.2, 0.5, 0.8].map((xp, i) => (
            <g key={`l${i}`} transform={`translate(${xp * viewW + parallax(0.02)}, 0)`}>
              <rect x={0} y={0} width={3} height={viewH * 0.12} fill="#92400E" />
              <rect x={-8} y={viewH * 0.12} width={19} height={8} rx={4} fill="#FDE047" />
            </g>
          ))}
          {/* Counter at back */}
          <rect x={parallax(0.06)} y={viewH * 0.25} width={viewW * 0.3} height={20} rx={3} fill="#D97706" />
          <rect x={parallax(0.06)} y={viewH * 0.23} width={viewW * 0.3} height={4} fill="#F59E0B" />
        </>}
      </svg>
    </>
  );
}

/* ─── Sparkle / confetti effects ─── */
function Sparkles({ x, y, rarity }: { x: number; y: number; rarity: Rarity }) {
  const colors = rarity === 'rare'
    ? ['#FF6B9D', '#FBBF24', '#A855F7', '#22C55E', '#3B82F6', '#EF4444', '#EC4899', '#06B6D4']
    : rarity === 'uncommon'
    ? ['#A78BFA', '#C4B5FD', '#8B5CF6', '#DDD6FE', '#7C3AED', '#EDE9FE', '#6D28D9', '#F5F3FF']
    : ['#FBBF24', '#FDE047', '#F59E0B', '#FEF3C7', '#D97706', '#FDE68A', '#B45309', '#FFFBEB'];
  const count = rarity === 'rare' ? 16 : rarity === 'uncommon' ? 12 : 8;

  return (
    <div className="absolute z-40 pointer-events-none" style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}>
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 360;
        const dist = 30 + (rarity === 'rare' ? 30 : rarity === 'uncommon' ? 20 : 10);
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: rarity === 'rare' ? 6 : 4, height: rarity === 'rare' ? 6 : 4, backgroundColor: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist,
              opacity: 0, scale: 0,
            }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        );
      })}
      {rarity === 'rare' && (
        <motion.div
          className="absolute text-2xl"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0, y: -30 }}
          transition={{ duration: 0.8 }}
        >
          ⭐
        </motion.div>
      )}
    </div>
  );
}

/* ─── Floating treat indicator ─── */
function FloatingTreat({ amount, x, y }: { amount: number; x: number; y: number }) {
  return (
    <motion.div
      className="absolute z-40 pointer-events-none font-black text-lg"
      style={{ left: x, top: y, color: '#FBBF24' }}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -50 }}
      transition={{ duration: 1.2 }}
    >
      +{amount} 🦴
    </motion.div>
  );
}

/* ─── depth helpers ─── */
function depthToScreenY(depth: number, viewH: number) {
  const top = viewH * 0.35;
  const bottom = viewH * 0.82;
  return top + (depth / 100) * (bottom - top);
}

function depthToScale(depth: number) {
  return 0.45 + (depth / 100) * 0.75;
}

export default function GameScene({ location, collectedItems, onSceneEnd, onQuit }: Props) {
  const viewW = typeof window !== 'undefined' ? window.innerWidth : 400;
  const viewH = typeof window !== 'undefined' ? window.innerHeight : 700;

  const [poppyX, setPoppyX] = useState(150);
  const [poppyDepth, setPoppyDepth] = useState(55);
  const [items, setItems] = useState<(GameItem & { found: boolean })[]>(() =>
    LOCATION_ITEMS[location.id].map(i => ({ ...i, found: collectedItems.includes(`${location.id}:${i.id}`) }))
  );
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [treatsEarned, setTreatsEarned] = useState(0);
  const [newCollected, setNewCollected] = useState<string[]>([]);
  const [poppyPose, setPoppyPose] = useState<'stand' | 'walk' | 'wag' | 'jump' | 'sniff' | 'sit'>('stand');
  const [flipPoppy, setFlipPoppy] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [sceneFinished, setSceneFinished] = useState(false);
  const [showMissedPrompt, setShowMissedPrompt] = useState(false);
  const [sparkle, setSparkle] = useState<{ x: number; y: number; rarity: Rarity } | null>(null);
  const [floatingTreat, setFloatingTreat] = useState<{ amount: number; x: number; y: number } | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<{ type: 'fetch' | 'dig' | 'chase'; emoji: string; label: string; itemId: string } | null>(null);

  // D-pad state
  const dirRef = useRef({ up: false, down: false, left: false, right: false });
  const poppyRef = useRef({ x: 150, depth: 55 });
  const animRef = useRef(0);
  const msgTimeout = useRef<NodeJS.Timeout | null>(null);

  const totalItems = items.length;
  const unfoundItems = items.filter(i => !i.found);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /* ─── game loop ─── */
  useEffect(() => {
    const tick = () => {
      const d = dirRef.current;
      let moved = false;

      if (d.right && poppyRef.current.x < WORLD_W) {
        poppyRef.current.x = Math.min(WORLD_W, poppyRef.current.x + MOVE_SPEED);
        moved = true;
      }
      if (d.left && poppyRef.current.x > 0) {
        poppyRef.current.x = Math.max(0, poppyRef.current.x - MOVE_SPEED);
        moved = true;
      }
      if (d.up && poppyRef.current.depth > 5) {
        poppyRef.current.depth = Math.max(5, poppyRef.current.depth - MOVE_SPEED * 0.5);
        moved = true;
      }
      if (d.down && poppyRef.current.depth < 95) {
        poppyRef.current.depth = Math.min(95, poppyRef.current.depth + MOVE_SPEED * 0.5);
        moved = true;
      }

      if (moved) {
        setPoppyX(poppyRef.current.x);
        setPoppyDepth(poppyRef.current.depth);
      }

      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  /* ─── walking pose update ─── */
  useEffect(() => {
    const d = dirRef.current;
    const isMoving = d.up || d.down || d.left || d.right;
    if (isMoving && poppyPose !== 'wag') {
      setPoppyPose('walk');
      if (d.right) setFlipPoppy(false);
      else if (d.left) setFlipPoppy(true);
    }
  });

  /* ─── discover item ─── */
  const discoverItem = useCallback((item: GameItem & { found: boolean }, screenX: number, screenY: number) => {
    if (item.found) return;

    // Check if item has a mini-game
    if (item.miniGame && !activeMiniGame) {
      setActiveMiniGame({ type: item.miniGame, emoji: item.emoji, label: item.label, itemId: item.id });
      return;
    }

    const treats = RARITY_TREATS[item.rarity];
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, found: true } : i));
    setDiscoveredCount(c => c + 1);
    setTreatsEarned(t => t + treats);
    setNewCollected(prev => [...prev, `${location.id}:${item.id}`]);

    // Reaction
    setPoppyPose(item.reaction || 'wag');

    // Sparkle
    setSparkle({ x: screenX, y: screenY, rarity: item.rarity });
    setTimeout(() => setSparkle(null), 800);

    // Floating treat
    setFloatingTreat({ amount: treats, x: screenX, y: screenY - 30 });
    setTimeout(() => setFloatingTreat(null), 1300);

    // Message
    if (msgTimeout.current) clearTimeout(msgTimeout.current);
    setActiveMessage(item.message);
    msgTimeout.current = setTimeout(() => {
      setActiveMessage(null);
      setPoppyPose('stand');
    }, 3000);
  }, [location.id, activeMiniGame]);

  /* ─── mini-game complete ─── */
  const handleMiniGameComplete = useCallback((success: boolean) => {
    if (!activeMiniGame) return;
    const item = items.find(i => i.id === activeMiniGame.itemId);
    if (item && success) {
      const treats = RARITY_TREATS[item.rarity] + 2; // Bonus treats for mini-game
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, found: true } : i));
      setDiscoveredCount(c => c + 1);
      setTreatsEarned(t => t + treats);
      setNewCollected(prev => [...prev, `${location.id}:${item.id}`]);
      setPoppyPose(item.reaction || 'wag');
      setActiveMessage(`${item.message} (+${treats} bonus treats!)`);
      setFloatingTreat({ amount: treats, x: viewW / 2, y: viewH / 2 });
      setTimeout(() => setFloatingTreat(null), 1300);
    } else if (!success) {
      setActiveMessage("So close! Try again next time!");
    }
    setActiveMiniGame(null);
    if (msgTimeout.current) clearTimeout(msgTimeout.current);
    msgTimeout.current = setTimeout(() => {
      setActiveMessage(null);
      setPoppyPose('stand');
    }, 3000);
  }, [activeMiniGame, items, location.id, viewW, viewH]);

  /* ─── handle item tap ─── */
  const handleItemTap = useCallback((item: GameItem & { found: boolean }, e: React.PointerEvent) => {
    e.stopPropagation();
    if (item.found) return;

    const poppyPct = (poppyRef.current.x / WORLD_W) * 100;
    const xDist = Math.abs(item.xPos - poppyPct);
    const dDist = Math.abs(item.depth - poppyRef.current.depth);

    if (xDist < 15 && dDist < 25) {
      const itemWorldX = (item.xPos / 100) * WORLD_W;
      const cameraX = poppyRef.current.x - viewW * 0.4;
      const screenX = itemWorldX - cameraX;
      const screenY = depthToScreenY(item.depth, viewH);
      discoverItem(item, screenX, screenY);
    } else {
      setActiveMessage(`Walk closer to the ${item.label}!`);
      if (msgTimeout.current) clearTimeout(msgTimeout.current);
      msgTimeout.current = setTimeout(() => setActiveMessage(null), 1500);
    }
  }, [discoverItem, viewW, viewH]);

  /* ─── end scene ─── */
  const handleEndScene = useCallback(() => {
    if (unfoundItems.length > 0 && !showMissedPrompt) {
      setShowMissedPrompt(true);
    } else {
      setSceneFinished(true);
      setPoppyPose('wag');
      setTimeout(() => onSceneEnd(treatsEarned, newCollected), 2500);
    }
  }, [unfoundItems.length, showMissedPrompt, treatsEarned, newCollected, onSceneEnd]);

  /* ─── check if all items found ─── */
  useEffect(() => {
    if (unfoundItems.length === 0 && discoveredCount > 0 && !sceneFinished) {
      setTimeout(() => {
        setSceneFinished(true);
        setPoppyPose('wag');
        setTimeout(() => onSceneEnd(treatsEarned, newCollected), 2500);
      }, 1500);
    }
  }, [unfoundItems.length, discoveredCount, sceneFinished, treatsEarned, newCollected, onSceneEnd]);

  /* ─── D-pad handlers ─── */
  const setDir = (dir: 'up' | 'down' | 'left' | 'right', active: boolean) => {
    dirRef.current[dir] = active;
    if (!active) {
      const d = dirRef.current;
      if (!d.up && !d.down && !d.left && !d.right) {
        setPoppyPose(prev => prev === 'walk' ? 'stand' : prev);
      }
    }
  };

  // Camera
  const cameraX = poppyX - viewW * 0.4;
  const poppyScreenY = depthToScreenY(poppyDepth, viewH);
  const poppyScale = depthToScale(poppyDepth);

  // Depth-sorted renderables
  const sortedItems = [...items].filter(i => !i.found).sort((a, b) => a.depth - b.depth);

  return (
    <div className="relative h-full w-full overflow-hidden select-none" style={{ touchAction: 'none' }}>
      <PixelWorld location={location.id} cameraX={cameraX} cameraY={0} viewW={viewW} viewH={viewH} />

      {/* Items - depth sorted, 3D scaled */}
      {sortedItems.map(item => {
        const worldX = (item.xPos / 100) * WORLD_W;
        const screenX = worldX - cameraX;
        if (screenX < -100 || screenX > viewW + 100) return null;
        const screenY = depthToScreenY(item.depth, viewH);
        const scale = depthToScale(item.depth);
        const poppyPct = (poppyX / WORLD_W) * 100;
        const isNear = Math.abs(item.xPos - poppyPct) < 15 && Math.abs(item.depth - poppyDepth) < 25;
        const rarityColor = RARITY_COLORS[item.rarity];

        // Render behind or in front of Poppy based on depth
        const zIndex = item.depth < poppyDepth ? 15 : 25;

        return (
          <motion.div
            key={item.id}
            className="absolute cursor-pointer"
            style={{
              left: screenX,
              top: screenY,
              transform: `translate(-50%, -100%) scale(${scale})`,
              zIndex,
              filter: isNear ? `drop-shadow(0 0 8px ${rarityColor})` : undefined,
            }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: (item.xPos % 5) * 0.4 }}
            onPointerDown={e => handleItemTap(item, e)}
          >
            <span className="text-6xl">{item.emoji}</span>
            {/* Pixel shadow on ground */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-black/15" />
            {/* Rarity dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white/50"
              style={{ backgroundColor: rarityColor }} />
            {isNear && (
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <span className="text-[10px] font-black text-white bg-black/50 px-2 py-0.5 rounded-full">
                  {item.label} 👆
                </span>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Poppy - scaled by depth */}
      <div
        className="absolute z-20"
        style={{
          left: viewW * 0.4,
          top: poppyScreenY,
          transform: `translate(-50%, -100%) scale(${poppyScale})`,
          transformOrigin: 'bottom center',
        }}
      >
        <Poppy pose={poppyPose} size={POPPY_SIZE} flipX={flipPoppy} />
        {/* Poppy shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/15" />
      </div>

      {/* Effects */}
      {sparkle && <Sparkles x={sparkle.x} y={sparkle.y} rarity={sparkle.rarity} />}
      {floatingTreat && <FloatingTreat amount={floatingTreat.amount} x={floatingTreat.x} y={floatingTreat.y} />}

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-30">
        <button
          onClick={(e) => { e.stopPropagation(); onQuit(); }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold text-white bg-black/30 active:scale-95"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-sm font-bold text-white bg-black/30">
            {location.emoji} {location.label}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-sm font-bold text-yellow-300 bg-black/30">
            ⭐ {discoveredCount}/{totalItems}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-sm font-bold text-amber-300 bg-black/30">
            🦴 {treatsEarned}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-[52px] left-4 right-4 z-30">
        <div className="h-2.5 rounded-full bg-black/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
            animate={{ width: `${(discoveredCount / totalItems) * 100}%` }}
          />
        </div>
      </div>

      {/* ─── D-PAD + DONE BUTTON ─── */}
      {!showIntro && !sceneFinished && !activeMiniGame && (
        <div className="absolute bottom-4 left-0 right-0 z-30 flex items-end justify-between px-4">
          {/* D-pad */}
          <div className="relative w-[130px] h-[130px]">
            {/* Up */}
            <button
              className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center text-lg font-black text-white active:scale-90"
              onPointerDown={e => { e.stopPropagation(); setDir('up', true); }}
              onPointerUp={() => setDir('up', false)}
              onPointerLeave={() => setDir('up', false)}
            >▲</button>
            {/* Down */}
            <button
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 rounded-xl bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center text-lg font-black text-white active:scale-90"
              onPointerDown={e => { e.stopPropagation(); setDir('down', true); }}
              onPointerUp={() => setDir('down', false)}
              onPointerLeave={() => setDir('down', false)}
            >▼</button>
            {/* Left */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center text-lg font-black text-white active:scale-90"
              onPointerDown={e => { e.stopPropagation(); setDir('left', true); }}
              onPointerUp={() => setDir('left', false)}
              onPointerLeave={() => setDir('left', false)}
            >◀</button>
            {/* Right */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center text-lg font-black text-white active:scale-90"
              onPointerDown={e => { e.stopPropagation(); setDir('right', true); }}
              onPointerUp={() => setDir('right', false)}
              onPointerLeave={() => setDir('right', false)}
            >▶</button>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10" />
          </div>

          {/* Done button */}
          <motion.button
            className="px-6 py-3 rounded-2xl bg-[#FF6B9D] border-4 border-[#FF3D7F] font-black text-white text-sm shadow-lg active:scale-90"
            onPointerDown={e => { e.stopPropagation(); handleEndScene(); }}
            whileTap={{ scale: 0.85 }}
          >
            DONE ✓
          </motion.button>
        </div>
      )}

      {/* Message */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            key={activeMessage}
            initial={{ y: -20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-[72px] left-4 right-4 z-30"
          >
            <p className="text-center text-white font-black text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] bg-black/30 rounded-xl py-2 px-3">
              {activeMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      {!showIntro && !sceneFinished && discoveredCount === 0 && (
        <motion.div
          className="absolute bottom-[160px] left-1/2 -translate-x-1/2 z-20"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white/90 text-xs font-bold bg-black/30 px-3 py-1.5 rounded-full">
            Use D-pad to walk · Tap items to discover!
          </span>
        </motion.div>
      )}

      {/* Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }} className="text-center">
              <div className="text-6xl mb-3">{location.emoji}</div>
              <h2 className="text-4xl font-black text-white drop-shadow-lg">{location.label}</h2>
              <p className="text-white/70 text-sm mt-2">Find all the hidden items!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Missed items prompt */}
      <AnimatePresence>
        {showMissedPrompt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
              className="bg-white rounded-3xl p-6 mx-8 text-center max-w-sm">
              <div className="text-4xl mb-3">🐾</div>
              <h3 className="text-xl font-black text-amber-900 mb-2">
                Found {discoveredCount}/{totalItems} items!
              </h3>
              <p className="text-amber-700 text-sm mb-4">
                There are still {totalItems - discoveredCount} items to find. Go back and explore more?
              </p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl bg-amber-100 font-bold text-amber-800 active:scale-95"
                  onClick={() => setShowMissedPrompt(false)}
                >
                  Keep Looking
                </button>
                <button
                  className="flex-1 py-3 rounded-xl bg-[#FF6B9D] font-bold text-white active:scale-95"
                  onClick={() => {
                    setShowMissedPrompt(false);
                    setSceneFinished(true);
                    setPoppyPose('wag');
                    setTimeout(() => onSceneEnd(treatsEarned, newCollected), 1500);
                  }}
                >
                  Move On
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini-game overlay */}
      <AnimatePresence>
        {activeMiniGame && (
          <MiniGame
            type={activeMiniGame.type}
            emoji={activeMiniGame.emoji}
            label={activeMiniGame.label}
            onComplete={handleMiniGameComplete}
          />
        )}
      </AnimatePresence>

      {/* Scene end */}
      <AnimatePresence>
        {sceneFinished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/40">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
              className="text-center bg-white/10 backdrop-blur rounded-3xl p-8">
              <motion.div className="text-6xl mb-3"
                animate={{ rotate: [0, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-1">Adventure Complete!</h2>
              <p className="text-lg text-yellow-300 font-bold">Found {discoveredCount}/{totalItems} items</p>
              <p className="text-amber-300 font-bold mt-1">🦴 +{treatsEarned} treats earned!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
