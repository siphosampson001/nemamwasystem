import React, { useState, useEffect } from 'react';
import { 
  CouncilStats, 
  Citizen, 
  WaitingListEntry, 
  Stand, 
  Payment, 
  AuditLog, 
  UserRole,
  StandDensity,
  PaymentPurpose,
  PaymentMethod
} from './types';
import { CouncilHeader } from './components/CouncilHeader';
import { DashboardView } from './components/DashboardView';
import { CitizenRegistration } from './components/CitizenRegistration';
import { WaitingListView } from './components/WaitingListView';
import { StandsView } from './components/StandsView';
import { PaymentsView } from './components/PaymentsView';
import { ReportsView } from './components/ReportsView';
import { AuditLogView } from './components/AuditLogView';
import { LodgerCardModal } from './components/LodgerCardModal';
import { AllocationModal } from './components/AllocationModal';
import { AllocationLetterModal } from './components/AllocationLetterModal';
import { ReceiptModal } from './components/ReceiptModal';
import { PublicKioskView } from './components/PublicKioskView';
import { LoginPage, AuthUser } from './components/LoginPage';
import { CouncilLogo } from './components/CouncilLogo';
import { LocalStorageModal } from './components/LocalStorageModal';
import { 
  Building2, 
  RefreshCw, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Server
} from 'lucide-react';
import { 
  fetchStats, 
  fetchCitizens, 
  fetchWaitingList, 
  fetchStands, 
  fetchPayments, 
  fetchAuditLogs,
  createStand,
  allocateStand,
  recordPayment,
  resetDatabase
} from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('nemamwa_rdc_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>(currentUser ? currentUser.role : 'Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Data
  const [stats, setStats] = useState<CouncilStats>({
    totalCitizens: 0,
    inWaitingQueue: 0,
    standsAllocated: 0,
    standsAvailable: 0,
    totalRevenueUsd: 0,
    todayRegistrations: 0,
    complianceRate: 100,
  });
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [waitingList, setWaitingList] = useState<WaitingListEntry[]>([]);
  const [stands, setStands] = useState<Stand[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals state
  const [selectedCitizenForCard, setSelectedCitizenForCard] = useState<Citizen | null>(null);
  const [selectedQueueForCard, setSelectedQueueForCard] = useState<WaitingListEntry | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [allocationStandTarget, setAllocationStandTarget] = useState<Stand | null>(null);
  const [allocationQueueTarget, setAllocationQueueTarget] = useState<WaitingListEntry | null>(null);
  const [activeLetterData, setActiveLetterData] = useState<{
    stand: Stand;
    citizen: Citizen;
    queueEntry?: WaitingListEntry;
    letterRef?: string;
  } | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<Payment | null>(null);
  const [showPublicKiosk, setShowPublicKiosk] = useState(false);
  const [showLocalStorageModal, setShowLocalStorageModal] = useState(false);

  // Load all council data
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [s, c, w, st, p, a] = await Promise.all([
        fetchStats(),
        fetchCitizens(),
        fetchWaitingList(),
        fetchStands(),
        fetchPayments(),
        fetchAuditLogs(),
      ]);
      setStats(s);
      setCitizens(c);
      setWaitingList(w);
      setStands(st);
      setPayments(p);
      setAuditLogs(a);
    } catch (err: any) {
      console.error('Failed to load council records:', err);
      setError(err.message || 'Error communicating with Council Server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Citizen Registration Callback
  const handleRegisterSuccess = (result: {
    citizen: Citizen;
    queue: WaitingListEntry;
    receipt: Payment;
  }) => {
    loadData();
    // Auto-show Lodger's Card
    setSelectedCitizenForCard(result.citizen);
    setSelectedQueueForCard(result.queue);
  };

  // Open Lodger's card for a citizen
  const handleOpenLodgerCard = (c: Citizen) => {
    const q = waitingList.find((w) => w.citizenId === c.citizenId);
    setSelectedCitizenForCard(c);
    setSelectedQueueForCard(q || null);
  };

  // Open Allocation / Acceptance Letter from Queue
  const handleOpenAllocationLetterForQueue = (entry: WaitingListEntry) => {
    const targetCitizen = citizens.find((c) => c.citizenId === entry.citizenId);
    const targetStand = stands.find(
      (s) => s.standNumber === entry.allocatedStandNumber || s.citizenId === entry.citizenId
    );
    if (targetCitizen && targetStand) {
      setActiveLetterData({
        stand: targetStand,
        citizen: targetCitizen,
        queueEntry: entry,
        letterRef: `NMM-RDC/HOUS/2026/${targetStand.standNumber}/${String(entry.positionNumber || '001').padStart(3, '0')}`,
      });
    }
  };

  // Open Allocation / Acceptance Letter from Stand
  const handleOpenAllocationLetterForStand = (stand: Stand) => {
    const targetCitizen = citizens.find(
      (c) => c.citizenId === stand.citizenId || c.fullName === stand.allocatedToName
    );
    const targetQueue = waitingList.find(
      (w) => w.citizenId === stand.citizenId || w.allocatedStandNumber === stand.standNumber
    );
    if (targetCitizen) {
      setActiveLetterData({
        stand,
        citizen: targetCitizen,
        queueEntry: targetQueue || undefined,
        letterRef: `NMM-RDC/HOUS/2026/${stand.standNumber}/${String(targetQueue?.positionNumber || '001').padStart(3, '0')}`,
      });
    }
  };

  // Stand Allocation Confirmation
  const handleConfirmAllocation = async (
    standId: number,
    citizenId: number,
    officerName: string
  ) => {
    const res = await allocateStand({ standId, citizenId, officerName });
    await loadData();

    const targetStand = stands.find((s) => s.standId === standId) || res.stand;
    const targetCitizen = citizens.find((c) => c.citizenId === citizenId);

    if (targetStand && targetCitizen) {
      setActiveLetterData({
        stand: { ...targetStand, status: 'Allocated', allocatedToName: targetCitizen.fullName },
        citizen: targetCitizen,
        queueEntry: res.queueEntry,
        letterRef: res.letterRef,
      });
    }
  };

  // Create new stand
  const handleAddStand = async (data: {
    standNumber: string;
    size: string;
    density: StandDensity;
    phase: string;
    priceUsd: number;
    beaconRef?: string;
  }) => {
    await createStand(data);
    loadData();
  };

  // Record payment
  const handleRecordPayment = async (data: {
    citizenId: number;
    amount: number;
    purpose: PaymentPurpose;
    paymentMethod: PaymentMethod;
    cashierName: string;
  }): Promise<Payment> => {
    const newPayment = await recordPayment(data);
    await loadData();
    return newPayment;
  };

  // Reset database to initial proposal data
  const handleResetData = async () => {
    if (window.confirm('Reset all council data back to pristine demo state?')) {
      await resetDatabase();
      loadData();
    }
  };

  // Render Login Page first if not authenticated
  if (!currentUser) {
    return (
      <>
        <LoginPage
          onLogin={(user) => {
            setCurrentUser(user);
            setCurrentRole(user.role);
            try {
              localStorage.setItem('nemamwa_rdc_auth_user', JSON.stringify(user));
            } catch {}
          }}
          onOpenPublicKiosk={() => setShowPublicKiosk(true)}
        />
        {showPublicKiosk && (
          <PublicKioskView
            onClose={() => setShowPublicKiosk(false)}
            onOpenLodgerCard={(c) => {
              setShowPublicKiosk(false);
              handleOpenLodgerCard(c);
            }}
            onOpenAllocationLetter={(stand, citizen, queue) => {
              setShowPublicKiosk(false);
              setActiveLetterData({
                stand,
                citizen,
                queueEntry: queue || undefined,
                letterRef: `NMM-RDC/HOUS/2026/${stand.standNumber}/${String(queue?.positionNumber || '001').padStart(3, '0')}`,
              });
            }}
          />
        )}
        {selectedCitizenForCard && (
          <LodgerCardModal
            citizen={selectedCitizenForCard}
            queueEntry={selectedQueueForCard}
            onClose={() => {
              setSelectedCitizenForCard(null);
              setSelectedQueueForCard(null);
            }}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-blue-950">
      {/* Council Header */}
      <CouncilHeader
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        currentUser={currentUser}
        onLogout={() => {
          setCurrentUser(null);
          try {
            localStorage.removeItem('nemamwa_rdc_auth_user');
          } catch {}
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickSearch={(query) => {
          setSearchQuery(query);
          if (query && activeTab === 'dashboard') {
            setActiveTab('waiting-list');
          }
        }}
        searchQuery={searchQuery}
        onOpenPublicKiosk={() => setShowPublicKiosk(true)}
        onOpenLocalStorageModal={() => setShowLocalStorageModal(true)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {error && (
          <div className="bg-rose-50 border border-rose-300 p-4 rounded-xl text-rose-900 text-xs flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-200 hover:bg-rose-300 text-rose-900 rounded font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-700">
              Connecting to Nemamwa RDC Central Database...
            </p>
            <p className="text-xs text-slate-400">
              Retrieving live waiting list, cadastre inventory, and payment ledger
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                stats={stats}
                waitingList={waitingList}
                stands={stands}
                payments={payments}
                userRole={currentRole}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenAllocateModal={() => {
                  if (currentRole !== 'Admin') return;
                  setAllocationStandTarget(null);
                  setAllocationQueueTarget(null);
                  setShowAllocateModal(true);
                }}
                onOpenRegisterModal={() => setActiveTab('register')}
                onOpenPublicKiosk={() => setShowPublicKiosk(true)}
              />
            )}

            {activeTab === 'register' && (
              <CitizenRegistration
                onRegisterSuccess={handleRegisterSuccess}
                existingCitizens={citizens}
              />
            )}

            {activeTab === 'waiting-list' && (
              <WaitingListView
                waitingList={waitingList}
                citizens={citizens}
                onSelectCitizen={handleOpenLodgerCard}
                onViewAllocationLetter={handleOpenAllocationLetterForQueue}
                onInitiateAllocation={(entry) => {
                  if (currentRole !== 'Admin') return;
                  setAllocationQueueTarget(entry);
                  const matchingStand = stands.find(
                    (s) => s.status === 'Available' && s.density === entry.preferredDensity
                  ) || stands.find((s) => s.status === 'Available');
                  setAllocationStandTarget(matchingStand || null);
                  setShowAllocateModal(true);
                }}
                userRole={currentRole}
              />
            )}

            {activeTab === 'stands' && (
              currentRole === 'Admin' ? (
                <StandsView
                  stands={stands}
                  onAddStand={handleAddStand}
                  onAllocateStand={(stand) => {
                    setAllocationStandTarget(stand);
                    const eligibleApplicant = waitingList.find(
                      (w) => w.status === 'Waiting' && w.preferredDensity === stand.density
                    ) || waitingList.find((w) => w.status === 'Waiting');
                    setAllocationQueueTarget(eligibleApplicant || null);
                    setShowAllocateModal(true);
                  }}
                  onViewAllocationLetter={handleOpenAllocationLetterForStand}
                  userRole={currentRole}
                />
              ) : (
                <div className="bg-amber-50 border-2 border-amber-400 p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm">
                  <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Restricted Executive Clearance Required
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Stand Cadastre Allocation, Survey Beacons, and Stand Approvals are strictly restricted to the <strong>Council Housing Officer (Admin)</strong> under Section 74 of Rural District Councils Act [Chapter 29:13].
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 bg-[#002855] text-amber-300 hover:text-white text-xs font-bold rounded-lg shadow"
                    >
                      Return to Front Desk Intake Counter
                    </button>
                  </div>
                </div>
              )
            )}

            {activeTab === 'payments' && (
              <PaymentsView
                payments={payments}
                citizens={citizens}
                onRecordPayment={handleRecordPayment}
                onViewReceipt={(payment) => setActiveReceipt(payment)}
                userRole={currentRole}
              />
            )}

            {activeTab === 'reports' && (
              currentRole === 'Admin' ? (
                <ReportsView
                  stats={stats}
                  waitingList={waitingList}
                  stands={stands}
                  payments={payments}
                  citizens={citizens}
                />
              ) : (
                <div className="bg-amber-50 border-2 border-amber-400 p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm">
                  <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Council Reports Access Restricted
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Official Council Committee digests, revenue digests, and database exports are restricted to executive management.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 bg-[#002855] text-amber-300 hover:text-white text-xs font-bold rounded-lg shadow"
                    >
                      Return to Front Desk Counter
                    </button>
                  </div>
                </div>
              )
            )}

            {activeTab === 'audit' && (
              currentRole === 'Admin' ? (
                <AuditLogView logs={auditLogs} />
              ) : (
                <div className="bg-amber-50 border-2 border-amber-400 p-8 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 shadow-sm">
                  <div className="w-14 h-14 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-8 h-8 text-amber-700" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    Security Audit Trail Restricted
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The anti-corruption cryptographic audit ledger is accessible only by authorized supervisory officers.
                  </p>
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 bg-[#002855] text-amber-300 hover:text-white text-xs font-bold rounded-lg shadow"
                    >
                      Return to Front Desk Counter
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {selectedCitizenForCard && (
        <LodgerCardModal
          citizen={selectedCitizenForCard}
          queueEntry={selectedQueueForCard}
          onClose={() => {
            setSelectedCitizenForCard(null);
            setSelectedQueueForCard(null);
          }}
        />
      )}

      {showAllocateModal && (
        <AllocationModal
          stand={allocationStandTarget}
          waitingEntry={allocationQueueTarget}
          availableStands={stands.filter((s) => s.status === 'Available')}
          activeWaitingList={waitingList}
          citizens={citizens}
          onConfirmAllocation={handleConfirmAllocation}
          onClose={() => setShowAllocateModal(false)}
        />
      )}

      {activeLetterData && (
        <AllocationLetterModal
          stand={activeLetterData.stand}
          citizen={activeLetterData.citizen}
          queueEntry={activeLetterData.queueEntry}
          letterRef={activeLetterData.letterRef}
          onClose={() => setActiveLetterData(null)}
        />
      )}

      {activeReceipt && (
        <ReceiptModal
          payment={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {showPublicKiosk && (
        <PublicKioskView
          onClose={() => setShowPublicKiosk(false)}
          onOpenLodgerCard={(c) => {
            setShowPublicKiosk(false);
            handleOpenLodgerCard(c);
          }}
          onOpenAllocationLetter={(stand, citizen, queue) => {
            setShowPublicKiosk(false);
            setActiveLetterData({
              stand,
              citizen,
              queueEntry: queue || undefined,
              letterRef: `NMM-RDC/HOUS/2026/${stand.standNumber}/${String(queue?.positionNumber || '001').padStart(3, '0')}`,
            });
          }}
        />
      )}

      {showLocalStorageModal && (
        <LocalStorageModal
          isOpen={showLocalStorageModal}
          onClose={() => setShowLocalStorageModal(false)}
          onDataChanged={loadData}
        />
      )}

      {/* Council Official Footer */}
      <footer className="bg-[#001D40] text-slate-400 text-xs border-t-2 border-[#D4AF37] mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CouncilLogo variant="card" className="h-10 w-auto shrink-0" />
            <div>
              <p className="text-white font-bold">
                Masvingo Rural District Council &bull; Nemamwa Growth Point
              </p>
              <p className="text-[11px] text-slate-400">
                Department of Housing & Community Services &bull; Rural District Councils Act [Chapter 29:13]
              </p>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="text-amber-300 font-semibold">
              Research & System Development by: Tinevimbo Violet Gaidzanwa
            </p>
            <div className="flex items-center justify-center md:justify-end gap-3 mt-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <Server className="w-3 h-3" /> Central Housing Database System
              </span>
              <span>&bull;</span>
              <button
                onClick={handleResetData}
                className="text-slate-300 hover:text-amber-300 underline flex items-center gap-1"
                title="Reset sample records"
              >
                <RotateCcw className="w-3 h-3" /> Reset Demo DB
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
