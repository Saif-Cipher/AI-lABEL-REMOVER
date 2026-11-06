import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#09318D]/40 bg-[#040612] text-slate-400 py-12 px-6 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FD91CC] to-[#09318D] flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">NEOSTRIP</span>
          <span className="text-xs text-slate-500">· In-Browser Provenance Sanitizer</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span>Strips C2PA Manifests</span>
          <span className="text-slate-600">·</span>
          <span>Purges XMP & EXIF</span>
          <span className="text-slate-600">·</span>
          <span>Client-Side HTML5 Canvas</span>
          <span className="text-slate-600">·</span>
          <span>No Server Logs</span>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Pure Client Execution · Free & Open Utility
        </div>
      </div>
    </footer>
  );
};
