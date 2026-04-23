import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from './data';
import type { MenuItem, TransitionPhase } from './types';
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

const PAGES: Record<string, React.ComponentType<{ item: MenuItem; onBack: () => void }>> = {
  about:      AboutPage,
  experience: ExperiencePage,
  skills:     SkillsPage,
  projects:   ProjectsPage,
  contact:    ContactPage,
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pending, setPending] = useState<string | null>(null);
  const [trans, setTrans] = useState<TransState | null>(null);

  const pathname = location.pathname;
  const routeId = pathname === '/' ? 'menu' : pathname.slice(1);
  const isMenu = pathname === '/';
  const currentItem = MENU_ITEMS.find(m => m.id === routeId) ?? null;
  const PageComp = !isMenu ? PAGES[routeId] : null;

  const go = useCallback((targetPath: string) => {
    if (pending) return;
    const targetId = targetPath === '/' ? 'menu' : targetPath.slice(1);
    const item = targetId === 'menu'
      ? { transition: 'iris', color: '#4fd6ff' }
      : MENU_ITEMS.find(m => m.id === targetId);
    if (!item) return;
    setPending(targetPath);
    setTrans({ kind: targetId === 'menu' ? 'iris' : item.transition, color: item.color, phase: 'cover' });
  }, [pending]);

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
          <PageComp item={currentItem} onBack={() => go('/')} />
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
