import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Search, 
  UserCheck, 
  FileText, 
  Database,
  Compass,
  AlertCircle,
  LogOut,
  User,
  HardDrive,
  Wifi
} from 'lucide-react';
import { UserRole } from '../types';
import { AuthUser } from './LoginPage';
import { CouncilLogo } from './CouncilLogo';

interface CouncilHeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickSearch: (query: string) => void;
  searchQuery: string;
  onOpenPublicKiosk: () => void;
  onOpenLocalStorageModal?: () => void;
}

export const CouncilHeader: React.FC<CouncilHeaderProps> = ({
  currentRole,
  setCurrentRole,
  currentUser,
  onLogout,
  activeTab,
  setActiveTab,
  onQuickSearch,
  searchQuery,
  onOpenPublicKiosk,
  onOpenLocalStorageModal,
}) => {
  return (
    <header className="bg-[#002855] text-white border-b-4 border-[#D4AF37] shadow-lg sticky top-0 z-40">
      {/* Top Banner / Republic of Zimbabwe & Council Mandate */}
      <div className="bg-[#001B3A] px-4 py-1.5 text-xs flex flex-wrap justify-between items-center text-slate-300 border-b border-blue-900/60">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-amber-300 tracking-wide uppercase">Republic of Zimbabwe</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">Rural District Councils Act [Cap 29:13]</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="italic text-amber-200/90 font-serif hidden md:inline">"Rooted in Heritage, Driven by Development"</span>
          {onOpenLocalStorageModal && (
            <button
              onClick={onOpenLocalStorageModal}
              className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-mono border border-emerald-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Click to manage Local Storage, download backup, or restore records"
            >
              <HardDrive className="w-3 h-3 text-amber-400" />
              <span>Local Storage: Active (Persistent)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          )}
        </div>
      </div>

      {/* Main Council Identification Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Crest & Title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <CouncilLogo variant="header" className="h-12 w-auto shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight">
                Nemamwa Rural District Council
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[11px] font-medium px-2 py-0.5 rounded border border-amber-400/30">
                Masvingo Province
              </span>
            </div>
            <p className="text-xs text-blue-200">
              Department of Housing & Community Services &bull; Growth Point Stand Allocation Register
            </p>
          </div>
        </div>

        {/* Search Bar (< 30 Seconds retrieval requirement SMART 5) */}
        <div className="flex-1 max-w-md w-full relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Instant Search: National ID, Lodger Card, Name..."
              value={searchQuery}
              onChange={(e) => onQuickSearch(e.target.value)}
              className="w-full bg-[#001D40] text-sm text-white placeholder-slate-400 pl-9 pr-4 py-2 rounded-lg border border-blue-700/60 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onQuickSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
          <div className="text-[10px] text-blue-300 mt-1 flex justify-between px-1">
            <span>Fast record retrieval (&lt; 500ms)</span>
            <span className="text-amber-300/80">SMART Goal 3 & 5 Compliant</span>
          </div>
        </div>

        {/* User Session, Role Selector & Kiosk Button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {onOpenLocalStorageModal && (
            <button
              onClick={onOpenLocalStorageModal}
              className="flex items-center gap-1.5 bg-[#001D40] hover:bg-[#002B5E] text-amber-300 text-xs font-semibold px-2.5 py-2 rounded-lg border border-amber-400/40 transition-colors shadow"
              title="Inspect Local Storage, export backup JSON, or restore data"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Local Storage</span>
            </button>
          )}

          <button
            onClick={onOpenPublicKiosk}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow transition-all border border-emerald-400/40"
            title="Public Citizen Verification Portal - Check Queue Position"
          >
            <UserCheck className="w-4 h-4 text-emerald-200" />
            <span className="hidden sm:inline">Citizen Kiosk</span>
          </button>

          {/* User Profile Badge */}
          {currentUser && (
            <div className="flex items-center bg-[#001B3A] px-2.5 py-1.5 rounded-lg border border-blue-800 text-xs">
              <User className="w-3.5 h-3.5 text-amber-400 mr-1.5 shrink-0" />
              <div className="text-left hidden lg:block leading-tight mr-2">
                <span className="font-bold text-white block truncate max-w-[130px]">{currentUser.fullName}</span>
                <span className="text-[10px] text-amber-300 font-mono">{currentUser.role}</span>
              </div>
              <button
                onClick={onLogout}
                className="ml-1 text-slate-300 hover:text-rose-300 p-1 rounded hover:bg-blue-900/60 transition-colors flex items-center gap-1 text-[11px] font-semibold"
                title="Log Out of Housing System"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Bar - Strictly Tailored by Role */}
      <nav className="bg-[#001D42] px-4 sm:px-6 border-t border-blue-900/80 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-1.5 text-xs font-medium">
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Common or Role-Specific Navigation Tabs */}
            {currentRole === 'Admin' ? (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <span>Executive Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('stands')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'stands'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-teal-300" />
                  <span>Stands & Cadastre Allocation</span>
                </button>

                <button
                  onClick={() => setActiveTab('waiting-list')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'waiting-list'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <span>Waiting List Master Roll</span>
                  <span className="bg-blue-800 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full">FIFO</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'reports'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-300" />
                  <span>Council Reports & Exports</span>
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Security & Audit Ledger</span>
                </button>
              </>
            ) : (
              /* Registration Clerk Tabs */
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <span>Clerk Intake Counter</span>
                </button>

                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'register'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Citizen Registration & Lodger Card</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'payments'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-amber-300" />
                  <span>Revenue & Cashier Desk</span>
                </button>

                <button
                  onClick={() => setActiveTab('waiting-list')}
                  className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'waiting-list'
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'text-slate-200 hover:bg-blue-900/60 hover:text-white'
                  }`}
                >
                  <span>Queue Position Inquiries</span>
                </button>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center text-[11px] text-slate-400 font-mono">
            {currentRole === 'Admin' ? (
              <span className="text-amber-300 font-bold">Executive Authority Level</span>
            ) : (
              <span className="text-emerald-300 font-bold">Front-Desk Intake & Cashier Level</span>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
