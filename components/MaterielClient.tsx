'use client';
import { useState } from 'react';

interface GearItem {
  name: string;
  price: string;
  why: string;
  brands: string;
  when: string;
  color: string;
}

const OWNED = ['Maillot de bain', 'Chaussures de course'];

const GEAR: GearItem[] = [
  {
    name: 'Lunettes de natation',
    price: '20-30 €',
    why: 'Sans lunettes tu ne peux pas t\'entraîner en piscine. Premier achat, aucune négociation.',
    brands: 'Speedo Vanquisher 2.0 · Aqua Sphere Kayenne · Arena Cobra',
    when: 'Cette semaine',
    color: '#6EC6D8',
  },
  {
    name: 'Bonnet de silicone',
    price: '5-10 €',
    why: 'Obligatoire dans la plupart des piscines publiques. Le prendre en même temps que les lunettes.',
    brands: 'Speedo · Arena · Decathlon Nabaiji',
    when: 'Cette semaine',
    color: '#6EC6D8',
  },
  {
    name: 'Foam roller',
    price: '20-30 €',
    why: 'Outil de récup numéro 1 pour ta pubalgie et tes périostites. Mollets, cuisses, dos — après chaque séance. Sans ça tu risques de te blesser et d\'arrêter.',
    brands: 'TriggerPoint GRID · Blackroll Standard · Decathlon Domyos',
    when: 'Mois 1',
    color: '#CF8E42',
  },
  {
    name: 'Balle de massage (lacrosse)',
    price: '8-12 €',
    why: 'Complémente le foam roller pour les zones précises : plante du pied, fessier, pectoral. Quasi gratuit.',
    brands: 'TriggerPoint MB1 · Blackroll Ball · balle de lacrosse générique',
    when: 'Mois 1 — avec le foam roller',
    color: '#CF8E42',
  },
  {
    name: 'Manchons de compression mollets',
    price: '25-45 €',
    why: 'Direct contre les périostites. À porter pendant la marche/course et 1-2 h après. Les périostites peuvent te sortir du programme — c\'est une priorité.',
    brands: 'BV Sport Booster Elite · CEP Run Merino · Raidlight Trail',
    when: 'Mois 2',
    color: '#CF8E42',
  },
  {
    name: 'Pull buoy',
    price: '10-15 €',
    why: 'Flotteur entre les jambes pour travailler les bras en piscine. Permet de progresser en nage même quand les jambes sont fatiguées.',
    brands: 'Speedo · Arena · Decathlon Nabaiji',
    when: 'Mois 2-3',
    color: '#6EC6D8',
  },
  {
    name: 'Planche de natation',
    price: '10-15 €',
    why: 'Travail des jambes en piscine — améliore le crawl. Certaines piscines en prêtent, vérifie avant d\'acheter.',
    brands: 'Speedo · Arena · Decathlon Nabaiji',
    when: 'Mois 3',
    color: '#6EC6D8',
  },
  {
    name: 'Chaussettes de compression',
    price: '20-35 €',
    why: 'Périostites : essentielles pour les sorties de course dès que la course arrive dans le programme.',
    brands: 'BV Sport Run Compressport · Falke RU4 · CEP Run 3.0',
    when: 'Mois 4 — avant la phase course',
    color: '#C26060',
  },
  {
    name: 'Vélo de route (occasion)',
    price: '400-700 €',
    why: 'Le plus gros investissement. Commence à économiser maintenant. Pas besoin d\'un vélo de triathlon — un vélo de route d\'occasion suffit largement pour les 2 ans.',
    brands: 'Leboncoin · Decathlon Seconde Vie · Trek Domane / Giant Contend / Btwin (Decathlon)',
    when: 'Mois 4-5 — commencer à économiser dès maintenant',
    color: '#88C49A',
  },
  {
    name: 'Casque vélo',
    price: '40-80 €',
    why: 'Obligatoire en compétition et indispensable à la sécurité. À acheter en même temps que le vélo.',
    brands: 'Giro Register · Bell Formula · Decathlon Van Rysel RC 500',
    when: 'Mois 5 — avec le vélo',
    color: '#88C49A',
  },
  {
    name: 'Cuissard rembourré',
    price: '30-50 €',
    why: 'Sans cuissard les longues sorties vélo deviennent vite insupportables. Pas de sous-vêtement en dessous.',
    brands: 'Decathlon Van Rysel · Castelli Entrata · Rogelli Bike',
    when: 'Mois 5 — dès les premières sorties vélo',
    color: '#88C49A',
  },
  {
    name: 'Chaussures vélo + pédales SPD',
    price: '70-130 €',
    why: 'Les pédales automatiques améliorent vraiment l\'efficacité. À attendre quelques sorties avant d\'investir.',
    brands: 'Shimano MT501 (chaussures) + Shimano PD-M520 (pédales) · Look Keo Easy',
    when: 'Mois 6-7',
    color: '#88C49A',
  },
  {
    name: 'Ceinture hydratation (course)',
    price: '25-40 €',
    why: 'Pour les sorties course > 45 min. Pas urgent au début.',
    brands: 'Nathan VaporKrar · Salomon Active Skin 4 · Decathlon Evadict',
    when: 'Mois 7-8',
    color: '#C26060',
  },
  {
    name: 'Pistolet de massage',
    price: '80-150 €',
    why: 'Confort et récup accélérée, mais pas indispensable si tu utilises bien le foam roller et la balle. À attendre.',
    brands: 'Theragun Mini · Hyperice Hypervolt Go · Decathlon Kalenji',
    when: 'Mois 8-10 si budget',
    color: '#CF8E42',
  },
  {
    name: 'Montre GPS / cardio',
    price: '120-200 €',
    why: 'Utile pour doser l\'intensité et ne pas dépasser — important avec tes blessures. Pas urgent les premiers mois.',
    brands: 'Garmin Forerunner 55 · Polar Pacer · Coros Pace 3',
    when: 'Mois 6-9 si budget',
    color: '#7A7870',
  },
  {
    name: 'Combinaison néoprène de triathlon',
    price: '150-300 €',
    why: 'Obligatoire en eau froide (< 22°C). À acheter 2-3 mois avant ta première compétition.',
    brands: 'Zone3 Aspire · Orca S7 · Roka Maverick Comp II',
    when: '3 mois avant la compétition',
    color: '#6EC6D8',
  },
  {
    name: 'Tri-suit (combinaison 1 pièce)',
    price: '80-180 €',
    why: 'Pour faire les 3 disciplines sans se changer. Pas obligatoire pour les premiers triathlons (maillot + cuissard ça marche).',
    brands: 'Zone3 Lava · Orca 226 · Decathlon Aptonia',
    when: 'Avant le premier triathlon Sprint',
    color: '#7A7870',
  },
  {
    name: 'Ceinture porte-dossard + sac transition',
    price: '15-25 €',
    why: 'Petits accessoires indispensables le jour J. Acheter la semaine avant la compétition.',
    brands: 'Ronhill · Nathan · Decathlon Aptonia',
    when: 'Juste avant la compétition',
    color: '#7A7870',
  },
];

export default function MaterielClient() {
  const [bought, setBought] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setBought(p => ({ ...p, [i]: !p[i] }));

  const doneCount = Object.values(bought).filter(Boolean).length;

  return (
    <>
      <div className="page-title-block">
        <h1>Matériel</h1>
        <p>Dans l'ordre d'importance — 1 achat par mois</p>
      </div>

      {/* Déjà en stock */}
      <section>
        <div className="shead"><h2>Déjà en stock</h2><span className="hint">✓</span></div>
        <div className="gear-list">
          {OWNED.map(name => (
            <div key={name} className="gear-item done">
              <div className="gear-check" style={{ borderColor: '#88C49A', background: '#88C49A' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#0a1a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="gear-content">
                <div className="gear-name">{name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Liste prioritaire */}
      <section>
        <div className="shead">
          <h2>À acheter dans l'ordre</h2>
          <span className="hint">{doneCount}/{GEAR.length} achetés</span>
        </div>

        <div className="gear-list">
          {GEAR.map((item, i) => {
            const isDone = !!bought[i];
            return (
              <div
                key={i}
                className={`gear-item${isDone ? ' done' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => toggle(i)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } }}
              >
                <div className="gear-num" style={{ color: isDone ? '#4a4845' : item.color }}>{isDone ? '✓' : i + 1}</div>
                <div className="gear-content">
                  <div className="gear-name" style={{ color: isDone ? 'var(--muted)' : 'var(--foam)' }}>
                    {item.name}
                    <span className="gear-price">{item.price}</span>
                  </div>
                  {!isDone && <div className="gear-note">{item.why}</div>}
                  {!isDone && <div className="gear-brands">{item.brands}</div>}
                  <div className="gear-when" style={{ color: isDone ? '#3a3a35' : item.color }}>{item.when}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
