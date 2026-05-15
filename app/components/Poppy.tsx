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

  const bodyColor = '#B8510D';
  const darkFur = '#8B3A06';
  const lightFur = '#D4782F';
  const bellyColor = '#E8A44E';
  const noseColor = '#1a1a1a';
  const eyeColor = '#2D1600';
  const tongueColor = '#E8556D';
  const collarColor = '#CC2936';
  const tagColor = '#FFD700';

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 160 112"
      className={className}
      style={{ overflow: 'visible', transform: flipX ? 'scaleX(-1)' : undefined }}
    >
      {/* Shadow */}
      <ellipse cx={80} cy={108} rx={50} ry={4} fill="rgba(0,0,0,0.12)" />

      {/* Tail */}
      <motion.path
        d={isSitting
          ? 'M128,68 Q140,55 145,48 Q148,42 144,38'
          : 'M128,52 Q142,38 148,30 Q152,24 148,20'
        }
        stroke={bodyColor}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        animate={isWagging ? { rotate: [0, 15, -15, 15, 0] } : {}}
        transition={isWagging ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : {}}
        style={{ transformOrigin: isSitting ? '128px 68px' : '128px 52px' }}
      />

      {/* Back legs */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [0, -18, 18, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity } : {}}
            style={{ transformOrigin: '108px 68px' }}
          >
            <rect x={104} y={isSitting ? 72 : 68} width={7} height={isSitting ? 18 : 28} rx={3.5} fill={darkFur} />
            {!isSitting && <ellipse cx={107.5} cy={97} rx={5} ry={3.5} fill={bodyColor} />}
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [0, 18, -18, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity, delay: 0.08 } : {}}
            style={{ transformOrigin: '116px 68px' }}
          >
            <rect x={112} y={isSitting ? 72 : 68} width={7} height={isSitting ? 18 : 28} rx={3.5} fill={bodyColor} />
            {!isSitting && <ellipse cx={115.5} cy={97} rx={5} ry={3.5} fill={lightFur} />}
          </motion.g>
          {isSitting && (
            <ellipse cx={112} cy={88} rx={12} ry={5} fill={bodyColor} />
          )}
        </>
      )}

      {/* Body - long sausage shape */}
      <ellipse
        cx={80}
        cy={isSitting ? 62 : 56}
        rx={48}
        ry={isSitting ? 16 : 14}
        fill={bodyColor}
      />
      {/* Belly highlight */}
      <ellipse
        cx={78}
        cy={isSitting ? 66 : 60}
        rx={38}
        ry={isSitting ? 9 : 7}
        fill={bellyColor}
        opacity={0.5}
      />
      {/* Back fur detail */}
      <ellipse
        cx={85}
        cy={isSitting ? 52 : 46}
        rx={35}
        ry={6}
        fill={darkFur}
        opacity={0.3}
      />

      {/* Front legs */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [0, 18, -18, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity } : {}}
            style={{ transformOrigin: '44px 65px' }}
          >
            <rect x={40} y={65} width={7} height={isSitting ? 26 : 30} rx={3.5} fill={darkFur} />
            <ellipse cx={43.5} cy={isSitting ? 92 : 96} rx={5} ry={3.5} fill={bodyColor} />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [0, -18, 18, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity, delay: 0.08 } : {}}
            style={{ transformOrigin: '52px 65px' }}
          >
            <rect x={48} y={65} width={7} height={isSitting ? 26 : 30} rx={3.5} fill={bodyColor} />
            <ellipse cx={51.5} cy={isSitting ? 92 : 96} rx={5} ry={3.5} fill={lightFur} />
          </motion.g>
        </>
      )}

      {/* Sleeping body - curled */}
      {isSleeping && (
        <>
          <ellipse cx={80} cy={78} rx={45} ry={20} fill={bodyColor} />
          <ellipse cx={80} cy={82} rx={35} ry={12} fill={bellyColor} opacity={0.4} />
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

      {/* Chest tuft */}
      <ellipse cx={34} cy={isSitting ? 60 : 56} rx={6} ry={8} fill={lightFur} opacity={0.6} />

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
        {/* Top of head - darker */}
        <ellipse
          cx={26}
          cy={isSitting ? 34 : 30}
          rx={14}
          ry={8}
          fill={darkFur}
          opacity={0.4}
        />

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

        {/* Snout */}
        <ellipse
          cx={8}
          cy={isSitting ? 44 : 40}
          rx={14}
          ry={10}
          fill={lightFur}
        />
        {/* Snout bridge */}
        <ellipse
          cx={12}
          cy={isSitting ? 40 : 36}
          rx={10}
          ry={6}
          fill={bodyColor}
        />

        {/* Nose */}
        <ellipse cx={-3} cy={isSitting ? 40 : 36} rx={5} ry={4} fill={noseColor} />
        <ellipse cx={-4} cy={isSitting ? 38 : 34} rx={2} ry={1.2} fill="#444" />

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
            {/* Eyebrow */}
            <path
              d={`M16,${isSitting ? 30 : 26} Q22,${isSitting ? 27 : 23} 28,${isSitting ? 29 : 25}`}
              fill="none"
              stroke={darkFur}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Mouth */}
        <path
          d={`M2,${isSitting ? 46 : 42} Q8,${isSitting ? 49 : 45} 14,${isSitting ? 46 : 42}`}
          fill="none"
          stroke={darkFur}
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
            opacity={0.35}
          />
        )}

        {/* Whisker dots */}
        <circle cx={2} cy={isSitting ? 44 : 40} r={0.8} fill={darkFur} />
        <circle cx={0} cy={isSitting ? 46 : 42} r={0.8} fill={darkFur} />
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
