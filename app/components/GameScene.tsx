'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Poppy from './Poppy';
import type { LocationConfig, Discoverable, Location } from '../types';

interface Props {
  location: LocationConfig;
  onSceneEnd: () => void;
  onQuit: () => void;
}

const SCENE_WIDTH = 2400;
const WALK_SPEED = 3;

type ItemDef = { id: string; emoji: string; label: string; xPos: number; height: 'ground' | 'low' | 'high'; message: string };

const LOCATION_ITEMS: Record<Location, ItemDef[]> = {
  house: [
    { id: 'couch', emoji: '🛋️', label: 'Couch', xPos: 8, height: 'ground', message: 'Poppy jumps on the couch! So comfy!' },
    { id: 'shoe', emoji: '👟', label: 'Shoe', xPos: 16, height: 'ground', message: 'Poppy found a shoe! Her favourite chew toy!' },
    { id: 'tv', emoji: '📺', label: 'TV', xPos: 25, height: 'high', message: 'Poppy tilts her head at the TV.' },
    { id: 'bowl', emoji: '🥣', label: 'Food Bowl', xPos: 38, height: 'ground', message: 'Poppy checks her bowl. Dinnertime?' },
    { id: 'crumb', emoji: '🍪', label: 'Cookie', xPos: 48, height: 'ground', message: 'A crumb! Delicious floor snack!' },
    { id: 'bin', emoji: '🗑️', label: 'Bin', xPos: 55, height: 'low', message: 'Poppy eyes the bin mischievously...' },
    { id: 'bed', emoji: '🛏️', label: 'Bed', xPos: 68, height: 'low', message: 'No dogs allowed on the bed... oops!' },
    { id: 'sock', emoji: '🧦', label: 'Sock', xPos: 76, height: 'ground', message: 'A stinky sock! Poppy\'s favourite!' },
    { id: 'teddy', emoji: '🧸', label: 'Teddy', xPos: 85, height: 'low', message: 'Poppy carries the teddy proudly!' },
    { id: 'ball', emoji: '🎾', label: 'Ball', xPos: 92, height: 'high', message: 'A tennis ball! Poppy\'s tail goes wild!' },
  ],
  garden: [
    { id: 'butterfly', emoji: '🦋', label: 'Butterfly', xPos: 10, height: 'high', message: 'Poppy chases a butterfly! Almost got it!' },
    { id: 'flower', emoji: '🌻', label: 'Sunflower', xPos: 22, height: 'low', message: 'Poppy stops to smell the flowers. Achoo!' },
    { id: 'puddle', emoji: '💦', label: 'Puddle', xPos: 35, height: 'ground', message: 'Splish splash! Poppy jumps in the puddle!' },
    { id: 'bone', emoji: '🦴', label: 'Bone', xPos: 48, height: 'ground', message: 'Poppy digs up a bone she buried last week!' },
    { id: 'squirrel', emoji: '🐿️', label: 'Squirrel', xPos: 60, height: 'high', message: 'SQUIRREL! Poppy goes absolutely mental!' },
    { id: 'stick', emoji: '🪵', label: 'Stick', xPos: 72, height: 'ground', message: 'The perfect stick! Poppy is so proud.' },
    { id: 'hose', emoji: '💧', label: 'Hose', xPos: 82, height: 'low', message: 'Poppy bites the water from the hose!' },
    { id: 'ladybug', emoji: '🐞', label: 'Ladybug', xPos: 92, height: 'ground', message: 'A tiny ladybug! Poppy watches it carefully.' },
  ],
  beach: [
    { id: 'wave', emoji: '🌊', label: 'Wave', xPos: 10, height: 'ground', message: 'Poppy barks at the waves!' },
    { id: 'crab', emoji: '🦀', label: 'Crab', xPos: 22, height: 'ground', message: 'A crab! Poppy jumps back startled!' },
    { id: 'shell', emoji: '🐚', label: 'Shell', xPos: 35, height: 'ground', message: 'A pretty shell. Poppy sniffs it curiously.' },
    { id: 'seagull', emoji: '🕊️', label: 'Seagull', xPos: 48, height: 'high', message: 'Poppy chases the seagull down the beach!' },
    { id: 'sandcastle', emoji: '🏰', label: 'Sandcastle', xPos: 60, height: 'low', message: 'Poppy tramples through a sandcastle. Oops!' },
    { id: 'icecream', emoji: '🍦', label: 'Ice Cream', xPos: 72, height: 'low', message: 'Dropped ice cream! Poppy licks it up fast!' },
    { id: 'driftwood', emoji: '🪵', label: 'Driftwood', xPos: 85, height: 'ground', message: 'The biggest stick ever! Poppy is thrilled!' },
    { id: 'rockpool', emoji: '🪸', label: 'Rockpool', xPos: 93, height: 'ground', message: 'Poppy peers into the rockpool. So many creatures!' },
  ],
  park: [
    { id: 'duck', emoji: '🦆', label: 'Duck', xPos: 10, height: 'ground', message: 'Poppy stares at the ducks. Must. Chase.' },
    { id: 'frisbee', emoji: '🥏', label: 'Frisbee', xPos: 22, height: 'high', message: 'Poppy catches the frisbee! Good girl!' },
    { id: 'picnic', emoji: '🧺', label: 'Picnic', xPos: 35, height: 'ground', message: 'Poppy sneaks a sausage from the picnic!' },
    { id: 'fountain', emoji: '⛲', label: 'Fountain', xPos: 48, height: 'low', message: 'Poppy drinks from the fountain. Refreshing!' },
    { id: 'jogger', emoji: '🏃', label: 'Jogger', xPos: 58, height: 'ground', message: 'Poppy runs alongside the jogger!' },
    { id: 'dog-friend', emoji: '🐕', label: 'Dog Friend', xPos: 70, height: 'ground', message: 'Poppy found a friend! Bum sniffs all round!' },
    { id: 'kite', emoji: '🪁', label: 'Kite', xPos: 82, height: 'high', message: 'A kite! Poppy barks at it in the sky!' },
    { id: 'bench', emoji: '🪑', label: 'Bench', xPos: 93, height: 'ground', message: 'Poppy sits under the bench for a rest.' },
  ],
  cafe: [
    { id: 'puppuccino', emoji: '☕', label: 'Puppuccino', xPos: 12, height: 'low', message: 'A puppuccino! Poppy laps it up!' },
    { id: 'croissant', emoji: '🥐', label: 'Croissant', xPos: 24, height: 'ground', message: 'Poppy snatches a croissant crumb!' },
    { id: 'cat', emoji: '🐱', label: 'Café Cat', xPos: 38, height: 'low', message: 'A cat! Poppy and the cat have a stare-off.' },
    { id: 'chair-leg', emoji: '🪑', label: 'Chair Leg', xPos: 50, height: 'ground', message: 'Poppy chews on the chair leg. Naughty!' },
    { id: 'cake', emoji: '🍰', label: 'Cake', xPos: 62, height: 'high', message: 'Cake on the counter! Poppy leaps for it!' },
    { id: 'newspaper', emoji: '📰', label: 'Newspaper', xPos: 74, height: 'ground', message: 'Poppy sits on someone\'s newspaper.' },
    { id: 'baby', emoji: '👶', label: 'Baby', xPos: 85, height: 'low', message: 'A baby! Poppy gives gentle kisses!' },
    { id: 'treat-jar', emoji: '🍪', label: 'Treat Jar', xPos: 94, height: 'high', message: 'The café has a dog treat jar! Jackpot!' },
  ],
};

const HEIGHT_OFFSETS = { ground: 0, low: 50, high: 100 };

/* ─── bright background layers per location ─── */

function SceneBG({ location, scrollX, viewW }: { location: Location; scrollX: number; viewW: number }) {
  const farX = -scrollX * 0.15;
  const midX = -scrollX * 0.4;

  switch (location) {
    case 'house':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7ED] to-[#FEF3C7]" />
          {/* Pictures on wall */}
          <svg className="absolute inset-0 w-full h-full" style={{ transform: `translateX(${farX}px)` }} viewBox="0 0 2400 400" preserveAspectRatio="none">
            {[200, 500, 850, 1150, 1500, 1850, 2150].map((x, i) => (
              <rect key={i} x={x} y={60 + (i % 3) * 15} width={60 + (i % 2) * 20} height={45 + (i % 2) * 10} rx={3} fill={['#FCA5A5', '#93C5FD', '#86EFAC', '#C4B5FD', '#FDE047', '#F9A8D4', '#A5B4FC'][i]} opacity={0.5} stroke="#E5A87C" strokeWidth={2} />
            ))}
          </svg>
          {/* Furniture */}
          <svg className="absolute bottom-0 left-0 h-[55%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 220" preserveAspectRatio="none">
            <rect x={80} y={80} width={180} height={100} rx={10} fill="#F59E0B" opacity={0.15} />
            <rect x={310} y={100} width={60} height={80} rx={4} fill="#D97706" opacity={0.12} />
            <rect x={600} y={50} width={200} height={130} rx={4} fill="#10B981" opacity={0.1} />
            <rect x={850} y={70} width={100} height={110} rx={4} fill="#6366F1" opacity={0.08} />
            <rect x={1200} y={60} width={250} height={120} rx={8} fill="#8B5CF6" opacity={0.1} />
            <rect x={1800} y={40} width={120} height={160} rx={6} fill="#F59E0B" opacity={0.08} />
            <rect x={1820} y={50} width={80} height={100} rx={4} fill="#38BDF8" opacity={0.12} />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-b from-[#D2A679] to-[#C49B6F]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%] bg-[#FBBF24] opacity-40" />
        </>
      );

    case 'garden':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#38BDF8] via-[#7DD3FC] to-[#BAE6FD]" />
          <svg className="absolute top-0 left-0 w-full h-[40%]" style={{ transform: `translateX(${farX * 0.5}px)` }}>
            {[80, 300, 550, 800, 1100].map((x, i) => (
              <g key={i}>
                <ellipse cx={x} cy={40 + i * 12} rx={50 + i * 10} ry={18} fill="white" opacity={0.7} />
              </g>
            ))}
            <circle cx={viewW - 60} cy={50} r={30} fill="#FBBF24" opacity={0.9} />
            <circle cx={viewW - 60} cy={50} r={24} fill="#FDE047" />
          </svg>
          <svg className="absolute bottom-[25%] left-0 h-[35%]" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 140" preserveAspectRatio="none">
            {[100, 350, 600, 900, 1200, 1500, 1800, 2100, 2500, 2900, 3200].map((x, i) => (
              <g key={i}>
                <rect x={x} y={60} width={8} height={60} rx={3} fill="#92400E" opacity={0.4} />
                <circle cx={x + 4} cy={50} r={22 + (i % 3) * 5} fill={i % 2 === 0 ? '#22C55E' : '#4ADE80'} opacity={0.5} />
              </g>
            ))}
          </svg>
          <svg className="absolute bottom-[22%] left-0 h-[15%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 60" preserveAspectRatio="none">
            {Array.from({ length: 80 }, (_, i) => (
              <g key={i}>
                <rect x={i * 36 + 5} y={5} width={5} height={45} rx={2} fill="#D2A679" opacity={0.6} />
                {i < 79 && <rect x={i * 36} y={15} width={36} height={4} rx={1} fill="#E5A87C" opacity={0.5} />}
                {i < 79 && <rect x={i * 36} y={32} width={36} height={4} rx={1} fill="#E5A87C" opacity={0.5} />}
              </g>
            ))}
          </svg>
          {/* Flowers in grass */}
          <svg className="absolute bottom-[28%] left-0 h-[6%]" style={{ width: SCENE_WIDTH, transform: `translateX(${midX}px)` }} viewBox="0 0 2400 24" preserveAspectRatio="none">
            {Array.from({ length: 30 }, (_, i) => (
              <circle key={i} cx={i * 82 + 20} cy={12} r={3} fill={['#F472B6', '#A78BFA', '#FB923C', '#34D399', '#FBBF24'][i % 5]} opacity={0.7} />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-b from-[#4ADE80] to-[#22C55E]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%]">
            <svg width="100%" height="100%" viewBox="0 0 400 12" preserveAspectRatio="none">
              <path d="M0,12 Q10,0 20,12 Q30,0 40,12 Q50,0 60,12 Q70,0 80,12 Q90,0 100,12 Q110,0 120,12 Q130,0 140,12 Q150,0 160,12 Q170,0 180,12 Q190,0 200,12 Q210,0 220,12 Q230,0 240,12 Q250,0 260,12 Q270,0 280,12 Q290,0 300,12 Q310,0 320,12 Q330,0 340,12 Q350,0 360,12 Q370,0 380,12 Q390,0 400,12 V12 H0 Z" fill="#16A34A" />
            </svg>
          </div>
        </>
      );

    case 'beach':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0EA5E9] via-[#38BDF8] to-[#7DD3FC]" />
          <svg className="absolute top-0 left-0 w-full h-[35%]" style={{ transform: `translateX(${farX * 0.3}px)` }}>
            <circle cx={viewW - 80} cy={45} r={32} fill="#FBBF24" />
            <circle cx={viewW - 80} cy={45} r={26} fill="#FDE047" />
            {[120, 400, 700].map((x, i) => (
              <ellipse key={i} cx={x} cy={35 + i * 8} rx={45} ry={15} fill="white" opacity={0.6} />
            ))}
          </svg>
          <svg className="absolute bottom-[30%] left-0 h-[18%]" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 70" preserveAspectRatio="none">
            <path d={`M0,35 ${Array.from({ length: 60 }, (_, i) => `Q${i * 60 + 30},${20 + Math.sin(i) * 12} ${(i + 1) * 60},35`).join(' ')} V70 H0 Z`} fill="#0EA5E9" opacity={0.4} />
          </svg>
          <div className="absolute bottom-[26%] left-0 right-0 h-[6%] bg-gradient-to-b from-[#38BDF8]/60 to-[#FDE68A]" />
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-b from-[#FDE68A] to-[#FBBF24]" />
        </>
      );

    case 'park':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#3B82F6] via-[#60A5FA] to-[#93C5FD]" />
          <svg className="absolute top-0 left-0 w-full h-[30%]" style={{ transform: `translateX(${farX * 0.3}px)` }}>
            {[100, 350, 600, 850].map((x, i) => (
              <ellipse key={i} cx={x} cy={30 + i * 10} rx={40 + i * 8} ry={14} fill="white" opacity={0.6} />
            ))}
          </svg>
          <svg className="absolute bottom-[28%] left-0 h-[35%]" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 140" preserveAspectRatio="none">
            {[80, 250, 450, 700, 950, 1200, 1450, 1700, 2000, 2300, 2600, 2900, 3200].map((x, i) => (
              <g key={i}>
                <rect x={x} y={70} width={10} height={55} rx={4} fill="#92400E" opacity={0.35} />
                <circle cx={x + 5} cy={55} r={25 + (i % 3) * 8} fill={i % 2 === 0 ? '#22C55E' : '#4ADE80'} opacity={0.45} />
              </g>
            ))}
          </svg>
          <svg className="absolute bottom-[25%] left-0 h-[8%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 30" preserveAspectRatio="none">
            <rect x={0} y={10} width={2880} height={15} rx={5} fill="#D2A679" opacity={0.35} />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-b from-[#4ADE80] to-[#16A34A]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%]">
            <svg width="100%" height="100%" viewBox="0 0 400 12" preserveAspectRatio="none">
              <path d="M0,12 Q10,0 20,12 Q30,0 40,12 Q50,0 60,12 Q70,0 80,12 Q90,0 100,12 Q110,0 120,12 Q130,0 140,12 Q150,0 160,12 Q170,0 180,12 Q190,0 200,12 Q210,0 220,12 Q230,0 240,12 Q250,0 260,12 Q270,0 280,12 Q290,0 300,12 Q310,0 320,12 Q330,0 340,12 Q350,0 360,12 Q370,0 380,12 Q390,0 400,12 V12 H0 Z" fill="#16A34A" />
            </svg>
          </div>
        </>
      );

    case 'cafe':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#FEF3C7] via-[#FFF7ED] to-[#FFEDD5]" />
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#FBBF24]/15 to-transparent" />
          {/* Wall art & pendant lights */}
          <svg className="absolute inset-0 w-full h-full" style={{ transform: `translateX(${farX}px)` }} viewBox="0 0 2400 400" preserveAspectRatio="none">
            {[150, 500, 900, 1300, 1700, 2100].map((x, i) => (
              <rect key={i} x={x} y={50} width={70} height={50} rx={4} fill={['#F97316', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#EF4444'][i]} opacity={0.15} />
            ))}
            {[250, 650, 1050, 1450, 1850, 2250].map((x, i) => (
              <g key={`l${i}`}>
                <line x1={x} y1={0} x2={x} y2={30} stroke="#D97706" strokeWidth={1.5} opacity={0.3} />
                <ellipse cx={x} cy={35} rx={15} ry={10} fill="#FBBF24" opacity={0.25} />
                <ellipse cx={x} cy={40} rx={8} ry={3} fill="#FDE047" opacity={0.2} />
              </g>
            ))}
          </svg>
          {/* Tables */}
          <svg className="absolute bottom-[28%] left-0 h-[20%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 80" preserveAspectRatio="none">
            {[100, 500, 900, 1300, 1700, 2100, 2500].map((x, i) => (
              <g key={i}>
                <rect x={x} y={20} width={4} height={50} fill="#92400E" opacity={0.2} />
                <rect x={x + 60} y={20} width={4} height={50} fill="#92400E" opacity={0.2} />
                <rect x={x - 5} y={15} width={74} height={6} rx={2} fill="#D97706" opacity={0.2} />
              </g>
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-b from-[#D2A679] to-[#C49B6F]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%] bg-[#FBBF24] opacity-30" />
        </>
      );
  }
}

export default function GameScene({ location, onSceneEnd, onQuit }: Props) {
  const [scrollX, setScrollX] = useState(0);
  const [items, setItems] = useState<Discoverable[]>(() =>
    LOCATION_ITEMS[location.id].map(i => ({ ...i, found: false }))
  );
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpY, setJumpY] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [sceneFinished, setSceneFinished] = useState(false);

  const walkingRef = useRef(false);
  const scrollRef = useRef(0);
  const animRef = useRef<number>(0);
  const jumpingRef = useRef(false);
  const jumpYRef = useRef(0);
  const msgTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleJump = useCallback(() => {
    if (jumpingRef.current) return;
    jumpingRef.current = true;
    setIsJumping(true);
    let t = 0;
    const jumpAnim = () => {
      t += 0.05;
      const y = Math.sin(t * Math.PI) * 90;
      jumpYRef.current = y;
      setJumpY(y);
      if (t < 1) {
        requestAnimationFrame(jumpAnim);
      } else {
        jumpYRef.current = 0;
        setJumpY(0);
        jumpingRef.current = false;
        setIsJumping(false);
      }
    };
    requestAnimationFrame(jumpAnim);
  }, []);

  // Walk loop
  useEffect(() => {
    const tick = () => {
      if (walkingRef.current && scrollRef.current < SCENE_WIDTH) {
        scrollRef.current = Math.min(scrollRef.current + WALK_SPEED, SCENE_WIDTH);
        setScrollX(scrollRef.current);
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Check encounters
  useEffect(() => {
    const poppyPct = (scrollRef.current / SCENE_WIDTH) * 100;
    const currentJumpY = jumpYRef.current;

    items.forEach(item => {
      if (!item.found && Math.abs(item.xPos - poppyPct) < 4) {
        // Ground items: always collect. Low items: collect if jumping a bit. High items: need a real jump.
        const canReach =
          item.height === 'ground' ||
          (item.height === 'low' && currentJumpY > 20) ||
          (item.height === 'high' && currentJumpY > 60);

        if (canReach) {
          setItems(prev => prev.map(i => i.id === item.id ? { ...i, found: true } : i));
          setDiscoveredCount(c => c + 1);
          if (msgTimeout.current) clearTimeout(msgTimeout.current);
          setActiveMessage(item.message);
          msgTimeout.current = setTimeout(() => setActiveMessage(null), 3000);
        }
      }
    });

    if (scrollRef.current >= SCENE_WIDTH && !sceneFinished) {
      setSceneFinished(true);
      setIsWalking(false);
      walkingRef.current = false;
      setTimeout(() => onSceneEnd(), 2000);
    }
  }, [scrollX, jumpY, items, sceneFinished, onSceneEnd]);

  const startWalking = () => {
    if (showIntro || sceneFinished) return;
    setIsWalking(true);
    walkingRef.current = true;
  };
  const stopWalking = () => {
    setIsWalking(false);
    walkingRef.current = false;
  };

  const viewW = typeof window !== 'undefined' ? window.innerWidth : 400;
  const progress = Math.min(scrollX / SCENE_WIDTH, 1);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={startWalking}
      onPointerUp={stopWalking}
      onPointerLeave={stopWalking}
    >
      {/* Parallax background */}
      <SceneBG location={location.id} scrollX={scrollX} viewW={viewW} />

      {/* Items along the scene */}
      {items.map(item => {
        const worldX = (item.xPos / 100) * SCENE_WIDTH;
        const screenX = worldX - scrollX + viewW * 0.35;
        if (screenX < -60 || screenX > viewW + 60) return null;
        if (item.found) return null;
        const bottomOffset = 28 + HEIGHT_OFFSETS[item.height] * 0.18;
        return (
          <motion.div
            key={item.id}
            className="absolute z-10"
            style={{ left: screenX, bottom: `${bottomOffset}%`, transform: 'translateX(-50%)' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          >
            <span className="text-3xl drop-shadow-lg">{item.emoji}</span>
            {item.height === 'high' && (
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-amber-300 whitespace-nowrap"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↑ JUMP
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Poppy */}
      <div
        className="absolute z-20"
        style={{
          left: '35%',
          bottom: `${22 + jumpY * 0.08}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <Poppy
          pose={sceneFinished ? 'wag' : isJumping ? 'jump' : isWalking ? 'walk' : 'stand'}
          size={80}
        />
      </div>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-30">
        <button
          onClick={(e) => { e.stopPropagation(); onQuit(); }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white/90 bg-black/25 backdrop-blur-sm active:scale-95 transition-transform"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-black/25 backdrop-blur-sm">
            {location.emoji} {location.label}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200 bg-black/25 backdrop-blur-sm">
            {discoveredCount}/{totalItems}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-14 left-4 right-4 z-30">
        <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Jump button */}
      {!showIntro && !sceneFinished && (
        <motion.button
          className="absolute bottom-6 right-5 z-30 w-14 h-14 rounded-full bg-amber-500/80 backdrop-blur-sm border-2 border-amber-300/60 flex items-center justify-center text-xl font-bold text-white shadow-lg active:scale-90 transition-transform"
          onPointerDown={e => {
            e.stopPropagation();
            handleJump();
          }}
          whileTap={{ scale: 0.85 }}
        >
          ↑
        </motion.button>
      )}

      {/* Caption at top — no background */}
      <AnimatePresence>
        {activeMessage && (
          <motion.p
            key={activeMessage}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 z-30 text-center text-white font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          >
            {activeMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hold hint */}
      {!showIntro && !sceneFinished && !isWalking && scrollX < 30 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/70 text-xs font-medium drop-shadow"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Hold to walk · Tap ↑ to jump
        </motion.div>
      )}

      {/* Intro overlay */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="text-5xl mb-2">{location.emoji}</div>
              <h2 className="text-2xl font-black text-white">{location.label}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene end */}
      <AnimatePresence>
        {sceneFinished && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-center"
            >
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-black text-white">
                Found {discoveredCount}/{totalItems}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
