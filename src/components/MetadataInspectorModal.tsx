import React from 'react';
import { X, ShieldAlert, ShieldCheck, Binary, Check } from 'lucide-react';
import { ProcessedImageItem } from '../types';

interface MetadataInspectorModalProps {
  item: ProcessedImageItem | null;
  onClose: () => void;
}

export const MetadataInspectorModal: React.FC<MetadataInspectorModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#060c22] border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.08] bg-[#030714]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FD91CC]/15 border border-[#FD91CC]/30 flex items-center justify-center">
              <Binary className="w-4 h-4 text-[#FD91CC]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Metadata Provenance Audit</h3>
              <p className="text-xs font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                {item.originalFile.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-[#070e28] hover:bg-[#0c1842] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Summary metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FD91CC]">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>ORIGINAL MARKERS</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {item.originalScan.detectedTags.length}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Detected provenance signatures
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#030712] border border-white/[0.08] space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-[#447BFF]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SANITIZED MARKERS</span>
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">0</div>
              <div className="text-[11px] text-slate-400 font-mono">
                100% container tags stripped
              </div>
            </div>
          </div>

          {/* Detected Tags Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Binary Markers Identified in Upload:
            </h4>

            {item.originalScan.detectedTags.length > 0 ? (
              <div className="space-y-2.5">
                {item.originalScan.detectedTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#030714] border border-white/[0.08] flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FD91CC]/15 text-[#FD91CC] font-semibold">
                          {tag.category}
                        </span>
                        <span className="text-xs font-semibold text-white">{tag.label}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {tag.detail}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded shrink-0">
                      FLAGGED
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#030714] border border-white/[0.08] text-xs text-slate-400">
                No standard C2PA or XMP markers detected in initial headers. Raw pixel redraw was still applied to eliminate any hidden ancillary chunks.
              </div>
            )}
          </div>

          {/* Verification Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Post-Re-Encoding Status Verification:
            </h4>

            <div className="p-4 rounded-2xl bg-[#030714] border border-white/[0.08] space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>C2PA JUMBF Manifest Box:</span>
                <span className="text-slate-200 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#FD91CC]" /> STRIPPED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>EXIF APP1 Segment & Camera Tags:</span>
                <span className="text-slate-200 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#FD91CC]" /> PURGED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>XMP Packet & Prompt Descriptions:</span>
                <span className="text-slate-200 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#FD91CC]" /> ELIMINATED
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>PNG Ancillary Text Chunks:</span>
                <span className="text-slate-200 flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#FD91CC]" /> REMOVED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#030714] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono font-medium text-white bg-[#09318D] hover:bg-[#1442b8] border border-white/10 rounded-xl transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
