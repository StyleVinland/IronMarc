'use client';
import { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface GearItem {
  name: string;
  price: string;
  why: string;
  brands: string;
  when: string;
  color: string;
}

const OWNED = ['Maillot de bain', 'Chaussures de course', 'Lunettes bFit Decathlon — noir fumé'];

const GEAR: GearItem[] = [
  /* ── NATATION ─────────────────────────── bleu #007AFF */
  {
    name: 'Bonnet de silicone',
    price: '5-10 €',
    why: 'Obligatoire dans la plupart des piscines publiques. Le prendre en même temps que les lunettes.',
    brands: 'Speedo · Arena · Decathlon Nabaiji',
    when: 'Cette semaine',
    color: '#007AFF',
  },
  /* ── RENFO / RÉCUP ────────────────────── orange #FF9500 */
  {
    name: 'Foam roller',
    price: '20-30 €',
    why: 'Outil de récup numéro 1 pour ta pubalgie et tes périostites. Mollets, cuisses, dos — après chaque séance. Sans ça tu risques de te blesser et d\'arrêter.',
    brands: 'TriggerPoint GRID · Blackroll Standard · Decathlon Domyos',
    when: 'Mois 1',
    color: '#FF9500',
  },
  {
    name: 'Balle de massage (lacrosse)',
    price: '8-12 €',
    why: 'Complémente le foam roller pour les zones précises : plante du pied, fessier, pectoral. Quasi gratuit.',
    brands: 'TriggerPoint MB1 · Blackroll Ball · balle de lacrosse générique',
    when: 'Mois 1 — avec le foam roller',
    color: '#FF9500',
  },
  {
    name: 'Élastique de résistance (bande loop)',
    price: '8-15 €',
    why: 'Indispensable pour le protocole Hölmich Phase 2 (adduction debout élastique à partir de S5-6). Aussi utilisé pour les hip abductions. Prendre une tension medium ou medium/heavy — la résistance augmente semaine après semaine.',
    brands: 'Theraband Loop · Decathlon Domyos · Rogue Monster Band',
    when: 'Mois 1 — avant la semaine 5',
    color: '#FF9500',
  },
  {
    name: 'Manchons de compression mollets',
    price: '25-45 €',
    why: 'Direct contre les périostites. À porter pendant la marche/course et 1-2 h après. Les périostites peuvent te sortir du programme — c\'est une priorité.',
    brands: 'BV Sport Booster Elite · CEP Run Merino · Raidlight Trail',
    when: 'Mois 2',
    color: '#FF9500',
  },
  /* ── NEUTRE ───────────────────────────── gris #8E8E93 */
  {
    name: 'Écouteurs sport (conduction osseuse)',
    price: '30-80 €',
    why: '⚠️ INTERDITS en compétition Ironman — nage, vélo et course (WTC rules, pénalité/DQ). UNIQUEMENT pour l\'entraînement. Indispensables pour les longues sorties vélo et course à pied. Les conduction osseuse (Shokz) laissent les oreilles libres : tu entends les voitures, plus safe.',
    brands: 'Shokz OpenRun · Shokz OpenRun Pro · JBL Endurance Race · Bose Sport Earbuds',
    when: 'Mois 1-2 — entraînement uniquement, jamais en compétition',
    color: '#8E8E93',
  },
  /* ── NATATION (suite) ─────────────────── bleu #007AFF */
  {
    name: 'Pull buoy',
    price: '10-15 €',
    why: 'Flotteur entre les jambes pour travailler les bras en piscine. Permet de progresser en nage même quand les jambes sont fatiguées.',
    brands: 'Speedo · Arena · Decathlon Nabaiji',
    when: 'Mois 2-3',
    color: '#007AFF',
  },
  {
    name: 'Planche de natation',
    price: '10-15 €',
    why: 'Travail des jambes en piscine — améliore le crawl. Certaines piscines en prêtent, vérifie avant d\'acheter.',
    brands: 'Speedo · Arena · Decathlon Nabaiji',
    when: 'Mois 3',
    color: '#007AFF',
  },
  /* ── COURSE ───────────────────────────── rouge #FF3B30 */
  {
    name: 'Chaussettes de compression',
    price: '20-35 €',
    why: 'Périostites : essentielles pour les sorties de course dès que la course arrive dans le programme.',
    brands: 'BV Sport Run Compressport · Falke RU4 · CEP Run 3.0',
    when: 'Mois 4 — avant la phase course',
    color: '#FF3B30',
  },
  /* ── VÉLO ─────────────────────────────── vert #34C759 */
  {
    name: 'Vélo de route (occasion)',
    price: '400-700 €',
    why: 'Le plus gros investissement. Commence à économiser maintenant. Pas besoin d\'un vélo de triathlon — un vélo de route d\'occasion suffit largement pour les 2 ans.',
    brands: 'Leboncoin · Decathlon Seconde Vie · Trek Domane / Giant Contend / Btwin (Decathlon)',
    when: 'Mois 4-5 — commencer à économiser dès maintenant',
    color: '#34C759',
  },
  {
    name: 'Casque vélo',
    price: '40-80 €',
    why: 'Obligatoire en compétition et indispensable à la sécurité. À acheter en même temps que le vélo.',
    brands: 'Giro Register · Bell Formula · Decathlon Van Rysel RC 500',
    when: 'Mois 5 — avec le vélo',
    color: '#34C759',
  },
  {
    name: 'Cuissard rembourré',
    price: '30-50 €',
    why: 'Sans cuissard les longues sorties vélo deviennent vite insupportables. Pas de sous-vêtement en dessous.',
    brands: 'Decathlon Van Rysel · Castelli Entrata · Rogelli Bike',
    when: 'Mois 5 — dès les premières sorties vélo',
    color: '#34C759',
  },
  {
    name: 'Chaussures vélo + pédales SPD',
    price: '70-130 €',
    why: 'Les pédales automatiques améliorent vraiment l\'efficacité. À attendre quelques sorties avant d\'investir.',
    brands: 'Shimano MT501 (chaussures) + Shimano PD-M520 (pédales) · Look Keo Easy',
    when: 'Mois 6-7',
    color: '#34C759',
  },
  /* ── COURSE (suite) ───────────────────── rouge #FF3B30 */
  {
    name: 'Ceinture hydratation (course)',
    price: '25-40 €',
    why: 'Pour les sorties course > 45 min. Pas urgent au début.',
    brands: 'Nathan VaporKrar · Salomon Active Skin 4 · Decathlon Evadict',
    when: 'Mois 7-8',
    color: '#FF3B30',
  },
  /* ── RENFO / RÉCUP (suite) ────────────── orange #FF9500 */
  {
    name: 'Pistolet de massage',
    price: '80-150 €',
    why: 'Confort et récup accélérée, mais pas indispensable si tu utilises bien le foam roller et la balle. À attendre.',
    brands: 'Theragun Mini · Hyperice Hypervolt Go · Decathlon Kalenji',
    when: 'Mois 8-10 si budget',
    color: '#FF9500',
  },
  /* ── NEUTRE (suite) ───────────────────── gris #8E8E93 */
  {
    name: 'Montre GPS / cardio',
    price: '120-200 €',
    why: 'Utile pour doser l\'intensité et ne pas dépasser — important avec tes blessures. Pas urgent les premiers mois.',
    brands: 'Garmin Forerunner 55 · Polar Pacer · Coros Pace 3',
    when: 'Mois 6-9 si budget',
    color: '#8E8E93',
  },
  /* ── NATATION (suite) ─────────────────── bleu #007AFF */
  {
    name: 'Combinaison néoprène de triathlon',
    price: '150-300 €',
    why: 'Obligatoire en eau froide (< 22°C). À acheter 2-3 mois avant ta première compétition.',
    brands: 'Zone3 Aspire · Orca S7 · Roka Maverick Comp II',
    when: '3 mois avant la compétition',
    color: '#007AFF',
  },
  /* ── NEUTRE (compétition) ─────────────── gris #8E8E93 */
  {
    name: 'Tri-suit (combinaison 1 pièce)',
    price: '80-180 €',
    why: 'Pour faire les 3 disciplines sans se changer. Pas obligatoire pour les premiers triathlons (maillot + cuissard ça marche).',
    brands: 'Zone3 Lava · Orca 226 · Decathlon Aptonia',
    when: 'Avant le premier triathlon Sprint',
    color: '#8E8E93',
  },
  {
    name: 'Ceinture porte-dossard + sac transition',
    price: '15-25 €',
    why: 'Petits accessoires indispensables le jour J. Acheter la semaine avant la compétition.',
    brands: 'Ronhill · Nathan · Decathlon Aptonia',
    when: 'Juste avant la compétition',
    color: '#8E8E93',
  },
];

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="#0a1a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function MaterielClient() {
  useScrollReveal();
  const [bought, setBought] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setBought(p => ({ ...p, [i]: !p[i] }));

  const boughtItems = GEAR.filter((_, i) => !!bought[i]);
  const remaining = GEAR.filter((_, i) => !bought[i]);

  return (
    <>
      <div className="page-title-block reveal">
        <h1>Matériel</h1>
        <p>Dans l'ordre d'importance — 1 achat par mois</p>
      </div>

      {/* Déjà en stock */}
      <section className="reveal reveal-d1">
        <div className="shead">
          <h2>Déjà en stock</h2>
          <span className="hint">{OWNED.length + boughtItems.length} items</span>
        </div>
        <div className="gear-list">
          {OWNED.map(name => (
            <div key={name} className="gear-item done">
              <div className="gear-check" style={{ borderColor: '#34C759', background: '#34C759' }}>{CHECK}</div>
              <div className="gear-content">
                <div className="gear-name">{name}</div>
              </div>
            </div>
          ))}
          {boughtItems.map(item => {
            const origIdx = GEAR.indexOf(item);
            return (
              <div
                key={item.name}
                className="gear-item done"
                style={{ borderColor: item.color + '44', cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onClick={() => toggle(origIdx)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(origIdx); } }}
              >
                <div className="gear-check" style={{ borderColor: item.color, background: item.color }}>{CHECK}</div>
                <div className="gear-content">
                  <div className="gear-name">{item.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Liste prioritaire */}
      <section className="reveal">
        <div className="shead">
          <h2>À acheter dans l'ordre</h2>
          <span className="hint">{boughtItems.length}/{GEAR.length} achetés</span>
        </div>
        <div className="gear-list">
          {remaining.map((item) => {
            const origIdx = GEAR.indexOf(item);
            const rank = remaining.indexOf(item) + 1;
            return (
              <div
                key={origIdx}
                className="gear-item"
                role="button"
                tabIndex={0}
                onClick={() => toggle(origIdx)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(origIdx); } }}
              >
                <div className="gear-num" style={{ color: item.color }}>{rank}</div>
                <div className="gear-content">
                  <div className="gear-name">
                    {item.name}
                    <span className="gear-price">{item.price}</span>
                  </div>
                  <div className="gear-note">{item.why}</div>
                  <div className="gear-brands">{item.brands}</div>
                  <div className="gear-when" style={{ color: item.color }}>{item.when}</div>
                </div>
              </div>
            );
          })}
          {remaining.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--muted)', fontSize: 14 }}>
              Tout est en stock — tu es prêt pour l'Ironman.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
