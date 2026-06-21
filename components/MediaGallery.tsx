'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { MediaItem } from '@/types';

function todayStr() { return new Date().toLocaleDateString('fr-CA'); }

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function Lightbox({ items, idx, onClose, onNav }: {
  items: MediaItem[]; idx: number;
  onClose: () => void; onNav: (delta: number) => void;
}) {
  const item = items[idx];
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNav]);

  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) onNav(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  const src = `/api/media/${item.id}`;
  const isVideo = item.mimeType.startsWith('video/');

  return (
    <div className="lb-overlay" onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="lb-inner" onClick={e => e.stopPropagation()}>
        <button className="lb-close" onClick={onClose} aria-label="Fermer">✕</button>

        {items.length > 1 && (
          <button className="lb-nav lb-prev" onClick={() => onNav(-1)} aria-label="Précédent">‹</button>
        )}

        <div className="lb-media">
          {isVideo
            ? <video src={src} controls autoPlay className="lb-img" />
            : <img src={src} alt={item.note || item.originalName} className="lb-img" />
          }
        </div>

        {items.length > 1 && (
          <button className="lb-nav lb-next" onClick={() => onNav(1)} aria-label="Suivant">›</button>
        )}

        <div className="lb-info">
          <span className="lb-date">{fmtDate(item.date)}</span>
          {item.note && <span className="lb-note">{item.note}</span>}
          <span className="lb-counter">{idx + 1} / {items.length}</span>
        </div>
      </div>
    </div>
  );
}

export default function MediaGallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pending, setPending] = useState<File[]>([]);
  const [fileLabel, setFileLabel] = useState('Choisir photo(s) ou vidéo(s)');
  const [fileInfo, setFileInfo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
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
    setLightboxIdx(null);
  }

  function download(id: number, name: string) {
    const a = document.createElement('a');
    a.href = `/api/media/${id}`;
    a.download = name;
    a.click();
  }

  const navigate = useCallback((delta: number) => {
    setLightboxIdx(prev => {
      if (prev === null) return null;
      return (prev + delta + items.length) % items.length;
    });
  }, [items.length]);

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
            {items.map((item, index) => {
              const src = `/api/media/${item.id}`;
              const isVideo = item.mimeType.startsWith('video/');
              return (
                <div key={item.id} className="gal-item" onClick={() => setLightboxIdx(index)} style={{ cursor: 'pointer' }}>
                  {isVideo
                    ? <video src={src} preload="metadata" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', background: '#000', pointerEvents: 'none' }} />
                    : <img src={src} alt={item.note || item.originalName} loading="lazy" />
                  }
                  <div className="gal-overlay">
                    <div className="gal-date">{fmtDate(item.date)}</div>
                    {item.note && <div className="gal-note">{item.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {lightboxIdx !== null && (
        <Lightbox
          items={items}
          idx={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNav={navigate}
        />
      )}
    </section>
  );
}
