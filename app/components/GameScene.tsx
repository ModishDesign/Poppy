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

const LOCATION_ITEMS: Record<Location, Omit<Discoverable, 'found'>[]> = {
  house: [
    { id: 'couch', emoji: '🛋️', label: 'Couch', xPos: 8, message: 'Poppy jumps on the couch! So comfy!' },
    { id: 'shoe', emoji: '👟', label: 'Shoe', xPos: 16, message: 'Poppy found a shoe! Her favourite chew toy!' },
    { id: 'tv', emoji: '📺', label: 'TV', xPos: 25, message: 'Poppy tilts her head at the TV.' },
    { id: 'bowl', emoji: '🥣', label: 'Food Bowl', xPos: 38, message: 'Poppy checks her bowl. Dinnertime?' },
    { id: 'crumb', emoji: '🍪', label: 'Cookie', xPos: 48, message: 'A crumb! Delicious floor snack!' },
    { id: 'bin', emoji: '🗑️', label: 'Bin', xPos: 55, message: 'Poppy eyes the bin mischievously...' },
    { id: 'bed', emoji: '🛏️', label: 'Bed', xPos: 68, message: 'No dogs allowed on the bed... oops!' },
    { id: 'sock', emoji: '🧦', label: 'Sock', xPos: 76, message: 'A stinky sock! Poppy\'s favourite!' },
    { id: 'teddy', emoji: '🧸', label: 'Teddy', xPos: 85, message: 'Poppy carries the teddy proudly!' },
    { id: 'ball', emoji: '🎾', label: 'Ball', xPos: 92, message: 'A tennis ball! Poppy\'s tail goes wild!' },
  ],
  garden: [
    { id: 'butterfly', emoji: '🦋', label: 'Butterfly', xPos: 10, message: 'Poppy chases a butterfly! Almost got it!' },
    { id: 'flower', emoji: '🌻', label: 'Sunflower', xPos: 22, message: 'Poppy stops to smell the flowers. Achoo!' },
    { id: 'puddle', emoji: '💦', label: 'Puddle', xPos: 35, message: 'Splish splash! Poppy jumps in the puddle!' },
    { id: 'bone', emoji: '🦴', label: 'Bone', xPos: 48, message: 'Poppy digs up a bone she buried last week!' },
    { id: 'squirrel', emoji: '🐿️', label: 'Squirrel', xPos: 60, message: 'SQUIRREL! Poppy goes absolutely mental!' },
    { id: 'stick', emoji: '🪵', label: 'Stick', xPos: 72, message: 'The perfect stick! Poppy is so proud.' },
    { id: 'hose', emoji: '💧', label: 'Hose', xPos: 82, message: 'Poppy bites the water from the hose!' },
    { id: 'ladybug', emoji: '🐞', label: 'Ladybug', xPos: 92, message: 'A tiny ladybug! Poppy watches it carefully.' },
  ],
  beach: [
    { id: 'wave', emoji: '🌊', label: 'Wave', xPos: 10, message: 'Poppy barks at the waves!' },
    { id: 'crab', emoji: '🦀', label: 'Crab', xPos: 22, message: 'A crab! Poppy jumps back startled!' },
    { id: 'shell', emoji: '🐚', label: 'Shell', xPos: 35, message: 'A pretty shell. Poppy sniffs it curiously.' },
    { id: 'seagull', emoji: '🕊️', label: 'Seagull', xPos: 48, message: 'Poppy chases the seagull down the beach!' },
    { id: 'sandcastle', emoji: '🏰', label: 'Sandcastle', xPos: 60, message: 'Poppy tramples through a sandcastle. Oops!' },
    { id: 'icecream', emoji: '🍦', label: 'Ice Cream', xPos: 72, message: 'Dropped ice cream! Poppy licks it up fast!' },
    { id: 'driftwood', emoji: '🪵', label: 'Driftwood', xPos: 85, message: 'The biggest stick ever! Poppy is thrilled!' },
    { id: 'rockpool', emoji: '🪸', label: 'Rockpool', xPos: 93, message: 'Poppy peers into the rockpool. So many creatures!' },
  ],
  park: [
    { id: 'duck', emoji: '🦆', label: 'Duck', xPos: 10, message: 'Poppy stares at the ducks. Must. Chase.' },
    { id: 'frisbee', emoji: '🥏', label: 'Frisbee', xPos: 22, message: 'Poppy catches the frisbee! Good girl!' },
    { id: 'picnic', emoji: '🧺', label: 'Picnic', xPos: 35, message: 'Poppy sneaks a sausage from the picnic!' },
    { id: 'fountain', emoji: '⛲', label: 'Fountain', xPos: 48, message: 'Poppy drinks from the fountain. Refreshing!' },
    { id: 'jogger', emoji: '🏃', label: 'Jogger', xPos: 58, message: 'Poppy runs alongside the jogger!' },
    { id: 'dog-friend', emoji: '🐕', label: 'Dog Friend', xPos: 70, message: 'Poppy found a friend! Bum sniffs all round!' },
    { id: 'kite', emoji: '🪁', label: 'Kite', xPos: 82, message: 'A kite! Poppy barks at it in the sky!' },
    { id: 'bench', emoji: '🪑', label: 'Bench', xPos: 93, message: 'Poppy sits under the bench for a rest.' },
  ],
  cafe: [
    { id: 'puppuccino', emoji: '☕', label: 'Puppuccino', xPos: 12, message: 'A puppuccino! Poppy laps it up!' },
    { id: 'croissant', emoji: '🥐', label: 'Croissant', xPos: 24, message: 'Poppy snatches a croissant crumb!' },
    { id: 'cat', emoji: '🐱', label: 'Café Cat', xPos: 38, message: 'A cat! Poppy and the cat have a stare-off.' },
    { id: 'chair-leg', emoji: '🪑', label: 'Chair Leg', xPos: 50, message: 'Poppy chews on the chair leg. Naughty!' },
    { id: 'cake', emoji: '🍰', label: 'Cake', xPos: 62, message: 'Cake on the floor! Today is the best day!' },
    { id: 'newspaper', emoji: '📰', label: 'Newspaper', xPos: 74, message: 'Poppy sits on someone\'s newspaper.' },
    { id: 'baby', emoji: '👶', label: 'Baby', xPos: 85, message: 'A baby! Poppy gives gentle kisses!' },
    { id: 'treat-jar', emoji: '🍪', label: 'Treat Jar', xPos: 94, message: 'The café has a dog treat jar! Jackpot!' },
  ],
};

/* ─── background layers per location ─── */

function SceneBG({ location, scrollX, viewW }: { location: Location; scrollX: number; viewW: number }) {
  const farX = -scrollX * 0.15;
  const midX = -scrollX * 0.4;
  const nearX = -scrollX * 0.7;

  switch (location) {
    case 'house':
      return (
        <>
          {/* Wall */}
          <div className="absolute inset-0 bg-[#FEF3C7]" />
          {/* Far layer - pictures on wall */}
          <svg className="absolute inset-0 w-full h-full" style={{ transform: `translateX(${farX}px)` }} viewBox="0 0 2400 400" preserveAspectRatio="none">
            {[200, 500, 850, 1150, 1500, 1850, 2150].map((x, i) => (
              <rect key={i} x={x} y={60 + (i % 3) * 15} width={60 + (i % 2) * 20} height={45 + (i % 2) * 10} rx={3} fill={['#FECACA', '#BFDBFE', '#BBF7D0', '#DDD6FE', '#FDE68A', '#FBCFE8', '#E0E7FF'][i]} opacity={0.4} stroke="#D4A574" strokeWidth={2} />
            ))}
          </svg>
          {/* Mid layer - furniture silhouettes */}
          <svg className="absolute bottom-0 left-0 h-[55%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 220" preserveAspectRatio="none">
            {/* Living room furniture */}
            <rect x={80} y={80} width={180} height={100} rx={10} fill="#D2A679" opacity={0.2} />
            <rect x={100} y={60} width={25} height={120} rx={5} fill="#C49B6F" opacity={0.2} />
            <rect x={310} y={100} width={60} height={80} rx={4} fill="#92400E" opacity={0.15} />
            {/* Kitchen */}
            <rect x={600} y={50} width={200} height={130} rx={4} fill="#F5F5F4" opacity={0.15} />
            <rect x={850} y={70} width={100} height={110} rx={4} fill="#E5E7EB" opacity={0.15} />
            {/* Bedroom */}
            <rect x={1200} y={60} width={250} height={120} rx={8} fill="#DBEAFE" opacity={0.15} />
            <rect x={1500} y={80} width={50} height={80} rx={3} fill="#92400E" opacity={0.15} />
            {/* Hallway to garden */}
            <rect x={1800} y={40} width={120} height={160} rx={6} fill="#A16207" opacity={0.1} />
            <rect x={1820} y={50} width={80} height={100} rx={4} fill="#87CEEB" opacity={0.15} />
          </svg>
          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#D2A679]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%] bg-[#FDE68A] opacity-50" />
        </>
      );

    case 'garden':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B5E3F5] to-[#E0F4FF]" />
          {/* Clouds */}
          <svg className="absolute top-0 left-0 w-full h-[40%]" style={{ transform: `translateX(${farX * 0.5}px)` }}>
            {[80, 300, 550, 800, 1100].map((x, i) => (
              <g key={i}>
                <ellipse cx={x} cy={40 + i * 12} rx={50 + i * 10} ry={18} fill="white" opacity={0.6} />
                <ellipse cx={x - 20} cy={38 + i * 12} rx={30} ry={14} fill="white" opacity={0.5} />
              </g>
            ))}
            <circle cx={viewW - 60} cy={50} r={30} fill="#FCD34D" opacity={0.8} />
          </svg>
          {/* Far hills/trees */}
          <svg className="absolute bottom-[25%] left-0 h-[35%]" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 140" preserveAspectRatio="none">
            {[100, 350, 600, 900, 1200, 1500, 1800, 2100, 2500, 2900, 3200].map((x, i) => (
              <g key={i}>
                <rect x={x} y={60} width={8} height={60} rx={3} fill="#78350F" opacity={0.3} />
                <circle cx={x + 4} cy={50} r={22 + (i % 3) * 5} fill="#16A34A" opacity={0.3} />
              </g>
            ))}
          </svg>
          {/* Fence */}
          <svg className="absolute bottom-[22%] left-0 h-[15%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 60" preserveAspectRatio="none">
            {Array.from({ length: 80 }, (_, i) => (
              <g key={i}>
                <rect x={i * 36 + 5} y={5} width={5} height={45} rx={2} fill="#D2A679" opacity={0.5} />
                {i < 79 && <rect x={i * 36} y={15} width={36} height={4} rx={1} fill="#C49B6F" opacity={0.4} />}
                {i < 79 && <rect x={i * 36} y={32} width={36} height={4} rx={1} fill="#C49B6F" opacity={0.4} />}
              </g>
            ))}
          </svg>
          {/* Grass */}
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#4ADE80]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%]">
            <svg width="100%" height="100%" viewBox="0 0 400 12" preserveAspectRatio="none">
              <path d="M0,12 Q10,0 20,12 Q30,0 40,12 Q50,0 60,12 Q70,0 80,12 Q90,0 100,12 Q110,0 120,12 Q130,0 140,12 Q150,0 160,12 Q170,0 180,12 Q190,0 200,12 Q210,0 220,12 Q230,0 240,12 Q250,0 260,12 Q270,0 280,12 Q290,0 300,12 Q310,0 320,12 Q330,0 340,12 Q350,0 360,12 Q370,0 380,12 Q390,0 400,12 V12 H0 Z" fill="#22C55E" />
            </svg>
          </div>
        </>
      );

    case 'beach':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#38BDF8] via-[#7DD3FC] to-[#BAE6FD]" />
          {/* Clouds & sun */}
          <svg className="absolute top-0 left-0 w-full h-[35%]" style={{ transform: `translateX(${farX * 0.3}px)` }}>
            <circle cx={viewW - 80} cy={45} r={30} fill="#FCD34D" />
            {[120, 400, 700].map((x, i) => (
              <ellipse key={i} cx={x} cy={35 + i * 8} rx={45} ry={15} fill="white" opacity={0.5} />
            ))}
          </svg>
          {/* Ocean waves far */}
          <svg className="absolute bottom-[30%] left-0 h-[18%]" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 70" preserveAspectRatio="none">
            <path d={`M0,35 ${Array.from({ length: 60 }, (_, i) => `Q${i * 60 + 30},${20 + Math.sin(i) * 12} ${(i + 1) * 60},35`).join(' ')} V70 H0 Z`} fill="#0EA5E9" opacity={0.3} />
          </svg>
          {/* Shore line */}
          <div className="absolute bottom-[26%] left-0 right-0 h-[6%] bg-gradient-to-b from-[#7DD3FC]/50 to-[#FDE68A]" />
          {/* Sand */}
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#FDE68A]" />
          <div className="absolute bottom-[22%] left-0 right-0 h-[6%] bg-[#FBBF24] opacity-20" />
        </>
      );

    case 'park':
      return (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#60A5FA] via-[#93C5FD] to-[#DBEAFE]" />
          {/* Clouds */}
          <svg className="absolute top-0 left-0 w-full h-[30%]" style={{ transform: `translateX(${farX * 0.3}px)` }}>
            {[100, 350, 600, 850].map((x, i) => (
              <ellipse key={i} cx={x} cy={30 + i * 10} rx={40 + i * 8} ry={14} fill="white" opacity={0.5} />
            ))}
          </svg>
          {/* Far trees */}
          <svg className="absolute bottom-[28%] left-0 h-[35%]" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 140" preserveAspectRatio="none">
            {[80, 250, 450, 700, 950, 1200, 1450, 1700, 2000, 2300, 2600, 2900, 3200].map((x, i) => (
              <g key={i}>
                <rect x={x} y={70} width={10} height={55} rx={4} fill="#78350F" opacity={0.25} />
                <circle cx={x + 5} cy={55} r={25 + (i % 3) * 8} fill={i % 2 === 0 ? '#16A34A' : '#22C55E'} opacity={0.3} />
              </g>
            ))}
          </svg>
          {/* Mid layer path */}
          <svg className="absolute bottom-[25%] left-0 h-[8%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 30" preserveAspectRatio="none">
            <rect x={0} y={10} width={2880} height={15} rx={5} fill="#D2A679" opacity={0.3} />
          </svg>
          {/* Grass */}
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#4ADE80]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%]">
            <svg width="100%" height="100%" viewBox="0 0 400 12" preserveAspectRatio="none">
              <path d="M0,12 Q10,0 20,12 Q30,0 40,12 Q50,0 60,12 Q70,0 80,12 Q90,0 100,12 Q110,0 120,12 Q130,0 140,12 Q150,0 160,12 Q170,0 180,12 Q190,0 200,12 Q210,0 220,12 Q230,0 240,12 Q250,0 260,12 Q270,0 280,12 Q290,0 300,12 Q310,0 320,12 Q330,0 340,12 Q350,0 360,12 Q370,0 380,12 Q390,0 400,12 V12 H0 Z" fill="#22C55E" />
            </svg>
          </div>
        </>
      );

    case 'cafe':
      return (
        <>
          <div className="absolute inset-0 bg-[#FFF7ED]" />
          {/* Warm ambient light */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-[#FBBF24]/10 to-transparent" />
          {/* Wall details */}
          <svg className="absolute inset-0 w-full h-full" style={{ transform: `translateX(${farX}px)` }} viewBox="0 0 2400 400" preserveAspectRatio="none">
            {/* Menu boards / art */}
            {[150, 500, 900, 1300, 1700, 2100].map((x, i) => (
              <g key={i}>
                <rect x={x} y={50} width={70} height={50} rx={4} fill={['#451A03', '#78350F', '#451A03', '#78350F', '#451A03', '#78350F'][i]} opacity={0.12} />
              </g>
            ))}
            {/* Pendant lights */}
            {[250, 650, 1050, 1450, 1850, 2250].map((x, i) => (
              <g key={`l${i}`}>
                <line x1={x} y1={0} x2={x} y2={30} stroke="#92400E" strokeWidth={1.5} opacity={0.2} />
                <ellipse cx={x} cy={35} rx={15} ry={10} fill="#FBBF24" opacity={0.15} />
              </g>
            ))}
          </svg>
          {/* Counter / tables mid layer */}
          <svg className="absolute bottom-[28%] left-0 h-[20%]" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 80" preserveAspectRatio="none">
            {[100, 500, 900, 1300, 1700, 2100, 2500].map((x, i) => (
              <g key={i}>
                <rect x={x} y={20} width={4} height={50} fill="#78350F" opacity={0.15} />
                <rect x={x + 60} y={20} width={4} height={50} fill="#78350F" opacity={0.15} />
                <rect x={x - 5} y={15} width={74} height={6} rx={2} fill="#92400E" opacity={0.15} />
              </g>
            ))}
          </svg>
          {/* Floor - warm tile */}
          <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-[#D2A679]" />
          <div className="absolute bottom-[28%] left-0 right-0 h-[3%] bg-[#C49B6F] opacity-30" />
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
  const [showIntro, setShowIntro] = useState(true);
  const [sceneFinished, setSceneFinished] = useState(false);

  const walkingRef = useRef(false);
  const scrollRef = useRef(0);
  const animRef = useRef<number>(0);
  const msgTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 1500);
    return () => clearTimeout(timer);
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
    const poppyWorldX = scrollRef.current;
    const poppyPct = (poppyWorldX / SCENE_WIDTH) * 100;

    items.forEach(item => {
      if (!item.found && Math.abs(item.xPos - poppyPct) < 4) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, found: true } : i));
        setDiscoveredCount(c => c + 1);

        if (msgTimeout.current) clearTimeout(msgTimeout.current);
        setActiveMessage(item.message);
        msgTimeout.current = setTimeout(() => setActiveMessage(null), 3000);
      }
    });

    if (scrollRef.current >= SCENE_WIDTH && !sceneFinished) {
      setSceneFinished(true);
      setIsWalking(false);
      walkingRef.current = false;
      setTimeout(() => onSceneEnd(), 2000);
    }
  }, [scrollX, items, sceneFinished, onSceneEnd]);

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
      {/* Scrolling background */}
      <div className="absolute inset-0" style={{ transform: `translateX(${-scrollX}px)`, width: SCENE_WIDTH + viewW }}>
        <div className="relative w-full h-full">
          <SceneBG location={location.id} scrollX={scrollX} viewW={viewW} />
        </div>
      </div>

      {/* Background layers already handle parallax, but we re-render them with scrollX above */}
      <SceneBG location={location.id} scrollX={scrollX} viewW={viewW} />

      {/* Items along the ground */}
      {items.map(item => {
        const worldX = (item.xPos / 100) * SCENE_WIDTH;
        const screenX = worldX - scrollX + viewW * 0.35;
        if (screenX < -60 || screenX > viewW + 60) return null;
        if (item.found) return null;
        return (
          <motion.div
            key={item.id}
            className="absolute z-10"
            style={{ left: screenX, bottom: '28%', transform: 'translateX(-50%)' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
          >
            <span className="text-2xl drop-shadow-md">{item.emoji}</span>
          </motion.div>
        );
      })}

      {/* Poppy - fixed horizontally at ~35% from left */}
      <div
        className="absolute z-20"
        style={{ left: '35%', bottom: '22%', transform: 'translateX(-50%)' }}
      >
        <Poppy
          pose={sceneFinished ? 'wag' : isWalking ? 'walk' : 'stand'}
          size={80}
        />
      </div>

      {/* HUD - top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-30">
        <button
          onClick={(e) => { e.stopPropagation(); onQuit(); }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white/80 bg-black/20 backdrop-blur-sm active:scale-95 transition-transform"
        >
          ✕
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-black/20 backdrop-blur-sm">
            {location.emoji} {location.label}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-200 bg-black/20 backdrop-blur-sm">
            {discoveredCount}/{totalItems}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-14 left-4 right-4 z-30">
        <div className="h-1 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white/60"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Message caption - top, no background */}
      <AnimatePresence>
        {activeMessage && (
          <motion.p
            key={activeMessage}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 z-30 text-center text-white font-bold text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          >
            {activeMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hold to walk hint */}
      {!showIntro && !sceneFinished && !isWalking && scrollX < 30 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/60 text-xs font-medium drop-shadow"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Hold anywhere to walk →
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

      {/* Scene end overlay */}
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
