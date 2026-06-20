import { QUESTS } from '@/lib/constants';

interface Props {
  quests: Record<string, boolean>;
  onToggle: (id: string, next: boolean) => void;
}

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#0a242c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function QuestList({ quests, onToggle }: Props) {
  return (
    <section>
      <div className="shead"><h2>Quêtes secondaires</h2><span className="hint">les grandes étapes</span></div>
      <div className="item-list">
        {QUESTS.map(q => {
          const done = !!quests[q.id];
          return (
            <div
              key={q.id}
              className={`item quest${done ? ' done' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => onToggle(q.id, !done)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(q.id, !done); } }}
            >
              <div className="item-box">{CHECK_SVG}</div>
              <div className="item-txt">{q.txt}</div>
              <div className="item-xp">+{q.xp}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
