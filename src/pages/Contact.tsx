import React, { useState, useEffect } from 'react';
import type { PageProps } from "../types";
import { PageShell } from "../components/PageShell";

function inputStyle(accent: string): React.CSSProperties {
  return {
    width: '100%', background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.2)', borderLeft: `2px solid ${accent}`,
    color: '#fff', padding: '10px 12px',
    fontFamily: 'Archivo, sans-serif', fontSize: 15, outline: 'none', fontWeight: 500,
  };
}

export function ContactPage({ item, onBack, onNext, onPrev }: PageProps) {
  const [form, setForm] = useState({ name: '', org: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGo(true), 60);
    return () => clearTimeout(t);
  }, []);

  const c = item.color;

  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <style>{`
        @keyframes wordPop {
          0%   { transform: skewX(-8deg) scale(0.15) translateY(50px) rotate(-6deg);
                 opacity: 0; filter: blur(16px); }
          52%  { transform: skewX(-8deg) scale(1.22) translateY(-10px) rotate(2deg);
                 opacity: 1; filter: blur(0); }
          70%  { transform: skewX(-8deg) scale(0.95) translateY(3px) rotate(-0.5deg); }
          84%  { transform: skewX(-8deg) scale(1.04) translateY(0) rotate(0.3deg); }
          100% { transform: skewX(-8deg) scale(1) translateY(0) rotate(0deg); opacity: 1; }
        }
        @keyframes workPop {
          0%   { transform: skewX(-8deg) scale(0.05) rotate(-12deg);
                 opacity: 0; filter: blur(28px) brightness(5) saturate(3); }
          42%  { transform: skewX(-8deg) scale(1.45) rotate(5deg);
                 opacity: 1; filter: blur(0) brightness(2.2) saturate(1.5); }
          62%  { transform: skewX(-8deg) scale(0.88) rotate(-2deg);
                 filter: brightness(1.3); }
          78%  { transform: skewX(-8deg) scale(1.06) rotate(1deg); filter: brightness(1.1); }
          100% { transform: skewX(-8deg) scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
        }
        @keyframes floatA {
          0%,100% { transform: skewX(-8deg) translateY(0px) scale(1); }
          45%      { transform: skewX(-8deg) translateY(-9px) scale(1.012); }
        }
        @keyframes floatB {
          0%,100% { transform: skewX(-8deg) translateY(0px) scale(1); }
          55%      { transform: skewX(-8deg) translateY(7px) scale(1.009); }
        }
        @keyframes workGlowInit {
          0%   { filter: brightness(1) drop-shadow(0 0 0px ${c}); }
          100% { filter: brightness(1) drop-shadow(0 0 12px ${c}) drop-shadow(0 0 40px ${c}); }
        }
        @keyframes workGlow {
          0%,100% { filter: brightness(1)
                      drop-shadow(0 0 12px ${c})
                      drop-shadow(0 0 40px ${c}); }
          50%      { filter: brightness(1.45)
                      drop-shadow(0 0 50px ${c})
                      drop-shadow(0 0 110px ${c})
                      drop-shadow(0 0 200px ${c}); }
        }
        @keyframes workGlitch {
          0%,86%,100% { transform: skewX(-8deg) scale(1) translate(0,0); clip-path: none; }
          87% { transform: skewX(-8deg) scale(1) translate(-4px, 0); clip-path: inset(15% 0 55% 0); }
          88% { transform: skewX(-8deg) scale(1) translate(4px, 0);  clip-path: inset(55% 0 10% 0); }
          89% { transform: skewX(-8deg) scale(1) translate(0, 0);    clip-path: none; }
        }
        @keyframes labelSlide {
          0%   { opacity: 0; transform: translateX(-14px); }
          100% { opacity: 0.7; transform: translateX(0); }
        }
        @keyframes scanline {
          0%   { top: -20%; opacity: 0; }
          5%   { opacity: 0.09; }
          90%  { opacity: 0.09; }
          100% { top: 115%; opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="grid gap-16 h-full items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div className="font-mono uppercase" style={{
            fontSize: 11, letterSpacing: '0.28em',
            animation: go ? 'labelSlide 0.5s ease 0.65s both' : 'none',
            opacity: 0,
          }}>
            signal.open()
          </div>

          <div
            className="font-display italic"
            onClick={() => { setGo(false); requestAnimationFrame(() => requestAnimationFrame(() => setGo(true))); }}
            style={{
              marginTop: 6,
              fontSize: 'clamp(80px, 10vw, 170px)', lineHeight: 0.82,
              letterSpacing: '-0.04em',
              position: 'relative', overflow: 'visible',
              cursor: 'pointer',
              zIndex: 999,
            }}
          >

            <span style={{
              display: 'block', color: '#fff',
              animation: go
                ? 'wordPop 0.72s cubic-bezier(0.34,1.56,0.64,1) 0s both, floatA 5.2s ease-in-out 1.1s infinite'
                : 'none',
            }}>
              LET'S
            </span>

            <span style={{ display: 'block' }}>
              {/* glow layer — owns filter only */}
              <span style={{
                display: 'block', color: c,
                textShadow: `6px 6px 0 #0a1b3d`,
                animation: go
                  ? `workGlowInit 0.6s ease 0.95s both, workGlow 2.4s ease-in-out 1.55s infinite`
                  : 'none',
              }}>
                {/* transform / glitch layer — owns transform + clip-path only */}
                <span style={{
                  display: 'block',
                  animation: go
                    ? `workPop 0.78s cubic-bezier(0.34,1.56,0.64,1) 0.17s both, workGlitch 9s linear 2.5s infinite`
                    : 'none',
                }}>
                  WORK
                </span>
              </span>
            </span>

            <span style={{
              display: 'block', color: '#fff',
              animation: go
                ? 'wordPop 0.72s cubic-bezier(0.34,1.56,0.64,1) 0.34s both, floatB 6.1s ease-in-out 1.6s infinite'
                : 'none',
            }}>
              TOGETHER.
            </span>
          </div>

          <div className="flex flex-col gap-2" style={{ marginTop: 24 }}>
            {[['EMAIL', 'fsolorzanopdp@gmail.com'], ['LINKEDIN', 'Fernando Solórzano', 'https://www.linkedin.com/in/fsolorzanopdp/'], ['LOCATION', 'Spain · GMT+2']].map(([k, v, url]) => (
              <div key={k} className="flex gap-4 items-baseline">
                <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.28em', color: c, width: 90 }}>{k}</span>
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="font-body font-bold" style={{ fontSize: 18 }}>{v}</a>
                ) : (
                  <span className="font-body font-bold" style={{ fontSize: 18 }}>{v}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative" style={{
          padding: 30,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(10,20,50,0.6)',
          borderLeft: `4px solid ${c}`,
        }}>
          {sent ? (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <div className="font-display italic" style={{
                fontSize: 54, letterSpacing: '-0.03em', color: c,
                textShadow: '4px 4px 0 #0a1b3d', transform: 'skewX(-6deg)',
              }}>SIGNAL SENT</div>
              <div style={{ marginTop: 10, opacity: 0.8 }}>I'll respond within 48 hours.</div>
            </div>
          ) : (
            <>
              <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.28em', opacity: 0.6, marginBottom: 18 }}>
                TRANSMISSION FORM
              </div>
              {[
                ['name', 'Your name', 'text'] as const,
                ['email', 'Email', 'text'] as const,
                ['msg', 'What do you need?', 'textarea'] as const,
              ].map(([k, label, type]) => (
                <label key={k} className="block" style={{ marginBottom: 14 }}>
                  <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.24em', opacity: 0.55, marginBottom: 4 }}>{label}</div>
                  {type === 'textarea' ? (
                    <textarea
                      value={form[k as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      rows={4}
                      style={inputStyle(c)}
                    />
                  ) : (
                    <input
                      value={form[k as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      style={inputStyle(c)}
                    />
                  )}
                </label>
              ))}
              <button
                onClick={() => setSent(true)}
                className="font-display italic cursor-pointer"
                style={{
                  marginTop: 6, padding: '14px 26px',
                  background: c, color: '#0a1b3d',
                  border: 'none', fontSize: 18, letterSpacing: '-0.01em',
                  transform: 'skewX(-10deg)',
                }}
              >
                ▸ TRANSMIT
              </button>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
