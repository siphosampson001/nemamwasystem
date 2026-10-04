import React, { useState } from 'react';
import { 
  WaitingListEntry, 
  Stand, 
  Payment, 
  Citizen, 
  CouncilStats 
} from '../types';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Database, 
  Calendar, 
  FileText, 
  DollarSign, 
  CheckCircle,
  Building2
} from 'lucide-react';
import { CouncilLogo } from './CouncilLogo';

interface ReportsViewProps {
  stats: CouncilStats;
  waitingList: WaitingListEntry[];
  stands: Stand[];
  payments: Payment[];
  citizens: Citizen[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  stats,
  waitingList,
  stands,
  payments,
  citizens,
}) => {
  const [activeReport, setActiveReport] = useState<'waiting' | 'stands' | 'revenue' | 'citizens'>('waiting');

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeReport === 'waiting') {
      csvContent += 'QueuePosition,FullName,NationalID,Phone,PreferredDensity,Status,RegistrationDate,AllocatedStand\r\n';
      waitingList.forEach((w) => {
        csvContent += `"${w.positionNumber}","${w.citizenName}","${w.nationalId}","${w.phone}","${w.preferredDensity}","${w.status}","${w.registrationDate}","${w.allocatedStandNumber || ''}"\r\n`;
      });
    } else if (activeReport === 'stands') {
      csvContent += 'StandNumber,Size,Density,Phase,Status,PriceUSD,AllocatedBeneficiary,AllocationDate\r\n';
      stands.forEach((s) => {
        csvContent += `"${s.standNumber}","${s.size}","${s.density}","${s.phase}","${s.status}","${s.priceUsd}","${s.allocatedToName || ''}","${s.allocationDate || ''}"\r\n`;
      });
    } else if (activeReport === 'revenue') {
      csvContent += 'ReceiptNumber,Date,CitizenName,NationalID,Purpose,PaymentMethod,AmountUSD\r\n';
      payments.forEach((p) => {
        csvContent += `"${p.receiptNumber}","${p.paymentDate}","${p.citizenName}","${p.nationalId}","${p.purpose}","${p.paymentMethod}","${p.amount}"\r\n`;
      });
    } else {
      csvContent += 'CitizenID,LodgerCardNumber,FullName,NationalID,Phone,Address,DateRegistered,Category\r\n';
      citizens.forEach((c) => {
        csvContent += `"${c.citizenId}","${c.lodgerCardNumber}","${c.fullName}","${c.nationalId}","${c.phone}","${c.address}","${c.dateRegistered}","${c.preferredDensity}"\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nemamwa_rdc_${activeReport}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSQL = () => {
    window.open('/api/export/sql', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-900 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
              <span>Executive Reporting & Archive - Section 4.5.3</span>
            </span>
            <span className="text-xs text-slate-500">Nemamwa Growth Point</span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Council Housing Reports & Statistical Digests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time auditable registers for Council Committee meetings, Ministry oversight, and archival records.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleDownloadSQL}
            className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-lg shadow transition-colors"
            title="Download nemamwa_rdc.sql database dump as described in Chapter 5.5"
          >
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span>Download SQL Dump</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Current Report</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 no-print overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveReport('waiting')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeReport === 'waiting'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Waiting List Master Roll
        </button>

        <button
          onClick={() => setActiveReport('stands')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeReport === 'stands'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Stands Allocation Register
        </button>

        <button
          onClick={() => setActiveReport('revenue')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeReport === 'revenue'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Monthly Revenue Ledger
        </button>

        <button
          onClick={() => setActiveReport('citizens')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeReport === 'citizens'
              ? 'bg-blue-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Citizens Lodger Index
        </button>
      </div>

      {/* Formal Printable Document View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* Council Letterhead for Report */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center">
          <div className="flex justify-center mb-2">
            <CouncilLogo variant="letterhead" className="mx-auto max-w-[180px]" />
          </div>
          <h2 className="text-lg font-black uppercase text-slate-950 tracking-wider">
            Masvingo Rural District Council
          </h2>
          <p className="text-xs font-bold uppercase text-slate-700">
            Nemamwa Growth Point Housing Department &bull; Official Council Report
          </p>
          <div className="mt-2 flex justify-between text-xs text-slate-500 font-mono">
            <span>Report: {activeReport.toUpperCase()} DIGEST</span>
            <span>Date: {new Date().toISOString().split('T')[0]}</span>
            <span>Auth: Cap 29:13</span>
          </div>
        </div>

        {/* Report Content */}
        {activeReport === 'waiting' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-200">Position #</th>
                  <th className="p-2 border-r border-slate-200">Applicant Full Name</th>
                  <th className="p-2 border-r border-slate-200">National ID</th>
                  <th className="p-2 border-r border-slate-200">Phone</th>
                  <th className="p-2 border-r border-slate-200">Stand Preference</th>
                  <th className="p-2 border-r border-slate-200">Registration Date</th>
                  <th className="p-2 border-r border-slate-200">Status</th>
                  <th className="p-2">Allocated Stand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {waitingList.map((w) => (
                  <tr key={w.waitingId} className="hover:bg-slate-50">
                    <td className="p-2 font-bold font-mono border-r border-slate-200">#{w.positionNumber}</td>
                    <td className="p-2 font-medium border-r border-slate-200">{w.citizenName}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{w.nationalId}</td>
                    <td className="p-2 border-r border-slate-200">{w.phone}</td>
                    <td className="p-2 border-r border-slate-200">{w.preferredDensity}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{w.registrationDate}</td>
                    <td className="p-2 border-r border-slate-200 font-semibold">{w.status}</td>
                    <td className="p-2 font-mono">{w.allocatedStandNumber || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'stands' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-200">Stand #</th>
                  <th className="p-2 border-r border-slate-200">Cadastral Area</th>
                  <th className="p-2 border-r border-slate-200">Density Classification</th>
                  <th className="p-2 border-r border-slate-200">Location / Phase</th>
                  <th className="p-2 border-r border-slate-200">Status</th>
                  <th className="p-2 border-r border-slate-200">Price (USD)</th>
                  <th className="p-2 border-r border-slate-200">Allocated Beneficiary</th>
                  <th className="p-2">Allocation Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stands.map((s) => (
                  <tr key={s.standId} className="hover:bg-slate-50">
                    <td className="p-2 font-mono font-bold border-r border-slate-200">{s.standNumber}</td>
                    <td className="p-2 border-r border-slate-200">{s.size}</td>
                    <td className="p-2 border-r border-slate-200">{s.density}</td>
                    <td className="p-2 border-r border-slate-200">{s.phase}</td>
                    <td className="p-2 font-bold border-r border-slate-200">{s.status}</td>
                    <td className="p-2 font-mono border-r border-slate-200">${s.priceUsd.toLocaleString()}</td>
                    <td className="p-2 font-medium border-r border-slate-200">{s.allocatedToName || '-'}</td>
                    <td className="p-2 font-mono">{s.allocationDate || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeReport === 'revenue' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-200">Receipt #</th>
                  <th className="p-2 border-r border-slate-200">Date</th>
                  <th className="p-2 border-r border-slate-200">Citizen Name</th>
                  <th className="p-2 border-r border-slate-200">National ID</th>
                  <th className="p-2 border-r border-slate-200">Purpose</th>
                  <th className="p-2 border-r border-slate-200">Payment Mode</th>
                  <th className="p-2 text-right">Amount (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-50">
                    <td className="p-2 font-mono font-bold border-r border-slate-200">{p.receiptNumber}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{p.paymentDate}</td>
                    <td className="p-2 font-medium border-r border-slate-200">{p.citizenName}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{p.nationalId}</td>
                    <td className="p-2 border-r border-slate-200">{p.purpose}</td>
                    <td className="p-2 border-r border-slate-200">{p.paymentMethod}</td>
                    <td className="p-2 font-mono font-bold text-right">${p.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-400">
                <tr>
                  <td colSpan={6} className="p-2 text-right">TOTAL REVENUE (USD):</td>
                  <td className="p-2 text-right font-mono font-black text-emerald-800 text-sm">
                    ${stats.totalRevenueUsd.toFixed(2)} USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {activeReport === 'citizens' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-200">ID #</th>
                  <th className="p-2 border-r border-slate-200">Lodger Card #</th>
                  <th className="p-2 border-r border-slate-200">Full Name</th>
                  <th className="p-2 border-r border-slate-200">National ID</th>
                  <th className="p-2 border-r border-slate-200">Phone</th>
                  <th className="p-2 border-r border-slate-200">Physical Address</th>
                  <th className="p-2 border-r border-slate-200">Date Registered</th>
                  <th className="p-2">Preference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {citizens.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-2 font-mono border-r border-slate-200">#{c.citizenId}</td>
                    <td className="p-2 font-mono font-bold text-blue-900 border-r border-slate-200">{c.lodgerCardNumber}</td>
                    <td className="p-2 font-bold border-r border-slate-200">{c.fullName}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{c.nationalId}</td>
                    <td className="p-2 border-r border-slate-200">{c.phone}</td>
                    <td className="p-2 border-r border-slate-200">{c.address}</td>
                    <td className="p-2 font-mono border-r border-slate-200">{c.dateRegistered}</td>
                    <td className="p-2">{c.preferredDensity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Council Signatures */}
        <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between text-xs text-slate-700">
          <div>
            <p className="font-bold">Prepared by: Council Housing Clerk</p>
            <p className="text-[10px] text-slate-500">Department of Housing & Community Services</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Approved by: Chief Executive Officer</p>
            <p className="text-[10px] text-slate-500">Masvingo Rural District Council</p>
          </div>
        </div>
      </div>
    </div>
  );
};
