interface Props {
  checkpointPct: number;
}

export default function Hero({ checkpointPct }: Props) {
  return (
    <header className="hero">
      <div className="hero-text">
        <div className="hero-eyebrow">Objectif de vie · Ironman 2026</div>
        <div className="hero-goal">Ironman</div>
        <p className="hero-why">
          Je ne me reconstruis pas pour être repris — je me reconstruis pour redevenir entier.
        </p>
      </div>
      <div className="hero-progress-wrap">
        <div className="hero-progress-label">Phase 1 — fondations</div>
        <div className="water" aria-label={`Phase 1 : ${checkpointPct}%`}>
          <div className="water-fill" style={{ width: `${checkpointPct}%` }} />
          <div className="water-cap">
            <span>Checkpoint atteint</span>
            <span>{checkpointPct}%</span>
          </div>
        </div>
        <div className="hero-progress-sub">
          Ironman 70.3 Nice · Juin 2026
        </div>
      </div>
    </header>
  );
}
