import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../lib/tokens';
import { fontFamilyMono, fontFamilyInter } from '../lib/fonts';
import { ClaudeIcon } from './ClaudeIcon';

export type PromptBoxProps = {
  x: number;
  y: number;
  w?: number;
  text?: string;
  typedChars?: number;
  glow?: number; // 0 to 1
  opacity?: number;
  placeholder?: string;
  modelName?: string;
  showActions?: boolean;
  style?: React.CSSProperties;
};

/**
 * PromptBox primitive per AGENTS.md Section 7 & rich website UI specs:
 * Rounded rect 72 px tall, mono 28 px text, caret 2x34 px blinking at 2 Hz.
 * Enriched with attach files button, model selector pill, send button, and responsive layout.
 */
export const PromptBox: React.FC<PromptBoxProps> = ({
  x,
  y,
  w = 800,
  text = '',
  typedChars = text.length,
  glow = 0,
  opacity = 1,
  placeholder = 'Reply to Claude...',
  modelName = 'Claude 5.5 Opus',
  showActions = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Exactly 2 Hz blink rate (0.5s cycle: 0.25s on, 0.25s off)
  const caretVisible = Math.floor((frame / fps) * 2) % 2 === 0;
  const displayedText = text.slice(0, Math.max(0, typedChars));
  const hasText = displayedText.length > 0;

  const clampedGlow = Math.max(0, Math.min(1, glow));
  const glowHex = Math.round(clampedGlow * 180)
    .toString(16)
    .padStart(2, '0');

  const isCompact = w < 500;

  return (
    <div
      style={{
        position: 'absolute',
        left: Math.round(x),
        top: Math.round(y),
        width: Math.round(w),
        height: 72,
        borderRadius: 18,
        backgroundColor: COLORS.surface,
        border: `2px solid ${clampedGlow > 0 ? COLORS.orange : `${COLORS.unlit}99`}`,
        boxShadow:
          clampedGlow > 0
            ? `0 0 ${Math.round(28 * clampedGlow)}px ${COLORS.orange}${glowHex}, inset 0 0 14px ${COLORS.orange}${Math.round(clampedGlow * 40).toString(16).padStart(2, '0')}`
            : '0 8px 24px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: isCompact ? 12 : 16,
        paddingRight: isCompact ? 12 : 16,
        gap: isCompact ? 8 : 12,
        boxSizing: 'border-box',
        opacity,
        ...style,
      }}
    >
      {/* Left Action: Attach Files Button */}
      {showActions && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${COLORS.unlit}33`,
            border: `1px solid ${COLORS.unlit}66`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Attach files or context"
        >
          {/* Paperclip / Plus SVG Icon */}
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </div>
      )}

      {/* Model Selector Pill */}
      {showActions && (
        <div
          style={{
            height: 32,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 16,
            backgroundColor: `${COLORS.navy}aa`,
            border: `1px solid ${COLORS.unlit}88`,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
        >
          {/* Claude Starburst Icon */}
          <ClaudeIcon size={15} color={COLORS.orange} />
          <span
            style={{
              fontFamily: fontFamilyInter,
              fontSize: isCompact ? 12 : 13,
              fontWeight: 500,
              color: COLORS.text,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            {isCompact ? '5.5 Opus' : modelName}
          </span>
          {/* Chevron Down */}
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      )}

      {/* Center Input / Text Display */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          minWidth: 0,
          paddingLeft: 4,
        }}
      >
        {hasText ? (
          <>
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: isCompact ? 22 : 26,
                color: COLORS.text,
                whiteSpace: 'pre',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {displayedText}
            </span>
            {caretVisible && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 34,
                  backgroundColor: clampedGlow > 0 ? COLORS.orange : COLORS.text,
                  marginLeft: 3,
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {caretVisible && (
              <span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 34,
                  backgroundColor: clampedGlow > 0 ? COLORS.orange : COLORS.text,
                  marginRight: 6,
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: isCompact ? 20 : 24,
                color: COLORS.text,
                opacity: 0.35,
                whiteSpace: 'nowrap',
                lineHeight: 1,
              }}
            >
              {placeholder}
            </span>
          </div>
        )}
      </div>

      {/* Right Action: Send Button */}
      {showActions && (
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor:
              hasText || clampedGlow > 0
                ? COLORS.orange
                : `${COLORS.unlit}44`,
            border: `1px solid ${hasText || clampedGlow > 0 ? COLORS.orange : `${COLORS.unlit}88`}`,
            boxShadow:
              hasText || clampedGlow > 0
                ? `0 0 16px ${COLORS.orange}88`
                : undefined,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          title="Send message"
        >
          {/* Arrow Up SVG */}
          <svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke={hasText || clampedGlow > 0 ? COLORS.navy : COLORS.text}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: hasText || clampedGlow > 0 ? 1 : 0.4 }}
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </div>
      )}
    </div>
  );
};

