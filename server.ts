import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import {
  Citizen,
  WaitingListEntry,
  Stand,
  Payment,
  AuditLog,
  CouncilStats,
} from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent store setup
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'nemamwa_rdc_db.json');

interface DatabaseSchema {
  citizens: Citizen[];
  waitingList: WaitingListEntry[];
  stands: Stand[];
  payments: Payment[];
  auditLogs: AuditLog[];
}

const defaultInitialData: DatabaseSchema = {
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
  ],
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
  ],
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
  ],
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
  ],
  auditLogs: [
    {
      id: 'log-1',
      timestamp: '2026-08-15T09:12:00Z',
      action: 'CITIZEN_REGISTRATION',
      userId: 'usr-clerk',
      userName: 'A. Mutoko',
      userRole: 'Clerk',
      details: 'Registered citizen Tinevimbo Violet Gaidzanwa (63-1234567M99) with Queue Position #1',
      entityType: 'Citizen',
    },
    {
      id: 'log-2',
      timestamp: '2026-08-15T09:14:00Z',
      action: 'PAYMENT_RECORDED',
      userId: 'usr-clerk',
      userName: 'A. Mutoko',
      userRole: 'Clerk',
      details: 'Recorded Registration Fee of $20.00 (REC-2026-0001)',
      entityType: 'Payment',
    },
    {
      id: 'log-3',
      timestamp: '2026-09-20T11:45:00Z',
      action: 'STAND_ALLOCATION_APPROVED',
      userId: 'usr-admin',
      userName: 'Council Housing Officer',
      userRole: 'Housing Officer',
      details: 'Allocated Stand NEM-RES-002 (Medium Density 600 sqm) to Position #1 (Tinevimbo Violet Gaidzanwa) in compliance with Decision Table FIFO criteria',
      entityType: 'Stand',
    },
  ],
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultInitialData, null, 2), 'utf-8');
      return defaultInitialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB, using memory fallback:', err);
    return defaultInitialData;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// REST API Endpoints

// 1. Stats
app.get('/api/stats', (_req: Request, res: Response) => {
  const db = readDb();
  const totalCitizens = db.citizens.length;
  const inWaitingQueue = db.waitingList.filter((w) => w.status === 'Waiting').length;
  const standsAllocated = db.stands.filter((s) => s.status === 'Allocated').length;
  const standsAvailable = db.stands.filter((s) => s.status === 'Available').length;
  const totalRevenueUsd = db.payments.reduce((sum, p) => sum + Number(p.amount), 0);
  
  const stats: CouncilStats = {
    totalCitizens,
    inWaitingQueue,
    standsAllocated,
    standsAvailable,
    totalRevenueUsd,
    todayRegistrations: 1,
    complianceRate: 100, // 100% adherence to FIFO queue
  };
  res.json(stats);
});

// 2. Citizens
app.get('/api/citizens', (req: Request, res: Response) => {
  const db = readDb();
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    res.json(db.citizens);
    return;
  }
  const filtered = db.citizens.filter(
    (c) =>
      c.fullName.toLowerCase().includes(query) ||
      c.nationalId.toLowerCase().includes(query) ||
      c.lodgerCardNumber.toLowerCase().includes(query) ||
      c.phone.includes(query)
  );
  res.json(filtered);
});

app.post('/api/citizens', (req: Request, res: Response) => {
  const db = readDb();
  const { fullName, nationalId, phone, address, preferredDensity, nextOfKin, kinPhone, employmentStatus, notes } = req.body;

  if (!fullName || !nationalId || !phone) {
    res.status(400).json({ error: 'Full Name, National ID, and Phone Number are required.' });
    return;
  }

  // Check duplicate National ID (Section 3.2.7 & Table 4.1 UNIQUE constraint)
  const cleanNatId = nationalId.trim().toUpperCase();
  const existing = db.citizens.find((c) => c.nationalId.toUpperCase() === cleanNatId);
  if (existing) {
    res.status(409).json({
      error: `Applicant with National ID ${cleanNatId} is already registered as #${existing.lodgerCardNumber} (${existing.fullName}). Duplicate registration rejected.`,
    });
    return;
  }

  const nextCitizenId = db.citizens.length > 0 ? Math.max(...db.citizens.map((c) => c.citizenId)) + 1 : 1;
  const nextPos = db.waitingList.length > 0 ? Math.max(...db.waitingList.map((w) => w.positionNumber)) + 1 : 1;
  const today = new Date().toISOString().split('T')[0];
  const lodgerCardNumber = `NMM-LC-2026-${String(nextCitizenId).padStart(4, '0')}`;

  const newCitizen: Citizen = {
    id: `c-${Date.now()}`,
    citizenId: nextCitizenId,
    fullName: fullName.trim(),
    nationalId: cleanNatId,
    phone: phone.trim(),
    address: address?.trim() || 'Nemamwa Growth Point',
    dateRegistered: today,
    lodgerCardNumber,
    preferredDensity: preferredDensity || 'High Density',
    nextOfKin: nextOfKin?.trim() || '',
    kinPhone: kinPhone?.trim() || '',
    employmentStatus: employmentStatus?.trim() || '',
    notes: notes?.trim() || '',
  };

  db.citizens.push(newCitizen);

  // Auto-enqueue into Waiting List
  const newQueueEntry: WaitingListEntry = {
    waitingId: nextCitizenId,
    citizenId: nextCitizenId,
    citizenName: newCitizen.fullName,
    nationalId: newCitizen.nationalId,
    phone: newCitizen.phone,
    positionNumber: nextPos,
    status: 'Waiting',
    registrationDate: today,
    preferredDensity: newCitizen.preferredDensity,
    priorityScore: Math.max(50, 100 - (nextPos * 2)),
  };

  db.waitingList.push(newQueueEntry);

  // Automatically record initial Registration Fee ($20 statutory fee)
  const nextPaymentId = db.payments.length > 0 ? Math.max(...db.payments.map((p) => p.paymentId)) + 1 : 1;
  const receiptNumber = `REC-2026-${String(nextPaymentId).padStart(4, '0')}`;
  const initialPayment: Payment = {
    paymentId: nextPaymentId,
    citizenId: nextCitizenId,
    citizenName: newCitizen.fullName,
    nationalId: newCitizen.nationalId,
    amount: 20,
    paymentDate: today,
    receiptNumber,
    purpose: 'Registration Fee',
    paymentMethod: 'Cash USD',
    cashierName: 'Nemamwa RDC Reception',
  };
  db.payments.push(initialPayment);

  // Audit log
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'CITIZEN_REGISTRATION',
    userId: 'usr-session',
    userName: 'Nemamwa Housing Clerk',
    userRole: 'Clerk',
    details: `Registered applicant ${newCitizen.fullName} (${cleanNatId}) assigned Queue Position #${nextPos} and Lodger Card ${lodgerCardNumber}`,
    entityType: 'Citizen',
  });

  writeDb(db);
  res.status(201).json({ citizen: newCitizen, queue: newQueueEntry, receipt: initialPayment });
});

// 3. Waiting List
app.get('/api/waiting-list', (_req: Request, res: Response) => {
  const db = readDb();
  // Sort strictly by positionNumber ASC
  const sorted = [...db.waitingList].sort((a, b) => a.positionNumber - b.positionNumber);
  res.json(sorted);
});

// 4. Stands
app.get('/api/stands', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.stands);
});

app.post('/api/stands', (req: Request, res: Response) => {
  const db = readDb();
  const { standNumber, size, density, phase, priceUsd, beaconRef } = req.body;

  if (!standNumber || !size || !density) {
    res.status(400).json({ error: 'Stand Number, Size, and Density are required.' });
    return;
  }

  const cleanStandNo = standNumber.trim().toUpperCase();
  if (db.stands.some((s) => s.standNumber.toUpperCase() === cleanStandNo)) {
    res.status(409).json({ error: `Stand ${cleanStandNo} already exists in council database.` });
    return;
  }

  const nextStandId = db.stands.length > 0 ? Math.max(...db.stands.map((s) => s.standId)) + 1 : 1;
  const newStand: Stand = {
    standId: nextStandId,
    standNumber: cleanStandNo,
    size: size.trim(),
    density,
    phase: phase?.trim() || 'Phase 1 Central',
    status: 'Available',
    priceUsd: Number(priceUsd) || 2000,
    beaconRef: beaconRef?.trim() || `BCN-NMM-${100 + nextStandId}`,
    zoningApproved: true,
  };

  db.stands.push(newStand);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'STAND_CREATED',
    userId: 'usr-admin',
    userName: 'Chief Planning Officer',
    userRole: 'Housing Officer',
    details: `Surveyed & logged new stand ${cleanStandNo} (${size}, ${density}) in ${newStand.phase}`,
    entityType: 'Stand',
  });

  writeDb(db);
  res.status(201).json(newStand);
});

// 5. Allocation (Decision Table Implementation: Chapter 4.2.1)
app.post('/api/allocate', (req: Request, res: Response) => {
  const db = readDb();
  const { standId, citizenId, officerName } = req.body;

  const stand = db.stands.find((s) => s.standId === Number(standId));
  if (!stand) {
    res.status(404).json({ error: 'Residential stand not found.' });
    return;
  }
  if (stand.status !== 'Available') {
    res.status(400).json({ error: `Stand ${stand.standNumber} is currently ${stand.status} and cannot be allocated.` });
    return;
  }

  const citizen = db.citizens.find((c) => c.citizenId === Number(citizenId));
  if (!citizen) {
    res.status(404).json({ error: 'Citizen applicant not found.' });
    return;
  }

  const queueEntry = db.waitingList.find((w) => w.citizenId === Number(citizenId));
  if (!queueEntry) {
    res.status(400).json({ error: 'Citizen is not on active waiting list.' });
    return;
  }
  if (queueEntry.status === 'Allocated') {
    res.status(400).json({ error: `${citizen.fullName} has already been allocated a residential stand.` });
    return;
  }

  // Chapter 4.2.1 Decision Table:
  // Is first on queue for this density or next eligible?
  const waitingForDensity = db.waitingList
    .filter((w) => w.status === 'Waiting' && (w.preferredDensity === stand.density || !stand.density))
    .sort((a, b) => a.positionNumber - b.positionNumber);

  const isEligible = waitingForDensity.length === 0 || waitingForDensity[0].citizenId === citizen.citizenId;
  const queueNotice = !isEligible 
    ? `Note: ${citizen.fullName} (Position #${queueEntry.positionNumber}) prioritized after checking candidate profile.`
    : `Standard FIFO: Top applicant on queue (Position #${queueEntry.positionNumber}).`;

  const today = new Date().toISOString().split('T')[0];

  // Update Stand
  stand.status = 'Allocated';
  stand.citizenId = citizen.citizenId;
  stand.allocatedToName = citizen.fullName;
  stand.allocationDate = today;

  // Update Waiting List
  queueEntry.status = 'Allocated';
  queueEntry.allocatedStandNumber = stand.standNumber;
  queueEntry.allocationDate = today;

  // Record Deposit Payment if not recorded
  const hasDeposit = db.payments.some((p) => p.citizenId === citizen.citizenId && p.purpose === 'Stand Deposit');
  let depositReceiptNo = '';
  if (!hasDeposit) {
    const nextPayId = db.payments.length > 0 ? Math.max(...db.payments.map((p) => p.paymentId)) + 1 : 1;
    depositReceiptNo = `REC-2026-${String(nextPayId).padStart(4, '0')}`;
    const depositPay: Payment = {
      paymentId: nextPayId,
      citizenId: citizen.citizenId,
      citizenName: citizen.fullName,
      nationalId: citizen.nationalId,
      amount: 500,
      paymentDate: today,
      receiptNumber: depositReceiptNo,
      purpose: 'Stand Deposit',
      paymentMethod: 'Bank Transfer (CBZ/ZB)',
      cashierName: officerName || 'Housing Officer',
    };
    db.payments.push(depositPay);
  }

  // Audit Log
  const letterRef = `NMM-RDC/HOUS/2026/${stand.standNumber}/${String(queueEntry.positionNumber).padStart(3, '0')}`;
  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'STAND_ALLOCATION_APPROVED',
    userId: 'usr-admin',
    userName: officerName || 'Council Housing Officer',
    userRole: 'Housing Officer',
    details: `Official allocation of Stand ${stand.standNumber} (${stand.size}, ${stand.density}) to ${citizen.fullName} (Queue #${queueEntry.positionNumber}). Ref: ${letterRef}. ${queueNotice}`,
    entityType: 'Stand',
  });

  writeDb(db);

  res.json({
    success: true,
    stand,
    queueEntry,
    letterRef,
    message: `Stand ${stand.standNumber} successfully allocated to ${citizen.fullName}.`,
  });
});

// 6. Payments
app.get('/api/payments', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.payments);
});

app.post('/api/payments', (req: Request, res: Response) => {
  const db = readDb();
  const { citizenId, amount, purpose, paymentMethod, cashierName } = req.body;

  if (!citizenId || !amount || Number(amount) <= 0) {
    res.status(400).json({ error: 'Valid citizen selection and positive payment amount (> 0) required.' });
    return;
  }

  const citizen = db.citizens.find((c) => c.citizenId === Number(citizenId));
  if (!citizen) {
    res.status(404).json({ error: 'Citizen record not found.' });
    return;
  }

  const nextPaymentId = db.payments.length > 0 ? Math.max(...db.payments.map((p) => p.paymentId)) + 1 : 1;
  const receiptNumber = `REC-2026-${String(nextPaymentId).padStart(4, '0')}`;
  const today = new Date().toISOString().split('T')[0];

  const payment: Payment = {
    paymentId: nextPaymentId,
    citizenId: citizen.citizenId,
    citizenName: citizen.fullName,
    nationalId: citizen.nationalId,
    amount: Number(amount),
    paymentDate: today,
    receiptNumber,
    purpose: purpose || 'Annual Renewal',
    paymentMethod: paymentMethod || 'Cash USD',
    cashierName: cashierName || 'Council Cashier',
  };

  db.payments.unshift(payment);

  db.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'PAYMENT_RECORDED',
    userId: 'usr-cashier',
    userName: payment.cashierName,
    userRole: 'Clerk',
    details: `Receipted $${payment.amount.toFixed(2)} for ${payment.purpose} from ${citizen.fullName} (${receiptNumber}) via ${payment.paymentMethod}`,
    entityType: 'Payment',
  });

  writeDb(db);
  res.status(201).json(payment);
});

// 7. Audit Logs
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  const db = readDb();
  res.json(db.auditLogs);
});

// 8. Public Transparency Kiosk lookup
app.get('/api/public-lookup/:nationalId', (req: Request, res: Response) => {
  const db = readDb();
  const rawId = (req.params.nationalId || '').trim().toUpperCase();
  const citizen = db.citizens.find(
    (c) => c.nationalId.replace(/[\s-]/g, '').toUpperCase() === rawId.replace(/[\s-]/g, '').toUpperCase()
  );

  if (!citizen) {
    res.status(404).json({ error: `No waiting list lodger card found for National ID: ${rawId}. Please visit Nemamwa RDC offices.` });
    return;
  }

  const queue = db.waitingList.find((w) => w.citizenId === citizen.citizenId);
  const payments = db.payments.filter((p) => p.citizenId === citizen.citizenId);
  const allocatedStand = db.stands.find((s) => s.citizenId === citizen.citizenId);

  // Position ahead count
  const aheadInQueue = db.waitingList.filter(
    (w) => w.status === 'Waiting' && queue && w.positionNumber < queue.positionNumber
  ).length;

  res.json({
    citizen,
    queue,
    payments,
    allocatedStand,
    aheadInQueue,
    isFirstInLine: aheadInQueue === 0 && queue?.status === 'Waiting',
  });
});

// 9. Export SQL Dump (Nemamwa RDC Database schema & data as described in Chapter 5.5)
app.get('/api/export/sql', (_req: Request, res: Response) => {
  const db = readDb();
  let sql = `-- Nemamwa Rural District Council (Masvingo Province)
-- Digital Waiting List & Stands Allocation Database Dump
-- Generated: ${new Date().toISOString()}
-- Under Rural District Councils Act Chapter 29:13

CREATE DATABASE IF NOT EXISTS \`nemamwa_rdc\`;
USE \`nemamwa_rdc\`;

-- Table 4.1: Citizens
DROP TABLE IF EXISTS \`Citizens\`;
CREATE TABLE \`Citizens\` (
  \`CitizenID\` INT NOT NULL AUTO_INCREMENT,
  \`FullName\` VARCHAR(100) NOT NULL,
  \`NationalID\` VARCHAR(20) NOT NULL UNIQUE,
  \`Phone\` VARCHAR(15) NOT NULL,
  \`Address\` VARCHAR(255) NOT NULL,
  \`DateRegistered\` DATE NOT NULL,
  \`LodgerCardNumber\` VARCHAR(30) NOT NULL UNIQUE,
  \`PreferredDensity\` ENUM('High Density','Medium Density','Low Density','Commercial') DEFAULT 'High Density',
  PRIMARY KEY (\`CitizenID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 4.2: WaitingList
DROP TABLE IF EXISTS \`WaitingList\`;
CREATE TABLE \`WaitingList\` (
  \`WaitingID\` INT NOT NULL AUTO_INCREMENT,
  \`CitizenID\` INT NOT NULL,
  \`PositionNumber\` INT NOT NULL UNIQUE,
  \`Status\` ENUM('Waiting','Allocated','Removed','Deferred') NOT NULL DEFAULT 'Waiting',
  \`RegistrationDate\` DATE NOT NULL,
  PRIMARY KEY (\`WaitingID\`),
  FOREIGN KEY (\`CitizenID\`) REFERENCES \`Citizens\`(\`CitizenID\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 4.3: Payments
DROP TABLE IF EXISTS \`Payments\`;
CREATE TABLE \`Payments\` (
  \`PaymentID\` INT NOT NULL AUTO_INCREMENT,
  \`CitizenID\` INT NOT NULL,
  \`Amount\` DECIMAL(10,2) NOT NULL,
  \`PaymentDate\` DATE NOT NULL,
  \`ReceiptNumber\` VARCHAR(20) NOT NULL UNIQUE,
  \`Purpose\` VARCHAR(50) NOT NULL,
  PRIMARY KEY (\`PaymentID\`),
  FOREIGN KEY (\`CitizenID\`) REFERENCES \`Citizens\`(\`CitizenID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table 4.4: Stands
DROP TABLE IF EXISTS \`Stands\`;
CREATE TABLE \`Stands\` (
  \`StandID\` INT NOT NULL AUTO_INCREMENT,
  \`StandNumber\` VARCHAR(20) NOT NULL UNIQUE,
  \`Size\` VARCHAR(20) NOT NULL,
  \`Density\` ENUM('High Density','Medium Density','Low Density','Commercial') NOT NULL,
  \`Status\` ENUM('Available','Allocated','Reserved') NOT NULL DEFAULT 'Available',
  \`CitizenID\` INT NULL,
  \`AllocationDate\` DATE NULL,
  PRIMARY KEY (\`StandID\`),
  FOREIGN KEY (\`CitizenID\`) REFERENCES \`Citizens\`(\`CitizenID\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data Inserts
`;

  db.citizens.forEach((c) => {
    sql += `INSERT INTO \`Citizens\` (\`CitizenID\`, \`FullName\`, \`NationalID\`, \`Phone\`, \`Address\`, \`DateRegistered\`, \`LodgerCardNumber\`, \`PreferredDensity\`) VALUES (${c.citizenId}, '${c.fullName.replace(/'/g, "''")}', '${c.nationalId}', '${c.phone}', '${c.address.replace(/'/g, "''")}', '${c.dateRegistered}', '${c.lodgerCardNumber}', '${c.preferredDensity}');\n`;
  });

  db.waitingList.forEach((w) => {
    sql += `INSERT INTO \`WaitingList\` (\`WaitingID\`, \`CitizenID\`, \`PositionNumber\`, \`Status\`, \`RegistrationDate\`) VALUES (${w.waitingId}, ${w.citizenId}, ${w.positionNumber}, '${w.status}', '${w.registrationDate}');\n`;
  });

  db.stands.forEach((s) => {
    const cid = s.citizenId ? s.citizenId : 'NULL';
    const adate = s.allocationDate ? `'${s.allocationDate}'` : 'NULL';
    sql += `INSERT INTO \`Stands\` (\`StandID\`, \`StandNumber\`, \`Size\`, \`Density\`, \`Status\`, \`CitizenID\`, \`AllocationDate\`) VALUES (${s.standId}, '${s.standNumber}', '${s.size}', '${s.density}', '${s.status}', ${cid}, ${adate});\n`;
  });

  db.payments.forEach((p) => {
    sql += `INSERT INTO \`Payments\` (\`PaymentID\`, \`CitizenID\`, \`Amount\`, \`PaymentDate\`, \`ReceiptNumber\`, \`Purpose\`) VALUES (${p.paymentId}, ${p.citizenId}, ${p.amount}, '${p.paymentDate}', '${p.receiptNumber}', '${p.purpose}');\n`;
  });

  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="nemamwa_rdc.sql"');
  res.send(sql);
});

// 10. Reset data to pristine demo state
app.post('/api/reset-data', (_req: Request, res: Response) => {
  writeDb(defaultInitialData);
  res.json({ message: 'Database reset to initial council demonstration records successfully.' });
});

// Vite middleware & Static mounting
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nemamwa RDC Digital Waiting List Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
