import React from 'react';

type Hue = 'blue' | 'crimson' | 'violet' | 'teal' | 'amber' | 'ink';

const HUE_MAP: Record<Hue, [string, string]> = {
  blue:    ['#0a1b3d', '#05102a'],
  crimson: ['#3d0a1b', '#2a0510'],
  violet:  ['#23003d', '#10052a'],
  teal:    ['#003d3a', '#05212a'],
  amber:   ['#3d2a0a', '#2a1c05'],
  ink:     ['#0a0e1a', '#05080f'],
};

export function BackgroundField({ hue = 'blue' }: { hue?: Hue }) {
  const [a, b] = HUE_MAP[hue] ?? HUE_MAP.blue;
  return (
    <div className="absolute inset-0 z-0 overflow-hidden" style={{
      background: `radial-gradient(120% 80% at 30% 40%, ${a} 0%, ${b} 60%, #000 100%)`,
    }}>
      <div className="absolute pointer-events-none" style={{
        left: '-10%', top: '-20%', width: '70%', height: '140%',
        background: `linear-gradient(135deg, ${a}ee, transparent 70%)`,
        filter: 'blur(40px)', opacity: 0.6, mixBlendMode: 'screen',
      }} />
      <div className="absolute pointer-events-none" style={{
        right: '-10%', bottom: '-20%', width: '60%', height: '120%',
        background: 'linear-gradient(315deg, #ffffff18, transparent 70%)',
        filter: 'blur(60px)', mixBlendMode: 'screen',
      }} />
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.18 }}>
        <defs>
          <pattern id="bg-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid)" />
      </svg>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)',
        mixBlendMode: 'overlay',
      }} />
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08, mixBlendMode: 'overlay' }}>
        <filter id="noise"><feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

export function EdgeText({ side = 'left', text = 'FRAGMENT', color = '#ffffff' }: {
  side?: 'left' | 'right';
  text?: string;
  color?: string;
}) {
  const base: React.CSSProperties = {
    position: 'absolute', top: 0, bottom: 0, display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 2,
    pointerEvents: 'none', fontFamily: "'Archivo Black', sans-serif",
    fontStyle: 'italic', fontSize: 'clamp(72px, 11vw, 180px)',
    lineHeight: 0.85, letterSpacing: '-0.04em',
    WebkitTextStroke: `2px ${color}`, color: 'transparent',
    opacity: 0.35, userSelect: 'none', whiteSpace: 'nowrap',
  };
  if (side === 'left') return (
    <div style={{ ...base, left: '-30px', transform: 'rotate(-90deg) translateY(-40%)', transformOrigin: 'left center' }}>
      {text}
    </div>
  );
  return (
    <div style={{ ...base, right: '-30px', transform: 'rotate(90deg) translateY(40%)', transformOrigin: 'right center' }}>
      {text}
    </div>
  );
}

export function CornerBracket({ corner, children }: {
  corner: 'tl' | 'tr' | 'bl' | 'br';
  children: React.ReactNode;
}) {
  const pos: React.CSSProperties = {
    tl: { top: 24, left: 24 },
    tr: { top: 24, right: 24 },
    bl: { bottom: 24, left: 24 },
    br: { bottom: 24, right: 24 },
  }[corner];
  return <div className="absolute z-[5]" style={pos}>{children}</div>;
}

export function HudBadge({ label, value, accent = '#4fd6ff' }: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="inline-flex flex-col backdrop-blur-sm" style={{
      padding: '10px 16px', minWidth: 180,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderLeft: `3px solid ${accent}`,
    }}>
      <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.25em', opacity: 0.6 }}>{label}</div>
      <div className="font-display italic" style={{ fontSize: 22, lineHeight: 1, marginTop: 4 }}>{value}</div>
    </div>
  );
}

export function HudControlHint({ keyLabel, action }: { keyLabel: string; action: string }) {
  return (
    <div className="inline-flex items-center gap-2" style={{ marginLeft: 18 }}>
      <span className="inline-flex items-center justify-center font-mono font-bold" style={{
        width: 28, height: 28, borderRadius: '50%',
        border: '2px solid #fff', fontSize: 12,
      }}>{keyLabel}</span>
      <span className="font-body font-bold italic" style={{ fontSize: 16, letterSpacing: '0.02em' }}>{action}</span>
    </div>
  );
}

export function ScreenLabel({ command, hint }: { command: string; hint: string }) {
  return (
    <div className="text-right">
      <div className="font-display italic" style={{ fontSize: 28, lineHeight: 1, letterSpacing: '-0.01em' }}>{command}</div>
      <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.2em', opacity: 0.6, marginTop: 4 }}>{hint}</div>
    </div>
  );
}

export function PortraitPlaceholder({ accent = '#4fd6ff' }: { accent?: string }) {
  return (
    <div className="absolute pointer-events-none z-[1]" style={{ left: '2%', bottom: 0, top: '10%', width: '46%' }}>
      <div className="absolute" style={{
        left: '20%', top: '5%', width: '60%', height: '90%',
        background: `linear-gradient(170deg, ${accent}33 0%, ${accent}11 40%, transparent 70%)`,
        filter: 'blur(30px)',
      }} />
      <div className="absolute" style={{
        left: '10%', top: '15%', width: '70%', height: '85%',
        background: `repeating-linear-gradient(95deg, ${accent}22 0 3px, transparent 3px 9px)`,
        clipPath: 'polygon(30% 0%, 70% 0%, 85% 35%, 75% 100%, 20% 100%, 15% 40%)',
        mixBlendMode: 'screen',
      }} />
      <div className="absolute" style={{
        left: '15%', top: '18%', width: '60%', height: '80%',
        border: `1px dashed ${accent}88`,
        clipPath: 'polygon(30% 0%, 70% 0%, 85% 35%, 75% 100%, 20% 100%, 15% 40%)',
      }} />
      <div className="absolute font-mono" style={{
        left: '55%', top: '40%', fontSize: 10, letterSpacing: '0.2em', color: accent, opacity: 0.7,
      }}>[ SUBJECT / PLACEHOLDER ]</div>
    </div>
  );
}
