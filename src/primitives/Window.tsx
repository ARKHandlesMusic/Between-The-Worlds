import React from 'react';
import { COLORS } from '../lib/tokens';
import { fontFamilyInter, fontFamilyMono } from '../lib/fonts';

export type WindowProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  draw?: number; // 0 to 1: outline then fill
  borderRadius?: number;
  title?: string;
  icon?: 'browser' | 'code' | 'terminal' | 'chat' | 'doc' | 'folder' | 'generic';
  showControls?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * Window primitive per AGENTS.md Section 7 & modern web/OS specs:
 * Rounded rect (surface), detailed title bar with close/minimize/maximize traffic lights,
 * window title with SVG icon, and smooth outline-then-fill draw physics.
 */
export const Window: React.FC<WindowProps> = ({
  x,
  y,
  w,
  h,
  draw = 1,
  borderRadius = 16,
  title,
  icon = 'generic',
  showControls = true,
  children,
  style,
}) => {
  if (draw <= 0) return null;

  // 0 to 0.5: outline draws around perimeter
  const outlineProgress = Math.min(1, draw * 2);
  // 0.5 to 1.0: surface fill and chrome fade in
  const fillProgress = Math.max(0, (draw - 0.5) * 2);

  const roundedX = Math.round(x);
  const roundedY = Math.round(y);
  const roundedW = Math.round(w);
  const roundedH = Math.round(h);
  const r = Math.min(borderRadius, Math.min(roundedW, roundedH) / 2);

  // Perimeter of rounded rect for SVG stroke drawing: 2*(w + h) - 8*r + 2*PI*r
  const perimeter = 2 * (roundedW + roundedH) - 8 * r + 2 * Math.PI * r;
  const strokeOffset = perimeter * (1 - outlineProgress);

  const renderIcon = () => {
    switch (icon) {
      case 'terminal':
        return (
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );
      case 'code':
        return (
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={COLORS.teal} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'browser':
        return (
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case 'chat':
        return (
          <svg width={13} height={13} viewBox="0 0 24 24" fill={COLORS.orange}>
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        );
      case 'doc':
        return (
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: roundedX,
        top: roundedY,
        width: roundedW,
        height: roundedH,
        borderRadius: r,
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Background surface fill (fades in during second half of draw) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.surface,
          opacity: fillProgress,
          borderRadius: r,
        }}
      />

      {/* SVG Outline drawing around perimeter */}
      <svg
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: roundedW,
          height: roundedH,
          pointerEvents: 'none',
        }}
      >
        <rect
          x={1}
          y={1}
          width={Math.max(0, roundedW - 2)}
          height={Math.max(0, roundedH - 2)}
          rx={r}
          ry={r}
          fill="none"
          stroke={COLORS.unlit}
          strokeWidth={2}
          strokeDasharray={perimeter}
          strokeDashoffset={strokeOffset}
        />
      </svg>

      {/* Chrome Title Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 38,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: 16,
          paddingRight: 16,
          borderBottom: `1px solid ${COLORS.unlit}44`,
          backgroundColor: `${COLORS.navy}66`,
          opacity: fillProgress,
          boxSizing: 'border-box',
          zIndex: 2,
        }}
      >
        {/* Left: Window Traffic Lights */}
        {showControls ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 70 }}>
            {/* Close (Red with micro-x) */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FF5F56',
                border: '1px solid #E0443E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={7} height={7} viewBox="0 0 10 10" stroke="#7A1D1A" strokeWidth={1.8}>
                <line x1="2" y1="2" x2="8" y2="8" />
                <line x1="8" y1="2" x2="2" y2="8" />
              </svg>
            </div>
            {/* Minimize (Yellow with micro-minus) */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#FFBD2E',
                border: '1px solid #DEA123',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={7} height={7} viewBox="0 0 10 10" stroke="#8A5A00" strokeWidth={1.8}>
                <line x1="2" y1="5" x2="8" y2="5" />
              </svg>
            </div>
            {/* Maximize (Green with micro-plus) */}
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#27C93F',
                border: '1px solid #1AAB29',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width={7} height={7} viewBox="0 0 10 10" stroke="#0B6617" strokeWidth={1.8}>
                <line x1="2" y1="5" x2="8" y2="5" />
                <line x1="5" y1="2" x2="5" y2="8" />
              </svg>
            </div>
          </div>
        ) : (
          <div style={{ width: 70 }} />
        )}

        {/* Center: Window Title with Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {renderIcon()}
          {title && (
            <span
              style={{
                fontFamily: icon === 'terminal' || icon === 'code' ? fontFamilyMono : fontFamilyInter,
                fontSize: 12,
                fontWeight: 500,
                color: COLORS.text,
                opacity: 0.75,
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </span>
          )}
        </div>

        {/* Right: Window Action Icons (Split view, menu) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 70, justifyContent: 'flex-end', opacity: 0.5 }}>
          {/* Split View Icon */}
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="3" x2="12" y2="21" />
          </svg>
          {/* More Dots */}
          <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={COLORS.text} strokeWidth={2}>
            <circle cx="5" cy="12" r="1.5" fill={COLORS.text} />
            <circle cx="12" cy="12" r="1.5" fill={COLORS.text} />
            <circle cx="19" cy="12" r="1.5" fill={COLORS.text} />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 38,
          width: '100%',
          height: Math.max(0, roundedH - 38),
          opacity: fillProgress,
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

