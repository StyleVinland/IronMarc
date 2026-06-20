'use client';
import { useState, useEffect, useCallback } from 'react';
import type { DebriefData } from '@/lib/db';

interface Props {
  date: string;
  sessionId: string;
  sessionLabel: string;
}

const STATUSES = [
  { id: 'done',     label: '✓ Faite',       color: '#88C49A' },
  { id: 'modified', label: '~ Adaptée',     color: '#CF8E42' },
  { id: 'skipped',  label: '→ Reportée',    color: '#6EC6D8' },
  { id: 'injury',   label: '✗ Blessure',    color: '#C26060' },
] as const;

const MONTHS_FR = ['jan','fév','mar','avr','mai','jun','jul','aoû','sep','oct','nov','déc'];

function fmtDate(ds: string): string {
  const d = new Date(ds + 'T12:00:00');
  return `${d.getDate()} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`;
}

function Stars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="db-stars">
      {[1,2,3,4,5].map(v => (
        <button
          key={v}
          className={`db-star${value >= v ? ' on' : ''}`}
          onClick={() => onChange(v)}
          type="button"
        >★</button>
      ))}
    </div>
  );
}

export default function DebriefPanel({ date, sessionId, sessionLabel }: Props) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<DebriefData | null>(null);
  const [last, setLast]   = useState<DebriefData | null>(null);
  const [loading, setLoading] = useState(false);

  const [status,    setStatus]    = useState<string>('done');
  const [painAine,  setPainAine]  = useState(0);
  const [painTibia, setPainTibia] = useState(0);
  const [energy,    setEnergy]    = useState(3);
  const [difficulty,setDifficulty]= useState(3);
  const [notes,     setNotes]     = useState('');

  const load = useCallback(async () => {
    const [debriefRes, lastRes] = await Promise.all([
      fetch(`/api/debriefs/${date}`),
      fetch(`/api/debriefs/last?session_id=${sessionId}&before=${date}`),
    ]);
    const debrief: DebriefData | null = await debriefRes.json();
    const lastDebrief: DebriefData | null = await lastRes.json();
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
      setStatus('done'); setPainAine(0); setPainTibia(0);
      setEnergy(3); setDifficulty(3); setNotes('');
    }
  }, [date, sessionId]);

  useEffect(() => { if (open) load(); }, [open, load]);

  async function handleSave() {
    setLoading(true);
    await fetch(`/api/debriefs/${date}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, status, pain_aine: painAine, pain_tibia: painTibia, energy, difficulty, notes }),
    });
    await load();
    setLoading(false);
  }

  const statusObj = STATUSES.find(s => s.id === (saved?.status ?? ''));

  return (
    <div className="debrief-wrap">
      <button className="debrief-toggle" onClick={() => setOpen(o => !o)}>
        {saved ? (
          <>
            <span className="db-toggle-pill" style={{ background: statusObj?.color ?? '#88C49A' }}>
              {statusObj?.label ?? '✓ Faite'}
            </span>
            <span className="db-toggle-hint">Voir débrief {open ? '▲' : '▼'}</span>
          </>
        ) : (
          <>
            <span className="db-toggle-pill db-toggle-empty">+ Débrief</span>
            <span className="db-toggle-hint">{open ? 'Fermer ▲' : 'Ajouter ▼'}</span>
          </>
        )}
      </button>

      {open && (
        <div className="debrief-body">
          {/* Dernier débrief même type de séance */}
          {last && (
            <div className="db-last">
              <div className="db-last-title">Dernière fois — {sessionLabel} ({fmtDate(last.date)})</div>
              <div className="db-last-row">
                <span style={{ color: STATUSES.find(s => s.id === last.status)?.color }}>{STATUSES.find(s => s.id === last.status)?.label}</span>
                <span>Aine {last.pain_aine}/10</span>
                <span>Tibia {last.pain_tibia}/10</span>
                <span>Énergie {'★'.repeat(last.energy)}{'☆'.repeat(5-last.energy)}</span>
                <span>Difficulté {'★'.repeat(last.difficulty)}{'☆'.repeat(5-last.difficulty)}</span>
              </div>
              {last.notes && <div className="db-last-notes">"{last.notes}"</div>}
            </div>
          )}

          {/* Formulaire */}
          <div className="db-form">
            <div className="db-field">
              <label className="db-label">Statut de la séance</label>
              <div className="db-status-row">
                {STATUSES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className={`db-status-btn${status === s.id ? ' sel' : ''}`}
                    style={status === s.id ? { background: s.color + '33', borderColor: s.color, color: s.color } : {}}
                    onClick={() => setStatus(s.id)}
                  >{s.label}</button>
                ))}
              </div>
            </div>

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
                <label className="db-label">Niveau d'énergie</label>
                <Stars value={energy} onChange={setEnergy} />
              </div>
              <div className="db-field">
                <label className="db-label">Difficulté ressentie</label>
                <Stars value={difficulty} onChange={setDifficulty} />
              </div>
            </div>

            <div className="db-field">
              <label className="db-label">Notes libres (ce qui s'est passé, ce qui a été modifié…)</label>
              <textarea
                className="db-textarea"
                placeholder="Ex: j'ai réduit les intervalles à cause de la douleur tibiale, mais les 3 premières séries étaient bien. La piscine était bondée."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {(painAine > 5 || painTibia > 5) && (
              <div className="db-alert">
                Douleur &gt; 5/10 — à signaler à ton kiné. Mettre la prochaine séance similaire en attente.
              </div>
            )}

            <button className="btn-primary db-save" onClick={handleSave} disabled={loading}>
              {loading ? 'Sauvegarde…' : saved ? 'Mettre à jour' : 'Sauvegarder le débrief'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
