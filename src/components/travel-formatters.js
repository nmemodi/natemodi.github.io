/**
 * Pure formatting functions for travel list display.
 * Extracted for testability.
 */

export function formatPopulation(pop) {
  if (pop == null) return '—';
  if (pop >= 1000000) return (pop / 1000000).toFixed(1) + 'M';
  if (pop >= 1000) return Math.round(pop / 1000).toLocaleString() + 'K';
  return pop.toLocaleString();
}

export function formatElevation(elev) {
  if (elev == null) return '—';
  const ft = Math.round(elev * 3.281);
  return `${elev.toLocaleString()}m / ${ft.toLocaleString()}ft`;
}

/**
 * Maps WMO weather codes to icon names.
 * See: https://open-meteo.com/en/docs#weathervariables
 *
 *   Code range → Icon
 *   ──────────────────
 *   0          → sun (clear sky)
 *   1-3        → cloud-sun (partly cloudy)
 *   4-48       → cloud (overcast/fog)
 *   49-67      → rain
 *   68-86      → snow
 *   95+        → storm
 */
export function getWeatherIconName(code) {
  if (code === 0) return 'sun';
  if (code <= 3) return 'cloud-sun';
  if (code <= 48) return 'cloud';
  if (code <= 67) return 'rain';
  if (code <= 86) return 'snow';
  if (code >= 95) return 'storm';
  return 'unknown';
}

/**
 * Filters a cities array to those visible in the current map viewBox,
 * excluding cities too close to the selected place marker.
 *
 *   filterVisibleCities(cities, lat, lng, span=20)
 *   ├─ compute viewBox bounds from lat/lng/span
 *   ├─ filter: city within bounds (with 2° margin)
 *   ├─ filter: city not within 1° of marker
 *   ├─ slice: cap at maxCities (default 10)
 *   └─ return filtered array
 */
export function filterVisibleCities(cities, lat, lng, span = 20, maxCities = 10) {
  if (!cities || !cities.length || lat == null || lng == null) return [];

  const margin = 2;
  const minLng = lng - span - margin;
  const maxLng = lng + span + margin;
  const minLat = lat - span / 2 - margin;
  const maxLat = lat + span / 2 + margin;

  const visible = [];
  for (const city of cities) {
    if (city.lng < minLng || city.lng > maxLng) continue;
    if (city.lat < minLat || city.lat > maxLat) continue;
    // Skip cities too close to the selected place marker
    if (Math.abs(city.lng - lng) < 1 && Math.abs(city.lat - lat) < 1) continue;
    visible.push(city);
    if (visible.length >= maxCities) break;
  }
  return visible;
}

/**
 * Converts IANA timezone name to UTC offset string.
 * Uses the browser's Intl API to get the current offset for the timezone.
 * Returns format: "UTC+5:30", "UTC-8", "UTC+0"
 */
export function formatTimezone(tz) {
  if (!tz) return '—';
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    if (tzPart) {
      // Intl returns "GMT+5:30" or "GMT-8" — convert to "UTC+5:30" or "UTC-8"
      return tzPart.value.replace('GMT', 'UTC');
    }
  } catch {
    // invalid timezone name
  }
  return tz;
}
