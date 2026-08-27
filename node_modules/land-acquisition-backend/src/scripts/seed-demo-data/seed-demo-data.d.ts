import { StateRecord, DistrictRecord } from '../import-data/import-lgd-data';
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
}
export declare function generateSeedData(): SeedDataset;
