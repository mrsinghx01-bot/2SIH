/**
 * Government Data Service
 * Fetches and caches real data from:
 *   - data.gov.in Open Government Data API (API key required)
 *   - World Bank API (free, no key)
 *   - Static authoritative constants from real-gov-data.ts
 */
import { REAL_STATES_DATA, REAL_DISTRICTS, NATIONAL_KPIS, DILRMP_NATIONAL_SUMMARY, RFCTLARR_PROVISIONS, StateGovData } from '../data/real-gov-data';
/**
 * Get all 36 states/UTs with real government data
 * Returns static authoritative data (Census 2011, RBI, DILRMP)
 */
export declare function getAllStatesData(): StateGovData[];
/**
 * Get a single state by its standardised ID
 */
export declare function getStateData(stateId: string): StateGovData | undefined;
/**
 * Get state by state code (e.g. 'UP', 'MH')
 */
export declare function getStateByCode(code: string): StateGovData | undefined;
/**
 * Get real district names for a given state code
 * Falls back to generated names if not in REAL_DISTRICTS
 */
export declare function getDistrictsForState(stateCode: string): string[];
/**
 * National KPIs summary from real government publications
 */
export declare function getNationalKPIs(): {
    dilrmp: {
        reportYear: string;
        source: string;
        totalVillagesIndia: number;
        rorComputerizedVillagesPct: number;
        cadastralMapsDigitizedPct: number;
        ulpinImplementedStates: number;
        ulpinTotalVillages: number;
        sroComputerizedPct: number;
        ngdrsAdoptedStates: number;
        rccmsActiveCourts: number;
        totalBudgetCrore: number;
        schemePeriod: string;
    };
    rfctlarr: {
        fullName: string;
        year: number;
        effectiveDate: string;
        compensationMultipliers: {
            ruralArea: number;
            urbanArea: number;
            solatium: number;
        };
        socialImpactAssessment: {
            requiredForAcres: number;
            durationMonths: number;
            publicHearingRequired: boolean;
        };
        consent: {
            pppProjectsConsentPct: number;
            govtProjectsConsentPct: number;
        };
        rehabilitationEntitlements: {
            housingUnit: boolean;
            employmentPriority: boolean;
            annuityYears: number;
        };
        urgencyClause: string;
        disputeResolution: string;
    };
    totalPopulationCensus2011: number;
    totalAreaKm2: number;
    totalStates: number;
    totalUTs: number;
    totalDistricts: number;
    totalVillages: number;
    totalGsdpLakhCroreFY25: number;
    netSownAreaMhect: number;
    forestCoverPct: number;
    wastelandAreaMhect: number;
    irrigatedAreaPct: number;
};
/**
 * Get district Census data from data.gov.in API (live)
 * Resource: b1f38af9 — Karnataka district census 2011
 * Falls back to static data if API unavailable
 */
export declare function fetchDistrictCensusData(resourceId: string, limit?: number): Promise<unknown[]>;
/**
 * Fetch India national statistics from World Bank API (no key needed)
 */
export declare function fetchWorldBankIndiaData(): Promise<{
    population: number | null;
    gdpCurrentUsd: number | null;
    gdpGrowthRate: number | null;
    urbanPopulationPct: number | null;
}>;
/**
 * Compute DILRMP national aggregate from state-level data
 */
export declare function computeNationalDilrmpAggregate(): {
    avgRorComputerizedPct: number;
    avgCadastralMapDigitizedPct: number;
    ulpinImplementedCount: number;
    avgSroComputerizedPct: number;
    totalStates: number;
};
export { REAL_STATES_DATA, REAL_DISTRICTS, NATIONAL_KPIS, DILRMP_NATIONAL_SUMMARY, RFCTLARR_PROVISIONS, };
