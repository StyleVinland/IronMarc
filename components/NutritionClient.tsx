'use client';
import { useState } from 'react';
import { WEEK_PLAN, RECIPES, CALORIC_TARGET, PROTEIN_TARGET, FODMAP_TIPS, type Recipe } from '@/lib/nutrition';

const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function getActiveDayIndex(): number {
  const d = new Date().getDay(); // 0 = dim
  // map to our WEEK_PLAN index (0=Lun … 6=Dim)
  return d === 0 ? 6 : d - 1;
}

const CATEGORY_LABELS: Record<Recipe['category'], string> = {
  'petit-dej': 'Petit-déjeuner',
  'plat': 'Plat principal',
  'snack': 'Collation',
  'batch': 'Batch cooking',
};

export default function NutritionClient() {
  const [activeDay, setActiveDay] = useState(getActiveDayIndex());
  const [openRecipe, setOpenRecipe] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  const plan = WEEK_PLAN[activeDay];
  const meals = [
    { key: 'breakfast', label: 'Petit-déjeuner', data: plan.breakfast },
    { key: 'snack1',    label: 'Collation matin', data: plan.snack1 },
    { key: 'lunch',     label: 'Déjeuner',        data: plan.lunch },
    { key: 'snack2',    label: 'Collation soir',  data: plan.snack2 },
    { key: 'dinner',    label: 'Dîner',           data: plan.dinner },
  ] as const;

  const recipe = openRecipe ? RECIPES.find(r => r.id === openRecipe) : null;

  return (
    <>
      <div className="page-title-block">
        <h1>Nutrition</h1>
        <p>Plan bas-FODMAP · sans lactose · {CALORIC_TARGET} kcal/jour pour nourrir ta progression</p>
      </div>

      {/* ── OBJECTIFS ──────────────────────────────────────────── */}
      <div className="nutri-goals">
        <div className="nutri-goal">
          <div className="nutri-goal-n">{CALORIC_TARGET}</div>
          <div className="nutri-goal-k">kcal / jour</div>
        </div>
        <div className="nutri-goal">
          <div className="nutri-goal-n">{PROTEIN_TARGET} g</div>
          <div className="nutri-goal-k">protéines / jour</div>
        </div>
        <div className="nutri-goal nutri-goal-rule">
          <div className="nutri-goal-n" style={{ fontSize: 15, lineHeight: 1.3 }}>Nourrir,<br />pas restreindre</div>
          <div className="nutri-goal-k">tu sous-manges actuellement</div>
        </div>
      </div>

      {/* ── PLAN JOUR PAR JOUR ────────────────────────────────── */}
      <section>
        <div className="shead"><h2>Plan de la semaine</h2><span className="hint">cliquer un jour</span></div>
        <div className="nutri-day-tabs">
          {WEEK_PLAN.map((d, i) => (
            <button
              key={i}
              className={`nutri-day-tab${activeDay === i ? ' active' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              {d.day.slice(0, 3)}
            </button>
          ))}
        </div>

        <div className="nutri-day-plan">
          <div className="nutri-day-total">
            <span className="nutri-day-name">{plan.day}</span>
            <span className="nutri-day-kcal">{plan.total} kcal estimés</span>
          </div>
          {meals.map(m => (
            <div key={m.key} className="nutri-meal">
              <div className="nutri-meal-label">{m.label}</div>
              <div className="nutri-meal-name">{m.data.label}</div>
              <div className="nutri-meal-desc">{m.data.desc}</div>
              <div className="nutri-meal-meta">
                <span>{m.data.kcal} kcal</span>
                <span>{m.data.protein} g prot.</span>
              </div>
              {m.data.tip && (
                <div className="nutri-meal-tip">{m.data.tip}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── RECETTES ──────────────────────────────────────────── */}
      <section>
        <div className="shead"><h2>Fiches recettes</h2><span className="hint">{RECIPES.length} recettes</span></div>
        <div className="nutri-recipes-grid">
          {RECIPES.map(r => (
            <button
              key={r.id}
              className={`nutri-recipe-card${openRecipe === r.id ? ' open' : ''}`}
              onClick={() => setOpenRecipe(prev => prev === r.id ? null : r.id)}
            >
              <div className="nutri-recipe-cat">{CATEGORY_LABELS[r.category]}</div>
              <div className="nutri-recipe-name">{r.name}</div>
              <div className="nutri-recipe-meta">
                <span>{r.time}</span>
                <span>{r.kcal} kcal</span>
                <span>{r.protein} g prot.</span>
              </div>
            </button>
          ))}
        </div>

        {recipe && (
          <div className="nutri-recipe-detail">
            <div className="nutri-recipe-detail-header">
              <div>
                <div className="nutri-recipe-detail-cat">{CATEGORY_LABELS[recipe.category]} · {recipe.time}</div>
                <div className="nutri-recipe-detail-name">{recipe.name}</div>
                <div className="nutri-recipe-detail-meta">
                  {recipe.kcal} kcal · {recipe.protein} g protéines · {recipe.portions} portion{recipe.portions > 1 ? 's' : ''}
                </div>
              </div>
              <button className="btn-ghost" style={{ fontSize: 12, flexShrink: 0 }} onClick={() => setOpenRecipe(null)}>Fermer</button>
            </div>

            <div className="nutri-recipe-cols">
              <div>
                <div className="nutri-recipe-section-title">Ingrédients</div>
                <ul className="nutri-ingredients">
                  {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
              </div>
              <div>
                <div className="nutri-recipe-section-title">Préparation</div>
                <ol className="nutri-steps">
                  {recipe.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </div>
            </div>

            {recipe.tip && (
              <div className="nutri-recipe-tip">{recipe.tip}</div>
            )}
          </div>
        )}
      </section>

      {/* ── CONSEILS FODMAP ──────────────────────────────────── */}
      <section>
        <div className="shead">
          <h2>Règles bas-FODMAP</h2>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowTips(p => !p)}>
            {showTips ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        {showTips && (
          <div className="nutri-tips">
            {FODMAP_TIPS.map((t, i) => (
              <div key={i} className="nutri-tip">{t}</div>
            ))}
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
