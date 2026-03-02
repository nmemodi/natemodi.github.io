#!/usr/bin/env node

/**
 * Patches missing data in travel-places.json for places the Wikidata script couldn't find.
 * Uses known coordinates and Wikipedia URLs.
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'src', 'data', 'travel-places.json');

// Manual data for places that failed Wikidata lookup
const PATCHES = {
  'aveiro': { lat: 40.64, lng: -8.65, population: 78450, elevation: 8, wikiUrl: 'https://en.wikipedia.org/wiki/Aveiro,_Portugal', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Aveiro_March_2012-15a.jpg' },
  'frutillar': { lat: -41.13, lng: -73.06, population: 16275, elevation: 72, wikiUrl: 'https://en.wikipedia.org/wiki/Frutillar' },
  'puc-n': { lat: -39.28, lng: -71.98, population: 28000, elevation: 227, wikiUrl: 'https://en.wikipedia.org/wiki/Puc%C3%B3n', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Pucon_y_volcan_Villarrica.jpg' },
  'barichara': { lat: 6.63, lng: -73.22, population: 7651, elevation: 1336, wikiUrl: 'https://en.wikipedia.org/wiki/Barichara', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Barichara_Streets.jpg' },
  'jard-n': { lat: 5.60, lng: -75.82, population: 18403, elevation: 1750, wikiUrl: 'https://en.wikipedia.org/wiki/Jard%C3%ADn' },
  'salento--quind-o': { lat: 4.64, lng: -75.57, population: 7001, elevation: 1895, wikiUrl: 'https://en.wikipedia.org/wiki/Salento,_Quind%C3%ADo' },
  'villa-de-leyva': { lat: 5.63, lng: -73.52, population: 16984, elevation: 2149, wikiUrl: 'https://en.wikipedia.org/wiki/Villa_de_Leyva', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Villa_de_Leyva_Square.JPG' },
  'montezuma--costa-rica': { lat: 9.65, lng: -85.07, population: 500, elevation: 10, wikiUrl: 'https://en.wikipedia.org/wiki/Montezuma,_Costa_Rica' },
  'santa-teresa--costa-rica': { lat: 9.64, lng: -85.17, population: 1500, elevation: 15, wikiUrl: 'https://en.wikipedia.org/wiki/Santa_Teresa,_Costa_Rica' },
  'cuenca--ecuador': { lat: -2.90, lng: -79.00, population: 603269, elevation: 2560, wikiUrl: 'https://en.wikipedia.org/wiki/Cuenca,_Ecuador', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Cuenca_de_los_Andes.jpg' },
  'mindo': { lat: -0.05, lng: -78.78, population: 3842, elevation: 1250, wikiUrl: 'https://en.wikipedia.org/wiki/Mindo,_Ecuador' },
  'vilcabamba': { lat: -4.26, lng: -79.22, population: 4600, elevation: 1500, wikiUrl: 'https://en.wikipedia.org/wiki/Vilcabamba,_Ecuador' },
  'sayulita': { lat: 20.87, lng: -105.44, population: 4350, elevation: 10, wikiUrl: 'https://en.wikipedia.org/wiki/Sayulita' },
  'tepoztl-n': { lat: 18.98, lng: -99.10, population: 14130, elevation: 1701, wikiUrl: 'https://en.wikipedia.org/wiki/Tepoztl%C3%A1n', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Exconvento-de-tepoz.jpg' },
  'valle-de-bravo': { lat: 19.19, lng: -100.13, population: 61599, elevation: 1830, wikiUrl: 'https://en.wikipedia.org/wiki/Valle_de_Bravo' },
  'ollantaytambo': { lat: -13.26, lng: -72.27, population: 11400, elevation: 2792, wikiUrl: 'https://en.wikipedia.org/wiki/Ollantaytambo', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Ollantaytambo_ruins.jpg' },
  'p-sac': { lat: -13.42, lng: -71.85, population: 10000, elevation: 2972, wikiUrl: 'https://en.wikipedia.org/wiki/P%C3%ADsac' },
  'urubamba': { lat: -13.31, lng: -72.12, population: 19810, elevation: 2871, wikiUrl: 'https://en.wikipedia.org/wiki/Urubamba' },
  'colonia-del-sacramento': { lat: -34.47, lng: -57.84, population: 26231, elevation: 27, wikiUrl: 'https://en.wikipedia.org/wiki/Colonia_del_Sacramento', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Colonia_del_Sacramento_quarter.jpg' },
  'ouidah': { lat: 6.37, lng: 2.09, population: 163753, elevation: 14, wikiUrl: 'https://en.wikipedia.org/wiki/Ouidah' },
  'lamu': { lat: -2.27, lng: 40.90, population: 24318, elevation: 5, wikiUrl: 'https://en.wikipedia.org/wiki/Lamu', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Lamu_Town_roofscape.jpg' },
  'nanyuki': { lat: 0.01, lng: 37.07, population: 56005, elevation: 1947, wikiUrl: 'https://en.wikipedia.org/wiki/Nanyuki' },
  'watamu': { lat: -3.35, lng: 40.02, population: 7500, elevation: 15, wikiUrl: 'https://en.wikipedia.org/wiki/Watamu' },
  'fianarantsoa': { lat: -21.44, lng: 47.09, population: 195681, elevation: 1200, wikiUrl: 'https://en.wikipedia.org/wiki/Fianarantsoa' },
  'nosy-be': { lat: -13.33, lng: 48.27, population: 73010, elevation: 50, wikiUrl: 'https://en.wikipedia.org/wiki/Nosy_Be' },
  'asilah': { lat: 35.47, lng: -6.03, population: 31147, elevation: 21, wikiUrl: 'https://en.wikipedia.org/wiki/Asilah' },
  'chefchaouen': { lat: 35.17, lng: -5.27, population: 42786, elevation: 564, wikiUrl: 'https://en.wikipedia.org/wiki/Chefchaouen', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Chefchaouen2.JPG' },
  'el-jadida': { lat: 33.26, lng: -8.50, population: 194934, elevation: 18, wikiUrl: 'https://en.wikipedia.org/wiki/El_Jadida' },
  'essaouira': { lat: 31.51, lng: -9.77, population: 77966, elevation: 12, wikiUrl: 'https://en.wikipedia.org/wiki/Essaouira', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Essaouira_remparts.jpg' },
  'marrakech': { lat: 31.63, lng: -8.00, population: 928850, elevation: 466, wikiUrl: 'https://en.wikipedia.org/wiki/Marrakesh', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Jemaa_el-Fnaa.jpg' },
  'taroudant': { lat: 30.47, lng: -8.88, population: 80149, elevation: 240, wikiUrl: 'https://en.wikipedia.org/wiki/Taroudant' },
  'saint-louis--senegal': { lat: 16.02, lng: -16.49, population: 209752, elevation: 4, wikiUrl: 'https://en.wikipedia.org/wiki/Saint-Louis,_Senegal', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Saint-Louis_du_S%C3%A9n%C3%A9gal.jpg' },
  'clarens--free-state': { lat: -28.52, lng: 28.42, population: 6200, elevation: 1840, wikiUrl: 'https://en.wikipedia.org/wiki/Clarens,_Free_State' },
  'franschhoek': { lat: -33.91, lng: 19.12, population: 16749, elevation: 290, wikiUrl: 'https://en.wikipedia.org/wiki/Franschhoek' },
  'hermanus': { lat: -34.42, lng: 19.25, population: 39051, elevation: 15, wikiUrl: 'https://en.wikipedia.org/wiki/Hermanus' },
  'paternoster--south-africa': { lat: -32.81, lng: 17.89, population: 2500, elevation: 10, wikiUrl: 'https://en.wikipedia.org/wiki/Paternoster,_South_Africa' },
  'prince-albert--western-cape': { lat: -33.23, lng: 22.03, population: 6827, elevation: 690, wikiUrl: 'https://en.wikipedia.org/wiki/Prince_Albert,_Western_Cape' },
  'arusha': { lat: -3.37, lng: 36.68, population: 617631, elevation: 1387, wikiUrl: 'https://en.wikipedia.org/wiki/Arusha', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Arusha_center.jpg' },
  'moshi--tanzania': { lat: -3.34, lng: 37.34, population: 184292, elevation: 831, wikiUrl: 'https://en.wikipedia.org/wiki/Moshi,_Tanzania' },
  'stone-town': { lat: -6.16, lng: 39.19, population: 16000, elevation: 10, wikiUrl: 'https://en.wikipedia.org/wiki/Stone_Town', imageUrl: 'https://commons.wikimedia.org/w/thumb.php?width=400&f=Stone_Town_of_Zanzibar-107866.jpg' },
};

const data = JSON.parse(readFileSync(dataPath, 'utf-8'));

let patched = 0;
for (const place of data) {
  if (place.lat !== null) continue; // already has data

  const patch = PATCHES[place.id];
  if (patch) {
    Object.assign(place, patch);
    patched++;
    console.log(`Patched: ${place.displayName} (${patch.lat}, ${patch.lng})`);
  } else {
    console.warn(`No patch for: ${place.displayName} (id: ${place.id})`);
  }
}

writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`\nPatched ${patched} places.`);
