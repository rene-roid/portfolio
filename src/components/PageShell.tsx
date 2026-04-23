import React, { useEffect, useState } from 'react';
import type { MenuItem } from '../types';
import { BackgroundField, CornerBracket, EdgeText, HudBadge, HudControlHint, ScreenLabel } from './Hud';

export function Reveal({ delay = 0, from = 'up', dist = 30, dur = 420, children, style }: {
  delay?: number;
  from?: 'up' | 'down' | 'left' | 'right';
  dist?: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  const axis =
    from === 'up'    ? `translateY(${on ? 0 : dist}px)` :
    from === 'down'  ? `translateY(${on ? 0 : -dist}px)` :
    from === 'left'  ? `translateX(${on ? 0 : -dist}px)` :
    from === 'right' ? `translateX(${on ? 0 : dist}px)` : 'none';

  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: axis,
      transition: `opacity ${dur}ms cubic-bezier(.7,0,.2,1), transform ${dur}ms cubic-bezier(.7,0,.2,1)`,
      willChange: 'opacity,transform',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function StyledCard({ accent = '#4fd6ff', children, pad = 20, style }: {
  accent?: string;
  children: React.ReactNode;
  pad?: number;
  style?: React.CSSProperties;
}) {
  return (
    <div className="relative backdrop-blur-sm" style={{
      background: 'rgba(10,20,50,0.55)',
      border: '1px solid rgba(255,255,255,0.14)',
      borderLeft: `3px solid ${accent}`,
      padding: pad,
      ...style,
    }}>
      {children}
    </div>
  );
}

function NavArrow({ dir, onClick, color }: { dir: 'prev' | 'next'; onClick: () => void; color: string }) {
  const isPrev = dir === 'prev';
  return (
    <button
      onClick={onClick}
      className="absolute z-[5] flex flex-col items-center gap-1 cursor-pointer"
      style={{
        [isPrev ? 'left' : 'right']: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'transparent',
        border: 'none',
        padding: '12px 8px',
        opacity: 0.45,
        transition: 'opacity 150ms',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.45'; }}
    >
      <div className="font-display italic" style={{
        fontSize: 28,
        color,
        transform: isPrev ? 'rotate(90deg)' : 'rotate(-90deg)',
        lineHeight: 1,
      }}>▼</div>
      <div className="font-mono uppercase" style={{
        fontSize: 9, letterSpacing: '0.25em', color: '#fff',
        writingMode: 'vertical-rl',
        transform: isPrev ? 'rotate(180deg)' : 'none',
        marginTop: 4,
      }}>
        {isPrev ? 'PREV' : 'NEXT'}
      </div>
    </button>
  );
}

export function PageShell({ item, onBack, onNext, onPrev, children }: {
  item: MenuItem;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-[3]">
      <BackgroundField hue={item.hue} />

      <Reveal delay={60} from="down" dist={60}>
        <EdgeText side="left" text={item.label} color={item.color} />
      </Reveal>

      <CornerBracket corner="tl">
        <Reveal delay={120} from="left">
          <HudBadge label="section" value={item.label} accent={item.color} />
        </Reveal>
      </CornerBracket>

      <CornerBracket corner="tr">
        <Reveal delay={160} from="right">
          <div className="text-right font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', opacity: 0.7 }}>
            <div>FERNANDO SOLÓRZANO / FULL STACK DEV</div>
            <div style={{ marginTop: 4, opacity: 0.55 }}>{item.sub}</div>
          </div>
        </Reveal>
      </CornerBracket>

      <div className="absolute overflow-hidden z-[4]" style={{ inset: '110px 8% 110px 8%' }}>
        <Reveal delay={220} from="up" dist={40} dur={480}>
          {children}
        </Reveal>
      </div>

      {onPrev && <NavArrow dir="prev" onClick={onPrev} color={item.color} />}
      {onNext && <NavArrow dir="next" onClick={onNext} color={item.color} />}

      <CornerBracket corner="br">
        <Reveal delay={260} from="right">
          <ScreenLabel command="Return" hint="Main Menu" />
          <div className="text-right" style={{ marginTop: 14 }}>
            <HudControlHint keyLabel="ESC" action="Back" />
            <HudControlHint keyLabel="SCROLL" action="Navigate" />
          </div>
        </Reveal>
      </CornerBracket>

      <CornerBracket corner="bl">
        <Reveal delay={300} from="left">
          <button
            onClick={onBack}
            className="font-display italic cursor-pointer relative overflow-hidden"
            style={{
              background: 'transparent', border: `2px solid ${item.color}`,
              color: '#fff', fontSize: 16, letterSpacing: '-0.01em',
              padding: '10px 22px 10px 32px', transform: 'skewX(-10deg)',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = item.color;
              (e.currentTarget as HTMLButtonElement).style.color = '#0a1b3d';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
          >
            ◂ BACK
          </button>
        </Reveal>
      </CornerBracket>
    </div>
  );
}
