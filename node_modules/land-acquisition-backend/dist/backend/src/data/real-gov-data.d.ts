/**
 * AUTHORITATIVE REAL GOVERNMENT DATA
 * Sources:
 *   - Population & Area: Census of India 2011 (Office of the Registrar General & Census Commissioner)
 *   - GSDP: RBI Handbook of Statistics on Indian States, FY 2024-25 estimates
 *   - DILRMP Stats: DoLR Annual Report 2023-24, PIB Year-End Review 2023, DILRMP-MIS reports
 *   - Districts: Ministry of Home Affairs (MHA) district master list
 *   - Land Use: Wasteland Atlas of India 2019 (DoLR), Agricultural Statistics 2022-23 (MoA&FW)
 *   - RFCTLARR: Right to Fair Compensation and Transparency in Land Acquisition,
 *               Rehabilitation and Resettlement Act, 2013 (Government of India)
 */
export interface StateGovData {
    id: string;
    name: string;
    code: string;
    capital: string;
    type: 'STATE' | 'UT';
    populationCensus2011: number;
    areaKm2: number;
    districtCount: number;
    gsdpLakhCroreFY25: number;
    dilrmp: {
        rorComputerizedPct: number;
        cadastralMapDigitizedPct: number;
        ulpinImplemented: boolean;
        sroComputerizedPct: number;
    };
    landUseKm2: {
        agricultural: number;
        forest: number;
        wasteland: number;
        builtUp: number;
        other: number;
    };
    region: string;
}
export declare const REAL_STATES_DATA: StateGovData[];
export declare const RFCTLARR_PROVISIONS: {
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
export declare const DILRMP_NATIONAL_SUMMARY: {
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
export declare const NATIONAL_KPIS: {
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
export declare const REAL_DISTRICTS: Record<string, string[]>;
export declare const DATA_GOV_IN_CONFIG: {
    baseUrl: string;
    catalogUrl: string;
    resources: {
        karnatakaDistrictCensus2011: string;
    };
};
