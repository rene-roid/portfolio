import { useEffect, useRef, useState } from 'react';
import { MENU_ITEMS } from '../data';
import type { MenuItem } from '../types';
import { BackgroundField, CornerBracket, EdgeText, HudBadge, HudControlHint, PortraitPlaceholder, ScreenLabel } from './Hud';

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
      {/* v1-style: colored slash slab slides in behind label */}
      <div style={{
        position: 'absolute', left: -24, top: '10%', bottom: '10%',
        width: isActive ? 'calc(100% + 48px)' : '0%',
        background: item.color,
        transform: 'skewX(-14deg)',
        transition: 'width 140ms cubic-bezier(.8,0,.2,1)',
        zIndex: 0,
      }} />

      {/* arrow marker */}
      <div className="absolute font-display italic z-[1]" style={{
        left: -44, top: '50%',
        transform: `translateY(-50%) translateX(${isActive ? 0 : -20}px)`,
        opacity: isActive ? 1 : 0,
        transition: 'all 160ms cubic-bezier(.7,0,.2,1.6)',
        fontSize: 34, color: '#fff', lineHeight: 1,
      }}>▸</div>

      {/* label */}
      <div className="relative z-[1] font-display italic" style={{
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
      <div className="absolute font-mono uppercase z-[2] whitespace-nowrap" style={{
        right: -8, top: '50%',
        transform: `translateY(-50%) translateX(${isActive ? 0 : 20}px)`,
        opacity: isActive ? 1 : 0,
        transition: 'all 180ms cubic-bezier(.7,0,.2,1)',
        fontSize: 11, letterSpacing: '0.22em',
        color: '#fff', background: '#0a1b3d', padding: '4px 10px',
        border: '1px solid #fff',
      }}>
        {item.sub}
      </div>
    </div>
  );
}

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

export function MainMenu({ onSelect }: { onSelect: (item: MenuItem) => void }) {
  const [mouseHovered, setMouseHovered] = useState<string | null>(null);
  const [keyIndex, setKeyIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setKeyIndex(i => {
          const next = i < MENU_ITEMS.length - 1 ? i + 1 : 0;
          setMouseHovered(null);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setKeyIndex(i => {
          const next = i > 0 ? i - 1 : MENU_ITEMS.length - 1;
          setMouseHovered(null);
          return next;
        });
      } else if (e.key === 'Enter') {
        const idx = keyIndex >= 0 ? keyIndex : MENU_ITEMS.findIndex(m => m.id === mouseHovered);
        if (idx >= 0) onSelect(MENU_ITEMS[idx]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [keyIndex, mouseHovered, onSelect]);

  // mouse hover clears keyboard selection
  function handleMouseHover(id: string | null) {
    setMouseHovered(id);
    if (id !== null) setKeyIndex(-1);
  }

  // active item: mouse wins over keyboard
  const activeId = mouseHovered ?? (keyIndex >= 0 ? MENU_ITEMS[keyIndex].id : null);
  const current = MENU_ITEMS.find(i => i.id === activeId) ?? null;

  return (
    <div ref={containerRef} className="absolute inset-0 z-[3]" tabIndex={-1}>
      <BackgroundField hue={(current?.hue as any) ?? 'blue'} />

      <EdgeText side="left" text="FRAGMENT·0426" color="#ffffff" />
      <EdgeText side="right" text="MAIN·MENU" color={current?.color ?? '#4fd6ff'} />

      <PortraitPlaceholder accent={current?.color ?? '#4fd6ff'} />

      <CornerBracket corner="tl">
        <HudBadge label="signal strength" value="◆ ◆ ◆ ◆ ◇" accent={current?.color ?? '#4fd6ff'} />
      </CornerBracket>

      <CornerBracket corner="tr">
        <div className="text-right font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', opacity: 0.7 }}>
          <div>K.VANCE / FRONTEND ENG</div>
          <div style={{ marginTop: 4, opacity: 0.55 }}>LOCAL TIME · <LiveClock /></div>
        </div>
      </CornerBracket>

      {/* menu stack */}
      <div className="absolute flex flex-col items-start z-[4]" style={{ right: '6%', top: '50%', transform: 'translateY(-50%)' }}>
        {/* MENU header with accent bar */}
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
            key={item.id}
            item={item}
            index={i}
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
