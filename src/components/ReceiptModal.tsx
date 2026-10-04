import React, { useRef, useState } from 'react';
import { Payment } from '../types';
import { Building2, Printer, X, ShieldCheck, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { CouncilLogo } from './CouncilLogo';
import { downloadElementAsPdf, downloadReceiptDirectPdf } from '../utils/pdfGenerator';

interface ReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  onClose,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      if (receiptRef.current) {
        try {
          const fileName = `Official_Receipt_${payment.receiptNumber}_${payment.citizenName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
          await downloadElementAsPdf(receiptRef.current, fileName, 'card');
          return;
        } catch (captureErr) {
          console.warn('Canvas capture fallback to direct receipt PDF:', captureErr);
        }
      }
      downloadReceiptDirectPdf(payment);
    } catch (err) {
      console.error('Failed to download receipt PDF, using direct vector generator:', err);
      downloadReceiptDirectPdf(payment);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden relative">
        {/* Top Control Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Council Revenue Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow"
              title="Download receipt as PDF file"
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Generating...' : 'Download Receipt (PDF)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div ref={receiptRef} className="p-6 bg-amber-50/30 text-slate-900 font-mono text-xs border-b border-dashed border-slate-300">
          {/* Header */}
          <div className="text-center pb-3 border-b-2 border-slate-800">
            <CouncilLogo variant="small" className="mx-auto mb-1 max-w-[120px]" />
            <h3 className="font-bold text-sm tracking-wider text-slate-950 uppercase">
              Masvingo Rural District Council
            </h3>
            <p className="text-[10px] text-slate-600 uppercase font-sans">
              Nemamwa Revenue Collection Office
            </p>
            <p className="text-[9px] text-slate-500 font-sans">
              Rural District Councils Act [Cap 29:13]
            </p>
          </div>

          {/* Receipt Details */}
          <div className="py-3 space-y-1.5 border-b border-slate-300">
            <div className="flex justify-between font-bold">
              <span>OFFICIAL RECEIPT:</span>
              <span className="text-blue-900">{payment.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span>{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Cashier:</span>
              <span>{payment.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span>{payment.paymentMethod}</span>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="py-3 space-y-1 border-b border-slate-300">
            <p className="text-[10px] text-slate-500 uppercase">Received From:</p>
            <p className="font-bold text-slate-900 text-xs">{payment.citizenName}</p>
            <p className="text-slate-600 font-mono">National ID: {payment.nationalId}</p>
            <p className="text-slate-600">Council Citizen ID: #{payment.citizenId}</p>
          </div>

          {/* Payment Items */}
          <div className="py-3 border-b-2 border-slate-800 space-y-2">
            <div className="flex justify-between font-bold">
              <span>Purpose / Description</span>
              <span>Amount (USD)</span>
            </div>
            <div className="flex justify-between text-slate-800">
              <span>{payment.purpose}</span>
              <span className="font-bold">${payment.amount.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-950">
              <span>TOTAL PAID:</span>
              <span>${payment.amount.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Council Stamp Representation */}
          <div className="pt-4 flex items-center justify-between">
            <div className="border border-emerald-600 rounded p-1 text-[8px] text-emerald-800 font-sans font-bold">
              <span>PAID & VERIFIED</span>
            </div>
            <div className="text-right text-[9px] text-slate-500 font-sans">
              <p>Valid without council alteration</p>
              <p className="italic">Thank you for your civic contribution</p>
            </div>
          </div>
        </div>

        {/* Modal Close Footer */}
        <div className="p-3 bg-slate-50 flex items-center justify-between no-print">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            {isDownloading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? 'Generating PDF...' : 'Download Receipt (PDF)'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
