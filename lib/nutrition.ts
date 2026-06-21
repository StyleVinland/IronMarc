// Plan nutritionnel Marc — SII bas-FODMAP · sans lactose · budget serré · varié + international
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
// PETIT-DÉJEUNERS (6 options — rotation)
// ─────────────────────────────────────────────────────────────────────────────

export const BREAKFASTS: MealOption[] = [
  {
    id: 'b1', label: 'Porridge avoine-banane + 2 œufs', kcal: 620, protein: 28,
    desc: '60g flocons avoine + 250ml lait avoine + 1 banane + miel + 2 œufs brouillés',
    tip: 'Cuire les œufs en même temps que l\'avoine chauffe — 5 min top chrono.',
    ingredients: [
      { name: 'Flocons d\'avoine', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Lait d\'avoine', qty: '250 ml', cat: 'Frais' },
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Miel', qty: '1 cs', cat: 'Épicerie sèche' },
      { name: 'Œufs', qty: '2', cat: 'Frais' },
      { name: 'Huile d\'olive', qty: 'un peu', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'b2', label: 'Smoothie banane-amande + galettes riz + avocat', kcal: 590, protein: 14,
    desc: 'Smoothie : 1 banane + 200ml lait amande + 1cs beurre amande · 3 galettes de riz + ½ avocat',
    tip: 'Rapide le matin — smoothie dans le blender pendant que les galettes attendent.',
    ingredients: [
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Lait d\'amande', qty: '200 ml', cat: 'Frais' },
      { name: 'Beurre d\'amande', qty: '1 cs', cat: 'Épicerie sèche' },
      { name: 'Galettes de riz', qty: '3', cat: 'Féculents & céréales' },
      { name: 'Avocat', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'b3', label: 'Bowl patate douce + 3 œufs brouillés', kcal: 580, protein: 26,
    desc: '150g patate douce rôtie dès dés + 3 œufs brouillés + tomates cerises + huile olive',
    tip: 'Rôtir la patate douce la veille en batch — elle se réchauffe en 2 min au micro-ondes.',
    ingredients: [
      { name: 'Patate douce', qty: '150 g', cat: 'Fruits & légumes' },
      { name: 'Œufs', qty: '3', cat: 'Frais' },
      { name: 'Tomates cerises', qty: '6', cat: 'Fruits & légumes' },
      { name: 'Huile d\'olive', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'b4', label: 'Pancakes avoine-banane + fraises', kcal: 560, protein: 20,
    desc: '60g avoine mixé + 1 banane + 2 œufs + 50ml lait amande · fraises fraîches + sirop érable',
    tip: 'Week-end ou batch : faire une double dose et congeler le surplus.',
    ingredients: [
      { name: 'Flocons d\'avoine', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Œufs', qty: '2', cat: 'Frais' },
      { name: 'Lait d\'amande', qty: '50 ml', cat: 'Frais' },
      { name: 'Fraises', qty: '150 g', cat: 'Fruits & légumes' },
      { name: 'Sirop d\'érable', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'b5', label: 'Pain de riz + beurre amande + 2 œufs à la coque', kcal: 550, protein: 22,
    desc: '3 tranches pain de riz grillé + 2cs beurre amande + 2 œufs à la coque + 1 orange',
    tip: 'Le plus rapide — 8 min chrono avec les œufs.',
    ingredients: [
      { name: 'Pain de riz', qty: '3 tranches', cat: 'Féculents & céréales' },
      { name: 'Beurre d\'amande', qty: '2 cs', cat: 'Épicerie sèche' },
      { name: 'Œufs', qty: '2', cat: 'Frais' },
      { name: 'Orange', qty: '1', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'b6', label: 'Bowl riz soufflé + 3 œufs brouillés + myrtilles', kcal: 540, protein: 24,
    desc: '40g riz soufflé + 200ml lait avoine + 3 œufs brouillés + 80g myrtilles + cannelle',
    tip: 'Myrtilles : excellentes antioxydantes, anti-inflammatoires. Idéales après une séance.',
    ingredients: [
      { name: 'Riz soufflé', qty: '40 g', cat: 'Féculents & céréales' },
      { name: 'Lait d\'avoine', qty: '200 ml', cat: 'Frais' },
      { name: 'Œufs', qty: '3', cat: 'Frais' },
      { name: 'Myrtilles', qty: '80 g', cat: 'Fruits & légumes' },
      { name: 'Cannelle', qty: '1 pincée', cat: 'Épicerie sèche' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DÉJEUNERS (8 options)
// ─────────────────────────────────────────────────────────────────────────────

export const LUNCHES: MealOption[] = [
  {
    id: 'l1', label: 'Poulet riz courgettes sauté', kcal: 580, protein: 42,
    desc: '150g blanc poulet + 80g riz basmati + 1 courgette + herbes + citron',
    tip: 'Base du batch cooking. Cuire 600g de poulet le dimanche = 4 déjeuners.',
    ingredients: [
      { name: 'Blanc de poulet', qty: '150 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Courgette', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l2', label: 'Bowl thaï crevettes-gingembre', kcal: 560, protein: 34,
    desc: '130g crevettes + 80g riz jasmin + carotte + sauce tamari-sésame-gingembre',
    tip: 'Le tamari (sans gluten) remplace la sauce soja. Parfait IBS.',
    ingredients: [
      { name: 'Crevettes décortiquées', qty: '130 g', cat: 'Protéines' },
      { name: 'Riz jasmin', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Carotte', qty: '1 grande', cat: 'Fruits & légumes' },
      { name: 'Gingembre frais', qty: '2 cm', cat: 'Fruits & légumes' },
      { name: 'Sauce tamari', qty: '2 cs', cat: 'Épicerie sèche' },
      { name: 'Huile de sésame', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l3', label: 'Sardines-quinoa-poivron rôti', kcal: 600, protein: 36,
    desc: '2 boîtes sardines à l\'huile + 80g quinoa + 1 poivron rouge rôti + citron',
    tip: 'Option la moins chère et la plus riche en oméga-3. Excellent pour l\'inflammation.',
    ingredients: [
      { name: 'Sardines à l\'huile (boîte)', qty: '2 × 90 g', cat: 'Protéines' },
      { name: 'Quinoa', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Poivron rouge', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'l4', label: 'Thon riz épinards (ultra-rapide)', kcal: 530, protein: 44,
    desc: '1 boîte thon naturel + 80g riz + épinards frais + tomates cerises + huile olive',
    tip: 'Repas assemblé en 3 min si le riz est cuit à l\'avance.',
    ingredients: [
      { name: 'Thon au naturel (boîte)', qty: '140 g égoutté', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Épinards frais', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Tomates cerises', qty: '8', cat: 'Fruits & légumes' },
      { name: 'Huile d\'olive', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l5', label: 'Bowl coréen bœuf sauté (bibimbap simplifié)', kcal: 610, protein: 38,
    desc: '130g bœuf haché + riz + épinards sautés + carotte râpée + œuf frit + tamari-sésame',
    tip: 'Le bibimbap est naturellement sans lactose et très rassasiant. Économique avec du haché.',
    ingredients: [
      { name: 'Bœuf haché', qty: '130 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Épinards frais', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Carotte', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Œufs', qty: '1', cat: 'Frais' },
      { name: 'Sauce tamari', qty: '1 cs', cat: 'Épicerie sèche' },
      { name: 'Huile de sésame', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'l6', label: 'Pâtes de riz maquereau épinards', kcal: 565, protein: 35,
    desc: '80g pâtes riz + 1 boîte maquereau au naturel (125g) + épinards + tomates cerises + citron',
    tip: 'Le maquereau en boîte est encore plus riche en oméga-3 que le saumon, et 3× moins cher. Parfait IBS.',
    ingredients: [
      { name: 'Pâtes de riz', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Maquereau au naturel (boîte)', qty: '125 g', cat: 'Protéines' },
      { name: 'Épinards frais', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Tomates cerises', qty: '8', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'l7', label: 'Wrap riz-poulet-avocat', kcal: 590, protein: 36,
    desc: '2 galettes de riz grande taille + 130g poulet effilé + ½ avocat + salade + tomate',
    tip: 'Idéal à emporter. Garder le poulet et l\'avocat séparés jusqu\'au moment de manger.',
    ingredients: [
      { name: 'Galettes de riz', qty: '2', cat: 'Féculents & céréales' },
      { name: 'Blanc de poulet', qty: '130 g', cat: 'Protéines' },
      { name: 'Avocat', qty: '½', cat: 'Fruits & légumes' },
      { name: 'Salade verte', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Tomate', qty: '1', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'l8', label: 'Soupe miso-gingembre + riz + thon', kcal: 500, protein: 34,
    desc: 'Bouillon tamari-gingembre + carottes + courgette + 1 boîte thon + 60g riz',
    tip: 'Jour léger ou ventre sensible — très digeste, chaud et réconfortant.',
    ingredients: [
      { name: 'Thon au naturel (boîte)', qty: '120 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Carotte', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Courgette', qty: '½', cat: 'Fruits & légumes' },
      { name: 'Gingembre frais', qty: '2 cm', cat: 'Fruits & légumes' },
      { name: 'Sauce tamari', qty: '2 cs', cat: 'Épicerie sèche' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DÎNERS (8 options)
// ─────────────────────────────────────────────────────────────────────────────

export const DINNERS: MealOption[] = [
  {
    id: 'd1', label: 'Truite papillote + quinoa + épinards', kcal: 520, protein: 38,
    desc: '150g filet de truite + 80g quinoa + épinards sautés + citron + herbes',
    tip: 'La truite saumonée a les mêmes oméga-3 que le saumon pour 3× moins cher. En papillote four = 20 min sans surveillance.',
    ingredients: [
      { name: 'Filet de truite', qty: '150 g', cat: 'Protéines' },
      { name: 'Quinoa', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Épinards frais', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'd2', label: 'Dinde hachée + patate douce + haricots verts', kcal: 640, protein: 40,
    desc: '150g haché dinde + 200g patate douce rôtie + 100g haricots verts vapeur',
    tip: 'La dinde est la protéine la moins chère au kilo. Riche en tryptophane = bon sommeil.',
    ingredients: [
      { name: 'Dinde hachée', qty: '150 g', cat: 'Protéines' },
      { name: 'Patate douce', qty: '200 g', cat: 'Fruits & légumes' },
      { name: 'Haricots verts', qty: '100 g', cat: 'Fruits & légumes' },
      { name: 'Huile d\'olive', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd3', label: 'Poulet rôti + pommes de terre + carottes', kcal: 650, protein: 42,
    desc: '180g cuisse poulet rôtie + 200g pommes de terre + 150g carottes rôties au four',
    tip: 'Faire un grand plat le dimanche — se réchauffe parfaitement les 2 jours suivants.',
    ingredients: [
      { name: 'Cuisses de poulet', qty: '180 g', cat: 'Protéines' },
      { name: 'Pommes de terre', qty: '200 g', cat: 'Fruits & légumes' },
      { name: 'Carotte', qty: '2', cat: 'Fruits & légumes' },
      { name: 'Romarin', qty: '1 branche', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd4', label: 'Cabillaud vapeur + riz basmati + épinards', kcal: 530, protein: 40,
    desc: '160g filet cabillaud vapeur + 80g riz + épinards sautés ail infusé + citron',
    tip: 'Le poisson blanc le moins cher. Cuisson vapeur = 12 min sans surveillance.',
    ingredients: [
      { name: 'Filet de cabillaud', qty: '160 g', cat: 'Protéines' },
      { name: 'Riz basmati', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Épinards frais', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Citron', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'd5', label: 'Steak haché bœuf + patate douce + salade', kcal: 640, protein: 38,
    desc: '150g bœuf haché + 200g patate douce rôtie + salade verte + tomates cerises',
    tip: 'Le haché standard (15% MG) est 30% moins cher que le 5%. Pour l\'Ironman, un peu plus de gras saturé dans 1 repas/semaine est négligeable.',
    ingredients: [
      { name: 'Bœuf haché', qty: '150 g', cat: 'Protéines' },
      { name: 'Patate douce', qty: '200 g', cat: 'Fruits & légumes' },
      { name: 'Salade verte', qty: 'poignée', cat: 'Fruits & légumes' },
      { name: 'Tomates cerises', qty: '6', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'd6', label: 'Wok crevettes-poivron + nouilles de riz', kcal: 560, protein: 34,
    desc: '150g crevettes + 80g nouilles riz + poivron rouge + gingembre + tamari + huile sésame',
    tip: 'Le wok se fait en 8 min. Le secret : feu vif, wok très chaud, ne pas remuer trop vite.',
    ingredients: [
      { name: 'Crevettes décortiquées', qty: '150 g', cat: 'Protéines' },
      { name: 'Nouilles de riz', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Poivron rouge', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Gingembre frais', qty: '2 cm', cat: 'Fruits & légumes' },
      { name: 'Sauce tamari', qty: '2 cs', cat: 'Épicerie sèche' },
      { name: 'Huile de sésame', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd7', label: 'Porc haché + quinoa + courgettes rôties', kcal: 560, protein: 34,
    desc: '150g porc haché + 80g quinoa + 1 courgette rôtie au four + herbes de Provence',
    tip: 'Le haché de porc (~3,50€/300g) coûte 4× moins cher que le filet mignon. Même goût en poêlée, parfait en galette façon burger.',
    ingredients: [
      { name: 'Porc haché', qty: '150 g', cat: 'Protéines' },
      { name: 'Quinoa', qty: '80 g', cat: 'Féculents & céréales' },
      { name: 'Courgette', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Herbes de Provence', qty: '1 cc', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'd8', label: 'Soupe légumes douce + riz + œuf poché', kcal: 450, protein: 20,
    desc: 'Carottes + courgettes + vert poireau + tomates · 60g riz · 1 œuf poché',
    tip: 'Idéal les soirs de repos ou ventre sensible. Très digeste, hydratant.',
    ingredients: [
      { name: 'Carotte', qty: '2', cat: 'Fruits & légumes' },
      { name: 'Courgette', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Vert de poireau', qty: '1 tige', cat: 'Fruits & légumes' },
      { name: 'Tomate', qty: '2', cat: 'Fruits & légumes' },
      { name: 'Riz basmati', qty: '60 g', cat: 'Féculents & céréales' },
      { name: 'Œufs', qty: '1', cat: 'Frais' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COLLATIONS (rotation)
// ─────────────────────────────────────────────────────────────────────────────

export const SNACKS_AM: MealOption[] = [
  {
    id: 'sam1', label: '2 œufs durs + 2 kiwis', kcal: 220, protein: 14,
    desc: '2 œufs durs (à préparer la veille) + 2 kiwis frais',
    ingredients: [
      { name: 'Œufs', qty: '2', cat: 'Frais' },
      { name: 'Kiwi', qty: '2', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'sam2', label: 'Galettes riz + beurre amande + banane', kcal: 280, protein: 8,
    desc: '3 galettes de riz + 2cs beurre d\'amande + ½ banane',
    ingredients: [
      { name: 'Galettes de riz', qty: '3', cat: 'Féculents & céréales' },
      { name: 'Beurre d\'amande', qty: '2 cs', cat: 'Épicerie sèche' },
      { name: 'Banane', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'sam3', label: 'Fruits rouges + 20g noix', kcal: 200, protein: 5,
    desc: '150g fraises ou myrtilles + 20g noix ou amandes',
    ingredients: [
      { name: 'Fraises', qty: '150 g', cat: 'Fruits & légumes' },
      { name: 'Amandes', qty: '20 g', cat: 'Épicerie sèche' },
    ],
  },
];

export const SNACKS_PM: MealOption[] = [
  {
    id: 'spm1', label: 'Smoothie banane-amande récupération', kcal: 310, protein: 9,
    desc: '1 banane + 200ml lait amande + 1cs beurre amande + 1cs graines chia',
    tip: 'À boire dans les 30 min post-séance si entraînement l\'après-midi.',
    ingredients: [
      { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
      { name: 'Lait d\'amande', qty: '200 ml', cat: 'Frais' },
      { name: 'Beurre d\'amande', qty: '1 cs', cat: 'Épicerie sèche' },
      { name: 'Graines de chia', qty: '1 cs', cat: 'Épicerie sèche' },
    ],
  },
  {
    id: 'spm2', label: 'Pain de riz + avocat + sel', kcal: 260, protein: 5,
    desc: '2 tranches pain de riz + ½ avocat écrasé + sel + jus citron',
    ingredients: [
      { name: 'Pain de riz', qty: '2 tranches', cat: 'Féculents & céréales' },
      { name: 'Avocat', qty: '½', cat: 'Fruits & légumes' },
    ],
  },
  {
    id: 'spm3', label: 'Compote pomme maison + 20g amandes', kcal: 230, protein: 5,
    desc: 'Compote de pommes sans sucre (maison ou pot) + 20g amandes entières',
    tip: 'Compote maison : 2 pommes + 3 cs eau + cannelle, 10 min à la casserole. Faire en batch.',
    ingredients: [
      { name: 'Compote de pommes', qty: '1 pot', cat: 'Épicerie sèche' },
      { name: 'Amandes', qty: '20 g', cat: 'Épicerie sèche' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SNACKS PRÉ / POST ENTRAÎNEMENT
// ─────────────────────────────────────────────────────────────────────────────

export const PRE_TRAINING: MealOption = {
  id: 'pre', label: 'Pré-entraînement (30 min avant)', kcal: 180, protein: 3,
  desc: '1 banane mûre + 2 galettes de riz. Glucides rapides, digestion facile.',
  tip: 'Ne rien manger si l\'estomac est capricieux — mieux vaut y aller léger.',
  preTraining: true,
  ingredients: [
    { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
    { name: 'Galettes de riz', qty: '2', cat: 'Féculents & céréales' },
  ],
};

export const POST_TRAINING: MealOption = {
  id: 'post', label: 'Post-entraînement (dans les 30 min)', kcal: 300, protein: 10,
  desc: 'Smoothie banane + lait amande + beurre amande. Recharge glycogène + protéines réparatrices.',
  tip: 'La fenêtre anabolique dure ~30 min. Si pas faim, au moins la banane + un verre de lait amande.',
  postTraining: true,
  ingredients: [
    { name: 'Banane', qty: '1', cat: 'Fruits & légumes' },
    { name: 'Lait d\'amande', qty: '200 ml', cat: 'Frais' },
    { name: 'Beurre d\'amande', qty: '1 cs', cat: 'Épicerie sèche' },
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
  // cs/cc/pincée/branche → condiments non mesurables (au besoin)
  if (rest === 'cs' || rest === 'cc' || rest === 'pincée' || rest === 'branche') {
    return { value: val, unit: 'other' };
  }
  // tige/pot/tranche(s) → traités comme des unités countables
  return { value: val, unit: 'count' };
}

function toShopQty(name: string, total: number, unit: QtyUnit): string {
  const n = name.toLowerCase();

  if (unit === 'count') {
    const cnt = Math.ceil(total);
    if (n.includes('banane'))                           return `${cnt} banane${cnt > 1 ? 's' : ''}`;
    if (n.includes('kiwi'))                             return `${cnt} kiwi${cnt > 1 ? 's' : ''}`;
    if (n.includes('orange'))                           return `${cnt} orange${cnt > 1 ? 's' : ''}`;
    if (n.includes('citron'))                           return `${cnt} citron${cnt > 1 ? 's' : ''}`;
    if (n.includes('carotte'))                          return `${cnt} carotte${cnt > 1 ? 's' : ''}`;
    if (n.includes('courgette'))                        return `${cnt} courgette${cnt > 1 ? 's' : ''}`;
    if (n.includes('avocat'))                           return `${cnt} avocat${cnt > 1 ? 's' : ''}`;
    if (n.includes('poivron'))                          return `${cnt} poivron${cnt > 1 ? 's' : ''}`;
    if (n.includes('cerises')) {
      const barq = Math.max(1, Math.ceil(total / 20));
      return `${barq} barquette${barq > 1 ? 's' : ''} 250g`;
    }
    if (n.includes('tomate'))                            return `${cnt} tomate${cnt > 1 ? 's' : ''}`;
    if (n.includes('salade'))                            return '1 sac de salade';
    if (n.includes('œuf') || n.includes('oeuf'))         return `${cnt} œuf${cnt > 1 ? 's' : ''}`;
    if (n.includes('galette'))                           return `${cnt} galettes de riz`;
    if (n.includes('pain de riz'))                       return '1 pain de riz';
    if (n.includes('poireau'))                           return `${cnt} poireau${cnt > 1 ? 'x' : ''} (vert uniquement)`;
    if (n.includes('gingembre'))                         return `1 morceau (~${Math.ceil(total * 2)} cm)`;
    if (n.includes('sardines'))                          return `${cnt} boîte${cnt > 1 ? 's' : ''} sardines`;
    if (n.includes('thon'))                              return `${cnt} boîte${cnt > 1 ? 's' : ''} thon`;
    return `${cnt}`;
  }

  if (unit === 'g') {
    const rounded = Math.ceil(total / 10) * 10;
    if (n.includes('tomates cerises')) {
      const barq = Math.ceil(total / 200);
      return `${barq} barquette${barq > 1 ? 's' : ''} 250g`;
    }
    if (n.includes('fraises') || n.includes('myrtilles')) {
      const barq = Math.ceil(total / 250);
      return `${barq} barquette${barq > 1 ? 's' : ''} 250g`;
    }
    if (n.includes('épinards'))  return total <= 120 ? '1 sac 200g' : '1 sac 400g';
    if (n.includes('salade'))    return '1 sachet salade';
    if (n.includes('sardines'))  return `${Math.ceil(total / 90)} boîte${Math.ceil(total / 90) > 1 ? 's' : ''} 90g`;
    if (n.includes('thon'))      return `${Math.ceil(total / 140)} boîte${Math.ceil(total / 140) > 1 ? 's' : ''} 140g`;
    if (rounded >= 1000)         return `${(rounded / 1000).toFixed(1).replace('.0', '')} kg`;
    return `${rounded} g`;
  }

  if (unit === 'ml') {
    const rounded = Math.ceil(total / 100) * 100;
    if (rounded <= 500)  return `${rounded} ml`;
    if (rounded <= 1200) return '1 brique 1 L';
    return `${Math.ceil(total / 1000)} L`;
  }

  // condiments, épices → juste indiquer "au besoin"
  return 'au besoin';
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIX LIDL FRANCE (juin 2026) — price: €/unité d'achat, per: qté couverte
// Source : Lidl.fr, blog.ekip.app/prix-des-aliments-en-2026, combien-coute.net
// ─────────────────────────────────────────────────────────────────────────────

const UNIT_PRICES: Record<string, { price: number; per: number }> = {
  // Fruits & légumes — au pièce (count)
  'avocat':                        { price: 1.00, per: 1 },
  'banane':                        { price: 0.50, per: 1 },
  'carotte':                       { price: 0.40, per: 1 },
  'citron':                        { price: 0.55, per: 1 },
  'courgette':                     { price: 1.10, per: 1 },
  'kiwi':                          { price: 0.45, per: 1 },
  'orange':                        { price: 0.55, per: 1 },
  'poivron rouge':                 { price: 1.50, per: 1 },
  'tomate':                        { price: 0.85, per: 1 },
  'tomates cerises':               { price: 1.29, per: 20 }, // ~20 cerises/barquette 250g
  'salade verte':                  { price: 1.45, per: 1 },
  'gingembre frais':               { price: 1.20, per: 10 }, // morceau ~10cm
  'vert de poireau':               { price: 1.00, per: 1 },
  // Fruits & légumes — au poids (g)
  'épinards frais':                { price: 2.20, per: 200 },
  'fraises':                       { price: 3.50, per: 250 },
  'myrtilles':                     { price: 2.50, per: 125 },
  'haricots verts':                { price: 2.50, per: 500 },
  'patate douce':                  { price: 1.80, per: 400 },
  'pommes de terre':               { price: 4.20, per: 2500 },
  // Protéines — au poids (g)
  'blanc de poulet':               { price: 4.00, per: 400 }, // pack 2 escalopes Lidl
  'bœuf haché':                    { price: 3.20, per: 300 }, // haché standard 15% MG
  'crevettes décortiquées':        { price: 4.50, per: 400 },
  'cuisses de poulet':             { price: 3.50, per: 600 },
  'dinde hachée':                  { price: 3.50, per: 300 },
  'filet de cabillaud':            { price: 3.50, per: 200 },
  'filet de truite':               { price: 3.20, per: 300 }, // pack 2 filets ~300g, ≈10€/kg vs 27€/kg saumon
  'maquereau au naturel (boîte)':  { price: 1.50, per: 125 }, // 3× moins cher que saumon fumé
  'porc haché':                    { price: 3.50, per: 300 },
  'sardines à l\'huile (boîte)':   { price: 1.30, per: 90  },
  'thon au naturel (boîte)':       { price: 1.80, per: 140 },
  // Féculents — au poids (g) ou pièce (count)
  'flocons d\'avoine':             { price: 1.50, per: 500  },
  'galettes de riz':               { price: 1.99, per: 10  }, // ~10/paquet
  'nouilles de riz':               { price: 2.50, per: 250  },
  'pain de riz':                   { price: 3.50, per: 8   }, // 8 tranches/pain
  'pâtes de riz':                  { price: 2.50, per: 250  },
  'quinoa':                        { price: 3.50, per: 500  },
  'riz basmati':                   { price: 2.79, per: 1000 },
  'riz jasmin':                    { price: 2.50, per: 500  },
  'riz soufflé':                   { price: 2.20, per: 300  },
  // Frais — ml ou count
  'lait d\'avoine':                { price: 1.89, per: 1000 },
  'lait d\'amande':                { price: 1.89, per: 1000 },
  'œufs':                          { price: 3.15, per: 6   },
  // Épicerie sèche quantifiable
  'amandes':                       { price: 2.00, per: 150  },
  'compote de pommes':             { price: 0.99, per: 1   },
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
  'Lactose : remplacer tout produit laitier par lait d\'avoine, lait d\'amande ou lait de riz.',
  'Légumineuses : rincer très abondamment, petites portions (60g égouttées max par repas).',
  'Fruits OK : banane mûre, fraises, orange, kiwi, myrtilles, raisin. Éviter pomme crue, poire, mangue.',
  'Cuire les légumes les rend bien plus digestibles — vapeur, sauté ou rôti au four.',
  'Avoine : 60g max par repas sinon ballonnements — bien toléré en petite quantité.',
  'Gingembre frais : anti-inflammatoire naturel + aide la digestion. Ajouter à tous les plats sautés.',
  'Poireau : le vert uniquement (bas-FODMAP). Le blanc est riche en fructanes — à éviter.',
];

export const PANTRY_BASICS = [
  'Huile d\'olive (bouteille)',
  'Huile de sésame (petite bouteille)',
  'Sauce tamari sans gluten',
  'Riz basmati (kg)',
  'Sel, poivre',
  'Herbes de Provence',
  'Cannelle moulue',
  'Cumin moulu',
  'Sirop d\'érable',
];
