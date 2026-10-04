import React, { useState } from 'react';
import { 
  Search, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle,
  Building2,
  Receipt,
  FileCheck,
  FileText
} from 'lucide-react';
import { Citizen, WaitingListEntry, Payment, Stand } from '../types';
import { CouncilLogo } from './CouncilLogo';

interface PublicKioskViewProps {
  onClose: () => void;
  onOpenLodgerCard: (citizen: Citizen) => void;
  onOpenAllocationLetter?: (stand: Stand, citizen: Citizen, queue?: WaitingListEntry) => void;
}

export const PublicKioskView: React.FC<PublicKioskViewProps> = ({
  onClose,
  onOpenLodgerCard,
  onOpenAllocationLetter,
}) => {
  const [nationalIdInput, setNationalIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{
    citizen: Citizen;
    queue?: WaitingListEntry;
    payments: Payment[];
    allocatedStand?: Stand;
    aheadInQueue: number;
    isFirstInLine: boolean;
  } | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationalIdInput.trim()) return;

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/public-lookup/${encodeURIComponent(nationalIdInput.trim().toUpperCase())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No matching record found in council registry.');
      }
      setResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTestId = (id: string) => {
    setNationalIdInput(id);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden relative">
        {/* Kiosk Header */}
        <div className="bg-gradient-to-r from-[#002244] to-[#003870] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-colors"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <CouncilLogo variant="card" className="h-12 w-auto shrink-0" />
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                Nemamwa RDC Public Verification Kiosk
              </span>
              <h2 className="text-xl font-black text-white">
                Citizen Waiting List & Stand Status Checker
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Check your exact position in the residential stand queue with 100% transparency.
              </p>
            </div>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleLookup} className="space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Enter Your National Identity Document (ID) Number:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 63-1234567M99"
                  value={nationalIdInput}
                  onChange={(e) => setNationalIdInput(e.target.value.toUpperCase())}
                  className="w-full text-sm font-mono pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                {loading ? 'Searching...' : 'Check Status'}
              </button>
            </div>

            {/* Quick Test Samples */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span>Try test records:</span>
              <button
                type="button"
                onClick={() => handleTestId('63-1234567M99')}
                className="text-blue-700 underline font-mono text-[11px]"
              >
                63-1234567M99 (Allocated)
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => handleTestId('63-2345678K44')}
                className="text-blue-700 underline font-mono text-[11px]"
              >
                63-2345678K44 (Next in Queue)
              </button>
            </div>
          </form>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-900 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold">Record Not Found</p>
              <p className="text-[11px]">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {result && (
          <div className="p-6 space-y-6">
            {/* Status Hero */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              result.queue?.status === 'Allocated'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  result.queue?.status === 'Allocated'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 text-blue-950 shadow'
                }`}>
                  {result.queue?.status === 'Allocated' ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    `#${result.queue?.positionNumber || '?'}`
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block">
                    Applicant Current Standing
                  </span>
                  <h3 className="text-base font-black">
                    {result.queue?.status === 'Allocated'
                      ? 'Stand Successfully Allocated!'
                      : `You are #${result.queue?.positionNumber} in the Live Queue`}
                  </h3>
                  <p className="text-xs opacity-80 mt-0.5">
                    {result.queue?.status === 'Allocated'
                      ? `Allocated Stand: ${result.allocatedStand?.standNumber || result.queue.allocatedStandNumber}`
                      : `${result.aheadInQueue} applicant(s) ahead of you for ${result.citizen.preferredDensity}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onOpenLodgerCard(result.citizen)}
                  className="bg-white hover:bg-slate-50 text-blue-950 border border-slate-300 font-bold px-3 py-2 rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-blue-800" />
                  <span>Download Lodger Card</span>
                </button>

                {result.allocatedStand && onOpenAllocationLetter && (
                  <button
                    onClick={() => onOpenAllocationLetter(result.allocatedStand!, result.citizen, result.queue)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 rounded-lg text-xs shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-emerald-200" />
                    <span>Download Offer Letter</span>
                  </button>
                )}
              </div>
            </div>

            {/* Applicant Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                <span className="font-bold text-slate-900">{result.citizen.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">National ID</span>
                <span className="font-mono font-bold text-slate-800">{result.citizen.nationalId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Lodger Card No</span>
                <span className="font-mono text-blue-900 font-bold">{result.citizen.lodgerCardNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration Date</span>
                <span className="font-mono text-slate-700">{result.citizen.dateRegistered}</span>
              </div>
            </div>

            {/* Stand Allocation Specifics if Allocated */}
            {result.allocatedStand && (
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span>Residential Stand Particulars</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-800">
                  <div><strong>Stand:</strong> {result.allocatedStand.standNumber}</div>
                  <div><strong>Area:</strong> {result.allocatedStand.size}</div>
                  <div><strong>Location:</strong> {result.allocatedStand.phase}</div>
                  <div><strong>Cadastral Beacon:</strong> {result.allocatedStand.beaconRef}</div>
                  <div><strong>Price:</strong> ${result.allocatedStand.priceUsd.toLocaleString()} USD</div>
                  <div><strong>Allocation Date:</strong> {result.allocatedStand.allocationDate}</div>
                </div>
              </div>
            )}

            {/* Payments History */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-blue-800" />
                <span>Receipted Council Payments:</span>
              </h4>
              <div className="space-y-1.5">
                {result.payments.map((p) => (
                  <div
                    key={p.paymentId}
                    className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-900">{p.receiptNumber}</span>
                      <span className="text-slate-500 ml-2">&bull; {p.purpose}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700">${p.amount.toFixed(2)} USD</span>
                      <span className="text-slate-400 text-[11px] block">{p.paymentDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Kiosk Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographically Verified Database Index</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold rounded-lg transition-colors"
          >
            Close Kiosk
          </button>
        </div>
      </div>
    </div>
  );
};
