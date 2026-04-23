import type { PageProps } from '../types';
import { SKILL_GROUPS } from '../data';
import { PageShell } from '../components/PageShell';

export function SkillsPage({ item, onBack, onNext, onPrev }: PageProps) {
  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="flex flex-col h-full gap-6">
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            // skills.compile( )
          </div>
          <div className="font-display italic" style={{
            marginTop: 6,
            fontSize: 'clamp(56px, 7vw, 110px)', lineHeight: 0.9,
            letterSpacing: '-0.04em', transform: 'skewX(-6deg)',
          }}>
            STACK <span style={{ color: item.color }}>/</span> TOOLKIT
          </div>
        </div>

        <div className="grid gap-4 flex-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {SKILL_GROUPS.map(g => (
            <div key={g.name} className="flex flex-col" style={{
              border: '1px solid rgba(255,255,255,0.15)',
              borderTop: `4px solid ${g.color}`,
              padding: 18,
              background: 'rgba(10,20,50,0.45)',
            }}>
              <div className="font-display italic" style={{
                fontSize: 26, letterSpacing: '-0.02em', color: g.color,
                textShadow: '3px 3px 0 rgba(0,0,0,0.4)',
                transform: 'skewX(-8deg)',
              }}>{g.name}</div>

              <div className="flex-1 flex flex-col gap-2" style={{ marginTop: 18 }}>
                {g.items.map(([n, r]) => (
                  <div key={n} className="flex justify-between items-center" style={{
                    borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: 6,
                  }}>
                    <span className="font-body font-bold" style={{ fontSize: 14 }}>{n}</span>
                    <span className="font-mono" style={{
                      fontSize: 11, letterSpacing: '0.1em', color: g.color,
                      padding: '2px 8px', border: `1px solid ${g.color}`,
                    }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', opacity: 0.5 }}>
          rank · S+ master · S strong · A proficient · B familiar
        </div>
      </div>
    </PageShell>
  );
}
