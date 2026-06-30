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

interface Exo { name: string; detail: string; dur: string; tag?: string; section?: boolean }

// ── ROUTINE MATIN PAR SESSION ─────────────────────────────────────────────────
// Chaque session a sa préparation matinale ciblée (~8 min).
const MORNING_ROUTINE: Exo[] = [
  { name: 'Cat-Cow', detail: '4 pattes, ondulation dos creux → dos rond. Réveille la colonne et mobilise les hanches.', dur: '10 reps' },
  { name: 'Cercles de hanches debout', detail: 'Mains sur les crêtes iliaques, grands cercles de bassin dans chaque sens. Active l\'aine.', dur: '10× / sens', tag: 'Pubalgie' },
  { name: 'Pompages de cheville', detail: 'Assis ou allongé — flex / extension lente des deux chevilles. Réveille la chaîne tibias-mollets.', dur: '20× / pied', tag: 'Périostites' },
  { name: 'Fente basse genou à terre', detail: 'Genou arrière au sol. Bascule doucement le bassin vers l\'avant. Psoas + avant de la hanche.', dur: '30 s / côté', tag: 'Pubalgie' },
  { name: 'Rotation thoracique en fente', detail: 'Depuis la fente : main derrière la nuque, rotation vers le ciel × 5, puis tenu. Déverrouille la colonne.', dur: '5× puis 20 s / côté' },
];

const MORNING_BY_SESSION: Record<string, Exo[]> = {
  renfo_salle_a: [
    { name: 'Pompages de cheville', detail: 'Assis ou allongé, flex/extension lente des deux chevilles. Réveille la chaîne tibias-mollets avant les calf raises + tibial raises du jour.', dur: '20× / pied', tag: 'Périostites' },
    { name: 'Cercles de hanches debout', detail: 'Grands cercles de bassin dans chaque sens. Mobilise l\'aine avant la machine adducteurs — indispensable pubalgie.', dur: '10× / sens', tag: 'Pubalgie' },
    { name: 'Clam shells au sol', detail: 'Allongé sur le côté, genoux fléchis à 90°. Ouvrir le genou du dessus comme une palourde sans bouger le bassin. Active le fessier moyen avant les abducteurs et hip hitches.', dur: '10× / côté' },
    { name: 'Fente basse genou à terre', detail: 'Psoas + avant de la hanche. Basculer le bassin vers l\'avant doucement. Prépare leg press et hip thrust.', dur: '30 s / côté', tag: 'Pubalgie' },
    { name: 'Cat-Cow', detail: '4 pattes, ondulation dos creux → dos rond. Libère les lombaires avant le leg press et le hip thrust.', dur: '10 reps' },
  ],
  renfo_salle_b: [
    { name: 'Pompages de cheville', detail: 'Maintien MTSS quotidien. Réveille la chaîne tibias avant les step-ups et calf raises du jour.', dur: '20× / pied', tag: 'Périostites' },
    { name: 'Rotation d\'épaule en cercle', detail: 'Bras pendant, grands cercles lents avant puis arrière. Lubrifie la coiffe des rotateurs avant lat pulldown et rowing.', dur: '10× avant · 10× arrière' },
    { name: 'Pendule d\'épaule', detail: 'Penché en avant, bras suspendu, petits cercles passifs (gravité seulement). Décomprime l\'articulation avant la traction.', dur: '30 s / bras' },
    { name: 'Cercles de hanches debout', detail: 'Maintien mobilité aine — 2e séance de la semaine. L\'aine reste mobile entre lundi et mercredi.', dur: '10× / sens', tag: 'Pubalgie' },
    { name: 'Rotation thoracique en fente', detail: 'Depuis la fente, main derrière la nuque, 5 rotations vers le ciel. Ouvre la cage thoracique pour le rowing et le tirage.', dur: '5× puis 20 s / côté' },
  ],
  renfo_salle_c: [
    { name: 'Pompages de cheville', detail: 'Maintien MTSS. Réveille les mollets et tibias avant les calf raises unijambistes.', dur: '20× / pied', tag: 'Périostites' },
    { name: 'Fente basse genou à terre', detail: 'PRIORITÉ avant le Bulgarian split squat — ouvre le psoas et l\'avant de la hanche pour descendre correctement sans compenser.', dur: '45 s / côté', tag: 'Pubalgie' },
    { name: 'Leg swing latéral', detail: 'Debout, une main au mur. Balancer la jambe libre de gauche à droite en croisant le corps. Active adducteurs + abducteurs avant la séance.', dur: '15× / jambe' },
    { name: 'Cercles de hanches debout', detail: 'Maintien mobilité aine — 3e et dernier passage de la semaine.', dur: '10× / sens', tag: 'Pubalgie' },
    { name: 'Rotation thoracique en fente', detail: 'Prépare la colonne pour le RDL (dos droit = technique). 5 rotations lentes.', dur: '5× puis 20 s / côté' },
  ],
  bike_salle: [
    { name: 'Rotation lombaire allongée', detail: 'Sur le dos, genoux pliés, les faire tomber doucement d\'un côté puis l\'autre. Le vélo comprime les lombaires — décompresser avant de monter en selle.', dur: '8× / côté' },
    { name: 'Fente basse genou à terre', detail: 'Psoas = fléchisseur de hanche = muscle n°1 comprimé en position vélo. Ouvrir avant la selle.', dur: '45 s / côté' },
    { name: 'Cercles de hanches debout', detail: 'Mobilisation de la hanche dans tous les plans avant le pédalage.', dur: '10× / sens', tag: 'Pubalgie' },
    { name: 'Pompages de cheville', detail: 'Mollets travaillent en continu au vélo. Activation avant = moins de tensions pendant.', dur: '20× / pied', tag: 'Périostites' },
    { name: 'Rotation thoracique en fente', detail: 'La position aéro verrouille la colonne — la déverrouiller avant.', dur: '5× puis 20 s / côté' },
  ],
  swim_apprivoiser: [
    { name: 'Rotation d\'épaule en cercle', detail: 'Grands cercles avant puis arrière. Le crawl sollicite la coiffe des rotateurs à chaque bras — la préparer avant l\'eau.', dur: '10× avant · 10× arrière' },
    { name: 'Pectoraux contre encadrement de porte', detail: 'Main à hauteur d\'épaule contre le mur, rotation du buste vers l\'extérieur. Ouvre la poitrine pour l\'entrée de bras en crawl.', dur: '20 s / côté' },
    { name: 'Rotation thoracique en fente', detail: 'Crawl = rotation de tronc à chaque coup de bras. Préparer cette rotation le matin améliore la technique directement.', dur: '5× puis 20 s / côté' },
    { name: 'Pompages de cheville', detail: 'Protocole MTSS quotidien — même les jours nage (zéro impact = pas de relâche sur la prévention).', dur: '20× / pied', tag: 'Périostites' },
    { name: 'Cercles de hanches debout', detail: 'Maintien mobilité. Le crawl sollicite peu les hanches — les entretenir le matin.', dur: '10× / sens', tag: 'Pubalgie' },
  ],
};

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

function sessionIdForDate(ds: string): string {
  if (ALL_OVERRIDES[ds]) return ALL_OVERRIDES[ds];
  const start = new Date(PROGRAM_START + 'T00:00:00');
  const d = new Date(ds + 'T00:00:00');
  const weekNum = Math.max(1, Math.floor((d.getTime() - start.getTime()) / 86400000 / 7) + 1);
  const dow = d.getDay();
  const dayKey = WEEK_DAYS_IDX[dow === 0 ? 6 : dow - 1];
  const phase = PHASES.find(p => weekNum >= p.weeks[0] && weekNum <= p.weeks[1]);
  if (!phase) return 'rest';
  return phase.template[dayKey] ?? 'rest';
}

function sessionTypeForDate(ds: string): string {
  return SESSIONS[sessionIdForDate(ds)]?.type ?? 'rest';
}

function sessionShortForDate(ds: string): string {
  return SESSIONS[sessionIdForDate(ds)]?.short ?? 'Repos';
}

// Étirements soir par session ID (priorité sur le type)
const EVENING_BY_SESSION: Record<string, Exo[]> = {
  renfo_salle_a: [
    { name: 'Pubalgie — hanches + aine', detail: '', dur: '', section: true },
    { name: 'Pigeon au sol', detail: 'Jambe avant pliée à 90°, jambe arrière tendue. Pesanteur qui fait le travail — ne pas forcer.', dur: '60 s / côté', tag: 'Pubalgie' },
    { name: 'Adducteur allongé', detail: 'Sur le dos, jambe tendue qui s\'ouvre lentement sur le côté, talon glissant au sol. Intérieur de la cuisse — pas l\'aine.', dur: '45 s / côté', tag: 'Pubalgie' },
    { name: 'Psoas — fente genou à terre', detail: 'Genou arrière au sol, bassin vers l\'avant. Respire et laisse la hanche descendre à chaque expire.', dur: '45 s / côté' },
    { name: 'MTSS — tibias + mollets', detail: '', dur: '', section: true },
    { name: 'Mollet genou tendu', detail: 'Talon contre une marche ou mur, jambe tendue. Gastrocnémien — directement impliqué dans les périostites.', dur: '45 s / côté', tag: 'Périostites' },
    { name: 'Mollet genou fléchi (soléaire)', detail: 'Même position, genou légèrement plié. Soléaire = muscle n°1 des périostites. Ne jamais sauter.', dur: '45 s / côté', tag: 'Périostites' },
    { name: 'Massage plantaire', detail: 'Balle de tennis sous le pied, rouler lentement de la voûte vers le talon. Fascia plantaire → tibias.', dur: '1-2 min / pied' },
    { name: 'Core — abdos', detail: '', dur: '', section: true },
    { name: 'Crunch classique', detail: 'Dos au sol, genoux fléchis. Décoller les épaules en expirant — bas du dos reste au sol.', dur: '3 × 15' },
    { name: 'Crunch bicycle', detail: 'Coude droit vers genou gauche en alternance. Rotation contrôlée, ne pas tirer sur la nuque.', dur: '3 × 12 / côté' },
    { name: 'Crunch inversé (jambes)', detail: 'Sur le dos, jambes à 90°. Soulever le bassin en amenant les genoux vers la poitrine, redescendre lentement.', dur: '3 × 12' },
    { name: 'Épaule droite — avant nage demain', detail: '', dur: '', section: true },
    { name: 'Étirement épaule croisée', detail: 'Bras droit passé devant la poitrine, bras gauche retient. Arrière de l\'épaule (deltoïde postérieur). Insiste côté droit.', dur: '45 s × 2 / côté' },
    { name: 'Sleeper stretch', detail: 'Allongé sur le côté droit, bras à 90°. Main gauche appuie doucement le poignet vers le sol. Gêne légère OK, douleur = stop.', dur: '30 s × 2 côté droit', tag: 'Épaule' },
    { name: 'Rotation d\'épaule en cercle', detail: 'Bras pendant, grands cercles lents avant puis arrière. Lubrifie l\'articulation avant la nage crawl de demain.', dur: '10× avant · 10× arrière' },
    { name: 'Récupération — anti-courbatures', detail: '', dur: '', section: true },
    { name: 'Boire 500 ml d\'eau', detail: 'Dans l\'heure qui suit la séance. Muscle déshydraté = courbatures amplifiées.', dur: 'Dans l\'heure' },
    { name: 'Protéines avant de dormir', detail: 'Œufs, blanc de poulet, yaourt végétal — vise 20-30 g. Synthèse musculaire a lieu la nuit.', dur: 'Ce soir' },
    { name: 'Froid sur l\'épaule si sensible', detail: 'Glaçons dans un torchon, 10-15 min max. Pas à même la peau.', dur: '10-15 min si besoin', tag: 'Épaule' },
  ],
  renfo_salle_b: [
    { name: 'Dos + épaules — après lat pulldown + rowing', detail: '', dur: '', section: true },
    { name: 'Grand dorsal', detail: 'Bras tendu au-dessus, main accrochée à un bord ou encadrement. Inclinaison latérale douce — sentir le flanc et le dos s\'ouvrir.', dur: '30 s / côté' },
    { name: 'Épaule croisée', detail: 'Bras passé devant la poitrine, l\'autre bras retient. Deltoïde postérieur + face pull = arrière épaule à relâcher.', dur: '30 s / côté' },
    { name: 'Rotation lombaire allongée', detail: 'Sur le dos, genoux pliés à 90°, les faire tomber d\'un côté. Step-up et SL-RDL sollicitent le dos — décompression.', dur: '8× / côté' },
    { name: 'MTSS — tibias (séance principale)', detail: '', dur: '', section: true },
    { name: 'Mollet genou tendu', detail: 'Talon contre une marche, jambe tendue. Gastrocnémien. Séance B = plus de volume MTSS — bien étirer après.', dur: '60 s / côté', tag: 'Périostites' },
    { name: 'Mollet genou fléchi (soléaire)', detail: 'Même position, genou légèrement plié. Soléaire = priorité absolue après les calf raises assis. Ne jamais sauter.', dur: '60 s / côté', tag: 'Périostites' },
    { name: 'Massage plantaire', detail: 'Balle de tennis, rouler lentement de la voûte vers le talon. Soulage les tibias via le fascia plantaire.', dur: '2 min / pied' },
    { name: 'Hanches + Pubalgie', detail: '', dur: '', section: true },
    { name: 'Fessier moyen — étirement latéral', detail: 'Sur le dos, genou droit vers la poitrine et croiser vers la gauche (la main gauche tient le genou). Étire le fessier moyen et TFL — muscles qui travaillent dans les hip hitches.', dur: '45 s / côté' },
    { name: 'Pigeon au sol', detail: 'Jambe avant à 90°, jambe arrière tendue. Récupération après hip hitches et step-ups.', dur: '60 s / côté', tag: 'Pubalgie' },
    { name: 'Adducteur allongé', detail: 'Sur le dos, jambe tendue qui s\'ouvre doucement. Maintien pubalgie — ne jamais sauter.', dur: '45 s / côté', tag: 'Pubalgie' },
  ],
  renfo_salle_c: [
    { name: 'Chaîne postérieure — après RDL + Bulgarian', detail: '', dur: '', section: true },
    { name: 'Ischio-jambiers debout', detail: 'Talon sur une chaise ou marche, dos droit, buste incliné vers l\'avant. RDL et BSS contractent fort les ischio — les étirer est obligatoire.', dur: '45 s / côté' },
    { name: 'Quadriceps debout', detail: 'Talon vers les fesses, genou pointé vers le bas. Bulgarian split squat = gros travail quad — les relâcher après.', dur: '45 s / côté' },
    { name: 'Fléchisseur de hanche', detail: 'Fente genou à terre, bassin vers l\'avant. BSS contracte l\'avant de la hanche — décompresser.', dur: '45 s / côté' },
    { name: 'MTSS — tibias', detail: '', dur: '', section: true },
    { name: 'Mollet genou tendu', detail: 'Après calf raises unijambiste excentrique — gastrocnémien obligatoire.', dur: '60 s / côté', tag: 'Périostites' },
    { name: 'Mollet genou fléchi (soléaire)', detail: 'Soléaire = priorité absolue. Fin de semaine — les mollets ont travaillé 3× cette semaine.', dur: '60 s / côté', tag: 'Périostites' },
    { name: 'Pubalgie — fin de semaine', detail: '', dur: '', section: true },
    { name: 'Adducteur allongé', detail: 'Sur le dos, jambe tendue qui s\'ouvre doucement. 3e et dernier passage de la semaine — bien s\'y attarder.', dur: '45 s / côté', tag: 'Pubalgie' },
    { name: 'Pigeon au sol', detail: 'Fin de semaine = le meilleur moment pour un pigeon long. Laisser la pesanteur travailler 60 s.', dur: '60 s / côté', tag: 'Pubalgie' },
    { name: 'Massage plantaire', detail: 'Balle de tennis, 1-2 min par pied. Fin de semaine — les fascias sont chargés après 3 séances.', dur: '1-2 min / pied' },
  ],
};

function RoutinePanel({ title, exos, note }: { title: string; exos: Exo[]; note?: string }) {
  return (
    <div className="mob-routine">
      <div className="mob-routine-title">{title}</div>
      {exos.map((ex, i) => (
        ex.section
          ? <div key={i} className="mob-ex-section">{ex.name}</div>
          : <div key={i} className="mob-ex">
              <div className="mob-ex-top">
                <span className="mob-ex-name">{ex.name}</span>
                {ex.dur && <span className="mob-ex-dur">{ex.dur}</span>}
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

  const sessionId    = sessionIdForDate(date);
  const sessionType  = sessionTypeForDate(date);
  const sessionShort = sessionShortForDate(date);
  const eveningExos  = EVENING_BY_SESSION[sessionId] ?? EVENING[sessionType] ?? EVENING.rest;
  const morningExos  = MORNING_BY_SESSION[sessionId] ?? MORNING_ROUTINE;

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
                  title={`Réveil mobilité — ${sessionShort === 'Repos' ? 'Repos' : sessionShort} · 8 min au lever`}
                  exos={morningExos}
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
