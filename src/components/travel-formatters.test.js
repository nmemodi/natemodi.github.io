import { describe, it, expect } from 'vitest';
import { formatPopulation, formatElevation, getWeatherIconName, formatTimezone } from './travel-formatters.js';

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
