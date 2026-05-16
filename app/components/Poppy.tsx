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

  // Colours matched to real Poppy
  const bodyColor = '#0a0a0a';        // glossy black
  const darkFur = '#050505';          // deep black
  const tanFur = '#B5651D';           // warm rust/tan — like real Poppy
  const tanLight = '#C97B2A';         // lighter rust highlight
  const tanDark = '#8B4513';          // darker rust shadow
  const noseColor = '#1a1a1a';        // black nose
  const eyeColor = '#3D2200';         // warm brown eyes
  const tongueColor = '#E8556D';
  const collarColor = '#D4A0B9';      // pink/mauve collar like real Poppy
  const collarBuckle = '#D4956B';     // rose gold buckle

  // Leg dimensions — short stubby dachshund legs
  const legH = isSitting ? 12 : 16;
  const backLegY = isSitting ? 72 : 70;
  const frontLegY = 68;
  const backPawY = isSitting ? 84 : 87;
  const frontPawY = isSitting ? 81 : 85;

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

      {/* Tail — black with rust underside */}
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
      {/* Rust underside of tail */}
      <motion.path
        d={isSitting
          ? 'M129,68 Q139,57 143,50'
          : 'M129,54 Q140,42 145,34'
        }
        stroke={tanFur}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
        opacity={0.6}
        animate={isWagging ? { rotate: [0, 15, -15, 15, 0] } : {}}
        transition={isWagging ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' } : {}}
        style={{ transformOrigin: isSitting ? '128px 66px' : '128px 52px' }}
      />

      {/* Back legs — short, black upper, rust lower */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [0, -15, 15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity } : {}}
            style={{ transformOrigin: `108px ${backLegY}px` }}
          >
            {/* Upper leg - black */}
            <rect x={104} y={backLegY} width={8} height={legH * 0.5} rx={4} fill={bodyColor} />
            {/* Lower leg - rust tan */}
            {!isSitting && <rect x={104} y={backLegY + legH * 0.4} width={8} height={legH * 0.6} rx={4} fill={tanFur} />}
            {/* Paw - rust */}
            {!isSitting && <ellipse cx={108} cy={backPawY} rx={5.5} ry={3.5} fill={tanFur} />}
            {/* Tiny claws */}
            {!isSitting && <>
              <line x1={105} y1={backPawY + 2} x2={104} y2={backPawY + 4} stroke="#333" strokeWidth={0.8} />
              <line x1={108} y1={backPawY + 3} x2={108} y2={backPawY + 5} stroke="#333" strokeWidth={0.8} />
              <line x1={111} y1={backPawY + 2} x2={112} y2={backPawY + 4} stroke="#333" strokeWidth={0.8} />
            </>}
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [0, 15, -15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity, delay: 0.08 } : {}}
            style={{ transformOrigin: `116px ${backLegY}px` }}
          >
            <rect x={113} y={backLegY} width={8} height={legH * 0.5} rx={4} fill={bodyColor} />
            {!isSitting && <rect x={113} y={backLegY + legH * 0.4} width={8} height={legH * 0.6} rx={4} fill={tanFur} />}
            {!isSitting && <ellipse cx={117} cy={backPawY} rx={5.5} ry={3.5} fill={tanFur} />}
            {!isSitting && <>
              <line x1={114} y1={backPawY + 2} x2={113} y2={backPawY + 4} stroke="#333" strokeWidth={0.8} />
              <line x1={117} y1={backPawY + 3} x2={117} y2={backPawY + 5} stroke="#333" strokeWidth={0.8} />
              <line x1={120} y1={backPawY + 2} x2={121} y2={backPawY + 4} stroke="#333" strokeWidth={0.8} />
            </>}
          </motion.g>
          {isSitting && (
            <ellipse cx={112} cy={82} rx={12} ry={5} fill={bodyColor} />
          )}
        </>
      )}

      {/* Body - long glossy black sausage shape */}
      <ellipse
        cx={80}
        cy={isSitting ? 60 : 56}
        rx={48}
        ry={isSitting ? 16 : 14}
        fill={bodyColor}
      />
      {/* Glossy sheen on back */}
      <ellipse
        cx={82}
        cy={isSitting ? 52 : 48}
        rx={30}
        ry={5}
        fill="#1a1a1a"
        opacity={0.6}
      />
      {/* Belly - tan/rust underside */}
      <ellipse
        cx={78}
        cy={isSitting ? 66 : 62}
        rx={36}
        ry={isSitting ? 7 : 5}
        fill={tanFur}
        opacity={0.5}
      />

      {/* Front legs — short, black upper, rust lower */}
      {!isSleeping && (
        <>
          <motion.g
            animate={isWalking ? { rotate: [0, 15, -15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity } : {}}
            style={{ transformOrigin: `44px ${frontLegY}px` }}
          >
            {/* Upper leg - black */}
            <rect x={40} y={frontLegY} width={8} height={legH * 0.5} rx={4} fill={bodyColor} />
            {/* Lower leg - rust tan */}
            <rect x={40} y={frontLegY + legH * 0.35} width={8} height={legH * 0.65} rx={4} fill={tanFur} />
            {/* Paw */}
            <ellipse cx={44} cy={frontPawY} rx={5.5} ry={3.5} fill={tanFur} />
            {/* Claws */}
            <line x1={41} y1={frontPawY + 2} x2={40} y2={frontPawY + 4} stroke="#333" strokeWidth={0.8} />
            <line x1={44} y1={frontPawY + 3} x2={44} y2={frontPawY + 5} stroke="#333" strokeWidth={0.8} />
            <line x1={47} y1={frontPawY + 2} x2={48} y2={frontPawY + 4} stroke="#333" strokeWidth={0.8} />
          </motion.g>
          <motion.g
            animate={isWalking ? { rotate: [0, -15, 15, 0] } : {}}
            transition={isWalking ? { duration: 0.35, repeat: Infinity, delay: 0.08 } : {}}
            style={{ transformOrigin: `52px ${frontLegY}px` }}
          >
            <rect x={49} y={frontLegY} width={8} height={legH * 0.5} rx={4} fill={bodyColor} />
            <rect x={49} y={frontLegY + legH * 0.35} width={8} height={legH * 0.65} rx={4} fill={tanFur} />
            <ellipse cx={53} cy={frontPawY} rx={5.5} ry={3.5} fill={tanFur} />
            <line x1={50} y1={frontPawY + 2} x2={49} y2={frontPawY + 4} stroke="#333" strokeWidth={0.8} />
            <line x1={53} y1={frontPawY + 3} x2={53} y2={frontPawY + 5} stroke="#333" strokeWidth={0.8} />
            <line x1={56} y1={frontPawY + 2} x2={57} y2={frontPawY + 4} stroke="#333" strokeWidth={0.8} />
          </motion.g>
        </>
      )}

      {/* Sleeping body - curled */}
      {isSleeping && (
        <>
          <ellipse cx={80} cy={74} rx={45} ry={18} fill={bodyColor} />
          <ellipse cx={80} cy={78} rx={35} ry={10} fill={tanFur} opacity={0.3} />
        </>
      )}

      {/* Harness — black with grey reflective strip like real Poppy */}
      <path
        d={`M36,${isSitting ? 50 : 46} Q60,${isSitting ? 42 : 38} 84,${isSitting ? 50 : 46}`}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth={3}
      />
      <path
        d={`M36,${isSitting ? 50 : 46} Q60,${isSitting ? 42 : 38} 84,${isSitting ? 50 : 46}`}
        fill="none"
        stroke="#888"
        strokeWidth={1}
        opacity={0.5}
      />
      {/* Chest strap */}
      <rect
        x={34}
        y={isSitting ? 50 : 46}
        width={4}
        height={isSitting ? 14 : 16}
        rx={2}
        fill="#1a1a1a"
      />

      {/* Collar — pink/mauve like real Poppy */}
      <rect
        x={28}
        y={isSitting ? 48 : 44}
        width={16}
        height={5}
        rx={2.5}
        fill={collarColor}
      />
      {/* Rose gold buckle */}
      <rect x={36} y={isSitting ? 47 : 43} width={6} height={7} rx={1.5} fill={collarBuckle} />
      <rect x={37.5} y={isSitting ? 48 : 44} width={3} height={5} rx={1} fill={collarColor} />

      {/* Chest - rust/tan marking */}
      <ellipse cx={36} cy={isSitting ? 60 : 58} rx={7} ry={9} fill={tanFur} opacity={0.8} />
      <ellipse cx={36} cy={isSitting ? 58 : 56} rx={5} ry={6} fill={tanLight} opacity={0.4} />

      {/* Head */}
      <motion.g
        animate={isSniffing ? { rotate: [0, -5, 5, -3, 0], y: [0, 2, 0, 2, 0] } : {}}
        transition={isSniffing ? { duration: 1.2, repeat: Infinity } : {}}
      >
        {/* Skull - glossy black */}
        <ellipse
          cx={24}
          cy={isSitting ? 42 : 38}
          rx={18}
          ry={16}
          fill={bodyColor}
        />
        {/* Glossy sheen on head */}
        <ellipse
          cx={22}
          cy={isSitting ? 35 : 31}
          rx={10}
          ry={5}
          fill="#1a1a1a"
          opacity={0.5}
        />

        {/* Tan eyebrow dots — prominent like real Poppy */}
        <ellipse cx={17} cy={isSitting ? 30 : 26} rx={4} ry={3} fill={tanFur} opacity={0.95} />
        <ellipse cx={29} cy={isSitting ? 31 : 27} rx={3} ry={2.5} fill={tanFur} opacity={0.7} />

        {/* Tan cheek patches — visible on real Poppy */}
        <ellipse cx={14} cy={isSitting ? 42 : 38} rx={6} ry={5} fill={tanFur} opacity={0.6} />

        {/* Big floppy ear — large, black, hangs low */}
        <motion.path
          d={isSitting
            ? 'M30,28 Q42,26 44,38 Q46,52 38,58 Q34,60 30,54 Q28,46 30,28'
            : 'M30,24 Q42,22 44,34 Q46,48 38,54 Q34,56 30,50 Q28,42 30,24'
          }
          fill={darkFur}
          animate={isWagging ? { rotate: [0, 3, -3, 0] } : {}}
          transition={isWagging ? { duration: 0.5, repeat: Infinity } : {}}
          style={{ transformOrigin: `34px ${isSitting ? 28 : 24}px` }}
        />
        {/* Ear sheen */}
        <ellipse
          cx={36}
          cy={isSitting ? 40 : 36}
          rx={4}
          ry={8}
          fill="#151515"
          opacity={0.4}
          transform={`rotate(15, 36, ${isSitting ? 40 : 36})`}
        />

        {/* Snout — tan/rust muzzle like real Poppy */}
        <ellipse
          cx={8}
          cy={isSitting ? 44 : 40}
          rx={14}
          ry={10}
          fill={tanFur}
        />
        {/* Darker rust on top of muzzle */}
        <ellipse
          cx={10}
          cy={isSitting ? 40 : 36}
          rx={10}
          ry={5}
          fill={tanDark}
          opacity={0.4}
        />
        {/* Snout bridge — black blending down to tan */}
        <ellipse
          cx={16}
          cy={isSitting ? 37 : 33}
          rx={7}
          ry={4}
          fill={bodyColor}
          opacity={0.45}
        />

        {/* Nose — big black nose */}
        <ellipse cx={-3} cy={isSitting ? 40 : 36} rx={5.5} ry={4.5} fill={noseColor} />
        {/* Nose highlight */}
        <ellipse cx={-3} cy={isSitting ? 38.5 : 34.5} rx={2.5} ry={1.5} fill="#333" opacity={0.5} />

        {/* Eye — warm brown like real Poppy */}
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
            <circle cx={20.5} cy={isSitting ? 35.5 : 31.5} r={4} fill={eyeColor} />
            {/* Warm brown iris detail */}
            <circle cx={20.5} cy={isSitting ? 35.5 : 31.5} r={2.5} fill="#5C3A0E" />
            <circle cx={19} cy={isSitting ? 34 : 30} r={1.5} fill="white" />
            {/* Eyebrow — tan arch */}
            <path
              d={`M15,${isSitting ? 29 : 25} Q21,${isSitting ? 26 : 22} 27,${isSitting ? 28 : 24}`}
              fill="none"
              stroke={tanFur}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </>
        )}

        {/* Mouth */}
        <path
          d={`M2,${isSitting ? 46 : 42} Q8,${isSitting ? 49 : 45} 14,${isSitting ? 46 : 42}`}
          fill="none"
          stroke={tanDark}
          strokeWidth={1.2}
          strokeLinecap="round"
        />

        {/* Tongue - visible when wagging or happy */}
        {isWagging && !isSleeping && (
          <motion.ellipse
            cx={8}
            cy={isSitting ? 50 : 46}
            rx={3.5}
            ry={5.5}
            fill={tongueColor}
            animate={{ scaleY: [1, 1.15, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}

        {/* Cheek warmth */}
        {!isSleeping && (
          <ellipse
            cx={14}
            cy={isSitting ? 46 : 42}
            rx={4}
            ry={2.5}
            fill={tanLight}
            opacity={0.25}
          />
        )}

        {/* Whisker dots */}
        <circle cx={2} cy={isSitting ? 44 : 40} r={0.8} fill={tanDark} />
        <circle cx={0} cy={isSitting ? 46 : 42} r={0.8} fill={tanDark} />
        <circle cx={-1} cy={isSitting ? 42 : 38} r={0.6} fill={tanDark} />
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
