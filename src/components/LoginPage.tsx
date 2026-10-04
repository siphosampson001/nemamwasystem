import React, { useState } from 'react';
import { 
  Building2, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  AlertCircle, 
  Users, 
  FileCheck2,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { UserRole } from '../types';
import { CouncilLogo } from './CouncilLogo';

export interface AuthUser {
  username: string;
  fullName: string;
  role: UserRole;
  designation: string;
}

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onOpenPublicKiosk: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenPublicKiosk,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUser = username.trim().toLowerCase();
    if (!cleanUser) {
      setErrorMsg('Please enter your council staff username.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (cleanUser === 'admin' || cleanUser.includes('housing') || cleanUser.includes('officer') || cleanUser === 'tinevimbo') {
        onLogin({
          username: cleanUser,
          fullName: cleanUser === 'tinevimbo' ? 'Tinevimbo Violet Gaidzanwa' : 'Council Housing Officer',
          role: 'Admin',
          designation: 'Department of Housing & Community Services',
        });
      } else if (cleanUser === 'clerk' || cleanUser.includes('clerk') || cleanUser.includes('reception')) {
        onLogin({
          username: cleanUser,
          fullName: 'A. Mutoko',
          role: 'Clerk',
          designation: 'Front Desk & Lodger Registration Clerk',
        });
      } else {
        // Default standard staff login
        onLogin({
          username: cleanUser,
          fullName: cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1) + ' (Staff)',
          role: 'Clerk',
          designation: 'Nemamwa Housing Sub-Office Staff',
        });
      }
      setLoading(false);
    }, 300);
  };

  const handleQuickLogin = (roleType: 'Admin' | 'Clerk') => {
    if (roleType === 'Admin') {
      setUsername('admin');
      setPassword('admin123');
      onLogin({
        username: 'admin',
        fullName: 'Council Housing Officer (Admin)',
        role: 'Admin',
        designation: 'Department of Housing & Community Services',
      });
    } else {
      setUsername('clerk');
      setPassword('clerk123');
      onLogin({
        username: 'clerk',
        fullName: 'A. Mutoko (Registration Clerk)',
        role: 'Clerk',
        designation: 'Front Desk & Lodger Registration Clerk',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001733] via-[#002855] to-[#001026] flex flex-col justify-between p-4 sm:p-6 text-slate-100 font-sans">
      {/* Top Republic Bar */}
      <div className="max-w-6xl mx-auto w-full flex flex-wrap items-center justify-between text-xs py-2 text-slate-300 border-b border-blue-900/60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-amber-300 uppercase tracking-wider">
            Republic of Zimbabwe
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">
            Rural District Councils Act [Chapter 29:13]
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-serif italic text-amber-200">
          "Rooted in Heritage, Driven by Development"
        </div>
      </div>

      {/* Main Centered Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-white text-slate-900 rounded-2xl shadow-2xl border-2 border-amber-400 overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#002855] p-6 text-white text-center relative border-b-4 border-[#D4AF37]">
          <CouncilLogo variant="login" className="mx-auto mb-3 max-w-[220px]" />

          <h2 className="text-lg font-black tracking-tight uppercase leading-snug">
            Masvingo Rural District Council
          </h2>
          <p className="text-xs text-amber-300 font-semibold tracking-wide mt-0.5">
            Nemamwa Growth Point Housing Department
          </p>
          <div className="inline-block mt-2 bg-blue-950/80 px-3 py-1 rounded-full text-[11px] font-medium text-blue-200 border border-blue-700/60">
            Digital Waiting List & Stand Allocation System
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-emerald-300 font-mono">
            <HardDrive className="w-3 h-3 text-emerald-400" />
            <span>Local Storage: Active (Persistent Offline)</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="text-center">
            <h3 className="text-base font-bold text-slate-900">
              Staff Secure Authentication
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your authorized council credentials to access the housing register.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-900" />
                <span>Username / Staff ID</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin or clerk"
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-900" />
                <span>Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-900 focus:border-transparent font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#002855] hover:bg-[#003870] text-amber-300 hover:text-white font-bold py-3 rounded-lg text-xs shadow-md transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Sign In to System</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-200">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-2.5">
              One-Click Demonstration Logins:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('Admin')}
                className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-950 font-bold transition-colors text-left flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
                  <span className="text-[11px]">Housing Officer</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal mt-1">
                  Full Stand Allocation Access
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('Clerk')}
                className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-950 font-bold transition-colors text-left flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px]">Registration Clerk</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal mt-1">
                  Citizen Enrollment & Receipts
                </span>
              </button>
            </div>
          </div>

          {/* Citizen Public Kiosk Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onOpenPublicKiosk}
              className="text-xs text-blue-800 hover:text-blue-950 font-bold underline flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <span>Public Citizen? Check Your Stand Queue Position Without Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card Footer Security Notice */}
        <div className="bg-slate-50 p-3.5 text-center text-[10px] text-slate-500 border-t border-slate-200">
          <p>
            Authorized council personnel only. All access transactions are timestamped and logged for audit compliance under Section 74 of Chapter 29:13.
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-400 py-2">
        <p>Masvingo Rural District Council &bull; Nemamwa Growth Point Sub-Office</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Research & System Development by: <span className="text-amber-300">Tinevimbo Violet Gaidzanwa</span>
        </p>
      </div>
    </div>
  );
};
