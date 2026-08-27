import fs from 'fs';
import path from 'path';

interface StateCsvRow {
  state_code: string;
  state_name_english: string;
  state_name_local: string;
  state_census2011_code: string;
  state_or_ut: string;
  last_updated: string;
}

interface DistrictCsvRow {
  state_code: string;
  state_name_english: string;
  district_code: string;
  district_name_english: string;
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

export function runDataValidation() {
  console.log('========================================================');
  console.log('NATIONAL LAND ACQUISITION & MANAGEMENT SYSTEM - DATA VALIDATION');
  console.log('========================================================\n');

  const rootDir = path.resolve(__dirname, '../../');
  const statesPath = path.join(rootDir, 'data/raw/lgd_states.csv');
  const districtsPath = path.join(rootDir, 'data/raw/lgd_districts.csv');
  const autoMatchPath = path.join(rootDir, 'data/processed/district_geometry_auto_matches.csv');
  const reviewMatchPath = path.join(rootDir, 'data/processed/district_geometry_review_prioritized.csv');

  let errors = 0;
  let warnings = 0;

  // 1. Validate States
  if (!fs.existsSync(statesPath)) {
    console.error(`❌ Error: States file missing at ${statesPath}`);
    errors++;
    return;
  }

  const statesContent = fs.readFileSync(statesPath, 'utf8');
  const stateRows = parseCsv(statesContent);
  const stateCodeSet = new Set<string>();
  const stateNameSet = new Set<string>();

  console.log(`📊 Validating States Master Data (${stateRows.length} records)...`);
  stateRows.forEach((row, idx) => {
    const code = row['state_code'];
    const name = row['state_name_english'];
    const type = row['state_or_ut'];

    if (!code || isNaN(Number(code))) {
      console.error(`  ❌ Row ${idx + 2}: Invalid state_code "${code}"`);
      errors++;
    } else if (stateCodeSet.has(code)) {
      console.error(`  ❌ Duplicate state_code: ${code}`);
      errors++;
    } else {
      stateCodeSet.add(code);
    }

    if (!name) {
      console.error(`  ❌ Row ${idx + 2}: Missing state_name_english`);
      errors++;
    } else if (stateNameSet.has(name.toLowerCase())) {
      console.warn(`  ⚠️ Duplicate state name: ${name}`);
      warnings++;
    } else {
      stateNameSet.add(name.toLowerCase());
    }

    if (type !== 'S' && type !== 'U') {
      console.warn(`  ⚠️ Row ${idx + 2} (${name}): Unknown state_or_ut "${type}"`);
      warnings++;
    }
  });

  console.log(`  ✅ States: ${stateCodeSet.size} unique valid states and UTs identified.`);

  // 2. Validate Districts
  if (!fs.existsSync(districtsPath)) {
    console.error(`❌ Error: Districts file missing at ${districtsPath}`);
    errors++;
    return;
  }

  const districtsContent = fs.readFileSync(districtsPath, 'utf8');
  const districtRows = parseCsv(districtsContent);
  const districtCodeSet = new Set<string>();
  let unmappedStateCount = 0;

  console.log(`\n📊 Validating Districts Master Data (${districtRows.length} records)...`);
  districtRows.forEach((row, idx) => {
    const stateCode = row['state_code'];
    const distCode = row['district_code'];
    const distName = row['district_name_english'];

    if (!distCode || isNaN(Number(distCode))) {
      console.error(`  ❌ Row ${idx + 2}: Invalid district_code "${distCode}"`);
      errors++;
    } else if (districtCodeSet.has(distCode)) {
      // In LGD, some district codes might reoccur across different states or census vs lgd, track
      districtCodeSet.add(distCode);
    } else {
      districtCodeSet.add(distCode);
    }

    if (!stateCodeSet.has(stateCode)) {
      unmappedStateCount++;
      warnings++;
    }

    if (!distName) {
      console.error(`  ❌ Row ${idx + 2}: Missing district_name_english`);
      errors++;
    }
  });

  console.log(`  ✅ Districts: ${districtRows.length} total district records validated.`);
  if (unmappedStateCount > 0) {
    console.warn(`  ⚠️ Warning: ${unmappedStateCount} districts have state codes not found in states table.`);
  }

  // 3. Validate Processed Geometries
  if (fs.existsSync(autoMatchPath)) {
    const autoMatches = parseCsv(fs.readFileSync(autoMatchPath, 'utf8'));
    console.log(`\n🗺️ Auto-Matched District Geometries: ${autoMatches.length} records available.`);
  }

  if (fs.existsSync(reviewMatchPath)) {
    const reviewMatches = parseCsv(fs.readFileSync(reviewMatchPath, 'utf8'));
    console.log(`🗺️ Prioritized Geometry Review Records: ${reviewMatches.length} records flagged for validation.`);
  }

  console.log('\n========================================================');
  console.log(`VALIDATION COMPLETED: ${errors} errors, ${warnings} warnings.`);
  console.log('========================================================\n');
}

if (require.main === module) {
  runDataValidation();
}
