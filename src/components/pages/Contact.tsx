import React, { useState } from 'react';
import type { MenuItem } from '../../types';
import { PageShell } from '../PageShell';

function inputStyle(accent: string): React.CSSProperties {
  return {
    width: '100%', background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.2)', borderLeft: `2px solid ${accent}`,
    color: '#fff', padding: '10px 12px',
    fontFamily: 'Archivo, sans-serif', fontSize: 15, outline: 'none', fontWeight: 500,
  };
}

export function ContactPage({ item, onBack }: { item: MenuItem; onBack: () => void }) {
  const [form, setForm] = useState({ name: '', org: '', msg: '' });
  const [sent, setSent] = useState(false);

  return (
    <PageShell item={item} onBack={onBack}>
      <div className="grid gap-16 h-full items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div>
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7 }}>
            // signal.open( )
          </div>
          <h1 className="font-display italic" style={{
            marginTop: 6,
            fontSize: 'clamp(80px, 10vw, 170px)', lineHeight: 0.82,
            letterSpacing: '-0.04em', color: '#fff', transform: 'skewX(-8deg)',
          }}>
            LET'S<br />
            <span style={{ color: item.color, textShadow: '6px 6px 0 #0a1b3d' }}>MAKE</span>
            <br />SOMETHING.
          </h1>

          <div className="flex flex-col gap-2" style={{ marginTop: 24 }}>
            {[['EMAIL', 'k@vance.studio'], ['SOCIAL', '@kvance / everywhere'], ['LOCATION', 'Brooklyn, NY · GMT-5']].map(([k, v]) => (
              <div key={k} className="flex gap-4 items-baseline">
                <span className="font-mono" style={{ fontSize: 10, letterSpacing: '0.28em', color: item.color, width: 90 }}>{k}</span>
                <span className="font-body font-bold" style={{ fontSize: 18 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative" style={{
          padding: 30,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(10,20,50,0.6)',
          borderLeft: `4px solid ${item.color}`,
        }}>
          {sent ? (
            <div className="text-center" style={{ padding: '40px 0' }}>
              <div className="font-display italic" style={{
                fontSize: 54, letterSpacing: '-0.03em', color: item.color,
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
                ['org', 'Organization', 'text'] as const,
                ['msg', 'What are you building?', 'textarea'] as const,
              ].map(([k, label, type]) => (
                <label key={k} className="block" style={{ marginBottom: 14 }}>
                  <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: '0.24em', opacity: 0.55, marginBottom: 4 }}>{label}</div>
                  {type === 'textarea' ? (
                    <textarea
                      value={form[k as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      rows={4}
                      style={inputStyle(item.color)}
                    />
                  ) : (
                    <input
                      value={form[k as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                      style={inputStyle(item.color)}
                    />
                  )}
                </label>
              ))}
              <button
                onClick={() => setSent(true)}
                className="font-display italic cursor-pointer"
                style={{
                  marginTop: 6, padding: '14px 26px',
                  background: item.color, color: '#0a1b3d',
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
