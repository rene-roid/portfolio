import { useEffect, useRef, useState } from 'react';
import { MENU_ITEMS } from '../data';
import type { MenuItem } from '../types';
import { BackgroundField, CornerBracket, EdgeText, HudBadge, HudControlHint, ScreenLabel } from './Hud';

// ── Intro panel (left side) ────────────────────────────────────────────────
function IntroPanel({ hoveredItem }: { hoveredItem: MenuItem | null }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seq = [180, 320, 480, 650, 850];
    const ids = seq.map((t, i) => setTimeout(() => setStep(i + 1), t));
    return () => ids.forEach(clearTimeout);
  }, []);

  const accent = hoveredItem?.color ?? '#4fd6ff';

  return (
    <div className="absolute z-[4]" style={{ left: '6%', top: '50%', transform: 'translateY(-50%)', maxWidth: '44%' }}>
      {/* // hello_world() */}
      <div className="font-mono uppercase" style={{
        opacity: step >= 1 ? 1 : 0,
        transform: step >= 1 ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 380ms cubic-bezier(.7,0,.2,1), transform 380ms cubic-bezier(.7,0,.2,1)',
        fontSize: 12, letterSpacing: '0.3em', color: accent, marginBottom: 14,
      }}>
        // <span>hello_world( )</span>
      </div>

      {/* HI, I'M */}
      <div className="font-display italic" style={{
        opacity: step >= 2 ? 1 : 0,
        transform: step >= 2 ? 'skewX(-8deg)' : 'skewX(-8deg) translateX(-40px)',
        transition: 'opacity 420ms cubic-bezier(.7,0,.2,1), transform 420ms cubic-bezier(.7,0,.2,1)',
        fontSize: 'clamp(46px, 6.2vw, 98px)', lineHeight: 0.88,
        letterSpacing: '-0.04em', color: '#fff',
        textShadow: `5px 5px 0 ${accent}`,
      }}>
        HI, I'M
      </div>

      {/* KAI VANCE. — with accent bar */}
      <div className="relative" style={{
        marginTop: 6, marginLeft: 10,
        opacity: step >= 3 ? 1 : 0,
        transition: 'opacity 400ms cubic-bezier(.7,0,.2,1)',
      }}>
        <div className="absolute" style={{
          left: -20, right: -30, top: '36%', height: '36%',
          background: accent,
          transform: step >= 3 ? 'skewX(-6deg) scaleX(1)' : 'skewX(-6deg) scaleX(0)',
          transformOrigin: 'left center',
          transition: 'transform 500ms cubic-bezier(.7,0,.2,1)',
          zIndex: 0,
        }} />
        <div className="relative font-display italic" style={{
          zIndex: 1,
          fontSize: 'clamp(64px, 8.8vw, 140px)', lineHeight: 0.82,
          letterSpacing: '-0.05em', color: '#fff',
          textShadow: '4px 4px 0 rgba(0,0,0,0.45), 2px 0 0 #ff2d7d, -2px 0 0 #18e6ff',
          transform: 'skewX(-10deg)',
        }}>
          Fernando<br />Solórzano.
        </div>
      </div>

      {/* tagline */}
      <div className="font-body font-bold italic" style={{
        marginTop: 30, marginLeft: 10,
        opacity: step >= 4 ? 1 : 0,
        transform: step >= 4 ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 420ms cubic-bezier(.7,0,.2,1), transform 420ms cubic-bezier(.7,0,.2,1)',
        fontSize: 20, lineHeight: 1.35, color: '#d9e6ff', maxWidth: 480,
      }}>
        Frontend Developer | React · Next.js · TypeScript | Full Stack & C# Background.{' '}
        <span style={{ color: accent }}>Welcome to my portfolio.</span>
      </div>

      {/* blinking prompt */}
      <div className="flex items-center gap-2" style={{
        marginTop: 26, marginLeft: 10,
        opacity: step >= 5 ? 1 : 0,
        transform: step >= 5 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 380ms cubic-bezier(.7,0,.2,1), transform 380ms cubic-bezier(.7,0,.2,1)',
      }}>
        <span className="blink" style={{ width: 10, height: 10, background: accent, display: 'inline-block' }} />
        <span className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.75 }}>
          pick a command →
        </span>
      </div>
    </div>
  );
}

// ── Menu item row ─────────────────────────────────────────────────────────
function MenuItemRow({ item, index, isActive, onHover, onClick }: {
  item: MenuItem;
  index: number;
  isActive: boolean;
  onHover: (id: string | null) => void;
  onClick: (item: MenuItem) => void;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 100 + index * 60);
    return () => clearTimeout(id);
  }, [index]);

  const indent = 30 + index * 22;

  return (
    <div
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(item)}
      className="relative cursor-pointer"
      style={{
        marginLeft: indent,
        marginTop: index === 0 ? 0 : -10,
        padding: '2px 0',
        transform: entered ? `translateX(${isActive ? 24 : 0}px)` : 'translateX(-60px)',
        opacity: entered ? 1 : 0,
        transition: 'transform 180ms cubic-bezier(.7,0,.2,1.6), opacity 220ms ease',
        willChange: 'transform,opacity',
      }}
    >
      {/* v1-style slash slab */}
      <div style={{
        position: 'absolute', left: -24, top: '10%', bottom: '10%',
        width: isActive ? 'calc(100% + 48px)' : '0%',
        background: item.color,
        transform: 'skewX(-14deg)',
        transition: 'width 140ms cubic-bezier(.8,0,.2,1)',
        zIndex: 0,
      }} />

      {/* arrow */}
      <div className="absolute font-display italic z-1" style={{
        left: -44, top: '50%',
        transform: `translateY(-50%) translateX(${isActive ? 0 : -20}px)`,
        opacity: isActive ? 1 : 0,
        transition: 'all 160ms cubic-bezier(.7,0,.2,1.6)',
        fontSize: 34, color: '#fff', lineHeight: 1,
      }}>▸</div>

      {/* label */}
      <div className="relative z-1 font-display italic" style={{
        fontSize: 'clamp(44px, 6vw, 86px)',
        lineHeight: 0.95, letterSpacing: '-0.03em',
        color: isActive ? '#0a1b3d' : '#ffffff',
        WebkitTextStroke: isActive ? '0' : '1px rgba(255,255,255,0.9)',
        textShadow: isActive ? `4px 4px 0 ${item.color}` : 'none',
        transform: 'skewX(-8deg)', padding: '0 6px',
        transition: 'color 120ms linear',
      }}>
        {item.label}
      </div>

      {/* subtitle badge */}
      {/* <div className="absolute font-mono uppercase z-[2] whitespace-nowrap" style={{
        right: -8, top: '50%',
        transform: `translateY(-50%) translateX(${isActive ? 0 : 20}px)`,
        opacity: isActive ? 1 : 0,
        transition: 'all 180ms cubic-bezier(.7,0,.2,1)',
        fontSize: 11, letterSpacing: '0.22em',
        color: '#fff', background: '#0a1b3d', padding: '4px 10px',
        border: '1px solid #fff',
      }}>
        {item.sub}
      </div> */}
    </div>
  );
}

// ── Live clock ────────────────────────────────────────────────────────────
export function LiveClock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  const ss = String(t.getSeconds()).padStart(2, '0');
  return <span>{hh}:{mm}:{ss}</span>;
}

// ── Main menu ─────────────────────────────────────────────────────────────
export function MainMenu({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const [mouseHovered, setMouseHovered] = useState<string | null>(null);
  const [keyIndex, setKeyIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setKeyIndex(i => { const n = i < MENU_ITEMS.length - 1 ? i + 1 : 0; setMouseHovered(null); return n; });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setKeyIndex(i => { const n = i > 0 ? i - 1 : MENU_ITEMS.length - 1; setMouseHovered(null); return n; });
      } else if (e.key === 'Enter') {
        const idx = keyIndex >= 0 ? keyIndex : MENU_ITEMS.findIndex(m => m.id === mouseHovered);
        if (idx >= 0) onSelect(MENU_ITEMS[idx]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keyIndex, mouseHovered, onSelect]);

  function handleMouseHover(id: string | null) {
    setMouseHovered(id);
    if (id !== null) setKeyIndex(-1);
  }

  const activeId = mouseHovered ?? (keyIndex >= 0 ? MENU_ITEMS[keyIndex].id : null);
  const current = MENU_ITEMS.find(i => i.id === activeId) ?? null;

  return (
    <div ref={containerRef} className="absolute inset-0 z-[3]" tabIndex={-1}>
      <BackgroundField hue={current?.hue ?? 'blue'} />

      <EdgeText side="left" text="FRAGMENT·0426" color="#ffffff" />
      <EdgeText side="right" text={current ? current.command.toUpperCase().replace(/ /g, '·') : 'MAIN·MENU'} color={current?.color ?? '#4fd6ff'} />

      <CornerBracket corner="tl">
        <HudBadge label="now playing" value="welcome.mp3" accent={current?.color ?? '#4fd6ff'} />
      </CornerBracket>

      <CornerBracket corner="tr">
        <div className="text-right font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', opacity: 0.7 }}>
          <div>FERNANDO SOLÓRZANO / FULL STACK DEV</div>
          <div style={{ marginTop: 4, opacity: 0.55 }}>LOCAL TIME · <LiveClock /></div>
        </div>
      </CornerBracket>

      {/* left: intro panel */}
      <IntroPanel hoveredItem={current} />

      {/* right: menu stack */}
      <div className="absolute flex flex-col items-start z-[4]" style={{ right: '6%', top: '50%', transform: 'translateY(-50%)' }}>
        <div className="relative" style={{ marginLeft: 0, marginBottom: 8, transform: 'skewX(-8deg)' }}>
          <div className="absolute" style={{
            left: -20, right: -30, top: '42%', height: '28%',
            background: current?.color ?? '#ff3b8a',
            transform: 'skewX(6deg)',
            transition: 'background 200ms',
            zIndex: 0,
          }} />
          <div className="relative font-display italic z-[1]" style={{
            fontSize: 'clamp(56px, 8vw, 120px)', lineHeight: 0.9,
            letterSpacing: '-0.04em', color: '#ffffff',
            textShadow: '5px 5px 0 rgba(0,0,0,0.35)',
          }}>MENU</div>
        </div>

        {MENU_ITEMS.map((item, i) => (
          <MenuItemRow
            key={item.id} item={item} index={i}
            isActive={item.id === activeId}
            onHover={handleMouseHover}
            onClick={onSelect}
          />
        ))}
      </div>

      <CornerBracket corner="br">
        <ScreenLabel command={current ? current.command : 'Select Command'} hint="Command" />
        <div className="text-right" style={{ marginTop: 14 }}>
          <HudControlHint keyLabel="↵" action="Confirm" />
          <HudControlHint keyLabel="ESC" action="Back" />
        </div>
      </CornerBracket>

      <CornerBracket corner="bl">
        <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.3em', opacity: 0.5, maxWidth: 260, lineHeight: 1.8 }}>
          <div>// portfolio / v4.26</div>
          <div>// status: live</div>
          <div>// build: 2026.04.23</div>
        </div>
      </CornerBracket>
    </div>
  );
}
