# Portfolio — Agent Instructions

## Commands

```bash
npm run dev       # Vite dev server (HMR)
npm run build     # tsc + vite build
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite. ESLint is the only QA layer — run `npm run lint` after changes.

## Stack

- React 19 + TypeScript + Vite 8
- React Router 7 (SPA routing)
- Tailwind CSS 4 + inline styles for dynamic values
- Zustand (audio/isolated state)
- No backend, no API — all data is static in `src/data.ts`

## Architecture

```
src/
├── App.tsx          # Root router + desktop/mobile layout switch
├── pages/           # *Page.tsx — one file per section
├── components/      # Shared: PageShell, Menu, Transitions, HUD, Reveal
├── hooks/           # useMediaQuery (responsive breakpoint detection)
├── data.ts          # All static content: MENU_ITEMS, PROJECTS, EXPERIENCE, SKILL_GROUPS
├── types.ts         # Shared TypeScript interfaces (PageProps, etc.)
├── utils.ts         # Helpers
└── content/         # Markdown files for project descriptions
```

## Key Conventions

**Pages** accept `PageProps` (`item, onBack, onNext, onPrev`) and wrap in `<PageShell>`.

**Naming**: `[Name]Page.tsx` for pages, PascalCase for components.

**Styling**: Tailwind for static styles; `style={{}}` inline for dynamic values (colors, animation timing). Color scheme uses named hues (crimson, teal, amber, violet) mapped to hex in `data.ts`.

**Navigation**: Desktop uses wheel-charge system (`CHARGE_THRESHOLD = 420`) to trigger page transitions. Mobile uses `MobileLayout` with scroll-based nav. Always test both — `useMediaQuery` hook drives the switch in `App.tsx`.

**Transitions**: Phase-based cover/reveal overlay system in `Transitions.tsx`. Page changes go through phases — don't bypass with direct state mutations.

**Animations**: `<Reveal>` component handles staggered entrance animations. Accepts `delay`, `direction`, `distance` props.

**Adding a page**: Add entry to `MENU_ITEMS` in `data.ts`, create `src/pages/[Name]Page.tsx` using `PageProps`, register route in `App.tsx`.

## Pitfalls

- Inline `style` and Tailwind coexist — check both when debugging layout/color issues.
- Animation constants are scattered; central ones are in `data.ts` but some are hardcoded in components.
- Mobile layout is a separate component (`MobileLayout`) — changes to desktop nav don't apply automatically.
