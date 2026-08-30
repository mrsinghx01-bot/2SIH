export interface StateData {
  id: string;
  lgdCode: number;
  name: string;
  shortName: string;
  localName?: string;
  type: 'STATE' | 'UNION_TERRITORY';
  capital?: string;
  projectsCount: number;
  landProposed: number;
  landAcquired: number;
  acquisitionPercentage: number;
  compensationPaid: number;
  affectedFamiliesCount: number;
  districtsCount: number;
}

export interface DistrictData {
  id: string;
  lgdCode: number;
  stateId: string;
  name: string;
  localName?: string;
  census2011Code?: string;
  geometryMatchStatus?: 'AUTO_MATCHED' | 'REVIEW_REQUIRED' | 'VERIFIED' | 'REJECTED';
}

export interface ProjectData {
  id: string;
  projectCode: string;
  name: string;
  description?: string;
  projectType: string;
  implementingAgency: string;
  ministry: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  totalLandRequired: number;
  totalLandAcquired: number;
  estimatedCost: number;
  progressPercentage: number;
  states?: string[];
  districts?: string[];
  startDate?: string;
  targetCompletionDate?: string;
  dataSource: string;
}

export interface AcquisitionCaseData {
  id: string;
  caseNumber: string;
  projectId: string;
  projectName?: string;
  projectCode?: string;
  districtId: string;
  districtName?: string;
  stateId: string;
  stateName?: string;
  currentStatus: 'INITIATED' | 'SURVEY' | 'NOTIFICATION' | 'OBJECTION' | 'VALUATION' | 'AWARD' | 'COMPENSATION' | 'POSSESSION' | 'COMPLETED' | 'REJECTED' | 'ON_HOLD' | 'CANCELLED';
  landRequired: number;
  landAcquired: number;
  notificationDate?: string;
  awardDate?: string;
  possessionDate?: string;
  dataSource: string;
}

export interface ParcelData {
  id: string;
  parcelNumber: string;
  districtId: string;
  districtName?: string;
  projectId?: string;
  projectName?: string;
  caseId?: string;
  village: string;
  khasraNumber?: string;
  areaHectares: number;
  landUse: string;
  acquisitionStatus: string;
  geojson?: string;
}

export interface CompensationData {
  id: string;
  caseId: string;
  caseNumber?: string;
  projectName?: string;
  districtName?: string;
  beneficiaryReference: string;
  beneficiaryName: string;
  assessedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  paymentStatus: 'PENDING' | 'ASSESSED' | 'APPROVED' | 'PARTIALLY_PAID' | 'PAID' | 'ON_HOLD';
  paymentDate?: string;
  transactionRef?: string;
}

export interface AffectedFamilyData {
  id: string;
  caseId: string;
  projectId: string;
  projectName?: string;
  districtId: string;
  districtName?: string;
  familyReference: string;
  headOfFamily: string;
  membersCount: number;
  vulnerabilityCategory?: string;
  affectedStatus: string;
  eligibilityStatus: string;
  rrStatus: 'PENDING' | 'IDENTIFIED' | 'RESETTLED' | 'REHABILITATED';
  rrRecord?: any;
}

export interface DocumentData {
  id: string;
  projectId?: string;
  caseId?: string;
  documentType: string;
  title: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  version: string;
  uploadedBy: string;
  createdAt: string;
}

export interface ApprovalData {
  id: string;
  entityType: string;
  entityId: string;
  approvalType: string;
  requestedBy: string;
  assignedTo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  remarks?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  referenceType?: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogData {
  id: string;
  userEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValue?: string | null;
  newValue?: string | null;
  ipAddress?: string;
  createdAt: string;
}

export interface UserData {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  ministry: string;
  stateId?: string | null;
  districtId?: string | null;
  assignedStateName?: string;
  assignedDistrictName?: string;
}
