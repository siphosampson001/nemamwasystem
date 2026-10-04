import React, { useState } from 'react';
import { Payment, Citizen, PaymentPurpose, PaymentMethod } from '../types';
import { 
  DollarSign, 
  Receipt, 
  Plus, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle, 
  TrendingUp,
  CreditCard,
  Building,
  Download
} from 'lucide-react';
import { downloadReceiptDirectPdf } from '../utils/pdfGenerator';

interface PaymentsViewProps {
  payments: Payment[];
  citizens: Citizen[];
  onRecordPayment: (payment: {
    citizenId: number;
    amount: number;
    purpose: PaymentPurpose;
    paymentMethod: PaymentMethod;
    cashierName: string;
  }) => Promise<Payment>;
  onViewReceipt: (payment: Payment) => void;
  userRole: string;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  payments,
  citizens,
  onRecordPayment,
  onViewReceipt,
  userRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Payment Form State
  const [selectedCitizenId, setSelectedCitizenId] = useState<number>(
    citizens.length > 0 ? citizens[0].citizenId : 1
  );
  const [amount, setAmount] = useState<number>(20);
  const [purpose, setPurpose] = useState<PaymentPurpose>('Registration Fee');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash USD');
  const [cashierName, setCashierName] = useState('A. Mutoko (Clerk)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const regFees = payments.filter((p) => p.purpose === 'Registration Fee').reduce((sum, p) => sum + p.amount, 0);
  const deposits = payments.filter((p) => p.purpose === 'Stand Deposit').reduce((sum, p) => sum + p.amount, 0);
  const others = totalRevenue - regFees - deposits;

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nationalId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose = purposeFilter === 'ALL' || p.purpose === purposeFilter;

    return matchesSearch && matchesPurpose;
  });

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCitizenId || Number(amount) <= 0) {
      setErrorMsg('Please select a citizen and enter a positive payment amount.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const newPay = await onRecordPayment({
        citizenId: Number(selectedCitizenId),
        amount: Number(amount),
        purpose,
        paymentMethod,
        cashierName,
      });
      setShowAddModal(false);
      onViewReceipt(newPay);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment recording failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
              <span>Revenue Tracking & Cashier Desk</span>
            </span>
            <span className="text-xs text-slate-500">Table 4.3 Schema</span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            Nemamwa Council Revenue & Payment Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Digital receipts issued for waiting list registrations, renewals, and residential stand deposits.
          </p>
        </div>

        {userRole !== 'Public' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Cashier Payment</span>
          </button>
        )}
      </div>

      {/* Revenue Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Total Revenue Collected</p>
          <p className="text-2xl font-black text-slate-900">${totalRevenue.toLocaleString()} USD</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">SMART Target: +30% revenue</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Registration Fees ($20)</p>
          <p className="text-2xl font-black text-blue-900">${regFees.toLocaleString()} USD</p>
          <p className="text-[11px] text-slate-500">{payments.filter((p) => p.purpose === 'Registration Fee').length} applicants</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Stand Deposits (25%)</p>
          <p className="text-2xl font-black text-emerald-700">${deposits.toLocaleString()} USD</p>
          <p className="text-[11px] text-slate-500">Allocated stands</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Surveys & Renewals</p>
          <p className="text-2xl font-black text-purple-700">${others.toLocaleString()} USD</p>
          <p className="text-[11px] text-slate-500">Annual statutory maintenance</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Receipt # (e.g. REC-2026-0001), Applicant, or National ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="text-xs p-1.5 rounded-lg border border-slate-300 bg-white font-medium"
          >
            <option value="ALL">All Payment Purposes</option>
            <option value="Registration Fee">Registration Fee</option>
            <option value="Stand Deposit">Stand Deposit</option>
            <option value="Annual Renewal">Annual Renewal</option>
            <option value="Survey Fee">Survey Fee</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#002855] text-white uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Citizen Applicant</th>
                <th className="py-3 px-4">National ID</th>
                <th className="py-3 px-4">Payment Purpose</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Amount (USD)</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No payment records match this filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.paymentId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {p.receiptNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.paymentDate}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.citizenName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {p.nationalId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                        {p.purpose}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {p.paymentMethod}
                    </td>
                    <td className="py-3 px-4 font-mono font-black text-right text-emerald-800 text-sm">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => downloadReceiptDirectPdf(p)}
                          className="px-2 py-1 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition-colors"
                          title="Instantly download official receipt as PDF document"
                        >
                          <Download className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => onViewReceipt(p)}
                          className="px-2 py-1 text-blue-800 hover:bg-blue-100 border border-slate-200 rounded text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          title="View / Print Full Official Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5 text-blue-700" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Record Council Payment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Issue an official revenue receipt under Section 1.1.4 of the Council Mandate.
            </p>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-300 p-2.5 rounded text-xs text-rose-900 mb-3">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreatePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Citizen Applicant
                </label>
                <select
                  value={selectedCitizenId}
                  onChange={(e) => setSelectedCitizenId(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {citizens.map((c) => (
                    <option key={c.citizenId} value={c.citizenId}>
                      {c.fullName} ({c.nationalId}) - #{c.lodgerCardNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => {
                    const val = e.target.value as PaymentPurpose;
                    setPurpose(val);
                    if (val === 'Registration Fee') setAmount(20);
                    else if (val === 'Annual Renewal') setAmount(10);
                    else if (val === 'Stand Deposit') setAmount(500);
                    else if (val === 'Survey Fee') setAmount(150);
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Registration Fee">Registration Fee ($20.00)</option>
                  <option value="Stand Deposit">Stand Deposit (e.g. $500.00)</option>
                  <option value="Annual Renewal">Annual Waiting List Renewal ($10.00)</option>
                  <option value="Survey Fee">Survey & Beacon Fee ($150.00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Amount Received (USD)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="Cash USD">Cash USD</option>
                  <option value="EcoCash / Zipit">EcoCash / Zipit (Mobile Money)</option>
                  <option value="Bank Transfer (CBZ/ZB)">Bank Transfer (CBZ / ZB Bank)</option>
                  <option value="POS Swipe">POS Swipe Card</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cashier Name / Staff ID
                </label>
                <input
                  type="text"
                  required
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
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
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow"
                >
                  {isSubmitting ? 'Recording...' : 'Issue Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
