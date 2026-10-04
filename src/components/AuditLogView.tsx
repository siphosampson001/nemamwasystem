import React, { useState } from 'react';
import { AuditLog } from '../types';
import { ShieldCheck, Search, Filter, Lock, Clock, User, CheckCircle } from 'lucide-react';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEntity = entityFilter === 'ALL' || l.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>Immutable Transparency Audit Trail</span>
            </span>
            <span className="text-xs text-slate-500">Section 3.2.6 & SMART Goal 4</span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            System Security & Anti-Corruption Audit Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Every citizen registration, payment receipt, and stand allocation decision is permanently recorded with timestamps and officer credentials.
          </p>
        </div>

        <div className="bg-emerald-50 text-emerald-950 px-3 py-2 rounded-lg border border-emerald-300 text-xs font-bold flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-700" />
          <span>Cryptographic Hash Sealed</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, officer name, or audit details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Entity Actions</option>
            <option value="Citizen">Citizen Registrations</option>
            <option value="Stand">Stand Allocations & Changes</option>
            <option value="Payment">Payment Receipts</option>
          </select>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No audit records found matching this filter.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-3">
                <div className="mt-0.5">
                  {log.action.includes('ALLOCATION') ? (
                    <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                    </span>
                  ) : log.action.includes('PAYMENT') ? (
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      $
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4 text-purple-700" />
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {log.action}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.2 rounded font-medium border border-slate-200">
                        {log.entityType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {log.details}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Officer: <strong className="text-slate-800">{log.userName}</strong> ({log.userRole})</span>
                    <span>&bull;</span>
                    <span className="font-mono text-[10px]">ID: {log.id}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
