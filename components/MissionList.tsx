import { DAILY } from '@/lib/constants';

interface Props {
  missions: Record<string, boolean>;
  onToggle: (id: string, next: boolean) => void;
  date: string;
}

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#0a242c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function MissionList({ missions, onToggle }: Props) {
  const dl = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section>
      <div className="shead"><h2>Missions du jour</h2><span className="hint">{dl}</span></div>
      <div className="item-list">
        {DAILY.map(t => {
          const done = !!missions[t.id];
          return (
            <div
              key={t.id}
              className={`item${done ? ' done' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(t.id, !done)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(t.id, !done); } }}
            >
              <div className="item-box">{CHECK_SVG}</div>
              <div className="item-txt">{t.txt}</div>
              <div className="item-xp">+{t.xp}</div>
            </div>
          );
        })}
      </div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: 9 }}>
        Le repos fait partie de l&apos;entraînement. Un jour off, c&apos;est une mission réussie, pas une mission ratée.
      </p>
    </section>
  );
}
