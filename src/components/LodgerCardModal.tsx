import React, { useRef, useState } from 'react';
import { Citizen, WaitingListEntry } from '../types';
import { Building2, X, Printer, ShieldCheck, QrCode, Download, RefreshCw, FileText } from 'lucide-react';
import { CouncilLogo } from './CouncilLogo';
import { downloadElementAsPdf, downloadLodgerCardDirectPdf } from '../utils/pdfGenerator';

interface LodgerCardModalProps {
  citizen: Citizen | null;
  queueEntry?: WaitingListEntry | null;
  onClose: () => void;
}

export const LodgerCardModal: React.FC<LodgerCardModalProps> = ({
  citizen,
  queueEntry,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!citizen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      if (cardRef.current) {
        try {
          const fileName = `Lodgers_Card_${citizen.lodgerCardNumber}_${citizen.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
          await downloadElementAsPdf(cardRef.current, fileName, 'card');
          return;
        } catch (captureErr) {
          console.warn('Canvas capture fallback to direct vector PDF:', captureErr);
        }
      }
      // Guaranteed vector PDF fallback
      downloadLodgerCardDirectPdf(citizen, queueEntry);
    } catch (err) {
      console.error('Failed to download card PDF, using direct vector generator:', err);
      downloadLodgerCardDirectPdf(citizen, queueEntry);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in duration-200">
        {/* Top Dialog Action Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Council Digital Lodger's Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow"
              title="Download Card as PDF file"
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Generating...' : 'Download Card (PDF)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Container */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-br from-[#002244] to-[#003870] text-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-400 relative"
          >
            {/* Watermark Crest */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
              <Building2 className="w-64 h-64 text-white" />
            </div>

            {/* Council Header */}
            <div className="p-4 border-b border-blue-800/80 bg-[#001830] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CouncilLogo variant="card" className="h-10 w-auto shrink-0" />
                <div>
                  <h3 className="text-xs font-bold tracking-tight text-white uppercase leading-none">
                    Masvingo Rural District Council
                  </h3>
                  <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                    Nemamwa Growth Point Housing Registry
                  </p>
                  <p className="text-[9px] text-blue-300 italic">
                    Lodger's Housing Waiting List Card
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-amber-500 text-blue-950 text-[10px] font-black px-2 py-0.5 rounded tracking-wider block">
                  OFFICIAL
                </span>
                <span className="text-[9px] text-slate-300 font-mono mt-0.5 block">
                  Cap 29:13
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 space-y-4">
              {/* Card Number & Queue Badge */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-blue-300 block">
                    Lodger Card No.
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-300">
                    {citizen.lodgerCardNumber}
                  </span>
                </div>

                <div className="text-right bg-blue-950/80 px-3 py-1 rounded-lg border border-amber-400/40">
                  <span className="text-[9px] text-slate-300 uppercase block">Queue Position</span>
                  <span className="text-base font-black text-amber-400">
                    #{queueEntry?.positionNumber || '1'}
                  </span>
                </div>
              </div>

              {/* Citizen Personal Info */}
              <div className="space-y-2 bg-[#002D5A] p-3 rounded-xl border border-blue-700/50">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-blue-300 block">
                    Full Name of Applicant
                  </span>
                  <p className="text-sm font-bold text-white tracking-wide">
                    {citizen.fullName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 block">
                      National ID
                    </span>
                    <span className="font-mono text-slate-100 font-semibold">
                      {citizen.nationalId}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 block">
                      Contact
                    </span>
                    <span className="text-slate-100 font-semibold truncate block">
                      {citizen.phone}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-blue-800">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 block">
                      Category
                    </span>
                    <span className="text-amber-300 font-semibold">
                      {citizen.preferredDensity}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 block">
                      Date Issued
                    </span>
                    <span className="text-slate-200 font-mono">
                      {citizen.dateRegistered}
                    </span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="text-[11px] text-slate-300 px-1">
                <span className="text-[9px] uppercase tracking-wider text-blue-300 block">Registered Residence:</span>
                <span className="truncate block font-medium">{citizen.address}</span>
              </div>

              {/* Bottom Stamp & QR Verification Representation */}
              <div className="pt-2 border-t border-blue-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center shadow">
                    <QrCode className="w-8 h-8 text-blue-950" />
                  </div>
                  <div className="text-[9px] text-slate-300 leading-tight">
                    <span className="font-bold text-white block">DIGITAL SECURE KEY</span>
                    <span>Scan to verify at Nemamwa Council Kiosk</span>
                  </div>
                </div>

                {/* Council Stamp Graphic */}
                <div className="border border-red-400/80 rounded-full px-2 py-1 rotate-[-4deg] text-center bg-red-950/20 text-red-300">
                  <span className="text-[8px] font-black uppercase tracking-tighter block leading-none">
                    COUNCIL STAMP
                  </span>
                  <span className="text-[7px] text-red-200 block leading-tight">
                    NEMAMWA RDC APPROVED
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Golden Security Line */}
            <div className="h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500"></div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-between items-center text-xs text-slate-500 no-print">
          <span>This replaces the manual paper lodger's card with tamper-proof digital verification.</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-colors"
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Generating PDF...' : 'Download Card (PDF)'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
