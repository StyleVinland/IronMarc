'use client';
import { useEffect } from 'react';
import { getCurrentTheme, msUntilNextThemeChange } from '@/lib/suntime';

// Fallback : Paris
const DEFAULT_LAT = 48.8566;
const DEFAULT_LNG = 2.3522;

function applyTheme(lat: number, lng: number) {
  const theme = getCurrentTheme(lat, lng);
  const html  = document.documentElement;

  // Transition douce entre les deux thèmes
  html.classList.add('theme-transitioning');
  html.setAttribute('data-theme', theme);

  // Mettre à jour la meta theme-color (barre de statut mobile)
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#000000' : '#F2F2F7');

  setTimeout(() => html.classList.remove('theme-transitioning'), 700);

  // Programmer le prochain basculement
  const delay = msUntilNextThemeChange(lat, lng);
  // Ajouter 30 s de tampon pour éviter les erreurs à la marge
  setTimeout(() => applyTheme(lat, lng), delay + 30000);
}

export default function ThemeProvider() {
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => applyTheme(pos.coords.latitude, pos.coords.longitude),
        ()  => applyTheme(DEFAULT_LAT, DEFAULT_LNG), // refus ou erreur → Paris
        { timeout: 5000, maximumAge: 3600000 }        // cache 1 h
      );
    } else {
      applyTheme(DEFAULT_LAT, DEFAULT_LNG);
    }
  }, []);

  return null;
}
