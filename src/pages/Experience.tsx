import type { PageProps } from '../types';
import { EXPERIENCE } from '../data';
import { PageShell, StyledCard } from '../components/PageShell';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseYearMonth(value?: string | null) {
  if (!value) return null;
  const [yearRaw, monthRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function formatMonthYear(value: { year: number; month: number }) {
  return `${MONTHS[value.month - 1]} ${value.year}`;
}

function formatDuration(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years && months) return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  if (years) return `${years} yr${years > 1 ? 's' : ''}`;
  return `${months} mo${months > 1 ? 's' : ''}`;
}

function getJobPeriodLabel(job: { start?: string | null; end?: string | null; period?: string }) {
  const start = parseYearMonth(job.start);
  if (!start) return job.period ?? '';

  const end = parseYearMonth(job.end);
  const now = new Date();
  const effectiveEnd = end ?? { year: now.getFullYear(), month: now.getMonth() + 1 };
  const totalMonths = Math.max(
    1,
    (effectiveEnd.year - start.year) * 12 + (effectiveEnd.month - start.month) + 1,
  );

  const range = `${formatMonthYear(start)} - ${end ? formatMonthYear(end) : 'Present'}`;
  return `${range} · ${formatDuration(totalMonths)}`;
}

export function ExperiencePage({ item, onBack, onNext, onPrev }: PageProps) {
  return (
    <PageShell item={item} onBack={onBack} onNext={onNext} onPrev={onPrev}>
      <div className="grid gap-10 h-full" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="flex flex-col gap-3">
          <div className="font-mono uppercase" style={{ fontSize: 11, letterSpacing: '0.28em', opacity: 0.7, marginBottom: 4 }}>
            // experience.load( )
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
            // education.load( )
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
            {[['EXP', '03 YRS'], ['ROLES', '03'], ['EDU', 'CFGS']].map(([k, v]) => (
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
