import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from './data';
import type { MenuItem, PageProps, TransitionPhase } from './types';
import { MainMenu } from './components/Menu';
import { Transition } from './components/Transitions';
import { AboutPage } from './pages/About';
import { ExperiencePage } from './pages/Experience';
import { SkillsPage } from './pages/Skills';
import { ProjectsPage } from './pages/Projects';
import { ContactPage } from './pages/Contact';

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
  const wheelLock = useRef(false);

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

  // Wheel → page scroll navigation
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (wheelLock.current || pending) return;
      if (Math.abs(e.deltaY) < 20) return;
      wheelLock.current = true;
      setTimeout(() => { wheelLock.current = false; }, 900);
      if (e.deltaY > 0) goNext();
      else goPrev();
    }
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [goNext, goPrev, pending]);

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
    </div>
  );
}
