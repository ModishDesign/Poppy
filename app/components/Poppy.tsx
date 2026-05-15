'use client';

import { motion } from 'framer-motion';
import { LifeStage } from '../page';

type Pose = 'stand' | 'walk' | 'wag' | 'sit' | 'jump' | 'sleep';

interface Props {
  stage: LifeStage;
  pose?: Pose;
  size?: number;
  className?: string;
  flipX?: boolean;
}

const stageColors: Record<LifeStage, { body: string; belly: string; accent: string; collar: string }> = {
  puppy:      { body: '#D97706', belly: '#FCD34D', accent: '#F59E0B', collar: '#EC4899' },
  junior:     { body: '#C2410C', belly: '#FDBA74', accent: '#EA580C', collar: '#8B5CF6' },
  adolescent: { body: '#92400E', belly: '#FCA5A5', accent: '#B45309', collar: '#06B6D4' },
  adult:      { body: '#78350F', belly: '#FDE68A', accent: '#A16207', collar: '#10B981' },
  senior:     { body: '#A0845C', belly: '#E8D5B7', accent: '#8B7355', collar: '#F43F5E' },
};

const stageProportions: Record<LifeStage, { headScale: number; bodyLen: number; legLen: number }> = {
  puppy:      { headScale: 1.35, bodyLen: 0.7, legLen: 0.65 },
  junior:     { headScale: 1.15, bodyLen: 0.85, legLen: 0.8 },
  adolescent: { headScale: 1.0, bodyLen: 1.0, legLen: 1.1 },
  adult:      { headScale: 1.0, bodyLen: 1.0, legLen: 1.0 },
  senior:     { headScale: 1.05, bodyLen: 1.05, legLen: 0.9 },
};

export default function Poppy({ stage, pose = 'stand', size = 120, className, flipX = false }: Props) {
  const c = stageColors[stage];
  const p = stageProportions[stage];
  const isWalking = pose === 'walk';
  const isWagging = pose === 'wag' || pose === 'walk';
  const isJumping = pose === 'jump';
  const isSleeping = pose === 'sleep';

  const bodyW = 52 * p.bodyLen;
  const cx = 50, cy = 48;
  const headR = 14 * p.headScale;
  const headX = cx - bodyW / 2 - headR * 0.4;
  const headY = cy - 7;
  const legH = 14 * p.legLen;

  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 100 85"
      className={className}
      style={{ overflow: 'visible', transform: flipX ? 'scaleX(-1)' : undefined }}
    >
      {/* Shadow */}
      <ellipse cx={cx} cy={78} rx={bodyW / 2 + 5} ry={3} fill="rgba(0,0,0,0.15)" />

      {/* Tail */}
      <motion.path
        d={`M${cx + bodyW / 2 - 2},${cy - 4} Q${cx + bodyW / 2 + 8},${cy - 18} ${cx + bodyW / 2 + 14},${cy - 22}`}
        stroke={c.body}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        animate={isWagging ? { rotate: [0, 20, -20, 20, 0] } : {}}
        transition={isWagging ? { duration: 0.4, repeat: Infinity, ease: 'easeInOut' } : {}}
        style={{ transformOrigin: `${cx + bodyW / 2 - 2}px ${cy - 4}px` }}
      />

      {/* Body */}
      <ellipse cx={cx} cy={cy} rx={bodyW / 2} ry={10} fill={c.body} />
      <ellipse cx={cx} cy={cy + 2} rx={bodyW / 2 - 5} ry={6} fill={c.belly} />

      {/* Collar */}
      <ellipse cx={cx - bodyW / 2 + 8} cy={cy - 2} rx={5} ry={3} fill={c.collar} opacity={0.9} />
      <circle cx={cx - bodyW / 2 + 8} cy={cy + 1} r={1.5} fill="#FFD700" />

      {/* Legs */}
      {!isSleeping && (
        <>
          {[0, 1, 2, 3].map(i => {
            const isFront = i < 2;
            const baseX = isFront
              ? cx - bodyW / 2 + 7 + i * 7
              : cx + bodyW / 2 - 16 + (i - 2) * 7;
            return (
              <motion.rect
                key={i}
                x={baseX}
                y={cy + 8}
                width={4.5}
                height={legH}
                rx={2.2}
                fill={c.body}
                animate={isWalking ? {
                  rotate: i % 2 === 0 ? [0, 20, -20, 0] : [0, -20, 20, 0],
                } : isJumping ? { y: [cy + 8, cy + 4, cy + 8] } : {}}
                transition={isWalking ? {
                  duration: 0.35,
                  repeat: Infinity,
                  delay: i * 0.08,
                } : {}}
                style={{ transformOrigin: `${baseX + 2}px ${cy + 8}px` }}
              />
            );
          })}
          {/* Paws */}
          {[0, 1, 2, 3].map(i => {
            const isFront = i < 2;
            const baseX = isFront
              ? cx - bodyW / 2 + 7 + i * 7
              : cx + bodyW / 2 - 16 + (i - 2) * 7;
            return (
              <ellipse
                key={`paw-${i}`}
                cx={baseX + 2.2}
                cy={cy + 8 + legH}
                rx={3}
                ry={2}
                fill={c.accent}
              />
            );
          })}
        </>
      )}

      {/* Head */}
      <circle cx={headX} cy={headY} r={headR} fill={c.body} />

      {/* Ear */}
      <motion.ellipse
        cx={headX + headR * 0.6}
        cy={headY - headR * 0.3}
        rx={5}
        ry={11}
        fill={c.accent}
        transform={`rotate(30, ${headX + headR * 0.6}, ${headY - headR * 0.3})`}
        animate={isWagging ? { rotate: [30, 35, 25, 30] } : {}}
        transition={isWagging ? { duration: 0.5, repeat: Infinity } : {}}
        style={{ transformOrigin: `${headX + headR * 0.6}px ${headY - headR * 0.6}px` }}
      />

      {/* Snout */}
      <ellipse
        cx={headX - headR * 0.5}
        cy={headY + 3}
        rx={headR * 0.55}
        ry={headR * 0.38}
        fill={stage === 'senior' ? '#C4B39A' : c.belly}
      />

      {/* Nose */}
      <ellipse cx={headX - headR * 0.85} cy={headY + 2} rx={3} ry={2.2} fill="#1a1a1a" />
      <ellipse cx={headX - headR * 0.82} cy={headY + 1} rx={1.2} ry={0.8} fill="#444" />

      {/* Eyes */}
      {isSleeping ? (
        <path
          d={`M${headX - 5},${headY - 2} Q${headX - 2},${headY - 4} ${headX + 1},${headY - 2}`}
          fill="none" stroke="#1a1a1a" strokeWidth={1.5} strokeLinecap="round"
        />
      ) : (
        <>
          <circle cx={headX - 1} cy={headY - 4} r={3.5} fill="white" />
          <circle cx={headX - 1.5} cy={headY - 4} r={2.2} fill="#1a1a1a" />
          <circle cx={headX - 2.5} cy={headY - 5} r={0.9} fill="white" />
        </>
      )}

      {/* Mouth / Tongue */}
      {isWagging && !isSleeping && (
        <>
          <path
            d={`M${headX - headR * 0.6},${headY + 5.5} Q${headX - headR * 0.3},${headY + 9} ${headX},${headY + 5.5}`}
            fill="none" stroke="#B91C1C" strokeWidth={1.2} strokeLinecap="round"
          />
          <motion.ellipse
            cx={headX - headR * 0.3}
            cy={headY + 8.5}
            rx={2.5}
            ry={3.5}
            fill="#F87171"
            animate={{ scaleY: [1, 1.15, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </>
      )}

      {/* Cheek blush */}
      {!isSleeping && (
        <ellipse cx={headX + 4} cy={headY + 2} rx={3} ry={1.8} fill="#FECACA" opacity={0.5} />
      )}

      {/* Sleep z's */}
      {isSleeping && (
        <>
          <motion.text x={headX - 18} y={headY - 14} fill="white" fontSize={7} fontWeight="bold" opacity={0.7}
            animate={{ y: [headY - 14, headY - 24], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >z</motion.text>
          <motion.text x={headX - 12} y={headY - 20} fill="white" fontSize={9} fontWeight="bold" opacity={0.5}
            animate={{ y: [headY - 20, headY - 32], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >Z</motion.text>
        </>
      )}
    </svg>
  );
}
