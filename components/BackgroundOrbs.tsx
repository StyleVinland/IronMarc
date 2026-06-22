'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackgroundOrbs() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  const { scrollY } = useScroll();

  // Chaque orbe a une vitesse et direction différente au scroll → parallax
  const y1 = useTransform(scrollY, [0, 2000], [0, -350]);  // indigo : remonte vite
  const x1 = useTransform(scrollY, [0, 2000], [0,  80]);   // dérive à droite
  const y2 = useTransform(scrollY, [0, 2000], [0, -150]);  // sky : remonte lentement
  const x2 = useTransform(scrollY, [0, 2000], [0, -100]);  // dérive à gauche
  const y3 = useTransform(scrollY, [0, 2000], [0,  220]);  // violet : descend (contre-parallax)
  const x3 = useTransform(scrollY, [0, 2000], [0,   50]);  // dérive légèrement à droite

  if (reduced) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}
      aria-hidden
    >
      {/* Orbe indigo — haut-gauche, parallax rapide vers le haut */}
      <motion.div
        className="global-orb"
        style={{
          position: 'absolute',
          width: '58vw', height: '58vw', maxWidth: 860, maxHeight: 860,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #818cf8 0%, #6366f1 40%, transparent 70%)',
          top: '-8vw', left: '-14vw',
          y: y1, x: x1,
        }}
        animate={{ scale: [1, 1.08, 0.94, 1.04, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Orbe sky — haut-droit, parallax lent */}
      <motion.div
        className="global-orb"
        style={{
          position: 'absolute',
          width: '50vw', height: '50vw', maxWidth: 740, maxHeight: 740,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #38bdf8 0%, #0ea5e9 40%, transparent 70%)',
          top: '-6vw', right: '-14vw',
          y: y2, x: x2,
        }}
        animate={{ scale: [1, 0.93, 1.07, 0.97, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      />

      {/* Orbe violet — bas-centre, contre-parallax (descend) */}
      <motion.div
        className="global-orb"
        style={{
          position: 'absolute',
          width: '50vw', height: '50vw', maxWidth: 740, maxHeight: 740,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #a78bfa 0%, #8b5cf6 40%, transparent 70%)',
          bottom: '-10vw', left: '26%',
          y: y3, x: x3,
        }}
        animate={{ scale: [1, 1.06, 0.95, 1.03, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 3.2 }}
      />
    </div>
  );
}
