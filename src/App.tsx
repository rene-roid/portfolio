import React, { useEffect, useState } from 'react';
import { MENU_ITEMS } from './data';
import type { MenuItem, Route, TransitionPhase } from './types';
import { MainMenu } from './components/Menu';
import { Transition } from './components/Transitions';
import { AboutPage } from './components/pages/About';
import { WorkPage } from './components/pages/Work';
import { SkillsPage } from './components/pages/Skills';
import { WritingPage } from './components/pages/Writing';
import { LabPage } from './components/pages/Lab';
import { ContactPage } from './components/pages/Contact';

interface TransState {
  kind: string;
  color: string;
  phase: TransitionPhase;
}

const PAGES: Record<string, React.ComponentType<{ item: MenuItem; onBack: () => void }>> = {
  about:   AboutPage,
  work:    WorkPage,
  skills:  SkillsPage,
  writing: WritingPage,
  lab:     LabPage,
  contact: ContactPage,
};

export default function App() {
  const [route, setRoute] = useState<Route>(() => {
    try { return (localStorage.getItem('fragment:route') as Route) || 'menu'; } catch { return 'menu'; }
  });
  const [pending, setPending] = useState<Route | null>(null);
  const [trans, setTrans] = useState<TransState | null>(null);

  useEffect(() => {
    try { localStorage.setItem('fragment:route', route); } catch { /* */ }
  }, [route]);

  function go(target: Route) {
    if (pending) return;
    const item = target === 'menu'
      ? { transition: 'iris', color: '#4fd6ff' }
      : MENU_ITEMS.find(m => m.id === target)!;
    setPending(target);
    setTrans({ kind: target === 'menu' ? 'iris' : item.transition, color: item.color, phase: 'cover' });
  }

  function onCoverDone() {
    setRoute(pending!);
    setTrans(t => t ? { ...t, phase: 'reveal' } : null);
  }

  function onRevealDone() {
    setPending(null);
    setTrans(null);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && route !== 'menu' && !pending) go('menu');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [route, pending]);

  const currentItem = MENU_ITEMS.find(m => m.id === route);
  const PageComp = route !== 'menu' ? PAGES[route] : null;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#05102a', color: '#f3f7ff' }}>
      {route === 'menu' ? (
        <MainMenu onSelect={item => go(item.id as Route)} />
      ) : (
        PageComp && currentItem && (
          <PageComp item={currentItem} onBack={() => go('menu')} />
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
