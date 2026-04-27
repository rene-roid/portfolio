import {useState, useMemo, useEffect, useRef, useCallback} from 'react';
import type {ReactNode, CSSProperties} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import type {PageProps} from '../types';
import {PROJECTS, PROJECT_CATEGORIES} from '../data';
import type {Project, ProjectCategory} from '../data';
import {PageShell} from '../components/PageShell';

function FadeIn({children, style}: {children: ReactNode; style?: CSSProperties}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setOn(true), 20);
    return () => clearTimeout(id);
  }, []);
  return (
    <div style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity 280ms ease, transform 280ms cubic-bezier(.4,0,.2,1)',
      height: '100%',
      ...style,
    }}>
      {children}
    </div>
  );
}

export function ProjectsPage({item, onBack, onNext, onPrev}: PageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [cat, setCat] = useState('all');

  const parts = location.pathname.split('/');
  const openId = parts.length >= 3 && parts[2] ? parts[2] : null;
  const open = openId ? (PROJECTS.find(p => p.id === openId) ?? null) : null;

  const filtered = useMemo(
    () => (cat === 'all' ? PROJECTS : PROJECTS.filter(p => p.cat === cat)),
    [cat],
  );

  function closeDetail() {
    navigate('/projects');
  }

  return (
    <PageShell
      item={item}
      onBack={open ? closeDetail : onBack}
      onNext={open ? closeDetail : onNext}
      onPrev={open ? closeDetail : onPrev}
    >
      {open ? (
        <FadeIn key={`detail-${open.id}`} style={{overflow: 'hidden'}}>
          <ProjectDetail project={open} onClose={closeDetail} />
        </FadeIn>
      ) : (
        <FadeIn key="grid" style={{overflow: 'hidden'}}>
          <div style={{display: 'grid', gridTemplateColumns: '220px 1fr', gap: 30, height: '100%', overflow: 'hidden'}}>
            <ProjectSidebar
              cats={PROJECT_CATEGORIES}
              current={cat}
              onPick={setCat}
              count={filtered.length}
              accent={item.color}
            />
            <ProjectGrid items={filtered} onOpen={(id) => navigate(`/projects/${id}`)} />
          </div>
        </FadeIn>
      )}
    </PageShell>
  );
}

function ProjectSidebar({cats, current, onPick, count}: {
  cats: ProjectCategory[];
  current: string;
  onPick: (id: string) => void;
  count: number;
  accent: string;
}) {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden'}}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6,
        marginBottom: 8,
      }}>filter_by_category()</div>
      {cats.map((c, i) => {
        const on = current === c.id;
        const isHov = hov === c.id && !on;
        return (
          <div
            key={c.id}
            onMouseEnter={() => setHov(c.id)}
            onMouseLeave={() => setHov(null)}
            onClick={() => onPick(c.id)}
            style={{
              cursor: 'pointer', padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 10,
              background: on ? c.color : isHov ? `${c.color}20` : 'transparent',
              color: on ? '#0a1b3d' : '#fff',
              borderLeft: `3px solid ${c.color}`,
              transform: `skewX(${on ? -8 : isHov ? -4 : 0}deg) translateX(${on ? 8 : isHov ? 4 : 0}px)`,
              transition: 'all 140ms cubic-bezier(.7,0,.2,1.6)',
            }}
          >
            <span style={{fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.7}}>
              {String(i).padStart(2, '0')}
            </span>
            <span style={{
              fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
              fontSize: 18, letterSpacing: '-0.02em', flex: 1,
            }}>{c.label}</span>
            <span style={{fontFamily: 'JetBrains Mono, monospace', fontSize: 10, opacity: 0.65}}>
              {c.id === 'all' ? PROJECTS.length : PROJECTS.filter(p => p.cat === c.id).length}
            </span>
          </div>
        );
      })}
      <div style={{
        marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(255,255,255,0.2)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.55,
      }}>
        showing · {count} {count === 1 ? 'entry' : 'entries'}
      </div>
    </div>
  );
}

function ProjectGrid({items, onOpen}: {items: Project[]; onOpen: (id: string) => void}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      gridAutoRows: 'minmax(0, 1fr)',
      gap: 14, overflowY: 'auto', alignContent: 'start',
    }}>
      {items.map((p, i) => (
        <ProjectCard key={p.id} project={p} index={i} onOpen={() => onOpen(p.id)} />
      ))}
    </div>
  );
}

function ProjectCard({project, index, onOpen}: {project: Project; index: number; onOpen: () => void}) {
  const [hov, setHov] = useState(false);
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    if (clicked) return;
    setClicked(true);
    setTimeout(() => onOpen(), 180);
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={handleClick}
      style={{
        position: 'relative', cursor: 'pointer',
        background: 'rgba(10,20,50,0.55)',
        borderTop: `3px solid ${project.accent}`,
        borderRight: '1px solid rgba(255,255,255,0.14)',
        borderBottom: '1px solid rgba(255,255,255,0.14)',
        borderLeft: '1px solid rgba(255,255,255,0.14)',
        padding: 14, display: 'flex', flexDirection: 'column',
        // transform: clicked
        //   ? 'scale(0.97) skewX(-3deg)'
        //   : hov ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: clicked
          ? `0 0 0 2px ${project.accent}, 0 0 28px 4px ${project.accent}44`
          : 'none',
        transition: clicked
          ? 'transform 90ms ease, box-shadow 90ms ease'
          : 'transform 140ms cubic-bezier(.7,0,.2,1.6), background 140ms, box-shadow 200ms ease',
        overflow: 'hidden',
      }}
    >
      {/* click flash overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        background: project.accent,
        opacity: clicked ? 0.13 : 0,
        transition: clicked ? 'opacity 70ms ease' : 'opacity 200ms ease',
        pointerEvents: 'none',
      }} />

      {/* hover stripe */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: hov ? '100%' : '0%',
        background: `linear-gradient(90deg, ${project.accent}22, transparent)`,
        transition: 'width 220ms cubic-bezier(.7,0,.2,1)',
        pointerEvents: 'none',
      }} />

      {/* thumbnail */}
      <div style={{
        position: 'relative', height: 110, marginBottom: 12,
        background: `linear-gradient(135deg, ${project.accent}33, #0a1b3d)`,
        border: `1px solid ${project.accent}55`,
        overflow: 'hidden',
      }}>
        <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.28}}>
          <defs>
            <pattern
              id={`pc-${project.id}`}
              width="14" height="14"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${30 + index * 15})`}
            >
              <line x1="0" y1="0" x2="0" y2="14" stroke={project.accent} strokeWidth="3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pc-${project.id})`} />
        </svg>
        <div style={{
          position: 'absolute', left: 10, top: 8,
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.24em', textTransform: 'uppercase', color: project.accent,
        }}>{project.year} · {project.role.toUpperCase()}</div>
        <div style={{
          position: 'absolute', left: 10, bottom: 8, right: 10,
          fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
          fontSize: 22, lineHeight: 0.95, letterSpacing: '-0.02em',
          color: '#fff', textShadow: `2px 2px 0 ${project.accent}aa`,
          transform: 'skewX(-8deg)',
        }}>{project.name}</div>
      </div>

      <div style={{position: 'relative', zIndex: 1}}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase', color: project.accent,
          marginBottom: 4,
        }}>{project.tag}</div>
        <div style={{fontSize: 12.5, lineHeight: 1.45, color: '#d9e6ff'}}>
          {project.summary}
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10}}>
          {project.stack.slice(0, 3).map(s => (
            <span key={s} style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              padding: '2px 6px', border: `1px solid ${project.accent}66`,
              color: project.accent,
            }}>{s}</span>
          ))}
          {project.stack.length > 3 && (
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
              opacity: 0.55, padding: '2px 4px',
            }}>+{project.stack.length - 3}</span>
          )}
        </div>
      </div>

      <div style={{
        marginTop: 'auto', paddingTop: 10,
        display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: hov ? project.accent : 'rgba(255,255,255,0.55)',
        transform: hov ? 'translateX(0)' : 'translateX(-6px)',
        transition: 'all 160ms cubic-bezier(.7,0,.2,1.6)',
        position: 'relative', zIndex: 1,
      }}>read entry ▸</div>
    </div>
  );
}

function ProjectDetail({project, onClose}: {project: Project; onClose: () => void}) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 280px', gap: 30, height: '100%', overflow: 'hidden'}}>
      {/* LEFT — body */}
      <CustomScroll accent={project.accent} style={{minHeight: 0}} innerStyle={{paddingRight: 16}}>
        <button
          onClick={onClose}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.animation = 'btnJump 260ms ease-in-out';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.animation = 'none';
          }}
          style={{
            background: 'transparent', border: `1.5px solid ${project.accent}`,
            color: '#fff', cursor: 'pointer', padding: '6px 14px',
            fontFamily: 'Archivo Black, sans-serif', fontStyle: 'italic',
            fontSize: 12, letterSpacing: '-0.01em', transform: 'skewX(-10deg)',
            marginBottom: 16, transition: 'background 140ms, color 140ms',
          }}
        >◂ ALL PROJECTS</button>

        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
          letterSpacing: '0.28em', textTransform: 'uppercase', color: project.accent,
        }}>{project.year} · {project.role}</div>

        <h1 style={{
          marginTop: 6,
          fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
          fontSize: 'clamp(54px, 6.4vw, 92px)', lineHeight: 0.88,
          letterSpacing: '-0.04em', color: '#fff',
          textShadow: `5px 5px 0 ${project.accent}`,
          transform: 'skewX(-8deg)',
        }}>{project.name}</h1>

        <div style={{
          fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontStyle: 'italic',
          fontSize: 18, color: '#d9e6ff', marginTop: 8,
        }}>{project.tag}</div>

        {/* hero placeholder */}
        <div style={{
          marginTop: 22, height: 200,
          background: `linear-gradient(135deg, ${project.accent}33, #0a1b3d)`,
          border: `1px solid ${project.accent}`, position: 'relative', overflow: 'hidden',
        }}>
          <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22}}>
            <defs>
              <pattern id={`hero-${project.id}`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                <line x1="0" y1="0" x2="0" y2="22" stroke={project.accent} strokeWidth="4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#hero-${project.id})`} />
          </svg>
          <div style={{
            position: 'absolute', left: 18, top: 14,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: '#fff', opacity: 0.7,
          }}>[ HERO IMAGE · PLACEHOLDER ]</div>
          <div style={{
            position: 'absolute', right: 18, bottom: 14,
            fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
            fontSize: 42, color: '#fff', letterSpacing: '-0.02em',
            textShadow: `4px 4px 0 ${project.accent}`,
          }}>{project.name}</div>
        </div>

        {/* body blocks */}
        <div style={{marginTop: 22, maxWidth: 680, paddingBottom: 40}}>
          {project.body.map((b, i) => {
            if (b.kind === 'h') return (
              <h2 key={i} style={{
                marginTop: i === 0 ? 0 : 30,
                fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
                fontSize: 28, letterSpacing: '-0.03em', color: '#fff',
                transform: 'skewX(-6deg)',
                borderLeft: `3px solid ${project.accent}`, paddingLeft: 12,
              }}>{b.text}</h2>
            );
            if (b.kind === 'p') return (
              <p key={i} style={{
                marginTop: 12, fontSize: 15.5, lineHeight: 1.62,
                color: '#d9e6ff',
              }}>{b.text}</p>
            );
            if (b.kind === 'img') {
              const imgAccent = b.accent ?? project.accent;
              return (
                <div key={i} style={{
                  marginTop: 18, height: 180,
                  background: `linear-gradient(135deg, ${imgAccent}22, #0a1b3d)`,
                  border: `1px solid ${imgAccent}55`,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2}}>
                    <defs>
                      <pattern id={`bi-${i}-${project.id}`} width="16" height="16" patternUnits="userSpaceOnUse" patternTransform={`rotate(${20 + i * 20})`}>
                        <circle cx="3" cy="3" r="1.5" fill={imgAccent} />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#bi-${i}-${project.id})`} />
                  </svg>
                  <div style={{
                    position: 'absolute', left: 14, top: 12,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    letterSpacing: '0.24em', textTransform: 'uppercase',
                    color: imgAccent, opacity: 0.85,
                  }}>[ IMG · {b.label} ]</div>
                </div>
              );
            }
            return null;
          })}
        </div>
      </CustomScroll>

      {/* RIGHT — meta sidebar */}
      <CustomScroll accent={project.accent} style={{borderLeft: '1px solid rgba(255,255,255,0.15)', minHeight: 0}} innerStyle={{paddingLeft: 22, paddingRight: 8}}>
        <SidebarBlock label="Stack" accent={project.accent}>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
            {project.stack.map(s => (
              <span key={s} style={{
                fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '4px 9px', border: `1px solid ${project.accent}`,
                color: project.accent,
              }}>{s}</span>
            ))}
          </div>
        </SidebarBlock>

        <SidebarBlock label="Year" accent={project.accent}>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic',
            fontSize: 32, letterSpacing: '-0.02em', color: '#fff',
            transform: 'skewX(-6deg)',
          }}>{project.year}</div>
        </SidebarBlock>

        <SidebarBlock label="Role" accent={project.accent}>
          <div style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontStyle: 'italic',
            fontSize: 16, color: '#fff',
          }}>{project.role}</div>
        </SidebarBlock>

        {project.links.length > 0 && (
          <SidebarBlock label="Links" accent={project.accent}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
              {project.links.map(link => (
                <a
                  key={link.l}
                  href={link.u}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = `${project.accent}22`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderLeft: `2px solid ${project.accent}`,
                    color: '#fff', textDecoration: 'none',
                    fontFamily: 'Archivo, sans-serif', fontWeight: 700,
                    fontSize: 13, transition: 'background 140ms',
                  }}
                >
                  <span>{link.l}</span>
                  <span style={{fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: project.accent}}>↗</span>
                </a>
              ))}
            </div>
          </SidebarBlock>
        )}
      </CustomScroll>
    </div>
  );
}

const MIN_THUMB = 28;
const TRACK_W = 3;

function CustomScroll({children, accent, style, innerStyle}: {
  children: ReactNode;
  accent: string;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({top: 0, height: 0, visible: false});
  const dragRef = useRef<{startY: number; startScroll: number} | null>(null);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const {scrollHeight, clientHeight, scrollTop} = el;
    if (scrollHeight <= clientHeight + 1) { setThumb(t => ({...t, visible: false})); return; }
    const thumbH = Math.max((clientHeight / scrollHeight) * clientHeight, MIN_THUMB);
    const thumbRange = clientHeight - thumbH;
    const scrollRange = scrollHeight - clientHeight;
    setThumb({visible: true, height: thumbH, top: scrollRange > 0 ? (scrollTop / scrollRange) * thumbRange : 0});
  }, []);

  useEffect(() => {
    updateThumb();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateThumb]);

  return (
    <div style={{position: 'relative', ...style}}>
      <div
        ref={scrollRef}
        onScroll={updateThumb}
        className="no-scrollbar"
        style={{overflowY: 'auto', height: '100%', scrollbarWidth: 'none', ...innerStyle} as CSSProperties}
      >
        {children}
      </div>
      {thumb.visible && (
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: TRACK_W, background: `${accent}18`, pointerEvents: 'none'}}>
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              e.currentTarget.setPointerCapture(e.pointerId);
              dragRef.current = {startY: e.clientY, startScroll: scrollRef.current?.scrollTop ?? 0};
            }}
            onPointerMove={(e) => {
              if (!dragRef.current || !scrollRef.current) return;
              const el = scrollRef.current;
              const thumbH = Math.max((el.clientHeight / el.scrollHeight) * el.clientHeight, MIN_THUMB);
              const dy = e.clientY - dragRef.current.startY;
              el.scrollTop = dragRef.current.startScroll + (dy / (el.clientHeight - thumbH)) * (el.scrollHeight - el.clientHeight);
            }}
            onPointerUp={() => { dragRef.current = null; }}
            style={{
              position: 'absolute', left: 0, width: '100%',
              top: thumb.top, height: thumb.height,
              background: accent, cursor: 'ns-resize', pointerEvents: 'auto',
              // boxShadow: `0 0 6px 1px ${accent}88`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function SidebarBlock({label, accent, children}: {label: string; accent: string; children: ReactNode}) {
  return (
    <div style={{marginBottom: 22}}>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 9,
        letterSpacing: '0.28em', textTransform: 'uppercase', color: accent,
        marginBottom: 8, opacity: 0.85,
      }}>// {label}</div>
      {children}
    </div>
  );
}
