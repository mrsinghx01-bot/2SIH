"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSeedData = generateSeedData;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const import_lgd_data_1 = require("../import-data/import-lgd-data");
function generateSeedData() {
    console.log('🌱 Generating comprehensive seed dataset for National Land Acquisition & Management System...');
    const { states, districts } = (0, import_lgd_data_1.loadMasterGeographicData)();
    const stateByCode = new Map();
    states.forEach(s => stateByCode.set(s.lgdCode, s));
    const districtsByStateLgd = new Map();
    districts.forEach(d => {
        const list = districtsByStateLgd.get(d.stateLgdCode) || [];
        list.push(d);
        districtsByStateLgd.set(d.stateLgdCode, list);
    });
    // Password hash for demo users (password: 'Admin@123')
    const salt = bcryptjs_1.default.genSaltSync(10);
    const passwordHash = bcryptjs_1.default.hashSync('Admin@123', salt);
    const users = [
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
            districtId: 'dist-157',
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
            districtId: 'dist-157',
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
        },
        {
            id: 'user-field-officer-01',
            employeeId: 'FO-UP-501',
            name: 'Anand Prakash',
            email: 'tehsildar.survey@up.gov.in',
            passwordHash,
            role: 'FIELD_OFFICER',
            designation: 'Tehsildar (Land Records & Survey)',
            ministry: 'Revenue Department',
            stateId: 'state-9',
            districtId: 'dist-157',
            isActive: true
        }
    ];
    // Master Project Templates
    const projectTemplates = [
        {
            code: 'PRJ-NHAI-2025-001',
            name: 'Delhi-Mumbai Express Highway Corridor (Package IV)',
            description: 'Construction of 8-lane access-controlled greenfield expressway connecting Northern to Western India.',
            type: 'HIGHWAY',
            agency: 'National Highways Authority of India (NHAI)',
            ministry: 'Ministry of Road Transport & Highways',
            status: 'IN_PROGRESS',
            stateLgd: 27, // Maharashtra
            estCost: 12450.0,
            totalLandReq: 4200.0,
            totalLandAcq: 3318.0
        },
        {
            code: 'PRJ-MORTH-2024-089',
            name: 'Purvanchal Expressway Economic Node Expansion',
            description: 'Land acquisition for industrial logistics parks and smart feeder corridors along the Purvanchal alignment.',
            type: 'HIGHWAY',
            agency: 'Uttar Pradesh Expressways Industrial Development Authority (UPEIDA)',
            ministry: 'Ministry of Road Transport & Highways',
            status: 'IN_PROGRESS',
            stateLgd: 9, // Uttar Pradesh
            estCost: 8750.0,
            totalLandReq: 3850.0,
            totalLandAcq: 3041.5
        },
        {
            code: 'PRJ-RAIL-2024-012',
            name: 'Western Dedicated Freight Corridor (Vaitarna - JNPT Section)',
            description: 'Dedicated double-line electrified freight railway line from Dadri to Jawaharlal Nehru Port.',
            type: 'RAILWAY',
            agency: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
            ministry: 'Ministry of Railways',
            status: 'IN_PROGRESS',
            stateLgd: 27, // Maharashtra
            estCost: 16800.0,
            totalLandReq: 2150.0,
            totalLandAcq: 1890.0
        },
        {
            code: 'PRJ-IRR-2023-045',
            name: 'Ken-Betwa River Interlinking Canal Project Phase I',
            description: 'National river interlinking priority project transferring surplus water from Ken river to drought-prone Bundelkhand.',
            type: 'IRRIGATION',
            agency: 'National Water Development Agency (NWDA)',
            ministry: 'Ministry of Jal Shakti',
            status: 'IN_PROGRESS',
            stateLgd: 9, // Uttar Pradesh
            estCost: 44605.0,
            totalLandReq: 8500.0,
            totalLandAcq: 5780.0
        },
        {
            code: 'PRJ-IND-2025-078',
            name: 'Amritsar-Kolkata Industrial Corridor (Bihar Node)',
            description: 'Integrated manufacturing cluster and multimodal logistics park at Dobhi, Gaya.',
            type: 'INDUSTRIAL_CORRIDOR',
            agency: 'National Industrial Corridor Development Corporation (NICDC)',
            ministry: 'Ministry of Commerce & Industry',
            status: 'PLANNING',
            stateLgd: 10, // Bihar
            estCost: 6500.0,
            totalLandReq: 1600.0,
            totalLandAcq: 840.0
        },
        {
            code: 'PRJ-AIR-2024-003',
            name: 'Noida International Greenfield Airport (Jewar Phase II)',
            description: 'Acquisition of agricultural and non-agricultural land for runways 3 & 4 and MRO maintenance hubs.',
            type: 'AIRPORT',
            agency: 'Yamuna Expressway Industrial Development Authority (YEIDA)',
            ministry: 'Ministry of Civil Aviation',
            status: 'IN_PROGRESS',
            stateLgd: 9, // Uttar Pradesh
            estCost: 11200.0,
            totalLandReq: 1365.0,
            totalLandAcq: 1180.0
        },
        {
            code: 'PRJ-SOLAR-2024-055',
            name: 'Bhadla Mega Solar Ultra Park Phase IV Expansion',
            description: 'Land acquisition for 2000 MW grid-connected renewable solar PV park in Thar desert region.',
            type: 'RENEWABLE_ENERGY',
            agency: 'Solar Energy Corporation of India (SECI)',
            ministry: 'Ministry of New & Renewable Energy',
            status: 'IN_PROGRESS',
            stateLgd: 8, // Rajasthan
            estCost: 4800.0,
            totalLandReq: 4500.0,
            totalLandAcq: 3825.0
        },
        {
            code: 'PRJ-DEF-2025-019',
            name: 'Tamil Nadu Defence Industrial Corridor (Coimbatore Node)',
            description: 'Advanced aerospace and defence components manufacturing hub under Make in India initiative.',
            type: 'DEFENCE',
            agency: 'Tamil Nadu Industrial Development Corporation (TIDCO)',
            ministry: 'Ministry of Defence',
            status: 'IN_PROGRESS',
            stateLgd: 33, // Tamil Nadu
            estCost: 3200.0,
            totalLandReq: 950.0,
            totalLandAcq: 712.5
        },
        {
            code: 'PRJ-PORT-2024-007',
            name: 'Dholera SIR Port-City Multimodal Freight Expressway',
            description: 'Special Investment Region transit spine connecting Dholera to Ahmedabad international port gateways.',
            type: 'PORT',
            agency: 'Dholera Industrial City Development Limited (DICDL)',
            ministry: 'Ministry of Ports, Shipping & Waterways',
            status: 'IN_PROGRESS',
            stateLgd: 24, // Gujarat
            estCost: 5600.0,
            totalLandReq: 2100.0,
            totalLandAcq: 1785.0
        },
        {
            code: 'PRJ-URB-2025-031',
            name: 'Bengaluru Peripheral Ring Road Land Acquisition Project',
            description: '73.5 km 8-lane expressway decongesting traffic around Bengaluru metropolitan area.',
            type: 'URBAN_DEVELOPMENT',
            agency: 'Bangalore Development Authority (BDA)',
            ministry: 'Ministry of Housing & Urban Affairs',
            status: 'IN_PROGRESS',
            stateLgd: 29, // Karnataka
            estCost: 14950.0,
            totalLandReq: 1040.0,
            totalLandAcq: 676.0
        },
        {
            code: 'PRJ-RAIL-2025-099',
            name: 'Eastern Freight Corridor (Dankuni - Sonnagar Section)',
            description: 'Heavy haul freight transport railway line passing through industrial mining corridors of Bengal and Jharkhand.',
            type: 'RAILWAY',
            agency: 'DFCCIL / Ministry of Railways',
            ministry: 'Ministry of Railways',
            status: 'IN_PROGRESS',
            stateLgd: 19, // West Bengal
            estCost: 13500.0,
            totalLandReq: 3100.0,
            totalLandAcq: 2015.0
        },
        {
            code: 'PRJ-URB-2024-015',
            name: 'Urban Extension Road-II (UER-II) National Capital Link',
            description: 'Seamless signal-free connection from Alipur to Dwarka and IGI Airport in Delhi UT.',
            type: 'HIGHWAY',
            agency: 'National Highways Authority of India',
            ministry: 'Ministry of Road Transport & Highways',
            status: 'COMPLETED',
            stateLgd: 7, // Delhi UT
            estCost: 7716.0,
            totalLandReq: 560.0,
            totalLandAcq: 560.0
        },
        {
            code: 'PRJ-UT-2025-004',
            name: 'Chandigarh Outer Smart Ring Road Expansion',
            description: 'Bypassing interstate heavy freight traffic around Chandigarh UT and Mohali/Panchkula tri-city.',
            type: 'HIGHWAY',
            agency: 'Chandigarh Administration / NHAI',
            ministry: 'Ministry of Road Transport & Highways',
            status: 'IN_PROGRESS',
            stateLgd: 4, // Chandigarh UT
            estCost: 1450.0,
            totalLandReq: 180.0,
            totalLandAcq: 135.0
        },
        {
            code: 'PRJ-UT-2025-008',
            name: 'Udhampur-Srinagar-Baramulla Rail Link (USBRL) Depot Expansion',
            description: 'Station terminal expansion and strategic safety siding buffers in Kashmir valley.',
            type: 'RAILWAY',
            agency: 'Northern Railway',
            ministry: 'Ministry of Railways',
            status: 'IN_PROGRESS',
            stateLgd: 1, // Jammu & Kashmir UT
            estCost: 2800.0,
            totalLandReq: 320.0,
            totalLandAcq: 265.0
        },
        {
            code: 'PRJ-UT-2024-022',
            name: 'Puducherry Port Multi-Modal Coastal Logistic Terminal',
            description: 'Development of container handling backup area and maritime cargo warehousing.',
            type: 'PORT',
            agency: 'Puducherry Port Department',
            ministry: 'Ministry of Ports, Shipping & Waterways',
            status: 'IN_PROGRESS',
            stateLgd: 34, // Puducherry UT
            estCost: 490.0,
            totalLandReq: 95.0,
            totalLandAcq: 72.0
        }
    ];
    // Also create projects across ALL remaining states/UTs so that EVERY state card has derived project data!
    const allProjects = [];
    const projectDistricts = [];
    const acquisitionCases = [];
    const caseStatusHistory = [];
    const parcels = [];
    const affectedFamilies = [];
    const compensationRecords = [];
    const rrRecords = [];
    const documents = [];
    const approvals = [];
    const notifications = [];
    const auditLogs = [];
    let prjCount = 1;
    let caseCount = 1;
    let parcelCount = 1;
    let familyCount = 1;
    // Add major explicit projects first
    projectTemplates.forEach((pt, pIdx) => {
        const pId = `proj-${prjCount++}`;
        const state = stateByCode.get(pt.stateLgd) || states[0];
        const stateDistricts = districtsByStateLgd.get(pt.stateLgd) || [];
        const dist1 = stateDistricts[0] || districts[0];
        const dist2 = stateDistricts[1] || dist1;
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
            startDate: new Date('2024-01-15'),
            targetCompletionDate: new Date('2027-12-31'),
            dataSource: 'DEMO',
            createdBy: 'user-central-admin',
            createdAt: new Date('2024-01-15T09:00:00Z'),
            updatedAt: new Date('2026-08-25T14:30:00Z')
        };
        allProjects.push(projectObj);
        // Project Districts mapping
        projectDistricts.push({
            id: `pd-${pId}-1`,
            projectId: pId,
            districtId: dist1.id,
            stateId: state.id,
            landRequired: pt.totalLandReq * 0.6,
            landAcquired: pt.totalLandAcq * 0.6,
            createdAt: new Date('2024-01-15T09:00:00Z'),
            updatedAt: new Date('2026-08-25T14:30:00Z')
        });
        if (dist2.id !== dist1.id) {
            projectDistricts.push({
                id: `pd-${pId}-2`,
                projectId: pId,
                districtId: dist2.id,
                stateId: state.id,
                landRequired: pt.totalLandReq * 0.4,
                landAcquired: pt.totalLandAcq * 0.4,
                createdAt: new Date('2024-01-15T09:00:00Z'),
                updatedAt: new Date('2026-08-25T14:30:00Z')
            });
        }
        // Generate 3-5 Acquisition Cases for this project across the 9 stages
        const stages = [
            'COMPLETED',
            'POSSESSION',
            'COMPENSATION',
            'AWARD',
            'VALUATION',
            'NOTIFICATION',
            'SURVEY'
        ];
        const numCases = 4;
        for (let c = 0; c < numCases; c++) {
            const caseId = `case-${caseCount++}`;
            const stage = stages[(pIdx + c) % stages.length];
            const caseLandReq = Math.round((pt.totalLandReq / numCases) * 10) / 10;
            const stageIndex = stages.indexOf(stage);
            const completionRatio = stage === 'COMPLETED' ? 1.0 : stage === 'POSSESSION' ? 0.9 : stage === 'COMPENSATION' ? 0.75 : 0.4;
            const caseLandAcq = Math.round(caseLandReq * completionRatio * 10) / 10;
            const assignedDist = (c % 2 === 0 || dist2.id === dist1.id) ? dist1 : dist2;
            const caseObj = {
                id: caseId,
                caseNumber: `LA-${state.shortName}-${assignedDist.name.substring(0, 3).toUpperCase()}-${2025}-${String(100 + caseCount).padStart(4, '0')}`,
                projectId: pId,
                districtId: assignedDist.id,
                stateId: state.id,
                currentStatus: stage,
                landRequired: caseLandReq,
                landAcquired: caseLandAcq,
                notificationDate: new Date('2024-06-10'),
                awardDate: stageIndex <= 3 ? new Date('2025-02-18') : null,
                possessionDate: stageIndex <= 1 ? new Date('2025-09-04') : null,
                dataSource: 'DEMO',
                createdBy: 'user-lao-01',
                createdAt: new Date('2024-03-01T10:00:00Z'),
                updatedAt: new Date('2026-08-20T11:00:00Z')
            };
            acquisitionCases.push(caseObj);
            // Status history chain for timeline
            caseStatusHistory.push({
                id: `csh-${caseId}-1`,
                caseId,
                oldStatus: null,
                newStatus: 'INITIATED',
                changedBy: 'user-agency-nhai',
                remarks: 'Land requisition proposal submitted under RFCTLARR Act Section 3A/4.',
                changedAt: new Date('2024-03-01T10:00:00Z')
            });
            caseStatusHistory.push({
                id: `csh-${caseId}-2`,
                caseId,
                oldStatus: 'INITIATED',
                newStatus: 'SURVEY',
                changedBy: 'user-field-officer-01',
                remarks: 'Joint boundary survey & GIS cadastral drone mapping completed.',
                changedAt: new Date('2024-04-15T11:30:00Z')
            });
            caseStatusHistory.push({
                id: `csh-${caseId}-3`,
                caseId,
                oldStatus: 'SURVEY',
                newStatus: 'NOTIFICATION',
                changedBy: 'user-lao-01',
                remarks: 'Preliminary Gazette Notification issued with public display in local bodies.',
                changedAt: new Date('2024-06-10T14:00:00Z')
            });
            if (stage !== 'INITIATED' && stage !== 'SURVEY' && stage !== 'NOTIFICATION') {
                caseStatusHistory.push({
                    id: `csh-${caseId}-4`,
                    caseId,
                    oldStatus: 'NOTIFICATION',
                    newStatus: 'OBJECTION',
                    changedBy: 'user-lao-01',
                    remarks: 'Public hearing conducted; 14 stakeholder objections resolved.',
                    changedAt: new Date('2024-08-05T16:00:00Z')
                });
                caseStatusHistory.push({
                    id: `csh-${caseId}-5`,
                    caseId,
                    oldStatus: 'OBJECTION',
                    newStatus: 'VALUATION',
                    changedBy: 'user-dist-admin-lucknow',
                    remarks: 'Circle rate + solatium 100% calculation table verified.',
                    changedAt: new Date('2024-11-12T10:15:00Z')
                });
            }
            // Generate 2-3 Parcels per case
            for (let p = 0; p < 3; p++) {
                const parcelId = `parcel-${parcelCount++}`;
                const pNum = `KH-${assignedDist.lgdCode}-${String(3000 + parcelCount)}`;
                const pArea = Math.round((caseLandReq / 3) * 100) / 100;
                const uses = [
                    'AGRICULTURAL',
                    'AGRICULTURAL',
                    'RESIDENTIAL',
                    'COMMERCIAL',
                    'GOVERNMENT'
                ];
                const useType = uses[(pIdx + p) % uses.length];
                const parcelObj = {
                    id: parcelId,
                    parcelNumber: pNum,
                    districtId: assignedDist.id,
                    projectId: pId,
                    caseId: caseId,
                    village: `${assignedDist.name} Rural Sector ${p + 1}`,
                    khasraNumber: `${100 + p}/${2 * p + 1}`,
                    areaHectares: pArea,
                    landUse: useType,
                    acquisitionStatus: stage === 'COMPLETED' ? 'ACQUIRED' : stage === 'AWARD' ? 'AWARDED' : 'SURVEYED',
                    geojson: JSON.stringify({
                        type: 'Polygon',
                        coordinates: [
                            [
                                [78.5 + (p * 0.01), 26.5 + (p * 0.01)],
                                [78.52 + (p * 0.01), 26.5 + (p * 0.01)],
                                [78.52 + (p * 0.01), 26.52 + (p * 0.01)],
                                [78.5 + (p * 0.01), 26.52 + (p * 0.01)],
                                [78.5 + (p * 0.01), 26.5 + (p * 0.01)]
                            ]
                        ]
                    }),
                    dataSource: 'DEMO',
                    createdAt: new Date('2024-04-15T12:00:00Z'),
                    updatedAt: new Date('2026-08-20T11:00:00Z')
                };
                parcels.push(parcelObj);
                // Compensation record
                const assessed = Math.round(pArea * 4500000);
                const approved = assessed;
                const paid = (stage === 'COMPLETED' || stage === 'POSSESSION' || stage === 'COMPENSATION') ? approved : 0;
                const pStatus = paid === approved ? 'PAID' : paid > 0 ? 'PARTIALLY_PAID' : 'APPROVED';
                compensationRecords.push({
                    id: `comp-${parcelId}`,
                    caseId: caseId,
                    parcelId: parcelId,
                    beneficiaryReference: `BEN-${assignedDist.shortName || 'IN'}-${1000 + familyCount}`,
                    beneficiaryName: `Shri Ramavatar & Sons (Khasra ${parcelObj.khasraNumber})`,
                    assessedAmount: assessed,
                    approvedAmount: approved,
                    paidAmount: paid,
                    paymentStatus: pStatus,
                    paymentDate: paid > 0 ? new Date('2025-03-15') : null,
                    transactionRef: paid > 0 ? `PFMS-GOI-2025-TXN-${99000 + parcelCount}` : null,
                    dataSource: 'DEMO',
                    createdAt: new Date('2024-11-20T10:00:00Z'),
                    updatedAt: new Date('2026-08-20T11:00:00Z')
                });
                // Affected Family & R&R
                const famId = `fam-${familyCount++}`;
                affectedFamilies.push({
                    id: famId,
                    caseId: caseId,
                    projectId: pId,
                    districtId: assignedDist.id,
                    familyReference: `FAM-${assignedDist.lgdCode}-${500 + familyCount}`,
                    headOfFamily: `Mukhiya ${parcelObj.village} Lineage ${p + 1}`,
                    membersCount: 4 + (p % 3),
                    vulnerabilityCategory: p % 2 === 0 ? 'Marginal Farmer' : 'General',
                    affectedStatus: 'TITLE_HOLDER',
                    eligibilityStatus: 'ELIGIBLE',
                    rrStatus: stage === 'COMPLETED' ? 'RESETTLED' : 'IDENTIFIED',
                    dataSource: 'DEMO',
                    createdAt: new Date('2024-05-10T10:00:00Z'),
                    updatedAt: new Date('2026-08-20T11:00:00Z')
                });
                rrRecords.push({
                    id: `rr-${famId}`,
                    caseId: caseId,
                    affectedFamilyId: famId,
                    eligibilityStatus: 'ELIGIBLE',
                    entitlementPackage: 'Option-A: Financial grant for housing + alternate livelihood assistance',
                    rehabilitationStatus: stage === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
                    resettlementStatus: stage === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS',
                    completionDate: stage === 'COMPLETED' ? new Date('2025-10-01') : null,
                    remarks: 'All statutory RFCTLARR rehabilitation allowances disbursed.',
                    dataSource: 'DEMO',
                    createdAt: new Date('2024-05-10T10:00:00Z'),
                    updatedAt: new Date('2026-08-20T11:00:00Z')
                });
            }
            // Add statutory documents
            documents.push({
                id: `doc-${caseId}-1`,
                projectId: pId,
                caseId: caseId,
                documentType: 'NOTIFICATION_3A',
                title: `Gazette Notification Sec 3A/4 - ${caseObj.caseNumber}`,
                fileName: `gazette_notification_${caseObj.caseNumber}.pdf`,
                filePath: `/storage/documents/${caseObj.caseNumber}_3A.pdf`,
                fileSize: 2458000,
                mimeType: 'application/pdf',
                version: '1.0',
                uploadedBy: 'user-lao-01',
                dataSource: 'DEMO',
                createdAt: new Date('2024-06-10T10:00:00Z')
            });
            documents.push({
                id: `doc-${caseId}-2`,
                projectId: pId,
                caseId: caseId,
                documentType: 'VALUATION_SHEET',
                title: `Competent Authority Valuation & Compensation Matrix - ${caseObj.caseNumber}`,
                fileName: `valuation_matrix_${caseObj.caseNumber}.pdf`,
                filePath: `/storage/documents/${caseObj.caseNumber}_valuation.pdf`,
                fileSize: 1845000,
                mimeType: 'application/pdf',
                version: '1.1',
                uploadedBy: 'user-dist-admin-lucknow',
                dataSource: 'DEMO',
                createdAt: new Date('2024-11-12T14:00:00Z')
            });
        }
        // Add Project Level Documents
        documents.push({
            id: `doc-proj-${pId}-dp`,
            projectId: pId,
            caseId: null,
            documentType: 'PROPOSAL',
            title: `Detailed Project Report (DPR) & Alignment Map - ${pt.name}`,
            fileName: `DPR_${pt.code}.pdf`,
            filePath: `/storage/documents/DPR_${pt.code}.pdf`,
            fileSize: 14200000,
            mimeType: 'application/pdf',
            version: '2.0',
            uploadedBy: 'user-agency-nhai',
            dataSource: 'DEMO',
            createdAt: new Date('2024-01-15T09:00:00Z')
        });
        // Approvals
        approvals.push({
            id: `appr-${pId}-1`,
            entityType: 'PROJECT',
            entityId: pId,
            approvalType: 'ADMINISTRATIVE_SANCTION',
            requestedBy: 'user-agency-nhai',
            assignedTo: 'user-central-admin',
            status: 'APPROVED',
            remarks: 'Sanction approved by Central Screening Committee under National Infrastructure Pipeline.',
            approvedAt: new Date('2024-02-01T12:00:00Z'),
            createdAt: new Date('2024-01-20T10:00:00Z')
        });
    });
    // Ensure ALL other states have at least 1-2 infrastructure projects so their State Detail dashboards show realistic derived numbers!
    states.forEach(st => {
        const existing = allProjects.filter(p => {
            const pDists = projectDistricts.filter(pd => pd.projectId === p.id);
            return pDists.some(pd => pd.stateId === st.id);
        });
        if (existing.length === 0) {
            const pId = `proj-${prjCount++}`;
            const stateDistricts = districtsByStateLgd.get(st.lgdCode) || [];
            const d1 = stateDistricts[0] || districts[0];
            const proposed = 850 + (st.lgdCode * 35);
            const acquired = Math.round(proposed * (0.65 + ((st.lgdCode % 25) / 100)));
            const pObj = {
                id: pId,
                projectCode: `PRJ-${st.shortName}-2025-${String(prjCount).padStart(3, '0')}`,
                name: `${st.name} State Greenfield Logistics & Highway Corridor`,
                description: `Strategic multi-modal transport and development corridor in ${st.name}.`,
                projectType: 'HIGHWAY',
                implementingAgency: `${st.name} Public Works & Infrastructure Corp`,
                ministry: 'Ministry of Road Transport & Highways',
                status: 'IN_PROGRESS',
                totalLandRequired: proposed,
                totalLandAcquired: acquired,
                estimatedCost: 3500.0 + (st.lgdCode * 120),
                startDate: new Date('2024-06-01'),
                targetCompletionDate: new Date('2027-06-30'),
                dataSource: 'DEMO',
                createdBy: 'user-central-admin',
                createdAt: new Date('2024-06-01T10:00:00Z'),
                updatedAt: new Date('2026-08-25T12:00:00Z')
            };
            allProjects.push(pObj);
            projectDistricts.push({
                id: `pd-${pId}-1`,
                projectId: pId,
                districtId: d1.id,
                stateId: st.id,
                landRequired: proposed,
                landAcquired: acquired,
                createdAt: new Date('2024-06-01T10:00:00Z'),
                updatedAt: new Date('2026-08-25T12:00:00Z')
            });
            // 1 Acquisition case
            const caseId = `case-${caseCount++}`;
            acquisitionCases.push({
                id: caseId,
                caseNumber: `LA-${st.shortName}-${d1.name.substring(0, 3).toUpperCase()}-2025-${100 + caseCount}`,
                projectId: pId,
                districtId: d1.id,
                stateId: st.id,
                currentStatus: 'COMPENSATION',
                landRequired: proposed,
                landAcquired: acquired,
                notificationDate: new Date('2024-08-15'),
                awardDate: new Date('2025-04-10'),
                possessionDate: null,
                dataSource: 'DEMO',
                createdBy: 'user-central-admin',
                createdAt: new Date('2024-06-05T10:00:00Z'),
                updatedAt: new Date('2026-08-25T12:00:00Z')
            });
            caseStatusHistory.push({
                id: `csh-${caseId}-1`,
                caseId,
                oldStatus: null,
                newStatus: 'NOTIFICATION',
                changedBy: 'user-central-admin',
                remarks: 'Statutory 3A declaration published in State Gazette.',
                changedAt: new Date('2024-08-15T10:00:00Z')
            });
        }
    });
    // Notifications
    notifications.push({
        id: 'notif-1',
        userId: 'user-central-admin',
        type: 'APPROVAL_REQUIRED',
        title: 'Pending Land Award Sanction',
        message: 'Purvanchal Industrial Corridor Section 3G valuation award requires central concurrence.',
        referenceType: 'PROJECT',
        referenceId: 'proj-2',
        isRead: false,
        createdAt: new Date('2026-08-26T08:30:00Z')
    }, {
        id: 'notif-2',
        userId: 'user-central-admin',
        type: 'STAGE_COMPLETED',
        title: 'Possession Handover Complete',
        message: 'Western DFC Section Package IV handed over 35.5 Ha clear possession to DFCCIL.',
        referenceType: 'CASE',
        referenceId: 'case-1',
        isRead: false,
        createdAt: new Date('2026-08-25T14:15:00Z')
    }, {
        id: 'notif-3',
        userId: 'user-central-admin',
        type: 'STATUTORY_ALERT',
        title: 'Section 15 Objection Period Expiring',
        message: 'Noida Airport Phase II 60-day public objection window closing in 4 days.',
        referenceType: 'PROJECT',
        referenceId: 'proj-6',
        isRead: false,
        createdAt: new Date('2026-08-24T11:00:00Z')
    });
    // Audit Logs
    auditLogs.push({
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
    }, {
        id: 'audit-002',
        userId: 'user-lao-01',
        userEmail: 'lao.nhai@gov.in',
        action: 'UPDATE_CASE_STAGE',
        entityType: 'ACQUISITION_CASE',
        entityId: 'case-2',
        oldValue: 'OBJECTION',
        newValue: 'VALUATION',
        ipAddress: '10.24.120.89',
        createdAt: new Date('2026-08-24T15:20:00Z')
    }, {
        id: 'audit-003',
        userId: 'user-agency-nhai',
        userEmail: 'pd.lucknow@nhai.org',
        action: 'UPLOAD_DOCUMENT',
        entityType: 'DOCUMENT',
        entityId: 'doc-proj-proj-2-dp',
        oldValue: null,
        newValue: 'DPR_PRJ-MORTH-2024-089.pdf',
        ipAddress: '10.24.120.12',
        createdAt: new Date('2026-08-23T11:05:00Z')
    });
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
        users
    };
}
if (require.main === module) {
    generateSeedData();
}
