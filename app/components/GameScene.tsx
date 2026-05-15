'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Poppy from './Poppy';
import type { Room } from '../page';

interface RoomConfig {
  id: Room;
  label: string;
  emoji: string;
}

interface Props {
  room: RoomConfig;
  roomIndex: number;
  totalRooms: number;
  onNextRoom: () => void;
  onPrevRoom: () => void;
  onQuit: () => void;
}

interface Discoverable {
  id: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  message: string;
  found: boolean;
}

const ROOM_THEMES: Record<Room, {
  wallColor: string;
  floorColor: string;
  floorPattern: string;
  wallAccent: string;
  lightColor: string;
}> = {
  'living-room': {
    wallColor: '#FEF3C7',
    floorColor: '#D2A679',
    floorPattern: '#C49B6F',
    wallAccent: '#FDE68A',
    lightColor: '#FFFBEB',
  },
  kitchen: {
    wallColor: '#ECFDF5',
    floorColor: '#9CA3AF',
    floorPattern: '#D1D5DB',
    wallAccent: '#A7F3D0',
    lightColor: '#F0FDF4',
  },
  bedroom: {
    wallColor: '#EDE9FE',
    floorColor: '#D2A679',
    floorPattern: '#C49B6F',
    wallAccent: '#DDD6FE',
    lightColor: '#F5F3FF',
  },
  garden: {
    wallColor: '#87CEEB',
    floorColor: '#4ADE80',
    floorPattern: '#22C55E',
    wallAccent: '#BAE6FD',
    lightColor: '#F0F9FF',
  },
};

const ROOM_ITEMS: Record<Room, Discoverable[]> = {
  'living-room': [
    { id: 'couch', emoji: '🛋️', label: 'Couch', x: 15, y: 52, message: 'Poppy jumps on the couch! So comfy!', found: false },
    { id: 'tv', emoji: '📺', label: 'TV', x: 42, y: 32, message: 'Poppy tilts her head at the TV. What is that animal?', found: false },
    { id: 'shoe', emoji: '👟', label: 'Shoe', x: 70, y: 72, message: 'Poppy found a shoe! Her favourite chew toy!', found: false },
    { id: 'plant', emoji: '🪴', label: 'Plant', x: 85, y: 48, message: 'Poppy sniffs the plant curiously.', found: false },
    { id: 'ball', emoji: '🎾', label: 'Tennis Ball', x: 55, y: 75, message: 'A tennis ball! Poppy\'s tail goes wild!', found: false },
  ],
  kitchen: [
    { id: 'bowl', emoji: '🥣', label: 'Food Bowl', x: 25, y: 72, message: 'Poppy checks her bowl. Dinnertime?', found: false },
    { id: 'fridge', emoji: '🧊', label: 'Fridge', x: 80, y: 38, message: 'Poppy stares at the fridge. She knows treats are in there!', found: false },
    { id: 'crumb', emoji: '🍪', label: 'Cookie Crumb', x: 50, y: 78, message: 'Poppy found a crumb! Delicious floor snack!', found: false },
    { id: 'water', emoji: '💧', label: 'Water Bowl', x: 30, y: 75, message: 'Slurp slurp! Poppy takes a big drink.', found: false },
    { id: 'bin', emoji: '🗑️', label: 'Bin', x: 65, y: 55, message: 'Poppy eyes the bin mischievously...', found: false },
  ],
  bedroom: [
    { id: 'bed', emoji: '🛏️', label: 'Bed', x: 30, y: 45, message: 'Poppy hops on the bed! No dogs allowed... oops!', found: false },
    { id: 'slipper', emoji: '🩴', label: 'Slipper', x: 60, y: 78, message: 'Poppy grabs a slipper and runs!', found: false },
    { id: 'sock', emoji: '🧦', label: 'Sock', x: 75, y: 72, message: 'A stinky sock! Poppy\'s favourite!', found: false },
    { id: 'blanket', emoji: '🧣', label: 'Blanket', x: 20, y: 65, message: 'Poppy burrows under the blanket like a sausage roll.', found: false },
    { id: 'toy', emoji: '🧸', label: 'Teddy Bear', x: 88, y: 60, message: 'Poppy carries the teddy around proudly!', found: false },
  ],
  garden: [
    { id: 'butterfly', emoji: '🦋', label: 'Butterfly', x: 35, y: 28, message: 'Poppy chases a butterfly! Almost got it!', found: false },
    { id: 'flower', emoji: '🌻', label: 'Sunflower', x: 70, y: 50, message: 'Poppy stops to smell the flowers. Achoo!', found: false },
    { id: 'bone', emoji: '🦴', label: 'Buried Bone', x: 50, y: 78, message: 'Poppy digs up a bone she buried last week!', found: false },
    { id: 'puddle', emoji: '💦', label: 'Puddle', x: 20, y: 72, message: 'Splish splash! Poppy jumps in the puddle!', found: false },
    { id: 'squirrel', emoji: '🐿️', label: 'Squirrel', x: 85, y: 35, message: 'SQUIRREL! Poppy goes absolutely mental!', found: false },
    { id: 'stick', emoji: '🪵', label: 'Stick', x: 60, y: 75, message: 'The perfect stick! Poppy is so proud of it.', found: false },
  ],
};

function RoomBackground({ room }: { room: Room }) {
  const theme = ROOM_THEMES[room];

  if (room === 'garden') {
    return (
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
        {/* Sky */}
        <rect x={0} y={0} width={400} height={180} fill={theme.wallColor} />
        {/* Clouds */}
        <ellipse cx={80} cy={40} rx={40} ry={15} fill="white" opacity={0.7} />
        <ellipse cx={60} cy={38} rx={25} ry={12} fill="white" opacity={0.6} />
        <ellipse cx={280} cy={55} rx={35} ry={12} fill="white" opacity={0.5} />
        <ellipse cx={300} cy={52} rx={20} ry={10} fill="white" opacity={0.4} />
        {/* Sun */}
        <circle cx={340} cy={40} r={25} fill="#FCD34D" opacity={0.8} />
        <circle cx={340} cy={40} r={20} fill="#FBBF24" />
        {/* Fence */}
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i}>
            <rect x={i * 35 + 5} y={135} width={6} height={50} rx={2} fill="#D2A679" />
            <rect x={i * 35} y={145} width={35} height={5} rx={2} fill="#C49B6F" />
            <rect x={i * 35} y={165} width={35} height={5} rx={2} fill="#C49B6F" />
          </g>
        ))}
        {/* Trees in background */}
        <rect x={20} y={95} width={10} height={50} fill="#92400E" rx={3} />
        <circle cx={25} cy={80} r={25} fill="#16A34A" opacity={0.8} />
        <circle cx={15} cy={90} r={18} fill="#22C55E" opacity={0.7} />
        <rect x={350} y={100} width={10} height={45} fill="#92400E" rx={3} />
        <circle cx={355} cy={85} r={22} fill="#16A34A" opacity={0.8} />
        {/* Grass ground */}
        <rect x={0} y={180} width={400} height={120} fill={theme.floorColor} />
        <path d="M0,180 Q20,172 40,180 Q60,172 80,180 Q100,172 120,180 Q140,172 160,180 Q180,172 200,180 Q220,172 240,180 Q260,172 280,180 Q300,172 320,180 Q340,172 360,180 Q380,172 400,180 V185 H0 Z" fill={theme.floorPattern} />
        {/* Flower patches */}
        <circle cx={100} cy={220} r={3} fill="#F472B6" />
        <circle cx={105} cy={222} r={3} fill="#FB923C" />
        <circle cx={250} cy={240} r={3} fill="#A78BFA" />
        <circle cx={320} cy={215} r={3} fill="#F472B6" />
        {/* Garden path */}
        <path d="M180,300 Q190,260 200,240 Q210,220 195,200 Q185,185 200,180" fill="none" stroke="#D2A679" strokeWidth={20} opacity={0.4} />
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
      {/* Wall */}
      <rect x={0} y={0} width={400} height={190} fill={theme.wallColor} />
      {/* Wall baseboard */}
      <rect x={0} y={175} width={400} height={15} fill={theme.wallAccent} opacity={0.5} />
      {/* Floor */}
      <rect x={0} y={190} width={400} height={110} fill={theme.floorColor} />
      {/* Floor boards/tiles */}
      {room === 'kitchen' ? (
        <>
          {Array.from({ length: 8 }, (_, i) =>
            Array.from({ length: 5 }, (_, j) => (
              <rect
                key={`${i}-${j}`}
                x={i * 52 + (j % 2) * 26}
                y={192 + j * 22}
                width={50}
                height={20}
                fill={j % 2 === i % 2 ? theme.floorPattern : theme.floorColor}
                opacity={0.8}
              />
            ))
          )}
        </>
      ) : (
        <>
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} x1={i * 42} y1={190} x2={i * 42} y2={300} stroke={theme.floorPattern} strokeWidth={1} opacity={0.4} />
          ))}
          {[210, 240, 270].map(y => (
            <line key={y} x1={0} y1={y} x2={400} y2={y} stroke={theme.floorPattern} strokeWidth={0.5} opacity={0.3} />
          ))}
        </>
      )}

      {/* Window */}
      <rect x={155} y={25} width={90} height={80} rx={4} fill={theme.lightColor} stroke={theme.wallAccent} strokeWidth={4} />
      <line x1={200} y1={25} x2={200} y2={105} stroke={theme.wallAccent} strokeWidth={3} />
      <line x1={155} y1={65} x2={245} y2={65} stroke={theme.wallAccent} strokeWidth={3} />
      {/* Curtains */}
      <path d="M148,20 Q155,25 155,40 Q152,55 150,70 Q148,80 146,95 Q155,90 158,80" fill={theme.wallAccent} opacity={0.5} />
      <path d="M252,20 Q245,25 245,40 Q248,55 250,70 Q252,80 254,95 Q245,90 242,80" fill={theme.wallAccent} opacity={0.5} />

      {/* Window light on floor */}
      <rect x={160} y={195} width={80} height={50} fill={theme.lightColor} opacity={0.3} rx={2} />

      {/* Room-specific furniture silhouettes */}
      {room === 'living-room' && (
        <>
          {/* Bookshelf */}
          <rect x={310} y={30} width={60} height={140} rx={3} fill="#92400E" opacity={0.2} />
          <rect x={315} y={35} width={50} height={25} fill="#A16207" opacity={0.15} />
          <rect x={315} y={65} width={50} height={25} fill="#A16207" opacity={0.15} />
          <rect x={315} y={95} width={50} height={25} fill="#A16207" opacity={0.15} />
          {/* Rug */}
          <ellipse cx={200} cy={250} rx={100} ry={30} fill="#DC2626" opacity={0.15} />
          <ellipse cx={200} cy={250} rx={80} ry={22} fill="#B91C1C" opacity={0.1} />
          {/* Lamp */}
          <rect x={36} y={90} width={4} height={80} fill="#78350F" opacity={0.25} />
          <path d="M25,90 Q38,70 51,90" fill="#FBBF24" opacity={0.2} />
        </>
      )}
      {room === 'kitchen' && (
        <>
          {/* Counter */}
          <rect x={0} y={90} width={120} height={10} fill="#78350F" opacity={0.2} />
          <rect x={0} y={100} width={120} height={75} fill="#F5F5F4" opacity={0.15} />
          {/* Stove */}
          <rect x={280} y={85} width={80} height={90} rx={3} fill="#F5F5F4" opacity={0.15} />
          <circle cx={300} cy={95} r={8} fill="#1F2937" opacity={0.08} />
          <circle cx={340} cy={95} r={8} fill="#1F2937" opacity={0.08} />
        </>
      )}
      {room === 'bedroom' && (
        <>
          {/* Bed frame */}
          <rect x={10} y={80} width={150} height={95} rx={6} fill="#92400E" opacity={0.15} />
          <rect x={15} y={85} width={140} height={60} rx={4} fill="#DBEAFE" opacity={0.2} />
          <ellipse cx={45} cy={95} r={18} fill="white" opacity={0.2} />
          {/* Nightstand */}
          <rect x={170} y={120} width={35} height={50} rx={3} fill="#78350F" opacity={0.15} />
          {/* Lamp on nightstand */}
          <rect x={185} y={100} width={4} height={20} fill="#78350F" opacity={0.2} />
          <ellipse cx={187} cy={98} rx={10} ry={6} fill="#FCD34D" opacity={0.15} />
        </>
      )}
    </svg>
  );
}

export default function GameScene({ room, roomIndex, totalRooms, onNextRoom, onPrevRoom, onQuit }: Props) {
  const [poppyX, setPoppyX] = useState(20);
  const [targetX, setTargetX] = useState(20);
  const [isMoving, setIsMoving] = useState(false);
  const [facingRight, setFacingRight] = useState(true);
  const [items, setItems] = useState<Discoverable[]>(ROOM_ITEMS[room.id].map(i => ({ ...i })));
  const [activeMessage, setActiveMessage] = useState<{ text: string; emoji: string } | null>(null);
  const [discoveredCount, setDiscoveredCount] = useState(0);
  const [showRoomIntro, setShowRoomIntro] = useState(true);
  const [pose, setPose] = useState<'stand' | 'walk' | 'sniff' | 'wag'>('stand');

  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setItems(ROOM_ITEMS[room.id].map(i => ({ ...i })));
    setDiscoveredCount(0);
    setPoppyX(20);
    setTargetX(20);
    setActiveMessage(null);
    setShowRoomIntro(true);
    setPose('stand');
    const timer = setTimeout(() => setShowRoomIntro(false), 1500);
    return () => clearTimeout(timer);
  }, [room.id]);

  useEffect(() => {
    const tick = () => {
      setPoppyX(prev => {
        const diff = targetX - prev;
        if (Math.abs(diff) < 1) {
          setIsMoving(false);
          return targetX;
        }
        setIsMoving(true);
        return prev + diff * 0.06;
      });
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [targetX]);

  useEffect(() => {
    if (isMoving) {
      setPose('walk');
    } else if (activeMessage) {
      setPose('sniff');
    } else {
      setPose('stand');
    }
  }, [isMoving, activeMessage]);

  const checkEncounters = useCallback((x: number) => {
    const nearItem = items.find(item => !item.found && Math.abs(item.x - x) < 8);
    if (nearItem) {
      setItems(prev => prev.map(i => i.id === nearItem.id ? { ...i, found: true } : i));
      setDiscoveredCount(c => c + 1);

      if (messageTimeout.current) clearTimeout(messageTimeout.current);
      setActiveMessage({ text: nearItem.message, emoji: nearItem.emoji });
      setPose('wag');
      messageTimeout.current = setTimeout(() => {
        setActiveMessage(null);
      }, 3500);
    }
  }, [items]);

  useEffect(() => {
    if (!isMoving && Math.abs(poppyX - targetX) < 2) {
      checkEncounters(poppyX);
    }
  }, [isMoving, poppyX, targetX, checkEncounters]);

  const handleTap = (e: React.PointerEvent) => {
    if (showRoomIntro) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(5, Math.min(90, xPercent));
    setFacingRight(clampedX > poppyX);
    setTargetX(clampedX);
  };

  const foundAll = discoveredCount === items.length;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={handleTap}
    >
      {/* Room background */}
      <RoomBackground room={room.id} />

      {/* Discoverable items */}
      {items.map(item => (
        <motion.div
          key={item.id}
          className="absolute z-10"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={item.found
            ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] }
            : { y: [0, -4, 0] }
          }
          transition={item.found
            ? { duration: 0.5 }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }
          }
        >
          <div className={`text-3xl ${item.found ? '' : 'drop-shadow-md'}`}>
            {!item.found && (
              <div className="relative">
                <span>{item.emoji}</span>
                <motion.div
                  className="absolute -inset-2 rounded-full border-2 border-amber-400/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Poppy */}
      <motion.div
        className="absolute z-20"
        style={{
          left: `${poppyX}%`,
          bottom: room.id === 'garden' ? '8%' : '12%',
          transform: 'translateX(-50%)',
        }}
      >
        <Poppy
          pose={pose}
          size={100}
          flipX={!facingRight}
        />
      </motion.div>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-30">
        <button
          onClick={(e) => { e.stopPropagation(); onQuit(); }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-amber-900/70 bg-white/60 backdrop-blur-md border border-white/40 active:scale-95 transition-transform"
        >
          ✕
        </button>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-sm font-bold text-amber-900 bg-white/60 backdrop-blur-md border border-white/40">
            {room.emoji} {room.label}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-700 bg-white/60 backdrop-blur-md border border-white/40">
            {discoveredCount}/{items.length}
          </div>
        </div>
      </div>

      {/* Discovery counter dots */}
      <div className="absolute top-14 left-0 right-0 flex justify-center gap-1.5 z-30">
        {items.map((item, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              item.found ? 'bg-amber-500' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Room navigation arrows */}
      {roomIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrevRoom(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-amber-900/60 text-lg font-bold active:scale-90 transition-transform"
        >
          ‹
        </button>
      )}
      {roomIndex < totalRooms - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNextRoom(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/40 flex items-center justify-center text-amber-900/60 text-lg font-bold active:scale-90 transition-transform"
        >
          ›
        </button>
      )}

      {/* All found celebration */}
      {foundAll && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-2xl bg-amber-500 text-white text-sm font-bold shadow-lg"
        >
          🎉 All discoveries found!
          {roomIndex < totalRooms - 1 && (
            <span className="ml-2 opacity-80">→ Next room</span>
          )}
        </motion.div>
      )}

      {/* Message bubble */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0, scale: 0.95 }}
            className="absolute bottom-28 left-4 right-4 z-30 flex justify-center"
          >
            <div className="px-4 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg">
              <p className="text-amber-900 text-sm font-medium text-center">
                <span className="text-lg mr-1">{activeMessage.emoji}</span>
                {activeMessage.text}
              </p>
            </div>
            <div className="w-3 h-3 bg-white/90 rotate-45 mx-auto -mt-1.5 border-r border-b border-white/60" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap hint */}
      {!showRoomIntro && discoveredCount === 0 && !isMoving && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-black/20 backdrop-blur-sm text-white/70 text-xs font-medium"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          Tap to move Poppy • Find all the hidden items!
        </motion.div>
      )}

      {/* Room intro overlay */}
      <AnimatePresence>
        {showRoomIntro && (
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
              <div className="text-5xl mb-2">{room.emoji}</div>
              <h2 className="text-2xl font-black text-white">{room.label}</h2>
              <p className="text-white/60 text-sm mt-1">Find {items.length} hidden items</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
