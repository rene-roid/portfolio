const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseYearMonth(value?: string | null) {
  if (!value) return null;
  const [yearRaw, monthRaw] = value.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

export function formatMonthYear(value: { year: number; month: number }) {
  return `${MONTHS[value.month - 1]} ${value.year}`;
}

export function formatDuration(totalMonths: number) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years && months) return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  if (years) return `${years} yr${years > 1 ? 's' : ''}`;
  return `${months} mo${months > 1 ? 's' : ''}`;
}

function spanFromEntries(entries: Array<{ start?: string | null }>) {
  const starts = entries.map(e => parseYearMonth(e.start)).filter((s): s is NonNullable<typeof s> => s !== null);
  if (!starts.length) return '—';
  const earliest = starts.reduce((min, s) => (s.year * 12 + s.month < min.year * 12 + min.month ? s : min));
  const now = new Date();
  const totalMonths = Math.max(1, (now.getFullYear() - earliest.year) * 12 + (now.getMonth() + 1 - earliest.month) + 1);
  return formatDuration(totalMonths);
}

export function computeJobExperience(jobs: Array<{ start?: string | null }>) {
  return spanFromEntries(jobs);
}

export function computeCodingExperience(
  jobs: Array<{ start?: string | null; coding?: boolean }>,
  education: Array<{ start?: string | null; coding?: boolean }>,
) {
  return spanFromEntries([...jobs.filter(j => j.coding), ...education.filter(e => e.coding)]);
}

export function getJobPeriodLabel(job: { start?: string | null; end?: string | null; period?: string }) {
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
