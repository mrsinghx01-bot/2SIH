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
}
export declare function loadMasterGeographicData(): {
    states: StateRecord[];
    districts: DistrictRecord[];
};
