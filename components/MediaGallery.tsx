'use client';
import { useState, useEffect, useRef } from 'react';
import type { MediaItem } from '@/types';

function todayStr() { return new Date().toLocaleDateString('fr-CA'); }

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pending, setPending] = useState<File[]>([]);
  const [fileLabel, setFileLabel] = useState('Choisir photo(s) ou vidéo(s)');
  const [fileInfo, setFileInfo] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch('/api/media');
    if (res.ok) setItems(await res.json());
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPending(files);
    if (files.length) {
      const mb = (files.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1);
      setFileLabel(`${files.length} fichier(s) sélectionné(s)`);
      setFileInfo(`${files.length} fichier(s) · ${mb} Mo`);
    } else {
      setFileLabel('Choisir photo(s) ou vidéo(s)');
      setFileInfo('');
    }
  }

  async function upload() {
    if (!pending.length) return;
    setUploading(true);
    const fd = new FormData();
    pending.forEach(f => fd.append('files', f));
    fd.append('date', dateRef.current?.value || todayStr());
    fd.append('note', noteRef.current?.value.trim() || '');
    try {
      const res = await fetch('/api/media', { method: 'POST', body: fd });
      if (!res.ok) throw new Error();
      if (fileRef.current) fileRef.current.value = '';
      if (noteRef.current) noteRef.current.value = '';
      if (dateRef.current) dateRef.current.value = todayStr();
      setPending([]); setFileLabel('Choisir photo(s) ou vidéo(s)'); setFileInfo('');
      await fetchItems();
    } catch {
      alert('Erreur lors de l\'upload — réessaie.');
    } finally { setUploading(false); }
  }

  async function remove(id: number) {
    if (!confirm('Supprimer ce fichier ?')) return;
    await fetch(`/api/media/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function download(id: number, name: string) {
    const a = document.createElement('a');
    a.href = `/api/media/${id}`;
    a.download = name;
    a.click();
  }

  return (
    <section>
      <div className="shead"><h2>Galerie entraînements</h2><span className="hint">photos &amp; vidéos</span></div>
      <div className="gallery-card">
        <div className="upload-zone">
          <span className="upload-label">Ajouter un média</span>
          <div className="upload-fields">
            <input ref={dateRef} type="date" className="inp" defaultValue={todayStr()} aria-label="Date" />
            <input ref={noteRef} type="text" className="inp" placeholder="Note (optionnel)" />
          </div>
          <label className="file-pick">
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={onFileChange} style={{ display: 'none' }} />
            {fileLabel}
          </label>
          {fileInfo && <div className="file-info">{fileInfo}</div>}
          <button className="btn-tide" onClick={upload} disabled={!pending.length || uploading}>
            {uploading ? 'Enregistrement…' : 'Ajouter à la galerie'}
          </button>
        </div>

        {items.length === 0 ? (
          <div className="gal-empty">Tes entraînements apparaîtront ici.<br />Ajoute une photo ou une vidéo ci-dessus.</div>
        ) : (
          <div className="gallery-grid">
            {items.map(item => {
              const src = `/api/media/${item.id}`;
              const isVideo = item.mimeType.startsWith('video/');
              return (
                <div key={item.id} className="gal-item">
                  {isVideo
                    ? <video src={src} controls preload="metadata" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', background: '#000' }} />
                    : <img src={src} alt={item.note || item.originalName} loading="lazy" />
                  }
                  <div className="gal-overlay">
                    <div className="gal-date">{fmtDate(item.date)}</div>
                    {item.note && <div className="gal-note">{item.note}</div>}
                    <div className="gal-actions">
                      <button className="gal-btn" onClick={() => download(item.id, item.originalName)}>Télécharger</button>
                      <button className="gal-btn del" onClick={() => remove(item.id)}>Supprimer</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
