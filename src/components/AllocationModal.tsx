import React, { useState } from 'react';
import { Stand, WaitingListEntry, Citizen } from '../types';
import { 
  Building2, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  FileCheck2, 
  Award, 
  UserCheck, 
  Clock,
  ShieldAlert
} from 'lucide-react';

interface AllocationModalProps {
  stand?: Stand | null;
  waitingEntry?: WaitingListEntry | null;
  availableStands: Stand[];
  activeWaitingList: WaitingListEntry[];
  citizens: Citizen[];
  onConfirmAllocation: (standId: number, citizenId: number, officerName: string) => Promise<void>;
  onClose: () => void;
}

export const AllocationModal: React.FC<AllocationModalProps> = ({
  stand,
  waitingEntry,
  availableStands,
  activeWaitingList,
  citizens,
  onConfirmAllocation,
  onClose,
}) => {
  const [selectedStandId, setSelectedStandId] = useState<number>(
    stand?.standId || (availableStands.length > 0 ? availableStands[0].standId : 0)
  );

  // Filter queue for waiting applicants
  const waitingApplicants = activeWaitingList
    .filter((w) => w.status === 'Waiting')
    .sort((a, b) => a.positionNumber - b.positionNumber);

  const [selectedCitizenId, setSelectedCitizenId] = useState<number>(
    waitingEntry?.citizenId || (waitingApplicants.length > 0 ? waitingApplicants[0].citizenId : 0)
  );

  const [officerName, setOfficerName] = useState('Council Housing Officer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeStand = availableStands.find((s) => s.standId === Number(selectedStandId)) || stand;
  const activeApplicant = waitingApplicants.find((w) => w.citizenId === Number(selectedCitizenId)) || waitingEntry;
  const applicantCitizen = citizens.find((c) => c.citizenId === activeApplicant?.citizenId);

  // Decision Table Logic (Chapter 4.2.1)
  const isTopInLine = waitingApplicants.length > 0 && activeApplicant?.positionNumber === waitingApplicants[0].positionNumber;
  const isStandAvailable = activeStand?.status === 'Available';
  const densityMatches = activeStand && activeApplicant && activeStand.density === activeApplicant.preferredDensity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStand || !activeApplicant) {
      setErrorMsg('Please select a valid stand and an eligible applicant.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await onConfirmAllocation(activeStand.standId, activeApplicant.citizenId, officerName);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Allocation failed');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden relative">
        {/* Top Council Bar */}
        <div className="p-4 bg-[#002855] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Nemamwa RDC Stand Allocation Decision Engine
              </h3>
              <p className="text-[11px] text-blue-200">
                Chapter 4.2.1 Decision Table & FIFO Queue Compliance
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-300 p-3 rounded-lg text-rose-900 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Stand Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              1. Select Available Surveyed Stand
            </label>
            <select
              value={selectedStandId}
              onChange={(e) => setSelectedStandId(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
            >
              {availableStands.map((s) => (
                <option key={s.standId} value={s.standId}>
                  {s.standNumber} &bull; {s.size} ({s.density}) &bull; {s.phase} &bull; ${s.priceUsd.toLocaleString()} USD
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Candidate from Waiting Queue */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                2. Select Applicant from Waiting List
              </label>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>FIFO Strict Priority</span>
              </span>
            </div>

            <select
              value={selectedCitizenId}
              onChange={(e) => setSelectedCitizenId(Number(e.target.value))}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-medium"
            >
              {waitingApplicants.map((w) => (
                <option key={w.citizenId} value={w.citizenId}>
                  #{w.positionNumber} &bull; {w.citizenName} ({w.nationalId}) &bull; Preferred: {w.preferredDensity}
                </option>
              ))}
            </select>
          </div>

          {/* Decision Table Rule Verification Card (Chapter 4.2.1) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span>Chapter 4.2.1 Decision Table Rules:</span>
              <span className="text-[10px] text-blue-900 bg-blue-100 px-2 py-0.5 rounded font-mono">
                ALGO-FCFS-01
              </span>
            </h4>

            <div className="space-y-2">
              {/* Condition 1 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Condition 1: Applicant is at top of queue?
                </span>
                {isTopInLine ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5" /> YES (#1 FIFO)
                  </span>
                ) : (
                  <span className="text-amber-700 font-bold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" /> Next in Category (Pos #{activeApplicant?.positionNumber})
                  </span>
                )}
              </div>

              {/* Condition 2 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Condition 2: Stand is Available & Cleared?
                </span>
                {isStandAvailable ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5" /> YES ({activeStand?.standNumber})
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" /> NO (Unavailable)
                  </span>
                )}
              </div>

              {/* Condition 3 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-600">
                  Condition 3: Density preference alignment?
                </span>
                {densityMatches ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3.5 h-3.5" /> MATCH ({activeStand?.density})
                  </span>
                ) : (
                  <span className="text-slate-600 font-medium">
                    Different Density ({activeApplicant?.preferredDensity} vs {activeStand?.density})
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 italic">
              Action: Allocate stand, generate official Council Offer Letter, bind beacon reference, and log immutable audit event.
            </div>
          </div>

          {/* Authorizing Officer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Authorizing Officer Name & Title
            </label>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !activeStand || !activeApplicant}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Authorizing Allocation...</span>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Confirm Allocation & Issue Letter</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
