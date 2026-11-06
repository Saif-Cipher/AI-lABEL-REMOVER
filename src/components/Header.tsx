import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onScrollToDrop: () => void;
  processedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onScrollToDrop, processedCount }) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#030712]/85 border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single clean brand wordmark */}
        <a
          href="/"
          className="flex items-center gap-3 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#09318D] via-[#214bc2] to-[#FD91CC] p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-[#030712] rounded-[6.5px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FD91CC]" />
            </div>
          </div>
          <span className="font-extrabold tracking-tight text-white group-hover:text-[#FD91CC] transition-colors">
            Aura<span className="text-[#FD91CC]">Strip</span>
          </span>
        </a>

        {/* Zone 2: 4 clean single-line navigation links (no pill enclosures) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#dropzone"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Sanitizer
          </a>
          <a
            href="#comparison"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Comparator
          </a>
          <a
            href="#technical-specs"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Specifications
          </a>
          <a
            href="#offline-privacy"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Offline Architecture
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0">
          {processedCount > 0 && (
            <span className="hidden lg:inline text-xs font-mono text-[#FD91CC] tabular-nums">
              {processedCount} {processedCount === 1 ? 'file cleaned' : 'files cleaned'}
            </span>
          )}
          <button
            onClick={onScrollToDrop}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#09318D] to-[#1c47be] hover:from-[#133eb0] hover:to-[#FD91CC] hover:text-[#030712] border border-white/10 rounded-xl shadow-[0_0_20px_rgba(9,49,141,0.4)] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer active:scale-95"
          >
            Drop Images
          </button>
        </div>
      </div>
    </header>
  );
};
