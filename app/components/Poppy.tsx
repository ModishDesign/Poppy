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
  const isJumping = pose === 'jump';

  // Colours — black and tan dachshund
  const black = '#1a1a1a';
  const tan = '#C27A3A';
  const tanDark = '#9B5B28';
  const tanLight = '#D4944A';
  const nose = '#2a2a2a';
  const collar = '#E87FAF';

  // Animation config
  const walkDur = 0.5;
  const ease = 'easeInOut';

  // Vertical offsets for poses
  const bodyY = isSitting ? 52 : isJumping ? 44 : 48;
  const groundY = 82;

  return (
    <svg
      width={size}
      height={size * 0.55}
      viewBox="0 0 180 100"
      className={className}
      style={{ overflow: 'visible', transform: flipX ? undefined : 'scaleX(-1)' }}
    >
      {/* Ground shadow */}
      <motion.ellipse
        cx={90} cy={groundY + 10} rx={52} ry={5}
        fill="rgba(0,0,0,0.12)"
        animate={isWalking ? { rx: [52, 48, 52] } : isJumping ? { ry: [5, 3, 5] } : {}}
        transition={{ duration: walkDur, repeat: Infinity, ease }}
      />

      {/* === TAIL === */}
      {/* Tail base - stays fixed */}
      <path
        d={isSitting
          ? `M140,${bodyY - 2} Q150,${bodyY - 14} 152,${bodyY - 22}`
          : `M142,${bodyY - 4} Q152,${bodyY - 16} 154,${bodyY - 24}`
        }
        stroke={black}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      {/* Tail tip - wags */}
      <motion.path
        d={isSitting
          ? `M152,${bodyY - 22} Q154,${bodyY - 28} 150,${bodyY - 32}`
          : `M154,${bodyY - 24} Q156,${bodyY - 30} 152,${bodyY - 34}`
        }
        stroke={black}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
        animate={isWagging
          ? { rotate: [0, 30, -30, 20, -20, 0] }
          : {}
        }
        transition={isWagging
          ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }
          : {}
        }
        style={{
          transformOrigin: isSitting
            ? `152px ${bodyY - 22}px`
            : `154px ${bodyY - 24}px`
        }}
      />

      {/* === BACK LEGS === */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [-18, 18, -18] } : isJumping ? { rotate: [12, 18, 12] } : { rotate: 0 }}
            transition={isWalking ? { duration: walkDur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: `120px ${bodyY + 10}px` }}
          >
            <rect x={116} y={bodyY + 10} width={9} height={isSitting ? 14 : 22} rx={4.5} fill={black} />
            <ellipse cx={120} cy={groundY} rx={6} ry={4} fill={tanDark} />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [18, -18, 18] } : isJumping ? { rotate: [18, 12, 18] } : { rotate: 0 }}
            transition={isWalking ? { duration: walkDur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: `130px ${bodyY + 10}px` }}
          >
            <rect x={126} y={bodyY + 10} width={9} height={isSitting ? 14 : 22} rx={4.5} fill={black} />
            <ellipse cx={130} cy={groundY} rx={6} ry={4} fill={tanDark} />
          </motion.g>
        </>
      )}

      {/* === BODY — smooth sausage shape === */}
      <motion.ellipse
        cx={90} cy={bodyY}
        rx={52} ry={16}
        fill={black}
        animate={isWalking
          ? { cy: [bodyY, bodyY - 2, bodyY] }
          : isJumping
          ? { cy: [bodyY, bodyY - 4, bodyY] }
          : {}
        }
        transition={{ duration: walkDur / 2, repeat: Infinity, ease }}
      />
      {/* Belly tan underside */}
      <ellipse
        cx={88} cy={bodyY + 8}
        rx={40} ry={6}
        fill={tan}
        opacity={0.6}
      />
      {/* Glossy highlight on back */}
      <ellipse
        cx={92} cy={bodyY - 8}
        rx={28} ry={4}
        fill="#333"
        opacity={0.3}
      />

      {/* === FRONT LEGS === */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [18, -18, 18] } : isJumping ? { rotate: [-15, -20, -15] } : { rotate: 0 }}
            transition={isWalking ? { duration: walkDur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: `55px ${bodyY + 8}px` }}
          >
            <rect x={51} y={bodyY + 8} width={9} height={22} rx={4.5} fill={black} />
            <ellipse cx={55} cy={groundY} rx={6} ry={4} fill={tanDark} />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [-18, 18, -18] } : isJumping ? { rotate: [-20, -15, -20] } : { rotate: 0 }}
            transition={isWalking ? { duration: walkDur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: `65px ${bodyY + 8}px` }}
          >
            <rect x={61} y={bodyY + 8} width={9} height={22} rx={4.5} fill={black} />
            <ellipse cx={65} cy={groundY} rx={6} ry={4} fill={tanDark} />
          </motion.g>
        </>
      )}

      {/* === COLLAR === */}
      <ellipse cx={48} cy={bodyY - 2} rx={8} ry={12} fill={collar} opacity={0.9} />
      <circle cx={48} cy={bodyY + 8} r={3} fill="#FFD700" />

      {/* === CHEST tan patch === */}
      <ellipse cx={48} cy={bodyY + 4} rx={10} ry={8} fill={tan} opacity={0.7} />

      {/* === HEAD === */}
      <motion.g
        animate={
          isSniffing ? { rotate: [0, -4, 4, -2, 0], y: [0, 2, -1, 2, 0] }
          : isWalking ? { y: [0, -1.5, 0] }
          : isJumping ? { y: [-2, -4, -2] }
          : {}
        }
        transition={
          isSniffing ? { duration: 1, repeat: Infinity }
          : isWalking ? { duration: walkDur / 2, repeat: Infinity, ease }
          : isJumping ? { duration: 0.4, repeat: Infinity, ease }
          : {}
        }
      >
        {/* Head shape — round */}
        <ellipse cx={30} cy={bodyY - 10} rx={20} ry={18} fill={black} />

        {/* Floppy ear */}
        <motion.ellipse
          cx={42} cy={bodyY - 2}
          rx={8} ry={16}
          fill="#111"
          transform={`rotate(15, 42, ${bodyY - 2})`}
          animate={isWalking ? { rotate: [15, 20, 15] } : {}}
          transition={isWalking ? { duration: walkDur / 2, repeat: Infinity, ease } : {}}
        />

        {/* Snout — long and pointy like a dachshund */}
        <path
          d={`M18,${bodyY - 8} Q4,${bodyY - 12} -6,${bodyY - 10} Q-12,${bodyY - 9} -12,${bodyY - 6} Q-12,${bodyY - 3} -6,${bodyY - 2} Q4,${bodyY} 18,${bodyY - 4} Z`}
          fill={tan}
        />
        {/* Snout top darker shading */}
        <path
          d={`M18,${bodyY - 8} Q6,${bodyY - 12} -4,${bodyY - 10} Q-8,${bodyY - 9} -8,${bodyY - 7} Q0,${bodyY - 10} 18,${bodyY - 8} Z`}
          fill={tanDark}
          opacity={0.4}
        />

        {/* Nose — black oval at tip */}
        <ellipse cx={-10} cy={bodyY - 6} rx={5} ry={4} fill={nose} />
        <ellipse cx={-10} cy={bodyY - 8} rx={2.5} ry={1.5} fill="#444" opacity={0.4} />

        {/* Eye */}
        {isSleeping ? (
          <path
            d={`M20,${bodyY - 14} Q26,${bodyY - 17} 32,${bodyY - 14}`}
            fill="none"
            stroke="#333"
            strokeWidth={2}
            strokeLinecap="round"
          />
        ) : (
          <>
            {/* Eye white */}
            <circle cx={24} cy={bodyY - 14} r={7} fill="white" />
            {/* Iris */}
            <motion.circle
              cx={22} cy={bodyY - 14} r={5}
              fill="#3D2200"
              animate={isSniffing ? { cx: [22, 20, 24, 22] } : {}}
              transition={isSniffing ? { duration: 1.5, repeat: Infinity } : {}}
            />
            {/* Pupil */}
            <circle cx={21} cy={bodyY - 15} r={3} fill="#1a1000" />
            {/* Eye shine */}
            <circle cx={19.5} cy={bodyY - 16.5} r={2} fill="white" />
            {/* Blink */}
            <motion.ellipse
              cx={24} cy={bodyY - 14} rx={7} ry={7}
              fill={black}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `24px ${bodyY - 14}px` }}
            />
          </>
        )}

        {/* Tan eyebrow marking */}
        <path
          d={`M16,${bodyY - 22} Q24,${bodyY - 25} 32,${bodyY - 22}`}
          fill="none"
          stroke={tan}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Tan cheek spot */}
        <ellipse cx={16} cy={bodyY - 4} rx={5} ry={4} fill={tanLight} opacity={0.5} />

        {/* Mouth line */}
        <path
          d={`M-6,${bodyY - 2} Q2,${bodyY + 1} 10,${bodyY - 1}`}
          fill="none"
          stroke={tanDark}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.6}
        />
      </motion.g>

      {/* === SLEEP Z's === */}
      {isSleeping && (
        <>
          <motion.text x={10} y={20} fill="#7C6DA6" fontSize={12} fontWeight="bold" opacity={0.6}
            animate={{ y: [20, 6], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >z</motion.text>
          <motion.text x={18} y={12} fill="#7C6DA6" fontSize={16} fontWeight="bold" opacity={0.4}
            animate={{ y: [12, -4], opacity: [0.4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
          >Z</motion.text>
        </>
      )}
    </svg>
  );
}
