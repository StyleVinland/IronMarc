'use client';
import { createContext, useContext, useRef, useState, useCallback, useEffect, type ReactNode } from 'react';
import { ensureDay, todayStr } from '@/lib/compute';
import { AFF } from '@/lib/constants';
import type { AppState, MindData } from '@/types';

interface AppCtx {
  state: AppState;
  today: string;
  addCig: () => void;
  removeCig: () => void;
  toggleMission: (id: string, done: boolean) => void;
  toggleQuest: (id: string, done: boolean) => void;
  updateMind: (field: keyof MindData, val: MindData[keyof MindData]) => void;
  nextAff: () => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}

export function AppStateProvider({ children, initial }: { children: ReactNode; initial: AppState }) {
  const today = todayStr();
  const [state, setState] = useState<AppState>(() => ensureDay(initial, today));

  // Ref toujours à jour — évite les stale closures dans les callbacks
  const stateRef = useRef<AppState>(state);
  stateRef.current = state;

  const patchDay = useCallback((body: Record<string, unknown>) => {
    fetch(`/api/days/${today}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    } as RequestInit).catch(() => {});
  }, [today]);

  const addCig = useCallback(() => {
    const next = (stateRef.current.days[today]?.cigs ?? 0) + 1;
    setState(prev => {
      const s = ensureDay(prev, today);
      return { ...s, days: { ...s.days, [today]: { ...s.days[today], cigs: next } } };
    });
    patchDay({ cigs: next });
  }, [today, patchDay]);

  const removeCig = useCallback(() => {
    const next = Math.max(0, (stateRef.current.days[today]?.cigs ?? 0) - 1);
    setState(prev => {
      const s = ensureDay(prev, today);
      return { ...s, days: { ...s.days, [today]: { ...s.days[today], cigs: next } } };
    });
    patchDay({ cigs: next });
  }, [today, patchDay]);

  const toggleMission = useCallback((id: string, done: boolean) => {
    setState(prev => {
      const s = ensureDay(prev, today);
      return { ...s, days: { ...s.days, [today]: { ...s.days[today], missions: { ...s.days[today].missions, [id]: done } } } };
    });
    fetch(`/api/days/${today}/missions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: done }),
      keepalive: true,
    } as RequestInit).catch(() => {});
  }, [today]);

  const toggleQuest = useCallback((id: string, done: boolean) => {
    setState(prev => ({ ...prev, quests: { ...prev.quests, [id]: done } }));
    fetch(`/api/quests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: done }),
      keepalive: true,
    } as RequestInit).catch(() => {});
  }, []);

  const updateMind = useCallback((field: keyof MindData, val: MindData[keyof MindData]) => {
    setState(prev => {
      const s = ensureDay(prev, today);
      return { ...s, days: { ...s.days, [today]: { ...s.days[today], mind: { ...s.days[today].mind, [field]: val } } } };
    });
    if (field === 'mood') patchDay({ mood: val });
    else if (field === 'journal') patchDay({ journal: val });
    else if (field === 'grat') patchDay({ grat: val });
  }, [today, patchDay]);

  // Recharge l'état depuis le serveur quand l'onglet reprend le focus
  // (sync entre téléphone et ordi sans rechargement manuel)
  useEffect(() => {
    const sync = () => {
      fetch('/api/state')
        .then(r => r.json())
        .then((fresh: AppState) => {
          setState(prev => ensureDay(fresh, todayStr()));
        })
        .catch(() => {});
    };
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, []);

  const nextAff = useCallback(() => {
    setState(prev => {
      const idx = (prev.affIdx + 1) % AFF.length;
      fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affIdx: String(idx) }),
      }).catch(() => {});
      return { ...prev, affIdx: idx };
    });
  }, []);

  return (
    <Ctx.Provider value={{ state, today, addCig, removeCig, toggleMission, toggleQuest, updateMind, nextAff }}>
      {children}
    </Ctx.Provider>
  );
}
