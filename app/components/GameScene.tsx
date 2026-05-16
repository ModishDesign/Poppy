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

/* ─── pixel art background helpers ─── */
function px(x: number, y: number, w: number, h: number, fill: string) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} />;
}

function PixelScene({ location, scrollX, viewW }: { location: Location; scrollX: number; viewW: number }) {
  const farX = -scrollX * 0.15;
  const midX = -scrollX * 0.4;
  const nearX = -scrollX * 0.7;
  const P = 8; // pixel size

  switch (location) {
    case 'house':
      return (
        <>
          {/* Bright yellow wall */}
          <div className="absolute inset-0 bg-[#FFE566]" />
          {/* Wall pattern - pixel stripes */}
          <svg className="absolute inset-0 w-full h-full pixel-art" viewBox="0 0 400 300" preserveAspectRatio="none">
            {Array.from({ length: 50 }, (_, i) => px(0, i * 6, 400, 1, i % 2 === 0 ? '#FFD700' : '#FFE566'))}
          </svg>

          {/* Far layer furniture - big colourful pieces */}
          <svg className="absolute bottom-[22%] left-0 h-[60%] pixel-art" style={{ width: SCENE_WIDTH * 1.3, transform: `translateX(${farX}px)` }} viewBox="0 0 3120 180" preserveAspectRatio="none">
            {/* Giant pink couch */}
            {px(60, 60, 160, 80, '#FF6B9D')}
            {px(60, 50, 20, 90, '#E91E8C')}
            {px(200, 50, 20, 90, '#E91E8C')}
            {px(70, 65, 140, 10, '#FF8AB5')}
            {px(70, 130, 15, 20, '#E91E8C')}
            {px(185, 130, 15, 20, '#E91E8C')}
            {/* Cushions */}
            {px(80, 70, 50, 40, '#FF3D7F')}
            {px(140, 70, 50, 40, '#FF85A2')}

            {/* Tall blue bookshelf */}
            {px(300, 10, 80, 150, '#4F46E5')}
            {px(305, 15, 70, 3, '#6366F1')}
            {px(305, 50, 70, 3, '#6366F1')}
            {px(305, 85, 70, 3, '#6366F1')}
            {px(305, 120, 70, 3, '#6366F1')}
            {/* Colourful books */}
            {px(310, 20, 12, 28, '#EF4444')}
            {px(324, 22, 10, 26, '#10B981')}
            {px(336, 18, 14, 30, '#F59E0B')}
            {px(352, 24, 10, 24, '#8B5CF6')}
            {px(310, 55, 14, 28, '#EC4899')}
            {px(326, 57, 12, 26, '#06B6D4')}
            {px(340, 53, 10, 30, '#F97316')}
            {px(310, 90, 10, 28, '#22C55E')}
            {px(322, 92, 14, 26, '#3B82F6')}
            {px(338, 88, 12, 30, '#EF4444')}

            {/* Big green TV on stand */}
            {px(520, 40, 120, 80, '#1F2937')}
            {px(525, 45, 110, 70, '#10B981')}
            {px(530, 50, 100, 60, '#34D399')}
            {px(520, 120, 120, 10, '#374151')}
            {px(560, 130, 10, 30, '#4B5563')}
            {px(590, 130, 10, 30, '#4B5563')}

            {/* Orange lamp */}
            {px(700, 20, 8, 130, '#D97706')}
            {px(680, 10, 48, 15, '#F59E0B')}
            {px(685, 5, 38, 10, '#FBBF24')}

            {/* Kitchen: cyan fridge */}
            {px(900, 10, 70, 150, '#06B6D4')}
            {px(905, 15, 60, 60, '#22D3EE')}
            {px(905, 80, 60, 75, '#0891B2')}
            {px(950, 45, 10, 8, '#A5F3FC')}
            {px(950, 110, 10, 8, '#A5F3FC')}

            {/* Purple counter */}
            {px(1030, 80, 180, 15, '#7C3AED')}
            {px(1030, 95, 180, 65, '#6D28D9')}
            {px(1040, 100, 40, 55, '#5B21B6')}
            {px(1090, 100, 40, 55, '#5B21B6')}
            {px(1140, 100, 60, 55, '#5B21B6')}

            {/* Red stove */}
            {px(1280, 60, 100, 100, '#EF4444')}
            {px(1290, 65, 80, 10, '#F87171')}
            {px(1295, 80, 25, 25, '#1F2937')}
            {px(1340, 80, 25, 25, '#1F2937')}

            {/* Bedroom: big purple bed */}
            {px(1550, 50, 220, 80, '#A855F7')}
            {px(1550, 40, 30, 90, '#7C3AED')}
            {px(1740, 40, 30, 90, '#7C3AED')}
            {px(1560, 55, 80, 35, '#C084FC')}
            {px(1560, 55, 80, 15, '#E9D5FF')}
            {/* Pillow */}
            {px(1570, 58, 30, 20, '#FECDD3')}
            {/* Blanket pattern */}
            {px(1650, 55, 110, 35, '#D946EF')}
            {px(1660, 60, 30, 10, '#F0ABFC')}
            {px(1700, 65, 30, 10, '#F0ABFC')}

            {/* Yellow nightstand */}
            {px(1800, 80, 50, 70, '#FBBF24')}
            {px(1805, 85, 40, 15, '#F59E0B')}
            {px(1805, 110, 40, 15, '#F59E0B')}
            {/* Lamp on nightstand */}
            {px(1818, 40, 8, 40, '#D97706')}
            {px(1808, 30, 28, 12, '#FDE047')}

            {/* Door to garden */}
            {px(2000, 10, 80, 150, '#D97706')}
            {px(2010, 15, 60, 135, '#FBBF24')}
            {px(2060, 80, 8, 12, '#92400E')}
            {/* Window in door */}
            {px(2020, 25, 40, 40, '#38BDF8')}
            {px(2038, 25, 4, 40, '#D97706')}
            {px(2020, 43, 40, 4, '#D97706')}
          </svg>

          {/* Bright floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-[#F59E0B]" />
          {/* Floor pixel pattern */}
          <svg className="absolute bottom-0 left-0 right-0 h-[22%] pixel-art" viewBox="0 0 400 80" preserveAspectRatio="none">
            {Array.from({ length: 25 }, (_, i) =>
              Array.from({ length: 5 }, (_, j) => (
                <rect key={`${i}-${j}`} x={i * 16 + (j % 2) * 8} y={j * 16} width={16} height={16}
                  fill={(i + j) % 2 === 0 ? '#FBBF24' : '#F59E0B'} />
              ))
            )}
          </svg>
          {/* Baseboard */}
          <div className="absolute bottom-[22%] left-0 right-0 h-[2%] bg-[#E879F9]" />
        </>
      );

    case 'garden':
      return (
        <>
          {/* Bright blue sky */}
          <div className="absolute inset-0 bg-[#38BDF8]" />
          {/* Pixel clouds */}
          <svg className="absolute top-0 left-0 w-full h-[45%] pixel-art" style={{ transform: `translateX(${farX * 0.5}px)` }} viewBox="0 0 500 150" preserveAspectRatio="none">
            {/* Cloud 1 */}
            {px(40, 20, 40, P, 'white')}{px(32, 28, 56, P, 'white')}{px(24, 36, 72, P, 'white')}{px(32, 44, 56, P, 'white')}
            {/* Cloud 2 */}
            {px(200, 40, 48, P, 'white')}{px(192, 48, 64, P, 'white')}{px(200, 56, 48, P, 'white')}
            {/* Cloud 3 */}
            {px(380, 25, 32, P, 'white')}{px(372, 33, 48, P, 'white')}{px(380, 41, 32, P, 'white')}
            {/* Big pixel sun */}
            {px(420, 15, 40, 40, '#FBBF24')}{px(416, 19, 48, 32, '#FDE047')}{px(424, 23, 32, 24, '#FEF3C7')}
          </svg>
          {/* Big pixel trees */}
          <svg className="absolute bottom-[22%] left-0 h-[55%] pixel-art" style={{ width: SCENE_WIDTH * 1.3, transform: `translateX(${farX}px)` }} viewBox="0 0 3120 170" preserveAspectRatio="none">
            {[80, 400, 750, 1100, 1500, 1900, 2300, 2700].map((x, i) => (
              <g key={i}>
                {/* Trunk */}
                {px(x + 16, 100, 16, 70, '#92400E')}
                {/* Canopy - big colourful */}
                {px(x, 40, 48, 16, i % 2 === 0 ? '#22C55E' : '#4ADE80')}
                {px(x - 8, 56, 64, 16, i % 2 === 0 ? '#16A34A' : '#22C55E')}
                {px(x - 16, 72, 80, 16, i % 2 === 0 ? '#15803D' : '#16A34A')}
                {px(x - 8, 88, 64, 16, i % 2 === 0 ? '#22C55E' : '#4ADE80')}
              </g>
            ))}
            {/* Pixel flowers */}
            {[150, 320, 550, 850, 1050, 1350, 1650, 1950, 2200, 2550].map((x, i) => (
              <g key={`f${i}`}>
                {px(x, 150, 4, 16, '#16A34A')}
                {px(x - 4, 142, 12, 12, ['#FF6B9D', '#FBBF24', '#A855F7', '#06B6D4', '#F97316', '#EC4899', '#22C55E', '#EF4444', '#8B5CF6', '#FDE047'][i])}
                {px(x, 146, 4, 4, '#FDE047')}
              </g>
            ))}
          </svg>
          {/* Pixel fence */}
          <svg className="absolute bottom-[22%] left-0 h-[12%] pixel-art" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 40" preserveAspectRatio="none">
            {Array.from({ length: 90 }, (_, i) => (
              <g key={i}>
                {px(i * 32 + 4, 0, 6, 40, '#FBBF24')}
                {px(i * 32 + 4, 0, 6, 6, '#FDE047')}
                {i < 89 && px(i * 32, 10, 32, 4, '#F59E0B')}
                {i < 89 && px(i * 32, 26, 32, 4, '#F59E0B')}
              </g>
            ))}
          </svg>
          {/* Bright green grass */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-[#4ADE80]" />
          {/* Grass pixel top */}
          <svg className="absolute bottom-[22%] left-0 right-0 h-[3%] pixel-art" viewBox="0 0 400 10" preserveAspectRatio="none">
            {Array.from({ length: 50 }, (_, i) => px(i * 8, i % 3 === 0 ? 0 : 4, 8, i % 3 === 0 ? 10 : 6, i % 2 === 0 ? '#22C55E' : '#16A34A'))}
          </svg>
        </>
      );

    case 'beach':
      return (
        <>
          <div className="absolute inset-0 bg-[#0EA5E9]" />
          <svg className="absolute top-0 left-0 w-full h-[40%] pixel-art" style={{ transform: `translateX(${farX * 0.3}px)` }} viewBox="0 0 500 130" preserveAspectRatio="none">
            {px(400, 10, 48, 48, '#FBBF24')}{px(404, 14, 40, 40, '#FDE047')}{px(408, 18, 32, 32, '#FEF3C7')}
            {px(60, 20, 48, P, 'white')}{px(52, 28, 64, P, 'white')}{px(60, 36, 48, P, 'white')}
            {px(260, 35, 40, P, 'white')}{px(252, 43, 56, P, 'white')}{px(260, 51, 40, P, 'white')}
          </svg>
          {/* Pixel waves */}
          <svg className="absolute bottom-[28%] left-0 h-[15%] pixel-art" style={{ width: SCENE_WIDTH * 1.5, transform: `translateX(${farX}px)` }} viewBox="0 0 3600 50" preserveAspectRatio="none">
            {Array.from({ length: 60 }, (_, i) => (
              <g key={i}>
                {px(i * 60, i % 2 === 0 ? 10 : 20, 30, 8, '#0284C7')}
                {px(i * 60 + 30, i % 2 === 0 ? 20 : 10, 30, 8, '#0EA5E9')}
              </g>
            ))}
          </svg>
          {/* Big beach items */}
          <svg className="absolute bottom-[22%] left-0 h-[30%] pixel-art" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 90" preserveAspectRatio="none">
            {/* Beach umbrella */}
            {px(200, 10, 80, 8, '#EF4444')}{px(208, 2, 64, 8, '#F97316')}{px(216, 0, 48, 4, '#FBBF24')}
            {px(237, 18, 6, 70, '#92400E')}
            {/* Sandcastle */}
            {px(800, 40, 60, 48, '#FBBF24')}{px(810, 30, 16, 10, '#FDE047')}{px(834, 30, 16, 10, '#FDE047')}
            {px(820, 20, 20, 14, '#F59E0B')}{px(825, 16, 10, 6, '#EF4444')}
            {/* Surfboard */}
            {px(1400, 20, 12, 60, '#EC4899')}{px(1402, 15, 8, 5, '#F472B6')}{px(1402, 78, 8, 5, '#F472B6')}
            {/* Bucket and spade */}
            {px(2000, 50, 30, 30, '#3B82F6')}{px(2005, 45, 20, 8, '#60A5FA')}{px(2035, 55, 20, 6, '#F59E0B')}
          </svg>
          {/* Wet sand */}
          <div className="absolute bottom-[18%] left-0 right-0 h-[8%] bg-[#D4A96A]" />
          {/* Dry sand */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-[#FDE68A]" />
          <svg className="absolute bottom-0 left-0 right-0 h-[22%] pixel-art" viewBox="0 0 400 80" preserveAspectRatio="none">
            {Array.from({ length: 20 }, (_, i) => px(i * 24 + Math.random() * 10, 20 + (i % 3) * 20, 4, 4, '#FBBF24'))}
          </svg>
        </>
      );

    case 'park':
      return (
        <>
          <div className="absolute inset-0 bg-[#38BDF8]" />
          <svg className="absolute top-0 left-0 w-full h-[35%] pixel-art" style={{ transform: `translateX(${farX * 0.3}px)` }} viewBox="0 0 500 120" preserveAspectRatio="none">
            {px(80, 15, 40, P, 'white')}{px(72, 23, 56, P, 'white')}{px(80, 31, 40, P, 'white')}
            {px(300, 30, 48, P, 'white')}{px(292, 38, 64, P, 'white')}{px(300, 46, 48, P, 'white')}
          </svg>
          {/* Big park trees */}
          <svg className="absolute bottom-[22%] left-0 h-[60%] pixel-art" style={{ width: SCENE_WIDTH * 1.3, transform: `translateX(${farX}px)` }} viewBox="0 0 3120 180" preserveAspectRatio="none">
            {[100, 500, 850, 1250, 1600, 2000, 2400, 2800].map((x, i) => (
              <g key={i}>
                {px(x + 20, 110, 20, 70, '#92400E')}
                {px(x - 8, 30, 76, 20, i % 3 === 0 ? '#22C55E' : i % 3 === 1 ? '#4ADE80' : '#10B981')}
                {px(x - 16, 50, 92, 20, i % 3 === 0 ? '#16A34A' : i % 3 === 1 ? '#22C55E' : '#059669')}
                {px(x - 8, 70, 76, 20, i % 3 === 0 ? '#15803D' : i % 3 === 1 ? '#16A34A' : '#047857')}
                {px(x, 90, 60, 20, i % 3 === 0 ? '#22C55E' : i % 3 === 1 ? '#4ADE80' : '#10B981')}
              </g>
            ))}
            {/* Pixel pond */}
            {px(400, 140, 80, 30, '#0EA5E9')}{px(408, 136, 64, 8, '#38BDF8')}{px(416, 148, 16, 4, '#7DD3FC')}
            {/* Park bench */}
            {px(1100, 120, 70, 8, '#F59E0B')}{px(1100, 128, 8, 24, '#D97706')}{px(1162, 128, 8, 24, '#D97706')}
            {px(1104, 112, 62, 8, '#FBBF24')}
            {/* Fountain */}
            {px(1800, 100, 60, 50, '#9CA3AF')}{px(1810, 95, 40, 8, '#D1D5DB')}
            {px(1826, 60, 8, 35, '#9CA3AF')}{px(1818, 56, 24, 8, '#38BDF8')}{px(1814, 50, 32, 8, '#7DD3FC')}
          </svg>
          {/* Path */}
          <svg className="absolute bottom-[20%] left-0 h-[6%] pixel-art" style={{ width: SCENE_WIDTH * 1.2, transform: `translateX(${midX}px)` }} viewBox="0 0 2880 20" preserveAspectRatio="none">
            <rect x={0} y={4} width={2880} height={14} fill="#D2A679" />
            {Array.from({ length: 100 }, (_, i) => px(i * 30, 8, 12, 4, '#E5C9A0'))}
          </svg>
          {/* Grass */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-[#4ADE80]" />
          <svg className="absolute bottom-[22%] left-0 right-0 h-[3%] pixel-art" viewBox="0 0 400 10" preserveAspectRatio="none">
            {Array.from({ length: 50 }, (_, i) => px(i * 8, i % 3 === 0 ? 0 : 4, 8, i % 3 === 0 ? 10 : 6, i % 2 === 0 ? '#22C55E' : '#16A34A'))}
          </svg>
        </>
      );

    case 'cafe':
      return (
        <>
          {/* Warm orange wall */}
          <div className="absolute inset-0 bg-[#FBBF24]" />
          <svg className="absolute inset-0 w-full h-full pixel-art" viewBox="0 0 400 300" preserveAspectRatio="none">
            {Array.from({ length: 50 }, (_, i) => px(0, i * 6, 400, 1, i % 2 === 0 ? '#F59E0B' : '#FBBF24'))}
          </svg>
          {/* Wall art & lights */}
          <svg className="absolute top-0 left-0 w-full h-[50%] pixel-art" style={{ transform: `translateX(${farX}px)` }} viewBox="0 0 2400 150" preserveAspectRatio="none">
            {/* Colourful art frames */}
            {[120, 400, 700, 1000, 1350, 1700, 2050].map((x, i) => (
              <g key={i}>
                {px(x, 20, 50, 40, ['#EF4444', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F97316', '#06B6D4'][i])}
                {px(x + 4, 24, 42, 32, ['#FCA5A5', '#C4B5FD', '#FBCFE8', '#6EE7B7', '#93C5FD', '#FDBA74', '#67E8F9'][i])}
              </g>
            ))}
            {/* Pendant lights */}
            {[200, 550, 900, 1250, 1600, 1950].map((x, i) => (
              <g key={`l${i}`}>
                {px(x, 0, 4, 30, '#92400E')}
                {px(x - 12, 30, 28, 12, '#FDE047')}
                {px(x - 8, 34, 20, 4, '#FEF3C7')}
              </g>
            ))}
          </svg>
          {/* Big furniture */}
          <svg className="absolute bottom-[22%] left-0 h-[50%] pixel-art" style={{ width: SCENE_WIDTH * 1.3, transform: `translateX(${midX}px)` }} viewBox="0 0 3120 150" preserveAspectRatio="none">
            {/* Counter/bar - long and tall */}
            {px(50, 40, 250, 80, '#D97706')}
            {px(55, 35, 240, 8, '#F59E0B')}
            {px(55, 45, 240, 10, '#E5A87C')}
            {/* Coffee machine on counter */}
            {px(80, 10, 40, 30, '#4B5563')}
            {px(85, 5, 30, 8, '#6B7280')}
            {px(90, 0, 8, 8, '#EF4444')}

            {/* Colourful tables & chairs scattered */}
            {[400, 800, 1200, 1600, 2000, 2400, 2800].map((x, i) => (
              <g key={i}>
                {/* Table */}
                {px(x, 80, 60, 8, ['#EF4444', '#3B82F6', '#22C55E', '#A855F7', '#F97316', '#EC4899', '#06B6D4'][i])}
                {px(x + 12, 88, 8, 40, ['#B91C1C', '#1D4ED8', '#15803D', '#7C3AED', '#C2410C', '#BE185D', '#0891B2'][i])}
                {px(x + 40, 88, 8, 40, ['#B91C1C', '#1D4ED8', '#15803D', '#7C3AED', '#C2410C', '#BE185D', '#0891B2'][i])}
                {/* Chair */}
                {px(x - 20, 90, 16, 4, ['#FBBF24', '#F472B6', '#A78BFA', '#34D399', '#FB923C', '#67E8F9', '#FDE047'][i])}
                {px(x - 16, 94, 8, 34, ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#F97316', '#06B6D4', '#FBBF24'][i])}
                {px(x - 20, 82, 4, 12, ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#F97316', '#06B6D4', '#FBBF24'][i])}
              </g>
            ))}

            {/* Display case with cakes */}
            {px(2900, 50, 80, 80, '#F5F5F4')}
            {px(2905, 55, 70, 3, '#D1D5DB')}
            {px(2910, 62, 15, 12, '#EC4899')}
            {px(2930, 65, 12, 9, '#FBBF24')}
            {px(2948, 60, 18, 14, '#8B5CF6')}
          </svg>

          {/* Warm tile floor */}
          <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-[#F97316]" />
          <svg className="absolute bottom-0 left-0 right-0 h-[22%] pixel-art" viewBox="0 0 400 80" preserveAspectRatio="none">
            {Array.from({ length: 25 }, (_, i) =>
              Array.from({ length: 5 }, (_, j) => (
                <rect key={`${i}-${j}`} x={i * 16 + (j % 2) * 8} y={j * 16} width={16} height={16}
                  fill={(i + j) % 2 === 0 ? '#FB923C' : '#F97316'} />
              ))
            )}
          </svg>
          <div className="absolute bottom-[22%] left-0 right-0 h-[2%] bg-[#D97706]" />
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

  useEffect(() => {
    const poppyPct = (scrollRef.current / SCENE_WIDTH) * 100;
    const currentJumpY = jumpYRef.current;
    items.forEach(item => {
      if (!item.found && Math.abs(item.xPos - poppyPct) < 4) {
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
      <PixelScene location={location.id} scrollX={scrollX} viewW={viewW} />

      {/* Items */}
      {items.map(item => {
        const worldX = (item.xPos / 100) * SCENE_WIDTH;
        const screenX = worldX - scrollX + viewW * 0.35;
        if (screenX < -60 || screenX > viewW + 60 || item.found) return null;
        const bottomOffset = 22 + HEIGHT_OFFSETS[item.height] * 0.18;
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
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] font-bold text-yellow-300 whitespace-nowrap drop-shadow"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↑ JUMP
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Poppy - small compared to furniture */}
      <div
        className="absolute z-20"
        style={{
          left: '35%',
          bottom: `${16 + jumpY * 0.08}%`,
          transform: 'translateX(-50%)',
        }}
      >
        <Poppy
          pose={sceneFinished ? 'wag' : isJumping ? 'jump' : isWalking ? 'walk' : 'stand'}
          size={65}
        />
      </div>

      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-30">
        <button
          onClick={(e) => { e.stopPropagation(); onQuit(); }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white bg-black/30 active:scale-95 transition-transform"
        >
          ✕
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-black/30">
            {location.emoji} {location.label}
          </div>
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-yellow-300 bg-black/30">
            {discoveredCount}/{totalItems}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-14 left-4 right-4 z-30">
        <div className="h-2 rounded-full bg-black/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400"
            animate={{ width: `${progress * 100}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Jump button */}
      {!showIntro && !sceneFinished && (
        <motion.button
          className="absolute bottom-6 right-5 z-30 w-14 h-14 rounded-2xl bg-[#FF6B9D] border-4 border-[#FF3D7F] flex items-center justify-center text-xl font-black text-white shadow-lg active:scale-90 transition-transform"
          style={{ imageRendering: 'pixelated' }}
          onPointerDown={e => { e.stopPropagation(); handleJump(); }}
          whileTap={{ scale: 0.85 }}
        >
          ↑
        </motion.button>
      )}

      {/* Caption — top, no background */}
      <AnimatePresence>
        {activeMessage && (
          <motion.p
            key={activeMessage}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-4 right-4 z-30 text-center text-white font-black text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
          >
            {activeMessage}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hold hint */}
      {!showIntro && !sceneFinished && !isWalking && scrollX < 30 && (
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/80 text-xs font-bold drop-shadow"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Hold to walk · Tap ↑ to jump
        </motion.div>
      )}

      {/* Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }} className="text-center">
              <div className="text-5xl mb-2">{location.emoji}</div>
              <h2 className="text-3xl font-black text-white drop-shadow-lg">{location.label}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene end */}
      <AnimatePresence>
        {sceneFinished && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-black/40">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-xl font-black text-white">Found {discoveredCount}/{totalItems}</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
