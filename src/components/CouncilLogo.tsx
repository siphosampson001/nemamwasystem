import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface CouncilLogoProps {
  className?: string;
  variant?: 'header' | 'login' | 'card' | 'letterhead' | 'small';
}

export const CouncilLogo: React.FC<CouncilLogoProps> = ({
  className = '',
  variant = 'header',
}) => {
  const [imageError, setImageError] = useState(false);

  // Fallback if image fails to load
  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-white rounded-lg shadow-sm border border-amber-300 p-1 ${className}`}>
        <div className="text-center font-bold text-blue-950">
          <Building2 className="w-6 h-6 mx-auto text-blue-900" />
          <span className="text-[8px] font-black block tracking-tighter uppercase">MASVINGO RDC</span>
        </div>
      </div>
    );
  }

  if (variant === 'login') {
    return (
      <div className={`flex items-center justify-center p-2 bg-white rounded-xl shadow-md border-2 border-amber-400 overflow-hidden ${className}`}>
        <img
          src="/council_logo.jpg"
          alt="Masvingo Rural District Council Logo"
          onError={() => setImageError(true)}
          className="max-h-20 w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'letterhead') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/council_logo.jpg"
          alt="Masvingo Rural District Council Official Logo"
          onError={() => setImageError(true)}
          className="max-h-24 w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`flex items-center justify-center bg-white rounded-lg p-1 shadow border border-amber-300 overflow-hidden ${className}`}>
        <img
          src="/council_logo.jpg"
          alt="Masvingo RDC Logo"
          onError={() => setImageError(true)}
          className="max-h-12 w-auto object-contain"
        />
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className={`flex items-center justify-center bg-white rounded p-0.5 shadow-sm border border-slate-200 overflow-hidden ${className}`}>
        <img
          src="/council_logo.jpg"
          alt="Masvingo RDC"
          onError={() => setImageError(true)}
          className="max-h-8 w-auto object-contain"
        />
      </div>
    );
  }

  // Default: header
  return (
    <div className={`flex items-center justify-center bg-white rounded-lg p-1 shadow-md border-2 border-amber-400 overflow-hidden ${className}`}>
      <img
        src="/council_logo.jpg"
        alt="Masvingo Rural District Council Logo"
        onError={() => setImageError(true)}
        className="max-h-12 w-auto object-contain"
      />
    </div>
  );
};
