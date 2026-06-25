'use client';
import { useState } from 'react';
import { DAILY, DAILY_BONUS } from '@/lib/constants';
import { DATE_OVERRIDES, computeRaceOverrides, PROGRAM_START, PHASES, SESSIONS } from '@/lib/program';

interface Props {
  missions: Record<string, boolean>;
  onToggle: (id: string, next: boolean) => void;
  date: string;
}

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#0a242c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface Exo { name: string; detail: string; dur: string; tag?: string }

// ── ROUTINE MATIN FIXE ────────────────────────────────────────────────────────
// Même séquence chaque jour — activation au réveil. ~8 min.
// Protocoles : anti-pubalgie (aine) + anti-MTSS (tibias).
const MORNING_ROUTINE: Exo[] = [
  {
    name: 'Cat-Cow',
    detail: '4 pattes, ondulation dos creux → dos rond. Lent, synchronisé avec la respiration. Réveille la colonne et mobilise les hanches.',
    dur: '10 reps',
  },
  {
    name: 'Cercles de hanches debout',
    detail: 'Mains sur les crêtes iliaques, grands cercles de bassin dans chaque sens. Active l\'aine sans forcer — essentiel pubalgie.',
    dur: '10 × / sens',
    tag: 'Pubalgie',
  },
  {
    name: 'Pompages de cheville',
    detail: 'Assis au bord du lit ou allongé — flex / extension lente des deux chevilles. Réveille la chaîne tibias-mollets avant tout impact.',
    dur: '20 × / pied',
    tag: 'Périostites',
  },
  {
    name: 'Fente basse genou à terre',
    detail: 'Genou arrière au sol, pied arrière relâché. Bascule doucement le bassin vers l\'avant jusqu\'à sentir l\'avant de la hanche s\'étirer. Ne force pas.',
    dur: '30 s / côté',
    tag: 'Pubalgie',
  },
  {
    name: 'Rotation thoracique en fente',
    detail: 'Depuis la fente : main derrière la nuque, rotation du buste vers le ciel × 5, puis garde. Déverrouille la colonne pour la journée.',
    dur: '5 × puis 20 s / côté',
  },
];

// ── ÉTIREMENTS SOIR ADAPTÉS ───────────────────────────────────────────────────
// Clés = type de session (renfo | swim | bike | run | brick | rest)
const EVENING: Record<string, Exo[]> = {
  renfo: [
    {
      name: 'Pigeon au sol',
      detail: 'Jambe avant pliée à 90°, jambe arrière tendue. Laisse la hanche descendre par la pesanteur — ne cherche pas à pousser.',
      dur: '60 s / côté',
      tag: 'Pubalgie',
    },
    {
      name: 'Adducteur allongé',
      detail: 'Sur le dos, jambe tendue qui s\'ouvre lentement sur le côté, talon glissant au sol. Tu dois sentir l\'intérieur de la cuisse s\'étirer — pas l\'aine.',
      dur: '45 s / côté',
      tag: 'Pubalgie',
    },
    {
      name: 'Psoas — fente genou à terre',
      detail: 'Genou arrière au sol, bassin vers l\'avant. Respire et laisse la hanche descendre à chaque expire.',
      dur: '45 s / côté',
    },
    {
      name: 'Mollet genou tendu',
      detail: 'Talon appuyé contre une marche ou un mur, jambe tendue. Sentir l\'étirement dans le mollet profond (gastrocnémien).',
      dur: '45 s / côté',
      tag: 'Périostites',
    },
    {
      name: 'Mollet genou fléchi',
      detail: 'Même position, genou légèrement plié. Cible le soléaire — le muscle directement lié aux périostites tibiales.',
      dur: '40 s / côté',
      tag: 'Périostites',
    },
    {
      name: 'Massage plantaire',
      detail: 'Balle de tennis (ou bouteille) sous le pied, rouler lentement de la voûte vers le talon. Décomprime la fascia et soulage indirectement les tibias.',
      dur: '1-2 min / pied',
    },
  ],
  swim: [
    {
      name: 'Grand dorsal',
      detail: 'Bras tendu au-dessus, main accrochée à un encadrement de porte ou un bord. Inclination latérale douce — tu dois sentir le flanc s\'ouvrir.',
      dur: '30 s / côté',
    },
    {
      name: 'Pectoraux contre encadrement',
      detail: 'Main à hauteur d\'épaule contre le mur, rotation douce du buste dans le sens opposé. Ouverture progressive.',
      dur: '30 s / côté',
    },
    {
      name: 'Épaule croisée',
      detail: 'Bras passé en croix devant la poitrine, l\'autre bras le retient. Tu dois sentir l\'arrière de l\'épaule (deltoïde postérieur). Pas de douleur.',
      dur: '30 s / côté',
    },
    {
      name: 'Massage nuque / trapèzes',
      detail: 'Pouces à la base du crâne, petits cercles lents. Puis pétrissage des trapèzes avec les paumes. La natation raidit souvent la nuque.',
      dur: '2 min',
    },
    {
      name: 'Rotations cervicales',
      detail: 'Menton qui cherche l\'épaule — maintien doux, sans tirer. Puis de l\'autre côté. Lenteur = efficacité.',
      dur: '5 × / sens',
    },
  ],
  bike: [
    {
      name: 'Quadriceps debout',
      detail: 'Talon vers les fesses, genou pointé vers le bas, bassin droit. Le vélo contracte les quads en quasi-permanence.',
      dur: '45 s / côté',
    },
    {
      name: 'Fléchisseur de hanche',
      detail: 'Fente genou au sol, bascule le bassin vers l\'avant. Position vélo = hanche fléchie longtemps — décompresser après.',
      dur: '45 s / côté',
    },
    {
      name: 'Ischio-jambiers debout',
      detail: 'Talon posé sur une chaise ou une marche, dos droit, buste incliné vers l\'avant. Sentir l\'arrière de la cuisse.',
      dur: '45 s / côté',
    },
    {
      name: 'Rotation lombaire allongée',
      detail: 'Sur le dos, genoux pliés à 90° qui tombent d\'un côté, épaules restent au sol. Torsion douce de la colonne lombaire.',
      dur: '8 × / côté',
    },
  ],
  run: [
    {
      name: 'Mollet genou tendu',
      detail: 'Contre une marche, jambe tendue. Gastrocnémien — l\'un des deux muscles directement impliqués dans les périostites.',
      dur: '45 s / côté',
      tag: 'Périostites',
    },
    {
      name: 'Mollet genou fléchi',
      detail: 'Même position, genou légèrement plié. Soléaire — l\'autre muscle des tibias. Les deux doivent être faits à chaque fois.',
      dur: '45 s / côté',
      tag: 'Périostites',
    },
    {
      name: 'Ischio-jambiers',
      detail: 'Talon sur un appui, buste vers l\'avant, dos droit. Ne pas arrondir le dos pour aller plus loin.',
      dur: '45 s / côté',
    },
    {
      name: 'Pigeon — fessier',
      detail: 'Jambe avant à 90° au sol, jambe arrière tendue. Hanche qui descend progressivement.',
      dur: '45 s / côté',
    },
    {
      name: 'Quadriceps debout',
      detail: 'Talon vers les fesses, bassin droit. Récupération post-course.',
      dur: '45 s / côté',
    },
  ],
  brick: [
    {
      name: 'Quadriceps debout',
      detail: 'Post-vélo : les quads ont travaillé longtemps. Talon vers les fesses, bassin droit.',
      dur: '45 s / côté',
    },
    {
      name: 'Fléchisseur de hanche',
      detail: 'Fente genou au sol, bassin vers l\'avant. Transition T2 laisse les hanches en position fléchie.',
      dur: '45 s / côté',
    },
    {
      name: 'Mollet genou tendu',
      detail: 'Contre une marche, jambe tendue. Post-course.',
      dur: '45 s / côté',
      tag: 'Périostites',
    },
    {
      name: 'Mollet genou fléchi',
      detail: 'Soléaire — les deux variantes à chaque fois.',
      dur: '45 s / côté',
      tag: 'Périostites',
    },
    {
      name: 'Rotation lombaire allongée',
      detail: 'Genoux pliés qui tombent à gauche puis à droite. Décompression vertébrale après l\'enchaînement.',
      dur: '8 × / côté',
    },
  ],
  rest: [
    {
      name: 'Pigeon au sol',
      detail: 'Jambe avant à 90°, jambe arrière tendue. Jour de repos = pas de pression, laisser la pesanteur faire le travail.',
      dur: '60 s / côté',
    },
    {
      name: 'Dos en boule',
      detail: 'Sur le dos, genoux ramenés contre la poitrine, bras autour des genoux. Bercement doux gauche-droite si confortable.',
      dur: '60 s',
    },
    {
      name: 'Respiration 4-7-8',
      detail: 'Inspire 4 s → retiens 7 s → expire 8 s lentement. Active le système parasympathique. Meilleur signal de récupération que n\'importe quel étirement.',
      dur: '4 cycles',
    },
  ],
};

const WEEK_DAYS_IDX = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'] as const;
const ALL_OVERRIDES: Record<string, string> = { ...computeRaceOverrides(), ...DATE_OVERRIDES };

function sessionTypeForDate(ds: string): string {
  const sid = (() => {
    if (ALL_OVERRIDES[ds]) return ALL_OVERRIDES[ds];
    const start = new Date(PROGRAM_START + 'T00:00:00');
    const d = new Date(ds + 'T00:00:00');
    const weekNum = Math.max(1, Math.floor((d.getTime() - start.getTime()) / 86400000 / 7) + 1);
    const dow = d.getDay();
    const dayKey = WEEK_DAYS_IDX[dow === 0 ? 6 : dow - 1];
    const phase = PHASES.find(p => weekNum >= p.weeks[0] && weekNum <= p.weeks[1]);
    if (!phase) return 'rest';
    return phase.template[dayKey] ?? 'rest';
  })();
  return SESSIONS[sid]?.type ?? 'rest';
}

function sessionShortForDate(ds: string): string {
  const sid = (() => {
    if (ALL_OVERRIDES[ds]) return ALL_OVERRIDES[ds];
    const start = new Date(PROGRAM_START + 'T00:00:00');
    const d = new Date(ds + 'T00:00:00');
    const weekNum = Math.max(1, Math.floor((d.getTime() - start.getTime()) / 86400000 / 7) + 1);
    const dow = d.getDay();
    const dayKey = WEEK_DAYS_IDX[dow === 0 ? 6 : dow - 1];
    const phase = PHASES.find(p => weekNum >= p.weeks[0] && weekNum <= p.weeks[1]);
    if (!phase) return 'rest';
    return phase.template[dayKey] ?? 'rest';
  })();
  return SESSIONS[sid]?.short ?? 'Repos';
}

function RoutinePanel({ title, exos, note }: { title: string; exos: Exo[]; note?: string }) {
  return (
    <div className="mob-routine">
      <div className="mob-routine-title">{title}</div>
      {exos.map((ex, i) => (
        <div key={i} className="mob-ex">
          <div className="mob-ex-top">
            <span className="mob-ex-name">{ex.name}</span>
            <span className="mob-ex-dur">{ex.dur}</span>
          </div>
          <div className="mob-ex-detail">{ex.detail}</div>
          {ex.tag && <span className="mob-ex-tag">{ex.tag}</span>}
        </div>
      ))}
      {note && <div className="mob-routine-note">{note}</div>}
    </div>
  );
}

export default function MissionList({ missions, onToggle, date }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const dl = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const sessionType = sessionTypeForDate(date);
  const sessionShort = sessionShortForDate(date);
  const eveningExos = EVENING[sessionType] ?? EVENING.rest;

  function toggleExpand(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setOpenId(prev => prev === id ? null : id);
  }

  return (
    <section>
      <div className="shead"><h2>Missions du jour</h2><span className="hint">{dl}</span></div>
      <div className="item-list">
        {DAILY.map(t => {
          const done = !!missions[t.id];
          const isMatin = t.id === 'mob_matin';
          const isSoir = t.id === 'mob_soir';
          const isExpandable = isMatin || isSoir;
          const isOpen = openId === t.id;

          return (
            <div key={t.id}>
              <div
                className={`item${done ? ' done' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => onToggle(t.id, !done)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(t.id, !done); } }}
              >
                <div className="item-box">{CHECK_SVG}</div>
                <div className="item-txt">{t.txt}</div>
                {isExpandable && (
                  <button
                    className="mob-expand-btn"
                    onClick={e => toggleExpand(t.id, e)}
                    aria-label="Voir les exercices"
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points={isOpen ? '5 13 10 8 15 13' : '5 8 10 13 15 8'} />
                    </svg>
                  </button>
                )}
                <div className="item-xp">+{t.xp}</div>
              </div>

              {isMatin && isOpen && (
                <RoutinePanel
                  title="Réveil mobilité — 8 min, avant de sortir du lit ou juste après"
                  exos={MORNING_ROUTINE}
                  note="Respire lentement. Si une zone résiste, reste — ne force pas au-delà du confort."
                />
              )}

              {isSoir && isOpen && (
                <RoutinePanel
                  title={`Étirements soir — ${sessionType === 'rest' ? 'Repos' : sessionShort} · avant de dormir`}
                  exos={eveningExos}
                  note="Froid ou chaud après la séance : les deux marchent. L'important c'est de le faire."
                />
              )}
            </div>
          );
        })}
      </div>

      {(() => {
        const allDone = DAILY.every(t => !!missions[t.id]);
        const remaining = DAILY.filter(t => !missions[t.id]).length;
        return (
          <div className={`daily-bonus${allDone ? ' done' : ''}`}>
            {allDone ? (
              <>
                <span className="daily-bonus-icon">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--tide)'}}>
                    <polyline points="13 2 7 11 11 11 7 18" />
                  </svg>
                </span>
                <span className="daily-bonus-txt">Journée parfaite — Bonus <strong>+{DAILY_BONUS} XP</strong> gagné !</span>
              </>
            ) : (
              <>
                <span className="daily-bonus-icon">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'var(--dawn)'}}>
                    <circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="3" />
                  </svg>
                </span>
                <span className="daily-bonus-txt">
                  {remaining === 1 ? 'Plus qu\'une mission' : `${remaining} missions restantes`} → Bonus <strong>+{DAILY_BONUS} XP</strong>
                </span>
              </>
            )}
          </div>
        );
      })()}
    </section>
  );
}
