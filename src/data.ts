import type { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'about',   label: 'ABOUT',   sub: 'The Developer',   color: '#ff3b8a', hue: 'crimson', transition: 'slash',  command: 'Read Profile' },
  { id: 'work',    label: 'WORK',    sub: 'Case Studies',    color: '#4fd6ff', hue: 'teal',    transition: 'bars',   command: 'Browse Work' },
  { id: 'skills',  label: 'SKILLS',  sub: 'Stack & Toolkit', color: '#ffd23f', hue: 'amber',   transition: 'glitch', command: 'Read Skills' },
  { id: 'writing', label: 'WRITING', sub: 'Notes & Essays',  color: '#c6ff3d', hue: 'teal',    transition: 'stripe', command: 'Open Notes' },
  { id: 'lab',     label: 'LAB',     sub: 'Experiments',     color: '#a56bff', hue: 'violet',  transition: 'iris',   command: 'Enter Lab' },
  { id: 'contact', label: 'CONTACT', sub: 'Send a Signal',   color: '#ff7a3a', hue: 'crimson', transition: 'slash',  command: 'Open Channel' },
];

export const WORKS = [
  { name: 'NORTHSTAR',  role: 'Lead FE · 2025',       tag: 'Trading dashboard', accent: '#4fd6ff', desc: 'Realtime market grid · 50k rows · 60fps.' },
  { name: 'PALINDROME', role: 'Design eng · 2024',    tag: 'Writing tool',      accent: '#ff3b8a', desc: 'Collaborative prose editor for long-form writers.' },
  { name: 'HEXAGRAM',   role: 'Contract · 2024',      tag: 'Brand site',        accent: '#ffd23f', desc: 'WebGL-driven launch site for an AI infra startup.' },
  { name: 'TIDEPOOL',   role: 'FE · 2023',            tag: 'Oceanography',      accent: '#c6ff3d', desc: 'Interactive data viz for climate research nonprofit.' },
  { name: 'ROOMTONE',   role: 'Founding eng · 2023',  tag: 'Audio studio',      accent: '#a56bff', desc: 'Browser-based multitrack editor + live collab.' },
  { name: 'OVERTURE',   role: 'FE · 2022',            tag: 'Concert hall',      accent: '#ff7a3a', desc: 'Season ticketing + seat picker with motion-first UX.' },
];

export const SKILL_GROUPS = [
  { name: 'CORE',     color: '#ffd23f', items: [['TypeScript', 'S+'], ['React', 'S'], ['Next.js', 'A'], ['CSS Architecture', 'S+']] },
  { name: 'MOTION',   color: '#ff3b8a', items: [['Framer Motion', 'S'], ['GSAP', 'A'], ['Web Animations', 'S'], ['Lottie', 'B']] },
  { name: 'GRAPHICS', color: '#4fd6ff', items: [['WebGL', 'A'], ['GLSL', 'B+'], ['Canvas 2D', 'S'], ['SVG', 'S+']] },
  { name: 'INFRA',    color: '#c6ff3d', items: [['Vite', 'S'], ['Turborepo', 'A'], ['CI/CD', 'A'], ['Testing', 'S']] },
  { name: 'DESIGN',   color: '#a56bff', items: [['Figma', 'S'], ['Design Tokens', 'S+'], ['Prototyping', 'S'], ['Typography', 'A']] },
];

export const POSTS = [
  { d: '2026·03·14', t: 'The interface is the protocol',    sum: 'Why tiny UI decisions become load-bearing infrastructure.',   len: '9 min' },
  { d: '2026·02·02', t: 'Motion with a budget',             sum: 'Designing transitions that still feel alive under CPU pressure.', len: '7 min' },
  { d: '2025·11·29', t: 'Typography as state management',   sum: 'What monospace taught me about systems thinking.',            len: '6 min' },
  { d: '2025·09·18', t: 'Rewriting a runtime in six weeks', sum: 'A postmortem on shipping the Lumen web client.',              len: '14 min' },
  { d: '2025·07·01', t: 'Small tools, long shadows',        sum: 'On the unreasonable leverage of a good keybinding.',          len: '5 min' },
];

export const LABS = [
  { t: 'CRT SHADER',       c: '#a56bff' },
  { t: 'PEN PLOTTER',      c: '#4fd6ff' },
  { t: 'MARCHING SQUARES', c: '#ffd23f' },
  { t: 'FLOW FIELDS',      c: '#c6ff3d' },
  { t: 'TYPE DEFORM',      c: '#ff3b8a' },
  { t: 'PIXEL SORT',       c: '#ff7a3a' },
];
