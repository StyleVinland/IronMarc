'use client';

import { motion, animate, useInView, type Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

// ─── Fake data — isolated, no real data touched ────────────────────────────
const PROGRESS_PCT = 8.4;
const IRONMAN_DATE = '12 octobre 2027';

const NAV_CARDS = [
  { href: '/',             label: 'Dashboard',    desc: 'Vue globale · XP · Streak',    color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  { href: '/entrainement', label: 'Entraînement', desc: 'Séances · Charge · Plan',       color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
  { href: '/nutrition',    label: 'Nutrition',    desc: 'Repas · Courses · Budget',      color: '#f97316', glow: 'rgba(249,115,22,0.15)'  },
  { href: '/tabac',        label: 'Tabac',        desc: 'Sevrage · Économies · Streak',  color: '#f43f5e', glow: 'rgba(244,63,94,0.15)'   },
  { href: '/mental',       label: 'Mental',       desc: 'Humeur · Journal · Méditation', color: '#a855f7', glow: 'rgba(168,85,247,0.15)'  },
  { href: '/materiel',     label: 'Matériel',     desc: 'Équipement · Liste · Budget',   color: '#0ea5e9', glow: 'rgba(14,165,233,0.15)'  },
  { href: '/galerie',      label: 'Galerie',      desc: 'Photos · Vidéos · Souvenirs',   color: '#ec4899', glow: 'rgba(236,72,153,0.15)'  },
] as const;

const STATS = [
  { icon: '⏱', label: 'Semaines',      value: 1,   unit: 'sem',   sub: 'sur ~156 prévues'  },
  { icon: '⚡', label: 'XP accumulés',  value: 340, unit: 'XP',    sub: 'Niveau 2 · Recrue' },
  { icon: '🔥', label: 'Streak actuel', value: 6,   unit: 'jours', sub: 'record personnel'  },
] as const;

// ─── Animated counter ──────────────────────────────────────────────────────
function Counter({ to }: { to: number }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.5, ease: 'easeOut', onUpdate: v => setN(Math.round(v)) });
    return c.stop;
  }, [inView, to]);
  return <span ref={ref}>{n}</span>;
}

// ─── Icons ─────────────────────────────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
  '/': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2" y="2" width="9" height="9" rx="2.5"/><rect x="13" y="2" width="9" height="9" rx="2.5"/>
      <rect x="2" y="13" width="9" height="9" rx="2.5"/><rect x="13" y="13" width="9" height="9" rx="2.5"/>
    </svg>
  ),
  '/entrainement': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <polyline points="1,12 4,12 6.5,5 10,19 13,9 15.5,14 22,14"/>
    </svg>
  ),
  '/nutrition': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4 2v7a4 4 0 0 0 4 4v9"/><path d="M8 2v5"/>
      <path d="M12 2c0 3.5 4 5 4 8.5a4.5 4.5 0 0 1-4 4.5v7"/>
    </svg>
  ),
  '/tabac': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <line x1="3" y1="15" x2="21" y2="15"/><line x1="3" y1="11" x2="16" y2="11"/>
      <path d="M19 3l2 3-2 3"/>
    </svg>
  ),
  '/mental': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 2a7 7 0 0 1 7 7c0 3-1.6 5.5-4 7v2a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2c-2.4-1.5-4-4-4-7a7 7 0 0 1 7-7z"/>
      <line x1="9" y1="16" x2="15" y2="16"/>
    </svg>
  ),
  '/materiel': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>
      <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="11" x2="22" y2="11"/>
      <path d="M8 11v4h8v-4"/>
    </svg>
  ),
  '/galerie': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2" y="4" width="20" height="16" rx="2"/><circle cx="8" cy="10" r="2"/>
      <polyline points="2,17 8,11 12,15 15,12 22,17"/>
    </svg>
  ),
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// ─── Page ──────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  return (
    <>
      <style>{`
        .preview-root {
          background: #020817;
          color: #fff;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          overflow-x: hidden;
        }
        body { background: #020817 !important; }

        @keyframes gradShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .hero-grad {
          animation: gradShift 16s ease infinite;
          background: linear-gradient(-45deg, #1e1b4b, #1e3a8a, #4c1d95, #0c4a6e, #1e3a8a);
          background-size: 400% 400%;
        }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.85)} }
        .pulse-dot { animation: pulseDot 2s infinite; }

        .nav-card { transition: transform 180ms ease, box-shadow 200ms ease, border-color 200ms ease, background 200ms ease; }
        .nav-card:hover { transform: translateY(-5px) scale(1.02); cursor: pointer; }

        .grad-iron { background: linear-gradient(135deg, #fff 30%, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-marc { background: linear-gradient(135deg, #818cf8, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .grad-btn  { background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%); }

        .grid-overlay {
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .progress-gradient { background: linear-gradient(90deg, #4f46e5, #818cf8, #a855f7); }

        .cta-glow { box-shadow: 0 0 40px rgba(99,102,241,.4), 0 0 80px rgba(99,102,241,.15); transition: box-shadow .3s; }
        .cta-glow:hover { box-shadow: 0 0 60px rgba(99,102,241,.6), 0 0 120px rgba(99,102,241,.25); }
      `}</style>

      <div className="preview-root">

        {/* BANNER */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2.5 px-4 py-2.5 text-[11px] font-semibold tracking-widest uppercase backdrop-blur-md" style={{ background: 'rgba(245,158,11,.07)', borderBottom: '1px solid rgba(245,158,11,.2)', color: '#fbbf24' }}>
          <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
          Aperçu — page de test isolée
          <Link href="/" className="ml-3 underline opacity-60 hover:opacity-100 normal-case tracking-normal">← Vrai site</Link>
        </div>

        {/* HERO */}
        <section className="relative flex flex-col items-center justify-center text-center min-h-[95vh] px-6 pt-24 pb-20 overflow-hidden">
          <div className="hero-grad absolute inset-0 opacity-50" />
          <div className="grid-overlay absolute inset-0" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, #020817 100%)' }} />

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6 }}
            className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 mb-10 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: 'rgba(99,102,241,.1)', border: '1px solid rgba(99,102,241,.3)', color: '#818cf8' }}
          >
            <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Préparation Ironman · 3 ans
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, delay: .15 }}
            className="relative z-10 font-black leading-none tracking-tighter m-0"
            style={{ fontSize: 'clamp(5rem, 15vw, 11rem)' }}
          >
            <span className="grad-iron">Iron</span>
            <span className="grad-marc">Marc</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .65, delay: .3 }}
            className="relative z-10 mt-6 mb-14 text-lg leading-relaxed max-w-md"
            style={{ color: '#94a3b8' }}
          >
            3,8 km nage · 180 km vélo · 42,2 km course à pied
            <br />
            <span className="text-slate-300 font-medium">Objectif : {IRONMAN_DATE}</span>
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .65, delay: .45 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="flex justify-between items-baseline mb-2.5 text-sm">
              <span style={{ color: '#475569' }} className="font-medium">Progression du plan</span>
              <span className="text-white font-extrabold text-base">{PROGRESS_PCT}%</span>
            </div>
            <div className="h-2 w-full rounded-full" style={{ background: 'rgba(255,255,255,.07)' }}>
              <motion.div
                className="h-full rounded-full progress-gradient"
                initial={{ width: 0 }}
                animate={{ width: `${PROGRESS_PCT}%` }}
                transition={{ duration: 1.6, delay: .9, ease: [.22, 1, .36, 1] }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'rgba(255,255,255,.18)' }}>
              <span>Semaine 1</span>
              <span>Ironman {IRONMAN_DATE}</span>
            </div>
          </motion.div>
        </section>

        {/* NAV CARDS */}
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .5 }}
            className="text-center text-xl font-bold mb-10"
            style={{ color: '#e2e8f0' }}
          >
            Explore ton suivi
          </motion.h2>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {NAV_CARDS.map((card) => (
              <motion.div key={card.href} variants={fadeUp}>
                <Link
                  href={card.href}
                  className="nav-card block rounded-2xl p-5 no-underline"
                  style={{
                    background: 'rgba(15,23,42,.65)',
                    border: '1px solid rgba(255,255,255,.07)',
                    backdropFilter: 'blur(12px)',
                    color: 'inherit',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = card.color + '55';
                    el.style.background = card.glow;
                    el.style.boxShadow = `0 8px 32px ${card.color}20`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'rgba(255,255,255,.07)';
                    el.style.background = 'rgba(15,23,42,.65)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  <div className="mb-3.5" style={{ color: card.color }}>
                    {ICONS[card.href]}
                  </div>
                  <div className="text-sm font-bold" style={{ color: '#f1f5f9' }}>{card.label}</div>
                  <div className="text-xs mt-1 leading-snug" style={{ color: '#475569' }}>{card.desc}</div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* STATS */}
        <section className="px-6 pb-24 max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: .5 }}
            className="text-center text-xl font-bold mb-10"
            style={{ color: '#e2e8f0' }}
          >
            Où j&apos;en suis
          </motion.h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: .5, delay: i * .1 }}
                className="relative rounded-2xl p-7 overflow-hidden"
                style={{ background: 'rgba(15,23,42,.65)', border: '1px solid rgba(255,255,255,.07)', backdropFilter: 'blur(12px)' }}
              >
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(20px)' }} />
                <div className="text-2xl mb-4">{s.icon}</div>
                <div className="text-5xl font-black text-white leading-none">
                  <Counter to={s.value} />
                  <span className="text-lg font-semibold ml-1.5" style={{ color: '#475569' }}>{s.unit}</span>
                </div>
                <div className="mt-2 text-sm font-semibold" style={{ color: '#cbd5e1' }}>{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: '#334155' }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-5 pb-28 px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: '#334155' }}
          >
            Prêt à t&apos;entraîner ?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: .9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: .5 }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }}
          >
            <Link
              href="/"
              className="cta-glow grad-btn inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-base no-underline"
            >
              Accéder au Dashboard
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
              </svg>
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: .2 }}
            className="text-xs" style={{ color: 'rgba(255,255,255,.1)' }}
          >
            Page de test isolée · /preview · aucune donnée réelle
          </motion.p>
        </section>

      </div>
    </>
  );
}
