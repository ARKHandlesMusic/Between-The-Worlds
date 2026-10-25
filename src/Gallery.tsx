import React from 'react';
import { COLORS } from './lib/tokens';
import { fontFamilyInter } from './lib/fonts';
import { Window } from './primitives/Window';
import { PromptBox } from './primitives/PromptBox';
import { Spark } from './primitives/Spark';
import { Cursor } from './primitives/Cursor';
import { Gap } from './primitives/Gap';
import { ListenerDots } from './primitives/ListenerDots';
import { Heart } from './primitives/Heart';
import { Whisper } from './primitives/Whisper';
import { UndergroundDot } from './primitives/UndergroundDot';
import { Ruler } from './primitives/Ruler';
import { Rings } from './primitives/Rings';
import { CheckMark } from './primitives/CheckMark';
import { Brackets } from './primitives/Brackets';

export const Gallery: React.FC = () => {
  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        backgroundColor: COLORS.navy,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          left: 96,
          top: 60,
          fontFamily: fontFamilyInter,
          fontSize: 32,
          fontWeight: 700,
          color: COLORS.text,
        }}
      >
        Primitive Gallery
      </div>

      {/* Row 1 */}
      {/* 1. Window */}
      <div style={{ position: 'absolute', left: 96, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Window
        </div>
        <div style={{ position: 'relative', width: 280, height: 160 }}>
          <Window x={0} y={0} w={280} h={160} draw={1}>
            <div style={{ padding: 16, fontFamily: fontFamilyInter, fontSize: 14, color: COLORS.text }}>
              Window Content
            </div>
          </Window>
        </div>
      </div>

      {/* 2. PromptBox */}
      <div style={{ position: 'absolute', left: 420, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          PromptBox
        </div>
        <div style={{ position: 'relative', width: 420, height: 72 }}>
          <PromptBox x={0} y={0} w={420} text="make me something" typedChars={17} glow={1} />
        </div>
      </div>

      {/* 3. Spark */}
      <div style={{ position: 'absolute', left: 880, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Spark
        </div>
        <div style={{ position: 'relative', width: 140, height: 140 }}>
          <Spark x={70} y={70} burst={0.8} ring={0.4} />
        </div>
      </div>

      {/* 4. Cursor */}
      <div style={{ position: 'absolute', left: 1060, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Cursor
        </div>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <Cursor x={20} y={20} press={0} />
        </div>
      </div>

      {/* 5. Heart */}
      <div style={{ position: 'absolute', left: 1180, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Heart
        </div>
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <Heart x={60} y={60} d={28} pulse={0.4} />
        </div>
      </div>

      {/* 6. CheckMark */}
      <div style={{ position: 'absolute', left: 1340, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          CheckMark
        </div>
        <div style={{ position: 'relative', width: 80, height: 80 }}>
          <CheckMark x={10} y={10} progress={1} size={48} />
        </div>
      </div>

      {/* 7. Brackets */}
      <div style={{ position: 'absolute', left: 1480, top: 120 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Brackets
        </div>
        <div style={{ position: 'relative', width: 120, height: 100 }}>
          <Brackets x={60} y={40} rotation={0} spread={50} size={28} color={COLORS.orange} />
        </div>
      </div>

      {/* Row 2 */}
      {/* 8. Gap */}
      <div style={{ position: 'absolute', left: 96, top: 380 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Gap
        </div>
        <div style={{ position: 'relative', width: 280, height: 260 }}>
          <Gap x={140} y={130} h={240} gapWidth={60} warm={1} />
        </div>
      </div>

      {/* 9. ListenerDots */}
      <div style={{ position: 'absolute', left: 420, top: 380 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          ListenerDots (Grid)
        </div>
        <div style={{ position: 'relative', width: 360, height: 200 }}>
          <ListenerDots
            rows={5}
            cols={8}
            x={0}
            y={0}
            gapX={28}
            gapY={24}
            litAt={(r, c) => ((r + c) % 3 === 0 ? 1 : 0)}
            jumpAt={(r, c) => ((r + c) % 4 === 0 ? -6 : 0)}
          />
        </div>
      </div>

      {/* 10. Ruler */}
      <div style={{ position: 'absolute', left: 840, top: 380 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Ruler
        </div>
        <div style={{ position: 'relative', width: 440, height: 80 }}>
          <Ruler x={0} y={30} w={400} progress={1} jitter={1} tickSpacing={25} />
        </div>
      </div>

      {/* 11. Rings */}
      <div style={{ position: 'absolute', left: 1320, top: 380 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Rings
        </div>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <Rings x={100} y={100} phase={0.5} maxRadius={80} count={3} />
        </div>
      </div>

      {/* Row 3 */}
      {/* 12. Hall preview */}
      <div style={{ position: 'absolute', left: 96, top: 680 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Hall (Slide + Audience Grid)
        </div>
        <div
          style={{
            position: 'relative',
            width: 720,
            height: 300,
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            border: `2px solid ${COLORS.unlit}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: 40,
              backgroundColor: `${COLORS.unlit}33`,
              borderBottom: `1px solid ${COLORS.unlit}55`,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 20,
              fontFamily: fontFamilyInter,
              fontSize: 16,
              color: COLORS.text,
            }}
          >
            The voice was never in the sound
          </div>
          <div style={{ padding: 20 }}>
            <ListenerDots
              rows={4}
              cols={14}
              gapX={28}
              gapY={16}
              litAt={(_r, c) => (c < 8 ? 1 : 0)}
            />
          </div>
        </div>
      </div>

      {/* 13. Whisper */}
      <div style={{ position: 'absolute', left: 860, top: 680 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          Whisper (Bottom Left spec: x 48, y 1032)
        </div>
        <div
          style={{
            position: 'relative',
            width: 320,
            height: 60,
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            padding: 12,
            boxSizing: 'border-box',
          }}
        >
          <Whisper text="(Can you hear it?)" reveal={1} x={16} y={20} />
        </div>
      </div>

      {/* 14. UndergroundDot */}
      <div style={{ position: 'absolute', left: 1220, top: 680 }}>
        <div style={{ fontFamily: fontFamilyInter, fontSize: 16, color: COLORS.unlit, marginBottom: 8 }}>
          UndergroundDot (Spec: 6px, bottom centre)
        </div>
        <div
          style={{
            position: 'relative',
            width: 120,
            height: 60,
            backgroundColor: COLORS.surface,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UndergroundDot size={12} opacity={0.8} x={60} y={30} pulse={0.5} />
        </div>
      </div>
    </div>
  );
};
