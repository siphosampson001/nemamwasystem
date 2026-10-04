import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  CheckCircle2,
  Wifi,
  WifiOff,
  Download,
  Upload,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  X,
  FileJson,
  Database
} from 'lucide-react';
import {
  getLocalStorageDiagnostics,
  exportLocalStorageBackup,
  importLocalStorageBackup,
  initLocalStorage,
} from '../services/storage';

interface LocalStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const LocalStorageModal: React.FC<LocalStorageModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [diag, setDiag] = useState(getLocalStorageDiagnostics());
  const [offlineSimulated, setOfflineSimulated] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDiag(getLocalStorageDiagnostics());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = exportLocalStorageBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nemamwa_rdc_local_storage_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importLocalStorageBackup(content);
        if (success) {
          setImportStatus('Backup restored into Local Storage successfully!');
          setDiag(getLocalStorageDiagnostics());
          onDataChanged();
        } else {
          setImportStatus('Failed to import: file did not match council schema.');
        }
      } catch (err: any) {
        setImportStatus(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetToSeeds = () => {
    if (window.confirm('Reset browser Local Storage to default official Nemamwa dataset? Any unsaved local edits will be reset.')) {
      initLocalStorage(true);
      setDiag(getLocalStorageDiagnostics());
      onDataChanged();
      setImportStatus('Local Storage reset to initial official council dataset.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002244] to-[#003870] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Local Storage & Offline Engine</h2>
              <p className="text-xs text-blue-200">
                Client-Side Browser Persistence & Resilient Offline Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Status Box */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-emerald-950 text-sm">
                Local Storage Active & Ready
              </p>
              <p className="text-emerald-800 mt-1 leading-relaxed">
                All records (Citizens, FIFO Waiting Queue, Residential Stands, Revenue Receipts, and Audit Logs) are saved directly in your browser's persistent <strong className="font-mono">localStorage</strong>.
                The system functions seamlessly even when disconnected from the network.
              </p>
            </div>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Citizens</span>
              <span className="text-xl font-black text-slate-800">{diag.citizensCount}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">In Queue</span>
              <span className="text-xl font-black text-amber-700">{diag.waitingCount}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Stands</span>
              <span className="text-xl font-black text-blue-700">{diag.standsCount}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Receipts</span>
              <span className="text-xl font-black text-emerald-700">{diag.paymentsCount}</span>
            </div>
          </div>

          {/* Detailed Storage Stats */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Storage Size Used:</span>
              <span className="font-bold text-slate-800">~{diag.approximateKb} KB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Audit Logs Stored:</span>
              <span className="font-bold text-slate-800">{diag.auditLogsCount} events</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Network Status:</span>
              <span className={`font-bold flex items-center gap-1 ${diag.isOnline ? 'text-emerald-700' : 'text-amber-700'}`}>
                {diag.isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                {diag.isOnline ? 'Online (Hybrid Synced)' : 'Offline (Local Storage Only)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Last Synced / Saved:</span>
              <span className="font-bold text-slate-800 text-[11px] truncate max-w-[200px]">
                {diag.lastSync ? new Date(diag.lastSync).toLocaleTimeString() : 'Active'}
              </span>
            </div>
          </div>

          {importStatus && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-medium">
              {importStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                className="w-full bg-[#002855] hover:bg-[#003870] text-white text-xs font-bold py-2.5 px-3 rounded-lg shadow transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Export Local Backup (.json)</span>
              </button>

              <label className="w-full bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-lg border border-slate-300 shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Import Local Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleResetToSeeds}
                className="text-xs text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Seed Dataset</span>
              </button>

              <button
                onClick={() => {
                  setDiag(getLocalStorageDiagnostics());
                  onDataChanged();
                }}
                className="text-xs text-blue-700 hover:text-blue-900 flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Diagnostics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Storage Panel
          </button>
        </div>
      </div>
    </div>
  );
};
