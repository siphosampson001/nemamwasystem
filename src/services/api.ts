import {
  Citizen,
  WaitingListEntry,
  Stand,
  Payment,
  AuditLog,
  CouncilStats,
} from '../types';
import {
  getLocalCitizens,
  saveLocalCitizens,
  getLocalWaitingList,
  saveLocalWaitingList,
  getLocalStands,
  saveLocalStands,
  getLocalPayments,
  saveLocalPayments,
  getLocalAuditLogs,
  saveLocalAuditLogs,
  computeLocalStats,
  registerCitizenLocal,
  allocateStandLocal,
  createStandLocal,
  recordPaymentLocal,
  lookupCitizenPublicLocal,
  initLocalStorage,
  getLocalStorageDiagnostics,
  exportLocalStorageBackup,
  importLocalStorageBackup,
} from './storage';

// Ensure storage is initialized
initLocalStorage();

// Helper to determine if we should attempt server first
function isOnline(): boolean {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  return true;
}

export async function fetchStats(): Promise<CouncilStats> {
  if (!isOnline()) {
    return computeLocalStats();
  }
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Server returned non-200');
    const data: CouncilStats = await res.json();
    return data;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Serving stats from LocalStorage:', err);
    return computeLocalStats();
  }
}

export async function fetchCitizens(searchQuery?: string): Promise<Citizen[]> {
  if (!isOnline()) {
    return getLocalCitizens(searchQuery);
  }
  try {
    const url = searchQuery
      ? `/api/citizens?q=${encodeURIComponent(searchQuery)}`
      : '/api/citizens';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Server returned non-200');
    const data: Citizen[] = await res.json();
    // Cache to local storage
    if (!searchQuery) {
      saveLocalCitizens(data);
    }
    return data;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Serving citizens from LocalStorage');
    return getLocalCitizens(searchQuery);
  }
}

export async function registerCitizen(data: {
  fullName: string;
  nationalId: string;
  phone: string;
  address: string;
  preferredDensity: string;
  nextOfKin?: string;
  kinPhone?: string;
  employmentStatus?: string;
  notes?: string;
}): Promise<{ citizen: Citizen; queue: WaitingListEntry; receipt: Payment }> {
  // Always update Local Storage first or on offline
  if (!isOnline()) {
    return registerCitizenLocal(data);
  }

  try {
    const res = await fetch('/api/citizens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to register citizen applicant');
    }

    // Mirror to Local Storage
    const currentCitizens = getLocalCitizens();
    const currentQueue = getLocalWaitingList();
    const currentPayments = getLocalPayments();

    if (!currentCitizens.some((c) => c.citizenId === json.citizen.citizenId)) {
      currentCitizens.push(json.citizen);
      saveLocalCitizens(currentCitizens);
    }
    if (!currentQueue.some((q) => q.waitingId === json.queue.waitingId)) {
      currentQueue.push(json.queue);
      saveLocalWaitingList(currentQueue);
    }
    if (!currentPayments.some((p) => p.paymentId === json.receipt.paymentId)) {
      currentPayments.unshift(json.receipt);
      saveLocalPayments(currentPayments);
    }

    return json;
  } catch (err: any) {
    console.warn('[Server Unavailable] Performing local registration in LocalStorage:', err.message);
    return registerCitizenLocal(data);
  }
}

export async function fetchWaitingList(): Promise<WaitingListEntry[]> {
  if (!isOnline()) {
    return getLocalWaitingList();
  }
  try {
    const res = await fetch('/api/waiting-list');
    if (!res.ok) throw new Error('Server returned non-200');
    const data: WaitingListEntry[] = await res.json();
    saveLocalWaitingList(data);
    return data;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Serving waiting list from LocalStorage');
    return getLocalWaitingList();
  }
}

export async function fetchStands(): Promise<Stand[]> {
  if (!isOnline()) {
    return getLocalStands();
  }
  try {
    const res = await fetch('/api/stands');
    if (!res.ok) throw new Error('Server returned non-200');
    const data: Stand[] = await res.json();
    saveLocalStands(data);
    return data;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Serving stands from LocalStorage');
    return getLocalStands();
  }
}

export async function createStand(data: {
  standNumber: string;
  size: string;
  density: string;
  phase: string;
  priceUsd: number;
  beaconRef?: string;
}): Promise<Stand> {
  if (!isOnline()) {
    return createStandLocal(data);
  }
  try {
    const res = await fetch('/api/stands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create stand');

    // Update Local Storage
    const stands = getLocalStands();
    stands.push(json);
    saveLocalStands(stands);

    return json;
  } catch (err: any) {
    console.warn('[Server Unavailable] Surveying stand directly in LocalStorage:', err.message);
    return createStandLocal(data);
  }
}

export async function allocateStand(data: {
  standId: number;
  citizenId: number;
  officerName: string;
}): Promise<{
  success: boolean;
  stand: Stand;
  queueEntry: WaitingListEntry;
  letterRef: string;
  message: string;
}> {
  if (!isOnline()) {
    return allocateStandLocal(data);
  }
  try {
    const res = await fetch('/api/allocate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Allocation failed');

    // Update local cache
    const stands = getLocalStands();
    const stIdx = stands.findIndex((s) => s.standId === json.stand.standId);
    if (stIdx >= 0) stands[stIdx] = json.stand;
    saveLocalStands(stands);

    const queue = getLocalWaitingList();
    const qIdx = queue.findIndex((q) => q.waitingId === json.queueEntry.waitingId);
    if (qIdx >= 0) queue[qIdx] = json.queueEntry;
    saveLocalWaitingList(queue);

    return json;
  } catch (err: any) {
    console.warn('[Server Unavailable] Executing allocation in LocalStorage:', err.message);
    return allocateStandLocal(data);
  }
}

export async function fetchPayments(): Promise<Payment[]> {
  if (!isOnline()) {
    return getLocalPayments();
  }
  try {
    const res = await fetch('/api/payments');
    if (!res.ok) throw new Error('Server returned non-200');
    const data: Payment[] = await res.json();
    saveLocalPayments(data);
    return data;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Serving payments from LocalStorage');
    return getLocalPayments();
  }
}

export async function recordPayment(data: {
  citizenId: number;
  amount: number;
  purpose: string;
  paymentMethod: string;
  cashierName: string;
}): Promise<Payment> {
  if (!isOnline()) {
    return recordPaymentLocal(data);
  }
  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to record payment');

    // Save to local storage
    const payments = getLocalPayments();
    payments.unshift(json);
    saveLocalPayments(payments);

    return json;
  } catch (err: any) {
    console.warn('[Server Unavailable] Recording payment directly in LocalStorage:', err.message);
    return recordPaymentLocal(data);
  }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  if (!isOnline()) {
    return getLocalAuditLogs();
  }
  try {
    const res = await fetch('/api/audit-logs');
    if (!res.ok) throw new Error('Server returned non-200');
    const data: AuditLog[] = await res.json();
    saveLocalAuditLogs(data);
    return data;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Serving audit trail from LocalStorage');
    return getLocalAuditLogs();
  }
}

export async function lookupCitizenPublic(nationalId: string): Promise<{
  citizen: Citizen;
  queue?: WaitingListEntry;
  payments: Payment[];
  allocatedStand?: Stand;
  aheadInQueue: number;
  isFirstInLine: boolean;
}> {
  if (!isOnline()) {
    return lookupCitizenPublicLocal(nationalId);
  }
  try {
    const res = await fetch(`/api/public-lookup/${encodeURIComponent(nationalId)}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Citizen record not found');
    return json;
  } catch (err) {
    console.warn('[Network Offline / Server Unreachable] Looking up citizen in LocalStorage');
    return lookupCitizenPublicLocal(nationalId);
  }
}

export async function resetDatabase(): Promise<void> {
  // Reset local storage
  initLocalStorage(true);
  try {
    if (isOnline()) {
      await fetch('/api/reset-data', { method: 'POST' });
    }
  } catch (err) {
    console.warn('[Server Unavailable] Reset completed in LocalStorage only');
  }
}

export {
  getLocalStorageDiagnostics,
  exportLocalStorageBackup,
  importLocalStorageBackup,
};
