import React, { useState } from 'react';
import { ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

interface KineticHeroProps {
  onScrollToDrop: () => void;
  onTryPreset: () => void;
}

export const KineticHero: React.FC<KineticHeroProps> = ({ onScrollToDrop, onTryPreset }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const headlineLetters = 'Remove AI Label'.split('');

  return (
    <section className="relative pt-16 pb-16 px-6 overflow-hidden">
      {/* Refined ambient cosmic gradient (Deep Blue #09318D and Bubblegum Pink #FD91CC) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-gradient-to-r from-[#09318D]/35 via-[#FD91CC]/20 to-[#09318D]/35 blur-[140px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-[#FD91CC]/10 blur-[120px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#09318D]/25 blur-[130px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center">
        {/* Clean, unboxed text kicker (no pill capsules or pulsing dots) */}
        <div className="text-xs font-mono tracking-widest text-[#FD91CC] uppercase mb-6 font-semibold">
          Client-Side Provenance & Metadata Sanitizer
        </div>

        {/* Kinetic Interactive Typography Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-wrap-balance">
          <span className="inline-block">
            {headlineLetters.map((char, idx) => (
              <span
                key={idx}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`kinetic-char select-none cursor-default font-extrabold ${
                  char === ' ' ? 'mr-3' : ''
                } ${
                  hoveredIndex === idx
                    ? 'text-[#FD91CC] scale-115 drop-shadow-[0_0_20px_#FD91CC]'
                    : 'text-white'
                }`}
              >
                {char}
              </span>
            ))}
          </span>{' '}
          <span className="text-gradient-hero inline-block drop-shadow-[0_0_35px_rgba(253,145,204,0.4)]">
            Instantly
          </span>
        </h1>

        {/* Refined subtitle without orphan words */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10 text-wrap-balance">
          Strip C2PA Content Credentials, XMP packets, and camera EXIF metadata
          completely within your browser. Pure client-side canvas re-encoding with
          uncompromised pixel fidelity and zero network transmission.
        </p>

        {/* Primary and Secondary Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onScrollToDrop}
            className="px-8 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#09318D] via-[#1d4ecc] to-[#FD91CC] hover:from-[#FD91CC] hover:via-[#FFFFFF] hover:to-[#09318D] hover:text-[#030712] border border-white/20 rounded-xl shadow-[0_0_30px_rgba(9,49,141,0.5)] hover:shadow-[0_0_40px_rgba(253,145,204,0.5)] transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 group"
          >
            <span>Upload Images to Sanitize</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onTryPreset}
            className="px-6 py-3.5 text-sm font-medium text-slate-200 bg-[#070e24] hover:bg-[#0d183d] hover:text-white border border-white/10 hover:border-[#FD91CC]/50 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-[#FD91CC]" />
            <span>Try Sample Preset</span>
          </button>
        </div>

        {/* Clean Unboxed Metadata & Guarantees (Strict Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400">
          <span className="text-slate-200">Strips C2PA Manifests</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-200">Purges XMP & EXIF Tags</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-200">Bypasses Social AI Labels</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-[#FD91CC] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% In-Browser Execution
          </span>
        </div>
      </div>
    </section>
  );
};
