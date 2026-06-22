'use client';
import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import SplashScreen from './SplashScreen';

const PIN = '1404';
const KEYS = ['1','2','3','4','5','6','7','8','9','⌫','0','→'];

function PinScreen({ onSuccess }: { onSuccess: () => void }) {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError]   = useState(false);

  function press(k: string) {
    if (error) return;
    if (k === '⌫') { setDigits(d => d.slice(0, -1)); return; }
    if (k === '→') { if (digits.length === 4) validate(digits.join('')); return; }
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

        {/* layoutId identique à SplashScreen → le logo "vole" de sa position splash vers ici */}
        <motion.div layoutId="ironmarc-logo" layout className="pin-logo">
          IronMarc
        </motion.div>

        <motion.div
          className="pin-tagline"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.35 }}
        >
          Code PIN requis
        </motion.div>

        <motion.div
          className={`pin-dots${error ? ' error' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          {[0,1,2,3].map(i => (
            <div key={i} className={`pin-dot${digits.length > i ? ' filled' : ''}${error ? ' err' : ''}`} />
          ))}
        </motion.div>

        <motion.div
          className="pin-pad"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.35 }}
        >
          {KEYS.map(k => (
            <button
              key={k}
              className={`pin-key${k === '→' ? ' pin-key-enter' : ''}${k === '⌫' ? ' pin-key-del' : ''}`}
              onClick={() => press(k)}
            >{k}</button>
          ))}
        </motion.div>

      </div>
    </div>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [splash, setSplash] = useState(true);
  const [authed, setAuthed] = useState(false);

  if (authed) return <>{children}</>;

  return (
    <LayoutGroup>
      <AnimatePresence>
        {splash
          ? <SplashScreen key="splash" onDone={() => setSplash(false)} />
          : <PinScreen    key="pin"    onSuccess={() => setAuthed(true)} />
        }
      </AnimatePresence>
    </LayoutGroup>
  );
}
