import { describe, it, expect } from 'vitest';
import { formatPopulation, formatElevation, getWeatherIconName, formatTimezone, filterVisibleCities } from './travel-formatters.js';

describe('formatPopulation', () => {
  it('returns dash for null', () => {
    expect(formatPopulation(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(formatPopulation(undefined)).toBe('—');
  });

  it('formats millions with one decimal', () => {
    expect(formatPopulation(1500000)).toBe('1.5M');
    expect(formatPopulation(1000000)).toBe('1.0M');
    expect(formatPopulation(12345678)).toBe('12.3M');
  });

  it('formats thousands with K suffix', () => {
    expect(formatPopulation(76143)).toBe('76K');
    expect(formatPopulation(1000)).toBe('1K');
    expect(formatPopulation(999999)).toBe('1,000K');
  });

  it('formats small numbers as-is', () => {
    expect(formatPopulation(150)).toBe('150');
    expect(formatPopulation(999)).toBe('999');
    expect(formatPopulation(0)).toBe('0');
  });
});

describe('formatElevation', () => {
  it('returns dash for null', () => {
    expect(formatElevation(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(formatElevation(undefined)).toBe('—');
  });

  it('converts meters to feet', () => {
    expect(formatElevation(214)).toBe('214m / 702ft');
    expect(formatElevation(0)).toBe('0m / 0ft');
  });

  it('handles high elevations', () => {
    expect(formatElevation(2000)).toBe('2,000m / 6,562ft');
  });

  it('handles negative elevations (below sea level)', () => {
    expect(formatElevation(-30)).toBe('-30m / -98ft');
  });
});

describe('getWeatherIconName', () => {
  it('returns sun for clear sky (code 0)', () => {
    expect(getWeatherIconName(0)).toBe('sun');
  });

  it('returns cloud-sun for partly cloudy (codes 1-3)', () => {
    expect(getWeatherIconName(1)).toBe('cloud-sun');
    expect(getWeatherIconName(2)).toBe('cloud-sun');
    expect(getWeatherIconName(3)).toBe('cloud-sun');
  });

  it('returns cloud for overcast/fog (codes 4-48)', () => {
    expect(getWeatherIconName(4)).toBe('cloud');
    expect(getWeatherIconName(45)).toBe('cloud');
    expect(getWeatherIconName(48)).toBe('cloud');
  });

  it('returns rain for drizzle/rain (codes 49-67)', () => {
    expect(getWeatherIconName(49)).toBe('rain');
    expect(getWeatherIconName(61)).toBe('rain');
    expect(getWeatherIconName(67)).toBe('rain');
  });

  it('returns snow for snow/sleet (codes 68-86)', () => {
    expect(getWeatherIconName(68)).toBe('snow');
    expect(getWeatherIconName(77)).toBe('snow');
    expect(getWeatherIconName(86)).toBe('snow');
  });

  it('returns storm for thunderstorm (codes 95+)', () => {
    expect(getWeatherIconName(95)).toBe('storm');
    expect(getWeatherIconName(96)).toBe('storm');
    expect(getWeatherIconName(99)).toBe('storm');
  });

  it('returns unknown for codes in the gap (87-94)', () => {
    expect(getWeatherIconName(87)).toBe('unknown');
    expect(getWeatherIconName(94)).toBe('unknown');
  });
});

describe('formatTimezone', () => {
  it('returns dash for null', () => {
    expect(formatTimezone(null)).toBe('—');
  });

  it('returns dash for undefined', () => {
    expect(formatTimezone(undefined)).toBe('—');
  });

  it('returns dash for empty string', () => {
    expect(formatTimezone('')).toBe('—');
  });

  it('converts IANA timezone to UTC offset', () => {
    const result = formatTimezone('America/New_York');
    expect(result).toMatch(/^UTC[+-]\d/);
  });

  it('handles UTC timezone', () => {
    const result = formatTimezone('UTC');
    expect(result).toBe('UTC');
  });

  it('returns the input for invalid timezone names', () => {
    expect(formatTimezone('Not/A/Timezone')).toBe('Not/A/Timezone');
  });
});

describe('filterVisibleCities', () => {
  // Test cities spread around Auburn, AL (lat: 32.6, lng: -85.5)
  const cities = [
    { name: 'Atlanta', lat: 33.7, lng: -84.4 },       // ~1.5° away — visible
    { name: 'Birmingham', lat: 33.5, lng: -86.8 },     // ~1.5° away — visible
    { name: 'Montgomery', lat: 32.4, lng: -86.3 },     // ~0.8° away — too close
    { name: 'Nashville', lat: 36.2, lng: -86.8 },      // ~4° away — visible
    { name: 'New York', lat: 40.7, lng: -74.0 },       // far away — outside viewBox
    { name: 'London', lat: 51.5, lng: -0.1 },          // very far — outside viewBox
    { name: 'Miami', lat: 25.8, lng: -80.2 },          // ~7° lat away — visible
    { name: 'Chicago', lat: 41.9, lng: -87.6 },        // ~9° lat away — visible
    { name: 'Dallas', lat: 32.8, lng: -96.8 },         // ~11° lng away — visible
    { name: 'Denver', lat: 39.7, lng: -105.0 },        // ~20° lng away — at edge
    { name: 'LA', lat: 34.1, lng: -118.2 },            // too far right — outside
    { name: 'Jacksonville', lat: 30.3, lng: -81.7 },   // visible
    { name: 'Memphis', lat: 35.1, lng: -90.0 },        // visible
  ];

  const lat = 32.6;
  const lng = -85.5;

  it('returns cities within the viewBox', () => {
    const result = filterVisibleCities(cities, lat, lng);
    const names = result.map(c => c.name);
    expect(names).toContain('Atlanta');
    expect(names).toContain('Birmingham');
    expect(names).toContain('Nashville');
  });

  it('excludes cities outside the viewBox', () => {
    const result = filterVisibleCities(cities, lat, lng);
    const names = result.map(c => c.name);
    expect(names).not.toContain('London');
    expect(names).not.toContain('LA');
  });

  it('excludes cities within 1° of the marker', () => {
    const result = filterVisibleCities(cities, lat, lng);
    const names = result.map(c => c.name);
    expect(names).not.toContain('Montgomery');
  });

  it('caps results at maxCities (default 10)', () => {
    const result = filterVisibleCities(cities, lat, lng);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  it('respects custom maxCities parameter', () => {
    const result = filterVisibleCities(cities, lat, lng, 20, 3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it('returns empty array for null/undefined inputs', () => {
    expect(filterVisibleCities(null, lat, lng)).toEqual([]);
    expect(filterVisibleCities(undefined, lat, lng)).toEqual([]);
    expect(filterVisibleCities(cities, null, lng)).toEqual([]);
    expect(filterVisibleCities(cities, lat, null)).toEqual([]);
  });

  it('returns empty array for empty cities array', () => {
    expect(filterVisibleCities([], lat, lng)).toEqual([]);
  });

  it('works with a small span (zoomed in)', () => {
    // Small span=5 means viewBox lat range: marker ± (span/2 + margin) = ±4.5°
    // lng range: marker ± (span + margin) = ±7°
    const result = filterVisibleCities(cities, lat, lng, 5);
    const names = result.map(c => c.name);
    expect(names).toContain('Atlanta');       // ~1.5° away — in range
    expect(names).toContain('Birmingham');    // ~1.5° away — in range
    expect(names).toContain('Nashville');     // 3.6° lat away — within 4.5° range
    expect(names).not.toContain('Miami');     // 6.8° lat away — outside 4.5° range
    expect(names).not.toContain('Chicago');   // 9.3° lat away — outside
  });

  it('includes city exactly at the viewBox boundary', () => {
    // Create a city exactly at the boundary + margin
    const edgeCity = [{ name: 'Edge', lat: lat + 10 + 2, lng: lng }]; // at span/2 + margin
    const result = filterVisibleCities(edgeCity, lat, lng);
    expect(result.length).toBe(1);
  });
});
