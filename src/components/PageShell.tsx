import React, { useEffect, useState } from 'react';
import type { MenuItem } from '../types';
import { BackgroundField, CornerBracket, EdgeText, NowPlayingPlayer } from './Hud';

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
  const [nudge, setNudge] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const offset = isPrev ? 10000 : 11000;
    let interval: ReturnType<typeof setInterval>;
    const initial = setTimeout(() => {
      const run = () => { setNudge(true); setTimeout(() => setNudge(false), 900); };
      run();
      interval = setInterval(run, 20000);
    }, offset);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [isPrev]);

  return (
    <button
      onClick={onClick}
      className="absolute z-5 flex flex-col items-center gap-1 cursor-pointer"
      style={{
        [isPrev ? 'left' : 'right']: 18,
        top: '50%',
        transform: 'translateY(-50%)',
        animation: nudge ? `${isPrev ? 'nav-hint-left' : 'nav-hint-right'} 880ms cubic-bezier(.4,0,.2,1) forwards` : 'none',
        background: 'transparent',
        border: 'none',
        padding: '12px 8px',
        opacity: hovered ? 1 : 0.45,
        transition: 'opacity 150ms',
        filter: hovered ? 'brightness(1.6)' : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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

function BackButton({ color, onClick }: { color: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [flash, setFlash] = useState(0); // 0=off 1=white 2=color 3=fade

  function handleClick() {
    setPressed(true);
    setFlash(1);
    setTimeout(() => setFlash(2), 80);
    setTimeout(() => setFlash(3), 180);
    setTimeout(() => { setFlash(0); setPressed(false); onClick(); }, 420);
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="font-display italic cursor-pointer relative overflow-hidden"
      style={{
        background: 'transparent',
        border: `2px solid ${color}`,
        color: hovered ? '#0a1b3d' : '#fff',
        fontSize: 16,
        letterSpacing: '-0.01em',
        padding: '10px 22px 10px 32px',
        transform: pressed
          ? 'skewX(-10deg) scale(0.88) translateX(-6px)'
          : 'skewX(-10deg) scale(1) translateX(0)',
        transition: pressed
          ? 'color 350ms ease, transform 100ms cubic-bezier(.4,0,.2,1)'
          : 'color 350ms ease, transform 280ms cubic-bezier(.2,1.6,.4,1)',
        zIndex: 0,
        boxShadow: pressed ? `0 0 18px 4px ${color}88` : '0 0 0px 0px transparent',
      }}
    >
      {/* fill sweep right→left */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: color,
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'right center',
          transition: hovered
            ? 'transform 380ms cubic-bezier(.7,0,.1,1)'
            : 'transform 260ms cubic-bezier(.9,0,.3,1)',
          zIndex: -1,
        }}
      />
      {/* flash overlay: white burst → color burst → fade */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: flash === 1 ? '#fff' : color,
          opacity: flash === 0 ? 0 : flash === 3 ? 0 : 0.55,
          transition: flash === 1 ? 'opacity 0ms' : flash === 2 ? 'opacity 60ms' : 'opacity 220ms ease',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 2 }}>◂ BACK</span>
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
    <div className="absolute inset-0 z-3">
      <BackgroundField hue={item.hue} accentColor={item.color} />

      <Reveal delay={60} from="down" dist={60}>
        <EdgeText side="left" text={item.label} color={item.color} />
      </Reveal>

      <CornerBracket corner="tl">
        <Reveal delay={120} from="left">
          <NowPlayingPlayer label="section" value={item.label} accent={item.color} />
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

      <div className="absolute overflow-hidden z-4" style={{ inset: '110px 8% 110px 8%' }}>
        <Reveal delay={220} from="up" dist={40} dur={480}>
          {children}
        </Reveal>
      </div>

      {onPrev && <NavArrow dir="prev" onClick={onPrev} color={item.color} />}
      {onNext && <NavArrow dir="next" onClick={onNext} color={item.color} />}

      <CornerBracket corner="bl">
        <Reveal delay={300} from="left">
          <BackButton color={item.color} onClick={onBack} />
        </Reveal>
      </CornerBracket>
    </div>
  );
}
