// Plan nutritionnel Marc — SII bas-FODMAP · sans lactose · budget < 70 €/semaine
// Principe : 1 seul féculent (riz basmati), protéines bon marché, légumes basiques
// Calorie ciblées selon la charge d'entraînement du jour

export type NutritionLoad = 'repos' | 'leger' | 'moyen' | 'intense';
export type ShopCat = 'Fruits & légumes' | 'Protéines' | 'Féculents & céréales' | 'Épicerie sèche' | 'Frais';

// ─────────────────────────────────────────────────────────────────────────────
// CHARGE PAR TYPE DE SÉANCE
// ─────────────────────────────────────────────────────────────────────────────

export const SESSION_LOAD: Record<string, NutritionLoad> = {
  rest: 'repos', post_race: 'repos',
  renfo_a: 'leger', renfo_b: 'leger', renfo_core: 'leger',
  swim_debutant: 'leger', swim_initiation: 'leger',
  bike_stationnaire: 'leger', marche: 'leger',
  marche_course: 'leger', taper_light: 'leger', pre_race: 'leger',
  swim_base: 'moyen', swim_endurance: 'moyen',
  bike_court: 'moyen',
  course_debutant: 'moyen', course_base: 'moyen', course_intermediaire: 'moyen',
  swim_avance: 'intense', swim_ironman: 'intense',
  bike_moyen: 'intense', bike_tri: 'intense', bike_long: 'intense', bike_ironman: 'intense',
  course_avance: 'intense', course_long: 'intense',
  course_long_avance: 'intense', course_marathon: 'intense',
  brick_initiation: 'intense', brick_sprint: 'intense',
  brick_olympique: 'intense', brick_ironman: 'intense', race_day: 'intense',
};

export const LOAD_TARGETS: Record<NutritionLoad, { kcal: number; protein: number; label: string; color: string }> = {
  repos:   { kcal: 1950, protein: 100, label: 'Repos',   color: '#8E8E93' },
  leger:   { kcal: 2200, protein: 120, label: 'Léger',   color: '#34C759' },
  moyen:   { kcal: 2500, protein: 140, label: 'Moyen',   color: '#FF9500' },
  intense: { kcal: 2900, protein: 160, label: 'Intense', color: '#FF3B30' },
};

// ─────────────────────────────────────────────────────────────────────────────
// STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────

export interface Ingredient {
  name: string;
  qty: string;
  cat: ShopCat;
}

export interface MealOption {
  id: string;
  label: string;
  desc: string;
  kcal: number;
  protein: number;
  ingredients: Ingredient[];
  tip?: string;
  preTraining?: boolean;
  postTraining?: boolean;
}

export interface DayNutrition {
  load: NutritionLoad;
  targetKcal: number;
  targetProtein: number;
  breakfast: MealOption;
  snackAM: MealOption;
  lunch: MealOption;
  preTrainingSnack: MealOption | null;
  postTrainingSnack: MealOption | null;
  snackPM: MealOption;
  dinner: MealOption;
}

// ─────────────────────────────────────────────────────────────────────────────
// PETIT-DÉJEUNERS — 3 options, tous bon marché
// ─────────────────────────────────────────────────────────────────────────────

export const BREAKFASTS: MealOption[] = [
  {
    id: 'b1', label: 'Porridge avoine banane', kcal: 420, protein: 10,
    desc: '60g flocons avoine + 200ml lait avoine + 1 banane',
    tip: 'Batch : préparer la base avoine/lait pour 3 jours au frigo — réchauffer 1 min au micro avec la banane.',
    ingredients: [
      { name: 'Flocons d\'avoine', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Lait d\'avoine', qty: '200 ml', cat: 'Frais' },
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'b2', label: 'Œufs brouillés + riz + pomme', kcal: 430, protein: 17,
    desc: '2 œufs brouillés + 60g riz basmati (du batch) + 1 pomme',
    tip: 'Option protéinée pour les matins d\'entraînement. Le riz précuit réchauffe en 1 min.',
    ingredients: [
      { name: 'Œufs', qty: '2', cat: 'Frais' },
      { name: 'Riz basmati', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Pomme', qty: '1', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'b3', label: 'Porridge avoine + 2 œufs durs + banane', kcal: 460, protein: 20,
    desc: '50g flocons avoine + 200ml lait avoine + 2 œufs durs (cuits la veille) + 1 banane',
    tip: 'Faire cuire 6 œufs durs le dimanche — ils se gardent 5 jours et accélèrent tous les petits-déjeuners.',
    ingredients: [
      { name: 'Flocons d\'avoine', qty: '50 g', cat: 'Féculents & céréales' },
      { name: 'Lait d\'avoine', qty: '200 ml', cat: 'Frais' },
      { name: 'Œufs', qty: '2', cat: 'Frais' },
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DÉJEUNERS — 5 options, tous à base de riz basmati
// ─────────────────────────────────────────────────────────────────────────────

export const LUNCHES: MealOption[] = [
  {
    id: 'l1', label: 'Thon riz salade (ultra-rapide)', kcal: 510, protein: 43,
    desc: '1 boîte thon naturel (140g) + 80g riz basmati + 1 tomate + poignée salade + ½ citron + huile olive',
    tip: '3 min si le riz est cuit. La formule la moins chère avec la meilleure densité protéique.',
    ingredients: [
      { name: 'Thon au naturel (boîte)', qty: '140 g égoutté', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Tomate', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Salade verte', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
      { name: 'Huile d\'olive', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l2', label: 'Riz poulet carotte (batch)', kcal: 530, protein: 40,
    desc: '150g cuisses poulet effilées (du batch) + 80g riz + 1 carotte sautée + herbes + citron',
    tip: 'Cuire 600g de cuisses le dimanche — effilocher froid, conserver 4 jours au frigo.',
    ingredients: [
      { name: 'Cuisses de poulet', qty: '150 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Carotte', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l3', label: 'Sardines riz épinards (le moins cher)', kcal: 550, protein: 36,
    desc: '2 boîtes sardines (90g) + 80g riz + 80g épinards surgelés décongelés + ½ citron',
    tip: 'Le repas le moins cher (~1,60€) et pourtant l\'un des plus riches en oméga-3 et calcium.',
    ingredients: [
      { name: 'Sardines à l\'huile (boîte)', qty: '2 × 90 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Épinards surgelés', qty: '80 g', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'l4', label: 'Bowl bœuf haché carotte tamari', kcal: 560, protein: 37,
    desc: '130g bœuf haché poêlé + 80g riz + 1 carotte râpée + sauce tamari',
    tip: 'Cuire le haché 4 min à feu vif. La sauce tamari remplace avantageusement la sauce soja.',
    ingredients: [
      { name: 'Bœuf haché', qty: '130 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Carotte', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Sauce tamari', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l5', label: 'Maquereau riz courgette (oméga-3 budget)', kcal: 490, protein: 33,
    desc: '1 boîte maquereau au naturel (125g) + 80g riz + 1 courgette vapeur + herbes + citron',
    tip: 'Le maquereau en boîte = champion oméga-3 anti-inflammatoire à 1,50€. Parfait pour les périostites.',
    ingredients: [
      { name: 'Maquereau au naturel (boîte)', qty: '125 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Courgette', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DÎNERS — 5 options, tous simples et économiques
// ─────────────────────────────────────────────────────────────────────────────

export const DINNERS: MealOption[] = [
  {
    id: 'd1', label: 'Cuisses poulet rôties + riz + carottes', kcal: 600, protein: 42,
    desc: '180g cuisses poulet rôties au four + 80g riz basmati + 2 carottes rôties',
    tip: 'Batch dominical : rôtir 1 kg de cuisses = 5 repas. Se réchauffe parfaitement 4 jours au frigo.',
    ingredients: [
      { name: 'Cuisses de poulet', qty: '180 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Carotte', qty: '2', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd2', label: 'Bœuf haché + riz + courgette sauté', kcal: 570, protein: 38,
    desc: '150g bœuf haché poêlé + 80g riz basmati + 1 courgette sautée + herbes',
    tip: 'Faire une galette de haché (style burger sans pain) — 4 min par face à feu vif. Se congèle très bien.',
    ingredients: [
      { name: 'Bœuf haché', qty: '150 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Courgette', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd3', label: 'Dinde hachée + riz + poireau', kcal: 540, protein: 40,
    desc: '150g dinde hachée + 80g riz basmati + 1 poireau fondu + herbes',
    tip: 'Le vert du poireau uniquement (bas-FODMAP, moins de fructanes). Faire fondre 8 min à feu doux.',
    ingredients: [
      { name: 'Dinde hachée', qty: '150 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Poireau', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd4', label: '3 œufs + riz + tomates (soir léger)', kcal: 440, protein: 24,
    desc: '3 œufs brouillés + 60g riz basmati + 2 tomates + herbes + filet d\'huile olive',
    tip: 'Soir de repos ou ventre sensible. Très digeste, riche en protéines complètes, prêt en 10 min.',
    ingredients: [
      { name: 'Œufs', qty: '3', cat: 'Frais' },
      { name: 'Riz basmati', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Tomate', qty: '2', cat: 'Fruits & légumes' },
      { name: 'Huile d\'olive', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd5', label: 'Maquereau + patate douce + épinards', kcal: 490, protein: 28,
    desc: '1 boîte maquereau au naturel (125g) + 200g patate douce rôtie + 80g épinards surgelés',
    tip: 'Combo anti-inflammatoire optimal : oméga-3 + bêta-carotène + fer. Idéal le soir après entraînement.',
    ingredients: [
      { name: 'Maquereau au naturel (boîte)', qty: '125 g', cat: 'Protéines' },
      { name: 'Patate douce', qty: '200 g', cat: 'Fruits & légumes' },
      { name: 'Épinards surgelés', qty: '80 g', cat: 'Fruits & légumes' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COLLATIONS (2 options chacune — pas cher)
// ─────────────────────────────────────────────────────────────────────────────

export const SNACKS_AM: MealOption[] = [
  {
    id: 'sam1', label: 'Banane + amandes', kcal: 195, protein: 6,
    desc: '1 banane mûre + 20g amandes entières',
    tip: 'La collation la moins chère et la plus complète. Banane = glucides rapides, amandes = graisses stables.',
    ingredients: [
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Amandes', qty: '20 g', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'sam2', label: '3 galettes de riz + beurre de cacahuète', kcal: 235, protein: 7,
    desc: '3 galettes de riz + 2 cs beurre de cacahuète (sans sucre ajouté, 1 seul ingrédient)',
    tip: 'Choisir un beurre de cacahuète à 1 ingrédient : cacahuètes. Lidl en a un à 2,50€ le pot 340g.',
    ingredients: [
      { name: 'Galettes de riz', qty: '3', cat: 'Féculents & céréales' },
      { name: 'Beurre de cacahuète', qty: '30 g', cat: 'Épicerie sèche' },
    ],
  },
];

export const SNACKS_PM: MealOption[] = [
  {
    id: 'spm1', label: 'Pomme + amandes', kcal: 150, protein: 4,
    desc: '1 pomme + 15g amandes entières',
    ingredients: [
      { name: 'Pomme', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Amandes', qty: '15 g', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'spm2', label: '2 galettes de riz + beurre de cacahuète', kcal: 175, protein: 5,
    desc: '2 galettes de riz + 1 cs beurre de cacahuète',
    ingredients: [
      { name: 'Galettes de riz', qty: '2', cat: 'Féculents & céréales' },
      { name: 'Beurre de cacahuète', qty: '15 g', cat: 'Épicerie sèche' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SNACKS PRÉ / POST ENTRAÎNEMENT
// ─────────────────────────────────────────────────────────────────────────────

export const PRE_TRAINING: MealOption = {
  id: 'pre', label: 'Pré-entraînement (30 min avant)', kcal: 170, protein: 2,
  desc: '1 banane mûre + 2 galettes de riz. Glucides rapides, digestion facile.',
  tip: 'Ne rien manger si l\'estomac est capricieux — mieux vaut y aller léger.',
  preTraining: true,
  ingredients: [
    { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
    { name: 'Galettes de riz', qty: '2', cat: 'Féculents & céréales' },
  ],
};

export const POST_TRAINING: MealOption = {
  id: 'post', label: 'Post-entraînement (dans les 30 min)', kcal: 315, protein: 36,
  desc: '1 boîte thon au naturel (140g) + 2 galettes de riz. Protéines + glucides pour récupérer.',
  tip: 'La fenêtre anabolique dure 30-60 min. Le thon en boîte = protéines immédiates sans cuisson.',
  postTraining: true,
  ingredients: [
    { name: 'Thon au naturel (boîte)', qty: '140 g', cat: 'Protéines' },
    { name: 'Galettes de riz', qty: '2', cat: 'Féculents & céréales' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// FONCTION PRINCIPALE — plan du jour
// ─────────────────────────────────────────────────────────────────────────────

export function getDayNutrition(
  weekNum: number,
  dayIndex: number, // 0=lun … 6=dim
  sessionId: string
): DayNutrition {
  const load: NutritionLoad = SESSION_LOAD[sessionId] ?? 'leger';
  const targets = LOAD_TARGETS[load];

  // Rotation déterministe : chaque semaine tourne, chaque jour est différent
  const breakfast = BREAKFASTS[(weekNum + dayIndex) % BREAKFASTS.length];
  const snackAM   = SNACKS_AM[dayIndex % SNACKS_AM.length];
  const lunch     = LUNCHES[(weekNum * 3 + dayIndex) % LUNCHES.length];
  const snackPM   = SNACKS_PM[(weekNum + dayIndex * 2) % SNACKS_PM.length];
  const dinner    = DINNERS[(weekNum * 2 + dayIndex) % DINNERS.length];

  const needsPre  = load === 'moyen' || load === 'intense';
  const needsPost = load === 'moyen' || load === 'intense';

  return {
    load,
    targetKcal: targets.kcal,
    targetProtein: targets.protein,
    breakfast,
    snackAM,
    lunch,
    preTrainingSnack: needsPre ? PRE_TRAINING : null,
    postTrainingSnack: needsPost ? POST_TRAINING : null,
    snackPM,
    dinner,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LISTE DE COURSES — vraies quantités d'achat
// ─────────────────────────────────────────────────────────────────────────────

const SHOP_ORDER: ShopCat[] = [
  'Fruits & légumes', 'Protéines', 'Féculents & céréales', 'Frais', 'Épicerie sèche',
];

type QtyUnit = 'g' | 'ml' | 'count' | 'other';

function parseIngQty(raw: string): { value: number; unit: QtyUnit } {
  let s = raw.trim()
    .replace(/½/g, '0.5').replace(/¼/g, '0.25').replace(/¾/g, '0.75')
    .replace(/\s*égoutté.*/i, '')
    .replace(/\s*grande\s*$/i, '')
    .replace(/^un peu$/i, '1')
    .replace(/^poignée$/i, '1')
    .trim();

  // "2 × 90 g"
  const mul = s.match(/^(\d[\d.]*)\s*[×x]\s*(\d[\d.]*)\s*(g|ml)?$/i);
  if (mul) {
    const v = parseFloat(mul[1]) * parseFloat(mul[2]);
    const u = (mul[3] || '').toLowerCase();
    return { value: v, unit: u === 'g' ? 'g' : u === 'ml' ? 'ml' : 'count' };
  }

  const m = s.match(/^(\d[\d.]*)\s*(g|ml)?/i);
  if (!m) return { value: 1, unit: 'other' };

  const val = parseFloat(m[1]);
  const u = (m[2] || '').toLowerCase();
  if (u === 'g') return { value: val, unit: 'g' };
  if (u === 'ml') return { value: val, unit: 'ml' };
  const rest = s.slice(m[0].length).trim().toLowerCase();
  // cs/cc/pincée/branche → condiments non mesurables
  if (rest === 'cs' || rest === 'cc' || rest === 'pincée' || rest === 'branche') {
    return { value: val, unit: 'other' };
  }
  return { value: val, unit: 'count' };
}

function toShopQty(name: string, total: number, unit: QtyUnit): string {
  const n = name.toLowerCase();

  if (unit === 'count') {
    const cnt = Math.ceil(total);
    if (n.includes('banane')) {
      const r = Math.max(1, Math.ceil(cnt / 5));
      return `${r} régime${r > 1 ? 's' : ''} de bananes`;
    }
    if (n.includes('carotte')) {
      const s = Math.max(1, Math.ceil(cnt / 7));
      return `${s} sac${s > 1 ? 's' : ''} de carottes (1 kg)`;
    }
    if (n.includes('courgette')) {
      const f = Math.max(1, Math.ceil(cnt / 3));
      return `${f} filet${f > 1 ? 's' : ''} de courgettes`;
    }
    if (n.includes('pomme'))     return `${cnt} pomme${cnt > 1 ? 's' : ''}`;
    if (n.includes('citron'))    return `${cnt} citron${cnt > 1 ? 's' : ''}`;
    if (n.includes('poireau'))   return `${cnt} poireau${cnt > 1 ? 'x' : ''}`;
    if (n.includes('tomate'))    return `${cnt} tomate${cnt > 1 ? 's' : ''}`;
    if (n.includes('salade'))    return '1 sachet de salade';
    if (n.includes('œuf') || n.includes('oeuf')) return `${cnt} œuf${cnt > 1 ? 's' : ''}`;
    if (n.includes('galette'))   return `${cnt} galettes de riz`;
    if (n.includes('sardines'))  return `${cnt} boîte${cnt > 1 ? 's' : ''} sardines`;
    if (n.includes('thon'))      return `${cnt} boîte${cnt > 1 ? 's' : ''} thon`;
    return `${cnt}`;
  }

  if (unit === 'g') {
    const rounded = Math.ceil(total / 10) * 10;
    if (n.includes('sardines'))           return `${Math.ceil(total / 90)} boîte${Math.ceil(total / 90) > 1 ? 's' : ''} 90g`;
    if (n.includes('thon'))               return `${Math.ceil(total / 140)} boîte${Math.ceil(total / 140) > 1 ? 's' : ''} 140g`;
    if (n.includes('maquereau'))          return `${Math.ceil(total / 125)} boîte${Math.ceil(total / 125) > 1 ? 's' : ''} 125g`;
    if (n.includes('beurre de cacahuète')) return '1 pot 340g';
    if (n.includes('épinards surgelés') || (n.includes('épinards') && n.includes('surgelé'))) {
      return total <= 200 ? '1 sac 400g (surgelés)' : '2 sacs 400g (surgelés)';
    }
    if (n.includes('épinards'))           return total <= 120 ? '1 sac 200g' : '1 sac 400g';
    if (n.includes('patate douce'))       return `${Math.ceil(total / 400)} sachet${Math.ceil(total / 400) > 1 ? 's' : ''} 400g`;
    if (rounded >= 1000)                  return `${(rounded / 1000).toFixed(1).replace('.0', '')} kg`;
    return `${rounded} g`;
  }

  if (unit === 'ml') {
    const rounded = Math.ceil(total / 100) * 100;
    if (rounded <= 500)  return `${rounded} ml`;
    if (rounded <= 1200) return '1 brique 1 L';
    return `${Math.ceil(total / 1000)} L`;
  }

  return 'au besoin';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIX LIDL FRANCE (juin 2026) — price: €/unité d'achat, per: qté couverte
// Principe : uniquement les ingrédients achetés régulièrement (pas les condiments au stock)
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_PRICES: Record<string, { price: number; per: number }> = {
  // Fruits & légumes
  'banane':                        { price: 1.39, per: 5   }, // régime 5 bananes
  'carotte':                       { price: 1.20, per: 7   }, // sac 1kg ≈ 7 carottes
  'citron':                        { price: 0.55, per: 1   },
  'courgette':                     { price: 2.49, per: 3   }, // filet 3 courgettes
  'patate douce':                  { price: 1.80, per: 400 }, // sachet 400g
  'poireau':                       { price: 0.90, per: 1   },
  'pomme':                         { price: 0.35, per: 1   },
  'salade verte':                  { price: 1.45, per: 4   }, // 1 sachet = 4 portions
  'tomate':                        { price: 1.50, per: 6   }, // ~6 tomates vrac 500g
  'épinards surgelés':             { price: 1.20, per: 400 }, // sac 400g
  // Protéines
  'bœuf haché':                    { price: 3.20, per: 300 },
  'cuisses de poulet':             { price: 3.50, per: 600 },
  'dinde hachée':                  { price: 3.50, per: 300 },
  'maquereau au naturel (boîte)':  { price: 1.50, per: 125 },
  'sardines à l\'huile (boîte)':   { price: 1.30, per: 90  },
  'thon au naturel (boîte)':       { price: 1.80, per: 140 },
  // Féculents
  'flocons d\'avoine':             { price: 1.50, per: 500 },
  'galettes de riz':               { price: 1.99, per: 10  },
  'riz basmati':                   { price: 2.79, per: 1000 },
  // Frais
  'lait d\'avoine':                { price: 1.89, per: 1000 },
  'œufs':                          { price: 3.15, per: 6   },
  // Épicerie sèche quantifiable
  'amandes':                       { price: 2.00, per: 150 },
  'beurre de cacahuète':           { price: 2.50, per: 340 },
};

function computeIngredientPrice(name: string, total: number, unit: QtyUnit): number {
  const entry = UNIT_PRICES[name.toLowerCase()];
  if (!entry) return 0;
  const units = Math.max(1, Math.ceil(total / entry.per));
  return Math.round(units * entry.price * 100) / 100;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface ShoppingItem {
  name: string;
  cat: ShopCat;
  shopQty: string;
  priceEst: number; // € Lidl estimé pour la semaine (0 = condiment au stock)
}

export function getWeekShoppingList(dayPlans: DayNutrition[]): Record<ShopCat, ShoppingItem[]> {
  interface Accum { name: string; cat: ShopCat; value: number; unit: QtyUnit; }
  const map: Record<string, Accum> = {};

  function addIngredients(meal: MealOption | null) {
    if (!meal) return;
    for (const ing of meal.ingredients) {
      const key = ing.name.toLowerCase();
      const parsed = parseIngQty(ing.qty);
      if (map[key]) {
        map[key].value += parsed.value;
      } else {
        map[key] = { name: ing.name, cat: ing.cat, value: parsed.value, unit: parsed.unit };
      }
    }
  }

  for (const plan of dayPlans) {
    addIngredients(plan.breakfast);
    addIngredients(plan.snackAM);
    addIngredients(plan.lunch);
    addIngredients(plan.snackPM);
    addIngredients(plan.dinner);
    addIngredients(plan.preTrainingSnack);
    addIngredients(plan.postTrainingSnack);
  }

  const result: Record<ShopCat, ShoppingItem[]> = {
    'Fruits & légumes': [], 'Protéines': [], 'Féculents & céréales': [],
    'Frais': [], 'Épicerie sèche': [],
  };

  for (const accum of Object.values(map)) {
    result[accum.cat].push({
      name: accum.name,
      cat: accum.cat,
      shopQty: toShopQty(accum.name, accum.value, accum.unit),
      priceEst: computeIngredientPrice(accum.name, accum.value, accum.unit),
    });
  }

  for (const cat of SHOP_ORDER) {
    result[cat].sort((a, b) => a.name.localeCompare(b.name));
  }

  return result;
}

export { SHOP_ORDER };

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES AFFICHAGE
// ─────────────────────────────────────────────────────────────────────────────

export const FODMAP_TIPS = [
  'Ail & oignon : utiliser l\'huile infusée (retirer l\'oignon avant de manger) pour le goût sans les FODMAP.',
  'Lactose : remplacer tout produit laitier par lait d\'avoine ou lait de riz.',
  'Avoine : 60g max par repas sinon ballonnements — bien toléré en petite quantité.',
  'Cuire les légumes les rend bien plus digestibles — vapeur, sauté ou rôti au four.',
  'Poireau : utiliser uniquement le vert (bas-FODMAP). Le blanc est riche en fructanes.',
  'Banane mûre : bien tolérée IBS. Éviter les bananes vertes (amidon résistant).',
  'Gingembre frais : anti-inflammatoire naturel + aide la digestion. Ajouter aux plats sautés.',
  'Épinards surgelés : même valeur nutritive que frais, moins chers, zéro gaspillage.',
];

export const PANTRY_BASICS = [
  'Huile d\'olive (bouteille)',
  'Sauce tamari sans gluten',
  'Riz basmati (kg)',
  'Sel, poivre',
  'Herbes de Provence',
  'Cannelle moulue',
  'Cumin moulu',
];
