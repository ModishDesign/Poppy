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

  // Colours — matching the reference: dark charcoal grey + orange-tan
  const body = '#3D3D3D';       // dark charcoal grey (not pure black)
  const bodyDark = '#2E2E2E';   // slightly darker for ears/shading
  const tan = '#E8943A';        // bright orange-tan for markings
  const tanDark = '#D07E2A';    // darker tan for paw bottoms
  const noseTip = '#1a1a1a';    // black nose

  // Animation
  const dur = 0.5;
  const ease = 'easeInOut';

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 200 110"
      className={className}
      style={{ overflow: 'visible', transform: flipX ? undefined : 'scaleX(-1)' }}
    >
      {/* Shadow */}
      <motion.ellipse
        cx={100} cy={96} rx={55} ry={5}
        fill="rgba(0,0,0,0.1)"
        animate={isWalking ? { rx: [55, 50, 55] } : isJumping ? { ry: [5, 3, 5] } : {}}
        transition={{ duration: dur, repeat: Infinity, ease }}
      />

      {/* ──── TAIL ──── */}
      {/* Thin curved tail, base fixed */}
      <path
        d={isSitting
          ? 'M152,52 Q162,38 160,26'
          : isJumping
          ? 'M154,36 Q166,20 162,8'
          : 'M154,42 Q166,26 162,14'
        }
        stroke={body}
        strokeWidth={4}
        strokeLinecap="round"
        fill="none"
      />
      {/* Tail tip wags */}
      <motion.path
        d={isSitting
          ? 'M160,26 Q158,20 160,14'
          : isJumping
          ? 'M162,8 Q160,2 162,-4'
          : 'M162,14 Q160,8 162,2'
        }
        stroke={body}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        animate={isWagging ? { rotate: [0, 25, -25, 15, -15, 0] } : {}}
        transition={isWagging ? { duration: 0.35, repeat: Infinity, ease } : {}}
        style={{
          transformOrigin: isSitting ? '160px 26px'
            : isJumping ? '162px 8px'
            : '162px 14px'
        }}
      />

      {/* ──── BACK LEGS ──── */}
      {!isSleeping && (
        <>
          {/* Back-left (diagonal pair with front-right) */}
          <motion.g
            animate={isWalking ? { rotate: [-20, 20, -20] } : isJumping ? { rotate: [15, 22, 15] } : { rotate: 0 }}
            transition={isWalking ? { duration: dur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: '125px 58px' }}
          >
            <rect x={121} y={58} width={10} height={isSitting ? 16 : 26} rx={5} fill={body} />
            <rect x={121} y={isSitting ? 68 : 76} width={10} height={10} rx={5} fill={tan} />
          </motion.g>
          {/* Back-right (diagonal pair with front-left) */}
          <motion.g
            animate={isWalking ? { rotate: [20, -20, 20] } : isJumping ? { rotate: [22, 15, 22] } : { rotate: 0 }}
            transition={isWalking ? { duration: dur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: '135px 58px' }}
          >
            <rect x={131} y={58} width={10} height={isSitting ? 16 : 26} rx={5} fill={body} />
            <rect x={131} y={isSitting ? 68 : 76} width={10} height={10} rx={5} fill={tan} />
          </motion.g>
        </>
      )}

      {/* ──── BODY ──── */}
      {/* Main sausage body */}
      <motion.path
        d={isSitting
          ? 'M40,38 Q20,38 18,50 Q16,62 40,65 L145,65 Q160,65 158,50 Q156,38 140,38 Z'
          : 'M38,34 Q16,34 14,46 Q12,58 38,60 L148,60 Q164,60 162,46 Q160,34 142,34 Z'
        }
        fill={body}
        animate={isWalking
          ? { d: [
              'M38,34 Q16,34 14,46 Q12,58 38,60 L148,60 Q164,60 162,46 Q160,34 142,34 Z',
              'M38,32 Q16,32 14,44 Q12,56 38,58 L148,58 Q164,58 162,44 Q160,32 142,32 Z',
              'M38,34 Q16,34 14,46 Q12,58 38,60 L148,60 Q164,60 162,46 Q160,34 142,34 Z',
            ]}
          : isJumping
          ? { d: [
              'M38,30 Q16,30 14,42 Q12,54 38,56 L148,56 Q164,56 162,42 Q160,30 142,30 Z',
              'M38,28 Q16,28 14,40 Q12,52 38,54 L148,54 Q164,54 162,40 Q160,28 142,28 Z',
              'M38,30 Q16,30 14,42 Q12,54 38,56 L148,56 Q164,56 162,42 Q160,30 142,30 Z',
            ]}
          : {}
        }
        transition={{ duration: dur / 2, repeat: Infinity, ease }}
      />

      {/* Chest tan patch */}
      <ellipse
        cx={46} cy={isSitting ? 56 : 52}
        rx={12} ry={10}
        fill={tan}
      />

      {/* ──── FRONT LEGS ──── */}
      {!isSleeping && (
        <>
          {/* Front-left (diagonal pair with back-right) */}
          <motion.g
            animate={isWalking ? { rotate: [20, -20, 20] } : isJumping ? { rotate: [-18, -24, -18] } : { rotate: 0 }}
            transition={isWalking ? { duration: dur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: '52px 56px' }}
          >
            <rect x={48} y={56} width={10} height={26} rx={5} fill={body} />
            <rect x={48} y={74} width={10} height={10} rx={5} fill={tan} />
          </motion.g>
          {/* Front-right (diagonal pair with back-left) */}
          <motion.g
            animate={isWalking ? { rotate: [-20, 20, -20] } : isJumping ? { rotate: [-24, -18, -24] } : { rotate: 0 }}
            transition={isWalking ? { duration: dur, repeat: Infinity, ease } : { duration: 0.3 }}
            style={{ transformOrigin: '62px 56px' }}
          >
            <rect x={58} y={56} width={10} height={26} rx={5} fill={body} />
            <rect x={58} y={74} width={10} height={10} rx={5} fill={tan} />
          </motion.g>
        </>
      )}

      {/* ──── HEAD ──── */}
      <motion.g
        animate={
          isSniffing ? { rotate: [0, -5, 5, -3, 0], y: [0, 2, -1, 2, 0] }
          : isWalking ? { y: [0, -2, 0] }
          : isJumping ? { y: [-2, -5, -2] }
          : {}
        }
        transition={
          isSniffing ? { duration: 1, repeat: Infinity }
          : isWalking ? { duration: dur / 2, repeat: Infinity, ease }
          : isJumping ? { duration: 0.4, repeat: Infinity, ease }
          : {}
        }
      >
        {/* Neck/head connection — fills the gap */}
        <ellipse cx={38} cy={isSitting ? 40 : 36} rx={14} ry={14} fill={body} />

        {/* Head — rounded dome shape */}
        <ellipse cx={28} cy={isSitting ? 30 : 26} rx={20} ry={18} fill={body} />

        {/* Floppy ear — long, droopy, rounded */}
        <motion.path
          d={isSitting
            ? 'M38,22 Q50,18 52,30 Q54,48 46,56 Q42,58 38,52 Q34,42 38,22'
            : 'M38,18 Q50,14 52,26 Q54,44 46,52 Q42,54 38,48 Q34,38 38,18'
          }
          fill={bodyDark}
          animate={isWalking ? { rotate: [0, 5, -3, 5, 0] } : {}}
          transition={isWalking ? { duration: dur / 2, repeat: Infinity, ease } : {}}
          style={{ transformOrigin: isSitting ? '42px 22px' : '42px 18px' }}
        />

        {/* Tan muzzle — the whole snout area is tan like the reference */}
        <path
          d={isSitting
            ? 'M22,30 Q10,26 -2,28 Q-10,30 -10,34 Q-10,38 -2,40 Q10,42 22,38 Z'
            : 'M22,26 Q10,22 -2,24 Q-10,26 -10,30 Q-10,34 -2,36 Q10,38 22,34 Z'
          }
          fill={tan}
        />

        {/* Nose — small black oval at the tip */}
        <ellipse
          cx={-7} cy={isSitting ? 33 : 29}
          rx={4.5} ry={3.5}
          fill={noseTip}
        />
        {/* Nose highlight */}
        <ellipse
          cx={-7} cy={isSitting ? 31.5 : 27.5}
          rx={2} ry={1}
          fill="#444"
          opacity={0.35}
        />

        {/* Eye — simple dot style like the reference */}
        {isSleeping ? (
          <path
            d="M20,22 Q25,19 30,22"
            fill="none"
            stroke={bodyDark}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ) : (
          <>
            {/* Eye - small dark dot with tiny shine */}
            <motion.circle
              cx={22} cy={isSitting ? 24 : 20}
              r={4}
              fill={noseTip}
              animate={isSniffing ? { cx: [22, 20, 24, 22] } : {}}
              transition={isSniffing ? { duration: 1.5, repeat: Infinity } : {}}
            />
            {/* Eye shine */}
            <circle cx={20.5} cy={isSitting ? 22.5 : 18.5} r={1.5} fill="white" />
            {/* Blink */}
            <motion.ellipse
              cx={22} cy={isSitting ? 24 : 20} rx={5} ry={5}
              fill={body}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: `22px ${isSitting ? 24 : 20}px` }}
            />
          </>
        )}

        {/* Tan eyebrow dot — like the reference */}
        <circle
          cx={20} cy={isSitting ? 18 : 14}
          r={3}
          fill={tan}
        />

        {/* Mouth — subtle smile line */}
        <path
          d={isSitting
            ? 'M-4,38 Q4,41 12,38'
            : 'M-4,34 Q4,37 12,34'
          }
          fill="none"
          stroke={tanDark}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.5}
        />
      </motion.g>

      {/* ──── SLEEPING BODY (curled) ──── */}
      {isSleeping && (
        <>
          <ellipse cx={90} cy={70} rx={50} ry={20} fill={body} />
          <ellipse cx={90} cy={76} rx={35} ry={8} fill={tan} opacity={0.4} />
        </>
      )}

      {/* ──── SLEEP Z's ──── */}
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
