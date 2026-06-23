export const DAILY = [
  { id: 'move',   txt: "Bouger aujourd'hui (nage, vélo, renfo ou course)", xp: 20 },
  { id: 'eat',    txt: 'Manger 3 vrais repas — nourrir, pas priver',       xp: 15 },
  { id: 'water',  txt: "Boire de l'eau régulièrement",                     xp: 10 },
  { id: 'sleep',  txt: 'Au lit à une heure raisonnable (viser 7 h)',       xp: 15 },
  { id: 'mob_matin', txt: 'Réveil mobilité — 8 min au lever',               xp: 10 },
  { id: 'mob_soir',  txt: 'Étirements soir — adaptés à la séance',         xp: 15 },
  { id: 'breath', txt: "3 respirations lentes quand l'envie de clope monte", xp: 10 },
  { id: 'read',   txt: 'Lire 15 pages d\'un livre',                        xp: 15 },
] as const;

export const DAILY_BONUS = 30;

export const QUESTS = [
  { id: 'doc',          txt: 'Prendre RDV médecin — feu vert effort',                           xp: 40,  cp: false },
  { id: 'jourj',        txt: "Fixer mon « jour J » d'arrêt du tabac",                           xp: 40,  cp: false },
  { id: 'free1',        txt: '1 journée entière sans clope',                                     xp: 50,  cp: false },
  { id: 'free3',        txt: "3 jours sans clope d'affilée",                                    xp: 80,  cp: false },
  { id: 'free7',        txt: '7 jours sans clope',                                               xp: 150, cp: false },
  { id: 'swim50',       txt: 'Premier 50 m en continu',                                          xp: 40,  cp: false },
  { id: 'swim100',      txt: 'Premier 100 m en continu',                                         xp: 60,  cp: false },
  { id: 'swim200',      txt: '200 m en continu — checkpoint nage',                               xp: 100, cp: true  },
  { id: 'bike40',       txt: 'Vélo facile 40 min — checkpoint vélo',                             xp: 80,  cp: true  },
  { id: 'run20',        txt: 'Marche/course 20 min sans douleur tibiale — checkpoint course',    xp: 100, cp: true  },
  { id: 'renfo',        txt: 'Renfo intégré à ma semaine — checkpoint force',                    xp: 80,  cp: true  },
  { id: 'supersprint',  txt: 'Terminer un Super Sprint (400 m · 10 km · 2,5 km) — ~6 mois',   xp: 200, cp: false },
  { id: 'sprint',       txt: 'Terminer un triathlon Sprint (750 m · 20 km · 5 km) — 1 an',     xp: 400, cp: true  },
  { id: 'olympic',      txt: 'Terminer un triathlon M / Olympique (1500 m · 40 km · 10 km)',   xp: 700, cp: true  },
] as const;

export const AFF = [
  "C'est le moment de me concentrer sur moi.",
  "Un 25 m aujourd'hui, c'est un de plus qu'hier.",
  "Je ne cours pas après quelqu'un. Je cours vers moi.",
  "Lentement est une allure. Continuer est une victoire.",
  "Mon souffle reviendra. Je lui laisse le temps.",
  "Le repos fait partie de l'entraînement.",
  "Manger, dormir, bouger. Le reste suivra.",
  "Chaque longueur efface une raison de douter.",
  "Je n'ai pas besoin d'être rapide. J'ai besoin d'être là demain.",
  "Trois semaines de douleur m'ont montré où était ma force.",
  "La discipline, c'est l'amour-propre en version adulte.",
  "Je choisis ma vie au lieu de la subir.",
];

export const COACH = [
  "Noté. Pas de honte — la honte fait fumer plus, pas moins. La prochaine, repousse-la de 10 minutes.",
  "Ok. Une clope ne casse rien, c'est la tendance qui compte. Bois un grand verre d'eau, là, maintenant.",
  "Compté, sans jugement. Faim, stress ou habitude ? Nomme l'envie — elle perd du pouvoir.",
  "Pris en note. Ton souffle au bassin se souvient de chaque cigarette épargnée. 3 respirations lentes avant la suivante.",
  "On ne vise pas la perfection, on vise moins qu'hier. Tu gères, Marc.",
  "Compté. Sors marcher 5 minutes — l'envie passe en 3 à 5 min, chrono en main.",
  "« On ne tombe pas pour rester à terre. » Une de plus, et on continue.",
  "Celle-là, tu la subissais peut-être. La prochaine, tu peux la choisir — ou la laisser.",
];

export const LEVELS = [
  'Le plongeon', 'Tête hors de l\'eau', 'Cardio en chantier', 'Nageur régulier',
  'Le corps répond', 'Endurance qui monte', 'Machine en rodage',
  'Triathlète en devenir', 'Sur la rampe', 'Inarrêtable',
];

export const MOODS = [
  { v: 1, color: '#BD5A48', l: 'Très bas' },
  { v: 2, color: '#A07840', l: 'Bas' },
  { v: 3, color: '#7A7870', l: 'Moyen' },
  { v: 4, color: '#C8AA70', l: 'Bien' },
  { v: 5, color: '#CF8E42', l: 'Au top' },
];

export const XP_PER_LEVEL = 150;
