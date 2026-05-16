'use client';

import { motion } from 'framer-motion';
import { LOCATIONS, RARITY_COLORS } from '../types';
import type { Location, Rarity } from '../types';

// All items across all locations for the journal
const ALL_ITEMS: { location: Location; id: string; emoji: string; label: string; rarity: Rarity }[] = [
  // House
  { location: 'house', id: 'couch', emoji: '🛋️', label: 'Couch', rarity: 'common' },
  { location: 'house', id: 'shoe', emoji: '👟', label: 'Shoe', rarity: 'common' },
  { location: 'house', id: 'tv', emoji: '📺', label: 'TV', rarity: 'uncommon' },
  { location: 'house', id: 'bowl', emoji: '🥣', label: 'Food Bowl', rarity: 'common' },
  { location: 'house', id: 'crumb', emoji: '🍪', label: 'Cookie', rarity: 'common' },
  { location: 'house', id: 'bin', emoji: '🗑️', label: 'Bin', rarity: 'common' },
  { location: 'house', id: 'bed', emoji: '🛏️', label: 'Bed', rarity: 'uncommon' },
  { location: 'house', id: 'sock', emoji: '🧦', label: 'Sock', rarity: 'common' },
  { location: 'house', id: 'teddy', emoji: '🧸', label: 'Teddy', rarity: 'uncommon' },
  { location: 'house', id: 'ball', emoji: '🎾', label: 'Ball', rarity: 'rare' },
  // Garden
  { location: 'garden', id: 'butterfly', emoji: '🦋', label: 'Butterfly', rarity: 'rare' },
  { location: 'garden', id: 'flower', emoji: '🌻', label: 'Sunflower', rarity: 'common' },
  { location: 'garden', id: 'puddle', emoji: '💦', label: 'Puddle', rarity: 'common' },
  { location: 'garden', id: 'bone', emoji: '🦴', label: 'Bone', rarity: 'uncommon' },
  { location: 'garden', id: 'squirrel', emoji: '🐿️', label: 'Squirrel', rarity: 'rare' },
  { location: 'garden', id: 'stick', emoji: '🪵', label: 'Stick', rarity: 'common' },
  { location: 'garden', id: 'hose', emoji: '💧', label: 'Hose', rarity: 'uncommon' },
  { location: 'garden', id: 'ladybug', emoji: '🐞', label: 'Ladybug', rarity: 'common' },
  // Beach
  { location: 'beach', id: 'wave', emoji: '🌊', label: 'Wave', rarity: 'common' },
  { location: 'beach', id: 'crab', emoji: '🦀', label: 'Crab', rarity: 'uncommon' },
  { location: 'beach', id: 'shell', emoji: '🐚', label: 'Shell', rarity: 'common' },
  { location: 'beach', id: 'seagull', emoji: '🕊️', label: 'Seagull', rarity: 'rare' },
  { location: 'beach', id: 'sandcastle', emoji: '🏰', label: 'Sandcastle', rarity: 'uncommon' },
  { location: 'beach', id: 'icecream', emoji: '🍦', label: 'Ice Cream', rarity: 'uncommon' },
  { location: 'beach', id: 'driftwood', emoji: '🪵', label: 'Driftwood', rarity: 'common' },
  { location: 'beach', id: 'rockpool', emoji: '🪸', label: 'Rockpool', rarity: 'common' },
  // Park
  { location: 'park', id: 'duck', emoji: '🦆', label: 'Duck', rarity: 'common' },
  { location: 'park', id: 'frisbee', emoji: '🥏', label: 'Frisbee', rarity: 'rare' },
  { location: 'park', id: 'picnic', emoji: '🧺', label: 'Picnic', rarity: 'common' },
  { location: 'park', id: 'fountain', emoji: '⛲', label: 'Fountain', rarity: 'uncommon' },
  { location: 'park', id: 'jogger', emoji: '🏃', label: 'Jogger', rarity: 'common' },
  { location: 'park', id: 'dog-friend', emoji: '🐕', label: 'Dog Friend', rarity: 'uncommon' },
  { location: 'park', id: 'kite', emoji: '🪁', label: 'Kite', rarity: 'rare' },
  { location: 'park', id: 'bench', emoji: '🪑', label: 'Bench', rarity: 'common' },
  // Cafe
  { location: 'cafe', id: 'puppuccino', emoji: '☕', label: 'Puppuccino', rarity: 'uncommon' },
  { location: 'cafe', id: 'croissant', emoji: '🥐', label: 'Croissant', rarity: 'common' },
  { location: 'cafe', id: 'cat', emoji: '🐱', label: 'Café Cat', rarity: 'rare' },
  { location: 'cafe', id: 'chair-leg', emoji: '🪑', label: 'Chair Leg', rarity: 'common' },
  { location: 'cafe', id: 'cake', emoji: '🍰', label: 'Cake', rarity: 'uncommon' },
  { location: 'cafe', id: 'newspaper', emoji: '📰', label: 'Newspaper', rarity: 'common' },
  { location: 'cafe', id: 'baby', emoji: '👶', label: 'Baby', rarity: 'uncommon' },
  { location: 'cafe', id: 'treat-jar', emoji: '🍪', label: 'Treat Jar', rarity: 'rare' },
];

interface Props {
  collectedItems: string[];
  treats: number;
  onBack: () => void;
}

export default function Journal({ collectedItems, treats, onBack }: Props) {
  const totalItems = ALL_ITEMS.length;
  const foundCount = collectedItems.length;

  return (
    <div className="h-full w-full bg-gradient-to-b from-amber-100 to-amber-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-amber-100/90 backdrop-blur p-4 flex items-center justify-between border-b border-amber-200">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-amber-300 flex items-center justify-center text-amber-800 font-bold active:scale-95"
        >
          ←
        </button>
        <h1 className="text-xl font-black text-amber-900">Collection Journal</h1>
        <div className="flex items-center gap-1 text-amber-700 font-bold text-sm">
          🦴 {treats}
        </div>
      </div>

      {/* Overall progress */}
      <div className="px-4 py-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-800 font-bold text-sm">Total Discovered</span>
            <span className="text-amber-600 font-black">{foundCount}/{totalItems}</span>
          </div>
          <div className="h-3 rounded-full bg-amber-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${(foundCount / totalItems) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Items by location */}
      {LOCATIONS.map(loc => {
        const locItems = ALL_ITEMS.filter(i => i.location === loc.id);
        const locFound = locItems.filter(i => collectedItems.includes(`${loc.id}:${i.id}`));
        return (
          <div key={loc.id} className="px-4 py-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{loc.emoji}</span>
              <span className="text-amber-800 font-bold">{loc.label}</span>
              <span className="text-amber-500 text-xs font-bold ml-auto">{locFound.length}/{locItems.length}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {locItems.map(item => {
                const isFound = collectedItems.includes(`${loc.id}:${item.id}`);
                return (
                  <motion.div
                    key={item.id}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 ${
                      isFound ? 'bg-white shadow-sm' : 'bg-amber-200/50'
                    }`}
                    whileTap={isFound ? { scale: 0.95 } : {}}
                  >
                    {isFound ? (
                      <>
                        <span className="text-3xl">{item.emoji}</span>
                        <span className="text-[9px] font-bold text-amber-700 leading-tight text-center px-1">{item.label}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RARITY_COLORS[item.rarity] }} />
                      </>
                    ) : (
                      <>
                        <span className="text-3xl opacity-20">❓</span>
                        <span className="text-[9px] font-bold text-amber-400">???</span>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Rarity legend */}
      <div className="px-4 py-4 mt-2">
        <div className="bg-white/60 rounded-xl p-3 flex items-center justify-center gap-4 text-xs font-bold text-amber-700">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" /> Common</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" /> Uncommon</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#F472B6]" /> Rare</span>
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
