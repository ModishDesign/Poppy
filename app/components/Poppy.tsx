'use client';

import { motion } from 'framer-motion';

export type Pose = 'stand' | 'walk' | 'sit' | 'sniff' | 'sleep' | 'wag' | 'jump';

interface Props {
  pose?: Pose;
  size?: number;
  className?: string;
  flipX?: boolean;
}

export default function Poppy({ pose = 'stand', size = 120, className, flipX = false }: Props) {
  const isWalking = pose === 'walk';
  const isWagging = pose === 'wag' || pose === 'walk';
  const isSniffing = pose === 'sniff';
  const isSitting = pose === 'sit';
  const isSleeping = pose === 'sleep';

  const bodyColor = '#000000';      // pure black
  const darkFur = '#0a0a0a';        // near-black
  const lightFur = '#C8956C';       // tan markings
  const bellyColor = '#D4A574';     // tan belly
  const noseColor = '#222222';      // slightly lighter so visible on black head
  const eyeColor = '#2D1600';
  const tongueColor = '#E8556D';
  const collarColor = '#CC2936';
  const tagColor = '#FFD700';

  // Leg dimensions — short stubby dachshund legs
  const legH = isSitting ? 12 : 16;
  const backLegY = isSitting ? 72 : 70;
  const frontLegY = 68;
  const backPawY = isSitting ? 84 : 87;
  const frontPawY = isSitting ? 81 : 85;
  const tanLegY = isSitting ? 78 : 82;

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 160 100"
      className={className}
      style={{ overflow: 'visible', transform: flipX ? undefined : 'scaleX(-1)' }}
    >
      {/* Shadow */}
      <ellipse cx={80} cy={94} rx={50} ry={4} fill="rgba(0,0,0,0.15)" />

      {/* Tail — black */}
      <motion.path
        d={isSitting
          ? 'M128,66 Q140,53 145,46 Q148,40 144,36'
          : 'M128,52 Q142,38 148,30 Q152,24 148,20'
        }
        stroke={bodyColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        animate={isWagging ? { rotate: [0, 15, -15, 15, 0] } : {}}
        transition={isWagging ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : {}}
        style={{ transformOrigin: isSitting ? '128px 66px' : '128px 52px' }}
      />

      {/* Back legs — short & stubby */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [0, -15, 15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity } : {}}
            style={{ transformOrigin: `108px ${backLegY}px` }}
          >
            <rect x={104} y={backLegY} width={8} height={legH} rx={4} fill={bodyColor} />
            {!isSitting && <ellipse cx={108} cy={backPawY} rx={5.5} ry={3.5} fill={lightFur} />}
            {!isSitting && <rect x={104} y={tanLegY} width={8} height={6} rx={3} fill={lightFur} opacity={0.7} />}
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [0, 15, -15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity, delay: 0.08 } : {}}
            style={{ transformOrigin: `116px ${backLegY}px` }}
          >
            <rect x={113} y={backLegY} width={8} height={legH} rx={4} fill={bodyColor} />
            {!isSitting && <ellipse cx={117} cy={backPawY} rx={5.5} ry={3.5} fill={lightFur} />}
            {!isSitting && <rect x={113} y={tanLegY} width={8} height={6} rx={3} fill={lightFur} opacity={0.7} />}
          </motion.g>
          {isSitting && (
            <ellipse cx={112} cy={82} rx={12} ry={5} fill={bodyColor} />
          )}
        </>
      )}

      {/* Body - long sausage shape, sits low */}
      <ellipse
        cx={80}
        cy={isSitting ? 60 : 56}
        rx={48}
        ry={isSitting ? 16 : 14}
        fill={bodyColor}
      />
      {/* Belly - tan underside */}
      <ellipse
        cx={78}
        cy={isSitting ? 64 : 60}
        rx={38}
        ry={isSitting ? 9 : 7}
        fill={bellyColor}
        opacity={0.7}
      />

      {/* Front legs — short & stubby */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [0, 15, -15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity } : {}}
            style={{ transformOrigin: `44px ${frontLegY}px` }}
          >
            <rect x={40} y={frontLegY} width={8} height={legH} rx={4} fill={bodyColor} />
            <ellipse cx={44} cy={frontPawY} rx={5.5} ry={3.5} fill={lightFur} />
            <rect x={40} y={isSitting ? 76 : 80} width={8} height={6} rx={3} fill={lightFur} opacity={0.7} />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [0, -15, 15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity, delay: 0.08 } : {}}
            style={{ transformOrigin: `52px ${frontLegY}px` }}
          >
            <rect x={49} y={frontLegY} width={8} height={legH} rx={4} fill={bodyColor} />
            <ellipse cx={53} cy={frontPawY} rx={5.5} ry={3.5} fill={lightFur} />
            <rect x={49} y={isSitting ? 76 : 80} width={8} height={6} rx={3} fill={lightFur} opacity={0.7} />
          </motion.g>
        </>
      )}

      {/* Sleeping body - curled */}
      {isSleeping && (
        <>
          <ellipse cx={80} cy={74} rx={45} ry={18} fill={bodyColor} />
          <ellipse cx={80} cy={78} rx={35} ry={10} fill={bellyColor} opacity={0.4} />
        </>
      )}

      {/* Collar */}
      <rect
        x={30}
        y={isSitting ? 52 : 48}
        width={14}
        height={6}
        rx={3}
        fill={collarColor}
      />
      <circle cx={37} cy={isSitting ? 58 : 54} r={2.5} fill={tagColor} />

      {/* Chest - tan */}
      <ellipse cx={34} cy={isSitting ? 58 : 56} rx={8} ry={10} fill={lightFur} opacity={0.85} />

      {/* Head */}
      <motion.g
        animate={isSniffing ? { rotate: [0, -5, 5, -3, 0], y: [0, 2, 0, 2, 0] } : {}}
        transition={isSniffing ? { duration: 1.2, repeat: Infinity } : {}}
      >
        {/* Skull */}
        <ellipse
          cx={24}
          cy={isSitting ? 42 : 38}
          rx={18}
          ry={16}
          fill={bodyColor}
        />
        {/* Tan eyebrow dots — classic black & tan markings */}
        <circle cx={18} cy={isSitting ? 30 : 26} r={3.5} fill={lightFur} opacity={0.9} />
        <circle cx={28} cy={isSitting ? 30 : 26} r={3} fill={lightFur} opacity={0.7} />

        {/* Floppy ear */}
        <motion.ellipse
          cx={34}
          cy={isSitting ? 34 : 30}
          rx={8}
          ry={16}
          fill={darkFur}
          transform={`rotate(20, 34, ${isSitting ? 30 : 26})`}
          animate={isWagging ? { rotate: [20, 25, 15, 20] } : {}}
          transition={isWagging ? { duration: 0.5, repeat: Infinity } : {}}
          style={{ transformOrigin: `34px ${isSitting ? 28 : 24}px` }}
        />

        {/* Snout — tan muzzle */}
        <ellipse
          cx={8}
          cy={isSitting ? 44 : 40}
          rx={14}
          ry={10}
          fill={lightFur}
        />
        {/* Snout bridge — black on top blending to tan */}
        <ellipse
          cx={14}
          cy={isSitting ? 38 : 34}
          rx={8}
          ry={5}
          fill={bodyColor}
          opacity={0.5}
        />

        {/* Nose — dark but visible against black */}
        <ellipse cx={-3} cy={isSitting ? 40 : 36} rx={5} ry={4} fill={noseColor} />
        <ellipse cx={-2} cy={isSitting ? 38.5 : 34.5} rx={2} ry={1.2} fill="#555" />

        {/* Eye */}
        {isSleeping ? (
          <path
            d="M18,34 Q22,31 26,34"
            fill="none"
            stroke={eyeColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ) : (
          <>
            <circle cx={22} cy={isSitting ? 36 : 32} r={5.5} fill="white" />
            <circle cx={20.5} cy={isSitting ? 35.5 : 31.5} r={3.5} fill={eyeColor} />
            <circle cx={19} cy={isSitting ? 34 : 30} r={1.5} fill="white" />
            {/* Eyebrow — tan */}
            <path
              d={`M16,${isSitting ? 30 : 26} Q22,${isSitting ? 27 : 23} 28,${isSitting ? 29 : 25}`}
              fill="none"
              stroke={lightFur}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Mouth */}
        <path
          d={`M2,${isSitting ? 46 : 42} Q8,${isSitting ? 49 : 45} 14,${isSitting ? 46 : 42}`}
          fill="none"
          stroke="#6B4C30"
          strokeWidth={1.2}
          strokeLinecap="round"
        />

        {/* Tongue - visible when wagging */}
        {isWagging && !isSleeping && (
          <motion.ellipse
            cx={8}
            cy={isSitting ? 50 : 46}
            rx={3}
            ry={5}
            fill={tongueColor}
            animate={{ scaleY: [1, 1.15, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}

        {/* Cheek */}
        {!isSleeping && (
          <ellipse
            cx={16}
            cy={isSitting ? 46 : 42}
            rx={4}
            ry={2.5}
            fill="#F4A0A0"
            opacity={0.3}
          />
        )}

        {/* Whisker dots */}
        <circle cx={2} cy={isSitting ? 44 : 40} r={0.8} fill="#6B4C30" />
        <circle cx={0} cy={isSitting ? 46 : 42} r={0.8} fill="#6B4C30" />
      </motion.g>

      {/* Sleep z's */}
      {isSleeping && (
        <>
          <motion.text x={0} y={20} fill="#7C6DA6" fontSize={10} fontWeight="bold" opacity={0.6}
            animate={{ y: [20, 8], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >z</motion.text>
          <motion.text x={8} y={12} fill="#7C6DA6" fontSize={14} fontWeight="bold" opacity={0.4}
            animate={{ y: [12, -2], opacity: [0.4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
          >Z</motion.text>
        </>
      )}
    </svg>
  );
}
