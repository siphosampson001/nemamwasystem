import {
  Citizen,
  WaitingListEntry,
  Stand,
  Payment,
  AuditLog,
  CouncilStats,
} from '../types';

export const STORAGE_KEYS = {
  CITIZENS: 'nemamwa_rdc_citizens_v1',
  WAITING_LIST: 'nemamwa_rdc_waiting_list_v1',
  STANDS: 'nemamwa_rdc_stands_v1',
  PAYMENTS: 'nemamwa_rdc_payments_v1',
  AUDIT_LOGS: 'nemamwa_rdc_audit_logs_v1',
  STORAGE_MODE: 'nemamwa_rdc_storage_mode', // 'hybrid' | 'local_storage' | 'server_only'
  LAST_SYNC: 'nemamwa_rdc_last_sync',
  PENDING_SYNC: 'nemamwa_rdc_pending_sync_queue',
};

// Seed dataset for offline initialization
export const SEED_DATA = {
  citizens: [
    {
      id: 'c-1',
      citizenId: 1,
      fullName: 'Tinevimbo Violet Gaidzanwa',
      nationalId: '63-1234567M99',
      phone: '+263 77 234 5678',
      address: 'House 42, Nemamwa Growth Point, Masvingo',
      dateRegistered: '2026-08-15',
      lodgerCardNumber: 'NMM-LC-2026-0001',
      preferredDensity: 'Medium Density',
      nextOfKin: 'Tariro Gaidzanwa',
      kinPhone: '+263 77 987 6543',
      employmentStatus: 'Civil Servant (Ministry of Education)',
      notes: 'Initial lodger applicant verified with proof of residence',
    },
    {
      id: 'c-2',
      citizenId: 2,
      fullName: 'Farai Chitepo',
      nationalId: '63-2345678K44',
      phone: '+263 71 890 1234',
      address: 'Stand 12, Village 3, Chief Morgen Nemamwa',
      dateRegistered: '2026-08-18',
      lodgerCardNumber: 'NMM-LC-2026-0002',
      preferredDensity: 'High Density',
      nextOfKin: 'Grace Chitepo',
      kinPhone: '+263 71 234 5678',
      employmentStatus: 'Self-Employed / Agro-Dealer',
      notes: 'Applying for residential high density stand',
    },
    {
      id: 'c-3',
      citizenId: 3,
      fullName: 'Vimbai Moyo',
      nationalId: '63-3456789P12',
      phone: '+263 78 456 7890',
      address: 'Plot 7, Great Zimbabwe Road, Nemamwa',
      dateRegistered: '2026-08-22',
      lodgerCardNumber: 'NMM-LC-2026-0003',
      preferredDensity: 'Low Density',
      nextOfKin: 'Kudzi Moyo',
      kinPhone: '+263 78 111 2233',
      employmentStatus: 'Nurse (Nemamwa Clinic)',
      notes: 'Low density preference near heritage buffer',
    },
    {
      id: 'c-4',
      citizenId: 4,
      fullName: 'Tendai Mukamuri',
      nationalId: '63-4567890L55',
      phone: '+263 77 567 8901',
      address: 'Nemamwa Shopping Complex Room 4',
      dateRegistered: '2026-08-29',
      lodgerCardNumber: 'NMM-LC-2026-0004',
      preferredDensity: 'High Density',
      nextOfKin: 'Mary Mukamuri',
      kinPhone: '+263 77 888 9900',
      employmentStatus: 'Retail Merchant',
      notes: 'Lodger card verified',
    },
    {
      id: 'c-5',
      citizenId: 5,
      fullName: 'Blessing Mutasa',
      nationalId: '63-5678901T23',
      phone: '+263 73 678 9012',
      address: 'Council Quarters 8, Nemamwa RDC',
      dateRegistered: '2026-09-04',
      lodgerCardNumber: 'NMM-LC-2026-0005',
      preferredDensity: 'Medium Density',
      nextOfKin: 'John Mutasa',
      kinPhone: '+263 73 555 4433',
      employmentStatus: 'Artisan Carpenter',
      notes: 'Waiting for Phase 2 allocation',
    },
    {
      id: 'c-6',
      citizenId: 6,
      fullName: 'Ruvimbo Chiweshe',
      nationalId: '63-6789012B88',
      phone: '+263 77 789 0123',
      address: 'Stand 19, Nemamwa Extension',
      dateRegistered: '2026-09-10',
      lodgerCardNumber: 'NMM-LC-2026-0006',
      preferredDensity: 'High Density',
      nextOfKin: 'Brian Chiweshe',
      kinPhone: '+263 77 222 3344',
      employmentStatus: 'Primary School Teacher',
      notes: 'Complete paperwork submitted',
    },
    {
      id: 'c-7',
      citizenId: 7,
      fullName: 'Simbarashe Zhou',
      nationalId: '63-7890123D67',
      phone: '+263 71 890 2345',
      address: 'Nemamwa Bus Terminus Lodge',
      dateRegistered: '2026-09-15',
      lodgerCardNumber: 'NMM-LC-2026-0007',
      preferredDensity: 'Commercial',
      nextOfKin: 'Sharon Zhou',
      kinPhone: '+263 71 333 4455',
      employmentStatus: 'Transport Operator',
      notes: 'Commercial service stand request',
    },
  ] as Citizen[],

  waitingList: [
    {
      waitingId: 1,
      citizenId: 1,
      citizenName: 'Tinevimbo Violet Gaidzanwa',
      nationalId: '63-1234567M99',
      phone: '+263 77 234 5678',
      positionNumber: 1,
      status: 'Allocated',
      registrationDate: '2026-08-15',
      preferredDensity: 'Medium Density',
      priorityScore: 98,
      allocatedStandNumber: 'NEM-RES-002',
      allocationDate: '2026-09-20',
    },
    {
      waitingId: 2,
      citizenId: 2,
      citizenName: 'Farai Chitepo',
      nationalId: '63-2345678K44',
      phone: '+263 71 890 1234',
      positionNumber: 2,
      status: 'Waiting',
      registrationDate: '2026-08-18',
      preferredDensity: 'High Density',
      priorityScore: 95,
    },
    {
      waitingId: 3,
      citizenId: 3,
      citizenName: 'Vimbai Moyo',
      nationalId: '63-3456789P12',
      phone: '+263 78 456 7890',
      positionNumber: 3,
      status: 'Waiting',
      registrationDate: '2026-08-22',
      preferredDensity: 'Low Density',
      priorityScore: 92,
    },
    {
      waitingId: 4,
      citizenId: 4,
      citizenName: 'Tendai Mukamuri',
      nationalId: '63-4567890L55',
      phone: '+263 77 567 8901',
      positionNumber: 4,
      status: 'Waiting',
      registrationDate: '2026-08-29',
      preferredDensity: 'High Density',
      priorityScore: 88,
    },
    {
      waitingId: 5,
      citizenId: 5,
      citizenName: 'Blessing Mutasa',
      nationalId: '63-5678901T23',
      phone: '+263 73 678 9012',
      positionNumber: 5,
      status: 'Waiting',
      registrationDate: '2026-09-04',
      preferredDensity: 'Medium Density',
      priorityScore: 84,
    },
    {
      waitingId: 6,
      citizenId: 6,
      citizenName: 'Ruvimbo Chiweshe',
      nationalId: '63-6789012B88',
      phone: '+263 77 789 0123',
      positionNumber: 6,
      status: 'Waiting',
      registrationDate: '2026-09-10',
      preferredDensity: 'High Density',
      priorityScore: 80,
    },
    {
      waitingId: 7,
      citizenId: 7,
      citizenName: 'Simbarashe Zhou',
      nationalId: '63-7890123D67',
      phone: '+263 71 890 2345',
      positionNumber: 7,
      status: 'Waiting',
      registrationDate: '2026-09-15',
      preferredDensity: 'Commercial',
      priorityScore: 76,
    },
  ] as WaitingListEntry[],

  stands: [
    {
      standId: 1,
      standNumber: 'NEM-RES-001',
      size: '300 sqm',
      density: 'High Density',
      phase: 'Phase 1 Central',
      status: 'Available',
      priceUsd: 1800,
      beaconRef: 'BCN-NMM-101',
      zoningApproved: true,
    },
    {
      standId: 2,
      standNumber: 'NEM-RES-002',
      size: '600 sqm',
      density: 'Medium Density',
      phase: 'Phase 1 Central',
      status: 'Allocated',
      priceUsd: 3200,
      citizenId: 1,
      allocatedToName: 'Tinevimbo Violet Gaidzanwa',
      allocationDate: '2026-09-20',
      beaconRef: 'BCN-NMM-102',
      zoningApproved: true,
    },
    {
      standId: 3,
      standNumber: 'NEM-RES-003',
      size: '1000 sqm',
      density: 'Low Density',
      phase: 'Phase 1 Heritage View',
      status: 'Available',
      priceUsd: 5500,
      beaconRef: 'BCN-NMM-103',
      zoningApproved: true,
    },
    {
      standId: 4,
      standNumber: 'NEM-RES-004',
      size: '300 sqm',
      density: 'High Density',
      phase: 'Phase 1 Central',
      status: 'Available',
      priceUsd: 1800,
      beaconRef: 'BCN-NMM-104',
      zoningApproved: true,
    },
    {
      standId: 5,
      standNumber: 'NEM-RES-005',
      size: '300 sqm',
      density: 'High Density',
      phase: 'Phase 1 Central',
      status: 'Available',
      priceUsd: 1800,
      beaconRef: 'BCN-NMM-105',
      zoningApproved: true,
    },
    {
      standId: 6,
      standNumber: 'NEM-RES-006',
      size: '600 sqm',
      density: 'Medium Density',
      phase: 'Phase 2 East Extension',
      status: 'Available',
      priceUsd: 3400,
      beaconRef: 'BCN-NMM-201',
      zoningApproved: true,
    },
    {
      standId: 7,
      standNumber: 'NEM-RES-007',
      size: '1200 sqm',
      density: 'Commercial',
      phase: 'Growth Point Corridor',
      status: 'Available',
      priceUsd: 8000,
      beaconRef: 'BCN-NMM-COM-01',
      zoningApproved: true,
    },
    {
      standId: 8,
      standNumber: 'NEM-RES-008',
      size: '300 sqm',
      density: 'High Density',
      phase: 'Phase 2 East Extension',
      status: 'Reserved',
      priceUsd: 1800,
      beaconRef: 'BCN-NMM-202',
      zoningApproved: false,
    },
  ] as Stand[],

  payments: [
    {
      paymentId: 1,
      citizenId: 1,
      citizenName: 'Tinevimbo Violet Gaidzanwa',
      nationalId: '63-1234567M99',
      amount: 20,
      paymentDate: '2026-08-15',
      receiptNumber: 'REC-2026-0001',
      purpose: 'Registration Fee',
      paymentMethod: 'Cash USD',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 2,
      citizenId: 1,
      citizenName: 'Tinevimbo Violet Gaidzanwa',
      nationalId: '63-1234567M99',
      amount: 600,
      paymentDate: '2026-09-20',
      receiptNumber: 'REC-2026-0025',
      purpose: 'Stand Deposit',
      paymentMethod: 'Bank Transfer (CBZ/ZB)',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 3,
      citizenId: 2,
      citizenName: 'Farai Chitepo',
      nationalId: '63-2345678K44',
      amount: 20,
      paymentDate: '2026-08-18',
      receiptNumber: 'REC-2026-0002',
      purpose: 'Registration Fee',
      paymentMethod: 'EcoCash / Zipit',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 4,
      citizenId: 3,
      citizenName: 'Vimbai Moyo',
      nationalId: '63-3456789P12',
      amount: 20,
      paymentDate: '2026-08-22',
      receiptNumber: 'REC-2026-0003',
      purpose: 'Registration Fee',
      paymentMethod: 'Cash USD',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 5,
      citizenId: 4,
      citizenName: 'Tendai Mukamuri',
      nationalId: '63-4567890L55',
      amount: 20,
      paymentDate: '2026-08-29',
      receiptNumber: 'REC-2026-0004',
      purpose: 'Registration Fee',
      paymentMethod: 'Cash USD',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 6,
      citizenId: 5,
      citizenName: 'Blessing Mutasa',
      nationalId: '63-5678901T23',
      amount: 20,
      paymentDate: '2026-09-04',
      receiptNumber: 'REC-2026-0005',
      purpose: 'Registration Fee',
      paymentMethod: 'EcoCash / Zipit',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 7,
      citizenId: 6,
      citizenName: 'Ruvimbo Chiweshe',
      nationalId: '63-6789012B88',
      amount: 20,
      paymentDate: '2026-09-10',
      receiptNumber: 'REC-2026-0006',
      purpose: 'Registration Fee',
      paymentMethod: 'Cash USD',
      cashierName: 'A. Mutoko (Clerk)',
    },
    {
      paymentId: 8,
      citizenId: 7,
      citizenName: 'Simbarashe Zhou',
      nationalId: '63-7890123D67',
      amount: 20,
      paymentDate: '2026-09-15',
      receiptNumber: 'REC-2026-0007',
      purpose: 'Registration Fee',
      paymentMethod: 'POS Swipe',
      cashierName: 'A. Mutoko (Clerk)',
    },
  ] as Payment[],

  auditLogs: [
    {
      id: 'log-1',
      action: 'STAND_ALLOCATION',
      entityType: 'Stand',
      details: 'Stand NEM-RES-002 allocated to Tinevimbo Violet Gaidzanwa (Score: 98, FIFO Rank #1)',
      userId: 'usr-admin-1',
      userName: 'Council Housing Officer',
      userRole: 'Admin',
      timestamp: '2026-09-20 10:30:15',
    },
    {
      id: 'log-2',
      action: 'PAYMENT_RECORDED',
      entityType: 'Payment',
      details: 'Stand Deposit USD 600 received from Tinevimbo Violet Gaidzanwa for Stand NEM-RES-002',
      userId: 'usr-clerk-1',
      userName: 'A. Mutoko (Clerk)',
      userRole: 'Clerk',
      timestamp: '2026-09-20 09:45:22',
    },
    {
      id: 'log-3',
      action: 'CITIZEN_REGISTERED',
      entityType: 'Citizen',
      details: 'Registered applicant Simbarashe Zhou (ID: 63-7890123D67). Placed in FIFO Queue position #7',
      userId: 'usr-clerk-1',
      userName: 'A. Mutoko (Clerk)',
      userRole: 'Clerk',
      timestamp: '2026-09-15 14:12:00',
    },
  ] as AuditLog[],
};

// Safe JSON loader from localStorage
function readFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`[LocalStorage] Error parsing key ${key}:`, e);
    return defaultValue;
  }
}

// Safe JSON writer to localStorage
function writeToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
  } catch (e) {
    console.error(`[LocalStorage] Error writing key ${key}:`, e);
  }
}

/**
 * Initialize Local Storage with default seed records if unpopulated.
 */
export function initLocalStorage(forceReset = false): void {
  if (typeof window === 'undefined') return;

  const existing = localStorage.getItem(STORAGE_KEYS.CITIZENS);
  if (!existing || forceReset) {
    writeToStorage(STORAGE_KEYS.CITIZENS, SEED_DATA.citizens);
    writeToStorage(STORAGE_KEYS.WAITING_LIST, SEED_DATA.waitingList);
    writeToStorage(STORAGE_KEYS.STANDS, SEED_DATA.stands);
    writeToStorage(STORAGE_KEYS.PAYMENTS, SEED_DATA.payments);
    writeToStorage(STORAGE_KEYS.AUDIT_LOGS, SEED_DATA.auditLogs);
    localStorage.setItem(STORAGE_KEYS.STORAGE_MODE, 'hybrid');
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    console.log('[LocalStorage] Initialized with official Nemamwa RDC seed dataset.');
  }
}

// Ensure storage is initialized on module load
initLocalStorage();

/**
 * Get citizens from Local Storage
 */
export function getLocalCitizens(searchQuery?: string): Citizen[] {
  const citizens = readFromStorage<Citizen[]>(STORAGE_KEYS.CITIZENS, SEED_DATA.citizens);
  if (!searchQuery || !searchQuery.trim()) return citizens;
  const q = searchQuery.toLowerCase().trim();
  return citizens.filter(
    (c) =>
      c.fullName.toLowerCase().includes(q) ||
      c.nationalId.toLowerCase().includes(q) ||
      c.lodgerCardNumber.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
  );
}

export function saveLocalCitizens(citizens: Citizen[]): void {
  writeToStorage(STORAGE_KEYS.CITIZENS, citizens);
}

/**
 * Get waiting list from Local Storage
 */
export function getLocalWaitingList(): WaitingListEntry[] {
  return readFromStorage<WaitingListEntry[]>(STORAGE_KEYS.WAITING_LIST, SEED_DATA.waitingList);
}

export function saveLocalWaitingList(waitingList: WaitingListEntry[]): void {
  writeToStorage(STORAGE_KEYS.WAITING_LIST, waitingList);
}

/**
 * Get residential stands from Local Storage
 */
export function getLocalStands(): Stand[] {
  return readFromStorage<Stand[]>(STORAGE_KEYS.STANDS, SEED_DATA.stands);
}

export function saveLocalStands(stands: Stand[]): void {
  writeToStorage(STORAGE_KEYS.STANDS, stands);
}

/**
 * Get payments from Local Storage
 */
export function getLocalPayments(): Payment[] {
  return readFromStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, SEED_DATA.payments);
}

export function saveLocalPayments(payments: Payment[]): void {
  writeToStorage(STORAGE_KEYS.PAYMENTS, payments);
}

/**
 * Get audit logs from Local Storage
 */
export function getLocalAuditLogs(): AuditLog[] {
  return readFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_DATA.auditLogs);
}

export function saveLocalAuditLogs(logs: AuditLog[]): void {
  writeToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
}

/**
 * Compute Council KPI Statistics directly from Local Storage
 */
export function computeLocalStats(): CouncilStats {
  const citizens = getLocalCitizens();
  const waitingList = getLocalWaitingList();
  const stands = getLocalStands();
  const payments = getLocalPayments();

  const totalCitizens = citizens.length;
  const inWaitingQueue = waitingList.filter((w) => w.status === 'Waiting').length;
  const standsAllocated = stands.filter((s) => s.status === 'Allocated').length;
  const standsAvailable = stands.filter((s) => s.status === 'Available').length;
  const totalRevenueUsd = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const today = new Date().toISOString().split('T')[0];
  const todayRegistrations = citizens.filter((c) => c.dateRegistered === today).length;

  return {
    totalCitizens,
    inWaitingQueue,
    standsAllocated,
    standsAvailable,
    totalRevenueUsd,
    todayRegistrations,
    complianceRate: 100,
  };
}

/**
 * Register Citizen in Local Storage
 */
export function registerCitizenLocal(
  data: {
    fullName: string;
    nationalId: string;
    phone: string;
    address: string;
    preferredDensity: string;
    nextOfKin?: string;
    kinPhone?: string;
    employmentStatus?: string;
    notes?: string;
  },
  clerkName = 'A. Mutoko (Clerk)'
): { citizen: Citizen; queue: WaitingListEntry; receipt: Payment } {
  const citizens = getLocalCitizens();
  const waitingList = getLocalWaitingList();
  const payments = getLocalPayments();
  const auditLogs = getLocalAuditLogs();

  const normalizedId = data.nationalId.trim().toUpperCase();

  // Enforce duplicate National ID check
  const duplicate = citizens.find((c) => c.nationalId.toUpperCase() === normalizedId);
  if (duplicate) {
    throw new Error(
      `Duplicate National ID: An applicant with ID ${normalizedId} (${duplicate.fullName}) is already registered under lodger card ${duplicate.lodgerCardNumber}.`
    );
  }

  const nextCitizenId = citizens.length > 0 ? Math.max(...citizens.map((c) => c.citizenId)) + 1 : 1;
  const today = new Date().toISOString().split('T')[0];
  const lodgerCardNumber = `NMM-LC-2026-${String(nextCitizenId).padStart(4, '0')}`;

  const newCitizen: Citizen = {
    id: `c-${nextCitizenId}`,
    citizenId: nextCitizenId,
    fullName: data.fullName.trim(),
    nationalId: normalizedId,
    phone: data.phone.trim(),
    address: data.address.trim(),
    dateRegistered: today,
    lodgerCardNumber,
    preferredDensity: data.preferredDensity as any,
    nextOfKin: data.nextOfKin?.trim() || 'N/A',
    kinPhone: data.kinPhone?.trim() || 'N/A',
    employmentStatus: data.employmentStatus?.trim() || 'Self-Employed',
    notes: data.notes?.trim() || 'Front Desk enrollment',
  };

  // Add to citizens
  citizens.push(newCitizen);
  saveLocalCitizens(citizens);

  // Position in FIFO Queue
  const activeWaiting = waitingList.filter((w) => w.status === 'Waiting');
  const nextPosition = activeWaiting.length + 1;
  const nextWaitingId = waitingList.length > 0 ? Math.max(...waitingList.map((w) => w.waitingId)) + 1 : 1;

  const newQueueEntry: WaitingListEntry = {
    waitingId: nextWaitingId,
    citizenId: newCitizen.citizenId,
    citizenName: newCitizen.fullName,
    nationalId: newCitizen.nationalId,
    phone: newCitizen.phone,
    positionNumber: nextPosition,
    status: 'Waiting',
    registrationDate: today,
    preferredDensity: newCitizen.preferredDensity,
    priorityScore: Math.max(70, 100 - activeWaiting.length * 3),
  };

  waitingList.push(newQueueEntry);
  saveLocalWaitingList(waitingList);

  // Generate official registration fee payment & receipt
  const nextPaymentId = payments.length > 0 ? Math.max(...payments.map((p) => p.paymentId)) + 1 : 1;
  const receiptNumber = `REC-2026-${String(nextPaymentId).padStart(4, '0')}`;

  const newPayment: Payment = {
    paymentId: nextPaymentId,
    citizenId: newCitizen.citizenId,
    citizenName: newCitizen.fullName,
    nationalId: newCitizen.nationalId,
    amount: 20,
    paymentDate: today,
    receiptNumber,
    purpose: 'Registration Fee',
    paymentMethod: 'Cash USD',
    cashierName: clerkName,
  };

  payments.push(newPayment);
  saveLocalPayments(payments);

  // Audit log
  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action: 'CITIZEN_REGISTERED',
    entityType: 'Citizen',
    details: `Registered applicant ${newCitizen.fullName} (${newCitizen.nationalId}) in Local Storage. Position #${nextPosition}`,
    userId: 'usr-clerk-1',
    userName: clerkName,
    userRole: 'Clerk',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });
  saveLocalAuditLogs(auditLogs);

  queueOfflineMutation('REGISTER_CITIZEN', { citizen: newCitizen, queue: newQueueEntry, payment: newPayment });

  return { citizen: newCitizen, queue: newQueueEntry, receipt: newPayment };
}

/**
 * Allocate Stand in Local Storage
 */
export function allocateStandLocal(data: {
  standId: number;
  citizenId: number;
  officerName: string;
}): {
  success: boolean;
  stand: Stand;
  queueEntry: WaitingListEntry;
  letterRef: string;
  message: string;
} {
  const stands = getLocalStands();
  const waitingList = getLocalWaitingList();
  const citizens = getLocalCitizens();
  const auditLogs = getLocalAuditLogs();

  const stand = stands.find((s) => s.standId === Number(data.standId));
  if (!stand) throw new Error('Stand record not found');
  if (stand.status !== 'Available') throw new Error(`Stand ${stand.standNumber} is already ${stand.status}`);

  const citizen = citizens.find((c) => c.citizenId === Number(data.citizenId));
  if (!citizen) throw new Error('Citizen record not found');

  const queueEntry = waitingList.find((w) => w.citizenId === Number(data.citizenId));
  if (!queueEntry) throw new Error('Applicant is not found in the waiting list queue');

  const today = new Date().toISOString().split('T')[0];
  const letterRef = `NMM/HSG/ALL-2026-${String(stand.standId).padStart(4, '0')}`;

  // Update Stand
  stand.status = 'Allocated';
  stand.citizenId = citizen.citizenId;
  stand.allocatedToName = citizen.fullName;
  stand.allocationDate = today;
  saveLocalStands(stands);

  // Update Waiting List Entry
  queueEntry.status = 'Allocated';
  queueEntry.allocatedStandNumber = stand.standNumber;
  queueEntry.allocationDate = today;

  // Re-sequence remaining waiting list (FIFO continuity)
  let pos = 1;
  for (const item of waitingList) {
    if (item.status === 'Waiting') {
      item.positionNumber = pos++;
    }
  }
  saveLocalWaitingList(waitingList);

  // Audit log
  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action: 'STAND_ALLOCATION',
    entityType: 'Stand',
    details: `Executive Stand Allocation: Stand ${stand.standNumber} allocated to ${citizen.fullName} (${citizen.nationalId}). Letter: ${letterRef}`,
    userId: 'usr-admin-1',
    userName: data.officerName || 'Council Housing Officer',
    userRole: 'Admin',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });
  saveLocalAuditLogs(auditLogs);

  queueOfflineMutation('ALLOCATE_STAND', { standId: stand.standId, citizenId: citizen.citizenId, letterRef });

  return {
    success: true,
    stand,
    queueEntry,
    letterRef,
    message: `Stand ${stand.standNumber} successfully allocated to ${citizen.fullName} (Local Storage updated).`,
  };
}

/**
 * Survey New Stand in Local Storage
 */
export function createStandLocal(
  data: {
    standNumber: string;
    size: string;
    density: string;
    phase: string;
    priceUsd: number;
    beaconRef?: string;
  },
  officerName = 'Council Housing Officer'
): Stand {
  const stands = getLocalStands();
  const auditLogs = getLocalAuditLogs();

  const normalizedStandNo = data.standNumber.trim().toUpperCase();
  const exists = stands.find((s) => s.standNumber.toUpperCase() === normalizedStandNo);
  if (exists) {
    throw new Error(`Stand ${normalizedStandNo} already exists in the cadastre inventory.`);
  }

  const nextStandId = stands.length > 0 ? Math.max(...stands.map((s) => s.standId)) + 1 : 1;
  const newStand: Stand = {
    standId: nextStandId,
    standNumber: normalizedStandNo,
    size: data.size.trim(),
    density: data.density as any,
    phase: data.phase.trim(),
    status: 'Available',
    priceUsd: Number(data.priceUsd) || 2000,
    beaconRef: data.beaconRef?.trim() || `BCN-NMM-${100 + nextStandId}`,
    zoningApproved: true,
  };

  stands.push(newStand);
  saveLocalStands(stands);

  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action: 'STAND_CREATED',
    entityType: 'Stand',
    details: `Surveyed stand ${newStand.standNumber} (${newStand.density}, ${newStand.size}) added to cadastre. Beacon: ${newStand.beaconRef}`,
    userId: 'usr-admin-1',
    userName: officerName,
    userRole: 'Admin',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });
  saveLocalAuditLogs(auditLogs);

  queueOfflineMutation('CREATE_STAND', newStand);

  return newStand;
}

/**
 * Record Payment in Local Storage
 */
export function recordPaymentLocal(
  data: {
    citizenId: number;
    amount: number;
    purpose: string;
    paymentMethod: string;
    cashierName: string;
  }
): Payment {
  const payments = getLocalPayments();
  const citizens = getLocalCitizens();
  const auditLogs = getLocalAuditLogs();

  const citizen = citizens.find((c) => c.citizenId === Number(data.citizenId));
  if (!citizen) throw new Error('Citizen record not found');

  const nextPaymentId = payments.length > 0 ? Math.max(...payments.map((p) => p.paymentId)) + 1 : 1;
  const receiptNumber = `REC-2026-${String(nextPaymentId).padStart(4, '0')}`;
  const today = new Date().toISOString().split('T')[0];

  const newPayment: Payment = {
    paymentId: nextPaymentId,
    citizenId: citizen.citizenId,
    citizenName: citizen.fullName,
    nationalId: citizen.nationalId,
    amount: Number(data.amount),
    paymentDate: today,
    receiptNumber,
    purpose: data.purpose as any,
    paymentMethod: data.paymentMethod as any,
    cashierName: data.cashierName || 'A. Mutoko (Clerk)',
  };

  payments.unshift(newPayment);
  saveLocalPayments(payments);

  auditLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    action: 'PAYMENT_RECORDED',
    entityType: 'Payment',
    details: `Payment USD ${newPayment.amount} received from ${citizen.fullName} for ${newPayment.purpose} via ${newPayment.paymentMethod}`,
    userId: 'usr-clerk-1',
    userName: newPayment.cashierName,
    userRole: 'Clerk',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
  });
  saveLocalAuditLogs(auditLogs);

  queueOfflineMutation('RECORD_PAYMENT', newPayment);

  return newPayment;
}

/**
 * Lookup Citizen in Local Storage (Public Kiosk)
 */
export function lookupCitizenPublicLocal(nationalId: string): {
  citizen: Citizen;
  queue?: WaitingListEntry;
  payments: Payment[];
  allocatedStand?: Stand;
  aheadInQueue: number;
  isFirstInLine: boolean;
} {
  const citizens = getLocalCitizens();
  const waitingList = getLocalWaitingList();
  const stands = getLocalStands();
  const payments = getLocalPayments();

  const cleanId = nationalId.trim().toUpperCase();
  const citizen = citizens.find((c) => c.nationalId.toUpperCase() === cleanId);
  if (!citizen) {
    throw new Error(`No lodger registration found for National ID: ${cleanId}. Please verify ID or visit the Front Desk.`);
  }

  const queue = waitingList.find((w) => w.citizenId === citizen.citizenId);
  const citizenPayments = payments.filter((p) => p.citizenId === citizen.citizenId);
  const allocatedStand = stands.find((s) => s.citizenId === citizen.citizenId);

  let aheadInQueue = 0;
  let isFirstInLine = false;

  if (queue && queue.status === 'Waiting') {
    aheadInQueue = waitingList.filter(
      (w) => w.status === 'Waiting' && w.positionNumber < queue.positionNumber
    ).length;
    isFirstInLine = aheadInQueue === 0;
  }

  return {
    citizen,
    queue,
    payments: citizenPayments,
    allocatedStand,
    aheadInQueue,
    isFirstInLine,
  };
}

/**
 * Offline Mutation Queueing
 */
function queueOfflineMutation(type: string, payload: any): void {
  try {
    const queue = readFromStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
    queue.push({
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      type,
      payload,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
  } catch (e) {
    console.error('[LocalStorage] Error queueing mutation:', e);
  }
}

export function getPendingOfflineMutations(): any[] {
  return readFromStorage<any[]>(STORAGE_KEYS.PENDING_SYNC, []);
}

export function clearPendingOfflineMutations(): void {
  localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
}

/**
 * Full LocalStorage Data Backup (Export JSON)
 */
export function exportLocalStorageBackup(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    council: 'Masvingo Rural District Council - Nemamwa Housing Department',
    citizens: getLocalCitizens(),
    waitingList: getLocalWaitingList(),
    stands: getLocalStands(),
    payments: getLocalPayments(),
    auditLogs: getLocalAuditLogs(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Restore LocalStorage from Backup JSON
 */
export function importLocalStorageBackup(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.citizens || !parsed.stands || !parsed.waitingList) {
      throw new Error('Invalid backup file structure: missing core tables');
    }
    writeToStorage(STORAGE_KEYS.CITIZENS, parsed.citizens);
    writeToStorage(STORAGE_KEYS.WAITING_LIST, parsed.waitingList);
    writeToStorage(STORAGE_KEYS.STANDS, parsed.stands);
    if (parsed.payments) writeToStorage(STORAGE_KEYS.PAYMENTS, parsed.payments);
    if (parsed.auditLogs) writeToStorage(STORAGE_KEYS.AUDIT_LOGS, parsed.auditLogs);
    return true;
  } catch (e) {
    console.error('[LocalStorage] Failed to import backup:', e);
    return false;
  }
}

/**
 * Get Local Storage Diagnostics
 */
export function getLocalStorageDiagnostics() {
  const citizens = getLocalCitizens();
  const waiting = getLocalWaitingList();
  const stands = getLocalStands();
  const payments = getLocalPayments();
  const logs = getLocalAuditLogs();
  const pending = getPendingOfflineMutations();
  const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Never';

  // Estimate storage usage in KB
  let totalChars = 0;
  for (const key of Object.values(STORAGE_KEYS)) {
    totalChars += (localStorage.getItem(key) || '').length;
  }
  const approximateKb = (totalChars * 2) / 1024; // 2 bytes per char

  return {
    citizensCount: citizens.length,
    waitingCount: waiting.filter((w) => w.status === 'Waiting').length,
    standsCount: stands.length,
    paymentsCount: payments.length,
    auditLogsCount: logs.length,
    pendingSyncCount: pending.length,
    lastSync,
    approximateKb: Math.round(approximateKb * 10) / 10,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
}
