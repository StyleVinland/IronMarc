import type { DayData } from '@/types';

interface Props {
  days: Record<string, DayData>;
}

const WEEK_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function SmokeCalendar({ days }: Props) {
  const today = new Date();
  const todayKey = today.toLocaleDateString('fr-CA');
  const dow = (today.getDay() + 6) % 7;
  const start = new Date(today);
  start.setDate(start.getDate() - dow - 28);

  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toLocaleDateString('fr-CA');
    const rec = days[key];
    const isFuture = d > today;
    const isToday = key === todayKey;

    let cls = 'cal-day';
    let title = key;
    if (isFuture) cls += ' future';
    else if (!rec) cls += ' nodata';
    else if (rec.cigs > 0) {
      cls += ' smoked';
      title = `${key} · ${rec.cigs} clope${rec.cigs > 1 ? 's' : ''}`;
    } else cls += ' clean';
    if (isToday) cls += ' today';

    return { label: d.getDate(), cls, title };
  });

  return (
    <section>
      <div className="shead"><h2>Calendrier sans clope</h2><span className="hint">5 dernières semaines</span></div>
      <div className="cal-card">
        <div className="cal-header">
          {WEEK_DAYS.map(d => <span key={d}>{d}</span>)}
        </div>
        <div className="cal-grid">
          {cells.map((c, i) => (
            <div key={i} className={c.cls} title={c.title}>{c.label}</div>
          ))}
        </div>
        <div className="cal-legend">
          <span className="cal-leg-item"><span className="cal-leg-dot" style={{ background: 'var(--tide)' }} />Zéro clope</span>
          <span className="cal-leg-item"><span className="cal-leg-dot" style={{ background: 'var(--warn)' }} />J&apos;ai fumé</span>
          <span className="cal-leg-item"><span className="cal-leg-dot" style={{ background: '#0e2c34', border: '1px solid var(--line)' }} />Pas de données</span>
        </div>
      </div>
    </section>
  );
}
