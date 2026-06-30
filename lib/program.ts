// Programme d'entraînement Marc — Pubalgie + périostites + 10 ans sans sport → Ironman 2 ans
// Protocoles : Copenhagen (pubalgie) · MTSS (tibias) · règle des 10 % (course) · Zone 2 (cardio)

export const PROGRAM_START = '2026-06-19';

export type SessionType = 'renfo' | 'swim' | 'bike' | 'run' | 'brick' | 'rest';
export type WeekDay = 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim';
export const WEEK_DAYS: WeekDay[] = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  lun: 'Lun', mar: 'Mar', mer: 'Mer', jeu: 'Jeu', ven: 'Ven', sam: 'Sam', dim: 'Dim',
};

export interface Exercise {
  name: string;
  detail: string;
  sets?: string;
  warning?: boolean;
  required?: boolean;
  section?: boolean; // séparateur de section visuel (pas un vrai exercice)
}

export interface TrainingSession {
  id: string;
  label: string;
  short: string;
  type: SessionType;
  color: string;
  duration: string;
  desc: string;
  painCheck?: boolean;
  exercises: Exercise[];
}

export interface ProgramPhase {
  id: string;
  label: string;
  weeks: [number, number];
  tagline: string;
  focus: string[];
  template: Record<WeekDay, string>;
  notes: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONS
// ─────────────────────────────────────────────────────────────────────────────

export const SESSIONS: Record<string, TrainingSession> = {

  // ── RENFORCEMENT ──────────────────────────────────────────────────────────

  renfo_a: {
    id: 'renfo_a', label: 'Renfo A — Pubalgie', short: 'Renfo A',
    type: 'renfo', color: '#FF9500', duration: '25 min',
    desc: 'Adducteurs + gainage — protocole Copenhagen progressif',
    painCheck: true,
    exercises: [
      { name: 'Échauffement', detail: 'Marche sur place, rotations hanches × 10, 5 min', required: true },
      { name: 'Squeeze isométrique', detail: 'Ballon entre les genoux, serrer 30-45 s, relâcher', sets: '5 reps' },
      { name: 'Adduction couché côté', detail: 'Jambe du dessous qui monte lentement — amplitude modérée', sets: '3 × 10 / côté' },
      { name: 'Copenhagen genou (niveau 1→3)', detail: 'Planche latérale, jambe du dessus pliée sur appui bas. Soulever le bassin. Augmenter durée chaque semaine.', sets: '2 × 6-10 / côté', warning: false },
      { name: 'Planche ventrale', detail: 'Corps droit, sur les coudes', sets: '3 × 20-45 s' },
      { name: 'Dead bug', detail: 'Dos au sol, étendre bras droit + jambe gauche en alternance, dos collé au sol', sets: '3 × 8 / côté' },
      { name: 'Pompes larges — pectoraux', detail: 'Mains plus larges que les épaules (environ 1,5× la largeur). Corps gainé, coudes s\'ouvrent vers l\'extérieur à ~70°. L\'écartement travaille la partie externe des pectoraux. Si trop dur : genoux au sol.', sets: '50 au total (fractionne comme tu veux)', required: true },
      { name: 'Crunch classique', detail: 'Dos au sol, genoux fléchis, mains derrière la nuque ou croisées sur la poitrine. Décoller les épaules en expirant — le bas du dos reste au sol.', sets: '3 × 15' },
      { name: 'Crunch bicycle', detail: 'Même position, coude droit vers genou gauche en alternance. Rotation contrôlée — ne pas tirer sur la nuque.', sets: '3 × 12 / côté' },
      { name: 'Mobilité', detail: 'Fente basse 30 s / côté, pigeon couché 30 s / côté', required: true },
    ],
  },

  renfo_b: {
    id: 'renfo_b', label: 'Renfo B — Tibias & Hanches', short: 'Renfo B',
    type: 'renfo', color: '#FF9500', duration: '25 min',
    desc: 'Mollets + tibias + fessiers — protocole MTSS anti-périostites',
    painCheck: true,
    exercises: [
      { name: 'Échauffement', detail: 'Rotations chevilles × 10 par sens, marche sur place, 5 min', required: true },
      { name: 'Mollet genou tendu', detail: 'Montée sur pointe des pieds (gastrocnémiens)', sets: '3 × 15' },
      { name: 'Mollet genou fléchi', detail: 'Assis, talon au sol, monter sur la pointe (soléaire — lié au tibia)', sets: '3 × 15' },
      { name: 'Excentrique mollet', detail: 'Monter sur 2 pieds, descendre lentement sur 1 seul (3-4 sec). Contrôle total.', sets: '3 × 8 / côté' },
      { name: 'Tibialis raises', detail: 'Dos au mur, talons à 30 cm, lever les pointes de pied', sets: '3 × 20' },
      { name: 'Clamshell', detail: 'Couché sur le côté, genoux à 45°, ouvrir le genou du dessus', sets: '3 × 12 / côté' },
      { name: 'Équilibre 1 pied', detail: 'Sur une jambe, regard fixe. Progresser : yeux ouverts → fermés → surface instable', sets: '3 × 30 s / côté' },
      { name: 'Pompes serrées / diamant — triceps', detail: 'Mains proches l\'une de l\'autre sous la poitrine, pouces et index formant un losange (ou juste mains côte à côte). Coudes restent collés contre le corps pendant la descente. Isole le triceps. Si trop dur : écarter légèrement les mains mais garder les coudes serrés.', sets: '50 au total (fractionne comme tu veux)', required: true },
      { name: 'Crunch classique', detail: 'Dos au sol, genoux fléchis, mains derrière la nuque ou croisées sur la poitrine. Décoller les épaules en expirant — le bas du dos reste au sol.', sets: '3 × 15' },
      { name: 'Crunch bicycle', detail: 'Même position, coude droit vers genou gauche en alternance. Rotation contrôlée — ne pas tirer sur la nuque.', sets: '3 × 12 / côté' },
      { name: 'Mobilité', detail: 'Étirement mollet debout + assis, 30 s × 2 / côté', required: true },
    ],
  },

  renfo_salle_a: {
    id: 'renfo_salle_a', label: 'Renfo Salle A — Bas du corps + Pubalgie', short: 'Salle A',
    type: 'renfo', color: '#FF9500', duration: '60-70 min',
    desc: 'Lundi · Protocole Hölmich (adducteurs progressif) + bas du corps complet + gainage. Haut du corps → séance B jeudi.',
    painCheck: true,
    exercises: [
      { name: 'Progression des charges — à lire', detail: 'Les séries et reps sont fixes (3×10/12/15). Ce qui évolue semaine après semaine c\'est la CHARGE. S1-2 : charge à 50% — finir en pensant "j\'aurais pu faire plus". S3-4 : +charge si les 3 séries finissent sans effort. S5+ : +2,5 à 5 kg/semaine sur les exercices qui le permettent. Semaines 4 et 8 : charge -20% (semaine de décharge — les tendons consolident).', sets: '', warning: true, required: true },
      { name: 'Avec matériel — machines + poids', detail: '', sets: '', section: true },
      { name: 'Vélo stationnaire — échauffement', detail: 'S1-2 : 8 min · S3+ : 10 min. Cadence 80-90 RPM, résistance légère. Activation hanches + mollets avant le travail adducteurs.', required: true },
      { name: 'Adduction isométrique — balle entre les genoux (Hölmich P1)', detail: 'Sur le dos, genoux fléchis à 90°, coussin entre les genoux. Serrer doucement et maintenir 10 sec. Exercice thérapeutique léger — pas de douleur. S1-4 : PRIORITÉ avant la machine.', sets: '5 × 10 maintiens × 10 sec · récup 90 s', warning: true },
      { name: 'Machine adducteurs — RAPPROCHER', detail: 'Amplitude contrôlée (pas en bout de course). Tempo 1 sec concentrique / 3 sec excentrique. Jamais > 3/10 douleur. Progression : S1-2 charge minimale · +2,5 kg/semaine si totalement indolore.', sets: '3 × 12 · récup 60 s', warning: true },
      { name: 'Machine abducteurs — ÉCARTER', detail: 'Fessier moyen = stabilisateur du bassin. Réduit le cisaillement de la symphyse pubienne. Progression charge : facile S1-2, modérée S3+.', sets: '3 × 12' },
      { name: 'Leg press pieds écartés', detail: 'Pointes légèrement ouvertes, descendre à 90°. Sans douleur à l\'aine. Progression : charge très légère S1-2 → +charge progressive dès S3.', sets: '3 × 10' },
      { name: 'Leg curl machine — ischio-jambiers', detail: 'Ramener les talons lentement. Chaîne postérieure = protection genou + périostites. Progression charge semaine après semaine.', sets: '3 × 12' },
      { name: 'Hip thrust machine ou banc', detail: 'Dos appuyé sur un banc, pousser le bassin vers le haut. S1-2 : poids du corps. S3+ : ajouter charge (+5 kg/semaine si facile).', sets: '3 × 10' },
      { name: 'Pompes déclinées — haut pecs + deltoïdes', detail: 'Pieds sur un banc, mains au sol. Si déclinées trop dures les premières séances → pompes normales d\'abord. Viser 50 reps au total (ex : 3×15+5 de finisher). Progression : +reps chaque semaine.', sets: '50 au total · démarrer à 3 × 6 si besoin', required: true },
      { name: 'Sans matériel — gainage + pubalgie', detail: '', sets: '', section: true },
      { name: 'Copenhagen genou sur banc (Hölmich P3)', detail: 'Planche latérale, jambe du dessus posée sur un banc, genou fléchi. NE PAS FAIRE avant S7 — introduire uniquement si S1-6 sans douleur à l\'aine. S7-10 : genou. S11+ : pied si indolore.', sets: 'S7+ : 2 × 5 / côté → 3 × 8 / côté · récup 90 s', warning: true },
      { name: 'Pont fessier unijambiste — Hölmich gainage', detail: 'Sur le dos, 1 pied au sol genou fléchi. Pousser le bassin vers le haut. S1-4 : pont bilatéral (2 pieds) si l\'unilatéral est trop instable — puis passer à 1 jambe dès que maîtrisé.', sets: '3 × 12 sec / côté' },
      { name: 'Dead bug — gainage profond', detail: 'Sur le dos, bras vers le plafond, hanches + genoux à 90°. Étendre bras D + jambe G sans creuser le dos. Progression : +1 rep/semaine.', sets: '3 × 8 / côté' },
      { name: 'Planche RKC', detail: 'Sur les coudes, serrer les poings, contracter fessiers + abdos. Progression : +5 sec/semaine. Remplace les crunchs classiques (contre-indiqués en pubalgie).', sets: '3 × 20 s → 3 × 30 s' },
      { name: 'MTSS — tibias + hanches', detail: '', sets: '', section: true },
      { name: 'Tibial raises contre mur', detail: 'Dos au mur, talons à 10 cm. Soulever les pointes des pieds le plus haut. Renforce le tibial antérieur — réduit sa traction sur le périoste à la course. Pas de machine pour cet exercice, uniquement au mur. Progression : +2 reps/semaine.', sets: '3 × 20 · récup 30 s' },
      { name: 'Calf raises excentrique genou tendu', detail: 'Machine calf raise debout (ou step) : montée 2 pieds, descente 1 pied en 3-4 sec. Gastrocnémien = directement lié aux périostites tibiales. La machine debout est idéale car elle contrôle mieux l\'amplitude. Excentrique lent = traitement de fond.', sets: '3 × 12 / jambe · excentrique 3-4 sec', warning: true },
      { name: 'Hip hitches debout sur step', detail: 'Pied porteur sur le bord d\'un step ou d\'un banc bas. Laisser le bassin tomber du côté libre, puis soulever en contractant le fessier porteur. Pas de machine équivalente — faire sur le bord d\'une marche de step ou le rebord d\'un banc. Corrige le pelvic drop = cause principale de surcharge tibiale.', sets: '3 × 12 / côté · récup 60 s', warning: true },
      { name: 'Mobilité', detail: 'Fente basse genou à terre 45 s / côté (psoas) · Pigeon couché 45 s / côté · Adducteur allongé 30 s / côté · Mollet genou tendu 30 s / côté.', required: true },
    ],
  },

  renfo_core: {
    id: 'renfo_core', label: 'Renfo Core — Maintien tri', short: 'Renfo C',
    type: 'renfo', color: '#FF9500', duration: '20 min',
    desc: 'Gainage triathlon + protection blessures — version maintien Phase 2+',
    exercises: [
      { name: 'Copenhagen pied (niveau 3-4)', detail: 'Jambe tendue sur l\'appui, plus difficile que le genou. Maintenir l\'alignement.', sets: '3 × 8-12 / côté' },
      { name: 'Pont fessier 1 jambe', detail: 'Dos au sol, 1 jambe tendue, pousser le bassin vers le haut avec l\'autre', sets: '3 × 12 / côté' },
      { name: 'Planche avec rotation', detail: 'En planche, ouvrir un bras vers le plafond, regard vers le haut. Stabilité.', sets: '3 × 8 / côté' },
      { name: 'Excentrique mollet 1 jambe', detail: 'Descendre lentement en 4 secondes sur 1 jambe. Protection tibia.', sets: '3 × 10 / côté' },
      { name: 'Superman', detail: 'À plat ventre, soulever bras + jambe opposés. Renforce le dos pour le vélo.', sets: '3 × 12' },
      { name: 'Pompes avec rotation — obliques', detail: 'Pompe standard, puis en remontant faire pivoter le corps : lever le bras droit vers le plafond, regard vers la main, corps en T. Alterner gauche/droite. Travaille les pectoraux + obliques + deltoïdes en stabilisation.', sets: '50 au total (1 rotation = 1 rep)', required: true },
      { name: 'Crunch classique', detail: 'Dos au sol, genoux fléchis. Décoller les épaules en expirant — le bas du dos reste au sol.', sets: '3 × 15' },
      { name: 'Crunch bicycle', detail: 'Coude droit vers genou gauche en alternance. Rotation contrôlée, ne pas tirer sur la nuque.', sets: '3 × 12 / côté' },
    ],
  },

  // ── NATATION ─────────────────────────────────────────────────────────────
  // Coach notes :
  //   Priorité 1 : respiration. Priorité 2 : technique. Priorité 3 : distance.
  //   Drills clés : catch-up · bras seul · 6-1-6 · poing fermé · pull buoy · sighting
  //   Règle cardinale : expire TOUJOURS dans l'eau (jamais en apnée).

  swim_apprivoiser: {
    id: 'swim_apprivoiser', label: 'Nage — Apprivoiser l\'eau', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '25-35 min',
    desc: 'S1-8 · ~150-300 m · Crawl court dès S1, bord à portée. La panique se dompte par répétition.',
    exercises: [
      { name: '⚠ Règle du bord', detail: 'Tu nages EN LONGUEUR côté bord. Panique → mains sur le rebord, expire lentement, reprends quand tu veux. C\'est la décision intelligente, pas un échec. Si tu n\'as pas pied → bord à moins d\'un bras.', required: true, warning: true },
      { name: 'Activation souffle (2 min debout)', detail: 'Debout dans le petit bain, menton à ras de l\'eau. Expire par le nez dans l\'eau 3 secondes, tourne la tête côté et inspire 1 seconde. Rythme 3-1-3-1. Trouver ce tempo AVANT de nager — c\'est lui qui empêche la panique.', sets: '20 cycles' },
      { name: 'Planche — battements jambes', detail: 'Planche devant, bras tendus, visage dans l\'eau. Petits battements depuis les hanches (pas les genoux), chevilles relâchées. Expire dans l\'eau, tourne la tête pour inspirer côté. Reste côté bord.', sets: 'S1-2 : 4 × 15 m · S3-4 : 4 × 25 m · S5-8 : 2 × 50 m (1 aller-retour)', required: true },
      { name: 'DRILL — Catch-up (bras en attente)', detail: 'LE drill débutant le plus important. Règle : le bras A ne tire QUE quand le bras B est revenu se poser devant (les deux bras se "touchent" devant à chaque coup). Ça ralentit le cycle, force l\'expiration et t\'empêche de te noyer dans les bras. Nager très lentement — l\'allure ne compte pas.', sets: 'S1-4 : 6 × 10 m · S5-6 : 5 × 15 m · S7-8 : 4 × 25 m', required: true },
      { name: 'Crawl libre (appliquer le souffle)', detail: 'Crawl normal, côté bord. Objectif : ne pas retenir son souffle. Si tu t\'essouffles → ralentis encore. Si tu paniques → bord. Une longueur sans panique = plus de progrès qu\'une longueur en apnée.', sets: 'S1-2 : 4 × 10 m · S3-4 : 4 × 15 m · S5-6 : 3 × 20 m · S7-8 : 3 × 25 m' },
      { name: 'Retour au calme — dos crawl', detail: 'Dos crawl 1-2 longueurs : visage hors de l\'eau, bras alternés, regard au plafond. Plus facile que le crawl — parfait pour récupérer et retrouver la confiance.', sets: '2 × 25 m', required: true },
    ],
  },

  swim_debutant: {
    id: 'swim_debutant', label: 'Nage — Débutant', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '30-40 min',
    desc: 'S9-16 · ~300-600 m · 25 m crawl acquis → enchaîner 50 m. Drill bras seul + respiration bilatérale.',
    exercises: [
      { name: 'Échauffement planche', detail: 'Battements planche, expiration rythmée dans l\'eau. Bord accessible mais objectif : ne pas le toucher.', sets: '4 × 25 m (30 s récup)', required: true },
      { name: 'DRILL — Bras seul (one-arm)', detail: 'Nage avec UN seul bras. L\'autre reste tendu devant ou le long du corps. Alterne : 25 m bras droit seul → 25 m bras gauche seul. Force à respirer des deux côtés et sent la "prise" de l\'eau (catch). Tiens une planche avec le bras libre si nécessaire.', sets: 'S9-12 : 4 × 25 m (2 bras D + 2 bras G) · S13-16 : 6 × 25 m (3+3)', required: true },
      { name: 'DRILL — Catch-up avec expiration comptée', detail: 'Catch-up vu en Phase 1, mais maintenant : compte 3 battements entre chaque coup de bras. Objectif = nager lentement et expirer EN ENTIER avant de remonter la tête. Si tu n\'as plus d\'air avant d\'inspirer → tu nages trop vite.', sets: '2 × 25 m' },
      { name: 'Crawl enchaîné — construction 50 m', detail: 'Crawl libre, bord accessible, objectif = ne pas s\'arrêter. Si tu dois t\'arrêter → c\'est que tu nages trop vite. Réduis l\'allure jusqu\'à trouver une vitesse où tu peux expirer correctement.', sets: 'S9-10 : 6 × 25 m (20 s récup) · S11-12 : 4 × 50 m (30 s récup) · S13-14 : 3 × 75 m · S15-16 : 2 × 100 m', required: true },
      { name: 'Retour — dos crawl', detail: 'Dos crawl détendu. Travail de synchronisation : quand le bras gauche entre dans l\'eau, le droit sort. Regard au plafond, hanches à la surface.', sets: '2 × 25 m', required: true },
    ],
  },

  swim_initiation: {
    id: 'swim_initiation', label: 'Nage — Initiation', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '40-50 min',
    desc: 'S17-30 · ~600-1 200 m · 200 m continu. Drill 6-1-6 + respiration 3 temps (bilatérale).',
    exercises: [
      { name: 'Échauffement', detail: '4 × 25 m crawl lent (catch-up ou libre) + 2 × 25 m dos crawl. Récup 20 s entre chaque.', sets: '150 m total', required: true },
      { name: 'DRILL — 6-1-6 (rotation corporelle)', detail: 'Nage sur le côté, 6 battements → 1 coup de bras → rotation → 6 battements autre côté → répète. Comme un alligator qui roule. Force la rotation des hanches qui propulse réellement le crawl. Mouvement lent, délibéré. Planche optionnelle.', sets: '4 × 25 m — très lent, c\'est normal' },
      { name: 'DRILL — Poing fermé (fist drill)', detail: 'Nage crawl mais avec les POINGS FERMÉS. Tu sens que tu n\'as plus de surface → tu commences à sentir la pression sur l\'avant-bras. Quand tu ré-ouvres les mains → la traction est décuplée. Apprend à "accrocher" l\'eau correctement.', sets: '2 × 25 m poings fermés → 1 × 25 m mains ouvertes (sentir la différence)' },
      { name: 'Série principale — vers 200 m continu', detail: 'Crawl libre, allure douce-régulière. Respiration 3 temps : inspire à droite → 3 coups de bras → inspire à gauche → répète. Si essoufflé → passer à 2 temps d\'un côté, puis alterner progressivement.', sets: 'S17-20 : 4 × 50 m (30 s repos) · S21-24 : 3 × 75 m · S25-28 : 2 × 100 m · S29-30 : 200 m continu', required: true },
      { name: 'Pull buoy (introduction)', detail: 'Bouée de jambes entre les cuisses (ou les chevilles). Nage avec les bras uniquement. Les jambes flottent sans battre. Révèle si la propulsion vient des bras → spoiler : oui, les bras font 80% du travail en crawl.', sets: 'S21+ : 2 × 50 m avec pull buoy' },
      { name: 'Retour', detail: '50 m dos crawl lent ou brasse si tu sais.', required: true },
    ],
  },

  swim_base: {
    id: 'swim_base', label: 'Nage — Base', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '45-60 min',
    desc: 'S31-48 · ~1 000-2 000 m · 400 m continu → 800 m. Pyramides + pull buoy + respiration bilatérale solide.',
    exercises: [
      { name: 'Échauffement', detail: '200 m : 100 m crawl lent + 50 m drill au choix (6-1-6 ou catch-up) + 50 m dos.', sets: '', required: true },
      { name: 'DRILL — Fingertip drag (traîne-doigts)', detail: 'Pendant la récupération (quand le bras revient en avant), traîne le bout des doigts À RAS de la surface de l\'eau. Force le coude à rester haut (coude haut = meilleure entrée dans l\'eau). Si le coude s\'affaisse, les doigts plongent dans l\'eau.', sets: '4 × 25 m' },
      { name: 'Pull buoy + respiration bilatérale', detail: 'Pull buoy entre les cuisses, bras seulement. Respire tous les 3 coups (bilatéral). But : sentir que les bras TRACTENT vraiment l\'eau. Chaque traction = main entre dans l\'eau devant l\'épaule, coude fléchi à 90°, main pousse EN ARRIÈRE jusqu\'à la cuisse.', sets: 'S31-36 : 4 × 50 m · S37-42 : 3 × 100 m · S43-48 : 2 × 150 m', required: true },
      { name: 'Série principale — pyramide', detail: 'Pyramide = distance qui monte puis descend. Récup = 20-30 s entre chaque. Allure conversation Zone 2 : tu dois pouvoir prononcer une phrase entre deux respirations.', sets: 'S31-36 : 50-100-150-100-50 m (550 m) · S37-42 : 100-150-200-150-100 m (700 m) · S43-48 : 200-300-200 m continu (700 m)' },
      { name: 'Crawl continu (test progression)', detail: 'À partir de S40 : nager sans s\'arrêter le plus longtemps possible à allure très douce. Viser 400 m continus à S40, 600 m à S45, 800 m à S48.', sets: 'Allure très lente — si essoufflé tu vas trop vite' },
      { name: 'Retour', detail: '100 m dos crawl détendu.', required: true },
    ],
  },

  swim_endurance: {
    id: 'swim_endurance', label: 'Nage — Endurance', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '55-75 min',
    desc: 'S49-65 · ~1 500-2 500 m · 1 500 m continu cible. Sighting + palmes de main + allure race.',
    exercises: [
      { name: 'Échauffement', detail: '300 m : 150 m crawl progressif (commence lent, finit modéré) + 100 m drill au choix + 50 m dos.', sets: '', required: true },
      { name: 'DRILL — Sighting (levée de tête — eau libre)', detail: 'Toutes les 8-10 brasses, lève la tête EN AVANT (yeux à ras de l\'eau, pas hors de l\'eau) 1 seconde pour "voir" ta ligne, puis expire normalement côté. En course, tu te navigues ainsi dans le lac/mer. Commence à pratiquer en piscine pour que le geste soit automatique.', sets: 'S53+ : 4 × 50 m avec sighting toutes les 8 brasses', required: true },
      { name: 'Palmes de main (paddles) + pull buoy', detail: 'Palmes de main (grandes surfaces) amplifieront tes erreurs de catch ET ta force. Combination avec pull buoy = séance bras pur technique avancée. Attention : commence avec de petites palmes si douleur aux épaules → arrête.', sets: 'S53+ : 4 × 75 m palmes + pull · S57+ : 3 × 100 m palmes + pull' },
      { name: 'Série principale — allure race', detail: 'Nager à l\'allure que tu viserais en course. Pas à fond — régulier, efficace. Compte les brasses : viser 16-20 brasses/longueur (25 m). Plus tu glisses entre les brasses, plus tu es efficace.', sets: 'S49-52 : 6 × 100 m (20 s repos) · S53-58 : 4 × 200 m (30 s repos) · S59-65 : 3 × 400 m (40 s repos)', required: true },
      { name: 'Sprints courts (vitesse pure)', detail: '25 m à vitesse max → 45 s récup complète. But : sentir l\'accélération, recruter les fibres rapides. Pas plus de 4 sprints — qualité > quantité.', sets: '4 × 25 m MAX — récup 45 s' },
      { name: 'Retour', detail: '150 m très lent (crawl ou dos). Secouer les bras, étirements épaules dans l\'eau.', required: true },
    ],
  },

  swim_avance: {
    id: 'swim_avance', label: 'Nage — Avancé', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '65-85 min',
    desc: 'S66-104 · ~2 000-3 500 m · Simulation eau libre. Hypoxique + négatif split + volumes longs.',
    exercises: [
      { name: 'Échauffement', detail: '400 m : 200 m crawl progressif + 100 m drill mixte (50 m fist drill + 50 m fingertip drag) + 100 m dos/brasse.', sets: '', required: true },
      { name: 'DRILL — Négatif split', detail: 'Nage un 200 m en 2 parties : la 1ère moitié (100 m) intentionnellement plus LENTE que la 2ème (100 m). Force la gestion du rythme — erreur classique en triathlon = partir trop vite et s\'effondrer. En course : garde 10% en réserve les 500 premiers mètres.', sets: '3 × 200 m négatif split — noter les temps si tu as une montre' },
      { name: 'DRILL — Hypoxique (contrôle souffle)', detail: 'Nager en limitant les respirations : 3 brasses → inspire / puis 5 brasses → inspire / puis 7 brasses → inspire. Renforce les muscles respiratoires et améliore l\'efficacité d\'O₂. Si vertiges → stop. Jamais seul pour les séries hypoxiques longues.', sets: 'S70+ : 4 × 50 m (respiration × 5) · S80+ : 4 × 50 m (respiration × 7)', warning: true },
      { name: 'Simulation eau libre — sans bord', detail: 'Nage en milieu de couloir (loin du bord). Sighting toutes les 8-10 brasses. Objectif : être autonome, ne plus avoir besoin du bord visuellement ni mentalement. En lac/mer il n\'y a pas de bord — prépare ton cerveau.', sets: 'S70+ : 4 × 200 m en milieu de couloir avec sighting', required: true },
      { name: 'Série volume', detail: 'Allure modérée constante — c\'est la base de l\'endurance. Compter les brasses sur chaque longueur : si le chiffre augmente en fin de série → fatigue technique → ralentis.', sets: 'S66-72 : 6 × 200 m (30 s repos) · S73-84 : 4 × 400 m (40 s repos) · S85-104 : 2 000-2 500 m continu ou 5 × 400 m (30 s)', required: true },
      { name: 'Retour', detail: '200 m dos crawl ou brasse détendu. Étirements épaules/nuque dans l\'eau 2 min.', required: true },
    ],
  },

  swim_ironman: {
    id: 'swim_ironman', label: 'Nage — Ironman', short: 'Nage',
    type: 'swim', color: '#007AFF', duration: '80-110 min',
    desc: 'S105-157 · ~3 000-5 000 m · 3 800 m race distance. Départ masse + rythme Ironman + eau libre.',
    exercises: [
      { name: 'Échauffement', detail: '500 m progressif : 200 m crawl lent → 150 m drill (négatif split ou fist) → 100 m pull buoy → 50 m sprint. Activation musculaire et mentale.', sets: '', required: true },
      { name: 'DRILL — Simulation départ masse', detail: 'Le départ Ironman = 2 000 nageurs ensemble, coups de pied, bras dans la figure. Prépare-toi : nage les 200 premiers mètres légèrement plus vite pour sortir du groupe dense, puis passe en Zone 2 pour les 3 600 m restants. Ne JAMAIS partir à fond → tu finiras la nage épuisé avant le vélo.', sets: '1 × 200 m à allure vive → 400 m à allure race (répété 2 fois)' },
      { name: 'Volume long à allure Ironman', detail: 'L\'allure Ironman = très patient. Tu as 8h+ devant toi. Viser une allure où tu peux nager 45+ min sans t\'épuiser. Si tu as une montre nage : viser 2 min/100 m ou moins. Compter les brasses (viser 16-18 par 25 m = nageur efficace).', sets: 'S105-112 : 3 000 m (6 × 500 m, 45 s repos) · S113-130 : 3 500 m (7 × 500 m, 40 s repos) · S131-145 : 3 800 m continu · S146-157 : 4 000-4 500 m (entraînement > race distance)', required: true },
      { name: 'Sighting race-pace', detail: 'Pendant la série longue : pratiquer le sighting toutes les 10 brasses EN MAINTENANT l\'allure. En course, lever la tête ralentit — à force de répéter, l\'impact devient négligeable. Viser à ne perdre aucune brasse d\'efficacité lors du sighting.', sets: '' },
      { name: 'Sprints de fin (résistance à la fatigue)', detail: '4 × 50 m à 90% max, récup 30 s, APRÈS la série longue. Simule l\'effort de sortie d\'eau et de transition T1. Tes bras sont fatigués → tu dois quand même sortir vite.', sets: '4 × 50 m sprint — récup 30 s' },
      { name: 'Retour au calme', detail: '300 m très lent (dos/brasse/crawl lent alternés). Pulsations < 120 bpm avant de quitter la piscine. Récup 10 min en dehors de l\'eau après.', required: true },
    ],
  },

  // ── VÉLO ─────────────────────────────────────────────────────────────────

  bike_stationnaire: {
    id: 'bike_stationnaire', label: 'Vélo appartement', short: 'Vélo',
    type: 'bike', color: '#34C759', duration: '25-45 min',
    desc: 'S1-16 : cardio sans impact. Ménage le pubis et les tibias.',
    exercises: [
      { name: 'Échauffement', detail: 'Résistance nulle, 70 rpm, 5 min', required: true },
      { name: 'Corps de séance', detail: 'Résistance légère, 80-90 rpm. S1-4 : 20 min · S5-8 : 30 min · S9-12 : 35 min · S13-16 : 40 min', sets: '' },
      { name: 'Règle conversation', detail: 'Tu dois pouvoir parler en phrases entières. Si tu t\'essouffle → résistance trop haute. Baisser.', warning: true },
      { name: 'Retour au calme', detail: 'Résistance nulle, 5 min', required: true },
    ],
  },

  renfo_salle_b: {
    id: 'renfo_salle_b', label: 'Renfo Salle B — Pubalgie maint. + Pull + MTSS', short: 'Salle B',
    type: 'renfo', color: '#AF52DE', duration: '60-70 min',
    desc: 'Mercredi · Pubalgie maintenance (Hölmich 2e passage/semaine) + haut du corps pull/push + protocole MTSS complet. Le Hölmich recommande 3×/semaine.',
    painCheck: true,
    exercises: [
      { name: 'Progression des charges — mercredi', detail: 'Séries et reps fixes (3×10/12/15). Mercredi = j+2 après lundi. Charge S1-2 : légère (courbatures possibles, normal). S3+ : augmenter les poids si les 3 séries finissent sans effort. Des courbatures les premières semaines après 10 ans sans sport = signal normal, pas d\'inquiétude.', sets: '', warning: true, required: true },
      { name: 'Pubalgie — maintenance Hölmich (2e séance semaine)', detail: '', sets: '', section: true },
      { name: 'Adduction isométrique maintenance', detail: 'Allongé, balle entre les genoux. Version maintenance (3 séries vs 5 du lundi). Le but : ne pas laisser les adducteurs se relâcher entre les séances.', sets: 'S1-2 : 2 × 10 × 10 sec · S3+ : 3 × 10 × 10 sec · récup 60 s', warning: true },
      { name: 'Pont fessier — gainage pelvien', detail: 'S1-4 : bilatéral (2 pieds au sol, 10 reps). S5+ : unijambiste, maintien 12 sec / côté.', sets: 'S1-4 : 2 × 10 bilatéral · S5+ : 2 × 10 s / côté' },
      { name: 'Avec matériel — câbles, haltères, machines', detail: '', sets: '', section: true },
      { name: 'Vélo stationnaire — activation', detail: 'Cadence légère 80-90 RPM, 8-10 min résistance faible. Active les mollets et prépare les genoux avant les step-ups.', required: true },
      { name: 'Tirage vertical (lat pulldown) — nage crawl', detail: 'Prise légèrement plus large que les épaules, tirer vers le menton, coudes vers le bas. Les dorsaux font 40% de la propulsion en crawl. Technique avant la charge.', sets: '3 × 12 · charge légère → progressive' },
      { name: 'Rowing câble horizontal — posture + nage', detail: 'Assis face à la poulie basse, tirer les coudes vers l\'arrière jusqu\'à ce que les omoplates se rapprochent. Posture vélo aéro + force de traction crawl.', sets: '3 × 12' },
      { name: 'Face pull câble — coiffe des rotateurs', detail: 'Poulie haute, corde, tirer vers le visage en écartant les coudes. Renforce la coiffe des rotateurs et les trapèzes moyens — essentiel pour la santé de l\'épaule sur 3,8 km de nage Ironman.', sets: '3 × 15 · charge légère, contrôle total' },
      { name: 'Curl biceps haltères ou câble', detail: 'Coudes fixes contre le buste, lever en supination (paume vers le haut). Chaîne de traction pour la nage + complète le lat pulldown.', sets: '3 × 12' },
      { name: 'Développé épaules haltères assis', detail: 'Haltères à hauteur des épaules, pousser vers le haut. Deltoïdes antérieurs + médians. Position aéro vélo + entrée de bras crawl.', sets: '3 × 10 · charge légère' },
      { name: 'Step-ups sur box — MTSS tibias + fessiers', detail: 'Monter sur un step/banc en poussant sur le talon. 1 jambe à la fois. Progression hauteur : S1-4 : 15-20 cm · S5-8 : 25-30 cm · S9-16 : 35-40 cm. Chargement osseux progressif = traitement de fond des périostites.', sets: '3 × 12 / jambe · récup 60 s' },
      { name: 'Calf raises machine / barre — genou tendu (gastrocnémien)', detail: 'Descente excentrique lente 3 sec, montée rapide 1 sec. Sur step si possible. Gastrocnémien = muscle directement lié aux périostites. Progression charge : léger S1-2, +charge S3+.', sets: '3 × 15 · récup 90 s · excentrique 3 sec impératif', warning: true },
      { name: 'Calf raises assis / soléaire — genou fléchi 90°', detail: 'Assis, haltères sur cuisses, genou à 90°. LE muscle le plus sous-entraîné dans les périostites. Soléaire supporte 3× le poids du corps à la course. Progression : poids du corps S1-2, +charge S3+.', sets: '3 × 15 · récup 90 s', warning: true },
      { name: 'Sans matériel — MTSS + gainage', detail: '', sets: '', section: true },
      { name: 'Single-leg RDL — chaîne postérieure + équilibre', detail: 'Debout sur 1 jambe, légèrement fléchie. Incliner le buste vers l\'avant en poussant la jambe arrière vers l\'arrière (comme une balançoire). Dos droit. Débuter sans poids (coordination), puis haltère léger. Renforce fessiers + ischio = moins de pelvic drop = moins de torsion tibiale = protection périostites.', sets: '3 × 10 / jambe · haltère 5-10 kg quand maîtrisé' },
      { name: 'Hip hitches debout sur step — fessier moyen', detail: 'Pied porteur sur le bord d\'un step ou marche. Laisser le bassin tomber du côté libre puis le soulever en contractant le fessier de la jambe portante. Ce mouvement corrige le "pelvic drop" à la course = la cause principale de la surcharge du tibia dans les périostites.', sets: '3 × 15 / côté · récup 60 s', warning: true },
      { name: 'Side-lying hip abduction — fessier moyen', detail: 'Allongé sur le côté, jambe du dessus tendue. Lever à 30-40°, pause 2 s en haut, descendre lentement. Variante : élastique autour des chevilles (S5+). Renforce le même muscle que les hip hitches par un angle différent.', sets: '3 × 15 / côté' },
      { name: 'Tibial raises contre mur — tibial antérieur', detail: 'Dos appuyé au mur, talons à 10 cm du mur. Soulever les pointes des pieds le plus haut possible, poser et recommencer. Renforce le muscle qui "tire" sur le périoste tibial — le renforcer réduit cette traction lors de la course.', sets: '3 × 20 · récup 30 s' },
      { name: 'Planche latérale + abduction du dessus', detail: 'En gainage latéral sur le coude, lever la jambe du dessus à 30° pendant le maintien. Combine le gainage latéral (abdos obliques) avec le fessier moyen en charge.', sets: '3 × 10 × 10 sec / côté' },
      { name: 'Mobilité', detail: 'Étirement mollet genou tendu 45 s / côté (gastrocnémien) · Mollet genou fléchi 45 s / côté (soléaire) · Étirement épaule croisée 30 s / côté.', required: true },
    ],
  },

  renfo_salle_c: {
    id: 'renfo_salle_c', label: 'Renfo Salle C — Pubalgie léger + Composés', short: 'Salle C',
    type: 'renfo', color: '#FF6B35', duration: '55-65 min',
    desc: 'Vendredi · Pubalgie léger Hölmich Phase 2 (élastique + gainage) + composés polyarticulaires + MTSS progressif. 3e passage pubalgie de la semaine.',
    painCheck: true,
    exercises: [
      { name: 'Progression des charges — vendredi', detail: 'Séries et reps fixes (3×10/12/15). Vendredi = 3e séance de la semaine. Charge S1-2 : légère. S3+ : augmenter si les 3 séries finissent sans effort. La progression des charges vendredi suit celle de lundi — si lundi tu montes, vendredi aussi. Semaines 4 et 8 : charge -20% (décharge, les tendons consolident).', sets: '', warning: true, required: true },
      { name: 'Pubalgie — Hölmich Phase 2 (3e séance semaine)', detail: '', sets: '', section: true },
      { name: 'Adduction debout élastique — Hölmich P2', detail: 'Élastique autour des chevilles (ou poulie basse), debout, ramener la jambe en résistant. Tempo 1 sec concentrique / 3 sec excentrique (la phase lente est la plus thérapeutique). Progression : tension élastique plus forte semaine après semaine.', sets: '5 × 10 / jambe · récup 90 s · 3 sec excentrique impératif', warning: true },
      { name: 'Planche latérale + abduction du dessus', detail: 'Gainage latéral sur le coude, lever la jambe du dessus à 30°. Progression : durée de maintien +5 sec/semaine.', sets: '3 × 10 × 10 sec / côté' },
      { name: 'Avec matériel — composés + machines', detail: '', sets: '', section: true },
      { name: 'Vélo stationnaire — activation', detail: '6-8 min cadence légère. Troisième séance de la semaine — activation uniquement.', required: true },
      { name: 'Romanian Deadlift haltères (RDL)', detail: 'Pieds à largeur des hanches, haltères devant les cuisses. Dos droit, hanches en arrière, descendre jusqu\'à la tension dans les ischio. Maîtriser la technique avant d\'ajouter de la charge. Progression : S1-2 haltères légers (5-8 kg) · +charge chaque semaine si dos droit maîtrisé.', sets: '3 × 10 · dos droit impératif, charge progressive' },
      { name: 'Bulgarian split squat', detail: 'Pied arrière sur un banc, pied avant ~80 cm devant. Descendre le genou arrière vers le sol. S1-4 : poids du corps uniquement — la stabilité s\'apprend d\'abord. S5+ : haltères légers (+charge progressive).', sets: '3 × 8 / jambe · poids du corps S1-4, haltères à partir S5' },
      { name: 'Tirage prise neutre (poignées rapprochées)', detail: 'Poulie haute, poignées neutres (paumes se font face). Tirer les coudes vers les hanches. Variation du lat pulldown qui cible davantage les grands dorsaux + trapèzes inférieurs. Alterne avec la prise large de la Salle B.', sets: '3 × 12' },
      { name: 'Développé épaules haltères debout', detail: 'Debout, core gainé, haltères à hauteur des épaules, pousser vers le haut. Plus instable qu\'assis = plus de gainage. Deltoïdes + gainage profond simultanément.', sets: '3 × 10 · charge légère, contrôle de la descente' },
      { name: 'Triceps barre front press ou câble overhead', detail: 'Câble poulie haute, corde, bras tendus vers le haut en écartant les mains derrière la tête. Étirement complet du triceps en position allongée = bras longs = meilleure traction en nage.', sets: '3 × 12' },
      { name: 'Calf raises unijambiste — progression MTSS', detail: 'Sur un step, 1 seule jambe, descente excentrique 3-4 sec. Version avancée par rapport aux 2 jambes de la Salle B. Objectif fin de Phase 1 : 3 × 12 / jambe sans douleur tibiale. S1-4 : 2 jambes si unijambiste trop difficile.', sets: '3 × 10 / jambe · récup 90 s · excentrique 3-4 sec', warning: true },
      { name: 'Sans matériel — core dynamique', detail: '', sets: '', section: true },
      { name: 'Pallof press élastique (anti-rotation)', detail: 'Élastique accroché à un poteau ou rack. De côté, tenir l\'élastique à bout de bras et résister à la rotation. Progression : tension élastique plus forte chaque semaine.', sets: '3 × 10 sec × 8 reps / côté' },
      { name: 'Planche avec rotation (T-planche)', detail: 'En position de pompe, ouvrir un bras vers le plafond, corps en T. Progression : +1 rep/semaine.', sets: '3 × 8 / côté' },
      { name: 'Side plank + hip dip', detail: 'Gainage latéral sur le coude, hanche descend et remonte. Plus difficile que le side plank statique. Progression : +2 reps/semaine.', sets: '3 × 10 / côté' },
      { name: 'Pompes serrées (triceps + pectoraux internes)', detail: 'Mains sous les pectoraux, coudes le long du corps. Progression : +reps chaque semaine. S1-2 si trop dur : genoux au sol.', sets: '3 × 10 → progression hebdomadaire' },
      { name: 'Mobilité', detail: 'RDL debout → étirement ischio 45 s / jambe · Hip flexor stretch 45 s / côté · Bras croisé (épaule arrière) 30 s / côté.', required: true },
    ],
  },

  bike_salle: {
    id: 'bike_salle', label: 'Vélo Salle — Zone 2 + MTSS', short: 'Vélo Z2',
    type: 'bike', color: '#34C759', duration: '50-60 min',
    desc: 'Mardi · Zone 2 endurance (40 min, conversation possible) + MTSS maintenance léger. Zéro impact tibial. Cardio de fond pour l\'Ironman.',
    painCheck: false,
    exercises: [
      { name: 'Vélo stationnaire — programme principal', detail: '', sets: '', section: true },
      { name: 'Réglage selle avant de démarrer', detail: 'Selle à hauteur de hanche debout. En bas de pédale, genou légèrement fléchi (150-155°). Un genou trop fléchi = surcharge adducteurs (pubalgie). Prendre 2 min pour bien régler — ça change tout.', required: true },
      { name: 'Zone 1 — activation', detail: 'Résistance légère, cadence libre. 5 min pour faire monter la température.', sets: '5 min' },
      { name: 'Zone 2 — endurance aérobie (SÉANCE PRINCIPALE)', detail: 'Cadence 80-90 RPM, résistance modérée. Test : tu peux parler par phrases complètes. Si tu souffles trop pour parler → trop fort. Zone 2 = base aérobie = moteur de l\'Ironman. Après 10 ans de pause, le cardio revient VITE — augmenter progressivement. S1-2 : 20 min · S3-4 : 25 min · S5-8 : 30 min · S9-12 : 35 min · S13-16 : 40 min. Pas de saut de palier : respecter la progression même si tu te sens bien.', required: true },
      { name: 'Retour au calme', detail: 'Résistance nulle, 5 min, cadence libre. Jambes qui tournent pour éliminer l\'acide lactique.', required: true },
      { name: 'MTSS — maintenance légère', detail: '', sets: '', section: true },
      { name: 'Single-leg RDL — maintenance chaîne postérieure', detail: 'Corps seul ou haltère léger. 2 séries suffisent ici — le travail lourd est jeudi (Salle B). Rappel technique : dos droit, hanches en équerre, jambe arrière dans l\'axe.', sets: '2 × 10 / jambe · récup 45 s' },
      { name: 'Calf raises genou tendu — gastrocnémien', detail: 'Sur un step ou sol, descente excentrique 3 sec. 2 séries de maintenance (3 séries sont pour jeudi).', sets: '2 × 15 · excentrique 3 sec' },
      { name: 'Calf raises assis — soléaire', detail: 'Assis, haltères sur cuisses, genou à 90°. 2 séries de maintenance.', sets: '2 × 15' },
      { name: 'Hip hitches — fessier moyen', detail: 'Maintenance 2 séries. Qualité > quantité.', sets: '2 × 12 / côté' },
      { name: 'Étirements finaux', detail: 'Mollet genou tendu 45 s / côté · Mollet genou fléchi 45 s / côté · Quadriceps debout 30 s / côté · Fléchisseur de hanche 30 s / côté.', required: true },
    ],
  },

  bike_court_salle: {
    id: 'bike_court_salle', label: 'Vélo Salle — Intervals + Finisher', short: 'Vélo Interval',
    type: 'bike', color: '#34C759', duration: '45-55 min',
    desc: 'Samedi · Vélo en intervals Zone 3 (intensité parlante) + finisher haut du corps + gainage. Plus court mais plus intense que mardi.',
    painCheck: false,
    exercises: [
      { name: 'Vélo — structure en intervals', detail: '', sets: '', section: true },
      { name: 'Échauffement progressif', detail: 'Zone 1-2, cadence libre, 8-10 min. Commencer très doucement et monter progressivement. Ne jamais démarrer fort à froid.', required: true },
      { name: 'Intervals Zone 3 — intensité soutenue', detail: 'Zone 3 = tu peux encore parler mais en phrases courtes. Cadence 85-90 RPM. S1-4 : 2 × 6 min Z3 (récup 3 min Z1 entre) · S5-8 : 2 × 8 min Z3 (récup 3 min Z1) · S9-16 : 3 × 6 min Z3 (récup 2 min Z1). Ces intervals développent le seuil aérobie — la vitesse à laquelle tu pourras rouler sur 180 km sans t\'exploser.', required: true },
      { name: 'Retour au calme', detail: 'Zone 1, cadence douce, 5-8 min. Obligatoire — ne pas s\'arrêter sec après les intervals.', required: true },
      { name: 'Finisher — haut du corps + gainage', detail: '', sets: '', section: true },
      { name: 'Rowing haltères unilatéral', detail: 'Un genou et une main sur le banc, tirer le coude vers le haut. Dos plat. 3 séries légères pour renforcer les dorsaux après le vélo (les muscles sont chauds).', sets: '3 × 12 / bras' },
      { name: 'Overhead press haltères debout', detail: 'Debout, haltères à hauteur des épaules, pousser vers le haut en garant le core. Bras complet et épaules pour la nage.', sets: '3 × 10' },
      { name: 'Triceps câble pushdown', detail: 'Coudes fixes, pousser vers le bas. 2 séries rapides — les bras ont déjà bossé sur le vélo.', sets: '2 × 12' },
      { name: 'Circuit gainage final', detail: 'Planche 30 s → Planche latérale D 20 s → Planche latérale G 20 s → Dead bug 8 / côté. 2 tours. Pas de pause longue entre les exercices.', sets: '2 tours · récup 90 s entre les tours' },
      { name: 'Tibial raises + étirements', detail: 'Tibial raises contre mur 2 × 20 · Étirement mollet genou tendu 45 s / côté · Mollet genou fléchi 45 s / côté.', required: true },
    ],
  },

  bike_court: {
    id: 'bike_court', label: 'Vélo route — Court', short: 'Vélo',
    type: 'bike', color: '#34C759', duration: '45-90 min',
    desc: 'S17-40 : premiers tours de roue en extérieur. Cadence + zones cardio.',
    exercises: [
      { name: 'Échauffement', detail: '10 min à cadence libre, résistance nulle / pente nulle', required: true },
      { name: 'Zone 2', detail: 'S17-22 : 35 min à allure conversation (cardio Zone 2) · S23-30 : 50 min · S31-40 : 60-75 min. Tu dois pouvoir parler facilement.', sets: 'Viser 80-90 rpm' },
      { name: 'Assis en montée', detail: 'S25+ : sur les petites montées, rester assis et augmenter légèrement la résistance plutôt que de se lever', sets: '' },
      { name: 'Retour au calme', detail: '10 min facile', required: true },
    ],
  },

  bike_moyen: {
    id: 'bike_moyen', label: 'Vélo route — Moyen', short: 'Vélo',
    type: 'bike', color: '#34C759', duration: '90-120 min',
    desc: 'S41-56 : vraies sorties d\'endurance. Gestion du cardio + ravitaillement.',
    exercises: [
      { name: 'Échauffement', detail: '15 min progressif Zone 1-2', required: true },
      { name: 'Endurance Zone 2', detail: 'S41-46 : 75 min · S47-52 : 90 min · S53-56 : 100-110 min. Allure régulière, pas de sprint.', sets: '' },
      { name: 'Boire régulièrement', detail: 'Toutes les 20 min, même sans soif. Sur 90 min+ tu peux perdre 1-2 L.', warning: true },
      { name: 'Intervalles légers', detail: 'S48+ : 4 × 3 min légèrement soutenu (Zone 3) toutes les 25 min, puis retour Zone 2', sets: '' },
      { name: 'Retour au calme', detail: '15 min facile', required: true },
    ],
  },

  bike_tri: {
    id: 'bike_tri', label: 'Vélo route — Triathlon', short: 'Vélo',
    type: 'bike', color: '#34C759', duration: '2h-3h',
    desc: 'S57-88 : sorties 2-3h. Travail en position aéro + gestion de l\'énergie.',
    exercises: [
      { name: 'Échauffement', detail: '20 min progressif', required: true },
      { name: 'Volume principal', detail: 'S57-62 : 1h45 · S63-72 : 2h15 · S73-88 : 2h30-3h. Terrain varié, quelques montées.', sets: 'Zone 2 dominant (80%), Zone 3 (20%)' },
      { name: 'Position aéro', detail: 'S60+ : passer 20-30 min en position basse (coudes sur le guidon ou position tri). Améliore la résistance au vent.', sets: '' },
      { name: 'Nutrition vélo', detail: 'Toutes les 45 min : 1 gel ou banane + eau. En course ça sera 180 km, tu dois t\'alimenter.', warning: true },
      { name: 'Retour au calme', detail: '20 min facile + 5 min de marche après pour ne pas rester assis', required: true },
    ],
  },

  bike_long: {
    id: 'bike_long', label: 'Longue sortie vélo', short: 'Long Vélo',
    type: 'bike', color: '#34C759', duration: '2h30-4h',
    desc: 'Sortie longue du week-end. Volume pur, Zone 2. Construction progressive.',
    exercises: [
      { name: 'Règle de la longue', detail: 'Aucune sortie longue ne peut dépasser la précédente de +15%. Progression lente = progression sûre.', warning: true },
      { name: 'Volume', detail: 'S41-52 : 2h-2h30 · S53-62 : 2h30-3h · S63-72 : 3h-3h30 · S73-88 : 3h30-4h30', sets: 'Zone 2 quasi-exclusive' },
      { name: 'Alimentation longue', detail: 'Avant : repas 2h30 avant. Pendant : 60g glucides/h (gels, bananes, barres). Après : protéines + glucides dans les 30 min.', required: true },
    ],
  },

  bike_ironman: {
    id: 'bike_ironman', label: 'Vélo Ironman', short: 'Vélo IM',
    type: 'bike', color: '#34C759', duration: '4h-6h',
    desc: 'S89-104 : sorties Ironman. 180 km = 5-6h de vélo. Stratégie de course.',
    exercises: [
      { name: 'Volume', detail: 'S89-94 : 4h · S95-100 : 4h30-5h · S101-104 : 1 sortie 5h-6h (simulation parcours)', sets: 'Zone 2 impérative — ne pas dépasser Z3 en course' },
      { name: 'Position course', detail: 'Rester en position aéro le maximum. Sur 180 km c\'est la discipline où tu perds ou gagnes le plus de temps.', sets: '' },
      { name: 'Stratégie Ironman', detail: 'Les 90 premiers km : très patient (Zone 2 basse), les 90 derniers : maintenir. Ne jamais "attaquer" en vélo — la course à pied attend.', warning: true },
    ],
  },

  // ── COURSE / MARCHE ───────────────────────────────────────────────────────

  marche: {
    id: 'marche', label: 'Marche active', short: 'Marche',
    type: 'run', color: '#8E8E93', duration: '25-35 min',
    desc: 'S5-8 : reprendre contact avec l\'impact, tibias silencieux requis.',
    painCheck: true,
    exercises: [
      { name: 'Marche active', detail: 'Sol souple (herbe, piste). Pas de trottoir béton au début. Chaussures running.', sets: 'S5 : 20 min · S6 : 25 min · S7-8 : 30-35 min' },
      { name: 'Check tibia', detail: 'Moindre douleur tibia > 3/10 → s\'arrêter et rentrer. Ce n\'est pas un échec.', warning: true },
      { name: 'Foulée douce', detail: 'Attaque talon-milieu de pied. Pas de course. Cadence de marche rapide (~6 km/h).', sets: '' },
    ],
  },

  marche_course: {
    id: 'marche_course', label: 'Marche / Course', short: 'M/C',
    type: 'run', color: '#FF3B30', duration: '25-35 min',
    desc: 'S9-26 : intervalles progressifs. Règle des 10% — jamais plus que la semaine d\'avant.',
    painCheck: true,
    exercises: [
      { name: 'Échauffement marche', detail: '5 min de marche active', required: true },
      { name: 'Intervalles progressifs', detail: 'S9-12 : 1 min course / 2 min marche × 5 (15 min total) · S13-16 : 1/2 × 6 · S17-20 : 2/1 × 5 · S21-24 : 3/1 × 4 · S25-26 : 5/1 × 3', sets: 'Allure très douce — conversation possible' },
      { name: 'Foulée tibia-safe', detail: 'Pas d\'attaque talon. Milieu de pied. Petite foulée rapide (170-175 pas/min). Cadence > longueur.', warning: false },
      { name: 'Check 24h', detail: 'Si douleur tibiale le lendemain → rester en marche pure la semaine suivante.', warning: true },
      { name: 'Retour calme', detail: '5 min marche + étirement mollets', required: true },
    ],
  },

  course_debutant: {
    id: 'course_debutant', label: 'Course — Débutant', short: 'Course',
    type: 'run', color: '#FF3B30', duration: '25-35 min',
    desc: 'S27-40 : premiers 10-20 min continus. Allure très lente = progrès réels.',
    painCheck: true,
    exercises: [
      { name: 'Échauffement', detail: '5 min marche rapide', required: true },
      { name: 'Course continue', detail: 'S27-30 : 8-10 min continus · S31-34 : 12-15 min · S35-38 : 15-18 min · S39-40 : 18-22 min. Si tu t\'essouffle trop → intercaler 1 min marche.', sets: '' },
      { name: 'Allure Zone 2', detail: 'Tu dois pouvoir parler en phrases. Si non → tu vas trop vite. C\'est la principale erreur des débutants.', warning: true },
      { name: 'Retour calme', detail: '5 min marche + étirements mollets + fléchisseurs hanche (3 min/côté)', required: true },
    ],
  },

  course_base: {
    id: 'course_base', label: 'Course — Base', short: 'Course',
    type: 'run', color: '#FF3B30', duration: '35-50 min',
    desc: 'S41-56 : 25-40 min continus. Commencer à gérer l\'allure et la foulée.',
    painCheck: true,
    exercises: [
      { name: 'Échauffement', detail: '5 min marche + éducatifs (montées de genoux × 30, talons-fesses × 30)', required: true },
      { name: 'Course endurance', detail: 'S41-44 : 25 min · S45-48 : 30 min · S49-52 : 35 min · S53-56 : 38-42 min. Zone 2 exclusive.', sets: '' },
      { name: 'Cadence', detail: 'Viser 170-180 pas/min. Compte les pas d\'une jambe sur 30 sec (cible : 43-45). Prévient les périostites.', sets: '' },
      { name: 'Retour calme', detail: '5 min marche lente + 8 min étirements complets', required: true },
    ],
  },

  course_intermediaire: {
    id: 'course_intermediaire', label: 'Course — Intermédiaire', short: 'Course',
    type: 'run', color: '#FF3B30', duration: '50-70 min',
    desc: 'S57-72 : 40-55 min. Séances qualité + volume. Objectif 5 km sous 35 min.',
    exercises: [
      { name: 'Échauffement', detail: '10 min progressif (marche → allure douce)', required: true },
      { name: 'Séance qualité (1×/semaine)', detail: 'S57-62 : 5 × 2 min allure tempo (Zone 3) avec 90 s récup · S63-72 : 5 × 3 min tempo avec 2 min récup', sets: '' },
      { name: 'Séance facile (2ème séance)', detail: '40-50 min Zone 2 pure. Allure conversation. Récupération active.', sets: '' },
      { name: 'Retour calme', detail: '8-10 min étirements (cuisses, mollets, hanche)', required: true },
    ],
  },

  course_long: {
    id: 'course_long', label: 'Sortie longue course', short: 'Long Run',
    type: 'run', color: '#FF3B30', duration: '60-80 min',
    desc: 'Sortie longue du week-end S53-72. Base marathon. Pas de performance.',
    exercises: [
      { name: 'Règle de la longue', detail: '+10% max par rapport à la semaine précédente. Jamais deux longues difficiles consécutives.', warning: true },
      { name: 'Volume', detail: 'S53-56 : 55 min · S57-62 : 60-65 min · S63-70 : 70-75 min · S71-72 : 75-80 min. Zone 2 totale.', sets: '' },
      { name: 'Ravitaillement', detail: 'S65+ : prendre un gel ou une banane à 40 min. Boire toutes les 20 min.', required: true },
    ],
  },

  course_avance: {
    id: 'course_avance', label: 'Course — Avancé', short: 'Course',
    type: 'run', color: '#FF3B30', duration: '60-80 min',
    desc: 'S73-88 : 55-75 min. Séances structurées. Objectif 10 km sous 55 min.',
    exercises: [
      { name: 'Échauffement', detail: '12 min progressif', required: true },
      { name: 'Séance tempo (1×/semaine)', detail: 'S73-80 : 3 × 5 min allure 10 km (Zone 3-4) avec 3 min récup · S81-88 : 2 × 10 min tempo, 4 min récup', sets: '' },
      { name: 'Séance longue (2ème)', detail: '55-70 min Zone 2. Objectif : aller chercher la fatigue sans se blesser.', sets: '' },
      { name: 'Retour calme', detail: '10 min étirements + foam roller mollets + fessiers', required: true },
    ],
  },

  course_long_avance: {
    id: 'course_long_avance', label: 'Long Run — Ironman', short: 'Long Run',
    type: 'run', color: '#FF3B30', duration: '90 min-2h',
    desc: 'Sortie longue du dimanche S73-104. Fondation marathon Ironman.',
    exercises: [
      { name: 'Volume', detail: 'S73-80 : 85-100 min · S81-88 : 100-110 min · S89-96 : 110-130 min · S97-104 : 120-150 min (dont 1 sortie 2h10 simulant la course du jour J)', sets: 'Zone 2 exclusive — marathon Ironman se court très lentement' },
      { name: 'Stratégie marathon Ironman', detail: 'Après 180 km de vélo tu seras fatigué. Viser 6-7 min/km, pas de héroïsme. Marcher les ravitaillements (30 sec). Le vrai marathon Ironman se "court" sur la 2ème moitié.', warning: true },
      { name: 'Nutrition longue', detail: '1 gel toutes les 30-35 min. Eau + électrolytes. Tester tes gels à l\'entraînement, jamais le jour J.', required: true },
    ],
  },

  // ── ENCHAÎNEMENTS / BRICKS ───────────────────────────────────────────────

  brick_initiation: {
    id: 'brick_initiation', label: 'Enchaînement — Initiation', short: 'Brick',
    type: 'brick', color: '#AF52DE', duration: '55-70 min',
    desc: 'S41-56 : premier enchaînement vélo + course. Apprendre les jambes de brique.',
    painCheck: true,
    exercises: [
      { name: 'Vélo', detail: 'S41-44 : 35 min modéré · S45-52 : 40-50 min. Allure triathlon (Zone 2-3).', required: true },
      { name: 'Transition T2', detail: 'Descendre du vélo, changer de chaussures, partir immédiatement en course. Chrono la transition (cible : < 3 min).', sets: '' },
      { name: 'Course post-vélo', detail: 'S41-44 : 10 min très lent (les jambes seront lourdes — c\'est normal, 2-3 min et ça passe) · S45-56 : 12-18 min. Ne pas paniquer à la sensation bizarre.', required: true },
      { name: 'Sensation "brique"', detail: 'Les 5 premières minutes de course après le vélo sont toujours difficiles. C\'est physiologique (sang qui se redistribue). Ralentir et attendre que ça passe.', warning: true },
    ],
  },

  brick_sprint: {
    id: 'brick_sprint', label: 'Enchaînement — Sprint', short: 'Brick',
    type: 'brick', color: '#AF52DE', duration: '90-110 min',
    desc: 'S57-72 : bricks format triathlon Sprint (20 km vélo + 5 km course).',
    exercises: [
      { name: 'Vélo', detail: 'S57-62 : 50-60 min · S63-72 : 65-75 min. Zone 2-3, rester assis, cadence 85+ rpm.', required: true },
      { name: 'Transition', detail: 'Simuler une vraie transition : casque, chaussures, dossard. Objectif < 2 min 30.', sets: '' },
      { name: 'Course', detail: 'S57-60 : 20 min · S61-66 : 25 min · S67-72 : 30 min. Zone 2, allure plus facile qu\'en course sèche — tu gardes de l\'énergie.', required: true },
    ],
  },

  brick_olympique: {
    id: 'brick_olympique', label: 'Enchaînement — Olympique', short: 'Brick',
    type: 'brick', color: '#AF52DE', duration: '2h-2h30',
    desc: 'S73-88 : bricks format triathlon Olympique (40 km vélo + 10 km course).',
    exercises: [
      { name: 'Vélo', detail: 'S73-78 : 80-90 min · S79-88 : 90-105 min. Zone 2-3. Position aéro le maximum.', required: true },
      { name: 'Transition', detail: 'Transition rapide. Dossard en courant.', sets: '' },
      { name: 'Course', detail: 'S73-78 : 35-40 min · S79-88 : 40-50 min. Zone 2. Trouver l\'allure 10 km sur des jambes fatiguées.', required: true },
      { name: 'Nutrition brick', detail: 'Manger sur le vélo (gel à 30 et 60 min). Ne rien prendre pendant les 20 premières minutes de course — l\'estomac ne suit pas juste après T2.', warning: true },
    ],
  },

  brick_ironman: {
    id: 'brick_ironman', label: 'Enchaînement — Ironman', short: 'Brick IM',
    type: 'brick', color: '#AF52DE', duration: '3h30-5h',
    desc: 'S89-104 : bricks longues. Simuler les conditions de course.',
    exercises: [
      { name: 'Vélo', detail: 'S89-94 : 2h30-3h · S95-100 : 3h-3h30 · S101-104 : 1 sortie 4h (simulation 1/2 vélo Ironman)', required: true },
      { name: 'Transition', detail: 'Changer de chaussures, se remasser 30 sec, puis partir. Ne jamais s\'asseoir trop longtemps.', sets: '' },
      { name: 'Course', detail: 'S89-94 : 45-55 min · S95-104 : 55-70 min. Zone 2 impérative. Pace cible Ironman (très lent, type 6 min/km).', required: true },
      { name: 'Objectif mental', detail: 'En brick Ironman tu t\'habitues à courir sur des jambes détruites. Si tu y arrives à l\'entraînement, tu le feras le jour J.', required: true },
    ],
  },

  // ── COMPÉTITION ───────────────────────────────────────────────────────────

  taper_light: {
    id: 'taper_light', label: 'Taper — Volume réduit', short: 'Taper',
    type: 'rest', color: '#8E8E93', duration: '20-30 min max',
    desc: 'Semaine de taper : volume coupé de 40-50%, intensité conservée sur de courtes durées. Le corps se recharge.',
    exercises: [
      { name: 'Principe taper', detail: 'Choisir UNE activité (nage OU vélo OU course). Durée max 25-30 min. Allure normale, juste très court.', required: true },
      { name: 'Quelques accélérations', detail: '2-3 × 30 secondes à allure de course, pour garder les fibres musculaires réactives. Puis repos.', sets: '' },
      { name: 'Garder les jambes', detail: 'Sensation de lourdeur = normal en début de taper. C\'est le stock de glycogène qui se refait. Résister à l\'envie de faire plus.', required: true },
      { name: 'Mobilité', detail: '10 min d\'étirements doux. Pas de foam roller agressif la semaine de course.', required: true },
    ],
  },

  pre_race: {
    id: 'pre_race', label: 'Veille de course', short: 'J-1',
    type: 'rest', color: '#FF9500', duration: '15-20 min',
    desc: 'Repos actif + préparation matériel. Économiser chaque gramme d\'énergie pour demain.',
    exercises: [
      { name: 'Activité légère', detail: '15 min de nage très légère OU 20 min de marche. Juste débloquer les jambes — surtout pas transpirer.', required: true },
      { name: 'Préparation matériel', detail: 'Préparer le sac T1/T2 la veille au soir. Vérifier le vélo (freins, pneus, chambre à air, cale-pieds). Préparer la nutrition race.', required: true },
      { name: 'Alimentation J-1', detail: 'Dîner glucidique (pâtes/riz sauce légère). Pas d\'alcool, pas de fibre, pas d\'aliment nouveau. Hydratation régulière.', warning: false },
      { name: 'Sommeil', detail: 'Coucher tôt. La nuit avant une course est souvent mauvaise — c\'est normal et sans impact sur la performance. La nuit J-2 comptait plus.', required: true },
    ],
  },

  race_day: {
    id: 'race_day', label: 'Jour de course', short: 'COURSE',
    type: 'brick', color: '#FF9500', duration: 'Toute la journée',
    desc: 'Ce n\'est pas une séance — c\'est la récolte de tout ce travail. Profite.',
    exercises: [
      { name: 'Réveil', detail: '3h avant le départ. Petit déjeuner identique à l\'entraînement (jamais de nouveau). 500 mL eau sur le trajet.', required: true },
      { name: 'Arrivée sur site', detail: '90 min avant le départ. Préparer T1 calmement, vérifier vélo une dernière fois, repérer la sortie nage.', required: true },
      { name: 'Échauffement', detail: '15 min de nage légère si autorisé. 5 min de vélo ou jogging tranquille.', required: true },
      { name: 'Stratégie universelle', detail: 'Nage : départ patient, trouver son rythme. Vélo : Zone 2 exclusive, jamais de sprint. Course : les 500 premiers mètres très conservateurs — c\'est là que beaucoup explosent.', required: true },
      { name: 'Nutrition course', detail: 'Gel ou pâte de fruits 20 min avant T2. Eau aux ravitaillements (ne rien refuser). Rien de nouveau par rapport à l\'entraînement.', warning: true },
      { name: 'Franchir la ligne', detail: 'Peu importe le temps. La 1ère fois on finit — c\'est tout. Ce chrono sera ta référence pour améliorer la prochaine fois.', required: true },
    ],
  },

  post_race: {
    id: 'post_race', label: 'Récupération post-course', short: 'Récup',
    type: 'rest', color: '#007AFF', duration: '20-30 min',
    desc: 'Semaine après compétition. Corps épuisé = laisser récupérer sans culpabilité.',
    exercises: [
      { name: 'Activité autorisée', detail: 'Nage douce 20-25 min OU marche 30 min. Pas de vélo intense ni de course si les jambes font mal.', required: true },
      { name: 'Hydratation+++', detail: 'Boire beaucoup les 48h post-course (eau + électrolytes). Manger : protéines + glucides + légumes. Le corps répare.', required: true },
      { name: 'Débrief positif', detail: 'Qu\'est-ce qui a bien marché ? Transition rapide ? Rythme vélo bien géré ? Chaque course enseigne quelque chose.', sets: '' },
      { name: 'Retour entraînement', detail: 'Attendre que la fatigue disparaisse complètement avant de reprendre. Mieux vaut 1 semaine de plus que 2 mois de blessure.', required: true },
    ],
  },

  // ── REPOS ────────────────────────────────────────────────────────────────

  rest: {
    id: 'rest', label: 'Repos', short: 'Repos',
    type: 'rest', color: '#8E8E93', duration: '',
    desc: 'Le corps se reconstruit pendant le repos, pas pendant l\'effort. C\'est une séance à part entière.',
    exercises: [],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PHASES (9 phases sur 2 ans = 104 semaines)
// ─────────────────────────────────────────────────────────────────────────────

// Semaines de début calculées sur PROGRAM_START = 19 juin 2026 (vendredi)
// S48  → 14 mai 2027  · Super Sprint 16 mai 2027
// S65  → 10 sep 2027  · Sprint       13 sep 2027
// S104 →  9 jun 2028  · Olympique    15 jun 2028
// S117 →  8 sep 2028  · Half-IM      21 sep 2028
// S157 → 15 jun 2029  · IRONMAN      30 jun 2029

export const PHASES: ProgramPhase[] = [
  // ── PHASE 1 : RÉÉDUCATION ─────────────────────────────────────────────────
  {
    id: 'p1a',
    label: 'Phase 1A — Fondations',
    weeks: [1, 4],
    tagline: 'Bâtir les bases sans solliciter les blessures',
    focus: ['Salle A lun · Salle B mer · Salle C ven — Hölmich 3×/sem', 'Piscine mar + sam', 'Vélo salle jeu (Z2)', 'Zéro course'],
    template: {
      lun: 'renfo_salle_a', mar: 'swim_apprivoiser', mer: 'renfo_salle_b',
      jeu: 'bike_salle', ven: 'renfo_salle_c', sam: 'swim_apprivoiser', dim: 'rest',
    },
    notes: [
      'S1-2 = mode découverte : 2 séries sur tous les exercices, charge à 50%. Après 10 ans de pause, les tendons s\'adaptent en 6-8 semaines — pas les muscles. Ne pas griller les étapes.',
      'S4 = semaine de décharge : -30% volume, -20% charge. Les tendons consolident pendant les semaines légères, pas les lourdes.',
      'Zéro course à pied — tibia et aine se reconstruisent sans impact.',
      'Hölmich 3×/semaine : lun (lourd), mer (maintenance), ven (léger+élastique). Protocole validé pour guérir la pubalgie coriace en 8-12 semaines.',
      'Pubalgie : règle absolue — jamais douloureux > 3/10 sur les exercices adducteurs.',
      'MTSS : le soléaire (genou fléchi, mercredi) est le muscle clé. Douleur tibiale lendemain > 2/10 → réduire volume 30%.',
      'Nage : objectif entrer dans l\'eau et souffler dedans. Distance non comptée encore.',
    ],
  },
  {
    id: 'p1b',
    label: 'Phase 1B — Consolidation',
    weeks: [5, 8],
    tagline: 'Hölmich Phase 2 + marche si tibias silencieux',
    focus: ['Adducteur machine +2,5 kg/sem (si S1-4 indolore)', 'Calf raises 1 jambe dès S6', 'Marche ven si tibias OK', 'Nage 25 m planche'],
    template: {
      lun: 'renfo_salle_a', mar: 'swim_apprivoiser', mer: 'renfo_salle_b',
      jeu: 'bike_salle', ven: 'renfo_salle_c', sam: 'swim_apprivoiser', dim: 'rest',
    },
    notes: [
      'S8 = semaine de décharge : réduire le volume de 30% (2 séries sur tout, charge -20%). Les tendons consolident pendant les décharges.',
      'Salle A : passer de l\'isométrie à la machine adducteurs (Hölmich Phase 2) si 4 semaines indolores.',
      'Salle B : calf raises unijambiste à partir de S6 si bilatéral maîtrisé.',
      'Salle C : augmenter charge RDL et Bulgarian split squat.',
      'Marche : si 20 min quotidiennes sans douleur tibiale depuis 1 semaine → ajouter marche après Salle C vendredi (ou en plus).',
      'Vélo : +5 min/semaine. Viser 25 min Z2 continu à S8.',
    ],
  },
  {
    id: 'p1c',
    label: 'Phase 1C — Run/Walk',
    weeks: [9, 16],
    tagline: '1 min course / 2 min marche — ultra-progressif',
    focus: ['Copenhagen S10+ (Hölmich Phase 3)', 'Run/walk ven dès S9 si tibias OK', 'Vélo 35-40 min Z2', 'Nage crawl 10-25 m'],
    template: {
      lun: 'renfo_salle_a', mar: 'swim_debutant', mer: 'renfo_salle_b',
      jeu: 'bike_salle', ven: 'renfo_salle_c', sam: 'swim_debutant', dim: 'rest',
    },
    notes: [
      'Critère course : 30 min de marche sans douleur tibiale → seulement alors ajouter 1 min de course.',
      'Douleur tibiale lendemain → semaine entière marche uniquement. Pas de négociation.',
      'Salle A : introduire Copenhagen (Hölmich Phase 3) à S10 si S7-9 totalement indolores à l\'aine.',
      'Vélo : si tu obtiens un vélo, remplacer bike_salle par une sortie route à partir de S13.',
    ],
  },

  // ── PHASE 2 : CONSTRUCTION ────────────────────────────────────────────────
  {
    id: 'p2a',
    label: 'Phase 2A — Course progressive',
    weeks: [17, 30],
    tagline: 'Construire jusqu\'à 10 min de course continue — 3,5 mois',
    focus: ['Run/walk → 10 min continus', 'Nage 50-200 m crawl', 'Vélo outdoor ou salle (45-55 min)', 'Renfo core maintenance'],
    template: {
      lun: 'renfo_core', mar: 'swim_initiation', mer: 'marche_course',
      jeu: 'bike_court_salle', ven: 'marche_course', sam: 'swim_initiation', dim: 'rest',
    },
    notes: [
      'Salle de muscu : passe en version core (20-30 min) — entretien, plus reconstruction. L\'outdoor prend le dessus.',
      'Vélo : basculer sur vélo de route dès que disponible (vise mois 4-5). Sinon bike_court_salle.',
      'Fin de phase (S28-30) : 10 min de course continue sans douleur tibiale ou pubienne.',
      '2-a-day (option S20+) : si une séance outdoor le matin, 20-30 min de muscu légère le soir est possible — entretien uniquement, volume -40%, pas de nouvelles charges. À utiliser ponctuellement si énergie et temps le permettent.',
    ],
  },
  {
    id: 'p2b',
    label: 'Phase 2B — Prépa Super Sprint',
    weeks: [31, 48],
    tagline: '20 min course, 400 m nage, 45 min vélo → Super Sprint',
    focus: ['Course 15-25 min continu', 'Nage 400-600 m', 'Vélo outdoor long dim', 'Super Sprint 16 mai 2027'],
    template: {
      lun: 'renfo_core', mar: 'swim_base', mer: 'course_debutant',
      jeu: 'bike_court_salle', ven: 'course_debutant', sam: 'swim_base', dim: 'bike_court',
    },
    notes: [
      '→ Super Sprint 16 mai 2027 (S48) : 400 m nage · 10 km vélo · 2,5 km course.',
      'Dimanche : première sortie vélo longue en extérieur (60-90 min Z2). La salle remplace si indisponible.',
      'La muscu salle n\'est plus qu\'un entretien 1x/semaine — l\'outdoor occupe maintenant la priorité.',
      'Objectif Super Sprint : finir. Le chrono ne compte pas, être à l\'arrivée oui.',
      'Taper automatique les 3 jours avant. Semaine +1 : récupération uniquement.',
    ],
  },

  // ── PHASE 3 : SPRINT → OLYMPIQUE ─────────────────────────────────────────
  {
    id: 'p3a',
    label: 'Phase 3A — Prépa Sprint',
    weeks: [49, 65],
    tagline: '30 min course, 900 m nage, 75 min vélo, bricks → Sprint',
    focus: ['Course 25-35 min', 'Nage 750-1000 m × 2/sem', 'Vélo 75-90 min', '🚴 Bricks samedi'],
    template: {
      lun: 'course_base', mar: 'swim_base', mer: 'bike_moyen',
      jeu: 'swim_base', ven: 'course_base', sam: 'brick_initiation', dim: 'rest',
    },
    notes: [
      '→ Sprint 13 sept. 2027 (S65) : 750 m nage · 20 km vélo · 5 km course.',
      '2 nages/semaine dès le début de cette phase (mar + jeu).',
      'Bricks le samedi : enchaîner vélo + course sans pause. Première vraie simulation triathlon.',
      'Transition T1/T2 : pratiquer les changements de chaussures et dossard.',
    ],
  },
  {
    id: 'p3b',
    label: 'Phase 3B — Endurance intermédiaire',
    weeks: [66, 90],
    tagline: 'Consolider post-Sprint et construire la base olympique — 6 mois',
    focus: ['Course 35-50 min + tempo', 'Nage 1000-1500 m', 'Vélo 90-120 min', 'Bricks croissants'],
    template: {
      lun: 'course_intermediaire', mar: 'swim_endurance', mer: 'bike_moyen',
      jeu: 'swim_endurance', ven: 'course_intermediaire', sam: 'brick_sprint', dim: 'bike_long',
    },
    notes: [
      'Phase la plus longue : 25 semaines pour vraiment consolider la base multisport.',
      'Introduire 1 séance qualité/semaine en course (intervalles 2-3 min).',
      'Dimanche : longue sortie vélo 2h-3h Zone 2. Importance capitale pour le vélo.',
      'Bricks samedi : format Sprint (50 min vélo + 20 min course) → vers format olympique.',
    ],
  },
  {
    id: 'p3c',
    label: 'Phase 3C — Affûtage Olympique',
    weeks: [91, 104],
    tagline: '45-55 min course, 1500 m nage, 2h vélo → Triathlon Olympique',
    focus: ['Course 45-55 min + qualité', 'Nage 1500-2000 m', 'Vélo 2-2h30', '🏃 Bricks format Olympique'],
    template: {
      lun: 'course_intermediaire', mar: 'swim_endurance', mer: 'bike_tri',
      jeu: 'swim_endurance', ven: 'course_intermediaire', sam: 'brick_sprint', dim: 'bike_long',
    },
    notes: [
      '→ Olympique 15 juin 2028 (S104) : 1500 m nage · 40 km vélo · 10 km course.',
      'Vélo milieu de semaine passe à 2h+ (bike_tri) — travail d\'endurance longue.',
      'La nage 1500 m est le premier vrai défi : objectif nager sans panique dans un départ masse.',
      'Taper 5 jours avant la course. Récupération 1 semaine complète après.',
    ],
  },

  // ── PHASE 4 : LONGUE DISTANCE → IRONMAN ─────────────────────────────────
  {
    id: 'p4a',
    label: 'Phase 4A — Prépa Half Ironman',
    weeks: [105, 117],
    tagline: '60 min course, 2000 m nage, 3h vélo → Half Ironman 70.3',
    focus: ['Course 55-70 min', 'Nage 2000-2500 m', 'Vélo 2h30-3h', '💪 Bricks 2h+'],
    template: {
      lun: 'course_avance', mar: 'swim_avance', mer: 'bike_tri',
      jeu: 'swim_avance', ven: 'course_avance', sam: 'brick_olympique', dim: 'course_long_avance',
    },
    notes: [
      '→ Half Ironman 21 sept. 2028 (S117) : 1900 m nage · 90 km vélo · 21 km course.',
      'Dimanche : long run 85-100 min — fondation du marathon Ironman.',
      'Licence FFTRI + certificat médical à obtenir avant cette phase.',
      'Bricks samedi : format olympique (90 min vélo + 40-50 min course).',
      'Si le Half se passe bien → l\'Ironman est en vue. Sinon → on décale sans hésiter.',
    ],
  },
  {
    id: 'p4b',
    label: 'Phase 4B — Longue distance base',
    weeks: [118, 140],
    tagline: '70 min course, 2500 m nage, 4h vélo — construction Ironman',
    focus: ['Course 65-80 min', 'Nage 2500-3200 m', 'Vélo 3-4h', 'Long run dim 2h'],
    template: {
      lun: 'course_avance', mar: 'swim_avance', mer: 'bike_tri',
      jeu: 'swim_avance', ven: 'course_avance', sam: 'brick_olympique', dim: 'bike_long',
    },
    notes: [
      'Phase de construction pure : volume progressif sur 23 semaines.',
      'Alterner dim long run (course_long_avance) et dim long vélo (bike_long) chaque semaine.',
      'Nage : commencer à nager en eau libre si possible (lac, mer) — simuler les conditions Ironman.',
      'Sortie vélo longue : viser 4h-5h en fin de phase (90-110 km).',
      'Coach triathlon vivement recommandé dès cette phase.',
    ],
  },
  {
    id: 'p4c',
    label: 'Phase 4C — Pic Ironman',
    weeks: [141, 157],
    tagline: '3800 m nage · 180 km vélo · 42 km course → IRONMAN',
    focus: ['Long run 2h30+', 'Nage 3000-3800 m', 'Vélo 5-6h', '🏅 Bricks Ironman'],
    template: {
      lun: 'course_avance', mar: 'swim_ironman', mer: 'bike_ironman',
      jeu: 'swim_ironman', ven: 'course_avance', sam: 'brick_ironman', dim: 'course_long_avance',
    },
    notes: [
      '→ IRONMAN 30 juin 2029 (S157) : 3800 m nage · 180 km vélo · 42,2 km course.',
      'S155-156 : taper (−40% volume, garder l\'intensité). Arriver frais et confiant.',
      'Ne jamais tester nutrition, matériel ou allure pour la première fois le jour J.',
      'Le secret de l\'Ironman : être patient sur la nage, conservateur sur le vélo, et courir à l\'écoute du corps.',
      'Quand tu franchieras la ligne, tu entendras "You are an Ironman". Tout le reste ne compte plus.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPÉTITIONS
// ─────────────────────────────────────────────────────────────────────────────

export type RaceType = 'super_sprint' | 'sprint' | 'olympic' | 'half' | 'ironman';

export interface Race {
  date: string;       // YYYY-MM-DD (samedi ou dimanche)
  label: string;
  type: RaceType;
  distances: string;
  location: string;   // indicatif — à confirmer selon les événements de ta région
  note: string;
  optional: boolean;  // peut être décalée si pas encore prêt
}

export const RACE_COLORS: Record<RaceType, string> = {
  super_sprint: '#6EC6D8',
  sprint:       '#88C49A',
  olympic:      '#CF8E42',
  half:         '#C26060',
  ironman:      '#CF8E42',
};

export const RACE_LABELS: Record<RaceType, string> = {
  super_sprint: 'Super Sprint',
  sprint:       'Sprint',
  olympic:      'Olympique',
  half:         'Half Ironman 70.3',
  ironman:      'IRONMAN',
};

// Jours de taper avant la course et récupération après (en jours)
const TAPER_CONFIG: Record<RaceType, { taper: number; recovery: number }> = {
  super_sprint: { taper: 0,  recovery: 2  },
  sprint:       { taper: 1,  recovery: 3  },
  olympic:      { taper: 3,  recovery: 5  },
  half:         { taper: 5,  recovery: 7  },
  ironman:      { taper: 10, recovery: 14 },
};

// Dates PROVISOIRES — à ajuster selon les événements réels de ta région.
// La France a des événements triathlon d'avril à octobre.
// Ces dates sont des CIBLES, pas des obligations — on décale si le corps dit non.
export const RACES: Race[] = [
  {
    date: '2027-05-16',
    label: '1er Super Sprint',
    type: 'super_sprint',
    distances: '400 m nage · 10 km vélo · 2,5 km course',
    location: 'Événement local (club ou "Try a Tri" région)',
    note: 'Objectif : franchir la ligne, peu importe le chrono. Ce jour tu deviens triathlète.',
    optional: true,
  },
  {
    date: '2027-09-13',
    label: 'Sprint Triathlon',
    type: 'sprint',
    distances: '750 m nage · 20 km vélo · 5 km course',
    location: 'Triathlon proche de chez toi',
    note: 'Premier vrai format de compétition. Évaluer la gestion des transitions et du rythme vélo.',
    optional: true,
  },
  {
    date: '2028-06-15',
    label: 'Triathlon Olympique',
    type: 'olympic',
    distances: '1 500 m nage · 40 km vélo · 10 km course',
    location: 'Triathlon Olympique (nombreux en France en juin)',
    note: 'Format complet — 1 500 m nage est le premier gros défi. Arriver à T1 sans être épuisé.',
    optional: true,
  },
  {
    date: '2028-09-21',
    label: 'Half Ironman 70.3',
    type: 'half',
    distances: '1 900 m nage · 90 km vélo · 21 km course',
    location: 'IRONMAN 70.3 ou triathlon longue distance',
    note: 'La grande répétition. Si tu finis confortablement, l\'Ironman est en vue.',
    optional: true,
  },
  {
    date: '2029-06-30',
    label: 'IRONMAN',
    type: 'ironman',
    distances: '3 800 m nage · 180 km vélo · 42,2 km course',
    location: 'IRONMAN France Nice ou autre IRONMAN étiqueté',
    note: 'Le but ultime. La date peut avancer ou reculer selon ta progression réelle — l\'important est d\'y arriver entier.',
    optional: false,
  },
];

function shiftDate(base: string, days: number): string {
  const d = new Date(base + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('fr-CA');
}

export function computeRaceOverrides(): Record<string, string> {
  const overrides: Record<string, string> = {};
  for (const race of RACES) {
    const { taper, recovery } = TAPER_CONFIG[race.type];
    // Jours de taper léger (J-taper-2 → J-3)
    for (let i = -(taper + 2); i >= -3; i--) {
      overrides[shiftDate(race.date, i)] = 'taper_light';
    }
    // Veille (J-2) : léger spécifique
    overrides[shiftDate(race.date, -2)] = 'pre_race';
    // J-1 : repos total
    overrides[shiftDate(race.date, -1)] = 'rest';
    // Jour J
    overrides[race.date] = 'race_day';
    // J+1 : repos
    overrides[shiftDate(race.date, 1)] = 'rest';
    // Récupération J+2 → J+recovery
    for (let i = 2; i <= recovery; i++) {
      overrides[shiftDate(race.date, i)] = 'post_race';
    }
  }
  return overrides;
}

// ─────────────────────────────────────────────────────────────────────────────
// SURCHARGES PONCTUELLES
// ─────────────────────────────────────────────────────────────────────────────

export const DATE_OVERRIDES: Record<string, string> = {
  '2026-06-20': 'rest',              // Samedi — nage déplacée au 23/06
  '2026-06-21': 'renfo_a',           // Dimanche de rattrapage — renfo pubalgie
  '2026-06-23': 'swim_apprivoiser',  // Mardi — PREMIÈRE SÉANCE PISCINE S1
  '2026-06-25': 'renfo_a',           // Jeudi — vélo déplacé au 26 (swap jeu↔ven)
  '2026-06-26': 'bike_stationnaire', // Vendredi — vélo récupéré du 25
  '2026-06-27': 'swim_apprivoiser',  // Nage samedi S1
  '2026-06-29': 'renfo_a',           // Lundi — salle indispo, renfo maison (pubalgie)
  '2026-06-30': 'renfo_salle_a',     // Mardi — piscine indispo, salle à la place (adducteurs machine)
  '2026-07-01': 'swim_apprivoiser',  // Mercredi — nage récupérée du 30/06
  '2026-07-03': 'renfo_b',           // Vendredi — renfo B maison (tibias/mollets) à la place de renfo_a
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export function getCurrentWeek(): number {
  const start = new Date(PROGRAM_START);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)) + 1);
}

export function getCurrentPhase(week: number): ProgramPhase {
  return PHASES.find(p => week >= p.weeks[0] && week <= p.weeks[1]) ?? PHASES[PHASES.length - 1];
}

export function getTodaySession(phase: ProgramPhase): string {
  const dow = new Date().getDay();
  const dayMap: Record<number, WeekDay> = { 1: 'lun', 2: 'mar', 3: 'mer', 4: 'jeu', 5: 'ven', 6: 'sam', 0: 'dim' };
  return phase.template[dayMap[dow]] ?? 'rest';
}
