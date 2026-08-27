"use strict";
/**
 * Government Data Service
 * Fetches and caches real data from:
 *   - data.gov.in Open Government Data API (API key required)
 *   - World Bank API (free, no key)
 *   - Static authoritative constants from real-gov-data.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RFCTLARR_PROVISIONS = exports.DILRMP_NATIONAL_SUMMARY = exports.NATIONAL_KPIS = exports.REAL_DISTRICTS = exports.REAL_STATES_DATA = void 0;
exports.getAllStatesData = getAllStatesData;
exports.getStateData = getStateData;
exports.getStateByCode = getStateByCode;
exports.getDistrictsForState = getDistrictsForState;
exports.getNationalKPIs = getNationalKPIs;
exports.fetchDistrictCensusData = fetchDistrictCensusData;
exports.fetchWorldBankIndiaData = fetchWorldBankIndiaData;
exports.computeNationalDilrmpAggregate = computeNationalDilrmpAggregate;
const https_1 = __importDefault(require("https"));
const real_gov_data_1 = require("../data/real-gov-data");
Object.defineProperty(exports, "REAL_STATES_DATA", { enumerable: true, get: function () { return real_gov_data_1.REAL_STATES_DATA; } });
Object.defineProperty(exports, "REAL_DISTRICTS", { enumerable: true, get: function () { return real_gov_data_1.REAL_DISTRICTS; } });
Object.defineProperty(exports, "NATIONAL_KPIS", { enumerable: true, get: function () { return real_gov_data_1.NATIONAL_KPIS; } });
Object.defineProperty(exports, "DILRMP_NATIONAL_SUMMARY", { enumerable: true, get: function () { return real_gov_data_1.DILRMP_NATIONAL_SUMMARY; } });
Object.defineProperty(exports, "RFCTLARR_PROVISIONS", { enumerable: true, get: function () { return real_gov_data_1.RFCTLARR_PROVISIONS; } });
const API_KEY = process.env.DATA_GOV_IN_API_KEY || '';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
// In-memory cache
const cache = {};
function isCacheValid(key) {
    const entry = cache[key];
    if (!entry)
        return false;
    return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https_1.default.get(url, { timeout: 8000 }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                }
                catch {
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
function getAllStatesData() {
    return real_gov_data_1.REAL_STATES_DATA;
}
/**
 * Get a single state by its standardised ID
 */
function getStateData(stateId) {
    return real_gov_data_1.REAL_STATES_DATA.find(s => s.id === stateId);
}
/**
 * Get state by state code (e.g. 'UP', 'MH')
 */
function getStateByCode(code) {
    return real_gov_data_1.REAL_STATES_DATA.find(s => s.code === code.toUpperCase());
}
/**
 * Get real district names for a given state code
 * Falls back to generated names if not in REAL_DISTRICTS
 */
function getDistrictsForState(stateCode) {
    const key = stateCode.toUpperCase();
    if (real_gov_data_1.REAL_DISTRICTS[key]) {
        return real_gov_data_1.REAL_DISTRICTS[key];
    }
    // For states not in the curated list, return empty (will use seed data)
    return [];
}
/**
 * National KPIs summary from real government publications
 */
function getNationalKPIs() {
    return {
        ...real_gov_data_1.NATIONAL_KPIS,
        dilrmp: real_gov_data_1.DILRMP_NATIONAL_SUMMARY,
        rfctlarr: real_gov_data_1.RFCTLARR_PROVISIONS,
    };
}
/**
 * Get district Census data from data.gov.in API (live)
 * Resource: b1f38af9 — Karnataka district census 2011
 * Falls back to static data if API unavailable
 */
async function fetchDistrictCensusData(resourceId, limit = 100) {
    const cacheKey = `datagov_${resourceId}`;
    if (isCacheValid(cacheKey)) {
        return cache[cacheKey].data;
    }
    if (!API_KEY) {
        console.warn('[GovDataService] DATA_GOV_IN_API_KEY not set — using static data');
        return [];
    }
    try {
        const url = `${real_gov_data_1.DATA_GOV_IN_CONFIG.baseUrl}/${resourceId}?api-key=${API_KEY}&format=json&limit=${limit}`;
        const response = await fetchJson(url);
        const records = response.records || [];
        cache[cacheKey] = { data: records, fetchedAt: Date.now() };
        console.log(`[GovDataService] Fetched ${records.length} records from data.gov.in: ${response.title}`);
        return records;
    }
    catch (err) {
        console.error('[GovDataService] data.gov.in API error:', err);
        return [];
    }
}
/**
 * Fetch India national statistics from World Bank API (no key needed)
 */
async function fetchWorldBankIndiaData() {
    const cacheKey = 'worldbank_india';
    if (isCacheValid(cacheKey)) {
        return cache[cacheKey].data;
    }
    try {
        const indicators = [
            { key: 'population', code: 'SP.POP.TOTL' },
            { key: 'gdpCurrentUsd', code: 'NY.GDP.MKTP.CD' },
            { key: 'gdpGrowthRate', code: 'NY.GDP.MKTP.KD.ZG' },
            { key: 'urbanPopulationPct', code: 'SP.URB.TOTL.IN.ZS' }
        ];
        const results = {};
        await Promise.all(indicators.map(async ({ key, code }) => {
            try {
                const url = `https://api.worldbank.org/v2/country/IN/indicator/${code}?format=json&mrv=1`;
                const data = await fetchJson(url);
                results[key] = data[1]?.[0]?.value ?? null;
            }
            catch {
                results[key] = null;
            }
        }));
        const output = {
            population: results['population'],
            gdpCurrentUsd: results['gdpCurrentUsd'],
            gdpGrowthRate: results['gdpGrowthRate'],
            urbanPopulationPct: results['urbanPopulationPct'],
        };
        cache[cacheKey] = { data: output, fetchedAt: Date.now() };
        return output;
    }
    catch (err) {
        console.error('[GovDataService] World Bank API error:', err);
        return { population: null, gdpCurrentUsd: null, gdpGrowthRate: null, urbanPopulationPct: null };
    }
}
/**
 * Compute DILRMP national aggregate from state-level data
 */
function computeNationalDilrmpAggregate() {
    const states = real_gov_data_1.REAL_STATES_DATA;
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
