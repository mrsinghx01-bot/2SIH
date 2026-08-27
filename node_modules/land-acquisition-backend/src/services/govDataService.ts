/**
 * Government Data Service
 * Fetches and caches real data from:
 *   - data.gov.in Open Government Data API (API key required)
 *   - World Bank API (free, no key)
 *   - Static authoritative constants from real-gov-data.ts
 */

import https from 'https';
import {
  REAL_STATES_DATA,
  REAL_DISTRICTS,
  NATIONAL_KPIS,
  DILRMP_NATIONAL_SUMMARY,
  RFCTLARR_PROVISIONS,
  DATA_GOV_IN_CONFIG,
  StateGovData
} from '../data/real-gov-data';

const API_KEY = process.env.DATA_GOV_IN_API_KEY || '';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

// In-memory cache
const cache: Record<string, CacheEntry<unknown>> = {};

function isCacheValid(key: string): boolean {
  const entry = cache[key];
  if (!entry) return false;
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

function fetchJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data) as T);
        } catch {
          reject(new Error('Invalid JSON response'));
        }
      });
    }).on('error', reject).on('timeout', () => reject(new Error('Request timeout')));
  });
}

// ─────────────────────────────────────────────────────────────
//  PUBLIC SERVICE METHODS
// ─────────────────────────────────────────────────────────────

/**
 * Get all 36 states/UTs with real government data
 * Returns static authoritative data (Census 2011, RBI, DILRMP)
 */
export function getAllStatesData(): StateGovData[] {
  return REAL_STATES_DATA;
}

/**
 * Get a single state by its standardised ID
 */
export function getStateData(stateId: string): StateGovData | undefined {
  return REAL_STATES_DATA.find(s => s.id === stateId);
}

/**
 * Get state by state code (e.g. 'UP', 'MH')
 */
export function getStateByCode(code: string): StateGovData | undefined {
  return REAL_STATES_DATA.find(s => s.code === code.toUpperCase());
}

/**
 * Get real district names for a given state code
 * Falls back to generated names if not in REAL_DISTRICTS
 */
export function getDistrictsForState(stateCode: string): string[] {
  const key = stateCode.toUpperCase();
  if (REAL_DISTRICTS[key]) {
    return REAL_DISTRICTS[key];
  }
  // For states not in the curated list, return empty (will use seed data)
  return [];
}

/**
 * National KPIs summary from real government publications
 */
export function getNationalKPIs() {
  return {
    ...NATIONAL_KPIS,
    dilrmp: DILRMP_NATIONAL_SUMMARY,
    rfctlarr: RFCTLARR_PROVISIONS,
  };
}

/**
 * Get district Census data from data.gov.in API (live)
 * Resource: b1f38af9 — Karnataka district census 2011
 * Falls back to static data if API unavailable
 */
export async function fetchDistrictCensusData(resourceId: string, limit = 100): Promise<unknown[]> {
  const cacheKey = `datagov_${resourceId}`;
  if (isCacheValid(cacheKey)) {
    return (cache[cacheKey].data as unknown[]);
  }

  if (!API_KEY) {
    console.warn('[GovDataService] DATA_GOV_IN_API_KEY not set — using static data');
    return [];
  }

  try {
    const url = `${DATA_GOV_IN_CONFIG.baseUrl}/${resourceId}?api-key=${API_KEY}&format=json&limit=${limit}`;
    const response = await fetchJson<{ records: unknown[]; total: number; title: string }>(url);
    const records = response.records || [];
    cache[cacheKey] = { data: records, fetchedAt: Date.now() };
    console.log(`[GovDataService] Fetched ${records.length} records from data.gov.in: ${response.title}`);
    return records;
  } catch (err) {
    console.error('[GovDataService] data.gov.in API error:', err);
    return [];
  }
}

/**
 * Fetch India national statistics from World Bank API (no key needed)
 */
export async function fetchWorldBankIndiaData(): Promise<{
  population: number | null;
  gdpCurrentUsd: number | null;
  gdpGrowthRate: number | null;
  urbanPopulationPct: number | null;
}> {
  const cacheKey = 'worldbank_india';
  if (isCacheValid(cacheKey)) {
    return cache[cacheKey].data as ReturnType<typeof fetchWorldBankIndiaData> extends Promise<infer T> ? T : never;
  }

  try {
    const indicators = [
      { key: 'population', code: 'SP.POP.TOTL' },
      { key: 'gdpCurrentUsd', code: 'NY.GDP.MKTP.CD' },
      { key: 'gdpGrowthRate', code: 'NY.GDP.MKTP.KD.ZG' },
      { key: 'urbanPopulationPct', code: 'SP.URB.TOTL.IN.ZS' }
    ];

    const results: Record<string, number | null> = {};
    await Promise.all(
      indicators.map(async ({ key, code }) => {
        try {
          const url = `https://api.worldbank.org/v2/country/IN/indicator/${code}?format=json&mrv=1`;
          const data = await fetchJson<[unknown, Array<{ value: number | null }>]>(url);
          results[key] = data[1]?.[0]?.value ?? null;
        } catch {
          results[key] = null;
        }
      })
    );

    const output = {
      population: results['population'],
      gdpCurrentUsd: results['gdpCurrentUsd'],
      gdpGrowthRate: results['gdpGrowthRate'],
      urbanPopulationPct: results['urbanPopulationPct'],
    };

    cache[cacheKey] = { data: output, fetchedAt: Date.now() };
    return output;
  } catch (err) {
    console.error('[GovDataService] World Bank API error:', err);
    return { population: null, gdpCurrentUsd: null, gdpGrowthRate: null, urbanPopulationPct: null };
  }
}

/**
 * Compute DILRMP national aggregate from state-level data
 */
export function computeNationalDilrmpAggregate() {
  const states = REAL_STATES_DATA;
  const avgRor = states.reduce((s, st) => s + st.dilrmp.rorComputerizedPct, 0) / states.length;
  const avgCadastral = states.reduce((s, st) => s + st.dilrmp.cadastralMapDigitizedPct, 0) / states.length;
  const ulpinCount = states.filter(st => st.dilrmp.ulpinImplemented).length;
  const avgSro = states.reduce((s, st) => s + st.dilrmp.sroComputerizedPct, 0) / states.length;

  return {
    avgRorComputerizedPct: Math.round(avgRor),
    avgCadastralMapDigitizedPct: Math.round(avgCadastral),
    ulpinImplementedCount: ulpinCount,
    avgSroComputerizedPct: Math.round(avgSro),
    totalStates: states.length,
  };
}

export {
  REAL_STATES_DATA,
  REAL_DISTRICTS,
  NATIONAL_KPIS,
  DILRMP_NATIONAL_SUMMARY,
  RFCTLARR_PROVISIONS,
};
