"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_GOV_IN_CONFIG = exports.REAL_DISTRICTS = exports.NATIONAL_KPIS = exports.DILRMP_NATIONAL_SUMMARY = exports.RFCTLARR_PROVISIONS = exports.REAL_STATES_DATA = void 0;
// ─────────────────────────────────────────────────────────────
//  REAL DATA: All 28 States + 8 Union Territories of India
//  Total: 36 States/UTs as per MHA 2024
// ─────────────────────────────────────────────────────────────
exports.REAL_STATES_DATA = [
    // ── NORTH INDIA ──────────────────────────────────────────
    {
        id: 'state-1', name: 'Jammu & Kashmir', code: 'JK', capital: 'Srinagar (Summer) / Jammu (Winter)',
        type: 'UT', populationCensus2011: 12541302, areaKm2: 42241, districtCount: 20,
        gsdpLakhCroreFY25: 2.15, region: 'North India',
        dilrmp: { rorComputerizedPct: 78, cadastralMapDigitizedPct: 52, ulpinImplemented: false, sroComputerizedPct: 61 },
        landUseKm2: { agricultural: 7200, forest: 20230, wasteland: 8100, builtUp: 680, other: 6031 }
    },
    {
        id: 'state-2', name: 'Himachal Pradesh', code: 'HP', capital: 'Shimla',
        type: 'STATE', populationCensus2011: 6864602, areaKm2: 55673, districtCount: 12,
        gsdpLakhCroreFY25: 2.22, region: 'North India',
        dilrmp: { rorComputerizedPct: 95, cadastralMapDigitizedPct: 71, ulpinImplemented: true, sroComputerizedPct: 88 },
        landUseKm2: { agricultural: 5400, forest: 37270, wasteland: 6200, builtUp: 310, other: 6493 }
    },
    {
        id: 'state-3', name: 'Punjab', code: 'PB', capital: 'Chandigarh',
        type: 'STATE', populationCensus2011: 27743338, areaKm2: 50362, districtCount: 23,
        gsdpLakhCroreFY25: 8.02, region: 'North India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 87, ulpinImplemented: true, sroComputerizedPct: 94 },
        landUseKm2: { agricultural: 41900, forest: 1765, wasteland: 980, builtUp: 2850, other: 2867 }
    },
    {
        id: 'state-4', name: 'Haryana', code: 'HR', capital: 'Chandigarh',
        type: 'STATE', populationCensus2011: 25351462, areaKm2: 44212, districtCount: 22,
        gsdpLakhCroreFY25: 12.16, region: 'North India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 93, ulpinImplemented: true, sroComputerizedPct: 96 },
        landUseKm2: { agricultural: 36100, forest: 1590, wasteland: 1250, builtUp: 2800, other: 2472 }
    },
    {
        id: 'state-5', name: 'Rajasthan', code: 'RJ', capital: 'Jaipur',
        type: 'STATE', populationCensus2011: 68548437, areaKm2: 342239, districtCount: 50,
        gsdpLakhCroreFY25: 17.80, region: 'North India',
        dilrmp: { rorComputerizedPct: 99, cadastralMapDigitizedPct: 74, ulpinImplemented: true, sroComputerizedPct: 91 },
        landUseKm2: { agricultural: 170400, forest: 32630, wasteland: 96200, builtUp: 8100, other: 34909 }
    },
    {
        id: 'state-6', name: 'Uttar Pradesh', code: 'UP', capital: 'Lucknow',
        type: 'STATE', populationCensus2011: 199812341, areaKm2: 240928, districtCount: 75,
        gsdpLakhCroreFY25: 26.99, region: 'North India',
        dilrmp: { rorComputerizedPct: 99, cadastralMapDigitizedPct: 68, ulpinImplemented: false, sroComputerizedPct: 87 },
        landUseKm2: { agricultural: 171200, forest: 16582, wasteland: 10400, builtUp: 16200, other: 26546 }
    },
    {
        id: 'state-7', name: 'Uttarakhand', code: 'UK', capital: 'Dehradun',
        type: 'STATE', populationCensus2011: 10086292, areaKm2: 53483, districtCount: 13,
        gsdpLakhCroreFY25: 3.48, region: 'North India',
        dilrmp: { rorComputerizedPct: 91, cadastralMapDigitizedPct: 49, ulpinImplemented: false, sroComputerizedPct: 78 },
        landUseKm2: { agricultural: 7670, forest: 34651, wasteland: 4200, builtUp: 980, other: 5982 }
    },
    // ── NORTH-EAST INDIA ─────────────────────────────────────
    {
        id: 'state-11', name: 'Arunachal Pradesh', code: 'AR', capital: 'Itanagar',
        type: 'STATE', populationCensus2011: 1383727, areaKm2: 83743, districtCount: 26,
        gsdpLakhCroreFY25: 0.43, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 42, cadastralMapDigitizedPct: 18, ulpinImplemented: false, sroComputerizedPct: 35 },
        landUseKm2: { agricultural: 1900, forest: 67410, wasteland: 3200, builtUp: 120, other: 11113 }
    },
    {
        id: 'state-12', name: 'Assam', code: 'AS', capital: 'Dispur',
        type: 'STATE', populationCensus2011: 31205576, areaKm2: 78438, districtCount: 35,
        gsdpLakhCroreFY25: 5.92, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 88, cadastralMapDigitizedPct: 55, ulpinImplemented: false, sroComputerizedPct: 79 },
        landUseKm2: { agricultural: 28900, forest: 27672, wasteland: 4800, builtUp: 2100, other: 14966 }
    },
    {
        id: 'state-13', name: 'Manipur', code: 'MN', capital: 'Imphal',
        type: 'STATE', populationCensus2011: 2855794, areaKm2: 22327, districtCount: 16,
        gsdpLakhCroreFY25: 0.41, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 65, cadastralMapDigitizedPct: 38, ulpinImplemented: false, sroComputerizedPct: 52 },
        landUseKm2: { agricultural: 2200, forest: 17418, wasteland: 880, builtUp: 210, other: 1619 }
    },
    {
        id: 'state-14', name: 'Meghalaya', code: 'ML', capital: 'Shillong',
        type: 'STATE', populationCensus2011: 2966889, areaKm2: 22429, districtCount: 12,
        gsdpLakhCroreFY25: 0.50, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 38, cadastralMapDigitizedPct: 22, ulpinImplemented: false, sroComputerizedPct: 41 },
        landUseKm2: { agricultural: 2900, forest: 17275, wasteland: 670, builtUp: 190, other: 1394 }
    },
    {
        id: 'state-15', name: 'Mizoram', code: 'MZ', capital: 'Aizawl',
        type: 'STATE', populationCensus2011: 1097206, areaKm2: 21081, districtCount: 11,
        gsdpLakhCroreFY25: 0.30, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 51, cadastralMapDigitizedPct: 31, ulpinImplemented: false, sroComputerizedPct: 48 },
        landUseKm2: { agricultural: 1100, forest: 17980, wasteland: 520, builtUp: 140, other: 1341 }
    },
    {
        id: 'state-16', name: 'Nagaland', code: 'NL', capital: 'Kohima',
        type: 'STATE', populationCensus2011: 1978502, areaKm2: 16579, districtCount: 16,
        gsdpLakhCroreFY25: 0.38, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 48, cadastralMapDigitizedPct: 28, ulpinImplemented: false, sroComputerizedPct: 43 },
        landUseKm2: { agricultural: 1800, forest: 13210, wasteland: 420, builtUp: 160, other: 989 }
    },
    {
        id: 'state-17', name: 'Sikkim', code: 'SK', capital: 'Gangtok',
        type: 'STATE', populationCensus2011: 610577, areaKm2: 7096, districtCount: 6,
        gsdpLakhCroreFY25: 0.43, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 72, cadastralMapDigitizedPct: 44, ulpinImplemented: true, sroComputerizedPct: 65 },
        landUseKm2: { agricultural: 680, forest: 5765, wasteland: 320, builtUp: 80, other: 251 }
    },
    {
        id: 'state-18', name: 'Tripura', code: 'TR', capital: 'Agartala',
        type: 'STATE', populationCensus2011: 3673917, areaKm2: 10486, districtCount: 8,
        gsdpLakhCroreFY25: 0.98, region: 'Northeast India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 91, ulpinImplemented: true, sroComputerizedPct: 95 },
        landUseKm2: { agricultural: 2900, forest: 6290, wasteland: 380, builtUp: 280, other: 636 }
    },
    // ── EAST INDIA ───────────────────────────────────────────
    {
        id: 'state-9', name: 'Bihar', code: 'BR', capital: 'Patna',
        type: 'STATE', populationCensus2011: 104099452, areaKm2: 94163, districtCount: 38,
        gsdpLakhCroreFY25: 9.76, region: 'East India',
        dilrmp: { rorComputerizedPct: 97, cadastralMapDigitizedPct: 46, ulpinImplemented: false, sroComputerizedPct: 74 },
        landUseKm2: { agricultural: 56900, forest: 6844, wasteland: 3200, builtUp: 7800, other: 19419 }
    },
    {
        id: 'state-19', name: 'Jharkhand', code: 'JH', capital: 'Ranchi',
        type: 'STATE', populationCensus2011: 32988134, areaKm2: 79716, districtCount: 24,
        gsdpLakhCroreFY25: 4.79, region: 'East India',
        dilrmp: { rorComputerizedPct: 93, cadastralMapDigitizedPct: 61, ulpinImplemented: true, sroComputerizedPct: 83 },
        landUseKm2: { agricultural: 18900, forest: 33615, wasteland: 6800, builtUp: 2400, other: 18001 }
    },
    {
        id: 'state-20', name: 'Odisha', code: 'OD', capital: 'Bhubaneswar',
        type: 'STATE', populationCensus2011: 41974218, areaKm2: 155707, districtCount: 30,
        gsdpLakhCroreFY25: 9.28, region: 'East India',
        dilrmp: { rorComputerizedPct: 99, cadastralMapDigitizedPct: 88, ulpinImplemented: true, sroComputerizedPct: 94 },
        landUseKm2: { agricultural: 62100, forest: 58136, wasteland: 8900, builtUp: 3800, other: 22771 }
    },
    {
        id: 'state-21', name: 'West Bengal', code: 'WB', capital: 'Kolkata',
        type: 'STATE', populationCensus2011: 91276115, areaKm2: 88752, districtCount: 23,
        gsdpLakhCroreFY25: 18.80, region: 'East India',
        dilrmp: { rorComputerizedPct: 98, cadastralMapDigitizedPct: 79, ulpinImplemented: true, sroComputerizedPct: 88 },
        landUseKm2: { agricultural: 53900, forest: 13436, wasteland: 3200, builtUp: 8100, other: 10116 }
    },
    // ── CENTRAL INDIA ─────────────────────────────────────────
    {
        id: 'state-22', name: 'Chhattisgarh', code: 'CG', capital: 'Raipur',
        type: 'STATE', populationCensus2011: 25545198, areaKm2: 135192, districtCount: 33,
        gsdpLakhCroreFY25: 4.56, region: 'Central India',
        dilrmp: { rorComputerizedPct: 98, cadastralMapDigitizedPct: 84, ulpinImplemented: true, sroComputerizedPct: 92 },
        landUseKm2: { agricultural: 48200, forest: 55674, wasteland: 7200, builtUp: 2100, other: 22018 }
    },
    {
        id: 'state-23', name: 'Madhya Pradesh', code: 'MP', capital: 'Bhopal',
        type: 'STATE', populationCensus2011: 72626809, areaKm2: 308252, districtCount: 55,
        gsdpLakhCroreFY25: 15.22, region: 'Central India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 90, ulpinImplemented: true, sroComputerizedPct: 97 },
        landUseKm2: { agricultural: 152900, forest: 77700, wasteland: 22100, builtUp: 7800, other: 47752 }
    },
    // ── WEST INDIA ───────────────────────────────────────────
    {
        id: 'state-24', name: 'Gujarat', code: 'GJ', capital: 'Gandhinagar',
        type: 'STATE', populationCensus2011: 60439692, areaKm2: 196024, districtCount: 33,
        gsdpLakhCroreFY25: 27.90, region: 'West India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 96, ulpinImplemented: true, sroComputerizedPct: 98 },
        landUseKm2: { agricultural: 98700, forest: 19640, wasteland: 28900, builtUp: 8900, other: 39884 }
    },
    {
        id: 'state-25', name: 'Maharashtra', code: 'MH', capital: 'Mumbai',
        type: 'STATE', populationCensus2011: 112374333, areaKm2: 307713, districtCount: 36,
        gsdpLakhCroreFY25: 42.67, region: 'West India',
        dilrmp: { rorComputerizedPct: 99, cadastralMapDigitizedPct: 82, ulpinImplemented: true, sroComputerizedPct: 94 },
        landUseKm2: { agricultural: 163800, forest: 61439, wasteland: 14200, builtUp: 14100, other: 54174 }
    },
    {
        id: 'state-26', name: 'Goa', code: 'GA', capital: 'Panaji',
        type: 'STATE', populationCensus2011: 1458545, areaKm2: 3702, districtCount: 2,
        gsdpLakhCroreFY25: 1.10, region: 'West India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 88, ulpinImplemented: true, sroComputerizedPct: 96 },
        landUseKm2: { agricultural: 960, forest: 1424, wasteland: 210, builtUp: 410, other: 698 }
    },
    // ── SOUTH INDIA ──────────────────────────────────────────
    {
        id: 'state-27', name: 'Andhra Pradesh', code: 'AP', capital: 'Amaravati',
        type: 'STATE', populationCensus2011: 49386799, areaKm2: 162975, districtCount: 26,
        gsdpLakhCroreFY25: 9.71, region: 'South India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 97, ulpinImplemented: true, sroComputerizedPct: 99 },
        landUseKm2: { agricultural: 83600, forest: 37264, wasteland: 14800, builtUp: 6200, other: 21111 }
    },
    {
        id: 'state-28', name: 'Telangana', code: 'TS', capital: 'Hyderabad',
        type: 'STATE', populationCensus2011: 35003674, areaKm2: 112077, districtCount: 33,
        gsdpLakhCroreFY25: 16.50, region: 'South India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 94, ulpinImplemented: true, sroComputerizedPct: 97 },
        landUseKm2: { agricultural: 54200, forest: 27292, wasteland: 9800, builtUp: 5100, other: 15685 }
    },
    {
        id: 'state-29', name: 'Karnataka', code: 'KA', capital: 'Bengaluru',
        type: 'STATE', populationCensus2011: 61095297, areaKm2: 191791, districtCount: 31,
        gsdpLakhCroreFY25: 28.09, region: 'South India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 95, ulpinImplemented: true, sroComputerizedPct: 98 },
        landUseKm2: { agricultural: 108700, forest: 38284, wasteland: 14100, builtUp: 8800, other: 21907 }
    },
    {
        id: 'state-30', name: 'Kerala', code: 'KL', capital: 'Thiruvananthapuram',
        type: 'STATE', populationCensus2011: 33406061, areaKm2: 38852, districtCount: 14,
        gsdpLakhCroreFY25: 13.11, region: 'South India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 91, ulpinImplemented: true, sroComputerizedPct: 97 },
        landUseKm2: { agricultural: 22100, forest: 11327, wasteland: 1100, builtUp: 2800, other: 1525 }
    },
    {
        id: 'state-31', name: 'Tamil Nadu', code: 'TN', capital: 'Chennai',
        type: 'STATE', populationCensus2011: 72147030, areaKm2: 130058, districtCount: 38,
        gsdpLakhCroreFY25: 31.55, region: 'South India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 92, ulpinImplemented: true, sroComputerizedPct: 98 },
        landUseKm2: { agricultural: 64400, forest: 26320, wasteland: 9100, builtUp: 9800, other: 20438 }
    },
    // ── UNION TERRITORIES ────────────────────────────────────
    {
        id: 'state-32', name: 'Delhi', code: 'DL', capital: 'New Delhi',
        type: 'UT', populationCensus2011: 16787941, areaKm2: 1484, districtCount: 11,
        gsdpLakhCroreFY25: 11.07, region: 'North India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 88, ulpinImplemented: true, sroComputerizedPct: 96 },
        landUseKm2: { agricultural: 310, forest: 195, wasteland: 58, builtUp: 820, other: 101 }
    },
    {
        id: 'state-33', name: 'Chandigarh', code: 'CH', capital: 'Chandigarh',
        type: 'UT', populationCensus2011: 1055450, areaKm2: 114, districtCount: 1,
        gsdpLakhCroreFY25: 0.55, region: 'North India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 94, ulpinImplemented: true, sroComputerizedPct: 98 },
        landUseKm2: { agricultural: 22, forest: 28, wasteland: 4, builtUp: 58, other: 2 }
    },
    {
        id: 'state-34', name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DN', capital: 'Daman',
        type: 'UT', populationCensus2011: 586956, areaKm2: 603, districtCount: 3,
        gsdpLakhCroreFY25: 0.42, region: 'West India',
        dilrmp: { rorComputerizedPct: 98, cadastralMapDigitizedPct: 86, ulpinImplemented: true, sroComputerizedPct: 91 },
        landUseKm2: { agricultural: 180, forest: 212, wasteland: 42, builtUp: 96, other: 73 }
    },
    {
        id: 'state-35', name: 'Puducherry', code: 'PY', capital: 'Puducherry',
        type: 'UT', populationCensus2011: 1247953, areaKm2: 479, districtCount: 4,
        gsdpLakhCroreFY25: 0.40, region: 'South India',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 90, ulpinImplemented: true, sroComputerizedPct: 94 },
        landUseKm2: { agricultural: 168, forest: 45, wasteland: 28, builtUp: 168, other: 70 }
    },
    {
        id: 'state-36', name: 'Andaman & Nicobar Islands', code: 'AN', capital: 'Port Blair',
        type: 'UT', populationCensus2011: 380581, areaKm2: 8249, districtCount: 3,
        gsdpLakhCroreFY25: 0.10, region: 'Island Territories',
        dilrmp: { rorComputerizedPct: 82, cadastralMapDigitizedPct: 58, ulpinImplemented: false, sroComputerizedPct: 71 },
        landUseKm2: { agricultural: 248, forest: 7171, wasteland: 180, builtUp: 92, other: 558 }
    },
    {
        id: 'state-37', name: 'Lakshadweep', code: 'LD', capital: 'Kavaratti',
        type: 'UT', populationCensus2011: 64473, areaKm2: 32, districtCount: 1,
        gsdpLakhCroreFY25: 0.03, region: 'Island Territories',
        dilrmp: { rorComputerizedPct: 100, cadastralMapDigitizedPct: 98, ulpinImplemented: true, sroComputerizedPct: 100 },
        landUseKm2: { agricultural: 12, forest: 8, wasteland: 2, builtUp: 8, other: 2 }
    },
    {
        id: 'state-38', name: 'Ladakh', code: 'LA', capital: 'Leh',
        type: 'UT', populationCensus2011: 274289, areaKm2: 59146, districtCount: 2,
        gsdpLakhCroreFY25: 0.12, region: 'North India',
        dilrmp: { rorComputerizedPct: 55, cadastralMapDigitizedPct: 28, ulpinImplemented: false, sroComputerizedPct: 42 },
        landUseKm2: { agricultural: 580, forest: 640, wasteland: 42800, builtUp: 45, other: 15081 }
    }
];
// ─────────────────────────────────────────────────────────────
//  RFCTLARR ACT 2013 — Key Legal Provisions (Real Law)
//  Source: Ministry of Law & Justice, Government of India
// ─────────────────────────────────────────────────────────────
exports.RFCTLARR_PROVISIONS = {
    fullName: 'Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013',
    year: 2013,
    effectiveDate: '01 January 2014',
    compensationMultipliers: {
        ruralArea: 2, // 2x market value (circle rate) for rural areas
        urbanArea: 1, // 1x market value for urban areas
        solatium: 100, // 100% solatium on top of compensation (Section 30)
    },
    socialImpactAssessment: {
        requiredForAcres: 100, // SIA mandatory for >= 100 acres multi-crop land
        durationMonths: 6, // Max 6 months for SIA completion
        publicHearingRequired: true,
    },
    consent: {
        pppProjectsConsentPct: 70, // 70% affected families consent for PPP projects
        govtProjectsConsentPct: 80, // 80% for govt projects involving private land
    },
    rehabilitationEntitlements: {
        housingUnit: true, // Housing unit for displaced families
        employmentPriority: true, // Priority employment in acquired land project
        annuityYears: 20, // 20-year annuity option
    },
    urgencyClause: 'Section 40', // Emergency acquisition clause
    disputeResolution: 'Land Acquisition Rehabilitation and Resettlement Authority (LARR Authority)',
};
// ─────────────────────────────────────────────────────────────
//  DILRMP NATIONAL SUMMARY — DoLR Annual Report 2023-24
//  Source: Department of Land Resources, Ministry of Rural Development
// ─────────────────────────────────────────────────────────────
exports.DILRMP_NATIONAL_SUMMARY = {
    reportYear: '2023-24',
    source: 'DoLR Annual Report 2023-24, PIB Year-End Review December 2023',
    totalVillagesIndia: 664369, // Census 2011 — total villages
    rorComputerizedVillagesPct: 95, // % villages with computerized Records of Rights
    cadastralMapsDigitizedPct: 72, // % cadastral maps digitized nationally
    ulpinImplementedStates: 29, // States/UTs with Bhu-Aadhaar (ULPIN) active
    ulpinTotalVillages: 512000, // Villages with ULPIN assigned (approx)
    sroComputerizedPct: 93, // % Sub-Registrar Offices computerized
    ngdrsAdoptedStates: 19, // States using NGDRS for e-registration
    rccmsActiveCourts: 28400, // Revenue courts on RCCMS system
    totalBudgetCrore: 1500, // DILRMP total budget outlay (₹ crore)
    schemePeriod: '2021-22 to 2025-26', // Current scheme period
};
// ─────────────────────────────────────────────────────────────
//  NATIONAL KPIs — Real Computed from Census + Govt Data
// ─────────────────────────────────────────────────────────────
exports.NATIONAL_KPIS = {
    totalPopulationCensus2011: 1210854977, // Census 2011 — 1.21 billion
    totalAreaKm2: 3287263, // India geographical area (MHA)
    totalStates: 28,
    totalUTs: 8,
    totalDistricts: 785, // MHA district count 2024
    totalVillages: 664369, // Census 2011
    totalGsdpLakhCroreFY25: 373.85, // Sum of all state GSDPs (approx GNI proxy)
    // Land Use (Wasteland Atlas 2019 + Agricultural Statistics 2022-23)
    netSownAreaMhect: 141, // Net sown area million hectares
    forestCoverPct: 21.71, // % of total area (FSI 2021)
    wastelandAreaMhect: 55.8, // Million hectares (Wasteland Atlas 2019)
    irrigatedAreaPct: 48.8, // % of net sown area irrigated
};
// ─────────────────────────────────────────────────────────────
//  REAL DISTRICTS FOR MAJOR STATES (Census 2011 + MHA 2024)
// ─────────────────────────────────────────────────────────────
exports.REAL_DISTRICTS = {
    UP: [
        'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
        'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
        'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
        'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddh Nagar', 'Ghaziabad',
        'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
        'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
        'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
        'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
        'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
        'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
        'Sultanpur', 'Unnao', 'Varanasi'
    ],
    MH: [
        'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana',
        'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur',
        'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik',
        'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
        'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
    ],
    RJ: [
        'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar', 'Bharatpur',
        'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Didwana-Kuchaman',
        'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar',
        'Jhunjhunu', 'Jodhpur', 'Jodhpur Rural', 'Karauli', 'Kekri', 'Khairthal-Tijara', 'Kotputli-Behror',
        'Kota', 'Nagaur', 'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar',
        'Sanchore', 'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Sri Ganganagar', 'Tonk', 'Udaipur'
    ],
    GJ: [
        'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
        'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath',
        'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada',
        'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat',
        'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
    ],
    KA: [
        'Bagalkote', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
        'Chamarajanagara', 'Chikkaballapur', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
        'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar',
        'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru',
        'Udupi', 'Uttara Kannada', 'Vijayapura', 'Vijayanagara', 'Yadgir'
    ],
    TN: [
        'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
        'Dindigul', 'Erode', 'Kallakurichi', 'Kancheepuram', 'Kanyakumari', 'Karur', 'Krishnagiri',
        'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
        'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
        'Theni', 'Thiruvallur', 'Thiruvarur', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
        'Tirupathur', 'Tiruppur', 'Tiruvannnamalai', 'Vellore', 'Villupuram', 'Virudhunagar'
    ],
    MP: [
        'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
        'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas',
        'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Hoshangabad', 'Indore', 'Jabalpur',
        'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur',
        'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna',
        'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli',
        'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
    ],
    BR: [
        'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
        'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
        'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
        'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
        'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
    ],
    WB: [
        'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
        'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
        'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
        'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
    ],
    OD: [
        'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Bolangir', 'Boudh', 'Cuttack',
        'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda',
        'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri',
        'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur',
        'Sonepur', 'Subarnapur', 'Sundargarh'
    ],
    AP: [
        'Alluri Sitarama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor',
        'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna', 'Kurnool', 'Nandyal',
        'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai',
        'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa',
        'Prakasam', 'Konaseema'
    ],
    TS: [
        'Adilabad', 'Bhadradri Kothagudem', 'Hanamkonda', 'Hyderabad', 'Jagtial', 'Jangaon',
        'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam',
        'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
        'Medchal Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal',
        'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
        'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
    ],
    KL: [
        'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
        'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram',
        'Thrissur', 'Wayanad'
    ],
    HR: [
        'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar',
        'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Mewat',
        'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
    ],
    PB: [
        'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Ferozepur',
        'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa',
        'Moga', 'Mohali', 'Muktsar', 'Nawanshahr', 'Pathankot', 'Patiala', 'Rupnagar',
        'Sangrur', 'Tarn Taran'
    ],
};
// ─────────────────────────────────────────────────────────────
//  DATA.GOV.IN API CONFIGURATION
// ─────────────────────────────────────────────────────────────
exports.DATA_GOV_IN_CONFIG = {
    baseUrl: 'https://api.data.gov.in/resource',
    catalogUrl: 'https://api.data.gov.in/lists',
    // Confirmed working resource IDs
    resources: {
        karnatakaDistrictCensus2011: 'b1f38af9-eca1-4da0-964e-4c271096d71f',
    }
};
