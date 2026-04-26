import type { PageProps } from '../types';
import { EXPERIENCE } from '../data';
import { PageShell, StyledCard } from '../components/PageShell';
import { computeJobExperience, getJobPeriodLabel } from '../utils';

export function ExperiencePage({ item, onBack, onNext, onPrev }: PageProps) {
  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="grid gap-10 h-full" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="flex flex-col gap-3">
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7, marginBottom: 4 }}>
            // experience.load()
          </div>
          <div className="font-display italic" style={{
            fontSize: 'clamp(36px, 4vw, 58px)', lineHeight: 0.9,
            letterSpacing: '-0.03em', transform: 'skewX(-6deg)',
            color: '#fff', textShadow: `4px 4px 0 ${item.color}`,
            marginBottom: 10,
          }}>
            WORK<br /><span style={{ color: item.color }}>HISTORY</span>
          </div>
          {EXPERIENCE.jobs.map(j => (
            <StyledCard key={j.company} accent={j.accent}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display italic" style={{ fontSize: 20, letterSpacing: '-0.02em' }}>{j.role}</div>
                  <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', color: j.accent, marginTop: 2 }}>{j.company}</div>
                </div>
                <div className="font-mono" style={{ fontSize: 11, opacity: 0.6, whiteSpace: 'nowrap', marginLeft: 12 }}>{getJobPeriodLabel(j)}</div>
              </div>
              <p className="font-body" style={{ marginTop: 10, fontSize: 14, lineHeight: 1.5, color: '#d9e6ff', opacity: 0.85 }}>{j.desc}</p>
            </StyledCard>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7, marginBottom: 4 }}>
            // education.load()
          </div>
          <div className="font-display italic" style={{
            fontSize: 'clamp(36px, 4vw, 58px)', lineHeight: 0.9,
            letterSpacing: '-0.03em', transform: 'skewX(-6deg)',
            color: '#fff', textShadow: `4px 4px 0 ${item.color}`,
            marginBottom: 10,
          }}>
            EDUCATION
          </div>
          {EXPERIENCE.education.map(e => (
            <StyledCard key={e.title} accent={e.accent}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-display italic" style={{ fontSize: 18, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{e.title}</div>
                  <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.22em', color: e.accent, marginTop: 4 }}>{e.institution}</div>
                </div>
                <div className="font-mono" style={{ fontSize: 11, letterSpacing: '0.14em', opacity: 0.6, whiteSpace: 'nowrap', marginLeft: 12 }}>{e.period}</div>
              </div>
            </StyledCard>
          ))}

          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 8 }}>
            {[['JOB EXPERIENCE', computeJobExperience(EXPERIENCE.jobs)], ['ROLES', String(EXPERIENCE.jobs.length).padStart(2, '0')], ['EDUCATION', 'CFGS']].map(([k, v]) => (
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
