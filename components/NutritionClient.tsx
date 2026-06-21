'use client';
import { useState, useMemo } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  getDayNutrition, getWeekShoppingList, LOAD_TARGETS, FODMAP_TIPS, PANTRY_BASICS,
  SHOP_ORDER, type DayNutrition, type MealOption,
} from '@/lib/nutrition';
import { SESSIONS, PHASES, DATE_OVERRIDES, PROGRAM_START, computeRaceOverrides } from '@/lib/program';

// ─── DATES ───────────────────────────────────────────────────────────────────

const MONTHS_FR = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
const DAY_SHORT = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const WEEK_DAYS_IDX = ['lun','mar','mer','jeu','ven','sam','dim'] as const;

function dateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}
function fmtDay(ds: string) {
  const d = new Date(ds + 'T12:00:00');
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
}
function fmtRange(mon: Date) {
  const sun = new Date(mon); sun.setDate(sun.getDate() + 6);
  return `${mon.getDate()} ${MONTHS_FR[mon.getMonth()]} → ${sun.getDate()} ${MONTHS_FR[sun.getMonth()]}`;
}
function mondayOfWeek(offsetWeeks: number): Date {
  const today = new Date();
  const dow = today.getDay();
  const daysToMon = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(today);
  mon.setDate(today.getDate() + daysToMon + offsetWeeks * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}
function programWeekNum(ds: string): number {
  const start = new Date(PROGRAM_START + 'T00:00:00');
  const d = new Date(ds + 'T00:00:00');
  const diff = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return Math.max(1, Math.floor(diff / 7) + 1);
}

// ─── SESSION FOR DATE ─────────────────────────────────────────────────────────

const ALL_OVERRIDES: Record<string, string> = { ...computeRaceOverrides(), ...DATE_OVERRIDES };

function sessionIdForDate(ds: string): string {
  if (ALL_OVERRIDES[ds]) return ALL_OVERRIDES[ds];
  const weekNum = programWeekNum(ds);
  const d = new Date(ds + 'T12:00:00');
  const dow = d.getDay();
  const dayKey = WEEK_DAYS_IDX[dow === 0 ? 6 : dow - 1];
  const phase = PHASES.find(p => weekNum >= p.weeks[0] && weekNum <= p.weeks[1]);
  if (!phase) return 'rest';
  return phase.template[dayKey] ?? 'rest';
}

// ─── MEAL SLOTS CONFIG ────────────────────────────────────────────────────────

const SLOTS = [
  { key: 'breakfast',         icon: '🌅', label: 'Petit-déjeuner' },
  { key: 'snackAM',           icon: '🍎', label: 'Collation matin' },
  { key: 'preTrainingSnack',  icon: '⚡', label: 'Pré-entraînement (30 min avant)' },
  { key: 'lunch',             icon: '🍽', label: 'Déjeuner' },
  { key: 'postTrainingSnack', icon: '💪', label: 'Post-entraînement (dans les 30 min)' },
  { key: 'snackPM',           icon: '🍌', label: 'Collation PM' },
  { key: 'dinner',            icon: '🌙', label: 'Dîner' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────

function MealSlot({ icon, label, meal }: { icon: string; label: string; meal: MealOption }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="nutri-slot">
      <button className="nutri-slot-head" onClick={() => setOpen(o => !o)}>
        <span className="nutri-slot-icon">{icon}</span>
        <div className="nutri-slot-info">
          <div className="nutri-slot-label">{label}</div>
          <div className="nutri-slot-name">{meal.label}</div>
        </div>
        <div className="nutri-slot-macros">
          <span>{meal.kcal} kcal</span>
          <span>{meal.protein} g prot.</span>
        </div>
        <span className="nutri-slot-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="nutri-slot-body">
          <p className="nutri-slot-desc">{meal.desc}</p>
          {meal.ingredients.length > 0 && (
            <ul className="nutri-slot-ings">
              {meal.ingredients.map((ing, i) => (
                <li key={i}><strong>{ing.qty}</strong> {ing.name}</li>
              ))}
            </ul>
          )}
          {meal.tip && <div className="nutri-slot-tip">{meal.tip}</div>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function NutritionClient() {
  useScrollReveal();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(() => {
    const dow = new Date().getDay();
    return dow === 0 ? 6 : dow - 1; // 0=lun
  });
  const [showShop, setShowShop] = useState(false);
  const [shopOffset, setShopOffset] = useState(1);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showTips, setShowTips] = useState(false);

  const monday = useMemo(() => mondayOfWeek(weekOffset), [weekOffset]);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(d.getDate() + i);
      return dateStr(d);
    });
  }, [monday]);

  const dayPlans = useMemo((): DayNutrition[] => {
    return weekDates.map((ds, i) => {
      const sid = sessionIdForDate(ds);
      const wn = programWeekNum(ds);
      return getDayNutrition(wn, i, sid);
    });
  }, [weekDates]);

  const plan = dayPlans[selectedDay];
  const selectedDate = weekDates[selectedDay];
  const sessionId = sessionIdForDate(selectedDate);
  const session = SESSIONS[sessionId];
  const loadInfo = LOAD_TARGETS[plan.load];

  const shopMonday = useMemo(() => mondayOfWeek(shopOffset), [shopOffset]);
  const shopDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(shopMonday); d.setDate(d.getDate() + i);
      return dateStr(d);
    });
  }, [shopMonday]);

  const shopPlans = useMemo((): DayNutrition[] => {
    return shopDates.map((ds, i) => {
      const sid = sessionIdForDate(ds);
      const wn = programWeekNum(ds);
      return getDayNutrition(wn, i, sid);
    });
  }, [shopDates]);

  const shopList = useMemo(() => getWeekShoppingList(shopPlans), [shopPlans]);

  function toggleCheck(key: string) {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const totalKcal = SLOTS.reduce((acc, s) => {
    const meal = plan[s.key as keyof DayNutrition] as MealOption | null;
    return acc + (meal?.kcal ?? 0);
  }, 0);
  const totalProt = SLOTS.reduce((acc, s) => {
    const meal = plan[s.key as keyof DayNutrition] as MealOption | null;
    return acc + (meal?.protein ?? 0);
  }, 0);

  return (
    <>
      <div className="page-title-block reveal">
        <h1>Nutrition</h1>
        <p>Repas datés · adaptés à la charge d'entraînement · bas-FODMAP · sans lactose</p>
      </div>

      {/* ── CALENDRIER SEMAINE ──────────────────────────────────────── */}
      <section className="reveal reveal-d1">
        <div className="nutri-week-nav">
          <button className="nutri-week-btn" onClick={() => setWeekOffset(o => o - 1)}>←</button>
          <div className="nutri-week-label">
            <span className="nutri-week-title">S{programWeekNum(weekDates[0])}</span>
            <span className="nutri-week-dates">{fmtRange(monday)}</span>
          </div>
          <button className="nutri-week-btn" onClick={() => setWeekOffset(o => o + 1)}>→</button>
        </div>

        <div className="nutri-week-grid">
          {weekDates.map((ds, i) => {
            const p = dayPlans[i];
            const sid = sessionIdForDate(ds);
            const sess = SESSIONS[sid];
            const isToday = ds === dateStr(new Date());
            const li = LOAD_TARGETS[p.load];
            return (
              <button
                key={ds}
                className={`nutri-wd${selectedDay === i ? ' sel' : ''}${isToday ? ' today' : ''}`}
                onClick={() => setSelectedDay(i)}
              >
                <div className="nutri-wd-top">
                  <span className="nutri-wd-dayname">{DAY_SHORT[new Date(ds + 'T12:00:00').getDay()]}</span>
                  <span className="nutri-wd-datenum">{new Date(ds + 'T12:00:00').getDate()}</span>
                </div>
                <div className="nutri-wd-sess">{sess?.short ?? 'Repos'}</div>
                <div className="nutri-wd-load" style={{ color: li.color }}>{li.label}</div>
                <div className="nutri-wd-kcal">{li.kcal}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── PLAN DU JOUR ────────────────────────────────────────────── */}
      <section className="reveal">
        <div className="nutri-day-header">
          <div className="nutri-day-meta">
            <span className="nutri-day-date">{fmtDay(selectedDate)}</span>
            {session && (
              <span className="nutri-sess-badge" style={{ background: session.color + '22', color: session.color, border: `1px solid ${session.color}55` }}>
                {session.label} · {session.duration}
              </span>
            )}
          </div>
          <div className="nutri-day-targets">
            <div className="nutri-target-block">
              <span className="nutri-target-val" style={{ color: loadInfo.color }}>{totalKcal}</span>
              <span className="nutri-target-lbl">kcal / cible {plan.targetKcal}</span>
            </div>
            <div className="nutri-target-block">
              <span className="nutri-target-val" style={{ color: loadInfo.color }}>{totalProt} g</span>
              <span className="nutri-target-lbl">prot. / cible {plan.targetProtein} g</span>
            </div>
            <span className="nutri-load-pill" style={{ background: loadInfo.color + '22', color: loadInfo.color }}>
              Charge {loadInfo.label}
            </span>
          </div>
        </div>

        <div className="nutri-slots">
          {SLOTS.map(s => {
            const meal = plan[s.key as keyof DayNutrition] as MealOption | null;
            if (!meal) return null;
            return <MealSlot key={s.key} icon={s.icon} label={s.label} meal={meal} />;
          })}
        </div>

        <div className="nutri-hydra">
          💧 {plan.load === 'intense' ? '3.0–3.5 L' : plan.load === 'moyen' ? '2.5–3.0 L' : '2.0–2.5 L'} d'eau
          {plan.load !== 'repos' ? ' · +500 ml par heure d\'entraînement' : ' · répartir sur toute la journée'}
        </div>
      </section>

      {/* ── LISTE DE COURSES ─────────────────────────────────────────── */}
      <section className="reveal reveal-d1">
        <div className="shead">
          <h2>Liste de courses</h2>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowShop(s => !s)}>
            {showShop ? 'Masquer ▲' : 'Générer ▼'}
          </button>
        </div>

        {showShop && (
          <div className="nutri-shop">
            <div className="nutri-shop-nav">
              <span className="nutri-shop-nav-lbl">Semaine des courses :</span>
              <button className="nutri-week-btn" onClick={() => setShopOffset(o => o - 1)}>←</button>
              <span className="nutri-shop-range">S{programWeekNum(shopDates[0])} — {fmtRange(shopMonday)}</span>
              <button className="nutri-week-btn" onClick={() => setShopOffset(o => o + 1)}>→</button>
              <button className="btn-ghost" style={{ fontSize: 11, marginLeft: 'auto' }} onClick={() => setCheckedItems(new Set())}>
                Réinitialiser
              </button>
            </div>

            <div className="nutri-shop-pantry">
              <div className="nutri-shop-pantry-title">Vérifier le stock d'abord :</div>
              <div className="nutri-shop-pantry-tags">
                {PANTRY_BASICS.map((item, i) => <span key={i} className="nutri-pantry-tag">{item}</span>)}
              </div>
            </div>

            <div className="nutri-shop-cats">
              {SHOP_ORDER.map(cat => {
                const items = shopList[cat];
                if (!items.length) return null;
                return (
                  <div key={cat} className="nutri-shop-cat">
                    <div className="nutri-shop-cat-title">{cat}</div>
                    {items.map(item => {
                      const key = `${cat}||${item.name}`;
                      const checked = checkedItems.has(key);
                      return (
                        <label key={key} className={`nutri-shop-item${checked ? ' done' : ''}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleCheck(key)} />
                          <span className="nutri-shop-name">{item.name}</span>
                          <span className="nutri-shop-occ">{item.shopQty}</span>
                        </label>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ── CONSEILS BAS-FODMAP ───────────────────────────────────────── */}
      <section className="reveal">
        <div className="shead">
          <h2>Règles bas-FODMAP</h2>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowTips(p => !p)}>
            {showTips ? 'Masquer ▲' : 'Afficher ▼'}
          </button>
        </div>
        {showTips && (
          <div className="nutri-tips">
            {FODMAP_TIPS.map((t, i) => <div key={i} className="nutri-tip">{t}</div>)}
            <div className="nutri-tip-note">
              Ces règles sont des guidelines générales. Écoute ton corps — chaque SII est différent.
              En cas de doute, consulte un médecin ou une diététicienne spécialisée SII.
            </div>
          </div>
        )}
      </section>
    </>
  );
}
