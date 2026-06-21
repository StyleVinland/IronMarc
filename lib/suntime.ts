// Calcul lever/coucher du soleil — algorithme NOAA Solar Calculator
// Précision ~1 min pour latitudes 0–65°

export interface SunTimes {
  sunrise: Date;
  sunset:  Date;
}

export function getSunTimes(lat: number, lng: number, date = new Date()): SunTimes {
  // Julian Day Number
  const JD = date.getTime() / 86400000 + 2440587.5;
  const t  = (JD - 2451545) / 36525; // siècles juliens depuis J2000.0

  // Longitude moyenne géométrique du soleil (degrés)
  const L0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  // Anomalie moyenne (degrés)
  const M    = 357.52911 + t * (35999.05029 - t * 0.0001537);
  const Mrad = M * Math.PI / 180;

  // Équation du centre
  const C =
    Math.sin(Mrad)     * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * Mrad) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * Mrad) * 0.000289;

  // Longitude vraie du soleil → longitude apparente
  const omega  = (125.04 - 1934.136 * t) * Math.PI / 180;
  const lambda = (L0 + C - 0.00569 - 0.00478 * Math.sin(omega)) * Math.PI / 180;

  // Obliquité de l'écliptique
  const eps0 = 23.439291111 - t * (0.013004167 + t * (1.639e-7 - t * 5.036e-7));
  const eps  = (eps0 + 0.00256 * Math.cos(omega)) * Math.PI / 180;

  // Déclinaison du soleil
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));

  // Équation du temps (minutes)
  const y    = Math.tan(eps / 2) ** 2;
  const L0r  = L0 * Math.PI / 180;
  const ecc  = 0.016708634 - t * (0.000042037 + 1.267e-7 * t);
  const EOT  = 4 * (180 / Math.PI) * (
    y * Math.sin(2 * L0r)
    - 2 * ecc * Math.sin(Mrad)
    + 4 * ecc * y * Math.sin(Mrad) * Math.cos(2 * L0r)
    - 0.5 * y * y * Math.sin(4 * L0r)
    - 1.25 * ecc * ecc * Math.sin(2 * Mrad)
  );

  // Angle horaire au lever/coucher (soleil à -0.833° sous l'horizon apparent)
  const latRad = lat * Math.PI / 180;
  const cosHA  = (
    Math.cos(90.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(dec)
  ) / (Math.cos(latRad) * Math.cos(dec));

  const dayStart = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  // Soleil de minuit ou nuit polaire
  if (cosHA <= -1) return { sunrise: new Date(dayStart),           sunset: new Date(dayStart + 86399000) };
  if (cosHA >=  1) return { sunrise: new Date(dayStart + 43200000), sunset: new Date(dayStart + 43200000) };

  const HA = Math.acos(cosHA) * 180 / Math.PI; // degrés

  // Midi solaire UTC (minutes depuis minuit UTC)
  const solarNoonUTC = 720 - 4 * lng - EOT;
  const sunriseUTC   = solarNoonUTC - 4 * HA;
  const sunsetUTC    = solarNoonUTC + 4 * HA;

  return {
    sunrise: new Date(dayStart + sunriseUTC * 60000),
    sunset:  new Date(dayStart + sunsetUTC  * 60000),
  };
}

/** Retourne 'dark' ou 'light' selon l'heure actuelle vs lever/coucher */
export function getCurrentTheme(lat: number, lng: number): 'dark' | 'light' {
  const { sunrise, sunset } = getSunTimes(lat, lng);
  const now = Date.now();
  return now >= sunrise.getTime() && now <= sunset.getTime() ? 'light' : 'dark';
}

/** Ms avant le prochain changement de thème */
export function msUntilNextThemeChange(lat: number, lng: number): number {
  const now = Date.now();
  const { sunrise, sunset } = getSunTimes(lat, lng);

  if (now < sunrise.getTime()) return sunrise.getTime() - now;
  if (now < sunset.getTime())  return sunset.getTime()  - now;

  // Après le coucher : calculer le lever de demain
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const { sunrise: tomorrowSunrise } = getSunTimes(lat, lng, tomorrow);
  return tomorrowSunrise.getTime() - now;
}
