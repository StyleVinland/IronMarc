interface Props {
  checkpointPct: number;
}

export default function Hero({ checkpointPct }: Props) {
  return (
    <header className="hero">
      <div className="eyebrow">Journal de bord · objectif de vie</div>
      <div className="hero-goal">Ironman</div>
      <div className="hero-sub">Phase 1 — poser les fondations</div>
      <p className="hero-why">
        Je ne me reconstruis pas pour être repris. Je me reconstruis pour redevenir entier. Le reste suivra.
      </p>
      <div className="water" aria-label={`Progression Phase 1 : ${checkpointPct}%`}>
        <div className="water-fill" style={{ width: `${checkpointPct}%` }} />
        <div className="water-cap">
          <span>Checkpoint Phase 1</span>
          <span>{checkpointPct}%</span>
        </div>
      </div>
    </header>
  );
}
