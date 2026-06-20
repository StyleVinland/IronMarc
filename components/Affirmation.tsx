'use client';
import { AFF } from '@/lib/constants';

interface Props {
  affIdx: number;
  onNext: (idx: number) => void;
}

export default function Affirmation({ affIdx, onNext }: Props) {
  const quote = AFF[affIdx % AFF.length];

  function next() {
    const idx = Math.floor(Math.random() * AFF.length);
    onNext(idx);
  }

  return (
    <section className="think">
      <div className="think-q">«&nbsp;{quote}&nbsp;»</div>
      <div className="think-row">
        <span className="muted" style={{ fontSize: 12 }}>Pensée du moment</span>
        <button className="btn-ghost" onClick={next}>Nouvelle pensée</button>
      </div>
    </section>
  );
}
