'use client';
import { useState } from 'react';

interface GearItem { name: string; note: string; done: boolean; later?: boolean; }
interface GearSection { id: string; label: string; color: string; priority?: string; items: GearItem[]; }

const GEAR_SECTIONS: GearSection[] = [
  {
    id: 'stock',
    label: 'Déjà en stock',
    color: '#88C49A',
    items: [
      { name: 'Maillot de bain', note: '', done: true },
      { name: 'Chaussures de course', note: '', done: true },
    ],
  },
  {
    id: 'swim',
    label: 'Natation',
    color: '#6EC6D8',
    priority: 'Priorité immédiate — première séance en piscine',
    items: [
      { name: 'Lunettes de natation', note: 'Speedo Vanquisher 2.0 ou Aqua Sphere Kayenne — 20 à 40 €', done: false },
      { name: 'Bonnet de silicone', note: 'Souvent fourni en piscine, sinon 5-15 €', done: false },
      { name: 'Planche de natation', note: 'Entraînement jambes — 10-20 €', done: false, later: true },
      { name: 'Pull buoy', note: 'Entraînement bras — 10-20 €', done: false, later: true },
    ],
  },
  {
    id: 'recovery',
    label: 'Récupération',
    color: '#CF8E42',
    priority: 'Priorité haute — indispensable avec ta pubalgie et tes périostites',
    items: [
      { name: 'Foam roller', note: 'TriggerPoint GRID ou similaire — 25-40 €. Après chaque séance sur mollets, cuisses, dos.', done: false },
      { name: 'Balle de massage (lacrosse)', note: 'Pour points précis : plante du pied, fessier, pectoral — 8-15 €', done: false },
      { name: 'Manchons de compression mollets', note: 'Raidlight, CEP ou BV Sport — 30-60 €. Contre les périostites, à porter après l\'effort.', done: false },
      { name: 'Pistolet de massage', note: 'Theragun Mini ou Hypervolt Go — 80-150 €. Pas urgent, mais game-changer pour la récup.', done: false, later: true },
    ],
  },
  {
    id: 'bike',
    label: 'Vélo',
    color: '#88C49A',
    priority: 'Dans 2-3 mois quand la base cardio est posée',
    items: [
      { name: 'Vélo de route (occasion)', note: 'Commencer avec un vélo d\'occasion en bon état — 400-800 €. Leboncoin / Decathlon Seconde Vie.', done: false },
      { name: 'Casque vélo', note: 'Obligatoire en compétition. Giro / Bell / Specialized — 50-150 €', done: false },
      { name: 'Chaussures vélo + pédales SPD', note: 'Shimano XT ou Look — 80-200 €. Les pédales automatiques changent tout.', done: false },
      { name: 'Cuissard rembourré', note: 'Essentiel pour les longues sorties. Pas de sous-vêtement en dessous — 40-80 €', done: false },
      { name: 'Bidon + porte-bidon', note: '20-30 €', done: false },
    ],
  },
  {
    id: 'run',
    label: 'Course',
    color: '#C26060',
    priority: 'Phase 1C+ quand la course arrive',
    items: [
      { name: 'Chaussettes de compression', note: 'Falke, CEP — 20-50 €. Périostites : les porter pendant et après les sorties.', done: false },
      { name: 'Ceinture hydratation avec bidons', note: 'Nathan ou Salomon — 30-60 €. Pour les sorties > 45 min.', done: false },
      { name: 'Montre GPS / cardio (optionnel)', note: 'Garmin Forerunner 55 ou Polar Pacer — 150-250 €. Utile pour doser l\'intensité.', done: false, later: true },
    ],
  },
  {
    id: 'tri',
    label: 'Triathlon',
    color: '#CF8E42',
    priority: 'Long terme — à acheter 6 mois avant la première compétition',
    items: [
      { name: 'Combinaison néoprène de triathlon', note: 'Zone3 Aspire, Orca S7 — 150-400 €. Obligatoire en eau froide (< 22°C).', done: false },
      { name: 'Tri-suit (combinaison 1 pièce)', note: 'Pour les 3 disciplines sans changement. 100-250 €.', done: false },
      { name: 'Ceinture porte-dossard', note: 'On ne couds pas son dossard sur la combinaison — 10-15 €', done: false },
      { name: 'Sac de transition', note: 'Sac étanche pour zone T1/T2 — 30-60 €', done: false },
    ],
  },
];

export default function MaterielClient() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecked(p => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <div className="page-title-block">
        <h1>Matériel</h1>
        <p>Ce dont tu as besoin pour aller jusqu'à l'Ironman — dans l'ordre des priorités</p>
      </div>

      {GEAR_SECTIONS.map(sec => (
        <section key={sec.id}>
          <div className="shead">
            <h2 style={{ color: sec.color }}>{sec.label}</h2>
          </div>
          {sec.priority && (
            <div className="gear-priority">{sec.priority}</div>
          )}
          <div className="gear-list">
            {sec.items.map((item, i) => {
              const key = `${sec.id}-${i}`;
              const isChecked = item.done || !!checked[key];
              return (
                <div
                  key={key}
                  className={`gear-item${isChecked ? ' done' : ''}${item.later ? ' later' : ''}`}
                  onClick={() => !item.done && toggle(key)}
                  role={item.done ? undefined : 'button'}
                  tabIndex={item.done ? undefined : 0}
                  onKeyDown={e => { if (!item.done && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggle(key); } }}
                >
                  <div className="gear-check" style={{ borderColor: isChecked ? sec.color : undefined, background: isChecked ? sec.color : undefined }}>
                    {isChecked && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0a1a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="gear-content">
                    <div className="gear-name">
                      {item.name}
                      {item.later && <span className="gear-later-badge">plus tard</span>}
                    </div>
                    {item.note && <div className="gear-note">{item.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
