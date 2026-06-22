'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [glowing, setGlowing] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setGlowing(true), 700);
    const t2 = setTimeout(() => { setExiting(true); onDone(); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const appear = { initial: { scale: 0.55, opacity: 0 }, animate: { scale: exiting ? 1.1 : 1, opacity: exiting ? 0 : 1 }, transition: { duration: exiting ? 0.4 : 0.7, ease: [0.33, 1, 0.68, 1] as [number,number,number,number] } };

  return (
    <>
      {/* Fond noir */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'var(--bg)', pointerEvents: 'none' }}
        aria-hidden
      />

      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26, pointerEvents: 'none' }}>

        {/* Filtre SVG : blanc → transparent */}
        <svg aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="rm-white" colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 3 0" />
            </filter>
          </defs>
        </svg>

        {/* Casque + IronMarc apparaissent ensemble */}
        <motion.div {...appear}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>

            {/* Image du casque avec glows derrière */}
            <div style={{ position: 'relative', width: 180, height: 224 }}>

              {/* ── GLOWS DERRIÈRE L'IMAGE ──
                  Les zones blanches du PNG deviennent transparentes via le filtre.
                  Le bleu en dessous remonte à travers les deux trous (yeux). */}

              {/* Glow œil gauche */}
              <motion.div
                animate={{ opacity: glowing && !exiting ? [0.95, 1, 0.95] : 0 }}
                transition={glowing && !exiting
                  ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                  : { duration: 0.3 }
                }
                style={{
                  position: 'absolute', zIndex: 0,
                  left: '10%', top: '45%',
                  width: '36%', height: '22%',
                  background: '#A8D8FF',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />

              {/* Glow œil droit */}
              <motion.div
                animate={{ opacity: glowing && !exiting ? [0.95, 1, 0.95] : 0 }}
                transition={glowing && !exiting
                  ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }
                  : { duration: 0.3 }
                }
                style={{
                  position: 'absolute', zIndex: 0,
                  left: '57%', top: '45%',
                  width: '27%', height: '15%',
                  background: '#A8D8FF',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }}
              />

              {/* Image au-dessus des glows (z-index: 1) */}
              <motion.div
                animate={{ filter: glowing && !exiting ? 'brightness(1.08)' : 'brightness(1)' }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}
              >
                <img
                  src="/Iron-Man-Logo.png"
                  alt=""
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', objectPosition: 'center 48%',
                    filter: 'url(#rm-white)',
                    display: 'block',
                  }}
                />
              </motion.div>
            </div>

            {/* IronMarc — même design que le PIN, apparaît avec le casque */}
            <motion.div
              layoutId="ironmarc-logo"
              layout
              className="pin-logo"
              style={{ marginBottom: 0 }}
            >
              IronMarc
            </motion.div>

          </div>
        </motion.div>
      </div>
    </>
  );
}
