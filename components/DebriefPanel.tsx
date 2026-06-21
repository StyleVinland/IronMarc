'use client';
import { useState, useEffect, useCallback } from 'react';
import type { DebriefData } from '@/types';

interface Props {
  date: string;
  sessionId: string;
  sessionLabel: string;
  today: string;
  prePainAine?: number;
  prePainTibia?: number;
}

const STATUSES = [
  { id: 'done',     label: '✓ Faite',    color: '#34C759' },
  { id: 'modified', label: '~ Adaptée',  color: '#FF9500' },
  { id: 'skipped',  label: '→ Sautée',   color: '#636366' },
  { id: 'injury',   label: '✗ Blessure', color: '#FF3B30' },
] as const;

const MONTHS_FR = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];
function fmtDate(ds: string) {
  const d = new Date(ds + 'T12:00:00');
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]}`;
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="db-stars">
      {[1,2,3,4,5].map(v => (
        <button key={v} className={`db-star${value >= v ? ' on' : ''}`}
          onClick={() => onChange(v)} type="button">★</button>
      ))}
    </div>
  );
}

export default function DebriefPanel({
  date, sessionId, sessionLabel, today,
  prePainAine = 0, prePainTibia = 0,
}: Props) {
  const isToday = date === today;

  const [open, setOpen]       = useState(false);
  const [loaded, setLoaded]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const [saved, setSaved]     = useState<DebriefData | null>(null);
  const [last,  setLast]      = useState<DebriefData | null>(null);

  const [status,     setStatus]     = useState<string>('done');
  const [painAine,   setPainAine]   = useState(prePainAine);
  const [painTibia,  setPainTibia]  = useState(prePainTibia);
  const [energy,     setEnergy]     = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [notes,      setNotes]      = useState('');

  const load = useCallback(async () => {
    const [r1, r2] = await Promise.all([
      fetch(`/api/debriefs/${date}`),
      fetch(`/api/debriefs/last?session_id=${sessionId}&before=${date}`),
    ]);
    const debrief: DebriefData | null = await r1.json();
    const lastDebrief: DebriefData | null = await r2.json();
    setSaved(debrief);
    setLast(lastDebrief);
    if (debrief) {
      setStatus(debrief.status);
      setPainAine(debrief.pain_aine);
      setPainTibia(debrief.pain_tibia);
      setEnergy(debrief.energy);
      setDifficulty(debrief.difficulty);
      setNotes(debrief.notes);
    } else {
      setStatus('done');
      setPainAine(prePainAine);
      setPainTibia(prePainTibia);
      setEnergy(3); setDifficulty(3); setNotes('');
      if (isToday) setOpen(true); // auto-ouvrir pour aujourd'hui seulement si pas de débrief
    }
    setLoaded(true);
  }, [date, sessionId, isToday, prePainAine, prePainTibia]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/debriefs/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, status, pain_aine: painAine, pain_tibia: painTibia, energy, difficulty, notes }),
    });
    await load();
    setOpen(false);
    setJustSaved(true);
    setLoading(false);
    setTimeout(() => setJustSaved(false), 3000);
  }

  if (!loaded) return null;

  const savedColor = STATUSES.find(s => s.id === saved?.status)?.color;
  const savedLabel = STATUSES.find(s => s.id === saved?.status)?.label;

  // ── Vue compacte (débrief sauvegardé) ───────────────────────────────────
  if (saved && !open) {
    return (
      <div className="debrief-wrap">
        <button className="db-compact" onClick={() => setOpen(true)}>
          <span className="db-compact-status" style={{ color: savedColor }}>{savedLabel}</span>
          {justSaved && <span className="db-xp-pop">Débrief enregistré</span>}
          <span className="db-compact-edit">Modifier ▼</span>
        </button>
      </div>
    );
  }

  // ── Toggle pour dates passées sans débrief ───────────────────────────────
  if (!saved && !isToday && !open) {
    return (
      <div className="debrief-wrap">
        <button className="debrief-toggle" onClick={() => setOpen(true)}>
          <span className="db-toggle-pill db-toggle-empty">+ Débrief</span>
          <span className="db-toggle-hint">Ajouter ▼</span>
        </button>
      </div>
    );
  }

  // ── Formulaire complet ───────────────────────────────────────────────────
  return (
    <div className="debrief-wrap">
      <div className="db-validate-header">
        <span className="db-validate-title">
          {saved ? 'Débrief' : 'Valider ma séance'}
        </span>
        {(saved || !isToday) && (
          <button className="db-header-close" onClick={() => setOpen(false)}>▲ Fermer</button>
        )}
      </div>

      <div className="debrief-body">
        {/* Dernière fois même type */}
        {last && (
          <div className="db-last">
            <div className="db-last-title">Dernière — {sessionLabel} · {fmtDate(last.date)}</div>
            <div className="db-last-row">
              <span style={{ color: STATUSES.find(s => s.id === last.status)?.color }}>
                {STATUSES.find(s => s.id === last.status)?.label}
              </span>
              <span>Aine {last.pain_aine}/10</span>
              <span>Tibia {last.pain_tibia}/10</span>
              <span>E {'★'.repeat(last.energy)}{'☆'.repeat(5-last.energy)}</span>
            </div>
            {last.notes && <div className="db-last-notes">"{last.notes}"</div>}
          </div>
        )}

        {/* Status */}
        <div className="db-field">
          <label className="db-label">Comment s'est passée la séance ?</label>
          <div className="db-status-row">
            {STATUSES.map(s => (
              <button key={s.id} type="button"
                className={`db-status-btn${status === s.id ? ' sel' : ''}`}
                style={status === s.id ? { background: s.color + '22', borderColor: s.color, color: s.color } : {}}
                onClick={() => setStatus(s.id)}
              >{s.label}</button>
            ))}
          </div>
          {status === 'skipped' && (
            <div className="db-status-note">0 XP — pas de malus. Tu reprendras quand tu es prêt.</div>
          )}
          {status === 'injury' && (
            <div className="db-status-note db-status-warn">Repos obligatoire. Douleur persistante &gt; 4/10 → kiné.</div>
          )}
        </div>

        {/* Notes (toujours visibles) */}
        <div className="db-field">
          <label className="db-label">
            Notes {notes.trim().length >= 10 && <span className="db-notes-xp">+{20} XP bonus</span>}
          </label>
          <textarea className="db-textarea"
            placeholder="Ce qui s'est passé, ce qui a été modifié, ressenti… (optionnel)"
            value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          />
        </div>

        {/* Détails optionnels */}
        <button className="db-details-toggle" type="button" onClick={() => setShowDetails(d => !d)}>
          {showDetails ? '▲ Masquer' : '▼ Douleurs · Énergie · Difficulté'}
        </button>

        {showDetails && (
          <div className="db-details-block">
            <div className="db-field-row">
              <div className="db-field">
                <label className="db-label">Douleur aine / pubis</label>
                <div className="db-scale">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                    <button key={v} type="button"
                      className={`db-scale-btn${painAine === v ? ' sel' : ''}${v > 4 ? ' hi' : ''}`}
                      onClick={() => setPainAine(v)}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="db-field">
                <label className="db-label">Douleur tibia</label>
                <div className="db-scale">
                  {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                    <button key={v} type="button"
                      className={`db-scale-btn${painTibia === v ? ' sel' : ''}${v > 4 ? ' hi' : ''}`}
                      onClick={() => setPainTibia(v)}>{v}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="db-field-row">
              <div className="db-field">
                <label className="db-label">Énergie</label>
                <Stars value={energy} onChange={setEnergy} />
              </div>
              <div className="db-field">
                <label className="db-label">Difficulté</label>
                <Stars value={difficulty} onChange={setDifficulty} />
              </div>
            </div>

            {(painAine > 5 || painTibia > 5) && (
              <div className="db-alert">Douleur &gt; 5/10 — à signaler au kiné.</div>
            )}
          </div>
        )}

        {/* Bouton sauvegarde */}
        <div className="db-save-row">
          <button className="btn-primary db-save" onClick={handleSave} disabled={loading}>
            {loading ? 'Sauvegarde…' : saved ? 'Mettre à jour' : 'Sauvegarder le débrief'}
          </button>
          {justSaved && <div className="db-xp-pop">Débrief enregistré ✓</div>}
        </div>
      </div>
    </div>
  );
}
