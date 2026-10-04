import React, { useRef, useState } from 'react';
import { Stand, Citizen, WaitingListEntry } from '../types';
import { Building2, Printer, X, ShieldCheck, CheckCircle2, Download, RefreshCw } from 'lucide-react';
import { CouncilLogo } from './CouncilLogo';
import { downloadElementAsPdf, downloadAllocationLetterDirectPdf } from '../utils/pdfGenerator';

interface AllocationLetterModalProps {
  stand: Stand | null;
  citizen: Citizen | null;
  queueEntry?: WaitingListEntry | null;
  letterRef?: string;
  onClose: () => void;
}

export const AllocationLetterModal: React.FC<AllocationLetterModalProps> = ({
  stand,
  citizen,
  queueEntry,
  letterRef,
  onClose,
}) => {
  const letterRefElement = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!stand || !citizen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      if (letterRefElement.current) {
        try {
          const fileName = `Allocation_Letter_${stand.standNumber}_${citizen.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
          await downloadElementAsPdf(letterRefElement.current, fileName, 'a4');
          return;
        } catch (captureErr) {
          console.warn('Canvas capture fallback to direct letter PDF:', captureErr);
        }
      }
      downloadAllocationLetterDirectPdf(stand, citizen, queueEntry, letterRef);
    } catch (err) {
      console.error('Failed to download allocation letter PDF, using direct vector generator:', err);
      downloadAllocationLetterDirectPdf(stand, citizen, queueEntry, letterRef);
    } finally {
      setIsDownloading(false);
    }
  };

  const refNumber = letterRef || `NMM-RDC/HOUS/2026/${stand.standNumber}/${String(queueEntry?.positionNumber || '001').padStart(3, '0')}`;
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden relative">
        {/* Top Action Bar */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Council Residential Stand Allocation Letter (Chapter 4.5.3)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow"
              title="Download official letter as PDF document"
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isDownloading ? 'Generating...' : 'Download Letter (PDF)'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-blue-950 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow"
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

        {/* Official Council Letterhead Container (Printable) */}
        <div
          ref={letterRefElement}
          className="p-8 sm:p-12 bg-white text-slate-900 font-serif leading-relaxed text-sm"
        >
          {/* Header & Crest */}
          <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
            <div className="flex justify-center mb-2">
              <CouncilLogo variant="letterhead" className="mx-auto max-w-[200px]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900 font-sans">
              Masvingo Rural District Council
            </h1>
            <p className="text-xs font-sans text-slate-700 uppercase tracking-widest font-semibold mt-0.5">
              Nemamwa Growth Point Sub-Office &bull; Department of Housing
            </p>
            <p className="text-[11px] font-sans text-slate-500 mt-1">
              Established under the Rural District Councils Act [Chapter 29:13] &bull; P.O. Box 517, Masvingo
            </p>
            <p className="text-[11px] font-sans text-slate-500">
              Telephone: +263 39 226 2341 &bull; Email: housing@masvingordc.org.zw
            </p>
          </div>

          {/* Reference & Date */}
          <div className="flex justify-between items-start text-xs font-sans mb-6">
            <div>
              <p><span className="font-bold">Our Ref:</span> {refNumber}</p>
              <p><span className="font-bold">Lodger Card No:</span> {citizen.lodgerCardNumber}</p>
              <p><span className="font-bold">Waiting Queue Pos:</span> #{queueEntry?.positionNumber || '1'}</p>
            </div>
            <div className="text-right">
              <p><span className="font-bold">Date:</span> {today}</p>
              <p><span className="font-bold">Allocation Type:</span> FCFS Waiting List</p>
            </div>
          </div>

          {/* Recipient Address */}
          <div className="mb-6 font-sans text-xs">
            <p className="font-bold text-sm text-slate-900">{citizen.fullName}</p>
            <p>National ID: {citizen.nationalId}</p>
            <p>{citizen.address}</p>
            <p>Contact: {citizen.phone}</p>
          </div>

          {/* Letter Subject */}
          <div className="mb-6 border-b border-t border-slate-300 py-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-950 font-sans">
              RE: PROVISIONAL ALLOCATION OF RESIDENTIAL STAND NUMBER {stand.standNumber} - NEMAMWA GROWTH POINT ({stand.density.toUpperCase()})
            </h2>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-normal">
            <p>
              Following your registration on the Nemamwa Rural District Council Housing Waiting List and in accordance with the first-come-first-served allocation policy under Council Minute HOU/2026/04, we are pleased to advise that you have been provisionally allocated residential stand particulars detailed hereunder:
            </p>

            {/* Stand Particulars Table */}
            <div className="bg-slate-50 border border-slate-300 p-4 rounded text-xs font-sans space-y-2 my-2">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-bold">Stand Number:</span> {stand.standNumber}</div>
                <div><span className="font-bold">Cadastral Size:</span> {stand.size}</div>
                <div><span className="font-bold">Density Classification:</span> {stand.density}</div>
                <div><span className="font-bold">Phase Location:</span> {stand.phase}</div>
                <div><span className="font-bold">Survey Beacon Reference:</span> {stand.beaconRef}</div>
                <div><span className="font-bold">Purchase Price:</span> ${stand.priceUsd.toLocaleString()} USD</div>
              </div>
            </div>

            <p className="font-bold text-xs uppercase font-sans text-slate-900">
              Terms and Statutory Conditions of Allocation:
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-xs">
              <li>
                <strong>Acceptance and Deposit:</strong> You are required to confirm acceptance of this allocation and settle the minimum initial deposit of at least 25% of the purchase price within thirty (30) days from the date of this letter.
              </li>
              <li>
                <strong>Development Clause:</strong> You shall commence construction of an approved building plan within twelve (12) months from the date of handover and complete construction to minimum Council habitable standard within twenty-four (24) months.
              </li>
              <li>
                <strong>Building Plan Approval:</strong> No construction shall take place on the stand without prior formal inspection of cadastral beacons by Council Planning Cadastre and building plan approval by the Engineering Department.
              </li>
              <li>
                <strong>Prohibition of Cession / Sub-letting:</strong> Cession or transfer of this stand without prior written consent from the Chief Executive Officer of Masvingo Rural District Council is strictly prohibited under Council Bylaws.
              </li>
            </ol>

            <p>
              Congratulations on securing your residential stand at Nemamwa Growth Point. We look forward to your partnership in developing our community.
            </p>
          </div>

          {/* Signatures & Council Seal */}
          <div className="mt-10 pt-4 flex justify-between items-end text-xs font-sans">
            <div>
              <div className="border-b border-slate-700 w-48 mb-1"></div>
              <p className="font-bold">Council Housing Officer</p>
              <p className="text-slate-600">Nemamwa Growth Point</p>
            </div>

            {/* Official Stamp */}
            <div className="border-2 border-red-700/80 rounded-full w-28 h-28 flex flex-col items-center justify-center p-2 text-center text-red-800 rotate-[-5deg] bg-red-50/20">
              <span className="text-[9px] font-black uppercase leading-tight">MASVINGO RDC</span>
              <span className="text-[8px] font-bold text-slate-800 my-0.5">OFFICIAL SEAL</span>
              <span className="text-[7px] font-black uppercase text-red-700">HOUSING DEPT</span>
              <span className="text-[7px] text-slate-600">APPROVED</span>
            </div>

            <div className="text-right">
              <div className="border-b border-slate-700 w-48 mb-1 ml-auto"></div>
              <p className="font-bold">Chief Executive Officer</p>
              <p className="text-slate-600">Masvingo Rural District Council</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-between items-center text-xs text-slate-500 no-print">
          <span>Official legal document issued under Section 74 of Chapter 29:13.</span>
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
              <span>{isDownloading ? 'Generating PDF...' : 'Download Acceptance Letter (PDF)'}</span>
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
