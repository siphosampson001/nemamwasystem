export type StandStatus = 'Available' | 'Allocated' | 'Reserved' | 'Under Survey';
export type StandDensity = 'High Density' | 'Medium Density' | 'Low Density' | 'Commercial';
export type QueueStatus = 'Waiting' | 'Allocated' | 'Removed' | 'Deferred';
export type PaymentPurpose = 'Registration Fee' | 'Annual Renewal' | 'Stand Deposit' | 'Survey Fee' | 'Title Deed Processing';
export type PaymentMethod = 'Cash USD' | 'EcoCash / Zipit' | 'Bank Transfer (CBZ/ZB)' | 'POS Swipe';
export type UserRole = 'Admin' | 'Housing Officer' | 'Clerk' | 'Public';

export interface Citizen {
  id: string;
  citizenId: number; // sequential ID as per Table 4.1
  fullName: string;
  nationalId: string; // Format e.g. 63-1234567M99
  phone: string;
  address: string;
  dateRegistered: string; // YYYY-MM-DD
  lodgerCardNumber: string; // e.g. NMM-LC-2026-001
  preferredDensity: StandDensity;
  nextOfKin?: string;
  kinPhone?: string;
  employmentStatus?: string;
  notes?: string;
}

export interface WaitingListEntry {
  waitingId: number;
  citizenId: number;
  citizenName: string;
  nationalId: string;
  phone: string;
  positionNumber: number; // Sequential FIFO queue number
  status: QueueStatus;
  registrationDate: string;
  preferredDensity: StandDensity;
  priorityScore: number;
  allocatedStandNumber?: string;
  allocationDate?: string;
}

export interface Stand {
  standId: number;
  standNumber: string; // e.g. NEM-RES-001
  size: string; // e.g. 300 sqm
  density: StandDensity;
  phase: string; // e.g. Phase 1 Central, Phase 2 East Extension
  status: StandStatus;
  priceUsd: number;
  citizenId?: number | null;
  allocatedToName?: string;
  allocationDate?: string | null;
  beaconRef: string; // e.g. BCN-NMM-9042
  zoningApproved: boolean;
}

export interface Payment {
  paymentId: number;
  citizenId: number;
  citizenName: string;
  nationalId: string;
  amount: number;
  paymentDate: string;
  receiptNumber: string; // e.g. REC-2026-0042
  purpose: PaymentPurpose;
  paymentMethod: PaymentMethod;
  cashierName: string;
}

export interface AllocationLetterData {
  letterRef: string;
  allocationDate: string;
  applicantName: string;
  nationalId: string;
  lodgerCardNo: string;
  standNumber: string;
  standSize: string;
  density: StandDensity;
  phase: string;
  beaconRef: string;
  priceUsd: number;
  depositPaid: number;
  officerName: string;
  officerTitle: string;
  conditions: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  details: string;
  entityType: 'Citizen' | 'WaitingList' | 'Stand' | 'Payment' | 'System';
}

export interface CouncilStats {
  totalCitizens: number;
  inWaitingQueue: number;
  standsAllocated: number;
  standsAvailable: number;
  totalRevenueUsd: number;
  todayRegistrations: number;
  complianceRate: number;
}
