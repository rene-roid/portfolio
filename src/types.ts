export interface MenuItem {
  id: string;
  label: string;
  sub: string;
  color: string;
  hue: string;
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
