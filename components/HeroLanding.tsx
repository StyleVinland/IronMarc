'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Props {
  checkpointPct: number;
  streak: number;
  xp: number;
}

const IcTrain = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1,10 4,10 6.5,4.5 10,16 13,8 15.5,11.5 19,11.5" />
  </svg>
);
const IcFood = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v6a4 4 0 0 0 4 4v6" /><path d="M8 2v4" />
    <path d="M12 2c0 3 3 4 3 7a4 4 0 0 1-4 4v5" />
  </svg>
);
const IcSmoke = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,14 17,14" /><polyline points="3,10 13,10" />
    <polyline points="3,6 8,6" /><polyline points="16,2 18,5 16,8" />
  </svg>
);
const IcMind = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6V17a1 1 0 0 1-1 1H7.2a1 1 0 0 1-1-1v-2c-1.9-1.3-3.2-3.5-3.2-6a7 7 0 0 1 7-7z" />
    <line x1="7.5" y1="14" x2="12.5" y2="14" />
  </svg>
);
const IcGear = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <rect x="2" y="5" width="16" height="13" rx="2" />
    <path d="M2 10h16" /><path d="M8 10v3h4v-3" />
  </svg>
);
const IcGallery = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <circle cx="7" cy="9" r="1.8" />
    <polyline points="2,15 7,10 10.5,13.5 13,11 18,15" />
  </svg>
);

const FEATURES = [
  { href: '/entrainement', label: 'Entraînement', desc: 'Séances · Cardio · Nage · Vélo', cta: 'Voir le plan',       color: '#6366F1', bg: 'rgba(99,102,241,0.08)', Icon: IcTrain   },
  { href: '/nutrition',    label: 'Nutrition',    desc: '2 200 kcal · 120g protéines',   cta: 'Voir les repas',     color: '#F97316', bg: 'rgba(249,115,22,0.08)', Icon: IcFood    },
  { href: '/tabac',        label: 'Tabac',        desc: 'Sevrage · Streak · XP gagnés',  cta: 'Suivre le sevrage',  color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  Icon: IcSmoke   },
  { href: '/mental',       label: 'Mental',       desc: 'Journal · Humeur · Gratitude',  cta: 'Mindset du jour',    color: '#6366F1', bg: 'rgba(99,102,241,0.08)', Icon: IcMind    },
  { href: '/materiel',     label: 'Matériel',     desc: 'Équipement Ironman · Budget',   cta: 'Liste de matos',     color: '#6366F1', bg: 'rgba(99,102,241,0.08)', Icon: IcGear    },
  { href: '/galerie',      label: 'Galerie',      desc: 'Photos · Milestones · Progrès', cta: 'Ouvrir la galerie',  color: '#10B981', bg: 'rgba(16,185,129,0.08)', Icon: IcGallery },
];

const ease = [0.33, 1, 0.68, 1] as const;

const IRONMAN_DATE = new Date('2029-06-30T00:00:00');

function daysToIronman(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((IRONMAN_DATE.getTime() - today.getTime()) / 86_400_000));
}

export default function HeroLanding({ checkpointPct, streak, xp }: Props) {
  const daysLeft = daysToIronman();
  return (
    <section className="hl">
      {/* Gradient orbs — GPU-accelerated via transform */}
      {/* Title + meta */}
      <motion.div className="hl-text"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease }}>
        <div className="hl-eyebrow">Objectif de vie · Ironman 2029</div>
        <h1 className="hl-title">Ironman</h1>
        <p className="hl-sub">
          Je ne me reconstruis pas pour être repris — je me reconstruis pour redevenir entier.
        </p>

        <div className="hl-progress-row">
          <div className="hl-progress-track">
            <motion.div className="hl-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${checkpointPct}%` }}
              transition={{ duration: 1.5, delay: 0.7, ease }} />
          </div>
          <span className="hl-progress-label">Phase 1 · {checkpointPct}%</span>
        </div>

        <div className="hl-stats">
          <div className="hl-stat">
            <span className="hl-stat-val">{streak}</span>
            <span className="hl-stat-key">jours sans clope</span>
          </div>
          <div className="hl-stat-sep" />
          <div className="hl-stat">
            <span className="hl-stat-val">{xp}</span>
            <span className="hl-stat-key">XP gagnés</span>
          </div>
          <div className="hl-stat-sep" />
          <div className="hl-stat">
            <span className="hl-stat-val">{daysLeft.toLocaleString('fr-FR')}</span>
            <span className="hl-stat-key">jours avant l'Ironman</span>
          </div>
        </div>
      </motion.div>

      {/* Feature cards */}
      <motion.div className="hl-grid"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
        }}>
        {FEATURES.map(f => (
          <motion.div key={f.href}
            variants={{
              hidden:  { opacity: 0, y: 28 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
            }}
            whileHover={{ y: -5, transition: { duration: 0.18 } }}>
            <Link href={f.href} className="hl-card">
              <div className="hl-card-icon" style={{ background: f.bg, color: f.color }}>
                <f.Icon />
              </div>
              <div className="hl-card-label">{f.label}</div>
              <div className="hl-card-desc">{f.desc}</div>
              <div className="hl-card-cta" style={{ color: f.color }}>
                {f.cta} <span className="hl-card-arrow">→</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
