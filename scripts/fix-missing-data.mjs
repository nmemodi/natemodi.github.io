#!/usr/bin/env node

/**
 * Fixes missing timezone data in travel-places.json by querying open-meteo API.
 * open-meteo returns IANA timezone (e.g., "America/New_York") for any lat/lng.
 * Also patches missing population data from manual research.
 * Also normalizes inconsistent timezone formats to IANA names.
 *
 * Run: node scripts/fix-missing-data.mjs
 */

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, '..', 'src', 'data', 'travel-places.json');

// Manual population data for the 15 places missing it
const populationPatches = {
  'nelson-british-columbia': 11198,  // 2021 Canadian Census
  'tofino': 2516,                    // 2021 Canadian Census
  'big-sur': 1741,                   // 2020 US Census (CCD)
  'eastsound-washington': 4372,      // 2020 US Census CDP
  'u-upis': 7000,                    // neighborhood estimate
  'punakha': 6262,                   // city proper
  'fort-kochi': 21221,               // Indian census locality
  'mcleod-ganj': 11000,              // approximate
  'ubud': 74800,                     // 2020 Indonesian Census (district)
  'k-yasan': 2812,                   // 2021 estimate (Koya town)
  'ella-sri-lanka': 44763,           // 2012 Divisional Secretariat
  'jiufen': 1600,                    // 2024 permanent residents
  'colonia-suiza': 150,              // 2010 Argentine Census
  'tigre-buenos-aires': 446949,      // 2022 Argentine Census (partido)
  'cocham-': 4363,                   // 2002 Chilean Census (commune)
};

async function fetchTimezone(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.timezone; // IANA timezone like "America/New_York"
}

function isIANATimezone(tz) {
  if (!tz) return false;
  // IANA timezones look like "Area/City" e.g. "America/New_York"
  return /^[A-Z][a-z]+\/[A-Z]/.test(tz);
}

async function main() {
  const places = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // 1. Patch missing populations
  let popPatched = 0;
  for (const place of places) {
    if (place.population == null && populationPatches[place.id] != null) {
      place.population = populationPatches[place.id];
      popPatched++;
    }
  }
  console.log(`Patched ${popPatched} missing populations`);

  // 2. Fix timezones — fetch for any place with null or non-IANA timezone
  const needTimezone = places.filter(p => !isIANATimezone(p.timezone));
  console.log(`${needTimezone.length} places need timezone fix`);

  let tzFixed = 0;
  let tzErrors = 0;
  for (let i = 0; i < needTimezone.length; i++) {
    const place = needTimezone[i];
    try {
      const tz = await fetchTimezone(place.lat, place.lng);
      if (tz) {
        place.timezone = tz;
        tzFixed++;
      }
    } catch (e) {
      console.error(`  Failed: ${place.displayName}: ${e.message}`);
      tzErrors++;
    }
    // Rate limit: 200ms between requests
    if (i < needTimezone.length - 1) {
      await new Promise(r => setTimeout(r, 200));
    }
    if ((i + 1) % 20 === 0) {
      console.log(`  Progress: ${i + 1}/${needTimezone.length}`);
    }
  }
  console.log(`Fixed ${tzFixed} timezones (${tzErrors} errors)`);

  // 3. Remove imageUrl field from all places (photos being removed)
  for (const place of places) {
    delete place.imageUrl;
  }
  console.log('Removed imageUrl from all places');

  // Write back
  fs.writeFileSync(dataPath, JSON.stringify(places, null, 2) + '\n');
  console.log('Saved updated travel-places.json');

  // Summary
  const nullPop = places.filter(p => p.population == null).length;
  const nullTz = places.filter(p => p.timezone == null).length;
  const nullElev = places.filter(p => p.elevation == null).length;
  console.log(`\nRemaining nulls: population=${nullPop}, timezone=${nullTz}, elevation=${nullElev}`);
}

main().catch(console.error);
