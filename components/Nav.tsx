'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { computeXP, computeLevel, computeLevelTitle, computeStreak, computeCheckpointPct } from '@/lib/compute';
import { useAppState } from './AppStateProvider';

// ── Icons pour la bottom nav mobile ─────────────────────────────────
const IconDashboard = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="2" y="2" width="6.5" height="6.5" rx="1.5" />
    <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.5" />
    <rect x="2" y="11.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);
const IconEntrainement = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1,10 4,10 6.5,4.5 10,16 13,8 15.5,11.5 19,11.5" />
  </svg>
);
const IconTabac = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <polyline points="3,14 17,14" /><polyline points="3,10 13,10" />
    <polyline points="3,6 8,6" /><polyline points="16,2 18,5 16,8" />
  </svg>
);
const IconGalerie = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <circle cx="7" cy="9" r="1.8" />
    <polyline points="2,15 7,10 10.5,13.5 13,11 18,15" />
  </svg>
);
const IconMental = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6V17a1 1 0 0 1-1 1H7.2a1 1 0 0 1-1-1v-2c-1.9-1.3-3.2-3.5-3.2-6a7 7 0 0 1 7-7z" />
    <line x1="7.5" y1="14" x2="12.5" y2="14" />
  </svg>
);
const IconNutrition = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v6a4 4 0 0 0 4 4v6" /><path d="M8 2v4" />
    <path d="M12 2c0 3 3 4 3 7a4 4 0 0 1-4 4v5" />
  </svg>
);
const IconMateriel = () => (
  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <rect x="2" y="5" width="16" height="13" rx="2" />
    <path d="M2 10h16" /><path d="M8 10v3h4v-3" />
  </svg>
);

const NAV_ITEMS = [
  { href: '/',             Icon: IconDashboard,   label: 'Dashboard' },
  { href: '/entrainement', Icon: IconEntrainement, label: 'Entraînement' },
  { href: '/nutrition',    Icon: IconNutrition,   label: 'Nutrition' },
  { href: '/tabac',        Icon: IconTabac,        label: 'Tabac' },
  { href: '/mental',       Icon: IconMental,       label: 'Mental' },
  { href: '/materiel',     Icon: IconMateriel,     label: 'Matériel' },
  { href: '/galerie',      Icon: IconGalerie,      label: 'Galerie' },
];

export default function Nav() {
  const pathname = usePathname();
  const { state } = useAppState();

  const xp     = computeXP(state);
  const level  = computeLevel(xp);
  const title  = computeLevelTitle(level);
  const streak = computeStreak(state);
  const cpPct  = computeCheckpointPct(state);

  return (
    <>
      {/* ── BARRE DE NAVIGATION SUPÉRIEURE ──────────────────────── */}
      <header className="topnav">
        <div className="topnav-inner">

          {/* Logo */}
          <Link href="/" className="topnav-brand">
            <span className="topnav-logo">IronMarc</span>
            <span className="topnav-sub">Niv. {level} · {title}</span>
          </Link>

          {/* Liens de navigation — desktop */}
          <nav className="topnav-links">
            {NAV_ITEMS.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link key={href} href={href} className={`topnav-link${active ? ' active' : ''}`}>
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Stats rapides — desktop */}
          <div className="topnav-stats">
            <span className="topnav-pill tide">🔥 {streak}j</span>
            <span className="topnav-pill dawn">⚡ Niv.{level}</span>
            <span className="topnav-pill purple">{cpPct}%</span>
          </div>

        </div>

        {/* Barre de progression Phase 1 */}
        <div className="topnav-progress-bar">
          <div className="topnav-progress-fill" style={{ width: `${cpPct}%` }} />
        </div>
      </header>

      {/* ── BOTTOM NAV — mobile uniquement ──────────────────────── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.map(({ href, Icon, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`bottom-nav-link${active ? ' active' : ''}`}>
                <Icon />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
