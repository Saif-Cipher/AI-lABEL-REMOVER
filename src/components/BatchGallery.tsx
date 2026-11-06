import React from 'react';
import { Download, Archive, Trash2, Eye, ShieldCheck, Check } from 'lucide-react';
import { ProcessedImageItem } from '../types';

interface BatchGalleryProps {
  items: ProcessedImageItem[];
  selectedItem: ProcessedImageItem | null;
  onSelectItem: (item: ProcessedImageItem) => void;
  onDownloadSingle: (item: ProcessedImageItem) => void;
  onDownloadZip: () => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  isZipping: boolean;
  zipProgress: number;
}

export const BatchGallery: React.FC<BatchGalleryProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onDownloadSingle,
  onDownloadZip,
  onRemoveItem,
  onClearAll,
  isZipping,
  zipProgress,
}) => {
  if (items.length === 0) return null;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="rounded-3xl glass-panel p-6 sm:p-8 transition-all">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#09318D]/40 border border-[#FD91CC]/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#FD91CC]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Sanitized Images ({items.length})
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Ready for offline export and deployment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="px-3 py-2 text-xs font-mono text-slate-400 hover:text-white bg-[#030712] border border-white/10 hover:border-red-500/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            {items.length > 1 ? (
              <button
                onClick={onDownloadZip}
                disabled={isZipping}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#09318D] via-[#1d4ecc] to-[#FD91CC] hover:from-[#FD91CC] hover:to-[#09318D] hover:text-[#030712] rounded-xl shadow-[0_0_20px_rgba(253,145,204,0.35)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>
                  {isZipping
                    ? `Generating ZIP (${zipProgress}%)...`
                    : `Download All as ZIP (${items.length})`}
                </span>
              </button>
            ) : (
              <button
                onClick={() => onDownloadSingle(items[0])}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#09318D] to-[#FD91CC] hover:from-[#FD91CC] hover:to-[#09318D] hover:text-[#030712] rounded-xl shadow-[0_0_20px_rgba(253,145,204,0.35)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Clean Image</span>
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#0a1538] border-[#FD91CC]/70 shadow-[0_0_25px_rgba(253,145,204,0.25)] scale-[1.01]'
                    : 'bg-[#030714] hover:bg-[#070e28] border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Thumbnail image */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/40 mb-3 border border-white/5">
                  <img
                    src={item.cleanDataUrl}
                    alt={item.originalFile.name}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#FD91CC] text-[#030712]">
                      SELECTED
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white truncate" title={item.originalFile.name}>
                    {item.originalFile.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="tabular-nums">
                      {item.width} × {item.height}
                    </span>
                    <span className="text-slate-300 tabular-nums">{formatBytes(item.cleanSize)}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1 pt-1">
                    <Check className="w-3 h-3 text-[#FD91CC]" />
                    <span>Metadata purged</span>
                  </div>
                </div>

                {/* Card actions */}
                <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectItem(item);
                    }}
                    className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#447BFF]" />
                    <span>Compare</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadSingle(item);
                      }}
                      className="p-1.5 rounded-lg bg-[#09318D]/60 hover:bg-[#09318D] text-white transition-colors cursor-pointer"
                      title="Download image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-300 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
