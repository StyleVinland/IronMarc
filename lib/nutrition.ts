// Plan nutritionnel pour Marc
// Contraintes : SII (bas-FODMAP) + intolérance au lactose + sous-mange (~62 kg / 172 cm)
// Objectif : ~2400-2600 kcal/jour. Nourrir, pas restreindre.

export interface Meal {
  label: string;
  desc: string;
  kcal: number;
  protein: number; // grammes
  tip?: string;
}

export interface DayPlan {
  day: string;
  breakfast: Meal;
  snack1: Meal;
  lunch: Meal;
  snack2: Meal;
  dinner: Meal;
  total: number;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'petit-dej' | 'plat' | 'snack' | 'batch';
  time: string;
  kcal: number;
  protein: number;
  portions: number;
  ingredients: string[];
  steps: string[];
  tip?: string;
}

// ── PLAN HEBDOMADAIRE ─────────────────────────────────────────────

export const WEEK_PLAN: DayPlan[] = [
  {
    day: 'Lundi',
    breakfast: { label: 'Flocons d\'avoine + lait amande + banane + 2 œufs', desc: 'Flocons d\'avoine 60g, lait d\'amande 200 ml, 1 banane mûre, 2 œufs brouillés huile d\'olive', kcal: 620, protein: 28, tip: 'Les flocons d\'avoine sont OK bas-FODMAP en petite quantité (60g max).' },
    snack1:    { label: 'Riz soufflé + beurre d\'amande + kiwi', desc: '3 galettes de riz, 2 cs beurre d\'amande, 1 kiwi', kcal: 280, protein: 8 },
    lunch:     { label: 'Poulet riz courgettes', desc: '150g blanc de poulet poêlé, 80g riz basmati cuit, 1 courgette sautée huile d\'olive, herbes fraîches', kcal: 580, protein: 42 },
    snack2:    { label: 'Poignée noix + raisins', desc: '30g noix, 1 petite grappe de raisin frais', kcal: 250, protein: 6 },
    dinner:    { label: 'Saumon en papillote + quinoa + épinards', desc: '150g filet saumon, 80g quinoa cuit, poignée épinards frais sautés, citron, huile d\'olive', kcal: 620, protein: 38 },
    total: 2350,
  },
  {
    day: 'Mardi',
    breakfast: { label: 'Smoothie banane-amande + pain de riz + avocat', desc: '1 banane, 200 ml lait amande, 1 cs beurre amande, 2 tranches pain de riz, ½ avocat', kcal: 590, protein: 14, tip: 'L\'avocat est riche en bonnes graisses et très digeste pour le SII.' },
    snack1:    { label: 'Compote pommes maison + 2 œufs durs', desc: 'Compote de pommes sans sucre ajouté, 2 œufs durs', kcal: 260, protein: 14 },
    lunch:     { label: 'Riz thaï crevettes légumes', desc: '130g crevettes, 80g riz thaï, poivron rouge, carottes, sauce tamari (sans gluten), huile sésame', kcal: 560, protein: 34 },
    snack2:    { label: 'Galettes riz + purée noisette', desc: '3 galettes de riz, 2 cs purée de noisette (100% noisette)', kcal: 280, protein: 7 },
    dinner:    { label: 'Dinde haché + patate douce + haricots verts', desc: '150g haché dinde, 200g patate douce rôtie, 100g haricots verts vapeur, huile olive', kcal: 640, protein: 40 },
    total: 2330,
  },
  {
    day: 'Mercredi',
    breakfast: { label: 'Oeufs cocotte tomate + pain de riz grillé', desc: '3 œufs cocotte au four (tomates, huile d\'olive, herbes de Provence), 2 tranches pain de riz grillé', kcal: 520, protein: 22 },
    snack1:    { label: 'Fraises + noix de macadamia', desc: '200g fraises fraîches, 25g noix de macadamia', kcal: 240, protein: 4 },
    lunch:     { label: 'Thon riz épinards', desc: '1 boite thon au naturel (140g égoutté), 80g riz basmati, poignée épinards crus, tomates cerises, huile olive citron', kcal: 530, protein: 44 },
    snack2:    { label: 'Pain de riz + avocat + jus citron', desc: '2 tranches pain de riz, ½ avocat écrasé, jus de citron, sel', kcal: 280, protein: 5 },
    dinner:    { label: 'Poulet rôti + riz + carottes', desc: '160g cuisse poulet rôtie (sans peau), 80g riz complet cuit, 150g carottes vapeur, huile olive', kcal: 590, protein: 36 },
    total: 2160,
  },
  {
    day: 'Jeudi',
    breakfast: { label: 'Porridge amande-banane-graines', desc: '60g flocons d\'avoine, 250ml lait amande chaud, 1 banane, 1 cs graines de courge, 1 cs sirop d\'érable', kcal: 580, protein: 16, tip: 'Préparer la veille au soir (overnight oats) pour gagner du temps le matin.' },
    snack1:    { label: '2 œufs brouillés + tomates cerises', desc: '2 œufs brouillés dans un peu d\'huile olive, poignée tomates cerises', kcal: 220, protein: 14 },
    lunch:     { label: 'Sardines + quinoa + poivron rôti', desc: '2 boites sardines huile d\'olive (120g), 80g quinoa cuit, 1 poivron rouge rôti, jus citron', kcal: 600, protein: 36 },
    snack2:    { label: 'Smoothie banane-fraise-amande', desc: '1 banane, 100g fraises, 150ml lait amande, 1 cs beurre amande', kcal: 310, protein: 8 },
    dinner:    { label: 'Pavé de cabillaud + pommes de terre + épinards', desc: '160g filet cabillaud, 200g pommes de terre vapeur, épinards sautés, citron, huile olive', kcal: 530, protein: 38 },
    total: 2240,
  },
  {
    day: 'Vendredi',
    breakfast: { label: 'Pain de riz + beurre amande + 2 œufs + orange', desc: '3 tranches pain de riz, 2 cs beurre amande, 2 œufs à la coque, 1 orange', kcal: 560, protein: 22 },
    snack1:    { label: 'Noix + raisins + galette de riz', desc: '30g noix, petite grappe raisin, 2 galettes de riz', kcal: 300, protein: 7 },
    lunch:     { label: 'Poulet pesto basilic + pâtes riz', desc: '150g blanc de poulet, 80g pâtes de riz cuites, pesto maison (basilic, huile olive, pignons, sel — sans parmesan)', kcal: 620, protein: 40 },
    snack2:    { label: 'Compote pomme-cannelle + amandes', desc: 'Compote pomme-cannelle maison (sans sucre), 20g amandes entières', kcal: 230, protein: 6 },
    dinner:    { label: 'Bol riz haricots rouges (petite portion) + légumes', desc: '80g riz, 60g haricots rouges égouttés rincés (petite portion = moins de FODMAP), courgette, tomate, huile olive, cumin', kcal: 490, protein: 18, tip: 'Rincer abondamment les légumineuses réduit les FODMAP. Rester sur 60g max.' },
    total: 2200,
  },
  {
    day: 'Samedi',
    breakfast: { label: 'Pancakes avoine-banane (sans lactose)', desc: '60g flocons d\'avoine mixés, 1 banane écrasée, 2 œufs, lait amande — cuire à l\'huile de coco', kcal: 560, protein: 20, tip: 'Recette en détail dans les fiches recettes.' },
    snack1:    { label: 'Kiwi + 2 œufs durs + graines courge', desc: '2 kiwis, 2 œufs durs, 15g graines de courge', kcal: 270, protein: 16 },
    lunch:     { label: 'Steak haché + patate douce + salade', desc: '150g steak haché boeuf, 200g patate douce rôtie, salade verte + tomates cerises + huile olive', kcal: 640, protein: 38 },
    snack2:    { label: 'Pain de riz + purée amande + banane', desc: '2 tranches pain de riz, 2 cs purée d\'amande, ½ banane', kcal: 300, protein: 8 },
    dinner:    { label: 'Crevettes sautées + riz + poivron', desc: '150g crevettes, 80g riz basmati, 1 poivron rouge, sauce tamari, huile sésame, gingembre frais', kcal: 520, protein: 36 },
    total: 2290,
  },
  {
    day: 'Dimanche',
    breakfast: { label: 'Oeufs cocotte + avocat + pain de riz', desc: 'Grand brunch dominical : 3 œufs pochés ou cocotte, 1 avocat entier, 3 tranches pain de riz grillé, tomates cerises', kcal: 680, protein: 26 },
    snack1:    { label: 'Fraises + noix + sirop érable', desc: '200g fraises, 30g noix, filet sirop d\'érable', kcal: 290, protein: 6 },
    lunch:     { label: 'Rôti poulet dominical + légumes du four', desc: '200g cuisse poulet rôtie, carottes/courgettes/poivron rôtis, pomme de terre, huile olive, romarin', kcal: 680, protein: 42 },
    snack2:    { label: 'Smoothie banane-amande', desc: '1 banane, 200ml lait amande, 1 cs beurre amande, quelques glaçons', kcal: 280, protein: 8 },
    dinner:    { label: 'Soupe légumes + riz + œuf poché', desc: 'Soupe de légumes (carottes, courgettes, poireau vert seulement, tomate), 50g riz, 1 œuf poché, huile olive', kcal: 420, protein: 18, tip: 'Le poireau : utiliser uniquement le vert (le blanc est riche en FODMAP).' },
    total: 2350,
  },
];

// ── RECETTES ──────────────────────────────────────────────────────

export const RECIPES: Recipe[] = [
  {
    id: 'pancakes_avoine',
    name: 'Pancakes avoine-banane (sans lactose)',
    category: 'petit-dej',
    time: '15 min',
    kcal: 560,
    protein: 20,
    portions: 1,
    ingredients: [
      '60 g de flocons d\'avoine (mixés en farine)',
      '1 banane bien mûre',
      '2 œufs',
      '50 ml de lait d\'amande non sucré',
      '1 pincée de bicarbonate',
      'Huile de coco pour la cuisson',
    ],
    steps: [
      'Mixer les flocons d\'avoine en farine grossière.',
      'Écraser la banane en purée à la fourchette.',
      'Mélanger farine avoine, banane, œufs, lait d\'amande et bicarbonate.',
      'Chauffer une poêle avec un peu d\'huile de coco à feu moyen.',
      'Verser des petits ronds de pâte (~4 cm). Cuire 2 min/face jusqu\'à dorure.',
      'Servir avec des fraises et un filet de sirop d\'érable.',
    ],
    tip: 'Les flocons d\'avoine en petite quantité (60g) sont tolérés dans le SII. Si sensibilité, remplacer par farine de riz.',
  },
  {
    id: 'porridge_amande',
    name: 'Porridge amande overnight',
    category: 'petit-dej',
    time: '5 min (préparer la veille)',
    kcal: 520,
    protein: 16,
    portions: 1,
    ingredients: [
      '60 g de flocons d\'avoine',
      '200 ml de lait d\'amande',
      '1 cs de graines de chia',
      '1 cs de beurre d\'amande',
      '1 banane pour le lendemain',
    ],
    steps: [
      'La veille au soir : mélanger dans un bocal les flocons, le lait, les graines de chia.',
      'Fermer et réfrigérer toute la nuit.',
      'Le matin : sortir le bocal, ajouter le beurre d\'amande et trancher la banane par-dessus.',
      'Manger froid ou réchauffer 1 min au micro-ondes.',
    ],
    tip: 'Idéal les jours d\'entraînement matinal : préparé la veille, prêt en 0 seconde.',
  },
  {
    id: 'poulet_riz_courgettes',
    name: 'Poulet-riz-courgettes sauté',
    category: 'plat',
    time: '20 min',
    kcal: 580,
    protein: 42,
    portions: 1,
    ingredients: [
      '150 g de blanc de poulet',
      '80 g de riz basmati cru (160g cuit)',
      '1 courgette moyenne',
      '2 cs d\'huile d\'olive',
      'Herbes de Provence, sel, poivre',
      'Jus d\'un demi-citron',
    ],
    steps: [
      'Cuire le riz dans deux fois son volume d\'eau salée.',
      'Couper le poulet en lamelles, assaisonner.',
      'Faire revenir le poulet dans 1 cs d\'huile olive à feu vif, 3-4 min/face.',
      'Retirer le poulet. Dans la même poêle, sauter la courgette en rondelles 5 min.',
      'Remettre le poulet, ajouter les herbes et le jus de citron.',
      'Servir avec le riz, arroser d\'un filet d\'huile olive.',
    ],
    tip: 'Peut se préparer en batch le dimanche pour la semaine (se conserve 3 jours au frigo).',
  },
  {
    id: 'saumon_quinoa',
    name: 'Saumon papillote + quinoa + épinards',
    category: 'plat',
    time: '25 min',
    kcal: 620,
    protein: 38,
    portions: 1,
    ingredients: [
      '150 g de filet de saumon',
      '80 g de quinoa cru',
      'Grande poignée d\'épinards frais',
      '1 cs d\'huile d\'olive',
      'Jus d\'un demi-citron',
      'Herbes fraîches (aneth, thym)',
      'Sel, poivre',
    ],
    steps: [
      'Préchauffer le four à 200°C.',
      'Rincer le quinoa, cuire 15 min dans 160 ml d\'eau salée.',
      'Poser le saumon sur une feuille de papier aluminium.',
      'Arroser d\'huile olive et citron, ajouter les herbes, refermer la papillote.',
      'Cuire au four 12-15 min selon épaisseur.',
      'Pendant ce temps, faire sauter les épinards 2 min dans un peu d\'huile olive.',
      'Servir : quinoa, épinards, saumon ouvert par-dessus.',
    ],
    tip: 'Le saumon est riche en omega-3, excellents pour l\'inflammation articulaire (pubalgie, périostites).',
  },
  {
    id: 'riz_crevettes',
    name: 'Riz sauté crevettes-gingembre',
    category: 'plat',
    time: '15 min',
    kcal: 520,
    protein: 36,
    portions: 1,
    ingredients: [
      '150 g de crevettes décortiquées',
      '80 g de riz basmati cuit (du riz de veille, idéal)',
      '1 poivron rouge',
      '1 cm de gingembre frais râpé',
      '2 cs de sauce tamari (sans gluten)',
      '1 cs d\'huile de sésame',
      'Graines de sésame',
    ],
    steps: [
      'Si le riz est frais, cuire et laisser refroidir 10 min.',
      'Faire revenir le gingembre 1 min dans l\'huile sésame à feu vif.',
      'Ajouter les crevettes, cuire 2-3 min jusqu\'à rosé.',
      'Ajouter le poivron en lanières, cuire 3 min.',
      'Ajouter le riz, tamari, mélanger vivement 2 min.',
      'Servir avec des graines de sésame.',
    ],
    tip: 'Le gingembre est anti-inflammatoire et aide la digestion. Le tamari (sans gluten) remplace la sauce soja classique.',
  },
  {
    id: 'batch_poulet',
    name: 'Batch cooking poulet du dimanche',
    category: 'batch',
    time: '45 min',
    kcal: 200,
    protein: 30,
    portions: 4,
    ingredients: [
      '600 g de hauts de cuisses de poulet (ou blanc)',
      '3 cs d\'huile d\'olive',
      'Romarin, thym, sel, poivre',
      'Jus d\'un citron',
    ],
    steps: [
      'Préchauffer le four à 190°C.',
      'Déposer le poulet dans un plat, arroser d\'huile olive, citron, herbes.',
      'Cuire 35-40 min jusqu\'à dorure (les cuisses doivent être à 75°C à cœur).',
      'Laisser refroidir, effiler la viande à la fourchette ou couper en morceaux.',
      'Conserver dans un bocal hermétique au frigo jusqu\'à 4 jours.',
    ],
    tip: 'Ce poulet effilé peut aller partout : riz, salade, wrap de riz, soupe. C\'est la base du batch cooking anti-FODMAP.',
  },
  {
    id: 'smoothie_banane',
    name: 'Smoothie banane-amande récupération',
    category: 'snack',
    time: '3 min',
    kcal: 320,
    protein: 10,
    portions: 1,
    ingredients: [
      '1 banane mûre',
      '200 ml de lait d\'amande',
      '1 cs de beurre d\'amande',
      '1 cs de graines de chia',
      'Quelques glaçons',
    ],
    steps: [
      'Tout mettre dans le blender.',
      'Mixer 30 secondes jusqu\'à consistance lisse.',
      'Boire immédiatement (les graines de chia épaississent rapidement).',
    ],
    tip: 'À boire dans les 30 min après l\'entraînement. La banane recharge le glycogène, l\'amande apporte protéines + bonnes graisses.',
  },
  {
    id: 'soupe_legumes',
    name: 'Soupe légumes facile (digestion douce)',
    category: 'plat',
    time: '25 min',
    kcal: 350,
    protein: 12,
    portions: 2,
    ingredients: [
      '2 carottes',
      '2 courgettes',
      'Les feuilles vertes d\'un poireau (pas le blanc)',
      '2 tomates',
      '2 cs d\'huile d\'olive',
      '1 L de bouillon de légumes (sans oignon/ail dans la liste)',
      'Sel, poivre, cumin',
    ],
    steps: [
      'Couper tous les légumes en morceaux grossiers.',
      'Faire revenir 3 min dans l\'huile olive dans une casserole.',
      'Ajouter le bouillon, porter à ébullition.',
      'Cuire 15 min à feu moyen jusqu\'à ce que les légumes soient tendres.',
      'Mixer partiellement (laisser des morceaux pour la texture) ou servir tel quel.',
      'Ajouter une cc de cumin et un filet d\'huile olive au service.',
    ],
    tip: 'Le vert du poireau est bas-FODMAP. Éviter le blanc qui est riche en fructanes. Un œuf poché posé dessus ajoute 6g de protéines facilement.',
  },
];

// ── CONSTANTES ───────────────────────────────────────────────────

export const CALORIC_TARGET = 2500;
export const PROTEIN_TARGET = 130; // g/jour : ~2.1g/kg pour reconstruction musculaire
export const FODMAP_TIPS = [
  'Oignon et ail : utiliser l\'huile infusée (retirer l\'oignon avant de manger) pour le goût sans les FODMAP.',
  'Lactose : remplacer tout produit laitier par alternatives amande / riz / coco.',
  'Légumineuses : rincer abondamment, petites portions (60g max égouttées).',
  'Fruits : banane mûre, fraises, orange, kiwi, raisin = OK. Éviter pomme crue, poire, mangue, pastèque.',
  'Cuire les légumes les rend plus digestibles (vapeur ou sauté).',
  'Avoine : 60g max par repas, sinon risque de ballonnements.',
  'Gingembre frais : aide la digestion, ajouter aux plats sautés.',
];
