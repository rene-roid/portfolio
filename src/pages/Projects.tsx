import {Fragment, useState} from 'react';
import type {PageProps} from '../types';
import {PROJECTS} from '../data';
import type {ProjectBlock} from '../data';
import {PageShell} from '../components/PageShell';

export function ProjectsPage({item, onBack, onNext, onPrev}: PageProps) {
  const [focus, setFocus] = useState(0);
  const active = PROJECTS[focus];

  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="grid gap-10 h-full" style={{gridTemplateColumns: '340px 1fr'}}>
        <div className="flex flex-col gap-1">
          <div className="font-mono uppercase" style={{fontSize: 11, letterSpacing: '0.28em', opacity: 0.7}}>
            projects.load()
          </div>
          <div className="font-mono uppercase"
               style={{fontSize: 10, letterSpacing: '0.28em', opacity: 0.6, marginBottom: 12}}>
            {/*{String(PROJECTS.length).padStart(2, '0')} ENTRIES LOADED*/}
          </div>
          {PROJECTS.map((p, i) => {
            const showTagBreak = i === 0 || PROJECTS[i - 1].tag !== p.tag;

            return (
              <Fragment key={p.name}>
                {showTagBreak && (
                  <div
                    className="font-mono uppercase"
                    style={{
                      marginTop: i === 0 ? 0 : 10,
                      marginBottom: 4,
                      fontSize: 9,
                      letterSpacing: '0.22em',
                      color: p.accent,
                      opacity: 0.9,
                      borderTop: `1px solid ${p.accent}66`,
                      paddingTop: 7,
                    }}
                  >
                    {p.tag}
                  </div>
                )}
                <div
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
                  <span className="font-mono" style={{fontSize: 11, opacity: 0.7}}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-display italic" style={{fontSize: 22, letterSpacing: '-0.02em'}}>{p.name}</span>
                </div>
              </Fragment>
            );
          })}
        </div>

        <div className="relative">
          <div className="font-display italic" style={{
            fontSize: 'clamp(80px, 7vw, 150px)', lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: 'transparent', WebkitTextStroke: `2px ${active.accent}`,
            transform: 'skewX(-6deg)',
          }}>{active.name}</div>

          <div className="font-mono uppercase" style={{
            marginTop: 6, fontSize: 12, letterSpacing: '0.28em', color: active.accent,
          }}>
            {active.role} &nbsp;·&nbsp; {active.tag} &nbsp;·&nbsp; {active.year}
          </div>

          <div className="relative overflow-hidden" style={{
            marginTop: 26,
            background: `linear-gradient(135deg, ${active.accent}33, #0a1b3d)`,
            border: `1px solid ${active.accent}`,
          }}>
            {/* Stripe texture */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity: 0.08}}>
              <defs>
                <pattern id="proj-stripes" width="20" height="20" patternUnits="userSpaceOnUse"
                         patternTransform="rotate(30)">
                  <line x1="0" y1="0" x2="0" y2="20" stroke={active.accent} strokeWidth="4"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#proj-stripes)"/>
            </svg>

            {/* Rich content blocks */}
            <div className="relative" style={{padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20}}>
              {(active.content ?? []).map((block: ProjectBlock, idx: number) => {
                if (block.type === 'paragraph') {
                  return (
                    <p key={idx} className="font-body"
                       style={{fontSize: 15, lineHeight: 1.7, color: '#d9e6ff', margin: 0}}>
                      {block.text}
                    </p>
                  );
                }
                if (block.type === 'image') {
                  return (
                    <figure key={idx} style={{margin: 0}}>
                      <img src={block.src} alt={block.caption ?? ''}
                           style={{width: '100%', display: 'block', border: `1px solid ${active.accent}55`}}/>
                      {block.caption && (
                        <figcaption className="font-mono uppercase"
                                    style={{marginTop: 6, fontSize: 10, letterSpacing: '0.2em', color: active.accent, opacity: 0.8}}>
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return null;
              })}
            </div>
            <div className="absolute font-display italic" style={{
              right: 24, bottom: 20,
              fontSize: 48, color: '#fff', opacity: 0.9,
              textShadow: `4px 4px 0 ${active.accent}`, letterSpacing: '-0.02em',
            }}>{active.name}</div>
          </div>

          <div className="grid gap-4 items-start" style={{marginTop: 18, gridTemplateColumns: '1fr 1fr'}}>
            <p className="font-body" style={{fontSize: 16, lineHeight: 1.55, color: '#d9e6ff'}}>
              {active.desc}
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              {(active.links ?? []).map(l => (
                <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                   className="font-mono uppercase cursor-pointer" style={{
                  fontSize: 10, letterSpacing: '0.2em', padding: '6px 10px',
                  border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
                  textDecoration: 'none',
                }}>→ {l.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
