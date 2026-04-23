import { useState } from 'react';
import type { MenuItem } from '../types';
import { LABS } from '../data';
import { PageShell } from '../components/PageShell';

export function LabPage({ item, onBack }: { item: MenuItem; onBack: () => void }) {
  const [hov, setHov] = useState<number | null>(null);

  return (
    <PageShell item={item} onBack={onBack}>
      <div className="flex flex-col h-full gap-6">
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            // lab.enter( )
          </div>
          <h1 className="font-display italic" style={{
            marginTop: 6,
            fontSize: 'clamp(60px, 8vw, 120px)', lineHeight: 0.85,
            letterSpacing: '-0.04em', color: '#fff',
            textShadow: `6px 6px 0 ${item.color}`,
            transform: 'skewX(-6deg)',
          }}>THE LABORATORY</h1>
          <p className="font-body" style={{ marginTop: 8, opacity: 0.7, maxWidth: 600, fontSize: 15, lineHeight: 1.5 }}>
            Sketches, shader toys, and half-finished weekend builds. Nothing here is a product — but some of it
            ends up in one eventually.
          </p>
        </div>

        <div className="grid flex-1 gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' }}>
          {LABS.map((l, i) => (
            <div
              key={l.t}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              className="relative overflow-hidden cursor-pointer"
              style={{
                border: `1px solid ${l.c}55`,
                background: `linear-gradient(${45 + i * 30}deg, ${l.c}22, #0a1b3dcc)`,
                transform: hov === i ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 160ms cubic-bezier(.7,0,.2,1.6)',
              }}
            >
              <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.28 }}>
                <defs>
                  <pattern id={`lab${i}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform={`rotate(${30 + i * 15})`}>
                    <line x1="0" y1="0" x2="0" y2="14" stroke={l.c} strokeWidth="2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#lab${i})`} />
              </svg>
              <div className="absolute font-mono uppercase" style={{ left: 16, top: 14, fontSize: 10, letterSpacing: '0.28em', color: l.c }}>
                EXP · {String(i + 1).padStart(3, '0')}
              </div>
              <div className="absolute font-display italic" style={{
                left: 16, bottom: 16, right: 16,
                fontSize: 'clamp(22px, 2.4vw, 36px)', lineHeight: 0.95,
                letterSpacing: '-0.02em', color: '#fff',
                textShadow: `3px 3px 0 ${l.c}99`,
                transform: 'skewX(-8deg)',
              }}>{l.t}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
