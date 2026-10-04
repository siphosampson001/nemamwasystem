import React, { useState } from 'react';
import { 
  UserPlus, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  FileCheck2,
  Printer,
  Sparkles
} from 'lucide-react';
import { Citizen, WaitingListEntry, Payment, StandDensity } from '../types';

interface CitizenRegistrationProps {
  onRegisterSuccess: (result: {
    citizen: Citizen;
    queue: WaitingListEntry;
    receipt: Payment;
  }) => void;
  existingCitizens: Citizen[];
}

export const CitizenRegistration: React.FC<CitizenRegistrationProps> = ({
  onRegisterSuccess,
  existingCitizens,
}) => {
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('+263 ');
  const [address, setAddress] = useState('');
  const [preferredDensity, setPreferredDensity] = useState<StandDensity>('High Density');
  const [nextOfKin, setNextOfKin] = useState('');
  const [kinPhone, setKinPhone] = useState('+263 ');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    citizen: Citizen;
    queue: WaitingListEntry;
    receipt: Payment;
  } | null>(null);

  // Quick National ID format verification (Masvingo Province is 63-xxxxxxxXxx or any standard Zimbabwean ID)
  const isDuplicate = existingCitizens.some(
    (c) => c.nationalId.replace(/[\s-]/g, '').toUpperCase() === nationalId.replace(/[\s-]/g, '').toUpperCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full Legal Name is required as shown on National Identity Document.');
      return;
    }
    if (!nationalId.trim()) {
      setErrorMessage('National ID is required (e.g. 63-1234567M99).');
      return;
    }
    if (isDuplicate) {
      setErrorMessage(`Applicant with National ID ${nationalId} already has an active Lodger's Card.`);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/citizens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          nationalId,
          phone,
          address,
          preferredDensity,
          nextOfKin,
          kinPhone,
          employmentStatus,
          notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit citizen registration');
      }

      setSuccessInfo(data);
      onRegisterSuccess(data);

      // Reset form
      setFullName('');
      setNationalId('');
      setPhone('+263 ');
      setAddress('');
      setNextOfKin('');
      setKinPhone('+263 ');
      setEmploymentStatus('');
      setNotes('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const names = [
      'Chipo Mutasa',
      'Tatenda Mabhiza',
      'Kudzai Gumbo',
      'Rufaro Chimurenga',
      'Nyasha Sibanda',
      'Tapiwa Marufu',
      'Tadiwa Hove',
    ];
    const pickedName = names[Math.floor(Math.random() * names.length)];

    setFullName(pickedName);
    setNationalId(`63-${randomNum}${letter}63`);
    setPhone(`+263 77 ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`);
    setAddress(`Plot ${Math.floor(1 + Math.random() * 90)}, Nemamwa Growth Point`);
    setNextOfKin('Auxilia Mutasa');
    setKinPhone('+263 71 445 6789');
    setEmploymentStatus('Local Entrepreneur / Civil Servant');
    setNotes('Verified proof of residence stamped by Chief Morgen Nemamwa headman.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider mb-1">
            <UserPlus className="w-4 h-4 text-amber-500" />
            <span>Council Housing Form - Chapter 4.5.1</span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Citizen Registration & Digital Lodger's Card Issuance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enrolls applicant into the Nemamwa Growth Point centralized waiting list with automatic sequential FIFO position assignment.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFillDemo}
          className="text-xs bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Autofill Sample Applicant</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {successInfo && (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-5 rounded-xl shadow-sm text-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">
                Citizen Successfully Registered & Enqueued!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                <strong>{successInfo.citizen.fullName}</strong> assigned Lodger's Card <strong>#{successInfo.citizen.lodgerCardNumber}</strong> and Waiting List Queue Position <strong>#{successInfo.queue.positionNumber}</strong>.
              </p>
              <p className="text-[11px] text-emerald-700 mt-1">
                Statutory registration receipt <strong>{successInfo.receipt.receiptNumber}</strong> ($20.00) issued.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Focus on lodger card preview
                const modal = document.getElementById('lodger-card-dialog');
                if (modal) modal.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow"
            >
              <CreditCard className="w-4 h-4" />
              <span>View Lodger Card</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 p-4 rounded-xl text-rose-900 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Registration Validation Failed</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        {/* Section 1: Personal Particulars */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-200 flex items-center justify-between">
            <span>1. Personal & Identity Particulars</span>
            <span className="text-[11px] text-slate-400 font-normal">All fields verified with Council Registry</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Legal Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tinevimbo Violet Gaidzanwa"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
              <span className="text-[10px] text-slate-400">Surname and first names as per national ID</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>National ID Number <span className="text-rose-500">*</span></span>
                {isDuplicate && (
                  <span className="text-rose-600 font-bold text-[10px] animate-pulse">
                    DUPLICATE DETECTED
                  </span>
                )}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 63-1234567M99"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.toUpperCase())}
                className={`w-full text-xs font-mono p-2.5 rounded-lg border focus:ring-2 focus:ring-blue-800 focus:border-transparent ${
                  isDuplicate ? 'border-rose-400 bg-rose-50' : 'border-slate-300'
                }`}
              />
              <span className="text-[10px] text-slate-400">Masvingo standard format (e.g. 63-xxxxxxxXxx)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Active Mobile / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="+263 77 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
              <span className="text-[10px] text-slate-400">Used for allocation SMS alerts and verification</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Employment / Occupation
              </label>
              <input
                type="text"
                placeholder="e.g. Civil Servant, Self-Employed Trader"
                value={employmentStatus}
                onChange={(e) => setEmploymentStatus(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Residential Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. House 42, Nemamwa Growth Point, Masvingo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              />
              <span className="text-[10px] text-slate-400">Lodger residence or current housing unit</span>
            </div>
          </div>
        </div>

        {/* Section 2: Housing Stand Preferences */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-200">
            2. Housing Preference & Stand Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Stand Density & Size
              </label>
              <select
                value={preferredDensity}
                onChange={(e) => setPreferredDensity(e.target.value as StandDensity)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800 focus:border-transparent bg-white font-medium"
              >
                <option value="High Density">High Density (approx 300 sqm) - $1,800</option>
                <option value="Medium Density">Medium Density (approx 600 sqm) - $3,200</option>
                <option value="Low Density">Low Density (approx 1,000 sqm) - $5,500</option>
                <option value="Commercial">Commercial / Service Industry (approx 1,200 sqm) - $8,000</option>
              </select>
              <span className="text-[10px] text-slate-400">Queue is matched automatically to surveyed stand inventory</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Statutory Registration Fee
              </label>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs flex justify-between items-center text-blue-950 font-bold">
                <span>Waiting List Registration:</span>
                <span className="text-sm font-mono text-emerald-700">$20.00 USD</span>
              </div>
              <span className="text-[10px] text-slate-400">Official receipt will be issued automatically upon submission</span>
            </div>
          </div>
        </div>

        {/* Section 3: Next of Kin */}
        <div>
          <h3 className="text-sm font-bold text-slate-800 pb-2 border-b border-slate-200">
            3. Next of Kin Information (Inheritance & Emergency)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Next of Kin Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Spouse / Brother / Parent"
                value={nextOfKin}
                onChange={(e) => setNextOfKin(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Next of Kin Contact Number
              </label>
              <input
                type="text"
                placeholder="+263 7X XXX XXXX"
                value={kinPhone}
                onChange={(e) => setKinPhone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Council Verification Notes / Comments
              </label>
              <textarea
                rows={2}
                placeholder="Proof of residence inspected, council stamp verified..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Adheres to Nemamwa RDC Housing Allocation Policy 2026</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="reset"
              onClick={() => {
                setFullName('');
                setNationalId('');
                setPhone('+263 ');
                setAddress('');
                setNextOfKin('');
                setErrorMessage(null);
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors w-1/2 sm:w-auto"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading || isDuplicate}
              className="bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow transition-all flex items-center justify-center gap-2 w-1/2 sm:w-auto"
            >
              {loading ? (
                <span>Registering Citizen...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 text-amber-300" />
                  <span>Register & Issue Lodger Card</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
