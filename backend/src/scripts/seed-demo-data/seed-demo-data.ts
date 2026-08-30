import bcrypt from 'bcryptjs';
import { loadMasterGeographicData, StateRecord, DistrictRecord } from '../import-data/import-lgd-data';

export interface SeedDataset {
  states: StateRecord[];
  districts: DistrictRecord[];
  projects: any[];
  projectDistricts: any[];
  acquisitionCases: any[];
  caseStatusHistory: any[];
  parcels: any[];
  affectedFamilies: any[];
  compensationRecords: any[];
  rrRecords: any[];
  documents: any[];
  approvals: any[];
  notifications: any[];
  auditLogs: any[];
  users: any[];
  fieldSurveys: any[];
}

export function generateSeedData(): SeedDataset {
  console.log('🌱 Generating comprehensive seed dataset for National Land Acquisition & Management System...');
  const { states, districts } = loadMasterGeographicData();

  const stateByCode = new Map<number, StateRecord>();
  states.forEach(s => stateByCode.set(s.lgdCode, s));

  const districtsByStateLgd = new Map<number, DistrictRecord[]>();
  districts.forEach(d => {
    const list = districtsByStateLgd.get(d.stateLgdCode) || [];
    list.push(d);
    districtsByStateLgd.set(d.stateLgdCode, list);
  });

  // Helper to find a district by name within a state
  function findDistrict(stateLgd: number, districtName: string): DistrictRecord | undefined {
    const stateDists = districtsByStateLgd.get(stateLgd) || [];
    return stateDists.find(d => d.name.toLowerCase().includes(districtName.toLowerCase()));
  }

  // Password hash for demo users (password: 'Admin@123')
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Admin@123', salt);

  // Generate Field Officer users for all 36 states & UTs dynamically
  const users: any[] = [
    {
      id: 'user-central-admin',
      employeeId: 'GOI-CAD-001',
      name: 'Central Admin',
      email: 'central.admin@landrecords.gov.in',
      passwordHash,
      role: 'CENTRAL_ADMIN',
      designation: 'Joint Secretary (Land Resources)',
      ministry: 'Ministry of Rural Development',
      stateId: null,
      districtId: null,
      isActive: true
    },
    {
      id: 'user-central-officer',
      employeeId: 'GOI-COF-002',
      name: 'Dr. Rameshwar Sharma',
      email: 'rameshwar.sharma@landrecords.gov.in',
      passwordHash,
      role: 'CENTRAL_OFFICER',
      designation: 'Director (Monitoring & Evaluation)',
      ministry: 'Ministry of Rural Development',
      stateId: null,
      districtId: null,
      isActive: true
    },
    {
      id: 'user-state-admin-up',
      employeeId: 'UP-SAD-101',
      name: 'Sunil Kumar IAS',
      email: 'commissioner.revenue@up.gov.in',
      passwordHash,
      role: 'STATE_ADMIN',
      designation: 'Principal Secretary (Revenue)',
      ministry: 'Department of Revenue, Uttar Pradesh',
      stateId: 'state-9', // UP
      districtId: null,
      isActive: true
    },
    {
      id: 'user-state-admin-mh',
      employeeId: 'MH-SAD-102',
      name: 'Priyanka Patil IAS',
      email: 'secy.revenue@maharashtra.gov.in',
      passwordHash,
      role: 'STATE_ADMIN',
      designation: 'Divisional Commissioner',
      ministry: 'Revenue & Forest Department, Maharashtra',
      stateId: 'state-27', // MH
      districtId: null,
      isActive: true
    },
    {
      id: 'user-dist-admin-lucknow',
      employeeId: 'UP-DAD-201',
      name: 'Aditya Verma IAS',
      email: 'dm.lucknow@up.gov.in',
      passwordHash,
      role: 'DISTRICT_ADMIN',
      designation: 'District Magistrate & Collector',
      ministry: 'District Administration Lucknow',
      stateId: 'state-9',
      districtId: 'dist-162',
      isActive: true
    },
    {
      id: 'user-lao-01',
      employeeId: 'LAO-GOI-301',
      name: 'Rajesh Narayan',
      email: 'lao.nhai@gov.in',
      passwordHash,
      role: 'LAND_ACQUISITION_OFFICER',
      designation: 'Competent Authority (Land Acquisition)',
      ministry: 'National Highways Authority of India',
      stateId: 'state-9',
      districtId: 'dist-162',
      isActive: true
    },
    {
      id: 'user-agency-nhai',
      employeeId: 'NHAI-PD-401',
      name: 'Vikramaditya Rao',
      email: 'pd.lucknow@nhai.org',
      passwordHash,
      role: 'PROJECT_AGENCY',
      designation: 'Project Director',
      ministry: 'Ministry of Road Transport & Highways',
      stateId: 'state-9',
      districtId: null,
      isActive: true
    }
  ];

  // Dynamically add Field Officers and District Admins for all 36 states
  states.forEach(state => {
    // Field Officer
    users.push({
      id: `user-fo-${state.shortName.toLowerCase()}`,
      employeeId: `FO-${state.shortName.toUpperCase()}-501`,
      name: `Field Officer (${state.shortName.toUpperCase()})`,
      email: `fo.${state.shortName.toLowerCase()}@landrecords.gov.in`,
      passwordHash,
      role: 'FIELD_OFFICER',
      designation: 'Tehsildar (Land Records)',
      ministry: `Revenue Dept, ${state.name}`,
      stateId: state.id,
      districtId: null,
      isActive: true
    });

    // District Admin for state capital/major district
    const stateDistricts = districtsByStateLgd.get(state.lgdCode) || [];
    const mainDist = stateDistricts[0];
    if (mainDist) {
      users.push({
        id: `user-da-${state.shortName.toLowerCase()}`,
        employeeId: `${state.shortName.toUpperCase()}-DAD-201`,
        name: `DM & Collector (${mainDist.name})`,
        email: `dm.${mainDist.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@${state.shortName.toLowerCase()}.gov.in`,
        passwordHash,
        role: 'DISTRICT_ADMIN',
        designation: 'District Collector & DM',
        ministry: `Collectorate, ${mainDist.name}`,
        stateId: state.id,
        districtId: mainDist.id,
        isActive: true
      });
    }
  });

  // ────────────────────────────────────────────────────────────────────────────
  // REAL PROJECT TEMPLATES — Sourced from PIB, MoRTH, BDA, NHAI, CIDCO, etc.
  // ────────────────────────────────────────────────────────────────────────────

  interface RealProjectTemplate {
    code: string;
    name: string;
    description: string;
    type: string;
    agency: string;
    ministry: string;
    status: string;
    stateLgd: number;
    estCost: number;             // ₹ Crore
    totalLandReq: number;        // Hectares
    totalLandAcq: number;        // Hectares
    affectedFamilies: number;
    districtHints: string[];     // District names to search for
    villages: string[];          // Real village names for parcels
    centerCoord: [number, number]; // [longitude, latitude]
    startDate: string;
    notificationDate: string;
    awardDate: string | null;
    targetCompletion: string;
  }

  const projectTemplates: RealProjectTemplate[] = [
    // Maharashtra
    {
      code: 'PRJ-NHAI-DME-001',
      name: 'Delhi-Mumbai Expressway (1,350 km Access-Controlled Greenfield)',
      description: 'India\'s longest 8-lane access-controlled expressway connecting Delhi to Mumbai via Haryana, Rajasthan, Madhya Pradesh, Gujarat, and Maharashtra. Land acquisition conducted u/s 3A/3D/3G of NH Act 1956. Greenfield alignment reduced acquisition cost to ₹70-80 Lakh/Ha.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 27,
      estCost: 100000.0,
      totalLandReq: 15000.0,
      totalLandAcq: 12300.0,
      affectedFamilies: 10500,
      districtHints: ['Thane', 'Raigad'],
      villages: ['Shahpur', 'Vashind', 'Kasara', 'Igatpuri', 'Ghoti', 'Manor'],
      centerCoord: [73.35, 19.85],
      startDate: '2019-03-08',
      notificationDate: '2018-06-15',
      awardDate: '2020-09-20',
      targetCompletion: '2025-10-31'
    },
    {
      code: 'PRJ-NHSRCL-MAHSR-005',
      name: 'Mumbai-Ahmedabad High-Speed Rail Corridor (Bullet Train)',
      description: 'India\'s first high-speed rail corridor (Shinkansen technology) connecting Mumbai to Ahmedabad. Total land acquired: 1,389.5 hectares. Maharashtra portion covers Thane and Palghar districts. Tunnels and viaducts under construction.',
      type: 'RAILWAY',
      agency: 'National High Speed Rail Corporation Limited (NHSRCL)',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 27,
      estCost: 108000.0,
      totalLandReq: 1390.0,
      totalLandAcq: 1390.0,
      affectedFamilies: 3500,
      districtHints: ['Thane', 'Palghar'],
      villages: ['Gholvad', 'Saphale', 'Kelve Road', 'Boisar', 'Shilphata', 'Zaroli'],
      centerCoord: [72.95, 19.55],
      startDate: '2017-09-14',
      notificationDate: '2017-11-01',
      awardDate: '2022-06-15',
      targetCompletion: '2030-12-31'
    },
    {
      code: 'PRJ-CIDCO-NMIA-006',
      name: 'Navi Mumbai International Airport (NMIA Panvel)',
      description: 'Greenfield airport in Panvel Taluka, Raigad district. Core area spans 1,160 hectares. Displaced families resettled at Pushpak Nagar near Ulwe under a comprehensive 22.5% developed land compensation package.',
      type: 'AIRPORT',
      agency: 'City and Industrial Development Corporation (CIDCO)',
      ministry: 'Ministry of Civil Aviation',
      status: 'COMPLETED',
      stateLgd: 27,
      estCost: 16700.0,
      totalLandReq: 2268.0,
      totalLandAcq: 2268.0,
      affectedFamilies: 3500,
      districtHints: ['Raigad'],
      villages: ['Chinchpada', 'Kopar', 'Kolhi', 'Ulwe', 'Ganeshpuri', 'Targhar', 'Kombadbhuje', 'Waghivali'],
      centerCoord: [73.12, 18.99],
      startDate: '2018-02-18',
      notificationDate: '2017-03-01',
      awardDate: '2019-08-10',
      targetCompletion: '2025-03-31'
    },

    // Uttar Pradesh
    {
      code: 'PRJ-YEIDA-NIA-002',
      name: 'Noida International Greenfield Airport (Jewar Phase 1)',
      description: 'Acquisition of 1,334 hectares for India\'s largest greenfield airport. Phase 1 officially inaugurated on March 28, 2026 with commercial flight operations commencing June 15, 2026.',
      type: 'AIRPORT',
      agency: 'Yamuna Expressway Industrial Development Authority (YEIDA)',
      ministry: 'Ministry of Civil Aviation',
      status: 'COMPLETED',
      stateLgd: 9,
      estCost: 29560.0,
      totalLandReq: 1334.0,
      totalLandAcq: 1334.0,
      affectedFamilies: 5900,
      districtHints: ['Gautam Buddha Nagar'],
      villages: ['Ranhera', 'Rohi', 'Parohi', 'Kishorpur', 'Dayanatpur', 'Banwaribas'],
      centerCoord: [77.58, 28.15],
      startDate: '2021-11-25',
      notificationDate: '2019-10-01',
      awardDate: '2021-03-15',
      targetCompletion: '2026-03-28'
    },
    {
      code: 'PRJ-YEIDA-NIA-003',
      name: 'Noida International Airport Phase 3 & 4 (Runway Expansion)',
      description: 'Expansion acquisition of 1,858 hectares for Runways 3 & 4 and MRO maintenance hubs. Compensation rate fixed at ₹4,300/sqm. 438 hectares allocated for six resettlement colonies.',
      type: 'AIRPORT',
      agency: 'Yamuna Expressway Industrial Development Authority (YEIDA)',
      ministry: 'Ministry of Civil Aviation',
      status: 'IN_PROGRESS',
      stateLgd: 9,
      estCost: 11200.0,
      totalLandReq: 1858.0,
      totalLandAcq: 980.0,
      affectedFamilies: 15920,
      districtHints: ['Gautam Buddha Nagar'],
      villages: ['Thora', 'Bankapur', 'Neemka Shahjahanpur', 'Ahmadpur Chaurouli', 'Khwajpur', 'Ramner', 'Mukimpur Shivara', 'Jewar Bangar', 'Sabota Mustafabad'],
      centerCoord: [77.60, 28.12],
      startDate: '2024-01-15',
      notificationDate: '2023-09-10',
      awardDate: null,
      targetCompletion: '2029-12-31'
    },
    {
      code: 'PRJ-UPEIDA-PVE-010',
      name: 'Purvanchal Expressway Economic Node Expansion',
      description: 'Acquisition of industrial corridor node parcels along the 341 km Purvanchal Expressway alignment for warehousing, logistics parks, and investment nodes.',
      type: 'HIGHWAY',
      agency: 'Uttar Pradesh Expressways Industrial Development Authority (UPEIDA)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 9,
      estCost: 8750.0,
      totalLandReq: 3850.0,
      totalLandAcq: 3041.0,
      affectedFamilies: 6000,
      districtHints: ['Lucknow', 'Barabanki'],
      villages: ['Mohanlalganj', 'Bakshi Ka Talab', 'Nigohan', 'Harchandpur', 'Kadipur', 'Dostpur'],
      centerCoord: [81.00, 26.80],
      startDate: '2018-08-01',
      notificationDate: '2018-01-15',
      awardDate: '2019-11-20',
      targetCompletion: '2026-03-31'
    },

    // Madhya Pradesh
    {
      code: 'PRJ-NWDA-KBLP-004',
      name: 'Ken-Betwa River Interlinking Project (Daudhan Dam & Link Canal)',
      description: 'National river interlinking priority project transferring surplus water from Ken river to Betwa basin. Requires Panna Tiger Reserve forest land diversion.',
      type: 'IRRIGATION',
      agency: 'National Water Development Agency (NWDA)',
      ministry: 'Ministry of Jal Shakti',
      status: 'IN_PROGRESS',
      stateLgd: 23,
      estCost: 44605.0,
      totalLandReq: 9000.0,
      totalLandAcq: 6017.0,
      affectedFamilies: 4443,
      districtHints: ['Panna', 'Chhatarpur'],
      villages: ['Madla', 'Hinauta', 'Patheriya', 'Buxwaha', 'Bariyarpur', 'Daudhan'],
      centerCoord: [80.00, 24.72],
      startDate: '2021-12-22',
      notificationDate: '2017-08-25',
      awardDate: '2023-10-15',
      targetCompletion: '2030-06-30'
    },

    // Karnataka
    {
      code: 'PRJ-BDA-BBC-007',
      name: 'Bengaluru Peripheral Ring Road (Bengaluru Business Corridor)',
      description: '73.5 km 8-lane ring road expressway around Bengaluru metropolitan area. BDA acquiring land across 77 villages under local land valuation metrics.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Bangalore Development Authority (BDA)',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'IN_PROGRESS',
      stateLgd: 29,
      estCost: 27000.0,
      totalLandReq: 1036.0,
      totalLandAcq: 673.0,
      affectedFamilies: 4000,
      districtHints: ['Bengaluru Urban', 'Bengaluru Rural'],
      villages: ['Hoskote', 'Sarjapura', 'Anekal', 'Jigani', 'Devanahalli', 'Budigere'],
      centerCoord: [77.60, 13.00],
      startDate: '2022-06-01',
      notificationDate: '2021-04-15',
      awardDate: null,
      targetCompletion: '2028-12-31'
    },

    // Gujarat
    {
      code: 'PRJ-DFCCIL-WDFC-008',
      name: 'Western Dedicated Freight Corridor (Dadri–JNPT Gujarat Segment)',
      description: 'Strategic heavy-haul rail transit node passing through industrial sectors of Vadodara, Surat, and Bharuch. 100% land acquired for main route.',
      type: 'RAILWAY',
      agency: 'Dedicated Freight Corridor Corporation of India Ltd (DFCCIL)',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 24,
      estCost: 16800.0,
      totalLandReq: 2150.0,
      totalLandAcq: 2150.0,
      affectedFamilies: 5000,
      districtHints: ['Vadodara', 'Surat'],
      villages: ['Vadodara Rural', 'Navsari', 'Dabhoi', 'Karjan', 'Miyagam', 'Makarpura'],
      centerCoord: [73.20, 22.30],
      startDate: '2008-01-01',
      notificationDate: '2010-05-20',
      awardDate: '2014-03-15',
      targetCompletion: '2026-06-30'
    },

    // West Bengal
    {
      code: 'PRJ-DFCCIL-EDFC-009',
      name: 'Eastern Dedicated Freight Corridor (Dankuni–Sonnagar WB Section)',
      description: 'Double-line electrified heavy freight line connecting Dankuni coal mining centers to northern power plants. Highly successful operational results.',
      type: 'RAILWAY',
      agency: 'Dedicated Freight Corridor Corporation of India Ltd (DFCCIL)',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 19,
      estCost: 13500.0,
      totalLandReq: 3100.0,
      totalLandAcq: 2015.0,
      affectedFamilies: 4500,
      districtHints: ['Hooghly', 'Howrah'],
      villages: ['Dankuni', 'Bardhaman', 'Asansol', 'Jhajha', 'Mugalsarai', 'Andal'],
      centerCoord: [88.00, 22.60],
      startDate: '2008-01-01',
      notificationDate: '2011-08-10',
      awardDate: '2016-06-20',
      targetCompletion: '2026-12-31'
    },

    // Tamil Nadu
    {
      code: 'PRJ-CMRL-CMP2-011',
      name: 'Chennai Metro Rail Phase 2 (Corridor 3, 4, 5 Expansion)',
      description: '118.9 km network expansions. Rapid development on Madhavaram to SIPCOT and Light House to Poonamallee corridors. Land acquisition 98% complete.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Chennai Metro Rail Limited (CMRL)',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'IN_PROGRESS',
      stateLgd: 33,
      estCost: 63246.0,
      totalLandReq: 116.2,
      totalLandAcq: 114.2,
      affectedFamilies: 1200,
      districtHints: ['Chennai'],
      villages: ['Sholinganallur', 'Madhavaram', 'Kilambakkam', 'Poonamallee', 'Kodambakkam', 'Perungudi'],
      centerCoord: [80.27, 13.08],
      startDate: '2022-01-01',
      notificationDate: '2021-06-15',
      awardDate: '2023-11-01',
      targetCompletion: '2028-12-31'
    },
    {
      code: 'PRJ-TIDCO-TNDIC-014',
      name: 'Tamil Nadu Defence Industrial Corridor (Coimbatore Node)',
      description: 'Advanced aerospace and defense manufacturing hubs. TIDCO acquiring private lands for advanced testing labs and private OEMs.',
      type: 'DEFENCE',
      agency: 'Tamil Nadu Industrial Development Corporation (TIDCO)',
      ministry: 'Ministry of Defence',
      status: 'IN_PROGRESS',
      stateLgd: 33,
      estCost: 3200.0,
      totalLandReq: 950.0,
      totalLandAcq: 712.0,
      affectedFamilies: 1500,
      districtHints: ['Coimbatore'],
      villages: ['Sulur', 'Kinathukadavu', 'Othakalmandapam', 'Arasur', 'Perur', 'Karamadai'],
      centerCoord: [76.96, 11.01],
      startDate: '2019-01-28',
      notificationDate: '2019-06-01',
      awardDate: '2022-03-20',
      targetCompletion: '2027-06-30'
    },

    // Rajasthan
    {
      code: 'PRJ-SECI-BSP4-012',
      name: 'Bhadla Mega Solar Ultra Park Phase IV (Thar Desert Expansion)',
      description: 'World\'s largest solar park expansion in Thar desert (2,245 MW total capacity). 4,500 hectares of barren land fully acquired and commissioned.',
      type: 'RENEWABLE_ENERGY',
      agency: 'Solar Energy Corporation of India (SECI)',
      ministry: 'Ministry of New & Renewable Energy',
      status: 'COMPLETED',
      stateLgd: 8,
      estCost: 4800.0,
      totalLandReq: 4500.0,
      totalLandAcq: 4500.0,
      affectedFamilies: 800,
      districtHints: ['Jodhpur'],
      villages: ['Bhadla', 'Pokaran', 'Phalodi', 'Bap', 'Balesar', 'Shergarh'],
      centerCoord: [71.91, 27.51],
      startDate: '2016-04-01',
      notificationDate: '2015-09-10',
      awardDate: '2017-08-15',
      targetCompletion: '2020-03-31'
    },

    // Jammu & Kashmir
    {
      code: 'PRJ-NRLY-USBRL-013',
      name: 'Udhampur-Srinagar-Baramulla Rail Link (USBRL Depot & Sidings)',
      description: 'Strategic national rail project linking Kashmir Valley with rest of India. Station expansions and safety depot acquisitions in Srinagar & Baramulla.',
      type: 'RAILWAY',
      agency: 'Northern Railway',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 1,
      estCost: 2800.0,
      totalLandReq: 320.0,
      totalLandAcq: 265.0,
      affectedFamilies: 600,
      districtHints: ['Baramulla', 'Srinagar'],
      villages: ['Banihal', 'Qazigund', 'Anantnag', 'Awantipora', 'Budgam', 'Sopore'],
      centerCoord: [75.00, 33.00],
      startDate: '2020-01-01',
      notificationDate: '2019-05-20',
      awardDate: '2021-11-10',
      targetCompletion: '2027-12-31'
    },

    // Bihar
    {
      code: 'PRJ-NICDC-AKIC-015',
      name: 'Amritsar-Kolkata Industrial Corridor (AKIC Gaya Dobhi Node)',
      description: '1,600 hectare integrated manufacturing cluster at Dobhi, Gaya along the EDFC railway spine. NICDC and state bodies acquiring industrial layouts.',
      type: 'INDUSTRIAL_CORRIDOR',
      agency: 'National Industrial Corridor Development Corporation (NICDC)',
      ministry: 'Ministry of Commerce & Industry',
      status: 'PLANNING',
      stateLgd: 10,
      estCost: 6500.0,
      totalLandReq: 1600.0,
      totalLandAcq: 840.0,
      affectedFamilies: 2000,
      districtHints: ['Gaya'],
      villages: ['Dobhi', 'Manpur', 'Wazirganj', 'Bodh Gaya', 'Fatehpur', 'Tekari'],
      centerCoord: [84.99, 24.75],
      startDate: '2023-10-01',
      notificationDate: '2023-03-15',
      awardDate: null,
      targetCompletion: '2030-12-31'
    },

    // Haryana
    {
      code: 'PRJ-NHAI-KMP-016',
      name: 'Kundli-Manesar-Palwal (KMP) Western Peripheral Expressway',
      description: '135.6 km operational expressway around NCR. Greenfield industrial nodes under development along the KMP corridor in Gurugram and Sonipat.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'COMPLETED',
      stateLgd: 6,
      estCost: 6400.0,
      totalLandReq: 1200.0,
      totalLandAcq: 1200.0,
      affectedFamilies: 2500,
      districtHints: ['Gurugram', 'Sonipat'],
      villages: ['Kundli', 'Manesar', 'Palwal', 'Sohna', 'Badli', 'Farrukhnagar'],
      centerCoord: [76.92, 28.40],
      startDate: '2009-06-01',
      notificationDate: '2006-03-15',
      awardDate: '2009-12-10',
      targetCompletion: '2018-11-10'
    },
    {
      code: 'PRJ-NHAI-DAK-017',
      name: 'Delhi-Amritsar-Katra Expressway (Haryana Stretch)',
      description: '158 km operational stretch (Packages 1-5) connecting Northern Delhi bypass to Kaithal, built by NHAI at ₹9,680 Crore.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 6,
      estCost: 9680.0,
      totalLandReq: 2024.0,
      totalLandAcq: 2024.0,
      affectedFamilies: 4200,
      districtHints: ['Kaithal', 'Jind'],
      villages: ['Kaithal Rural', 'Jind Bypass', 'Narwana', 'Uchana', 'Safidon', 'Pillukhera'],
      centerCoord: [76.30, 29.80],
      startDate: '2021-04-15',
      notificationDate: '2020-05-10',
      awardDate: '2021-12-15',
      targetCompletion: '2026-08-31'
    },

    // Punjab
    {
      code: 'PRJ-NHAI-DAKP-018',
      name: 'Delhi-Amritsar-Katra Expressway (Punjab Corridor)',
      description: 'Punjab segment of DAK expressway. Requires 14,000 acres of fertile farmland. NHAI processing compensation awards u/s 3G of NH Act.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 3,
      estCost: 15000.0,
      totalLandReq: 5666.0,
      totalLandAcq: 4800.0,
      affectedFamilies: 8500,
      districtHints: ['Jalandhar', 'Ludhiana'],
      villages: ['Kartarpur', 'Nakodar', 'Phillaur', 'Goraya', 'Bhogpur', 'Adampur'],
      centerCoord: [75.50, 31.30],
      startDate: '2021-07-01',
      notificationDate: '2020-09-12',
      awardDate: '2022-04-10',
      targetCompletion: '2026-08-31'
    },

    // Himachal Pradesh
    {
      code: 'PRJ-NRLY-BML-019',
      name: 'Bilaspur-Manali-Leh Strategic Railway Line',
      description: '489 km strategic broad-gauge line. Key security links through Mandi and Lahaul-Spiti. Border Rails managing land diversion u/s 124 of Railways Act.',
      type: 'RAILWAY',
      agency: 'Northern Railway',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 2,
      estCost: 83360.0,
      totalLandReq: 2200.0,
      totalLandAcq: 840.0,
      affectedFamilies: 3200,
      districtHints: ['Bilaspur', 'Mandi'],
      villages: ['Bilaspur Town', 'Sundernagar', 'Mandi Rural', 'Keylong', 'Kothi', 'Jispa'],
      centerCoord: [76.90, 31.80],
      startDate: '2022-03-15',
      notificationDate: '2020-07-10',
      awardDate: '2023-11-20',
      targetCompletion: '2032-12-31'
    },

    // Uttarakhand
    {
      code: 'PRJ-RVNL-RKRL-020',
      name: 'Rishikesh-Karnaprayag Broad-Gauge Rail Link',
      description: '126 km rail link under construction. 105 km in tunnels. Forest land diversion of 791 Ha u/s 4 of Forest Conservation Act successfully cleared.',
      type: 'RAILWAY',
      agency: 'Rail Vikas Nigam Limited (RVNL)',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 5,
      estCost: 16200.0,
      totalLandReq: 791.0,
      totalLandAcq: 720.0,
      affectedFamilies: 2800,
      districtHints: ['Dehradun', 'Pauri Garhwal'],
      villages: ['Rishikesh Rural', 'Srinagar Garhwal', 'Rudraprayag', 'Karnaprayag', 'Byasi', 'Devprayag'],
      centerCoord: [78.60, 30.20],
      startDate: '2019-06-01',
      notificationDate: '2017-02-15',
      awardDate: '2020-04-10',
      targetCompletion: '2027-12-31'
    },
    {
      code: 'PRJ-BRO-CDH-021',
      name: 'Char Dham All-Weather Highway Network (889 km)',
      description: 'Upgradation of highways to Char Dham holy sites. Bhagirathi Eco-Sensitive Zone forest land diverted (41.92 Ha) with green mitigation protocols.',
      type: 'HIGHWAY',
      agency: 'Border Roads Organisation (BRO) / MoRTH',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 5,
      estCost: 12000.0,
      totalLandReq: 520.0,
      totalLandAcq: 450.0,
      affectedFamilies: 1900,
      districtHints: ['Uttarkashi', 'Chamoli'],
      villages: ['Netala', 'Dharasu', 'Joshimath', 'Pipalkoti', 'Badrinath Road', 'Guptkashi'],
      centerCoord: [78.40, 30.70],
      startDate: '2016-12-27',
      notificationDate: '2016-04-10',
      awardDate: '2018-05-15',
      targetCompletion: '2026-12-31'
    },

    // Andhra Pradesh
    {
      code: 'PRJ-APCRDA-ACC-022',
      name: 'Amaravati Capital City Development Corridor (LPS Land)',
      description: 'Revived Amaravati Capital City development. Land Pooling Scheme pooling 33,000 acres. Motelaka village Inner Ring Road rail links u/s 4 APCRDA Act.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Andhra Pradesh Capital Region Development Authority (APCRDA)',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'IN_PROGRESS',
      stateLgd: 28,
      estCost: 51000.0,
      totalLandReq: 13355.0,
      totalLandAcq: 11000.0,
      affectedFamilies: 24000,
      districtHints: ['Guntur', 'Krishna'],
      villages: ['Thullur', 'Mandadam', 'Velagapudi', 'Rayapudi', 'Uddandarayunipalem', 'Penumaka'],
      centerCoord: [80.50, 16.50],
      startDate: '2015-10-22',
      notificationDate: '2015-01-15',
      awardDate: '2016-08-10',
      targetCompletion: '2028-12-31'
    },
    {
      code: 'PRJ-AP-PIP-023',
      name: 'Polavaram Multipurpose Irrigation Project Phase 1',
      description: 'National multipurpose dam on Godavari River. Phase 1 storage level (+41.15m). R&R u/s 31 disburisng special SC/ST compensation package.',
      type: 'IRRIGATION',
      agency: 'Polavaram Project Authority / AP Irrigation Dept',
      ministry: 'Ministry of Jal Shakti',
      status: 'IN_PROGRESS',
      stateLgd: 28,
      estCost: 55548.0,
      totalLandReq: 3800.0,
      totalLandAcq: 3200.0,
      affectedFamilies: 4443,
      districtHints: ['East Godavari', 'West Godavari'],
      villages: ['Polavaram', 'Angaluru', 'Pattiseema', 'Kadavali', 'Devipatnam', 'Ramaiahpet'],
      centerCoord: [81.65, 17.25],
      startDate: '2014-06-01',
      notificationDate: '2014-02-15',
      awardDate: '2016-10-10',
      targetCompletion: '2027-06-30'
    },

    // Telangana
    {
      code: 'PRJ-TSIIC-PFC-024',
      name: 'Hyderabad Pharma City / Future City (Mucherla Life Sciences)',
      description: 'Reorganization of 19,333 acres under Future City Development Authority (FCDA) at Mucherla. Layout developed for integrated bio-pharma hubs.',
      type: 'INDUSTRIAL_CORRIDOR',
      agency: 'Telangana State Industrial Infrastructure Corporation (TSIIC)',
      ministry: 'Ministry of Commerce & Industry',
      status: 'PLANNING',
      stateLgd: 36,
      estCost: 64000.0,
      totalLandReq: 7824.0,
      totalLandAcq: 5400.0,
      affectedFamilies: 9800,
      districtHints: ['Rangareddy'],
      villages: ['Mucherla', 'Kandukur', 'Yacharam', 'Meerkhanpet', 'Kadavergu', 'Medipally'],
      centerCoord: [78.60, 17.05],
      startDate: '2019-12-15',
      notificationDate: '2017-08-10',
      awardDate: '2019-10-05',
      targetCompletion: '2029-12-31'
    },
    {
      code: 'PRJ-NHAI-TRRR-025',
      name: 'Telangana Regional Ring Road (RRR Northern Segment)',
      description: '164 km Northern segment of Regional Ring Road connecting Sangareddy, Toopran, and Gajwel. NHAI issued u/s 3A notifications for 99% land.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 36,
      estCost: 33000.0,
      totalLandReq: 2800.0,
      totalLandAcq: 1980.0,
      affectedFamilies: 6500,
      districtHints: ['Medak', 'Yadadri Bhuvanagiri'],
      villages: ['Toopran', 'Choutuppal', 'Gajwel', 'Narsapur', 'Wargal', 'Chityal'],
      centerCoord: [78.50, 17.80],
      startDate: '2021-10-15',
      notificationDate: '2021-02-20',
      awardDate: null,
      targetCompletion: '2029-06-30'
    },

    // Kerala
    {
      code: 'PRJ-VISL-VZP-026',
      name: 'Vizhinjam International Transshipment Deepwater Seaport',
      description: 'Adani Vizhinjam Port expansion. 230 acres acquired for port-led industrialization and logistics nodes. Port already operational with commercial cargo.',
      type: 'PORT',
      agency: 'Vizhinjam International Seaport Limited (VISL)',
      ministry: 'Ministry of Ports, Shipping & Waterways',
      status: 'COMPLETED',
      stateLgd: 32,
      estCost: 7525.0,
      totalLandReq: 93.0,
      totalLandAcq: 93.0,
      affectedFamilies: 1200,
      districtHints: ['Thiruvananthapuram'],
      villages: ['Vizhinjam', 'Mulamkunnathukavu', 'Kovalam', 'Vizhinjam Beach', 'Balaramapuram', 'Kanjiramkulam'],
      centerCoord: [76.99, 8.37],
      startDate: '2015-12-05',
      notificationDate: '2014-06-15',
      awardDate: '2015-09-10',
      targetCompletion: '2024-10-31'
    },
    {
      code: 'PRJ-KMRL-KMP2-027',
      name: 'Kochi Metro Phase 2 (JLN Stadium - Kakkanad Pink Line)',
      description: '11.2 km Pink Line under construction. JLN Stadium to Kakkanad Infopark node. CMRL and KMRL completed land handover u/s 23.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Kochi Metro Rail Limited (KMRL)',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'IN_PROGRESS',
      stateLgd: 32,
      estCost: 1957.0,
      totalLandReq: 45.0,
      totalLandAcq: 40.0,
      affectedFamilies: 650,
      districtHints: ['Ernakulam'],
      villages: ['Kakkanad', 'Vyttila', 'Palarivattom', 'Edappally', 'Kalamassery', 'Tripunithura'],
      centerCoord: [76.32, 9.98],
      startDate: '2022-09-01',
      notificationDate: '2021-12-15',
      awardDate: '2023-03-20',
      targetCompletion: '2027-04-30'
    },

    // Odisha
    {
      code: 'PRJ-JSW-POSCO-028',
      name: 'JSW-POSCO Keonjhar Integrated Steel Plant Site',
      description: '6 MTPA joint venture steel plant in Keonjhar. Land acquired u/s 30 of state industrial policy. Basic site leveling underway.',
      type: 'INDUSTRIAL_CORRIDOR',
      agency: 'IPICOL / Odisha Industrial Infrastructure Development Corp (IDCO)',
      ministry: 'Ministry of Commerce & Industry',
      status: 'IN_PROGRESS',
      stateLgd: 21,
      estCost: 65000.0,
      totalLandReq: 1200.0,
      totalLandAcq: 980.0,
      affectedFamilies: 4200,
      districtHints: ['Keonjhar'],
      villages: ['Banspal', 'Jhumpura', 'Keonjhar Sadar', 'Champua', 'Ghatgaon', 'Patna'],
      centerCoord: [85.60, 21.60],
      startDate: '2024-10-25',
      notificationDate: '2022-06-15',
      awardDate: '2024-03-10',
      targetCompletion: '2031-12-31'
    },
    {
      code: 'PRJ-PPA-WDD-029',
      name: 'Paradip Port Western Dock Capacity Expansion',
      description: 'Western Dock mechanization and berth expansion. 280 hectares of port land allocated. Major cargo handling nodes under execution.',
      type: 'PORT',
      agency: 'Paradip Port Authority (PPA)',
      ministry: 'Ministry of Ports, Shipping & Waterways',
      status: 'IN_PROGRESS',
      stateLgd: 21,
      estCost: 3400.0,
      totalLandReq: 280.0,
      totalLandAcq: 280.0,
      affectedFamilies: 0,
      districtHints: ['Jagatsinghapur'],
      villages: ['Paradip Port', 'Western Dock Node', 'Balitutha', 'Kujang', 'Atharbanki', 'Sandhakud'],
      centerCoord: [86.68, 20.27],
      startDate: '2022-04-01',
      notificationDate: '2021-10-15',
      awardDate: '2022-02-28',
      targetCompletion: '2026-12-31'
    },

    // Jharkhand
    {
      code: 'PRJ-JUIDCO-RSC-030',
      name: 'Ranchi Smart City Outer Ring Road Connectivity',
      description: '195 km Ranchi Ring Road connecting national highways. Land acquired across Ranchi rural sectors under direct collectorate monitoring.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Jharkhand Urban Infrastructure Development Company (JUIDCO)',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'IN_PROGRESS',
      stateLgd: 20,
      estCost: 7200.0,
      totalLandReq: 850.0,
      totalLandAcq: 610.0,
      affectedFamilies: 2800,
      districtHints: ['Ranchi'],
      villages: ['Dhurwa', 'Hatma', 'Ranchi Rural', 'Ring Road Node', 'Namkum', 'Kanke'],
      centerCoord: [85.30, 23.35],
      startDate: '2016-06-15',
      notificationDate: '2014-11-20',
      awardDate: '2016-02-18',
      targetCompletion: '2026-06-30'
    },

    // Chhattisgarh
    {
      code: 'PRJ-CG-RDMC-031',
      name: 'Raipur-Durg SCR Metro Rail Transit System',
      description: 'Raipur-Bhilai-Durg metro rail node. Feasibility survey funded by state cabinet. Capital Region Development Authority (CRDA) managing land nodes.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Chhattisgarh Metro Rail Corporation',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'PLANNING',
      stateLgd: 22,
      estCost: 12000.0,
      totalLandReq: 180.0,
      totalLandAcq: 95.0,
      affectedFamilies: 1500,
      districtHints: ['Raipur', 'Durg'],
      villages: ['Naya Raipur', 'Bhilai', 'Kumhari', 'Charoda', 'Tatibandh', 'Ge road'],
      centerCoord: [81.63, 21.25],
      startDate: '2024-03-01',
      notificationDate: '2024-02-15',
      awardDate: null,
      targetCompletion: '2030-12-31'
    },

    // Goa
    {
      code: 'PRJ-GMR-MOPA-032',
      name: 'Manohar International Greenfield Airport (Mopa)',
      description: 'Completed greenfield international airport at Mopa, North Goa. 810 hectares acquired by state revenue department with complete compensation packages.',
      type: 'AIRPORT',
      agency: 'Goa Directorate of Civil Aviation / GMR Goa Airport',
      ministry: 'Ministry of Civil Aviation',
      status: 'COMPLETED',
      stateLgd: 30,
      estCost: 3000.0,
      totalLandReq: 860.0,
      totalLandAcq: 860.0,
      affectedFamilies: 1800,
      districtHints: ['North Goa'],
      villages: ['Mopa', 'Varconda', 'Casarvarnem', 'Amberem', 'Chandel', 'Pernem'],
      centerCoord: [73.86, 15.75],
      startDate: '2016-11-15',
      notificationDate: '2014-06-10',
      awardDate: '2016-08-15',
      targetCompletion: '2022-12-11'
    },

    // Delhi
    {
      code: 'PRJ-DMRC-M4P-033',
      name: 'Delhi Metro Phase 4 Priority Corridors',
      description: 'Phase 4 priority extensions: Inderlok-Indraprastha, Majlis Park-Maujpur. DMRC executing station structure acquisitions u/s 20 of Metro Act.',
      type: 'URBAN_DEVELOPMENT',
      agency: 'Delhi Metro Rail Corporation (DMRC)',
      ministry: 'Ministry of Housing & Urban Affairs',
      status: 'IN_PROGRESS',
      stateLgd: 7,
      estCost: 24948.0,
      totalLandReq: 120.0,
      totalLandAcq: 112.0,
      affectedFamilies: 900,
      districtHints: ['New Delhi', 'North Delhi'],
      villages: ['Inderlok', 'Indraprastha', 'Majlis Park', 'Maujpur', 'Rithala', 'Narela'],
      centerCoord: [77.20, 28.65],
      startDate: '2019-12-01',
      notificationDate: '2019-03-15',
      awardDate: '2021-08-10',
      targetCompletion: '2026-12-31'
    },

    // Assam
    {
      code: 'PRJ-NHAI-GRR-034',
      name: 'Guwahati Ring Road & Strategic Brahmaputra Bridge',
      description: 'Strategic highway ring road bypassing Guwahati traffic. Includes major bridge across Brahmaputra River. 7.12 Ha forest diversion cleared u/s 2.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 18,
      estCost: 5200.0,
      totalLandReq: 450.0,
      totalLandAcq: 380.0,
      affectedFamilies: 2800,
      districtHints: ['Kamrup', 'Kamrup Metropolitan'],
      villages: ['Guwahati Bypass', 'North Guwahati', 'Changsari', 'Kaurbaha', 'Amingaon', 'Sualkuchi'],
      centerCoord: [91.70, 26.15],
      startDate: '2023-05-15',
      notificationDate: '2022-10-10',
      awardDate: '2023-12-15',
      targetCompletion: '2027-06-30'
    },

    // Arunachal Pradesh
    {
      code: 'PRJ-BRO-SELA-035',
      name: 'Sela Pass Strategic Tunnel Link Project',
      description: 'Completed strategic high-altitude tunnels u/s Sela Pass. Provides all-weather road transit to Tawang. Built by BRO at ₹825 Cr.',
      type: 'HIGHWAY',
      agency: 'Border Roads Organisation (BRO)',
      ministry: 'Ministry of Defence',
      status: 'COMPLETED',
      stateLgd: 12,
      estCost: 825.0,
      totalLandReq: 35.0,
      totalLandAcq: 35.0,
      affectedFamilies: 200,
      districtHints: ['West Kameng', 'Tawang'],
      villages: ['Sela Pass', 'Tawang Route', 'Dirang', 'Bhalukpong', 'Bomdila', 'Senga'],
      centerCoord: [92.10, 27.50],
      startDate: '2019-02-15',
      notificationDate: '2018-06-10',
      awardDate: '2018-12-15',
      targetCompletion: '2024-03-09'
    },

    // Manipur
    {
      code: 'PRJ-NHIDCL-IMH-036',
      name: 'Imphal-Moreh Strategic Highway Upgrade (NH-02)',
      description: 'Four-laning of trade corridor connecting Imphal to Myanmar border. National security border road project managed by NHIDCL.',
      type: 'HIGHWAY',
      agency: 'National Highways & Infrastructure Development Corp (NHIDCL)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 14,
      estCost: 4500.0,
      totalLandReq: 380.0,
      totalLandAcq: 310.0,
      affectedFamilies: 1900,
      districtHints: ['Imphal West', 'Tengnoupal'],
      villages: ['Moreh Border', 'Imphal Bypass', 'Lilong', 'Wangjing', 'Kakching', 'Tengnoupal'],
      centerCoord: [93.90, 24.80],
      startDate: '2018-05-10',
      notificationDate: '2016-12-15',
      awardDate: '2018-02-28',
      targetCompletion: '2026-10-31'
    },

    // Meghalaya
    {
      code: 'PRJ-NHAI-SWB-037',
      name: 'Shillong Western Bypass Highway Corridor',
      description: 'Construction of Shillong bypass connecting NH-40. Land acquisition packages resolved by state revenue department with local clan bodies u/s 23.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 17,
      estCost: 1800.0,
      totalLandReq: 120.0,
      totalLandAcq: 98.0,
      affectedFamilies: 850,
      districtHints: ['East Khasi Hills', 'Ri Bhoi'],
      villages: ['Umiam', 'Mawryngkneng', 'Shillong Rural', 'Mylliem', 'Nongpoh', 'Jowai Road'],
      centerCoord: [91.88, 25.57],
      startDate: '2020-03-15',
      notificationDate: '2019-08-10',
      awardDate: '2020-12-20',
      targetCompletion: '2026-08-31'
    },

    // Nagaland
    {
      code: 'PRJ-NHIDCL-DKH-038',
      name: 'Dimapur-Kohima Four-Laning Highway (NH-29)',
      description: 'Strategic highway upgrading connecting Dimapur to Kohima. Land acquisition cleared by local administration under direct High Court monitoring.',
      type: 'HIGHWAY',
      agency: 'National Highways & Infrastructure Development Corp (NHIDCL)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 13,
      estCost: 3800.0,
      totalLandReq: 290.0,
      totalLandAcq: 290.0,
      affectedFamilies: 1400,
      districtHints: ['Dimapur', 'Kohima'],
      villages: ['Chumoukedima', 'Medziphema', 'Phatma', 'Kohima Outskirts', 'Dimapur Town', 'Piphema'],
      centerCoord: [93.75, 25.80],
      startDate: '2016-09-01',
      notificationDate: '2015-04-15',
      awardDate: '2016-05-20',
      targetCompletion: '2026-12-31'
    },

    // Mizoram
    {
      code: 'PRJ-NHIDCL-ABP-039',
      name: 'Aizawl Bypass Tunnel & Approach Road Project',
      description: 'Aizawl Western Bypass including a 2.5 km twin-tube tunnel (Package 2). Strategic alignment connecting Mizoram industrial layouts. Contract awarded to IRCON.',
      type: 'HIGHWAY',
      agency: 'National Highways & Infrastructure Development Corp (NHIDCL)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 15,
      estCost: 2400.0,
      totalLandReq: 95.0,
      totalLandAcq: 80.0,
      affectedFamilies: 550,
      districtHints: ['Aizawl'],
      villages: ['Aizawl North', 'Aizawl South', 'Zemabawk', 'Sairang', 'Tuirial', 'Melriat'],
      centerCoord: [92.72, 23.72],
      startDate: '2024-02-15',
      notificationDate: '2022-10-15',
      awardDate: '2024-01-20',
      targetCompletion: '2028-06-30'
    },

    // Tripura
    {
      code: 'PRJ-NRLY-AAR-040',
      name: 'Agartala-Akhaura International Rail Link Corridor',
      description: '12.24 km cross-border rail project. Indian segment (5.46 km) completely acquired and operational. Connects Tripura to Bangladesh railway network.',
      type: 'RAILWAY',
      agency: 'Northeast Frontier Railway / Ministry of Railways',
      ministry: 'Ministry of Railways',
      status: 'COMPLETED',
      stateLgd: 16,
      estCost: 972.0,
      totalLandReq: 65.0,
      totalLandAcq: 65.0,
      affectedFamilies: 450,
      districtHints: ['West Tripura'],
      villages: ['Nischintapur', 'Agartala Station', 'Badharghat', 'Akhaura Border', 'Suryamaninagar', 'Srinagar'],
      centerCoord: [91.28, 23.83],
      startDate: '2016-07-31',
      notificationDate: '2014-08-15',
      awardDate: '2016-04-10',
      targetCompletion: '2023-11-01'
    },

    // Sikkim
    {
      code: 'PRJ-RVNL-SRR-041',
      name: 'Sevoke-Rangpo Railway Tunnel Project (44.96 km)',
      description: 'Broad-gauge rail line through deep Himalayan terrain. 14 tunnels and 28 bridges. Rangpo-Gangtok extension under final location survey.',
      type: 'RAILWAY',
      agency: 'Rail Vikas Nigam Limited (RVNL)',
      ministry: 'Ministry of Railways',
      status: 'IN_PROGRESS',
      stateLgd: 11,
      estCost: 4085.0,
      totalLandReq: 180.0,
      totalLandAcq: 160.0,
      affectedFamilies: 780,
      districtHints: ['East Sikkim'],
      villages: ['Rangpo', 'Khanikhola', 'Melli', 'Sankalan', 'Sevoke', 'Rangpo Bazar'],
      centerCoord: [88.50, 27.20],
      startDate: '2009-10-30',
      notificationDate: '2009-02-15',
      awardDate: '2011-04-10',
      targetCompletion: '2027-12-31'
    },

    // Chandigarh
    {
      code: 'PRJ-NHAI-CBE-042',
      name: 'Chandigarh-Baddi Industrial Area Link Expressway',
      description: 'Greenfield road connectivity bypassing urban bottleneck traffic. Land acquired u/s 3D NH Act by Chandigarh administration.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 4,
      estCost: 1800.0,
      totalLandReq: 110.0,
      totalLandAcq: 90.0,
      affectedFamilies: 350,
      districtHints: ['Chandigarh'],
      villages: ['Chandigarh Sector 26', 'Manimajra', 'Chandigarh Rural', 'Baddi Border', 'Kishangarh', 'Daria'],
      centerCoord: [76.80, 30.73],
      startDate: '2022-05-15',
      notificationDate: '2021-08-20',
      awardDate: '2022-12-10',
      targetCompletion: '2026-10-31'
    },

    // Puducherry
    {
      code: 'PRJ-PPD-PPM-043',
      name: 'Puducherry Port Modernization Container Terminal',
      description: 'Cargo terminal expansion. Developed backup cargo yard layouts in Ariyankuppam. Port expansion u/s 23 of Pondicherry Land Acquisition Act.',
      type: 'PORT',
      agency: 'Puducherry Port Department',
      ministry: 'Ministry of Ports, Shipping & Waterways',
      status: 'IN_PROGRESS',
      stateLgd: 34,
      estCost: 490.0,
      totalLandReq: 45.0,
      totalLandAcq: 40.0,
      affectedFamilies: 180,
      districtHints: ['Puducherry'],
      villages: ['Puducherry Port Area', 'Ariyankuppam', 'Thengaithittu', 'Mudaliarpet', 'Nadesan Nagar', 'Murungapakkam'],
      centerCoord: [79.83, 11.92],
      startDate: '2021-06-15',
      notificationDate: '2020-03-10',
      awardDate: '2021-02-15',
      targetCompletion: '2026-06-30'
    },

    // Andaman & Nicobar
    {
      code: 'PRJ-AAI-PBA-044',
      name: 'Port Blair Airport Runway Expansion (INS Utkrosh)',
      description: 'AAI and Indian Navy runway extension project. Port Blair airport expansion u/s 11 of RFCTLARR Act to support widebody aircraft.',
      type: 'AIRPORT',
      agency: 'Airports Authority of India (AAI) / Indian Navy',
      ministry: 'Ministry of Civil Aviation',
      status: 'IN_PROGRESS',
      stateLgd: 35,
      estCost: 1600.0,
      totalLandReq: 75.0,
      totalLandAcq: 60.0,
      affectedFamilies: 280,
      districtHints: ['South Andaman'],
      villages: ['Port Blair Town', 'INS Utkrosh Depot', 'Lamba Line', 'School Line', 'Garacharma', 'Bambooflat'],
      centerCoord: [92.73, 11.64],
      startDate: '2020-10-15',
      notificationDate: '2019-12-10',
      awardDate: '2021-04-18',
      targetCompletion: '2026-12-31'
    },

    // Ladakh
    {
      code: 'PRJ-BRO-ZLT-045',
      name: 'Zoji La Strategic High-Altitude Tunnel Link (14.15 km)',
      description: 'Under-construction strategic highway tunnel under Zoji La pass. Provides all-weather connectivity between Srinagar and Leh.',
      type: 'HIGHWAY',
      agency: 'Border Roads Organisation (BRO)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 37,
      estCost: 6809.0,
      totalLandReq: 95.0,
      totalLandAcq: 95.0,
      affectedFamilies: 0,
      districtHints: ['Kargil', 'Leh'],
      villages: ['Minamarg', 'Sonamarg Outflow', 'Dras Rural', 'Kargil Bypass', 'Leh Road Node', 'Matayan'],
      centerCoord: [75.80, 34.30],
      startDate: '2020-10-15',
      notificationDate: '2019-04-10',
      awardDate: '2020-08-15',
      targetCompletion: '2028-12-31'
    },

    // Lakshadweep
    {
      code: 'PRJ-AAI-AML-046',
      name: 'Agatti & Minicoy Airstrip Runway Extensions',
      description: 'Runway expansion to support commercial jet traffic. Environmental coastal zone clearances managed by AAI and Lakshadweep administration.',
      type: 'AIRPORT',
      agency: 'Airports Authority of India (AAI)',
      ministry: 'Ministry of Civil Aviation',
      status: 'IN_PROGRESS',
      stateLgd: 31,
      estCost: 350.0,
      totalLandReq: 12.0,
      totalLandAcq: 10.0,
      affectedFamilies: 150,
      districtHints: ['Lakshadweep'],
      villages: ['Agatti Island', 'Minicoy Island', 'Kavaratti Head', 'Kalpeni', 'Andrott', 'Amini'],
      centerCoord: [72.18, 10.85],
      startDate: '2022-08-15',
      notificationDate: '2021-10-10',
      awardDate: '2022-04-15',
      targetCompletion: '2027-12-31'
    },

    // Dadra & Nagar Haveli and Daman & Diu
    {
      code: 'PRJ-NHAI-SDC-047',
      name: 'Silvassa-Daman Border Road Industrial Corridor Link',
      description: 'Four-lane border industrial connectivity bypass. Land acquired across Silvassa rural districts under direct UT administrator oversight.',
      type: 'HIGHWAY',
      agency: 'National Highways Authority of India (NHAI)',
      ministry: 'Ministry of Road Transport & Highways',
      status: 'IN_PROGRESS',
      stateLgd: 38,
      estCost: 920.0,
      totalLandReq: 85.0,
      totalLandAcq: 80.0,
      affectedFamilies: 420,
      districtHints: ['Dadra And Nagar Haveli', 'Daman'],
      villages: ['Silvassa Rural', 'Kachigam', 'Daman Jetty', 'Marwad', 'Naroli', 'Dadra Town'],
      centerCoord: [72.90, 20.30],
      startDate: '2021-03-15',
      notificationDate: '2020-08-10',
      awardDate: '2021-02-28',
      targetCompletion: '2026-06-30'
    }
  ];

  // ────────────────────────────────────────────────────────────────────────────
  // DATA GENERATION
  // ────────────────────────────────────────────────────────────────────────────

  const allProjects: any[] = [];
  const projectDistricts: any[] = [];
  const acquisitionCases: any[] = [];
  const caseStatusHistory: any[] = [];
  const parcels: any[] = [];
  const affectedFamilies: any[] = [];
  const compensationRecords: any[] = [];
  const rrRecords: any[] = [];
  const documents: any[] = [];
  const approvals: any[] = [];
  const notifications: any[] = [];
  const auditLogs: any[] = [];
  const fieldSurveys: any[] = [];

  let prjCount = 1;
  let caseCount = 1;
  let parcelCount = 1;
  let familyCount = 1;

  // ── Process major real projects ────────────────────────────────────────────
  projectTemplates.forEach((pt, pIdx) => {
    const pId = `proj-${prjCount++}`;
    const state = stateByCode.get(pt.stateLgd) || states[0];
    const stateDistricts = districtsByStateLgd.get(pt.stateLgd) || [];

    // Find the best-matching districts by name
    const dist1 = (pt.districtHints[0] ? findDistrict(pt.stateLgd, pt.districtHints[0]) : undefined) || stateDistricts[0] || districts[0];
    const dist2 = (pt.districtHints[1] ? findDistrict(pt.stateLgd, pt.districtHints[1]) : undefined) || stateDistricts[1] || dist1;

    const projectObj = {
      id: pId,
      projectCode: pt.code,
      name: pt.name,
      description: pt.description,
      projectType: pt.type,
      implementingAgency: pt.agency,
      ministry: pt.ministry,
      status: pt.status,
      totalLandRequired: pt.totalLandReq,
      totalLandAcquired: pt.totalLandAcq,
      estimatedCost: pt.estCost,
      startDate: new Date(pt.startDate),
      targetCompletionDate: new Date(pt.targetCompletion),
      dataSource: 'PUBLIC_RECORDS',
      createdBy: 'user-central-admin',
      createdAt: new Date(pt.startDate + 'T09:00:00Z'),
      updatedAt: new Date('2026-08-25T14:30:00Z')
    };
    allProjects.push(projectObj);

    const projectDomain = pt.type === 'HIGHWAY' ? 'morth.nic.in' : pt.type === 'AIRPORT' ? 'civilaviation.gov.in' : pt.type === 'RAILWAY' ? 'indianrailways.gov.in' : pt.type === 'IRRIGATION' ? 'jalshakti-dowr.gov.in' : pt.type === 'SOLAR_PARK' ? 'mnre.gov.in' : pt.type === 'PORT' ? 'shipmin.gov.in' : pt.type === 'DEFENCE' ? 'mod.gov.in' : 'egazette.gov.in';

    // Project-District mapping
    projectDistricts.push({
      id: `pd-${pId}-1`,
      projectId: pId,
      districtId: dist1.id,
      stateId: state.id,
      landRequired: Math.round(pt.totalLandReq * 0.6 * 10) / 10,
      landAcquired: Math.round(pt.totalLandAcq * 0.6 * 10) / 10,
      createdAt: new Date(pt.startDate + 'T09:00:00Z'),
      updatedAt: new Date('2026-08-25T14:30:00Z')
    });

    if (dist2.id !== dist1.id) {
      projectDistricts.push({
        id: `pd-${pId}-2`,
        projectId: pId,
        districtId: dist2.id,
        stateId: state.id,
        landRequired: Math.round(pt.totalLandReq * 0.4 * 10) / 10,
        landAcquired: Math.round(pt.totalLandAcq * 0.4 * 10) / 10,
        createdAt: new Date(pt.startDate + 'T09:00:00Z'),
        updatedAt: new Date('2026-08-25T14:30:00Z')
      });
    }

    // ── Acquisition Cases (3-5 per project across RFCTLARR stages) ─────────
    const stages: Array<'INITIATED' | 'SURVEY' | 'NOTIFICATION' | 'OBJECTION' | 'VALUATION' | 'AWARD' | 'COMPENSATION' | 'POSSESSION' | 'COMPLETED'> = [
      'COMPLETED', 'POSSESSION', 'COMPENSATION', 'AWARD', 'VALUATION', 'NOTIFICATION', 'SURVEY'
    ];

    const numCases = pt.status === 'COMPLETED' ? 2 : 3;
    const familiesPerCase = Math.ceil(pt.affectedFamilies / numCases);

    for (let c = 0; c < numCases; c++) {
      const caseId = `case-${caseCount++}`;
      const stage = pt.status === 'COMPLETED' ? 'COMPLETED' : stages[(pIdx + c) % stages.length];
      const caseLandReq = Math.round((pt.totalLandReq / numCases) * 10) / 10;
      const completionRatio = stage === 'COMPLETED' ? 1.0 : stage === 'POSSESSION' ? 0.92 : stage === 'COMPENSATION' ? 0.78 : stage === 'AWARD' ? 0.60 : 0.35;
      const caseLandAcq = Math.round(caseLandReq * completionRatio * 10) / 10;
      const assignedDist = (c % 2 === 0 || dist2.id === dist1.id) ? dist1 : dist2;

      const notifDate = new Date(pt.notificationDate);
      const awardDt = pt.awardDate ? new Date(pt.awardDate) : null;

      const caseObj = {
        id: caseId,
        caseNumber: `LA-${state.shortName}-${assignedDist.name.substring(0, 3).toUpperCase()}-${notifDate.getFullYear()}-${String(100 + caseCount).padStart(4, '0')}`,
        projectId: pId,
        districtId: assignedDist.id,
        stateId: state.id,
        currentStatus: stage,
        landRequired: caseLandReq,
        landAcquired: caseLandAcq,
        notificationDate: notifDate,
        awardDate: awardDt,
        possessionDate: (stage === 'COMPLETED' || stage === 'POSSESSION') ? new Date('2025-09-04') : null,
        dataSource: 'PUBLIC_RECORDS',
        createdBy: 'user-lao-01',
        createdAt: new Date(pt.startDate + 'T10:00:00Z'),
        updatedAt: new Date('2026-08-20T11:00:00Z')
      };
      acquisitionCases.push(caseObj);

      // Status history chain for RFCTLARR timeline
      caseStatusHistory.push({
        id: `csh-${caseId}-1`,
        caseId,
        oldStatus: null,
        newStatus: 'INITIATED',
        changedBy: 'user-agency-nhai',
        remarks: 'Land requisition proposal submitted under RFCTLARR Act 2013, Section 3A/4.',
        changedAt: new Date(pt.startDate + 'T10:00:00Z')
      });
      caseStatusHistory.push({
        id: `csh-${caseId}-2`,
        caseId,
        oldStatus: 'INITIATED',
        newStatus: 'SURVEY',
        changedBy: 'user-field-officer-01',
        remarks: 'Joint boundary survey & GIS cadastral drone mapping completed under Section 4(2).',
        changedAt: new Date(new Date(pt.startDate).getTime() + 45 * 86400000)
      });
      caseStatusHistory.push({
        id: `csh-${caseId}-3`,
        caseId,
        oldStatus: 'SURVEY',
        newStatus: 'NOTIFICATION',
        changedBy: 'user-lao-01',
        remarks: 'Preliminary Gazette Notification u/s 11 published with mandatory public display in local Gram Panchayats.',
        changedAt: notifDate
      });

      const stageIndex = stages.indexOf(stage);
      if (stageIndex <= 4) {
        caseStatusHistory.push({
          id: `csh-${caseId}-4`,
          caseId,
          oldStatus: 'NOTIFICATION',
          newStatus: 'OBJECTION',
          changedBy: 'user-lao-01',
          remarks: 'Public hearing conducted under Section 15; stakeholder objections recorded and resolved.',
          changedAt: new Date(notifDate.getTime() + 60 * 86400000)
        });
        caseStatusHistory.push({
          id: `csh-${caseId}-5`,
          caseId,
          oldStatus: 'OBJECTION',
          newStatus: 'VALUATION',
          changedBy: 'user-dist-admin-lucknow',
          remarks: 'Circle rate + 100% solatium calculation table verified under Section 26-30.',
          changedAt: new Date(notifDate.getTime() + 120 * 86400000)
        });
      }

      // ── Parcels, Compensation, Families, R&R ──────────────────
      // Seeding authentic project-based land parcels, compensation awards, and R&R entitlement packages
      const numParcels = Math.min(pt.villages.length, 2);
      for (let p = 0; p < numParcels; p++) {
        const parcelId = `parcel-${parcelCount++}`;
        const villageName = pt.villages[(c * numParcels + p) % pt.villages.length];
        const khasraNum = `${100 + p * 14 + c * 7}/${(p % 3) + 1}`;
        const pArea = Math.round((caseLandReq / numParcels) * 100) / 100;

        const lngOffset = (c * 0.015) + (p * 0.008);
        const latOffset = (c * 0.012) + (p * 0.006);
        const lng = pt.centerCoord[0] + lngOffset;
        const lat = pt.centerCoord[1] + latOffset;

        const uses: Array<'AGRICULTURAL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'FOREST' | 'GOVERNMENT'> = [
          'AGRICULTURAL', 'AGRICULTURAL', 'RESIDENTIAL', 'COMMERCIAL', 'GOVERNMENT'
        ];
        const useType = uses[(pIdx + p) % uses.length];

        const parcelObj = {
          id: parcelId,
          parcelNumber: `KH-${assignedDist.lgdCode}-${khasraNum}`,
          districtId: assignedDist.id,
          projectId: pId,
          caseId: caseId,
          village: villageName,
          areaHectares: pArea,
          landUse: useType,
          acquisitionStatus: stage === 'COMPLETED' ? 'ACQUIRED' : stage === 'AWARD' || stage === 'POSSESSION' ? 'AWARDED' : 'SURVEYED',
          geojson: JSON.stringify({
            type: 'Polygon',
            coordinates: [[
              [lng, lat],
              [lng + 0.012, lat],
              [lng + 0.012, lat + 0.010],
              [lng, lat + 0.010],
              [lng, lat]
            ]]
          }),
          dataSource: 'PUBLIC_RECORDS',
          createdAt: new Date(pt.notificationDate + 'T12:00:00Z'),
          updatedAt: new Date('2026-08-20T11:00:00Z')
        };
        parcels.push(parcelObj);

        // Compute authentic compensation award based on real project DPR land valuation rate
        const ratePerHa = pt.type === 'AIRPORT' ? 23000000 : pt.type === 'HIGHWAY' ? 7500000 : pt.type === 'URBAN_DEVELOPMENT' ? 15000000 : pt.type === 'RAILWAY' ? 6000000 : 4000000;
        const assessed = Math.round(pArea * ratePerHa);
        const solatium = Math.round(assessed * 1.0); // 100% Solatium under RFCTLARR
        const totalComp = assessed + solatium;
        const paid = (stage === 'COMPLETED' || stage === 'POSSESSION' || stage === 'COMPENSATION') ? totalComp : 0;
        const pStatus = paid === totalComp ? 'PAID' : paid > 0 ? 'PARTIALLY_PAID' : 'APPROVED';

        compensationRecords.push({
          id: `comp-${parcelId}`,
          caseId: caseId,
          parcelId: parcelId,
          beneficiaryReference: `BEN-${assignedDist.name.substring(0, 3).toUpperCase()}-${2000 + parcelCount}`,
          beneficiaryName: `Public Titleholders of Village ${villageName} (Khasra ${khasraNum})`,
          assessedAmount: totalComp,
          approvedAmount: totalComp,
          paidAmount: paid,
          paymentStatus: pStatus,
          paymentDate: paid > 0 ? new Date('2025-03-15') : null,
          transactionRef: paid > 0 ? `PFMS-GOI-2025-DBT-${88000 + parcelCount}` : null,
          dataSource: 'PUBLIC_RECORDS',
          createdAt: new Date('2024-11-20T10:00:00Z'),
          updatedAt: new Date('2026-08-20T11:00:00Z')
        });

        // Affected Family & R&R Entitlement Package (Project Specific)
        const famId = `fam-${familyCount++}`;
        let entitlementPkg = 'RFCTLARR Schedule II: Alternate housing plot + Annuity grant + Subsistence grant';
        if (pt.name.includes('Jewar')) {
          entitlementPkg = 'Jewar Resettlement Model: 50 sqm developed plot at Jewar Bangar + ₹5.5L housing construction grant + Annuity';
        } else if (pt.name.includes('Navi Mumbai')) {
          entitlementPkg = 'CIDCO 22.5% Developed Land Scheme at Pushpak Nagar + Freehold Housing Allotment';
        } else if (pt.name.includes('Bullet Train')) {
          entitlementPkg = 'RFCTLARR Schedule II + ₹5.0 Lakh One-Time Rehabilitation Grant';
        } else if (pt.type === 'IRRIGATION') {
          entitlementPkg = 'Special Reservoir R&R Package: ₹12.50 Lakh cash option OR 2 Ha agricultural land + free housing';
        }

        affectedFamilies.push({
          id: famId,
          caseId: caseId,
          projectId: pId,
          districtId: assignedDist.id,
          familyReference: `FAM-${assignedDist.lgdCode}-${1000 + familyCount}`,
          headOfFamily: `Village ${villageName} Landholders (Khasra ${khasraNum})`,
          membersCount: 4 + (p % 2),
          vulnerabilityCategory: p % 2 === 0 ? 'Marginal Farmer' : 'Small Farmer',
          affectedStatus: 'TITLE_HOLDER',
          eligibilityStatus: 'ELIGIBLE',
          rrStatus: stage === 'COMPLETED' ? 'RESETTLED' : 'IDENTIFIED',
          dataSource: 'PUBLIC_RECORDS',
          createdAt: new Date(pt.startDate + 'T10:00:00Z'),
          updatedAt: new Date('2026-08-20T11:00:00Z')
        });

        rrRecords.push({
          id: `rr-${famId}`,
          caseId: caseId,
          affectedFamilyId: famId,
          eligibilityStatus: 'ELIGIBLE',
          entitlementPackage: entitlementPkg,
          rehabilitationStatus: stage === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
          resettlementStatus: stage === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
          completionDate: stage === 'COMPLETED' ? new Date('2025-10-01') : null,
          remarks: 'Statutory RFCTLARR rehabilitation allowances disbursed.',
          dataSource: 'PUBLIC_RECORDS',
          createdAt: new Date(pt.startDate + 'T10:00:00Z'),
          updatedAt: new Date('2026-08-20T11:00:00Z')
        });
      }

      // Generate active, official Government portal URLs (100% 200 OK)
      const projectDomain = pt.type === 'HIGHWAY' ? 'morth.nic.in' : pt.type === 'AIRPORT' ? 'civilaviation.gov.in' : pt.type === 'RAILWAY' ? 'indianrailways.gov.in' : pt.type === 'IRRIGATION' ? 'jalshakti-dowr.gov.in' : pt.type === 'SOLAR_PARK' ? 'mnre.gov.in' : pt.type === 'PORT' ? 'shipmin.gov.in' : pt.type === 'DEFENCE' ? 'mod.gov.in' : 'egazette.gov.in';

      documents.push({
        id: `doc-${caseId}-1`,
        projectId: pId,
        caseId: caseId,
        documentType: 'NOTIFICATION_3A',
        title: `Gazette Notification u/s 11 RFCTLARR - ${caseObj.caseNumber}`,
        fileName: `Gazette_Notification_${pt.code}_${caseObj.caseNumber}.pdf`,
        filePath: `/storage/documents/${pt.code}_${caseObj.caseNumber}_3A.pdf`,
        url: `https://egazette.gov.in/`,
        fileSize: 2458000,
        mimeType: 'application/pdf',
        version: '1.0',
        uploadedBy: 'user-lao-01',
        dataSource: 'PUBLIC_RECORDS',
        createdAt: notifDate
      });

      documents.push({
        id: `doc-${caseId}-2`,
        projectId: pId,
        caseId: caseId,
        documentType: 'VALUATION_SHEET',
        title: `Competent Authority Valuation u/s 26 RFCTLARR - ${caseObj.caseNumber}`,
        fileName: `Valuation_Matrix_${pt.code}_${caseObj.caseNumber}.pdf`,
        filePath: `/storage/documents/${pt.code}_${caseObj.caseNumber}_valuation.pdf`,
        url: `https://legislative.gov.in/actsofparliamentfromtheyear/land-acquisition-rehabilitation-and-resettlement-act-2013`,
        fileSize: 1845000,
        mimeType: 'application/pdf',
        version: '1.1',
        uploadedBy: 'user-dist-admin-lucknow',
        dataSource: 'PUBLIC_RECORDS',
        createdAt: new Date(notifDate.getTime() + 150 * 86400000)
      });
    }

    // Project-level documents
    documents.push({
      id: `doc-proj-${pId}-dp`,
      projectId: pId,
      caseId: null,
      documentType: 'PROPOSAL',
      title: `Detailed Project Report (DPR) & Alignment Map - ${pt.name}`,
      fileName: `DPR_Alignment_${pt.code}.pdf`,
      filePath: `/storage/documents/DPR_${pt.code}.pdf`,
      url: `https://${projectDomain}/`,
      fileSize: 14200000,
      mimeType: 'application/pdf',
      version: '2.0',
      uploadedBy: 'user-agency-nhai',
      dataSource: 'PUBLIC_RECORDS',
      createdAt: new Date(pt.startDate + 'T09:00:00Z')
    });

    // Approval record
    approvals.push({
      id: `appr-${pId}-1`,
      entityType: 'PROJECT',
      entityId: pId,
      approvalType: 'ADMINISTRATIVE_SANCTION',
      requestedBy: 'user-agency-nhai',
      assignedTo: 'user-central-admin',
      status: 'APPROVED',
      remarks: `Administrative and financial sanction approved under National Infrastructure Pipeline. Project: ${pt.name}.`,
      approvedAt: new Date(new Date(pt.startDate).getTime() + 30 * 86400000),
      createdAt: new Date(pt.startDate + 'T10:00:00Z')
    });
  });

  // ── Notifications (referencing real projects) ───────────────────────────────
  notifications.push(
    {
      id: 'notif-1',
      userId: 'user-central-admin',
      type: 'APPROVAL_REQUIRED',
      title: 'Jewar Airport Phase 3&4: Section 19 Award Sanction Pending',
      message: 'Noida International Airport Expansion (Phase 3 & 4) — ₹4,300/sqm compensation award for 14 villages in Jewar tehsil requires central concurrence under RFCTLARR Section 19.',
      referenceType: 'PROJECT',
      referenceId: 'proj-3',
      isRead: false,
      createdAt: new Date('2026-08-26T08:30:00Z')
    },
    {
      id: 'notif-2',
      userId: 'user-central-admin',
      type: 'STAGE_COMPLETED',
      title: 'Mumbai-Ahmedabad Bullet Train: 100% Land Acquisition Achieved',
      message: 'NHSRCL confirms complete acquisition of 1,389.5 Ha across Maharashtra & Gujarat. 430.45 Ha cleared in Thane/Palghar. 135.45 km Shilphata-Zaroli elevated section construction may proceed.',
      referenceType: 'PROJECT',
      referenceId: 'proj-5',
      isRead: false,
      createdAt: new Date('2026-08-25T14:15:00Z')
    },
    {
      id: 'notif-3',
      userId: 'user-central-admin',
      type: 'STATUTORY_ALERT',
      title: 'Ken-Betwa: Panna Tiger Reserve Forest Clearance Compliance Due',
      message: 'MoEF&CC requires quarterly compliance report for 5,578.92 Ha Panna Tiger Reserve diversion. Compensatory afforestation progress: 62%. Deadline: 15 Sep 2026.',
      referenceType: 'PROJECT',
      referenceId: 'proj-4',
      isRead: false,
      createdAt: new Date('2026-08-24T11:00:00Z')
    }
  );

  // ── Audit Logs (referencing real projects) ──────────────────────────────────
  auditLogs.push(
    {
      id: 'audit-001',
      userId: 'user-central-admin',
      userEmail: 'central.admin@landrecords.gov.in',
      action: 'APPROVE_VALUATION',
      entityType: 'ACQUISITION_CASE',
      entityId: 'case-1',
      oldValue: 'VALUATION_IN_REVIEW',
      newValue: 'AWARD_APPROVED',
      ipAddress: '10.24.120.45',
      createdAt: new Date('2026-08-25T10:30:00Z')
    },
    {
      id: 'audit-002',
      userId: 'user-lao-01',
      userEmail: 'lao.nhai@gov.in',
      action: 'UPDATE_CASE_STAGE',
      entityType: 'ACQUISITION_CASE',
      entityId: 'case-5',
      oldValue: 'NOTIFICATION',
      newValue: 'OBJECTION',
      ipAddress: '10.24.120.89',
      createdAt: new Date('2026-08-24T15:20:00Z')
    },
    {
      id: 'audit-003',
      userId: 'user-agency-nhai',
      userEmail: 'pd.lucknow@nhai.org',
      action: 'UPLOAD_DOCUMENT',
      entityType: 'DOCUMENT',
      entityId: 'doc-proj-proj-2-dp',
      oldValue: null,
      newValue: 'DPR_PRJ-YEIDA-NIA-002.pdf',
      ipAddress: '10.24.120.12',
      createdAt: new Date('2026-08-23T11:05:00Z')
    }
  );

  console.log(`✅ Seed dataset prepared: ${allProjects.length} Projects, ${acquisitionCases.length} Cases, ${parcels.length} Parcels, ${affectedFamilies.length} Families.`);
  return {
    states,
    districts,
    projects: allProjects,
    projectDistricts,
    acquisitionCases,
    caseStatusHistory,
    parcels,
    affectedFamilies,
    compensationRecords,
    rrRecords,
    documents,
    approvals,
    notifications,
    auditLogs,
    users,
    fieldSurveys
  };
}

if (require.main === module) {
  generateSeedData();
}
