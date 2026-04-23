import type { MenuItem } from '../../types';
import { PageShell, StyledCard } from '../PageShell';

export function AboutPage({ item, onBack }: { item: MenuItem; onBack: () => void }) {
  return (
    <PageShell item={item} onBack={onBack}>
      <div className="grid gap-10 h-full" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
        <div className="relative">
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            // profile.read( )
          </div>
          <h1 className="font-display italic" style={{
            marginTop: 16,
            fontSize: 'clamp(60px, 7vw, 110px)', lineHeight: 0.9,
            letterSpacing: '-0.04em', color: '#fff',
            textShadow: `6px 6px 0 ${item.color}`,
            transform: 'skewX(-6deg)',
          }}>
            I BUILD<br />INTERFACES<br />THAT <span style={{ color: item.color }}>FEEL</span>.
          </h1>
          <p className="font-body" style={{
            marginTop: 28, maxWidth: 520,
            fontSize: 16, lineHeight: 1.55, color: '#d9e6ff',
          }}>
            Frontend engineer with seven years making production UIs that don't
            just work — they land. I specialize in interaction design, motion, and
            the unglamorous plumbing that makes a product feel fast. Based in
            Brooklyn, working remote, coffee-powered.
          </p>
          <div className="flex flex-wrap gap-2" style={{ marginTop: 28 }}>
            {['React', 'TypeScript', 'Motion', 'GLSL', 'Rust (WASM)', 'Design Systems'].map(t => (
              <span key={t} className="font-mono uppercase" style={{
                fontSize: 11, letterSpacing: '0.18em',
                padding: '6px 12px', border: `1px solid ${item.color}`, color: item.color,
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 justify-center">
          <StyledCard accent={item.color}>
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6 }}>CURRENTLY</div>
            <div className="font-display italic" style={{ fontSize: 26, marginTop: 6 }}>Sr. Frontend, LUMEN LABS</div>
            <div style={{ opacity: 0.7, marginTop: 4, fontSize: 14 }}>Leading the web runtime rewrite.</div>
          </StyledCard>
          <StyledCard accent="#4fd6ff">
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6 }}>PREVIOUSLY</div>
            <div className="font-display italic" style={{ fontSize: 22, marginTop: 6 }}>Figma · Linear · Stripe Press</div>
          </StyledCard>
          <StyledCard accent="#ffd23f">
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6 }}>IN PURSUIT OF</div>
            <div className="font-body italic font-black" style={{ fontSize: 18, marginTop: 6, lineHeight: 1.3 }}>
              Interfaces that respect attention, reward curiosity, and hold up at 60fps on a 5-year-old laptop.
            </div>
          </StyledCard>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 4 }}>
            {[['YEARS', '07'], ['SHIPPED', '34'], ['TALKS', '11']].map(([k, v]) => (
              <div key={k} style={{
                border: '1px solid rgba(255,255,255,0.2)', padding: 14,
                background: 'rgba(255,255,255,0.03)',
              }}>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.28em', opacity: 0.6 }}>{k}</div>
                <div className="font-display italic" style={{ fontSize: 34, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
