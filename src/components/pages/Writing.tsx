import type { MenuItem } from '../../types';
import { POSTS } from '../../data';
import { PageShell } from '../PageShell';

export function WritingPage({ item, onBack }: { item: MenuItem; onBack: () => void }) {
  return (
    <PageShell item={item} onBack={onBack}>
      <div className="grid gap-10 h-full" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            // notes.open( )
          </div>
          <h1 className="font-display italic" style={{
            marginTop: 10,
            fontSize: 'clamp(72px, 9vw, 140px)', lineHeight: 0.85,
            letterSpacing: '-0.04em', color: '#fff',
            transform: 'skewX(-8deg)',
          }}>
            WRI<span style={{ color: item.color }}>TING</span>
          </h1>
          <p className="font-body" style={{ marginTop: 18, opacity: 0.7, maxWidth: 300, lineHeight: 1.55 }}>
            Short essays about design, engineering, and the seams between them.
            Updated a handful of times a year.
          </p>
          <div className="font-display italic inline-block cursor-pointer" style={{
            marginTop: 24,
            padding: '10px 16px', background: item.color, color: '#0a1b3d',
            letterSpacing: '-0.01em', transform: 'skewX(-10deg)',
          }}>
            RSS · ATOM · JSON FEED
          </div>
        </div>

        <div className="flex flex-col gap-2 overflow-auto">
          {POSTS.map((p, i) => (
            <div
              key={i}
              className="grid cursor-pointer"
              style={{
                gridTemplateColumns: '120px 1fr auto', gap: 20,
                padding: '16px 18px',
                background: 'rgba(10,20,50,0.45)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderLeft: `3px solid ${item.color}`,
                transition: 'transform 120ms',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(8px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; }}
            >
              <div className="font-mono" style={{ fontSize: 11, letterSpacing: '0.16em', opacity: 0.6 }}>{p.d}</div>
              <div>
                <div className="font-display italic" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{p.t}</div>
                <div className="font-body" style={{ opacity: 0.7, marginTop: 4, fontSize: 14 }}>{p.sum}</div>
              </div>
              <div className="self-center font-mono" style={{
                fontSize: 10, letterSpacing: '0.2em', padding: '4px 10px',
                border: `1px solid ${item.color}`, color: item.color,
              }}>{p.len}</div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
