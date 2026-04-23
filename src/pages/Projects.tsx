import { useState } from 'react';
import type { PageProps } from '../types';
import { PROJECTS } from '../data';
import { PageShell } from '../components/PageShell';

export function ProjectsPage({ item, onBack, onNext, onPrev }: PageProps) {
  const [focus, setFocus] = useState(0);
  const active = PROJECTS[focus];

  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="grid gap-10 h-full" style={{ gridTemplateColumns: '340px 1fr' }}>
        <div className="flex flex-col gap-1">
          <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6, marginBottom: 12 }}>
            {String(PROJECTS.length).padStart(2, '0')} ENTRIES
          </div>
          {PROJECTS.map((p, i) => (
            <div
              key={p.name}
              onMouseEnter={() => setFocus(i)}
              className="cursor-pointer flex items-baseline gap-2"
              style={{
                padding: '10px 14px',
                background: focus === i ? p.accent : 'transparent',
                color: focus === i ? '#0a1b3d' : '#fff',
                borderLeft: `3px solid ${p.accent}`,
                transform: `skewX(${focus === i ? -8 : 0}deg) translateX(${focus === i ? 10 : 0}px)`,
                transition: 'all 140ms cubic-bezier(.7,0,.2,1.6)',
              }}
            >
              <span className="font-mono" style={{ fontSize: 11, opacity: 0.7 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-display italic" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{p.name}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="font-display italic" style={{
            fontSize: 'clamp(80px, 10vw, 160px)', lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: 'transparent', WebkitTextStroke: `2px ${active.accent}`,
            transform: 'skewX(-6deg)',
          }}>{active.name}</div>

          <div className="font-mono uppercase" style={{
            marginTop: 6, fontSize: 12, letterSpacing: '0.28em', color: active.accent,
          }}>
            {active.role} &nbsp;·&nbsp; {active.tag}
          </div>

          <div className="relative overflow-hidden" style={{
            marginTop: 26, height: '42%',
            background: `linear-gradient(135deg, ${active.accent}33, #0a1b3d)`,
            border: `1px solid ${active.accent}`,
          }}>
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.2 }}>
              <defs>
                <pattern id="proj-stripes" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                  <line x1="0" y1="0" x2="0" y2="20" stroke={active.accent} strokeWidth="4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#proj-stripes)" />
            </svg>
            <div className="absolute font-mono uppercase" style={{ left: 24, top: 20, fontSize: 10, letterSpacing: '0.28em', color: '#fff', opacity: 0.7 }}>
              [ PROJECT HERO · PLACEHOLDER ]
            </div>
            <div className="absolute font-display italic" style={{
              right: 24, bottom: 20,
              fontSize: 48, color: '#fff', opacity: 0.9,
              textShadow: `4px 4px 0 ${active.accent}`, letterSpacing: '-0.02em',
            }}>{active.name}</div>
          </div>

          <div className="grid gap-4 items-start" style={{ marginTop: 18, gridTemplateColumns: '1fr 1fr' }}>
            <p className="font-body" style={{ fontSize: 16, lineHeight: 1.55, color: '#d9e6ff' }}>
              {active.desc}
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              {['Case study', 'Live site', 'Repository'].map(l => (
                <span key={l} className="font-mono uppercase cursor-pointer" style={{
                  fontSize: 10, letterSpacing: '0.2em', padding: '6px 10px',
                  border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
                }}>→ {l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
