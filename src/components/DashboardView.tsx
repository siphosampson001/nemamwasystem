import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { CouncilStats, WaitingListEntry, Stand, Payment, UserRole } from '../types';

interface DashboardViewProps {
  stats: CouncilStats;
  waitingList: WaitingListEntry[];
  stands: Stand[];
  payments: Payment[];
  userRole?: UserRole;
  onNavigate: (tab: string) => void;
  onOpenAllocateModal: () => void;
  onOpenRegisterModal: () => void;
  onOpenPublicKiosk: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  waitingList,
  stands,
  payments,
  userRole = 'Admin',
  onNavigate,
  onOpenAllocateModal,
  onOpenRegisterModal,
  onOpenPublicKiosk,
}) => {
  const waitingApplicants = waitingList.filter((w) => w.status === 'Waiting');
  const availableStands = stands.filter((s) => s.status === 'Available');
  const recentPayments = payments.slice(0, 5);

  // Density breakdown
  const densityCounts = {
    high: waitingList.filter((w) => w.preferredDensity === 'High Density').length,
    medium: waitingList.filter((w) => w.preferredDensity === 'Medium Density').length,
    low: waitingList.filter((w) => w.preferredDensity === 'Low Density').length,
    commercial: waitingList.filter((w) => w.preferredDensity === 'Commercial').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Council Mission Banner */}
      <div className="bg-gradient-to-r from-[#002855] via-[#003B7A] to-[#001D40] text-white p-6 rounded-xl shadow-md border-l-4 border-amber-500 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-500 text-blue-950 font-bold px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">
                {userRole === 'Admin' ? 'Executive Housing Directorate' : 'Front Desk Counter Desk'}
              </span>
              <span className="text-amber-200 text-xs">
                Council Mandate: Cap 29:13
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {userRole === 'Admin'
                ? 'Nemamwa Growth Point Land Allocation Directorate'
                : 'Citizen Intake & Front Desk Lodger Service'}
            </h2>
            <p className="text-sm text-blue-200 mt-1 max-w-2xl">
              {userRole === 'Admin'
                ? 'Supervise cadastral stand inventory, verify Decision Table compliance, and authorize official offer letters under Section 74 of Chapter 29:13.'
                : 'Enroll new lodger applicants, enforce unique national ID verification, collect statutory registration fees, and issue instant digital lodger cards.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {userRole === 'Admin' ? (
              <>
                <button
                  onClick={() => onNavigate('stands')}
                  className="bg-blue-950/80 hover:bg-blue-900 border border-amber-400 text-amber-300 font-bold px-4 py-2 rounded-lg text-sm transition-all shadow flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Cadastre Stands</span>
                </button>
                <button
                  onClick={onOpenAllocateModal}
                  disabled={availableStands.length === 0 || waitingApplicants.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Execute Stand Allocation</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenRegisterModal}
                  className="bg-amber-500 hover:bg-amber-400 text-blue-950 font-bold px-4 py-2 rounded-lg text-sm transition-all shadow hover:shadow-lg flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Register Applicant</span>
                </button>
                <button
                  onClick={() => onNavigate('payments')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-sm transition-all shadow flex items-center gap-1.5"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Record Cashier Fee</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Citizens */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-blue-400 transition-all">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Registered Citizens</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalCitizens}</p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span>+100% digital lodger cards</span>
            </p>
          </div>
        </div>

        {/* Active Queue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-400 transition-all">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Active In Queue</p>
            <p className="text-2xl font-black text-amber-700">{stats.inWaitingQueue}</p>
            <p className="text-[11px] text-amber-700 font-semibold">Strict FIFO Order</p>
          </div>
        </div>

        {/* Stands Allocated */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-400 transition-all">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-lg">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Stands Allocated</p>
            <p className="text-2xl font-black text-emerald-700">{stats.standsAllocated}</p>
            <p className="text-[11px] text-slate-500">Target: 500 by 2027</p>
          </div>
        </div>

        {/* Stands Available */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-teal-400 transition-all">
          <div className="w-12 h-12 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-lg">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Available Stands</p>
            <p className="text-2xl font-black text-teal-700">{stats.standsAvailable}</p>
            <p className="text-[11px] text-teal-700 font-medium">Surveyed & Beaconed</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-emerald-400 transition-all">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Revenue Collected</p>
            <p className="text-2xl font-black text-slate-900">${stats.totalRevenueUsd.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-semibold">+30% target Dec 2026</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Decision Table & Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top of the Queue (Next in line) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-800 text-sm">
                Next in Line on Waiting List (First-Come-First-Served)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('waiting-list')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>View Full Master Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 flex-1">
            {waitingApplicants.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No citizens currently in the waiting list queue.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {waitingApplicants.slice(0, 4).map((applicant, idx) => (
                  <div key={applicant.waitingId} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded px-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-900 text-amber-300 font-bold flex items-center justify-center text-sm shadow-sm">
                        #{applicant.positionNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 text-sm">{applicant.citizenName}</p>
                          {idx === 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-300">
                              Priority 1 Next
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          ID: {applicant.nationalId} &bull; Registered: {applicant.registrationDate}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded font-medium border border-slate-200">
                        {applicant.preferredDensity}
                      </span>
                      <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                        Queue Score: {applicant.priorityScore}/100
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rule Banner based on role */}
          {userRole === 'Admin' ? (
            <div className="bg-amber-50 p-4 border-t border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">
                  Chapter 4.2.1 Decision Table Compliance Rule:
                </p>
                <p className="text-amber-800 mt-0.5">
                  Stand allocation is strictly governed by algorithm: <span className="font-semibold underline">IF</span> Applicant is at lowest PositionNumber <span className="font-semibold underline">AND</span> Preferred Stand is Available <span className="font-semibold underline">AND</span> Fees are paid up <span className="font-semibold underline">THEN</span> Allocate Stand, update Status to 'Allocated', and record audit event.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 p-4 border-t border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-950">
                  Front Desk Lodger Intake & Cashier Mandate:
                </p>
                <p className="text-emerald-800 mt-0.5">
                  Ensure 100% data validation for all new applicants. Verify original National ID, issue the official digital lodger's card with council crest, and record the statutory $20 registration fee with official receipt.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Council Integrity & Stand Density breakdown */}
        <div className="space-y-6">
          {/* Queue Integrity Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">Transparency & Integrity Index</h3>
            </div>

            <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200 mb-3 text-xs text-emerald-900">
              <div className="flex justify-between items-center font-bold">
                <span>Queue Jumping Detected:</span>
                <span className="text-emerald-700 font-mono">0 (0.00%)</span>
              </div>
              <div className="flex justify-between items-center font-bold mt-1.5">
                <span>Duplicate National IDs:</span>
                <span className="text-emerald-700 font-mono">BLOCKED (0)</span>
              </div>
              <div className="flex justify-between items-center font-bold mt-1.5">
                <span>Audit Trail Records:</span>
                <span className="text-emerald-700 font-mono">Active & Encrypted</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every applicant is timestamped upon submission. National ID numbers (e.g. 63-xxxxxxxXxx) are enforced with unique database indexes to prevent multiple entries.
            </p>

            <button
              onClick={onOpenPublicKiosk}
              className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Test Public Citizen Verification Kiosk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Density Demand */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-3">
              Application Demand by Stand Density
            </h3>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-medium">High Density (300 sqm)</span>
                  <span className="font-bold text-slate-800">{densityCounts.high} applicants</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(densityCounts.high / (waitingList.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-medium">Medium Density (600 sqm)</span>
                  <span className="font-bold text-slate-800">{densityCounts.medium} applicants</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(densityCounts.medium / (waitingList.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-medium">Low Density (1000 sqm)</span>
                  <span className="font-bold text-slate-800">{densityCounts.low} applicants</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${(densityCounts.low / (waitingList.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 font-medium">Commercial / Business</span>
                  <span className="font-bold text-slate-800">{densityCounts.commercial} applicants</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${(densityCounts.commercial / (waitingList.length || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stands Quick Visual Grid Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Nemamwa Growth Point Surveyed Stands Status
            </h3>
            <p className="text-xs text-slate-500">
              Phase 1 Central & Phase 2 Extension layout
            </p>
          </div>
          {userRole === 'Admin' ? (
            <button
              onClick={() => onNavigate('stands')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>Manage All Stands</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono">
              Surveyed Cadastre (Executive Authority Only)
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {stands.map((stand) => (
            <div
              key={stand.standId}
              className={`p-2.5 rounded-lg border text-center transition-all ${
                stand.status === 'Available'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  : stand.status === 'Allocated'
                  ? 'bg-blue-50 border-blue-300 text-blue-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <span className="text-xs font-mono font-bold block">{stand.standNumber}</span>
              <span className="text-[10px] text-slate-500 block truncate">{stand.size}</span>
              <span
                className={`mt-1 inline-block text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  stand.status === 'Available'
                    ? 'bg-emerald-200 text-emerald-800'
                    : stand.status === 'Allocated'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-amber-200 text-amber-800'
                }`}
              >
                {stand.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
