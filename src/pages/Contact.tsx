import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PageProps } from "../types";
import { PageShell } from "../components/PageShell";

// ── confetti ────────────────────────────────────────────────────────────────
function launchConfetti(accentColor: string) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100vw', height: '100vh',
    pointerEvents: 'none', zIndex: '9999',
  });
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  const colors = [accentColor, '#fff', '#f0e68c', '#ff69b4', '#00ffe7', '#ffd700'];
  const particles: {
    x: number; y: number; vx: number; vy: number;
    color: string; size: number; rot: number; rotV: number; alpha: number; shape: 'rect' | 'circle';
  }[] = [];

  for (let i = 0; i < 180; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height * 0.5 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 18 + 8),
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.25,
      alpha: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    });
  }

  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.vx *= 0.99;
      p.rot += p.rotV;
      if (frame > 60) p.alpha -= 0.018;
      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    frame++;
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  }
  requestAnimationFrame(tick);
}

// ── field focus glow particles ───────────────────────────────────────────────
function FieldGlow({ active, color }: { active: boolean; color: string }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      border: `1.5px solid ${active ? color : 'transparent'}`,
      boxShadow: active ? `0 0 18px 2px ${color}55, inset 0 0 12px ${color}18` : 'none',
      transition: 'box-shadow 0.3s, border-color 0.3s',
      borderRadius: 2,
    }} />
  );
}

// ── floating label input ─────────────────────────────────────────────────────
function Field({
  label, sublabel, name, type = 'text', value, onChange, color, rows,
  error,
}: {
  label: string; sublabel?: string; name: string; type?: string;
  value: string; onChange: (v: string) => void; color: string; rows?: number; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floatUp = focused || value.length > 0;
  const sharedStyle: React.CSSProperties = {
    width: '100%',
    background: focused ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.28)',
    border: 'none',
    borderBottom: `2px solid ${error ? '#ff4d6d' : focused ? color : 'rgba(255,255,255,0.2)'}`,
    color: '#fff',
    padding: rows ? '28px 14px 10px' : '26px 14px 10px',
    fontFamily: 'Archivo, sans-serif',
    fontSize: 16,
    outline: 'none',
    fontWeight: 500,
    transition: 'background 0.2s, border-color 0.25s',
    resize: rows ? 'vertical' : undefined,
    minHeight: rows ? 130 : undefined,
  };

  return (
    <div style={{ position: 'relative', marginBottom: error ? 6 : 18 }}>
      <FieldGlow active={focused} color={color} />
      <label style={{
        position: 'absolute', left: 14,
        top: (floatUp || rows) ? 8 : '50%',
        transform: (floatUp || rows) ? 'none' : 'translateY(-50%)',
        fontSize: (floatUp || rows) ? 10 : 14,
        letterSpacing: (floatUp || rows) ? '0.22em' : '0.04em',
        color: error ? '#ff4d6d' : focused ? color : 'rgba(255,255,255,0.5)',
        fontFamily: 'Archivo, sans-serif',
        fontWeight: 600,
        textTransform: 'uppercase',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
        zIndex: 2,
        marginTop: 0,
      }}>
        {label}{sublabel && <span style={{ opacity: 0.5, fontWeight: 400, fontSize: 9, marginLeft: 4 }}>{sublabel}</span>}
      </label>

      {rows ? (
        <textarea
          name={name}
          value={value}
          rows={rows}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}

      {error && (
        <div style={{
          fontSize: 11, color: '#ff4d6d', fontFamily: 'Archivo, sans-serif',
          letterSpacing: '0.06em', marginTop: 4, marginLeft: 2, marginBottom: 14,
          animation: 'errShake 0.35s ease',
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ── page ─────────────────────────────────────────────────────────────────────
export function ContactPage({ item, onBack, onNext, onPrev }: PageProps) {
  const [form, setForm] = useState({ name: '', company: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [go, setGo] = useState(false);
  const [emailErr, setEmailErr] = useState('');
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setGo(true), 60);
    return () => clearTimeout(t);
  }, []);

  const c = item.color;

  const set = (k: keyof typeof form) => (v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (k === 'email') setEmailErr('');
  };

  const handleSend = useCallback(async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setEmailErr("Oops, seems that your email is wrong!");
      return;
    }
    setSending(true);
    try {
      // await fetch(
      //   'https://discord.com/api/webhooks/1498431979744399392/dxKlug277Fslvfpaoz_9Ffu1-HCIOWrWTAA0u9Xd9zJNxRStYuhFp0MKrhOwKpY3JJFE',
      //   {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({
      //       embeds: [{
      //         title: '📬 New Contact Message',
      //         color: 0x00ffe7,
      //         fields: [
      //           { name: 'Name', value: form.name || '—', inline: true },
      //           { name: 'Company', value: form.company || '—', inline: true },
      //           { name: 'Email', value: form.email, inline: false },
      //           { name: 'Message', value: form.msg || '—', inline: false },
      //         ],
      //         timestamp: new Date().toISOString(),
      //       }],
      //     }),
      //   }
      // );
    } catch {
      // fire-and-forget — show success regardless
    }
    setSending(false);
    setSent(true);
    launchConfetti(c);
  }, [form, c]);

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
          62%  { transform: skewX(-8deg) scale(0.88) rotate(-2deg); filter: brightness(1.3); }
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
          0%,100% { filter: brightness(1) drop-shadow(0 0 12px ${c}) drop-shadow(0 0 40px ${c}); }
          50%      { filter: brightness(1.45) drop-shadow(0 0 50px ${c}) drop-shadow(0 0 110px ${c}) drop-shadow(0 0 200px ${c}); }
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
        @keyframes errShake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-5px); }
          40%      { transform: translateX(5px); }
          60%      { transform: translateX(-3px); }
          80%      { transform: translateX(3px); }
        }
        @keyframes sentPop {
          0%   { opacity: 0; transform: skewX(-6deg) scale(0.7) translateY(20px); }
          60%  { opacity: 1; transform: skewX(-6deg) scale(1.06) translateY(-4px); }
          100% { opacity: 1; transform: skewX(-6deg) scale(1) translateY(0); }
        }
        @keyframes sendPulse {
          0%,100% { box-shadow: 0 0 0 0 transparent; }
          50%      { box-shadow: 0 0 22px 4px ${c}88; }
        }
        @keyframes spin {
          to { transform: skewX(-10deg) rotate(360deg); }
        }
        .send-btn:hover { filter: brightness(1.15); transform: skewX(-10deg) scale(1.04) !important; }
        .send-btn:active { transform: skewX(-10deg) scale(0.97) !important; }
      `}</style>

      <div className="grid gap-16 h-full items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* ── left ── */}
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
              fontSize: 'clamp(80px, 8vw, 170px)', lineHeight: 0.82,
              letterSpacing: '-0.04em',
              position: 'relative', overflow: 'visible',
              cursor: 'pointer', zIndex: 999,
            }}
          >
            <span style={{
              display: 'block', color: '#fff',
              animation: go
                ? 'wordPop 0.72s cubic-bezier(0.34,1.56,0.64,1) 0s both, floatA 5.2s ease-in-out 1.1s infinite'
                : 'none',
            }}>LET'S</span>

            <span style={{ display: 'block' }}>
              <span style={{
                display: 'block', color: c,
                textShadow: `6px 6px 0 #0a1b3d`,
                animation: go
                    ? `workGlowInit 0.6s ease 0.95s both`
                  : 'none',
              }}>
                <span style={{
                  display: 'block',
                  animation: go
                    ? `workPop 0.78s cubic-bezier(0.34,1.56,0.64,1) 0.17s both, workGlitch 9s linear 2.5s infinite`
                    : 'none',
                }}>WORK</span>
              </span>
            </span>

            <span style={{
              display: 'block', color: '#fff',
              animation: go
                ? 'wordPop 0.72s cubic-bezier(0.34,1.56,0.64,1) 0.34s both, floatB 6.1s ease-in-out 1.6s infinite'
                : 'none',
            }}>TOGETHER.</span>
          </div>

          <div className="flex flex-col gap-2" style={{ marginTop: 24 }}>
            {([
              ['EMAIL', 'fsolorzanopdp@gmail.com', undefined],
              ['LINKEDIN', 'Fernando Solórzano', 'https://www.linkedin.com/in/fsolorzanopdp/'],
              ['LOCATION', 'Spain · GMT+2', undefined],
            ] as [string, string, string | undefined][]).map(([k, v, url]) => (
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

        {/* ── right — form ── */}
        <div
          ref={formRef}
          style={{
            padding: '36px 32px 32px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(10,20,50,0.65)',
            borderLeft: `4px solid ${c}`,
            backdropFilter: 'blur(8px)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {sent ? (
            <div className="text-center" style={{ padding: '50px 0', animation: 'sentPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div className="font-display italic" style={{
                fontSize: 52, letterSpacing: '-0.03em', color: c,
                textShadow: '4px 4px 0 #0a1b3d', transform: 'skewX(-6deg)',
                marginBottom: 14,
              }}>SIGNAL SENT</div>
              <div style={{ fontSize: 18, opacity: 0.9, fontFamily: 'Archivo, sans-serif', fontWeight: 600 }}>
                Thanks! I'll contact you soon 🚀
              </div>
              <div style={{ marginTop: 8, opacity: 0.5, fontSize: 13, fontFamily: 'Archivo, sans-serif' }}>
                Keep an eye on your inbox.
              </div>
            </div>
          ) : (
            <>
              <div className="font-mono uppercase" style={{
                fontSize: 10, letterSpacing: '0.28em', opacity: 0.5, marginBottom: 24,
              }}>TRANSMISSION FORM</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <Field label="Name" name="name" value={form.name} onChange={set('name')} color={c} />
                <Field label="Company" sublabel="optional" name="company" value={form.company} onChange={set('company')} color={c} />
              </div>

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={set('email')}
                color={c}
                error={emailErr}
              />

              <Field
                label="What do you need?"
                name="msg"
                value={form.msg}
                onChange={set('msg')}
                color={c}
                rows={5}
              />

              <button
                onClick={handleSend}
                disabled={sending}
                className="send-btn font-display italic cursor-pointer"
                style={{
                  marginTop: 10, padding: '15px 32px',
                  background: c, color: '#0a1b3d',
                  border: 'none', fontSize: 19, letterSpacing: '-0.01em',
                  transform: 'skewX(-10deg)',
                  transition: 'filter 0.15s, transform 0.15s',
                  animation: 'sendPulse 2.8s ease-in-out 2s infinite',
                  display: 'flex', alignItems: 'center', gap: 10,
                  opacity: sending ? 0.8 : 1,
                }}
              >
                {sending ? (
                  <span style={{ display: 'inline-block', animation: 'spin 0.7s linear infinite' }}>◐</span>
                ) : '▸'}{' '}
                {sending ? 'SENDING...' : 'SEND'}
              </button>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
