export type Hue = 'blue' | 'crimson' | 'violet' | 'teal' | 'amber' | 'ink';

export interface MenuItem {
  id: string;
  label: string;
  sub: string;
  color: string;
  hue: Hue;
  transition: string;
  command: string;
}

export type TransitionPhase = 'cover' | 'reveal';

export interface TransitionProps {
  color: string;
  phase: TransitionPhase;
  onDone: () => void;
}

export type Route = 'menu' | 'about' | 'work' | 'skills' | 'writing' | 'lab' | 'contact';

export interface PageProps {
  item: MenuItem;
  onBack: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}
