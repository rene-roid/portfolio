import { useState, useEffect } from 'react';
import type { PageProps } from "../types";
import { PageShell, StyledCard } from "../components/PageShell";

const SHINE_INTERVAL  = 0.07;   // seconds between each char glint peak
const SHINE_DURATION  = 0.35;
const WAVE_DURATION   = 0.70;
const TOTAL_CHARS     = 25;     // "I BUILD"(7) + "WEB APPS"(8) + "THAT SHIP."(10)
const WAVE_START      = (TOTAL_CHARS - 1) * SHINE_INTERVAL + SHINE_DURATION + 0.1;

function AnimatedHeadline({ color }: { color: string }) {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setCycle(1);
      intervalId = setInterval(() => setCycle(c => c + 1), 15_000);
    }, 2_000);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  let gi = 0;

  const ch = (char: string, accent = false) => {
    const idx = gi++;
    const isSpace = char === ' ';
    // cycle 0 = waiting for first trigger (chars sit still); cycle >= 1 = playing
    const base       = cycle === 0 ? 9999 : 0;  // push delays into the future until first trigger
    const shineDelay = base + idx * SHINE_INTERVAL;
    const waveDelay  = base + WAVE_START + idx * 0.05;
    return (
      <span
        key={`${idx}-${cycle}`}
        style={{
          display: 'inline-block',
          animationName: isSpace ? 'none' : 'char-shine, char-wave',
          animationDuration: `${SHINE_DURATION}s, ${WAVE_DURATION}s`,
          animationDelay: `${shineDelay}s, ${waveDelay}s`,
          animationFillMode: 'none',
          animationIterationCount: '1, 1',
          animationTimingFunction: 'ease-in-out, ease-in-out',
          ...(accent ? { color, textShadow: '6px 6px 0 #fff' } : {}),
        }}
      >
        {isSpace ? '\u00A0' : char}
      </span>
    );
  };

  return (
    <>
      {'I BUILD'.split('').map(c => ch(c))}
      <br />
      {'WEB APPS'.split('').map(c => ch(c))}
      <br />
      {'THAT '.split('').map(c => ch(c))}
      {'SHIP'.split('').map(c => ch(c, true))}
      {ch('.')}
    </>
  );
}

export function AboutPage({ item, onBack, onNext, onPrev }: PageProps) {
  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="grid gap-10 h-full" style={{ gridTemplateColumns: '1.1fr 1fr' }}>
        <div className="relative">
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            // profile.read()
          </div>
          <h1 className="font-display italic" style={{
            marginTop: 16,
            fontSize: 'clamp(60px, 7vw, 110px)', lineHeight: 0.9,
            letterSpacing: '-0.04em', color: '#fff',
            textShadow: `6px 6px 0 ${item.color}`,
            transform: 'skewX(-6deg)',
          }}>
            <AnimatedHeadline color={item.color} />
          </h1>
          <p className="font-body" style={{
            marginTop: 28, maxWidth: 520,
            fontSize: 16, lineHeight: 1.55, color: '#d9e6ff',
          }}>
            Full stack developer with nearly three years of professional experience
            building custom web applications for clients from scratch. I own the
            frontend — React and Next.js with TypeScript — and jump into backend
            when needed. Started from game dev, ended up loving the web. Based in
            Spain. Open to new opportunities.
          </p>
          <div className="flex flex-wrap gap-2" style={{ marginTop: 28 }}>
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'C#', 'SQL'].map(t => (
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
            <div className="font-display italic" style={{ fontSize: 26, marginTop: 6 }}>Full Stack Dev, INFINI</div>
            <div style={{ opacity: 0.7, marginTop: 4, fontSize: 14 }}>Building custom client-facing web products from scratch.</div>
          </StyledCard>
          <StyledCard accent="#4fd6ff">
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6 }}>PREVIOUSLY</div>
            <div className="font-display italic" style={{ fontSize: 22, marginTop: 6 }}>Tetravol · Campus Net</div>
            <div style={{ opacity: 0.7, marginTop: 4, fontSize: 14 }}>Game dev internship · CFGS DAW + CFGM SMR</div>
          </StyledCard>
          <StyledCard accent="#ffd23f">
            <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6 }}>IN PURSUIT OF</div>
            <div className="font-body italic font-black" style={{ fontSize: 18, marginTop: 6, lineHeight: 1.3 }}>
              A role where I ship polished full-stack products and grow with a team that cares about craft.
            </div>
          </StyledCard>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 4 }}>
            {[['EXP', '03 YRS'], ['DOMAIN', 'WEB'], ['STACK', 'FULL']].map(([k, v]) => (
              <div key={k} style={{
                border: '1px solid rgba(255,255,255,0.2)', padding: 14,
                background: 'rgba(255,255,255,0.03)',
              }}>
                <div className="font-mono" style={{ fontSize: 9, letterSpacing: '0.28em', opacity: 0.6 }}>{k}</div>
                <div className="font-display italic" style={{ fontSize: 28, marginTop: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
