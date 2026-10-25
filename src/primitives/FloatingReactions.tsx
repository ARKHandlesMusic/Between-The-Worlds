import React from 'react';
import { useClock } from '../lib/clock';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { useBands } from '../lib/audio';

export interface FloatingReactionsProps {
  count?: number;
  types?: ('party' | 'reaction' | 'billing' | 'words')[];
  opacity?: number;
  scale?: number;
  style?: React.CSSProperties;
}

const PARTY_EMOJIS = ['🎉', '🥳', '✨', '⚡', '🚀', '💫', '🎊'];
const SOCIAL_REACTIONS = ['👍', '❤️', '🔥', '💯', '👏', '⭐', '🧡'];

const BILLING_ITEMS = [
  '+$50.00 CREDITS',
  '[TOKENS: +128k]',
  '-$0.0032',
  'INVOICE #4096: PAID',
  'TIER 4: ACTIVE',
  'API CALL: 200 OK',
  'REFILL: +$100.00',
  'BILLING: VERIFIED',
  'CACHE HIT: 99.4%',
  '+$25.00 SPONSOR',
  'TOKENS: +4096',
  'PRO QUOTA: UNLIMITED',
];

const INTENT_WORDS = [
  'intent',
  'magic',
  'resonance',
  'dialectic',
  'synthesis',
  'between words',
  'alive',
  'human',
  'signal',
  'clarity',
  'infinite',
  'heartbeat',
];

const CONFETTI_COLORS = [
  COLORS.orange,
  COLORS.teal,
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#10b981',
  '#38bdf8',
  '#ffffff',
];

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({
  count = 28,
  types = ['party', 'reaction', 'billing', 'words'],
  opacity = 0.85,
  scale = 1.0,
  style,
}) => {
  const { sec } = useClock();
  const { bass } = useBands();

  const kickPulse = 1 + bass * 0.28;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 12,
        opacity,
        ...style,
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        // Deterministic positioning
        const typeIndex = i % types.length;
        const currentType = types[typeIndex];

        const speed = 75 + ((i * 37) % 95); // px/sec
        const xBase = ((i * 137.5 + 45) % 1840) + 40;
        const offset = (i * 241.9) % 1200;

        const totalSpan = 1200;
        const rawY = (sec * speed + offset) % totalSpan;
        const y = 1100 - rawY; // Floats from bottom to top

        const progress = rawY / totalSpan;
        const xSway = Math.sin(sec * 1.6 + i * 1.3) * 32;
        const x = xBase + xSway;

        // Smooth fade-in at bottom, fade-out near top
        const itemOpacity =
          Math.sin(progress * Math.PI) * (0.65 + ((i * 23) % 35) / 100);

        const rotation = ((sec * 60 + i * 45) % 360) * (i % 2 === 0 ? 1 : -1);

        if (itemOpacity <= 0.05) return null;

        // 1. Confetti Flakes (distributed throughout)
        if (i % 5 === 0) {
          const confettiColor = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
          const w = 7 + (i % 6);
          const h = 10 + (i % 8);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: w,
                height: h,
                backgroundColor: confettiColor,
                opacity: itemOpacity,
                transform: `rotate(${rotation}deg) scale(${scale * kickPulse})`,
                boxShadow: `0 0 8px ${confettiColor}66`,
                borderRadius: i % 3 === 0 ? '50%' : 2,
              }}
            />
          );
        }

        // 2. Party Emojis
        if (currentType === 'party') {
          const emoji = PARTY_EMOJIS[i % PARTY_EMOJIS.length];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontSize: 22,
                opacity: itemOpacity,
                transform: `rotate(${rotation * 0.3}deg) scale(${scale * kickPulse})`,
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
              }}
            >
              {emoji}
            </div>
          );
        }

        // 3. Social Reactions (thumbs up, hearts, fire, 100)
        if (currentType === 'reaction') {
          const emoji = SOCIAL_REACTIONS[i % SOCIAL_REACTIONS.length];
          const isHeart = emoji === '❤️';
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontSize: 24,
                opacity: itemOpacity,
                transform: `rotate(${Math.sin(sec * 2 + i) * 15}deg) scale(${
                  scale * kickPulse * (isHeart ? 1.15 : 1.0)
                })`,
                filter: isHeart
                  ? `drop-shadow(0 0 12px ${COLORS.orange})`
                  : 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))',
              }}
            >
              {emoji}
            </div>
          );
        }

        // 4. Financial / Billing / Credits / Tokens
        if (currentType === 'billing') {
          const billText = BILLING_ITEMS[i % BILLING_ITEMS.length];
          const isCredit = billText.includes('+');
          const isBill = billText.includes('INVOICE') || billText.includes('-');
          const badgeColor = isCredit ? COLORS.teal : isBill ? COLORS.orange : COLORS.text;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                fontFamily: fontFamilyMono,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: badgeColor,
                backgroundColor: `${COLORS.surface}f2`,
                border: `1px solid ${badgeColor}88`,
                padding: '2px 8px',
                borderRadius: 4,
                opacity: itemOpacity,
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 14px rgba(0,0,0,0.4), 0 0 10px ${badgeColor}33`,
                transform: `scale(${scale * kickPulse})`,
              }}
            >
              {isCredit ? '💵 ' : isBill ? '💳 ' : '⚡ '}
              {billText}
            </div>
          );
        }

        // 5. Rising Intent Words
        const word = INTENT_WORDS[i % INTENT_WORDS.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontFamily: fontFamilyInter,
              fontSize: 13,
              fontWeight: 600,
              fontStyle: 'italic',
              color: `${COLORS.text}dd`,
              textShadow: `0 0 10px ${COLORS.teal}66`,
              opacity: itemOpacity * 0.85,
              whiteSpace: 'nowrap',
              transform: `scale(${scale * kickPulse})`,
            }}
          >
            ~ {word} ~
          </div>
        );
      })}
    </div>
  );
};
