"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMasterGeographicData = loadMasterGeographicData;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseCsv(content) {
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0)
        return [];
    const header = parseCsvLine(lines[0]);
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const row = {};
        header.forEach((h, idx) => {
            row[h.trim()] = (values[idx] || '').trim();
        });
        rows.push(row);
    }
    return rows;
}
function parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        }
        else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        }
        else {
            current += char;
        }
    }
    result.push(current);
    return result;
}
const STATE_CODE_TO_SHORT = {
    '9': 'UP',
    '27': 'MH',
    '10': 'BR',
    '19': 'WB',
    '33': 'TN',
    '8': 'RJ',
    '24': 'GJ',
    '29': 'KA',
    '7': 'DL',
    '4': 'CH',
    '1': 'JK',
    '34': 'PY',
    '28': 'AP',
    '36': 'TS',
    '23': 'MP',
    '3': 'PB',
    '6': 'HR',
    '32': 'KL',
    '21': 'OD',
    '20': 'JH',
    '22': 'CG',
    '5': 'UK',
    '2': 'HP',
    '18': 'AS',
    '30': 'GA',
    '11': 'SK',
    '17': 'ML',
    '16': 'TR',
    '15': 'MZ',
    '14': 'MN',
    '13': 'NL',
    '12': 'AR',
    '35': 'AN',
    '38': 'DH',
    '37': 'LA',
    '31': 'LD'
};
const STATE_CAPITALS = {
    'Uttar Pradesh': 'Lucknow',
    'Maharashtra': 'Mumbai',
    'Bihar': 'Patna',
    'West Bengal': 'Kolkata',
    'Tamil Nadu': 'Chennai',
    'Rajasthan': 'Jaipur',
    'Gujarat': 'Gandhinagar',
    'Karnataka': 'Bengaluru',
    'Delhi': 'New Delhi',
    'Chandigarh': 'Chandigarh',
    'Jammu And Kashmir': 'Srinagar / Jammu',
    'Puducherry': 'Puducherry',
    'Andhra Pradesh': 'Amaravati',
    'Telangana': 'Hyderabad',
    'Madhya Pradesh': 'Bhopal',
    'Punjab': 'Chandigarh',
    'Haryana': 'Chandigarh',
    'Kerala': 'Thiruvananthapuram',
    'Odisha': 'Bhubaneswar',
    'Jharkhand': 'Ranchi',
    'Chhattisgarh': 'Raipur',
    'Uttarakhand': 'Dehradun',
    'Himachal Pradesh': 'Shimla',
    'Assam': 'Dispur',
    'Goa': 'Panaji',
    'Sikkim': 'Gangtok',
    'Meghalaya': 'Shillong',
    'Tripura': 'Agartala',
    'Mizoram': 'Aizawl',
    'Manipur': 'Imphal',
    'Nagaland': 'Kohima',
    'Arunachal Pradesh': 'Itanagar',
    'Andaman And Nicobar Islands': 'Port Blair',
    'The Dadra And Nagar Haveli And Daman And Diu': 'Daman',
    'Ladakh': 'Leh',
    'Lakshadweep': 'Kavaratti'
};
function loadMasterGeographicData() {
    // Resolve to project root (2SIH/) from backend/src/scripts/import-data/
    const rootDir = path_1.default.resolve(__dirname, '../../../../scripts');
    const statesPath = path_1.default.join(rootDir, 'data/raw/lgd_states.csv');
    const districtsPath = path_1.default.join(rootDir, 'data/raw/lgd_districts.csv');
    const autoMatchPath = path_1.default.join(rootDir, 'data/processed/district_geometry_auto_matches.csv');
    const reviewMatchPath = path_1.default.join(rootDir, 'data/processed/district_geometry_review_prioritized.csv');
    const statesContent = fs_1.default.readFileSync(statesPath, 'utf8');
    const rawStates = parseCsv(statesContent);
    const districtsContent = fs_1.default.readFileSync(districtsPath, 'utf8');
    const rawDistricts = parseCsv(districtsContent);
    const autoMatches = fs_1.default.existsSync(autoMatchPath) ? parseCsv(fs_1.default.readFileSync(autoMatchPath, 'utf8')) : [];
    const reviewMatches = fs_1.default.existsSync(reviewMatchPath) ? parseCsv(fs_1.default.readFileSync(reviewMatchPath, 'utf8')) : [];
    const autoMatchedDistCodeSet = new Set(autoMatches.map(m => m['lgd_district_code']));
    const reviewDistCodeSet = new Set(reviewMatches.map(m => m['lgd_district_code']));
    const stateMapByCode = new Map();
    const stateList = [];
    rawStates.forEach(row => {
        const lgdCode = parseInt(row['state_code'], 10);
        const name = row['state_name_english'].trim();
        if (!lgdCode || !name)
            return;
        const shortName = STATE_CODE_TO_SHORT[String(lgdCode)] || name.substring(0, 2).toUpperCase();
        const type = row['state_or_ut'] === 'U' ? 'UNION_TERRITORY' : 'STATE';
        const stateRecord = {
            id: `state-${lgdCode}`,
            lgdCode,
            name,
            shortName,
            localName: row['state_name_local']?.trim() || name,
            census2011Code: row['state_census2011_code']?.trim() || '',
            type,
            capital: STATE_CAPITALS[name] || '',
            isActive: true
        };
        stateMapByCode.set(lgdCode, stateRecord);
        stateList.push(stateRecord);
    });
    const districtList = [];
    rawDistricts.forEach(row => {
        const lgdCode = parseInt(row['district_code'], 10);
        const stateLgdCode = parseInt(row['state_code'], 10);
        const name = row['district_name_english'].trim();
        if (!lgdCode || !name)
            return;
        const state = stateMapByCode.get(stateLgdCode);
        const stateId = state ? state.id : `state-${stateLgdCode}`;
        let matchStatus = 'AUTO_MATCHED';
        if (reviewDistCodeSet.has(String(lgdCode))) {
            matchStatus = 'REVIEW_REQUIRED';
        }
        else if (autoMatchedDistCodeSet.has(String(lgdCode))) {
            matchStatus = 'AUTO_MATCHED';
        }
        districtList.push({
            id: `dist-${lgdCode}`,
            lgdCode,
            stateId,
            stateLgdCode,
            name,
            localName: row['district_name_local']?.trim() || name,
            census2011Code: row['district_census2011_code']?.trim() || '',
            isActive: true,
            geometryMatchStatus: matchStatus
        });
    });
    console.log(`✅ Loaded ${stateList.length} States/UTs and ${districtList.length} Districts.`);
    return { states: stateList, districts: districtList };
}
if (require.main === module) {
    loadMasterGeographicData();
}
