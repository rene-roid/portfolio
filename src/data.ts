import type { MenuItem } from './types';

// flip to true when projects are ready to show
export const PROJECTS_LIVE = false;

export const MENU_ITEMS: MenuItem[] = [
  { id: 'about',   label: 'ABOUT ME',   sub: 'The Developer',   color: '#ff3b8a', hue: 'crimson', transition: 'slash',  command: 'PROFILE' },
  { id: 'experience', label: 'EXPERIENCE', sub: 'The Résumé',     color: '#a56bff', hue: 'violet',  transition: 'bars',   command: 'EXPERIENCE' },
  { id: 'projects',    label: 'PROJECTS',    sub: 'Projects',        color: '#4fd6ff', hue: 'teal',    transition: 'bars',   command: 'Browse Projects' },
  { id: 'skills',  label: 'SKILLS',  sub: 'Stack & Toolkit', color: '#ffd23f', hue: 'amber',   transition: 'stripe', command: 'Skills' },
  { id: 'contact', label: 'CONTACT', sub: 'Send a Signal',   color: '#ff7a3a', hue: 'crimson', transition: 'slash',  command: 'CONTACT' },
];

export type ProjectBodyBlock =
  | { kind: 'h'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'img'; label: string; accent?: string };

export interface ProjectLink {
  l: string;
  u: string;
}

export interface ProjectCategory {
  id: string;
  label: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  cat: string;
  accent: string;
  year: string;
  role: string;
  tag: string;
  summary: string;
  stack: string[];
  links: ProjectLink[];
  body?: ProjectBodyBlock[];
  mdFile?: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'all',  label: 'ALL',         color: '#ffffff' },
  { id: 'apps', label: 'WEB APPS',    color: '#4fd6ff' },
  { id: 'game', label: 'GAMES',       color: '#ff3b8a' },
  { id: 'tool', label: 'TOOLS',       color: '#ffd23f' },
  { id: 'exp',  label: 'EXPERIMENTS', color: '#a56bff' },
  { id: 'oss',  label: 'OPEN SOURCE', color: '#c6ff3d' },
];

export const PROJECTS: Project[] = [
  {
    id: 'rhythm-game',
    name: 'RHYTHM GAME',
    cat: 'game',
    accent: '#ff3b8a',
    year: '2023',
    role: 'Personal',
    tag: 'Game development',
    summary: 'A rhythm runner game built in Unity & C# for a school game jam. Avoid obstacles in sync with the beat.',
    stack: ['Unity', 'C#', 'FMOD'],
    links: [{ l: 'Repository', u: 'https://github.com/...' }],
    mdFile: 'rhythm-game.md',
  },
  {
    id: 'project-02',
    name: 'PROJECT 02',
    cat: 'apps',
    accent: '#4fd6ff',
    year: '2024',
    role: 'Frontend',
    tag: 'Web application',
    summary: 'TODO — add project description, tech stack, and link.',
    stack: ['React', 'TypeScript'],
    links: [],
    body: [
      { kind: 'h', text: 'Overview' },
      { kind: 'p', text: 'TODO — add project description.' },
    ],
  },
  {
    id: 'project-03',
    name: 'PROJECT 03',
    cat: 'tool',
    accent: '#ffd23f',
    year: '2024',
    role: 'Solo',
    tag: 'Developer tool',
    summary: 'TODO — add project description, tech stack, and link.',
    stack: ['Node.js', 'TypeScript'],
    links: [],
    body: [
      { kind: 'h', text: 'Overview' },
      { kind: 'p', text: 'TODO — add project description.' },
    ],
  },
  {
    id: 'side-project',
    name: 'SIDE PROJECT',
    cat: 'exp',
    accent: '#a56bff',
    year: '2025',
    role: 'Personal',
    tag: 'Experiment',
    summary: 'TODO — add project description, tech stack, and link.',
    stack: ['WebGL', 'GLSL'],
    links: [],
    body: [
      { kind: 'h', text: 'Overview' },
      { kind: 'p', text: 'TODO — add project description.' },
    ],
  },
];

export const EXPERIENCE = {
  jobs: [
    {
      role: 'Full Stack Developer',
      company: 'Forvis Mazars',
      start: '2023-01',
      end: null, // current
      desc: 'Building custom client-facing web applications from scratch. Owning the full product cycle: frontend (React, Next.js, TypeScript) and backend (Node.js, C#).',
      accent: '#c6ff3d',
      coding: true,
      url: "https://www.linkedin.com/company/forvismazars/",
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
  {
    name: 'FRONTEND',
    color: '#ffd23f',
    items: [['React', 'daily driver'], ['Next.js', '3 prod apps'], ['TypeScript', 'strict always'], ['CSS / Tailwind', 'built this site']]
  },
  {
    name: 'BACKEND',
    color: '#4fd6ff',
    items: [['Node.js / Express', 'REST at Forvis Mazars'], ['C# / .NET', 'Unity + backend'], ['FastAPI', 'Python APIs'], ['Django', 'ORM fluent']]
  },
  {
    name: 'DATA',
    color: '#ff3b8a',
    items: [['SQL', 'write it daily'], ['MySQL / MariaDB', "Forvis Mazars' DB"], ['PostgreSQL', 'side projects'], ['Database Design', 'schema-first']]
  },
  {
    name: 'GAME DEV',
    color: '#a56bff',
    items: [['Unity', 'VR / AR titles'], ['C# (Game)', 'custom physics'], ['Java', 'uni + hobby'], ['Game Architecture', 'ECS patterns']]
  },
  {name: 'INFRA', color: '#c6ff3d', items: [['Git', 'rebase > merge'], ['CI/CD', 'GH Actions'], ['DevOps', 'Docker + cloud'], ['Agile', 'sprint daily']]},
];

export const POSTS = [
  {
    d: '2026·03·14',
    t: 'The interface is the protocol',
    sum: 'Why tiny UI decisions become load-bearing infrastructure.',
    len: '9 min'
  },
  {
    d: '2026·02·02',
    t: 'Motion with a budget',
    sum: 'Designing transitions that still feel alive under CPU pressure.',
    len: '7 min'
  },
  {
    d: '2025·11·29',
    t: 'Typography as state management',
    sum: 'What monospace taught me about systems thinking.',
    len: '6 min'
  },
  {
    d: '2025·09·18',
    t: 'Rewriting a runtime in six weeks',
    sum: 'A postmortem on shipping the Lumen web client.',
    len: '14 min'
  },
  {
    d: '2025·07·01',
    t: 'Small tools, long shadows',
    sum: 'On the unreasonable leverage of a good keybinding.',
    len: '5 min'
  },
];

export const LABS = [
  {t: 'CRT SHADER', c: '#a56bff'},
  {t: 'PEN PLOTTER', c: '#4fd6ff'},
  {t: 'MARCHING SQUARES', c: '#ffd23f'},
  {t: 'FLOW FIELDS', c: '#c6ff3d'},
  {t: 'TYPE DEFORM', c: '#ff3b8a'},
  {t: 'PIXEL SORT', c: '#ff7a3a'},
];
