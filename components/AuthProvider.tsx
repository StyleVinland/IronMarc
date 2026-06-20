'use client';
import { useState } from 'react';

const PIN = '1404';
const KEYS = ['1','2','3','4','5','6','7','8','9','⌫','0','→'];

function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState(false);

  function press(k: string) {
    if (error) return;
    if (k === '⌫') {
      setDigits(d => d.slice(0, -1));
      return;
    }
    if (k === '→') {
      if (digits.length === 4) validate(digits.join(''));
      return;
    }
    const next = [...digits, k].slice(0, 4);
    setDigits(next);
    if (next.length === 4) validate(next.join(''));
  }

  function validate(code: string) {
    if (code === PIN) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => { setError(false); setDigits([]); }, 700);
    }
  }

  return (
    <div className="pin-screen">
      <div className="pin-box">
        <div className="pin-logo">IronMarc</div>
        <div className="pin-tagline">Code PIN requis</div>
        <div className={`pin-dots${error ? ' error' : ''}`}>
          {[0,1,2,3].map(i => (
            <div key={i} className={`pin-dot${digits.length > i ? ' filled' : ''}${error ? ' err' : ''}`} />
          ))}
        </div>
        <div className="pin-pad">
          {KEYS.map(k => (
            <button
              key={k}
              className={`pin-key${k === '→' ? ' pin-key-enter' : ''}${k === '⌫' ? ' pin-key-del' : ''}`}
              onClick={() => press(k)}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  if (!authed) return <PinScreen onSuccess={() => setAuthed(true)} />;
  return <>{children}</>;
}
