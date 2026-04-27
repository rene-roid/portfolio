import type { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'about',   label: 'ABOUT ME',   sub: 'The Developer',   color: '#ff3b8a', hue: 'crimson', transition: 'slash',  command: 'Read Profile' },
  { id: 'experience', label: 'EXPERIENCE', sub: 'The Résumé',     color: '#a56bff', hue: 'violet',  transition: 'bars',   command: 'Browse Résumé' },
  { id: 'projects',    label: 'PROJECTS',    sub: 'Projects',        color: '#4fd6ff', hue: 'teal',    transition: 'bars',   command: 'Browse Projects' },
  { id: 'skills',  label: 'SKILLS',  sub: 'Stack & Toolkit', color: '#ffd23f', hue: 'amber',   transition: 'stripe', command: 'Read Skills' },
  { id: 'contact', label: 'CONTACT', sub: 'Send a Signal',   color: '#ff7a3a', hue: 'crimson', transition: 'slash',  command: 'Open Channel' },
];

export const PROJECTS = [
  { name: 'PROJECT 01', role: 'Full Stack · 2024', tag: 'Game development',    accent: '#4fd6ff', desc: 'TODO — add project description, tech stack, and link.' },
  { name: 'PROJECT 02', role: 'Frontend · 2024',   tag: 'Web application',   accent: '#ff3b8a', desc: 'TODO — add project description, tech stack, and link.' },
  { name: 'PROJECT 03', role: 'Frontend · 2023',   tag: 'Web application',   accent: '#ffd23f', desc: 'TODO — add project description, tech stack, and link.' },
  { name: 'SIDE PROJECT', role: 'Personal · 2024', tag: 'Side project',      accent: '#c6ff3d', desc: 'TODO — add project description, tech stack, and link.' },
];

export const EXPERIENCE = {
  jobs: [
    {
      role: 'Full Stack Developer',
      company: 'INFINI',
      start: '2023-01',
      end: null, // current
      desc: 'Building custom client-facing web applications from scratch. Owning the full product cycle: frontend (React, Next.js, TypeScript) and backend (Node.js, C#).',
      accent: '#c6ff3d',
      coding: true,
      url: "https://www.linkedin.com/company/infiniai/",
    },
    {
      role: 'Game Dev Intern',
      company: 'Tetravol',
      start: '2022-10',
      end: '2023-03',
      desc: 'Developed virtual and augmented reality games in Unity/C#. Contributed in web based game development and educational games for institutions.',
      accent: '#ff4141',
      coding: true,
      url: "https://www.linkedin.com/company/tetravol/"
    },
    {
      role: 'IT Support Technician',
      company: 'Reset Soluciones',
      start: '2021-02',
      end: '2021-05',
      desc: 'Network setup, hardware maintenance, and end-user support across and more!.',
      accent: '#4fd6ff',
      coding: false,
      url: "https://www.linkedin.com/company/reset-soluciones-slu/"
    },
  ],
  education: [
    {
      title: 'CFGS DAM — Software Development for Applications and GameDev',
      institution: 'Campus Net',
      period: '2021 — 2023',
      start: '2021-09',
      end: '2023-06',
      accent: '#ff3b8a',
      coding: true,
    },
    {
      title: 'CFGM SMR — Microcomputer Systems & Networks',
      institution: 'Salesians Sarrià',
      period: '2019 — 2021',
      start: '2019-09',
      end: '2021-06',
      accent: '#cc0000',
      coding: false,
    },
  ],
};

export const SKILL_GROUPS = [
  { name: 'FRONTEND', color: '#ffd23f', items: [['React', 'S+'], ['Next.js', 'S+'], ['TypeScript', 'S+'], ['CSS / Tailwind', 'S']] },
  { name: 'BACKEND',  color: '#4fd6ff', items: [['Node.js / Express', 'A'], ['C# / .NET', 'B+'], ['FastAPI', 'B'], ['Django', 'B']] },
  { name: 'DATA',     color: '#ff3b8a', items: [['SQL', 'A'], ['MySQL / MariaDB', 'A'], ['PostgreSQL', 'B'], ['Database Design', 'A']] },
  { name: 'GAME DEV', color: '#a56bff', items: [['Unity', 'B+'], ['C# (Game)', 'B+'], ['Java', 'B'], ['Game Architecture', 'B']] },
  { name: 'INFRA',    color: '#c6ff3d', items: [['Git', 'S'], ['CI/CD', 'A'], ['DevOps', 'B'], ['Agile', 'A']] },
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
