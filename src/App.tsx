import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from './data';
import type { PageProps, TransitionPhase } from './types';
import { MainMenu } from './components/Menu';
import { Transition } from './components/Transitions';
import { audioPlayer } from './audioPlayer';
import { AboutPage } from './pages/About';
import { ExperiencePage } from './pages/Experience';
import { SkillsPage } from './pages/Skills';
import { ProjectsPage } from './pages/Projects';
import { ContactPage } from './pages/Contact';

function ScrollHint({ canScroll, color, hidden }: {
  canScroll: boolean;
  color: string;
  hidden: boolean;
}) {
  const show = canScroll && !hidden;
  return (
    <div style={{
      position: 'fixed',
      bottom: 28,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      opacity: show ? 1 : 0,
      transition: 'opacity 350ms ease',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    }}>
      <div style={{
        width: 18,
        height: 28,
        border: `1.5px solid ${color}66`,
        borderRadius: 9,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 5,
          right: '43%',
          transform: 'translateX(-50%)',
          width: 3,
          height: 7,
          background: color,
          borderRadius: 2,
          animation: 'scroll-dot 7s ease-in-out infinite',
        }} />
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 8,
        letterSpacing: '0.22em',
        color,
        opacity: 0.5,
        textTransform: 'uppercase',
      }}>
        SCROLL
      </div>
    </div>
  );
}

function ScrollChargeBar({ charge, visible, color, dir, discharging }: {
  charge: number;
  visible: boolean;
  color: string;
  dir: 'next' | 'prev';
  discharging: boolean;
}) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 200,
      opacity: visible ? 1 : 0,
      transition: 'opacity 300ms ease',
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 7,
    }}>
      <div style={{
        fontFamily: 'monospace',
        fontSize: 9,
        letterSpacing: '0.22em',
        color,
        opacity: 0.85,
        textTransform: 'uppercase',
      }}>
        {dir === 'next' ? '▼ NEXT' : '▲ PREV'}
      </div>
      <div style={{
        width: 180,
        height: 2,
        background: 'rgba(255,255,255,0.10)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${charge * 100}%`,
          background: color,
          boxShadow: `0 0 10px 2px ${color}88`,
          borderRadius: 2,
          transition: discharging
            ? 'width 500ms cubic-bezier(.9,0,.1,1)'
            : 'width 60ms linear',
        }} />
      </div>
    </div>
  );
}

interface TransState {
  kind: string;
  color: string;
  phase: TransitionPhase;
}

const PAGES: Record<string, React.ComponentType<PageProps>> = {
  about:      AboutPage,
  experience: ExperiencePage,
  skills:     SkillsPage,
  projects:   ProjectsPage,
  contact:    ContactPage,
};

const NAV_ORDER = ['menu', 'about', 'experience', 'projects', 'skills', 'contact'];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState<string | null>(null);
  const [trans, setTrans] = useState<TransState | null>(null);

  const [barCharge, setBarCharge] = useState(0);
  const [barVisible, setBarVisible] = useState(false);
  const [barDir, setBarDir] = useState<'next' | 'prev'>('next');
  const [barDischarging, setBarDischarging] = useState(false);

  const chargeAccum = useRef(0);
  const chargeDir = useRef<'next' | 'prev'>('next');
  const decayTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fadeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const navIndexRef = useRef(0);
  const pendingRef = useRef<string | null>(null);

  const CHARGE_THRESHOLD = 620;

  useEffect(() => { audioPlayer.init(); }, []);

  const pathname = location.pathname;
  const routeId = pathname === '/' ? 'menu' : pathname.slice(1);
  const isMenu = pathname === '/';
  const currentItem = MENU_ITEMS.find(m => m.id === routeId) ?? null;
  const PageComp = !isMenu ? PAGES[routeId] : null;

  const go = useCallback((targetPath: string) => {
    if (pending) return;
    const targetId = targetPath === '/' ? 'menu' : targetPath.slice(1);
    const item = targetId === 'menu'
      ? { transition: 'veil', color: '#4fd6ff' }
      : MENU_ITEMS.find(m => m.id === targetId);
    if (!item) return;
    setPending(targetPath);
    setTrans({ kind: targetId === 'menu' ? 'veil' : item.transition, color: item.color, phase: 'cover' });
  }, [pending]);

  const navIndex = NAV_ORDER.indexOf(routeId);

  useEffect(() => { navIndexRef.current = navIndex; }, [navIndex]);
  useEffect(() => { pendingRef.current = pending; }, [pending]);

  const goNext = useCallback(() => {
    if (navIndex < NAV_ORDER.length - 1) {
      const id = NAV_ORDER[navIndex + 1];
      go(id === 'menu' ? '/' : `/${id}`);
    }
  }, [navIndex, go]);

  const goPrev = useCallback(() => {
    if (navIndex > 0) {
      const id = NAV_ORDER[navIndex - 1];
      go(id === 'menu' ? '/' : `/${id}`);
    }
  }, [navIndex, go]);

  // Wheel → charge bar → navigate
  useEffect(() => {
    function discharge() {
      setBarDischarging(true);
      setBarCharge(0);
      clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setBarVisible(false), 550);
    }

    function onWheel(e: WheelEvent) {
      if (pendingRef.current) return;
      if (Math.abs(e.deltaY) < 5) return;

      const dir: 'next' | 'prev' = e.deltaY > 0 ? 'next' : 'prev';
      const idx = navIndexRef.current;

      if (dir === 'next' && idx >= NAV_ORDER.length - 1) return;
      if (dir === 'prev' && idx <= 0) return;

      // direction flip → reset
      if (dir !== chargeDir.current) {
        chargeAccum.current = 0;
        chargeDir.current = dir;
      }

      clearTimeout(decayTimer.current);
      clearTimeout(fadeTimer.current);

      chargeAccum.current = Math.min(chargeAccum.current + Math.abs(e.deltaY), CHARGE_THRESHOLD);
      const ratio = chargeAccum.current / CHARGE_THRESHOLD;

      setBarDir(dir);
      setBarDischarging(false);
      setBarCharge(ratio);
      setBarVisible(true);

      if (chargeAccum.current >= CHARGE_THRESHOLD) {
        chargeAccum.current = 0;
        setBarCharge(0);
        setTimeout(() => setBarVisible(false), 120);
        if (dir === 'next') goNext();
        else goPrev();
        return;
      }

      decayTimer.current = setTimeout(discharge, 600);
    }

    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      clearTimeout(decayTimer.current);
      clearTimeout(fadeTimer.current);
    };
  }, [goNext, goPrev]);

  function onCoverDone() {
    navigate(pending!);
    setTrans(t => t ? { ...t, phase: 'reveal' } : null);
  }

  function onRevealDone() {
    setPending(null);
    setTrans(null);
  }

  // ESC → back to menu
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !isMenu && !pending) go('/');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, isMenu, pending]);

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#05102a', color: '#f3f7ff' }}>
      {isMenu ? (
        <MainMenu onSelect={item => go(`/${item.id}`)} />
      ) : (
        PageComp && currentItem && (
          <PageComp
            item={currentItem}
            onBack={() => go('/')}
            onNext={navIndex < NAV_ORDER.length - 1 ? goNext : undefined}
            onPrev={navIndex > 0 ? goPrev : undefined}
          />
        )
      )}

      {trans && (
        <Transition
          key={`${trans.phase}-${pending}`}
          kind={trans.kind}
          color={trans.color}
          phase={trans.phase}
          onDone={trans.phase === 'cover' ? onCoverDone : onRevealDone}
        />
      )}

      <ScrollHint
        canScroll={navIndex > 0 || navIndex < NAV_ORDER.length - 1}
        color={(currentItem?.color) ?? '#4fd6ff'}
        hidden={barVisible}
      />

      <ScrollChargeBar
        charge={barCharge}
        visible={barVisible}
        color={(currentItem?.color) ?? '#4fd6ff'}
        dir={barDir}
        discharging={barDischarging}
      />
    </div>
  );
}
