#!/usr/bin/env node

/**
 * Fetches place data from Wikidata SPARQL for the underrated travel list.
 * Run: node scripts/fetch-travel-data.mjs
 * Output: src/data/travel-places.json
 */

const WIKIDATA_SPARQL = 'https://query.wikidata.org/sparql';

// All places from the travel list, grouped by region with search hints
const PLACES = [
  // US & Canada
  { name: 'Auburn', state: 'AL', country: 'United States', region: 'US & Canada', search: 'Auburn, Alabama' },
  { name: 'Nelson', state: 'BC', country: 'Canada', region: 'US & Canada', search: 'Nelson, British Columbia' },
  { name: 'Squamish', state: 'BC', country: 'Canada', region: 'US & Canada', search: 'Squamish, British Columbia' },
  { name: 'Tofino', state: 'BC', country: 'Canada', region: 'US & Canada', search: 'Tofino' },
  { name: 'Victoria', state: 'BC', country: 'Canada', region: 'US & Canada', search: 'Victoria, British Columbia' },
  { name: 'Big Sur', state: 'CA', country: 'United States', region: 'US & Canada', search: 'Big Sur' },
  { name: 'Calistoga', state: 'CA', country: 'United States', region: 'US & Canada', search: 'Calistoga, California' },
  { name: 'Carmel', state: 'CA', country: 'United States', region: 'US & Canada', search: 'Carmel-by-the-Sea' },
  { name: 'Encinitas', state: 'CA', country: 'United States', region: 'US & Canada', search: 'Encinitas, California' },
  { name: 'Half Moon Bay', state: 'CA', country: 'United States', region: 'US & Canada', search: 'Half Moon Bay, California' },
  { name: 'Mammoth Lakes', state: 'CA', country: 'United States', region: 'US & Canada', search: 'Mammoth Lakes, California' },
  { name: 'South Pasadena', state: 'CA', country: 'United States', region: 'US & Canada', search: 'South Pasadena, California' },
  { name: 'Crested Butte', state: 'CO', country: 'United States', region: 'US & Canada', search: 'Crested Butte, Colorado' },
  { name: 'Ouray', state: 'CO', country: 'United States', region: 'US & Canada', search: 'Ouray, Colorado' },
  { name: 'Salida', state: 'CO', country: 'United States', region: 'US & Canada', search: 'Salida, Colorado' },
  { name: 'Telluride', state: 'CO', country: 'United States', region: 'US & Canada', search: 'Telluride, Colorado' },
  { name: 'Pāʻia', state: 'HI', country: 'United States', region: 'US & Canada', search: 'Paia, Hawaii' },
  { name: 'Stanley', state: 'ID', country: 'United States', region: 'US & Canada', search: 'Stanley, Idaho' },
  { name: 'Noblesville', state: 'IN', country: 'United States', region: 'US & Canada', search: 'Noblesville, Indiana' },
  { name: 'Portland', state: 'ME', country: 'United States', region: 'US & Canada', search: 'Portland, Maine' },
  { name: 'Traverse City', state: 'MI', country: 'United States', region: 'US & Canada', search: 'Traverse City, Michigan' },
  { name: 'Starkville', state: 'MS', country: 'United States', region: 'US & Canada', search: 'Starkville, Mississippi' },
  { name: 'Bozeman', state: 'MT', country: 'United States', region: 'US & Canada', search: 'Bozeman, Montana' },
  { name: 'Helena', state: 'MT', country: 'United States', region: 'US & Canada', search: 'Helena, Montana' },
  { name: 'Whitefish', state: 'MT', country: 'United States', region: 'US & Canada', search: 'Whitefish, Montana' },
  { name: 'Beaufort', state: 'NC', country: 'United States', region: 'US & Canada', search: 'Beaufort, North Carolina' },
  { name: 'Cary', state: 'NC', country: 'United States', region: 'US & Canada', search: 'Cary, North Carolina' },
  { name: 'Hanover', state: 'NH', country: 'United States', region: 'US & Canada', search: 'Hanover, New Hampshire' },
  { name: 'Taos', state: 'NM', country: 'United States', region: 'US & Canada', search: 'Taos, New Mexico' },
  { name: 'East Aurora', state: 'NY', country: 'United States', region: 'US & Canada', search: 'East Aurora, New York' },
  { name: 'Red Hook', state: 'NY', country: 'United States', region: 'US & Canada', search: 'Red Hook, New York' },
  { name: 'Ashland', state: 'OR', country: 'United States', region: 'US & Canada', search: 'Ashland, Oregon' },
  { name: 'Bend', state: 'OR', country: 'United States', region: 'US & Canada', search: 'Bend, Oregon' },
  { name: 'Charleston', state: 'SC', country: 'United States', region: 'US & Canada', search: 'Charleston, South Carolina' },
  { name: 'Townsend', state: 'TN', country: 'United States', region: 'US & Canada', search: 'Townsend, Tennessee' },
  { name: 'Marfa', state: 'TX', country: 'United States', region: 'US & Canada', search: 'Marfa, Texas' },
  { name: 'Eastsound, Orcas Island', state: 'WA', country: 'United States', region: 'US & Canada', search: 'Eastsound, Washington' },
  { name: 'Leavenworth', state: 'WA', country: 'United States', region: 'US & Canada', search: 'Leavenworth, Washington' },
  { name: 'Lynden', state: 'WA', country: 'United States', region: 'US & Canada', search: 'Lynden, Washington' },
  { name: 'Jackson', state: 'WY', country: 'United States', region: 'US & Canada', search: 'Jackson, Wyoming' },

  // Europe
  { name: 'Zell am See', country: 'Austria', region: 'Europe', search: 'Zell am See' },
  { name: 'Bruges', country: 'Belgium', region: 'Europe', search: 'Bruges' },
  { name: 'Odense', country: 'Denmark', region: 'Europe', search: 'Odense' },
  { name: 'Aix-en-Provence', country: 'France', region: 'Europe', search: 'Aix-en-Provence' },
  { name: 'Metz', country: 'France', region: 'Europe', search: 'Metz' },
  { name: 'Bergamo', country: 'Italy', region: 'Europe', search: 'Bergamo' },
  { name: 'Lucca', country: 'Italy', region: 'Europe', search: 'Lucca' },
  { name: 'Maranello', country: 'Italy', region: 'Europe', search: 'Maranello' },
  { name: 'Merano', country: 'Italy', region: 'Europe', search: 'Merano' },
  { name: 'Modena', country: 'Italy', region: 'Europe', search: 'Modena' },
  { name: 'San Gimignano', country: 'Italy', region: 'Europe', search: 'San Gimignano' },
  { name: 'Tropea', country: 'Italy', region: 'Europe', search: 'Tropea' },
  { name: 'Varenna', country: 'Italy', region: 'Europe', search: 'Varenna' },
  { name: 'Užupis, Vilnius', country: 'Lithuania', region: 'Europe', search: 'Užupis' },
  { name: 'Ålesund', country: 'Norway', region: 'Europe', search: 'Ålesund' },
  { name: 'Aveiro', country: 'Portugal', region: 'Europe', search: 'Aveiro' },
  { name: 'San Sebastián', country: 'Spain', region: 'Europe', search: 'San Sebastián' },
  { name: 'Santander', country: 'Spain', region: 'Europe', search: 'Santander, Spain' },
  { name: 'Santiago de Compostela', country: 'Spain', region: 'Europe', search: 'Santiago de Compostela' },
  { name: 'Lugano', country: 'Switzerland', region: 'Europe', search: 'Lugano' },
  { name: 'Montreux', country: 'Switzerland', region: 'Europe', search: 'Montreux' },
  { name: 'Zermatt', country: 'Switzerland', region: 'Europe', search: 'Zermatt' },

  // Asia Pacific
  { name: 'Cairns', country: 'Australia', region: 'Asia Pacific', search: 'Cairns' },
  { name: 'Perth', country: 'Australia', region: 'Asia Pacific', search: 'Perth' },
  { name: 'Paro', country: 'Bhutan', region: 'Asia Pacific', search: 'Paro, Bhutan' },
  { name: 'Punakha', country: 'Bhutan', region: 'Asia Pacific', search: 'Punakha' },
  { name: 'Kampot', country: 'Cambodia', region: 'Asia Pacific', search: 'Kampot' },
  { name: 'Siem Reap', country: 'Cambodia', region: 'Asia Pacific', search: 'Siem Reap' },
  { name: 'Almora', country: 'India', region: 'Asia Pacific', search: 'Almora' },
  { name: 'Amritsar', country: 'India', region: 'Asia Pacific', search: 'Amritsar' },
  { name: 'Dharamshala', country: 'India', region: 'Asia Pacific', search: 'Dharamshala' },
  { name: 'Fort Kochi', country: 'India', region: 'Asia Pacific', search: 'Fort Kochi' },
  { name: 'McLeodganj', country: 'India', region: 'Asia Pacific', search: 'McLeod Ganj' },
  { name: 'Ubud, Bali', country: 'Indonesia', region: 'Asia Pacific', search: 'Ubud' },
  { name: 'Kanazawa', country: 'Japan', region: 'Asia Pacific', search: 'Kanazawa' },
  { name: 'Koyasan', country: 'Japan', region: 'Asia Pacific', search: 'Kōyasan' },
  { name: 'Nozawa Onsen', country: 'Japan', region: 'Asia Pacific', search: 'Nozawaonsen' },
  { name: 'Takayama', country: 'Japan', region: 'Asia Pacific', search: 'Takayama, Gifu' },
  { name: 'Luang Prabang', country: 'Laos', region: 'Asia Pacific', search: 'Luang Prabang' },
  { name: 'Pokhara', country: 'Nepal', region: 'Asia Pacific', search: 'Pokhara' },
  { name: 'Queenstown', country: 'New Zealand', region: 'Asia Pacific', search: 'Queenstown, New Zealand' },
  { name: 'Raglan', country: 'New Zealand', region: 'Asia Pacific', search: 'Raglan, New Zealand' },
  { name: 'Busan', country: 'South Korea', region: 'Asia Pacific', search: 'Busan' },
  { name: 'Gyeongju', country: 'South Korea', region: 'Asia Pacific', search: 'Gyeongju' },
  { name: 'Jeonju', country: 'South Korea', region: 'Asia Pacific', search: 'Jeonju' },
  { name: 'Ella', country: 'Sri Lanka', region: 'Asia Pacific', search: 'Ella, Sri Lanka' },
  { name: 'Jaffna', country: 'Sri Lanka', region: 'Asia Pacific', search: 'Jaffna' },
  { name: 'Jiufen', country: 'Taiwan', region: 'Asia Pacific', search: 'Jiufen' },
  { name: 'Taitung', country: 'Taiwan', region: 'Asia Pacific', search: 'Taitung City' },
  { name: 'Chiang Khan', country: 'Thailand', region: 'Asia Pacific', search: 'Chiang Khan' },
  { name: 'Pai', country: 'Thailand', region: 'Asia Pacific', search: 'Pai, Thailand' },
  { name: 'Hội An', country: 'Vietnam', region: 'Asia Pacific', search: 'Hội An' },

  // Central & South America
  { name: 'Colonia Suiza, Bariloche', country: 'Argentina', region: 'Central & South America', search: 'Colonia Suiza' },
  { name: 'El Bolsón', country: 'Argentina', region: 'Central & South America', search: 'El Bolsón' },
  { name: 'San Martín de los Andes', country: 'Argentina', region: 'Central & South America', search: 'San Martín de los Andes' },
  { name: 'Tigre Delta', country: 'Argentina', region: 'Central & South America', search: 'Tigre, Buenos Aires' },
  { name: 'Villa La Angostura', country: 'Argentina', region: 'Central & South America', search: 'Villa La Angostura' },
  { name: 'Brasília', country: 'Brazil', region: 'Central & South America', search: 'Brasília' },
  { name: 'Paraty', country: 'Brazil', region: 'Central & South America', search: 'Paraty' },
  { name: 'Cochamó', country: 'Chile', region: 'Central & South America', search: 'Cochamó' },
  { name: 'Frutillar', country: 'Chile', region: 'Central & South America', search: 'Frutillar' },
  { name: 'Pucón', country: 'Chile', region: 'Central & South America', search: 'Pucón' },
  { name: 'Barichara', country: 'Colombia', region: 'Central & South America', search: 'Barichara' },
  { name: 'Jardín', country: 'Colombia', region: 'Central & South America', search: 'Jardín' },
  { name: 'Salento', country: 'Colombia', region: 'Central & South America', search: 'Salento, Quindío' },
  { name: 'Villa de Leyva', country: 'Colombia', region: 'Central & South America', search: 'Villa de Leyva' },
  { name: 'Montezuma', country: 'Costa Rica', region: 'Central & South America', search: 'Montezuma, Costa Rica' },
  { name: 'Santa Teresa', country: 'Costa Rica', region: 'Central & South America', search: 'Santa Teresa, Costa Rica' },
  { name: 'Cuenca', country: 'Ecuador', region: 'Central & South America', search: 'Cuenca, Ecuador' },
  { name: 'Mindo', country: 'Ecuador', region: 'Central & South America', search: 'Mindo' },
  { name: 'Vilcabamba', country: 'Ecuador', region: 'Central & South America', search: 'Vilcabamba' },
  { name: 'Sayulita', country: 'Mexico', region: 'Central & South America', search: 'Sayulita' },
  { name: 'Tepoztlán', country: 'Mexico', region: 'Central & South America', search: 'Tepoztlán' },
  { name: 'Valle de Bravo', country: 'Mexico', region: 'Central & South America', search: 'Valle de Bravo' },
  { name: 'Ollantaytambo', country: 'Peru', region: 'Central & South America', search: 'Ollantaytambo' },
  { name: 'Pisac', country: 'Peru', region: 'Central & South America', search: 'Písac' },
  { name: 'Urubamba', country: 'Peru', region: 'Central & South America', search: 'Urubamba' },
  { name: 'Colonia del Sacramento', country: 'Uruguay', region: 'Central & South America', search: 'Colonia del Sacramento' },

  // Africa
  { name: 'Ouidah', country: 'Benin', region: 'Africa', search: 'Ouidah' },
  { name: 'Lamu', country: 'Kenya', region: 'Africa', search: 'Lamu' },
  { name: 'Nanyuki', country: 'Kenya', region: 'Africa', search: 'Nanyuki' },
  { name: 'Watamu', country: 'Kenya', region: 'Africa', search: 'Watamu' },
  { name: 'Fianarantsoa', country: 'Madagascar', region: 'Africa', search: 'Fianarantsoa' },
  { name: 'Nosy Be', country: 'Madagascar', region: 'Africa', search: 'Nosy Be' },
  { name: 'Asilah', country: 'Morocco', region: 'Africa', search: 'Asilah' },
  { name: 'Chefchaouen', country: 'Morocco', region: 'Africa', search: 'Chefchaouen' },
  { name: 'El Jadida', country: 'Morocco', region: 'Africa', search: 'El Jadida' },
  { name: 'Essaouira', country: 'Morocco', region: 'Africa', search: 'Essaouira' },
  { name: 'Marrakech', country: 'Morocco', region: 'Africa', search: 'Marrakech' },
  { name: 'Taroudant', country: 'Morocco', region: 'Africa', search: 'Taroudant' },
  { name: 'Saint-Louis', country: 'Senegal', region: 'Africa', search: 'Saint-Louis, Senegal' },
  { name: 'Clarens', country: 'South Africa', region: 'Africa', search: 'Clarens, Free State' },
  { name: 'Franschhoek', country: 'South Africa', region: 'Africa', search: 'Franschhoek' },
  { name: 'Hermanus', country: 'South Africa', region: 'Africa', search: 'Hermanus' },
  { name: 'Paternoster', country: 'South Africa', region: 'Africa', search: 'Paternoster, South Africa' },
  { name: 'Prince Albert', country: 'South Africa', region: 'Africa', search: 'Prince Albert, Western Cape' },
  { name: 'Arusha', country: 'Tanzania', region: 'Africa', search: 'Arusha' },
  { name: 'Moshi', country: 'Tanzania', region: 'Africa', search: 'Moshi, Tanzania' },
  { name: 'Stone Town, Zanzibar', country: 'Tanzania', region: 'Africa', search: 'Stone Town' },
];

async function sparqlQuery(query) {
  const url = `${WIKIDATA_SPARQL}?query=${encodeURIComponent(query)}&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TravelListBot/1.0 (natemodi.com)' }
  });
  if (!res.ok) throw new Error(`SPARQL query failed: ${res.status}`);
  return res.json();
}

async function searchWikipedia(searchTerm) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&format=json&srlimit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TravelListBot/1.0 (natemodi.com)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.query?.search?.[0]?.title || null;
}

async function getWikidataFromWikipedia(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageprops&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'TravelListBot/1.0 (natemodi.com)' }
  });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page?.pageprops?.wikibase_item || null;
}

async function getWikidataDetails(qid) {
  const query = `
    SELECT ?coord ?population ?elevation ?image ?timezone ?timezoneLabel ?article WHERE {
      OPTIONAL { wd:${qid} wdt:P625 ?coord . }
      OPTIONAL { wd:${qid} wdt:P1082 ?population . }
      OPTIONAL { wd:${qid} wdt:P2044 ?elevation . }
      OPTIONAL { wd:${qid} wdt:P18 ?image . }
      OPTIONAL { wd:${qid} wdt:P421 ?timezone . }
      OPTIONAL {
        ?article schema:about wd:${qid} ;
                 schema:isPartOf <https://en.wikipedia.org/> .
      }
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
    }
    LIMIT 1
  `;
  try {
    const result = await sparqlQuery(query);
    const binding = result.results?.bindings?.[0];
    if (!binding) return null;

    let lat = null, lng = null;
    if (binding.coord?.value) {
      const match = binding.coord.value.match(/Point\(([-\d.]+)\s+([-\d.]+)\)/);
      if (match) {
        lng = parseFloat(match[1]);
        lat = parseFloat(match[2]);
      }
    }

    let imageUrl = null;
    if (binding.image?.value) {
      const filename = decodeURIComponent(binding.image.value.split('/Special:FilePath/')[1] || '');
      if (filename) {
        imageUrl = `https://commons.wikimedia.org/w/thumb.php?width=400&f=${encodeURIComponent(filename)}`;
      }
    }

    let wikiUrl = null;
    if (binding.article?.value) {
      wikiUrl = binding.article.value;
    }

    return {
      lat,
      lng,
      population: binding.population?.value ? parseInt(binding.population.value) : null,
      elevation: binding.elevation?.value ? Math.round(parseFloat(binding.elevation.value)) : null,
      imageUrl,
      timezone: binding.timezoneLabel?.value || null,
      wikiUrl,
    };
  } catch (e) {
    console.error(`  SPARQL error for ${qid}: ${e.message}`);
    return null;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPlaceData(place) {
  // Step 1: Search Wikipedia for the page title
  const wikiTitle = await searchWikipedia(place.search);
  if (!wikiTitle) {
    console.warn(`  No Wikipedia article for: ${place.search}`);
    return null;
  }

  // Step 2: Get Wikidata QID from Wikipedia page
  const qid = await getWikidataFromWikipedia(wikiTitle);
  if (!qid) {
    console.warn(`  No Wikidata item for: ${wikiTitle}`);
    return null;
  }

  // Step 3: Get details from Wikidata
  const details = await getWikidataDetails(qid);
  if (!details) {
    console.warn(`  No Wikidata details for: ${qid}`);
    return null;
  }

  // Construct Wikipedia URL if not from SPARQL
  if (!details.wikiUrl) {
    details.wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle.replace(/ /g, '_'))}`;
  }

  return {
    id: place.search.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: place.name,
    displayName: place.state ? `${place.name}, ${place.state}` : place.name,
    region: place.region,
    country: place.country,
    state: place.state || null,
    lat: details.lat,
    lng: details.lng,
    population: details.population,
    elevation: details.elevation,
    timezone: details.timezone,
    wikiUrl: details.wikiUrl,
    imageUrl: details.imageUrl,
  };
}

async function main() {
  console.log(`Fetching data for ${PLACES.length} places...\n`);

  const results = [];
  let success = 0;
  let failed = 0;

  for (let i = 0; i < PLACES.length; i++) {
    const place = PLACES[i];
    const progress = `[${i + 1}/${PLACES.length}]`;
    process.stdout.write(`${progress} ${place.search}... `);

    try {
      const data = await fetchPlaceData(place);
      if (data && data.lat !== null) {
        results.push(data);
        console.log(`OK (${data.lat?.toFixed(2)}, ${data.lng?.toFixed(2)})`);
        success++;
      } else {
        // Add with minimal data
        results.push({
          id: place.search.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: place.name,
          displayName: place.state ? `${place.name}, ${place.state}` : place.name,
          region: place.region,
          country: place.country,
          state: place.state || null,
          lat: null,
          lng: null,
          population: null,
          elevation: null,
          timezone: null,
          wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(place.search.replace(/ /g, '_'))}`,
          imageUrl: null,
        });
        console.log('PARTIAL (no coords)');
        failed++;
      }
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      results.push({
        id: place.search.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: place.name,
        displayName: place.state ? `${place.name}, ${place.state}` : place.name,
        region: place.region,
        country: place.country,
        state: place.state || null,
        lat: null,
        lng: null,
        population: null,
        elevation: null,
        timezone: null,
        wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(place.search.replace(/ /g, '_'))}`,
        imageUrl: null,
      });
      failed++;
    }

    // Rate limiting: 500ms between requests to be respectful to Wikidata
    await sleep(500);
  }

  // Write results
  const outputPath = new URL('../src/data/travel-places.json', import.meta.url);
  const fs = await import('fs');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nDone! ${success} complete, ${failed} partial/failed.`);
  console.log(`Output: src/data/travel-places.json`);
}

main().catch(console.error);
