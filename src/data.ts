import type {MenuItem} from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'about',
    label: 'ABOUT ME',
    sub: 'The Developer',
    color: '#ff3b8a',
    hue: 'crimson',
    transition: 'slash',
    command: 'Read Profile'
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    sub: 'The Résumé',
    color: '#a56bff',
    hue: 'violet',
    transition: 'bars',
    command: 'Browse Résumé'
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    sub: 'Projects',
    color: '#4fd6ff',
    hue: 'teal',
    transition: 'bars',
    command: 'Browse Projects'
  },
  {
    id: 'skills',
    label: 'SKILLS',
    sub: 'Stack & Toolkit',
    color: '#ffd23f',
    hue: 'amber',
    transition: 'stripe',
    command: 'Read Skills'
  },
  {
    id: 'contact',
    label: 'CONTACT',
    sub: 'Send a Signal',
    color: '#ff7a3a',
    hue: 'crimson',
    transition: 'slash',
    command: 'Open Channel'
  },
];

export type ProjectBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src: string; caption?: string };

export interface Project {
  name: string;
  role: string;
  year: string;
  tag: string;
  accent: string;
  desc: string;
  /** Rich content displayed in the hero/detail area */
  content?: ProjectBlock[];
  links?: { label: string; url: string }[];
}

export const PROJECTS: Project[] = [
  {
    name: 'Rythm Game',
    role: 'Personal',
    year: '2023',
    tag: 'Game development',
    accent: '#4fd6ff',
    desc: 'A rhythm runner game built in Unity & C# for a school game jam.',
    content: [
      {
        type: 'paragraph',
        text: 'This is a rhythm runner game created using Unity and C# for a game jam held at my school in 2022. The game challenges the player to avoid obstacles by dodging left, right, or jumping — all in sync with the beat.'
      },
      {type: 'image', src: '/public/projects/dio_fight.gif'},
      {
        type: 'paragraph',
        text: 'The project pushed me to learn real-time audio synchronisation, procedural obstacle generation, and rapid prototyping under a 48-hour deadline.'
      },
    ],
    links: [
      {label: 'Repository', url: 'https://github.com/...'},
    ],
  },
  {
    name: '1234567890123',
    role: 'Frontend',
    year: '0999',
    tag: 'Web application',
    accent: '#ff3b8a',
    desc: 'TODO — add project description, tech stack, and link.',
    content: [
      {
        type: 'paragraph',
        text: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dignissim euismod finibus. Sed laoreet commodo ex a volutpat. Sed quis volutpat tortor. Aliquam aliquam tincidunt diam, congue facilisis nisl imperdiet eget. Nullam porta dui vitae purus faucibus, in egestas enim euismod. Cras ultricies turpis id nisl placerat iaculis. Vestibulum ut scelerisque ante, id feugiat odio. Pellentesque est velit, interdum in tristique sit amet, fringilla a justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris mollis justo metus, gravida congue lectus blandit eget. Phasellus eget felis mattis, convallis erat eget, tristique arcu. Quisque eu mi dapibus neque pharetra hendrerit nec at erat. Nunc pretium turpis id ligula placerat mollis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Interdum et malesuada fames ac ante ipsum primis in faucibus.\n' +
          '\n' +
          'Phasellus id nibh nisl. Vestibulum auctor mollis eros eget placerat. Vivamus congue velit sed sem eleifend interdum. Aliquam feugiat erat at quam vulputate vehicula. Sed laoreet in tortor nec luctus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam placerat iaculis libero, nec maximus ipsum.\n' +
          '\n' +
          'Vivamus nec libero sed arcu mollis vestibulum eget sed dolor. Nulla ut velit sed sapien aliquet gravida ac eget ipsum. Fusce aliquet elit sem, in efficitur diam euismod in. Maecenas eu mauris et tellus varius tincidunt sed nec risus. Duis nisi augue, ultricies ac tincidunt id, mollis a eros. Quisque id porta felis. Proin eget feugiat orci, quis euismod risus. Mauris at sollicitudin urna. Donec elementum eu ligula vitae finibus. Morbi vestibulum, massa ut viverra porta, metus urna facilisis magna, eget sagittis leo nunc id enim. In placerat magna odio, nec pretium ligula finibus vitae. Duis ultrices orci eros, et auctor odio bibendum a. Morbi vestibulum lobortis tempor.\n' +
          '\n' +
          'Duis maximus vulputate euismod. Sed nec dui tristique, vehicula arcu et, consectetur enim. Curabitur id sapien sagittis, iaculis mauris eu, gravida metus. Nulla tristique sem nec pulvinar fringilla. Nullam quis enim lobortis, blandit dui ut, posuere sem. Mauris quis finibus urna, a pharetra massa. Morbi pulvinar metus at ante posuere scelerisque. Morbi ultrices ex sed lobortis malesuada. Proin malesuada sem urna, eu rhoncus elit maximus at. Pellentesque rutrum lorem mollis justo eleifend, eu feugiat diam tempus. Donec sed est justo.\n' +
          '\n' +
          'Donec quis neque augue. Curabitur dapibus eleifend lorem vitae volutpat. Aliquam maximus nibh et urna dapibus aliquet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Praesent ultricies, nulla id euismod rhoncus, metus arcu pulvinar leo, vel porttitor ligula nibh et sem. Quisque congue nulla tempor, convallis ante non, viverra tellus. Sed dui magna, luctus non neque non, lacinia semper justo. Proin id massa eget arcu pretium ultricies vitae eget justo. Suspendisse fringilla, elit in hendrerit ultricies, risus augue auctor ipsum, aliquam scelerisque ante nunc quis est. Praesent id justo nibh. Nullam sed purus dolor. Phasellus feugiat est sed fringilla aliquam. Nullam et tempor orci, a efficitur nibh. Praesent molestie pulvinar sem luctus cursus. Sed eget diam sed massa vestibulum convallis. '
      },
      // { type: 'image', src: '/images/project2-hero.png', caption: 'Hero image' },
    ],
  },
  {
    name: 'PROJECT 03',
    role: 'Frontend',
    year: '0999',
    tag: 'Web application',
    accent: '#ffd23f',
    desc: 'TODO — add project description, tech stack, and link.',
    content: [
      {type: 'paragraph', text: 'TODO — add project description.'},
    ],
  },
  {
    name: 'SIDE PROJECT',
    role: 'Personal',
    year: '0999',
    tag: 'Side project',
    accent: '#c6ff3d',
    desc: 'TODO — add project description, tech stack, and link.',
    content: [
      {type: 'paragraph', text: 'TODO — add project description.'},
    ],
  },
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
  {
    name: 'FRONTEND',
    color: '#ffd23f',
    items: [['React', 'S+'], ['Next.js', 'S+'], ['TypeScript', 'S+'], ['CSS / Tailwind', 'S']]
  },
  {
    name: 'BACKEND',
    color: '#4fd6ff',
    items: [['Node.js / Express', 'A'], ['C# / .NET', 'B+'], ['FastAPI', 'B'], ['Django', 'B']]
  },
  {
    name: 'DATA',
    color: '#ff3b8a',
    items: [['SQL', 'A'], ['MySQL / MariaDB', 'A'], ['PostgreSQL', 'B'], ['Database Design', 'A']]
  },
  {
    name: 'GAME DEV',
    color: '#a56bff',
    items: [['Unity', 'B+'], ['C# (Game)', 'B+'], ['Java', 'B'], ['Game Architecture', 'B']]
  },
  {name: 'INFRA', color: '#c6ff3d', items: [['Git', 'S'], ['CI/CD', 'A'], ['DevOps', 'B'], ['Agile', 'A']]},
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
