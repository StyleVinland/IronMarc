'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { computeXP, computeLevel, computeLevelTitle, computeStreak, computeCheckpointPct } from '@/lib/compute';
import type { AppState } from '@/types';

// ── Inline SVG icons ────────────────────────────────────────────────
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <rect x="2" y="2" width="6.5" height="6.5" rx="1.5" />
    <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.5" />
    <rect x="2" y="11.5" width="6.5" height="6.5" rx="1.5" />
    <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

const IconEntrainement = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1,10 4,10 6.5,4.5 10,16 13,8 15.5,11.5 19,11.5" />
  </svg>
);

const IconTabac = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <polyline points="3,14 17,14" />
    <polyline points="3,10 13,10" />
    <polyline points="3,6 8,6" />
    <polyline points="16,2 18,5 16,8" />
  </svg>
);

const IconGalerie = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="16" height="13" rx="2" />
    <circle cx="7" cy="9" r="1.8" />
    <polyline points="2,15 7,10 10.5,13.5 13,11 18,15" />
  </svg>
);

const IconMental = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.2 6V17a1 1 0 0 1-1 1H7.2a1 1 0 0 1-1-1v-2c-1.9-1.3-3.2-3.5-3.2-6a7 7 0 0 1 7-7z" />
    <line x1="7.5" y1="14" x2="12.5" y2="14" />
  </svg>
);

const IconNutrition = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v6a4 4 0 0 0 4 4v6" />
    <path d="M8 2v4" />
    <path d="M12 2c0 3 3 4 3 7a4 4 0 0 1-4 4v5" />
  </svg>
);

const NAV_ITEMS = [
  { href: '/',             Icon: IconDashboard,   label: 'Dashboard' },
  { href: '/entrainement', Icon: IconEntrainement, label: 'Entraînement' },
  { href: '/nutrition',    Icon: IconNutrition,   label: 'Nutrition' },
  { href: '/tabac',        Icon: IconTabac,        label: 'Tabac' },
  { href: '/galerie',      Icon: IconGalerie,      label: 'Galerie' },
  { href: '/mental',       Icon: IconMental,       label: 'Mental' },
];

interface SidebarStats { xp: number; level: number; title: string; streak: number; cpPct: number; }

export default function Nav() {
  const pathname = usePathname();
  const [stats, setStats] = useState<SidebarStats>({ xp: 0, level: 1, title: '—', streak: 0, cpPct: 0 });

  useEffect(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then((state: AppState) => {
        const xp = computeXP(state);
        const level = computeLevel(xp);
        setStats({
          xp,
          level,
          title: computeLevelTitle(level),
          streak: computeStreak(state),
          cpPct: computeCheckpointPct(state),
        });
      })
      .catch(() => {});
  }, [pathname]);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">IronMarc</div>
          <div className="sidebar-tagline">Niveau {stats.level} · {stats.title}</div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ href, Icon, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-link${active ? ' active' : ''}`}>
                <span className="nav-icon"><Icon /></span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-phase">Phase 1 — Checkpoint</div>
          <div className="sidebar-bar">
            <div className="sidebar-bar-fill" style={{ width: `${stats.cpPct}%` }} />
          </div>
          <div className="sidebar-meta">
            <span className="sidebar-pct">{stats.cpPct}%</span>
            <span className="sidebar-streak">{stats.streak}j sans tabac</span>
          </div>
          <div className="sidebar-xp">{stats.xp} XP</div>
          <div className="save-indicator" style={{ marginTop: 10 }}>
            <span className="save-dot" />
            Sauvegardé automatiquement
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ───────────────────────────────────── */}
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
