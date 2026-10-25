import React, { useId } from 'react';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';
import { ListenerDots } from './ListenerDots';

export type HallProps = {
  slideLift?: number; // px lift upwards (positive = lifted up)
  title?: string;
  dotLitAt?: (row: number, col: number) => number;
  dotJumpAt?: (row: number, col: number) => number;
  colorLit?: string;
  colorUnlit?: string;
  children?: React.ReactNode;
  opacity?: number;
  style?: React.CSSProperties;
};

const ROW_LABELS = ['ROW A', 'ROW B', 'ROW C', 'ROW D', 'ROW E', 'ROW F', 'ROW G', 'ROW H'];

/**
 * Hall primitive per AGENTS.md Section 7 and SCRIPT.md S09:
 * Slide rectangle with title bar plus the 8 x 24 ListenerDots grid.
 * Key props: slideLift, title.
 * Shadow on the wall shrinks and softens as the slide lifts.
 * Detailed with architectural acoustic panels, ceiling lighting truss, row risers, and keynote HUD.
 */
export const Hall: React.FC<HallProps> = ({
  slideLift = 0,
  title = '',
  dotLitAt,
  dotJumpAt,
  colorLit = COLORS.teal,
  colorUnlit = COLORS.unlit,
  children,
  opacity = 1,
  style,
}) => {
  const gradId = useId();
  const slideW = 1200;
  const slideH = 480;
  const slideX = 360;
  const slideBaseY = 90;
  const slideY = slideBaseY - slideLift;

  // Shadow shrinks and softens as slide lifts
  const shadowScale = Math.max(0.35, 1 - slideLift / 140);
  const shadowOpacity = Math.max(0.08, 0.45 - slideLift / 180);
  const shadowW = 900 * shadowScale;
  const shadowH = 44 * shadowScale;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        pointerEvents: 'none',
        opacity,
        ...style,
      }}
    >
      {/* Ceiling lighting truss & projector beams */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1920,
          height: 70,
          pointerEvents: 'none',
        }}
      >
        {/* Overhead steel truss bar */}
        <div
          style={{
            position: 'absolute',
            left: 160,
            top: 24,
            width: 1600,
            height: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: 2,
          }}
        />
        {/* Spotlights hanging from truss */}
        {[360, 660, 960, 1260, 1560].map((spotX, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: spotX - 8,
              top: 22,
              width: 16,
              height: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px 2px 4px 4px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {/* Downward light cone */}
            <div
              style={{
                position: 'absolute',
                left: -20,
                top: 10,
                width: 56,
                height: 120,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)',
                clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        ))}
      </div>

      {/* Left Wall Acoustic Baffle Panels */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          top: 100,
          width: 220,
          height: 880,
          pointerEvents: 'none',
          display: 'flex',
          gap: 12,
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 800 - i * 20,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: 4,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 4,
            bottom: 40,
            fontFamily: fontFamilyMono,
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.18)',
            letterSpacing: '0.12em',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          ACOUSTIC DIFFUSER // SECTOR L-01
        </div>
      </div>

      {/* Right Wall Acoustic Baffle Panels */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          top: 100,
          width: 220,
          height: 880,
          pointerEvents: 'none',
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end',
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 18,
              height: 800 - (6 - i) * 20,
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: 4,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            right: 4,
            bottom: 40,
            fontFamily: fontFamilyMono,
            fontSize: 10,
            color: 'rgba(255, 255, 255, 0.18)',
            letterSpacing: '0.12em',
            writingMode: 'vertical-rl',
          }}
        >
          ACOUSTIC DIFFUSER // SECTOR R-01
        </div>
      </div>

      {/* Soft SVG radial gradient shadow on the wall beneath the slide */}
      <svg
        style={{
          position: 'absolute',
          left: slideX + slideW / 2 - shadowW / 2,
          top: slideBaseY + slideH - shadowH / 2,
          width: shadowW,
          height: shadowH,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <radialGradient id={`hall-shadow-${gradId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity={shadowOpacity} />
            <stop offset="60%" stopColor="#000000" stopOpacity={shadowOpacity * 0.4} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse
          cx={shadowW / 2}
          cy={shadowH / 2}
          rx={shadowW / 2}
          ry={shadowH / 2}
          fill={`url(#hall-shadow-${gradId})`}
        />
      </svg>

      {/* Slide container */}
      <div
        style={{
          position: 'absolute',
          left: slideX,
          top: slideY,
          width: slideW,
          height: slideH,
          borderRadius: 16,
          backgroundColor: COLORS.surface,
          border: `2px solid ${COLORS.unlit}`,
          boxSizing: 'border-box',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Subtle slide projection matrix grid */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 56,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* 4 Corner Registration Crosshairs */}
        <div style={{ position: 'absolute', left: 16, top: 72, pointerEvents: 'none', opacity: 0.25 }}>
          <svg width={14} height={14} viewBox="0 0 14 14" stroke={COLORS.text} strokeWidth={1}>
            <line x1={7} y1={0} x2={7} y2={14} />
            <line x1={0} y1={7} x2={14} y2={7} />
          </svg>
        </div>
        <div style={{ position: 'absolute', right: 16, top: 72, pointerEvents: 'none', opacity: 0.25 }}>
          <svg width={14} height={14} viewBox="0 0 14 14" stroke={COLORS.text} strokeWidth={1}>
            <line x1={7} y1={0} x2={7} y2={14} />
            <line x1={0} y1={7} x2={14} y2={7} />
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 16, bottom: 16, pointerEvents: 'none', opacity: 0.25 }}>
          <svg width={14} height={14} viewBox="0 0 14 14" stroke={COLORS.text} strokeWidth={1}>
            <line x1={7} y1={0} x2={7} y2={14} />
            <line x1={0} y1={7} x2={14} y2={7} />
          </svg>
        </div>
        <div style={{ position: 'absolute', right: 16, bottom: 16, pointerEvents: 'none', opacity: 0.25 }}>
          <svg width={14} height={14} viewBox="0 0 14 14" stroke={COLORS.text} strokeWidth={1}>
            <line x1={7} y1={0} x2={7} y2={14} />
            <line x1={0} y1={7} x2={14} y2={7} />
          </svg>
        </div>

        {/* Title bar */}
        <div
          style={{
            height: 56,
            width: '100%',
            backgroundColor: `${COLORS.unlit}28`,
            borderBottom: `1px solid ${COLORS.unlit}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 24,
            paddingRight: 24,
            boxSizing: 'border-box',
          }}
        >
          {/* Left: Window traffic lights & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FF5F56', border: '1px solid #E0443E' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#FFBD2E', border: '1px solid #DEA123' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27C93F', border: '1px solid #1AAB29' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span
                style={{
                  fontFamily: fontFamilyInter,
                  fontSize: 20,
                  fontWeight: 600,
                  color: COLORS.text,
                  letterSpacing: '-0.01em',
                }}
              >
                {title}
              </span>
            </div>
          </div>

          {/* Right: Slide Controls & Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: 11,
                fontWeight: 600,
                color: COLORS.teal,
                backgroundColor: `${COLORS.teal}22`,
                padding: '4px 10px',
                borderRadius: 12,
                border: `1px solid ${COLORS.teal}44`,
                letterSpacing: '0.06em',
              }}
            >
              KEYNOTE • 4K UHD • 60 FPS
            </span>
            <span
              style={{
                fontFamily: fontFamilyMono,
                fontSize: 12,
                color: COLORS.text,
                opacity: 0.7,
                letterSpacing: '0.08em',
              }}
            >
              SLIDE 01 / 04
            </span>
          </div>
        </div>

        {/* Slide body / children */}
        <div
          style={{
            width: '100%',
            height: slideH - 56,
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>

      {/* Auditorium Architecture: Seating Risers and Row Labels */}
      <div
        style={{
          position: 'absolute',
          left: 280,
          top: 600,
          width: 1360,
          height: 400,
          pointerEvents: 'none',
        }}
      >
        {/* Tier riser lines behind each row */}
        {Array.from({ length: 8 }).map((_, r) => {
          const riserY = r * 38 + 16;
          return (
            <div
              key={r}
              style={{
                position: 'absolute',
                left: 60,
                top: riserY,
                width: 1240,
                height: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              }}
            />
          );
        })}

        {/* Left Row Labels */}
        {ROW_LABELS.map((label, r) => (
          <div
            key={`left-${r}`}
            style={{
              position: 'absolute',
              left: 0,
              top: r * 38 + 6,
              fontFamily: fontFamilyMono,
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.22)',
              letterSpacing: '0.1em',
            }}
          >
            {label}
          </div>
        ))}

        {/* Right Row Labels */}
        {ROW_LABELS.map((label, r) => (
          <div
            key={`right-${r}`}
            style={{
              position: 'absolute',
              right: 0,
              top: r * 38 + 6,
              fontFamily: fontFamilyMono,
              fontSize: 10,
              color: 'rgba(255, 255, 255, 0.22)',
              letterSpacing: '0.1em',
              textAlign: 'right',
            }}
          >
            {label}
          </div>
        ))}

        {/* Center aisle illumination strip (x = 960) */}
        <div
          style={{
            position: 'absolute',
            left: 676,
            top: 0,
            width: 8,
            height: 320,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: 0.35,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                backgroundColor: COLORS.teal,
                boxShadow: `0 0 4px ${COLORS.teal}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 8 rows x 24 cols ListenerDots grid */}
      <div
        style={{
          position: 'absolute',
          left: 360,
          top: 610,
          width: slideW,
          height: 380,
          overflow: 'hidden',
        }}
      >
        <ListenerDots
          rows={8}
          cols={24}
          gapX={35}
          gapY={24}
          litAt={dotLitAt}
          jumpAt={dotJumpAt}
          colorLit={colorLit}
          colorUnlit={colorUnlit}
        />
      </div>
    </div>
  );
};

export default Hall;

