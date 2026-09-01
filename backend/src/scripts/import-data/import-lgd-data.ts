import fs from 'fs';
import path from 'path';

export interface StateRecord {
  id: string;
  lgdCode: number;
  name: string;
  shortName: string;
  localName: string;
  census2011Code: string;
  type: 'STATE' | 'UNION_TERRITORY';
  capital: string;
  isActive: boolean;
  areaKm2?: number;
}

export interface DistrictRecord {
  id: string;
  lgdCode: number;
  stateId: string;
  stateLgdCode: number;
  name: string;
  localName: string;
  census2011Code: string;
  isActive: boolean;
  geometryMatchStatus: 'AUTO_MATCHED' | 'REVIEW_REQUIRED' | 'VERIFIED' | 'REJECTED';
  latitude?: number;
  longitude?: number;
}

function parseCsv(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || '').trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const STATE_CODE_TO_SHORT: Record<string, string> = {
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

const STATE_CAPITALS: Record<string, string> = {
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

export function loadMasterGeographicData() {
  const candidateDirs = [
    path.resolve(__dirname, '../../../data'),
    path.resolve(__dirname, '../../data'),
    path.resolve(__dirname, '../../../../data'),
    path.resolve(process.cwd(), 'data'),
    path.resolve(process.cwd(), 'backend/data'),
    path.resolve(process.cwd(), '../data')
  ];

  let dataDir = candidateDirs.find(dir => fs.existsSync(path.join(dir, 'raw/lgd_states.csv'))) || path.resolve(process.cwd(), 'data');

  const statesPath = path.join(dataDir, 'raw/lgd_states.csv');
  const districtsPath = path.join(dataDir, 'raw/lgd_districts.csv');
  const autoMatchPath = path.join(dataDir, 'processed/district_geometry_auto_matches.csv');
  const reviewMatchPath = path.join(dataDir, 'processed/district_geometry_review_prioritized.csv');

  console.log(`[LGD] Loading geographic datasets from: ${dataDir}`);
  const statesContent = fs.existsSync(statesPath) ? fs.readFileSync(statesPath, 'utf8') : '';
  const rawStates = parseCsv(statesContent);

  const districtsContent = fs.existsSync(districtsPath) ? fs.readFileSync(districtsPath, 'utf8') : '';
  const rawDistricts = parseCsv(districtsContent);

  const autoMatches = fs.existsSync(autoMatchPath) ? parseCsv(fs.readFileSync(autoMatchPath, 'utf8')) : [];
  const reviewMatches = fs.existsSync(reviewMatchPath) ? parseCsv(fs.readFileSync(reviewMatchPath, 'utf8')) : [];

  const autoMatchedDistCodeSet = new Set(autoMatches.map(m => m['lgd_district_code']));
  const reviewDistCodeSet = new Set(reviewMatches.map(m => m['lgd_district_code']));

  const stateMapByCode = new Map<number, StateRecord>();
  const stateList: StateRecord[] = [];

  rawStates.forEach(row => {
    const lgdCode = parseInt(row['state_code'], 10);
    const name = row['state_name_english'].trim();
    if (!lgdCode || !name) return;

    const shortName = STATE_CODE_TO_SHORT[String(lgdCode)] || name.substring(0, 2).toUpperCase();
    const type = row['state_or_ut'] === 'U' ? 'UNION_TERRITORY' : 'STATE';
    const stateRecord: StateRecord = {
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

  const districtList: DistrictRecord[] = [];

  rawDistricts.forEach(row => {
    const lgdCode = parseInt(row['district_code'], 10);
    const stateLgdCode = parseInt(row['state_code'], 10);
    const name = row['district_name_english'].trim();
    if (!lgdCode || !name) return;

    const state = stateMapByCode.get(stateLgdCode);
    const stateId = state ? state.id : `state-${stateLgdCode}`;

    let matchStatus: 'AUTO_MATCHED' | 'REVIEW_REQUIRED' | 'VERIFIED' | 'REJECTED' = 'AUTO_MATCHED';
    if (reviewDistCodeSet.has(String(lgdCode))) {
      matchStatus = 'REVIEW_REQUIRED';
    } else if (autoMatchedDistCodeSet.has(String(lgdCode))) {
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
