import React, { useState } from 'react';
import { Stand, StandDensity, StandStatus } from '../types';
import { 
  Building2, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Compass, 
  Filter, 
  Search,
  FileCheck,
  FileText,
  Tag
} from 'lucide-react';

interface StandsViewProps {
  stands: Stand[];
  onAddStand: (stand: {
    standNumber: string;
    size: string;
    density: StandDensity;
    phase: string;
    priceUsd: number;
    beaconRef?: string;
  }) => void;
  onAllocateStand: (stand: Stand) => void;
  onViewAllocationLetter?: (stand: Stand) => void;
  userRole: string;
}

export const StandsView: React.FC<StandsViewProps> = ({
  stands,
  onAddStand,
  onAllocateStand,
  onViewAllocationLetter,
  userRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [densityFilter, setDensityFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Stand Form State
  const [newStandNo, setNewStandNo] = useState('');
  const [newSize, setNewSize] = useState('300 sqm');
  const [newDensity, setNewDensity] = useState<StandDensity>('High Density');
  const [newPhase, setNewPhase] = useState('Phase 1 Central');
  const [newPrice, setNewPrice] = useState(1800);
  const [newBeacon, setNewBeacon] = useState('');

  const filteredStands = stands.filter((stand) => {
    const matchesSearch =
      stand.standNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (stand.allocatedToName && stand.allocatedToName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      stand.beaconRef.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || stand.status === statusFilter;
    const matchesDensity = densityFilter === 'ALL' || stand.density === densityFilter;

    return matchesSearch && matchesStatus && matchesDensity;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandNo.trim()) return;

    onAddStand({
      standNumber: newStandNo.trim().toUpperCase(),
      size: newSize,
      density: newDensity,
      phase: newPhase,
      priceUsd: Number(newPrice),
      beaconRef: newBeacon || `BCN-NMM-${Math.floor(100 + Math.random() * 900)}`,
    });

    setShowAddModal(false);
    setNewStandNo('');
    setNewBeacon('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-100 text-teal-900 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-teal-700" />
              <span>Survey & Cadastral Register</span>
            </span>
            <span className="text-xs text-slate-500">Nemamwa Growth Point</span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Residential & Commercial Stands Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastral surveyed land parcels in Phase 1 Central and Phase 2 East Extension under Council management.
          </p>
        </div>

        {userRole === 'Admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Survey New Stand</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Stand # (e.g. NEM-RES-001), Beacon, or Beneficiary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available (Ready for Allocation)</option>
            <option value="Allocated">Allocated</option>
            <option value="Reserved">Reserved</option>
          </select>

          <select
            value={densityFilter}
            onChange={(e) => setDensityFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Densities</option>
            <option value="High Density">High Density (300 sqm)</option>
            <option value="Medium Density">Medium Density (600 sqm)</option>
            <option value="Low Density">Low Density (1000 sqm)</option>
            <option value="Commercial">Commercial (1200 sqm)</option>
          </select>
        </div>
      </div>

      {/* Stands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStands.map((stand) => (
          <div
            key={stand.standId}
            className={`rounded-xl border p-4 shadow-sm transition-all flex flex-col justify-between ${
              stand.status === 'Available'
                ? 'bg-white border-emerald-300 hover:shadow-md'
                : stand.status === 'Allocated'
                ? 'bg-slate-50 border-blue-200'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-mono font-black text-slate-900 block">
                    {stand.standNumber}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {stand.phase}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    stand.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : stand.status === 'Allocated'
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {stand.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Density:</span>
                  <span className="font-semibold text-slate-800">{stand.density}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cadastral Area:</span>
                  <span className="font-semibold text-slate-800">{stand.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Survey Beacon:</span>
                  <span className="font-mono text-slate-700">{stand.beaconRef}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-slate-500">Council Price:</span>
                  <span className="text-emerald-700 font-mono">${stand.priceUsd.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Allocation Beneficiary Details if allocated */}
              {stand.status === 'Allocated' && (
                <div className="text-xs bg-blue-50/80 p-2 rounded border border-blue-200 text-blue-950 mb-3">
                  <span className="text-[10px] uppercase font-bold text-blue-700 block">Beneficiary:</span>
                  <p className="font-bold truncate">{stand.allocatedToName || 'Tinevimbo Gaidzanwa'}</p>
                  <p className="text-[10px] text-blue-700 mt-0.5">
                    Allocated on: {stand.allocationDate || '2026-09-20'}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div>
              {stand.status === 'Available' ? (
                userRole === 'Admin' ? (
                  <button
                    onClick={() => onAllocateStand(stand)}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Allocate to Queue</span>
                  </button>
                ) : (
                  <div className="text-center py-1.5 text-[11px] text-slate-500 bg-slate-100 rounded border border-slate-200 font-medium">
                    Available &bull; Housing Officer Approval Required
                  </div>
                )
              ) : stand.status === 'Allocated' ? (
                <div className="space-y-1.5">
                  <div className="text-center py-0.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 rounded border border-emerald-200">
                    Allocated & Legally Assigned
                  </div>
                  {onViewAllocationLetter && (
                    <button
                      onClick={() => onViewAllocationLetter(stand)}
                      className="w-full bg-[#002855] hover:bg-[#003870] text-amber-300 text-xs font-bold py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      title="View & Download Official Acceptance / Allocation Letter (PDF)"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download Offer Letter (PDF)</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-1 text-[11px] text-amber-700 font-medium">
                  Reserved for Public Infrastructure
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Stand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Survey & Register New Stand
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add surveyed residential or commercial parcel to Nemamwa RDC inventory.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Stand Number (Unique)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEM-RES-010"
                  value={newStandNo}
                  onChange={(e) => setNewStandNo(e.target.value)}
                  className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Density Category
                  </label>
                  <select
                    value={newDensity}
                    onChange={(e) => setNewDensity(e.target.value as StandDensity)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="High Density">High Density</option>
                    <option value="Medium Density">Medium Density</option>
                    <option value="Low Density">Low Density</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Size / Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="300 sqm"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phase / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Survey Beacon Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. BCN-NMM-205"
                  value={newBeacon}
                  onChange={(e) => setNewBeacon(e.target.value)}
                  className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow"
                >
                  Save Stand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
