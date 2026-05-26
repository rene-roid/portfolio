import { useState, useEffect, useCallback } from 'react';
import type { ReactNode, CSSProperties } from 'react';
import { MENU_ITEMS, PROJECTS, EXPERIENCE, SKILL_GROUPS } from '../data';
import type { Project } from '../data';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  computeCodingExperience,
  computeJobExperience,
  getJobPeriodLabel,
} from '../utils';

const mdModules = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
});

// ── Active section tracker ───────────────────────────────────────────────────

function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return active;
}

// ── Sticky nav ───────────────────────────────────────────────────────────────

function MobileNav({ activeSection }: { activeSection: string }) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5,16,42,0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        height: 52,
      }}
    >
      {/* Wordmark */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: "'Archivo Black', sans-serif",
          fontStyle: 'italic',
          fontSize: 16,
          letterSpacing: '-0.02em',
          color: '#fff',
          transform: 'skewX(-6deg)',
        }}
      >
        F·S
      </button>

      {/* Section dots */}
      <div style={{ display: 'flex', gap: 2 }}>
        {MENU_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const shortLabel =
            item.id === 'experience' ? 'EXP' :
            item.id === 'projects'   ? 'PROJ' :
            item.id.slice(0, 4).toUpperCase();
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '5px 7px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: isActive ? item.color : 'rgba(255,255,255,0.18)',
                  transition: 'background 220ms ease',
                  boxShadow: isActive ? `0 0 6px 1px ${item.color}88` : 'none',
                }}
              />
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 7,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: isActive ? item.color : 'rgba(255,255,255,0.35)',
                  transition: 'color 220ms ease',
                }}
              >
                {shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ── Shared primitives ────────────────────────────────────────────────────────

function MobileSection({
  id,
  accent,
  children,
}: {
  id: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      style={{
        padding: '48px 20px 56px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(to bottom, ${accent}cc, transparent)`,
          pointerEvents: 'none',
        }}
      />
      {children}
    </section>
  );
}

function SectionLabel({ text, accent }: { text: string; accent: string }) {
  return (
    <div
      style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 10,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: accent,
        opacity: 0.7,
        marginBottom: 8,
      }}
    >
      {text}
    </div>
  );
}

function SectionHeading({
  children,
  accent,
}: {
  children: ReactNode;
  accent: string;
}) {
  return (
    <h2
      style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontStyle: 'italic',
        fontSize: 'clamp(34px, 9vw, 52px)',
        lineHeight: 0.92,
        letterSpacing: '-0.03em',
        color: '#fff',
        textShadow: `3px 3px 0 ${accent}`,
        transform: 'skewX(-6deg)',
        marginTop: 0,
        marginBottom: 24,
      }}
    >
      {children}
    </h2>
  );
}

function MobileCard({
  accent = '#4fd6ff',
  children,
  style,
}: {
  accent?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        background: 'rgba(10,20,50,0.55)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: `3px solid ${accent}`,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── About ────────────────────────────────────────────────────────────────────

function MobileAbout() {
  const item = MENU_ITEMS.find((m) => m.id === 'about')!;
  const c = item.color;

  return (
    <MobileSection id="about" accent={c}>
      <SectionLabel text="profile.read()" accent={c} />
      <SectionHeading accent={c}>
        I BUILD
        <br />
        WEB APPS
        <br />
        THAT{' '}
        <span style={{ color: c, textShadow: '3px 3px 0 #fff' }}>SHIP.</span>
      </SectionHeading>

      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: '#d9e6ff',
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 'bold',
          margin: '0 0 14px',
        }}
      >
        Full-stack developer with nearly three years of professional experience
        building custom web apps for clients from scratch. Frontend-first —
        React, Next.js, TypeScript — and jump into backend when the job needs
        it. Started in game dev, ended up loving the web.
      </p>

      <p
        style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: '#a0b4d6',
          textTransform: 'uppercase',
          margin: '0 0 20px',
        }}
      >
        Based in Barcelona · Open to opportunities anywhere
      </p>

      {/* Tech badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
        {['React', 'Next.js', 'TypeScript', 'Node', 'SQL', 'C#'].map((t) => (
          <span
            key={t}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '5px 10px',
              border: `1px solid ${c}`,
              color: c,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Info cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MobileCard accent="#c6ff3d">
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
            CURRENTLY
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 19 }}>
            Full Stack Dev · INFINI
          </div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4, fontFamily: 'Archivo, sans-serif' }}>
            Building custom client-facing web tools from scratch.
          </div>
        </MobileCard>

        <MobileCard accent="#ff4141">
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
            PREVIOUS JOB
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 17 }}>
            Game Dev Intern · Tetravol
          </div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4, fontFamily: 'Archivo, sans-serif' }}>
            Virtual and augmented reality game development internship
          </div>
        </MobileCard>

        <MobileCard accent="#ff3b8a">
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
            EDUCATION
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.25 }}>
            {EXPERIENCE.education[0].title}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 5, color: '#ff3b8a' }}>
            {EXPERIENCE.education[0].institution} · {EXPERIENCE.education[0].period}
          </div>
        </MobileCard>

        <MobileCard accent="#258a00">
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 4 }}>
            IN PURSUIT OF
          </div>
          <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontStyle: 'italic', fontSize: 15, lineHeight: 1.4 }}>
            A role where I produce polished full-stack products and grow with a
            team that cares about the product that they make.
          </div>
        </MobileCard>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 4 }}>
          {([
            ['EXP', computeCodingExperience(EXPERIENCE.jobs, EXPERIENCE.education)],
            ['DOMAIN', 'WEB'],
            ['STACK', 'FULL'],
          ] as [string, string][]).map(([k, v]) => (
            <div
              key={k}
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '12px 10px',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.6 }}>
                {k}
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileSection>
  );
}

// ── Experience ───────────────────────────────────────────────────────────────

function MobileExperience() {
  const item = MENU_ITEMS.find((m) => m.id === 'experience')!;
  const c = item.color;

  return (
    <MobileSection id="experience" accent={c}>
      <SectionLabel text="experience.load()" accent={c} />
      <SectionHeading accent={c}>
        WORK
        <br />
        <span style={{ color: c, textShadow: '3px 3px 0 #fff' }}>HISTORY</span>
      </SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
        {EXPERIENCE.jobs.map((j) => (
          <MobileCard key={j.company} accent={j.accent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 18, letterSpacing: '-0.02em' }}>
                  {j.role}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: j.accent, marginTop: 2 }}>
                  {j.company}
                </div>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, opacity: 0.6, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {getJobPeriodLabel(j)}
              </div>
            </div>
            <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: 13.5, lineHeight: 1.55, color: '#d9e6ff', opacity: 0.85, marginTop: 10, marginBottom: 0 }}>
              {j.desc}
            </p>
          </MobileCard>
        ))}
      </div>

      <SectionLabel text="education.load()" accent={c} />
      <div
        style={{
          fontFamily: "'Archivo Black', sans-serif",
          fontStyle: 'italic',
          fontSize: 'clamp(28px, 7vw, 42px)',
          lineHeight: 0.9,
          letterSpacing: '-0.03em',
          color: '#fff',
          textShadow: `3px 3px 0 ${c}`,
          transform: 'skewX(-6deg)',
          marginBottom: 16,
        }}
      >
        EDUCATION
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {EXPERIENCE.education.map((e) => (
          <MobileCard key={e.title} accent={e.accent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
              <div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 15, lineHeight: 1.25 }}>
                  {e.title}
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: e.accent, marginTop: 5 }}>
                  {e.institution}
                </div>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.14em', opacity: 0.6, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {e.period}
              </div>
            </div>
          </MobileCard>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {([
          ['JOB EXP', computeJobExperience(EXPERIENCE.jobs)],
          ['ROLES', String(EXPERIENCE.jobs.length).padStart(2, '0')],
          ['EDUCATION', 'CFGS'],
        ] as [string, string][]).map(([k, v]) => (
          <div
            key={k}
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '12px 10px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, letterSpacing: '0.24em', textTransform: 'uppercase', opacity: 0.6 }}>
              {k}
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontStyle: 'italic', fontSize: 22, marginTop: 2 }}>
              {v}
            </div>
          </div>
        ))}
      </div>
    </MobileSection>
  );
}

// ── Projects ─────────────────────────────────────────────────────────────────

function MobileProjectCard({
  project,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [mdContent, setMdContent] = useState<string | null>(null);

  useEffect(() => {
    if (!expanded || !project.mdFile || mdContent !== null) return;
    const key = `../content/projects/${project.mdFile}`;
    const loader = mdModules[key];
    if (loader) loader().then((c) => setMdContent(c as string));
  }, [expanded, project.mdFile, mdContent]);

  return (
    <div
      style={{
        background: 'rgba(10,20,50,0.55)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderTop: `3px solid ${project.accent}`,
        overflow: 'hidden',
        transition: 'box-shadow 200ms ease',
        boxShadow: expanded ? `0 0 0 1px ${project.accent}55, 0 4px 24px ${project.accent}22` : 'none',
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 16,
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: project.accent,
            marginBottom: 4,
          }}>
            {project.year} · {project.role.toUpperCase()}
          </div>
          <div style={{
            fontFamily: "'Archivo Black', sans-serif",
            fontStyle: 'italic',
            fontSize: 22,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#fff',
            textShadow: `2px 2px 0 ${project.accent}aa`,
            transform: 'skewX(-6deg)',
            marginBottom: 5,
          }}>
            {project.name}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: project.accent,
            marginBottom: 7,
          }}>
            {project.tag}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.5, color: '#d9e6ff' }}>
            {project.summary}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
            {project.stack.slice(0, 4).map((s) => (
              <span
                key={s}
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 9,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '2px 6px',
                  border: `1px solid ${project.accent}66`,
                  color: project.accent,
                }}
              >
                {s}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, opacity: 0.5, padding: '2px 4px' }}>
                +{project.stack.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        <div style={{
          color: project.accent,
          fontSize: 18,
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 220ms ease',
          flexShrink: 0,
          marginTop: 4,
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: 1,
        }}>
          ▾
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '4px 16px 20px', borderTop: `1px solid ${project.accent}33` }}>
          {/* Links */}
          {project.links.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16, marginTop: 12 }}>
              {project.links.map((link) => (
                <a
                  key={link.l}
                  href={link.u}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderLeft: `2px solid ${project.accent}`,
                    color: '#fff',
                    textDecoration: 'none',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  <span>{link.l}</span>
                  <span style={{ color: project.accent, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>↗</span>
                </a>
              ))}
            </div>
          )}

          {/* Content */}
          {project.mdFile ? (
            mdContent === null ? (
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', color: project.accent, opacity: 0.65, padding: '14px 0' }}>
                loading…
              </div>
            ) : (
              <MarkdownRenderer content={mdContent} accent={project.accent} />
            )
          ) : (
            <div style={{ marginTop: 14 }}>
              {(project.body ?? []).map((b, i) => {
                if (b.kind === 'h')
                  return (
                    <h3
                      key={i}
                      style={{
                        fontFamily: "'Archivo Black', sans-serif",
                        fontStyle: 'italic',
                        fontSize: 19,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        transform: 'skewX(-4deg)',
                        borderLeft: `3px solid ${project.accent}`,
                        paddingLeft: 10,
                        marginTop: i === 0 ? 0 : 20,
                        marginBottom: 8,
                      }}
                    >
                      {b.text}
                    </h3>
                  );
                if (b.kind === 'p')
                  return (
                    <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: '#d9e6ff', marginTop: 8, marginBottom: 0 }}>
                      {b.text}
                    </p>
                  );
                return null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MobileProjects() {
  const item = MENU_ITEMS.find((m) => m.id === 'projects')!;
  const c = item.color;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <MobileSection id="projects" accent={c}>
      <SectionLabel text="projects.load()" accent={c} />
      <SectionHeading accent={c}>
        MY{' '}
        <span style={{ color: c, textShadow: '3px 3px 0 #fff' }}>PROJECTS</span>
      </SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PROJECTS.map((project) => (
          <MobileProjectCard
            key={project.id}
            project={project}
            expanded={expandedId === project.id}
            onToggle={() => toggle(project.id)}
          />
        ))}
      </div>
    </MobileSection>
  );
}

// ── Skills ───────────────────────────────────────────────────────────────────

function MobileSkills() {
  const item = MENU_ITEMS.find((m) => m.id === 'skills')!;
  const c = item.color;
  const [openGroup, setOpenGroup] = useState<string | null>(SKILL_GROUPS[0].name);

  function toggle(name: string) {
    setOpenGroup((prev) => (prev === name ? null : name));
  }

  return (
    <MobileSection id="skills" accent={c}>
      <SectionLabel text="skills.list()" accent={c} />
      <SectionHeading accent={c}>
        STACK{' '}
        <span style={{ color: c }}>/ </span>
        TOOLKIT
      </SectionHeading>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SKILL_GROUPS.map((group) => {
          const isOpen = openGroup === group.name;
          return (
            <div
              key={group.name}
              style={{
                background: 'rgba(10,20,50,0.55)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderLeft: `3px solid ${group.color}`,
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => toggle(group.name)}
                style={{
                  width: '100%',
                  background: isOpen ? `${group.color}10` : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '13px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    fontStyle: 'italic',
                    fontSize: 18,
                    letterSpacing: '-0.01em',
                    color: isOpen ? '#fff' : group.color,
                    transition: 'color 150ms ease',
                  }}>
                    {group.name}
                  </span>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 9,
                    padding: '1px 5px',
                    background: `${group.color}18`,
                    border: `1px solid ${group.color}38`,
                    color: `${group.color}90`,
                    letterSpacing: '0.1em',
                  }}>
                    {group.items.length}
                  </span>
                </div>
                <span style={{
                  color: group.color,
                  fontSize: 16,
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 220ms ease',
                  fontFamily: 'JetBrains Mono, monospace',
                  lineHeight: 1,
                }}>
                  ▾
                </span>
              </button>

              {isOpen && (
                <div style={{ borderTop: `1px solid ${group.color}22`, padding: '8px 0 10px' }}>
                  {group.items.map(([name, rank]) => (
                    <div
                      key={name}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '7px 16px 7px 20px',
                      }}
                    >
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 11,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(165,185,225,0.85)',
                      }}>
                        {name}
                      </span>
                      <span style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: 10,
                        padding: '2px 7px',
                        background: `${group.color}18`,
                        border: `1px solid ${group.color}55`,
                        color: group.color,
                        letterSpacing: '0.12em',
                        flexShrink: 0,
                      }}>
                        {rank}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </MobileSection>
  );
}

// ── Contact ──────────────────────────────────────────────────────────────────

function MobileField({
  label,
  sublabel,
  name,
  type = 'text',
  value,
  onChange,
  color,
  rows,
  error,
}: {
  label: string;
  sublabel?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  color: string;
  rows?: number;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const floatUp = focused || value.length > 0;

  const sharedStyle: CSSProperties = {
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
    minHeight: rows ? 110 : undefined,
    boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'relative', marginBottom: error ? 6 : 16 }}>
      <label
        style={{
          position: 'absolute',
          left: 14,
          top: floatUp || rows ? 8 : '50%',
          transform: floatUp || rows ? 'none' : 'translateY(-50%)',
          fontSize: floatUp || rows ? 10 : 14,
          letterSpacing: floatUp || rows ? '0.22em' : '0.04em',
          color: error ? '#ff4d6d' : focused ? color : 'rgba(255,255,255,0.5)',
          fontFamily: 'Archivo, sans-serif',
          fontWeight: 600,
          textTransform: 'uppercase',
          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        {label}
        {sublabel && (
          <span style={{ opacity: 0.5, fontWeight: 400, fontSize: 9, marginLeft: 4 }}>
            {sublabel}
          </span>
        )}
      </label>

      {rows ? (
        <textarea
          name={name}
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={sharedStyle}
        />
      )}

      {error && (
        <div style={{
          fontSize: 11,
          color: '#ff4d6d',
          fontFamily: 'Archivo, sans-serif',
          letterSpacing: '0.06em',
          marginTop: 4,
          marginLeft: 2,
          marginBottom: 12,
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

function MobileContact() {
  const item = MENU_ITEMS.find((m) => m.id === 'contact')!;
  const c = item.color;
  const [form, setForm] = useState({ name: '', company: '', email: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailErr, setEmailErr] = useState('');

  const set = (k: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k === 'email') setEmailErr('');
  };

  const handleSend = useCallback(async () => {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setEmailErr('Oops, seems that your email is wrong!');
      return;
    }
    setSending(true);
    try {
      // fire-and-forget
    } catch {}
    setSending(false);
    setSent(true);
  }, [form]);

  return (
    <MobileSection id="contact" accent={c}>
      <SectionLabel text="signal.open()" accent={c} />
      <SectionHeading accent={c}>
        LET'S{' '}
        <span style={{ color: c, textShadow: '3px 3px 0 #0a1b3d' }}>WORK</span>{' '}
        TOGETHER.
      </SectionHeading>

      {/* Contact info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {([
          ['EMAIL',    'fsolorzanopdp@gmail.com',              undefined],
          ['LINKEDIN', 'Fernando Solórzano',                   'https://www.linkedin.com/in/fsolorzanopdp/'],
          ['LOCATION', 'Spain · GMT+2',                        undefined],
        ] as [string, string, string | undefined][]).map(([k, v, url]) => (
          <div key={k} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: c,
              width: 80,
              flexShrink: 0,
            }}>
              {k}
            </span>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}
              >
                {v}
              </a>
            ) : (
              <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 15 }}>{v}</span>
            )}
          </div>
        ))}
      </div>

      {/* Form box */}
      <div style={{
        padding: '22px 18px 20px',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(10,20,50,0.65)',
        borderLeft: `4px solid ${c}`,
      }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '22px 0' }}>
            <div style={{
              fontFamily: "'Archivo Black', sans-serif",
              fontStyle: 'italic',
              fontSize: 34,
              letterSpacing: '-0.03em',
              color: c,
              textShadow: '3px 3px 0 #0a1b3d',
              transform: 'skewX(-6deg)',
              marginBottom: 12,
            }}>
              SIGNAL SENT
            </div>
            <div style={{ fontSize: 16, fontFamily: 'Archivo, sans-serif', fontWeight: 600 }}>
              Thanks! I'll contact you soon 🚀
            </div>
            <div style={{ marginTop: 6, opacity: 0.5, fontSize: 13, fontFamily: 'Archivo, sans-serif' }}>
              Keep an eye on your inbox.
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 20 }}>
              TRANSMISSION FORM
            </div>

            <MobileField label="Name"    name="name"    value={form.name}    onChange={set('name')}    color={c} />
            <MobileField label="Company" sublabel="optional" name="company" value={form.company} onChange={set('company')} color={c} />
            <MobileField label="Email"   name="email"   type="email" value={form.email} onChange={set('email')} color={c} error={emailErr} />
            <MobileField label="What do you need?" name="msg" value={form.msg} onChange={set('msg')} color={c} rows={4} />

            <button
              onClick={handleSend}
              disabled={sending}
              style={{
                marginTop: 8,
                padding: '14px 28px',
                background: c,
                color: '#0a1b3d',
                border: 'none',
                fontSize: 17,
                fontFamily: "'Archivo Black', sans-serif",
                fontStyle: 'italic',
                letterSpacing: '-0.01em',
                transform: 'skewX(-10deg)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                opacity: sending ? 0.8 : 1,
                transition: 'opacity 150ms, filter 150ms',
              }}
            >
              {sending ? '◐ SENDING...' : '▸ SEND'}
            </button>
          </>
        )}
      </div>
    </MobileSection>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

function MobileFooter() {
  return (
    <footer
      style={{
        padding: '22px 20px',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(5,16,42,0.4)',
      }}
    >
      <div style={{
        fontFamily: "'Archivo Black', sans-serif",
        fontStyle: 'italic',
        fontSize: 13,
        transform: 'skewX(-6deg)',
        color: 'rgba(255,255,255,0.35)',
      }}>
        FERNANDO SOLÓRZANO
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 8,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
      }}>
        FULL STACK DEV
      </div>
    </footer>
  );
}

// ── Root export ──────────────────────────────────────────────────────────────

export function MobileLayout() {
  const sectionIds = MENU_ITEMS.map((m) => m.id);
  const activeSection = useActiveSection(sectionIds);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#05102a',
        color: '#f3f7ff',
        fontFamily: 'Archivo, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <MobileNav activeSection={activeSection} />
      <MobileAbout />
      <MobileExperience />
      <MobileProjects />
      <MobileSkills />
      <MobileContact />
      <MobileFooter />
    </div>
  );
}
