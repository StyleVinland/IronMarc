// Programme d'entraînement complet pour Marc
// Pubalgie + périostites + 10 ans sans sport → Ironman en 2 ans
// Protocoles : Copenhagen (pubalgie) + MTSS (tibias) + progression cardio très douce

export const PROGRAM_START = '2026-06-19'; // Jour 1 : 25 m nagés

export type SessionType = 'renfo' | 'swim' | 'bike' | 'run' | 'mobility' | 'rest';

export interface Exercise {
  name: string;
  detail: string;
  sets?: string;
  warning?: boolean;
  required?: boolean;
}

export interface TrainingSession {
  id: string;
  label: string;
  short: string;
  type: SessionType;
  color: string;
  duration: string;
  desc: string;
  painCheck?: boolean; // afficher le check douleur avant
  exercises: Exercise[];
}

// ── SESSIONS ─────────────────────────────────────────────────────

export const SESSIONS: Record<string, TrainingSession> = {
  renfo_a: {
    id: 'renfo_a',
    label: 'Renfo A — Pubalgie',
    short: 'Renfo A',
    type: 'renfo',
    color: '#CF8E42',
    duration: '25 min',
    desc: 'Adducteurs + gainage — protocole Copenhagen progressif',
    painCheck: true,
    exercises: [
      { name: 'Échauffement', detail: 'Marche sur place, rotations hanches, 5 min', required: true },
      { name: 'Squeeze isométrique', detail: 'Ballon ou coussin entre les genoux — serrer 30 à 45 s, relâcher', sets: '5 reps', warning: false },
      { name: 'Adduction couché sur le côté', detail: 'Jambe du dessous qui monte lentement et redescend — amplitude modérée', sets: '2-3 × 10 / côté' },
      { name: 'Copenhagen (genou posé)', detail: 'Planche latérale, jambe du dessus pliée sur un appui bas (banc / chaise), soulever le bassin depuis le genou intérieur', sets: '2 × 6 / côté', warning: false },
      { name: 'Planche ventrale', detail: 'Sur les coudes, corps droit de la tête aux talons', sets: '3 × 20-40 s' },
      { name: 'Planche latérale', detail: 'Corps aligné, bras tendu ou sur le coude', sets: '3 × 15-25 s / côté' },
      { name: 'Dead bug', detail: 'Dos au sol, bras vers le plafond, genoux à 90°. Étendre bras droit + jambe gauche simultanément. Alterner.', sets: '3 × 8 / côté' },
      { name: 'Mobilité', detail: 'Fente basse tenue 30 s / côté, pigeon couché 30 s / côté', required: true },
    ],
  },

  renfo_b: {
    id: 'renfo_b',
    label: 'Renfo B — Tibias & Hanches',
    short: 'Renfo B',
    type: 'renfo',
    color: '#CF8E42',
    duration: '25 min',
    desc: 'Mollets + tibias + fessiers — protocole MTSS anti-périostites',
    painCheck: true,
    exercises: [
      { name: 'Échauffement', detail: 'Marche sur place, rotations chevilles × 10 dans chaque sens, 5 min', required: true },
      { name: 'Mollet genou tendu', detail: 'Debout, montée sur la pointe des pieds (gastrocnémiens)', sets: '3 × 12-15' },
      { name: 'Mollet genou fléchi', detail: 'Assis, talon au sol, monter sur la pointe (soléaire — le plus lié au tibia)', sets: '3 × 12-15' },
      { name: 'Excentrique mollet', detail: 'Monter sur 2 pieds, redescendre lentement sur 1 pied en 3-4 secondes. Contrôle total.', sets: '3 × 8 / côté', warning: false },
      { name: 'Tibialis raises', detail: 'Dos au mur, talons écartés du mur de 30 cm, lever les pointes de pied', sets: '3 × 15-20' },
      { name: 'Inversion cheville élastique', detail: 'Élastique autour du pied, tirer vers l\'intérieur contre résistance (tibial postérieur)', sets: '3 × 15 / côté' },
      { name: 'Clamshell', detail: 'Couché sur le côté, genoux pliés à 45°, ouvrir le genou du dessus comme une palourde', sets: '3 × 12 / côté' },
      { name: 'Pas latéraux élastique', detail: 'Élastique aux chevilles, pas latéraux contrôlés en position légèrement fléchie', sets: '3 × 12' },
      { name: 'Équilibre 1 pied', detail: 'Sur une jambe, regard fixe. Progresser : yeux ouverts → fermés → surface instable', sets: '3 × 30 s / côté' },
      { name: 'Mobilité', detail: 'Étirement mollets debout + assis, 30 s × 2 / côté', required: true },
    ],
  },

  swim: {
    id: 'swim',
    label: 'Natation',
    short: 'Nage',
    type: 'swim',
    color: '#6EC6D8',
    duration: '20-40 min selon semaine',
    desc: 'Priorité : technique + respiration. Allure très douce.',
    exercises: [
      { name: 'Flottaison ventrale', detail: 'Bras tendus devant, souffler doucement dans l\'eau — sentir le corps flotter horizontal', sets: '5 × 15 m' },
      { name: 'Battements pieds planche', detail: 'Planche devant, jambes qui battent — petite amplitude, chevilles relâchées', sets: '4 × 25 m' },
      { name: 'Crawl technique', detail: 'Allure très douce. 1 bras tire → rotation du corps → expiration dans l\'eau. Pas de précipitation.', sets: 'S1-4 : 50-100 m | S5-8 : 100-200 m | S9-16 : 200-300 m' },
      { name: 'Objectif Phase 1', detail: '200-300 m sans s\'arrêter d\'ici semaine 12. Marc a nagé 25 m le J1 — chaque longueur est une victoire.', required: true },
    ],
  },

  bike: {
    id: 'bike',
    label: 'Vélo appartement',
    short: 'Vélo',
    type: 'bike',
    color: '#88C49A',
    duration: '30-45 min',
    desc: 'Cadence souple, zéro impact articulaire. Ménage le pubis.',
    exercises: [
      { name: 'Échauffement', detail: 'Résistance nulle, 70 rpm, 5 min', required: true },
      { name: 'Corps de séance', detail: 'Résistance légère, 80-90 rpm, allure conversation (tu peux parler normalement)', sets: 'S1-4 : 20 min | S5-8 : 30 min | S9-16 : 35-40 min' },
      { name: 'Retour au calme', detail: 'Résistance nulle, 5 min', required: true },
      { name: 'Règle conversation', detail: 'Si tu ne peux plus parler en phrases complètes → tu vas trop vite. Ralentis.', warning: true },
    ],
  },

  walk: {
    id: 'walk',
    label: 'Marche',
    short: 'Marche',
    type: 'run',
    color: '#8A9870',
    duration: '20-30 min',
    desc: 'Sol souple. Disponible dès semaine 5 si douleurs tibiales absentes.',
    exercises: [
      { name: 'Marche douce', detail: 'Terrain plat, sol souple si possible (herbe, piste sablée). Chaussures running.', sets: '20-30 min' },
      { name: 'Écoute', detail: 'Gêne tibia ou aine > 4/10 → rentrer immédiatement. Ce n\'est pas un échec, c\'est de l\'intelligence.', warning: true },
    ],
  },

  run_walk: {
    id: 'run_walk',
    label: 'Marche / Course',
    short: 'MC',
    type: 'run',
    color: '#C26060',
    duration: '20-25 min',
    desc: '1 min course / 2 min marche. Seulement dès semaine 9, si marche indolore.',
    exercises: [
      { name: 'Échauffement', detail: '5 min de marche', required: true },
      { name: 'Intervalles', detail: '1 min course légère (conversation possible) / 2 min marche. 5 à 6 rounds.', sets: '~18 min' },
      { name: 'Retour calme', detail: '3-5 min marche', required: true },
      { name: 'Check tibia à 24h', detail: 'Si douleur tibiale persistante le lendemain → rester en marche pure, pas de course.', warning: true },
    ],
  },

  rest: {
    id: 'rest',
    label: 'Repos',
    short: 'Repos',
    type: 'rest',
    color: '#4A4845',
    duration: '',
    desc: 'Le repos est une mission accomplie, pas un échec. C\'est là que le corps se reconstruit.',
    exercises: [],
  },
};

// ── PHASES & TEMPLATES ────────────────────────────────────────────

export type WeekDay = 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim';
export const WEEK_DAYS: WeekDay[] = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  lun: 'Lun', mar: 'Mar', mer: 'Mer', jeu: 'Jeu', ven: 'Ven', sam: 'Sam', dim: 'Dim',
};

export interface ProgramPhase {
  id: string;
  label: string;
  weeks: [number, number]; // inclusive
  tagline: string;
  focus: string[];
  template: Record<WeekDay, string>; // session id
  notes: string[];
}

export const PHASES: ProgramPhase[] = [
  {
    id: 'p1a',
    label: 'Phase 1A — Fondations',
    weeks: [1, 4],
    tagline: 'Poser les bases sans se blesser',
    focus: ['Renforcement A+B', 'Technique natation', 'Vélo doux', 'Pas de course'],
    template: {
      lun: 'renfo_a',
      mar: 'swim',
      mer: 'renfo_b',
      jeu: 'bike',
      ven: 'renfo_a',
      sam: 'swim',
      dim: 'rest',
    },
    notes: [
      'Aucune course à pied — le tibia et l\'aine doivent se reconditionner d\'abord.',
      'Natation : priorité technique + respiration, pas la distance.',
      'Vélo : cadence 80-90 rpm, résistance légère, jamais douloureux à l\'aine.',
      'Si une journée est mauvaise (fatigue, douleur) → déplacer la séance ou la supprimer. Pas de rattrapage 7j/7.',
    ],
  },
  {
    id: 'p1b',
    label: 'Phase 1B — Introduction marche',
    weeks: [5, 8],
    tagline: 'Introduire la marche si tibias silencieux',
    focus: ['Renforcement A+B', 'Marche progressive', 'Natation 100-200 m', 'Vélo 30 min'],
    template: {
      lun: 'renfo_a',
      mar: 'swim',
      mer: 'renfo_b',
      jeu: 'bike',
      ven: 'walk',
      sam: 'swim',
      dim: 'rest',
    },
    notes: [
      'La marche (20-30 min) remplace une séance de renfo le vendredi si les tibias sont silencieux.',
      'Critère : marche quotidienne sans douleur tibiale → marche séance OK.',
      'Copenhagen : viser niveau 3-4 en fin de cette phase.',
      'Natation : atteindre 100-150 m sans s\'arrêter.',
    ],
  },
  {
    id: 'p1c',
    label: 'Phase 1C — Marche/Course',
    weeks: [9, 16],
    tagline: 'Premiers pas de course — ultra-progressif',
    focus: ['Marche/Course 1-2 min', 'Natation 200-300 m', 'Vélo 40 min', 'Renfo maintien'],
    template: {
      lun: 'renfo_a',
      mar: 'swim',
      mer: 'run_walk',
      jeu: 'bike',
      ven: 'renfo_b',
      sam: 'swim',
      dim: 'rest',
    },
    notes: [
      'Critère marche/course : marcher 30 min sans douleur tibiale ni inguinale.',
      'Si les tibias protestent → rester en marche pure. Aucune précipitation.',
      'Natation : viser 200-300 m continus en fin de phase.',
      'Vélo : augmenter à 35-40 min. Toujours allure conversation.',
    ],
  },
  {
    id: 'p2',
    label: 'Phase 2 — Construction',
    weeks: [17, 36],
    tagline: 'Augmenter le volume et acquérir le vélo de route',
    focus: ['Course 5-10 min blocs', 'Natation 400-800 m', 'Vélo route (à prévoir)', 'Enchaînements'],
    template: {
      lun: 'renfo_a',
      mar: 'swim',
      mer: 'run_walk',
      jeu: 'bike',
      ven: 'run_walk',
      sam: 'swim',
      dim: 'rest',
    },
    notes: [
      'Acquisition du vélo de route envisagée en Phase 2 (basculer vélo salle → route).',
      'Course : progression 1 min / 2 min → 2 min / 1 min → 5 min continus.',
      'Continuer le renforcement 2x/semaine indéfiniment — c\'est la protection des blessures.',
    ],
  },
  {
    id: 'p3',
    label: 'Phase 3 — Endurance',
    weeks: [37, 72],
    tagline: 'Vraies séances longues, premier triathlon sprint',
    focus: ['Course 20-30 min', 'Natation 1500 m', 'Vélo 60-90 min', 'Premier triathlon Sprint'],
    template: {
      lun: 'renfo_a',
      mar: 'swim',
      mer: 'run_walk',
      jeu: 'bike',
      ven: 'run_walk',
      sam: 'swim',
      dim: 'rest',
    },
    notes: [
      'Objectif intermédiaire : triathlon Sprint (750 m nage / 20 km vélo / 5 km course).',
      'Obtenir la licence FFTRI et le certificat médical.',
      'Feu vert médical pour l\'effort d\'endurance à demander dès que possible.',
    ],
  },
  {
    id: 'p4',
    label: 'Phase 4 — Ironman',
    weeks: [73, 104],
    tagline: 'Préparation spécifique Ironman',
    focus: ['Nage 3,8 km', 'Vélo 180 km', 'Course 42 km', 'Enchaînements'],
    template: {
      lun: 'renfo_a',
      mar: 'swim',
      mer: 'run_walk',
      jeu: 'bike',
      ven: 'run_walk',
      sam: 'swim',
      dim: 'rest',
    },
    notes: [
      'Programme spécifique Ironman à adapter avec un coach triathlon en Phase 4.',
      '3,8 km nage / 180 km vélo / 42,195 km course.',
    ],
  },
];

// ── SURCHARGES PONCTUELLES ────────────────────────────────────────
// Séances hors template pour des dates précises
// Nage du 20/06 manquée → prochaine nage naturellement mardi 23/06 (template mar = swim)
export const DATE_OVERRIDES: Record<string, string> = {
  '2026-06-21': 'renfo_a',  // Dimanche de rattrapage — renfo pubalgie
};

// ── HELPERS ───────────────────────────────────────────────────────

export function getCurrentWeek(): number {
  const start = new Date(PROGRAM_START);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.floor(diffDays / 7) + 1);
}

export function getCurrentPhase(week: number): ProgramPhase {
  return PHASES.find(p => week >= p.weeks[0] && week <= p.weeks[1]) ?? PHASES[PHASES.length - 1];
}

export function getTodaySession(phase: ProgramPhase): string {
  const dow = new Date().getDay(); // 0 = dimanche
  const dayMap: Record<number, WeekDay> = { 1: 'lun', 2: 'mar', 3: 'mer', 4: 'jeu', 5: 'ven', 6: 'sam', 0: 'dim' };
  return phase.template[dayMap[dow]] ?? 'rest';
}
