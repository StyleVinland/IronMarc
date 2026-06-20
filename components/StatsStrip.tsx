interface Props {
  xp: number;
  level: number;
  levelTitle: string;
  freeStreak: number;
}

export default function StatsStrip({ xp, level, levelTitle, freeStreak }: Props) {
  return (
    <div className="stats">
      <div className="stat stat-lvl">
        <div className="stat-n">{level}</div>
        <div className="stat-k">{levelTitle}</div>
      </div>
      <div className="stat">
        <div className="stat-n">{xp}</div>
        <div className="stat-k">XP totale</div>
      </div>
      <div className="stat stat-streak">
        <div className="stat-n">{freeStreak}</div>
        <div className="stat-k">Jours sans clope</div>
      </div>
    </div>
  );
}
