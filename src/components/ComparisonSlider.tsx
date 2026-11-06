import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Download, SlidersHorizontal, ShieldAlert, ShieldCheck, ZoomIn, Eye } from 'lucide-react';
import { ProcessedImageItem } from '../types';

interface ComparisonSliderProps {
  item: ProcessedImageItem;
  onDownloadSingle: (item: ProcessedImageItem) => void;
  onOpenInspector: (item: ProcessedImageItem) => void;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({
  item,
  onDownloadSingle,
  onOpenInspector,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [showZoomLoupe, setShowZoomLoupe] = useState(false);
  const [zoomCoord, setZoomCoord] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const relativeX = clientX - rect.left;
      const percent = Math.min(100, Math.max(0, (relativeX / rect.width) * 100));
      setSliderPosition(percent);
    },
    [isDragging]
  );

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const handleMouseMoveLoupe = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setZoomCoord({ x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) });
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const originalTagCount = item.originalScan.detectedTags.length;

  return (
    <div id="comparison" className="max-w-4xl mx-auto px-6 py-6">
      <div className="rounded-3xl glass-panel-elevated p-6 sm:p-10 transition-all">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#FD91CC] font-semibold">
              Pixel Fidelity & Provenance Comparator
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1 truncate max-w-sm sm:max-w-md">
              {item.originalFile.name}
            </h3>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowZoomLoupe(!showZoomLoupe)}
              className={`px-3 py-2 text-xs font-mono rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                showZoomLoupe
                  ? 'bg-[#FD91CC] text-[#030712] border-white font-semibold shadow-[0_0_15px_#FD91CC]'
                  : 'bg-[#040818] text-slate-300 border-white/10 hover:border-[#FD91CC]/50'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>{showZoomLoupe ? 'Loupe: Active' : '2.5x Loupe'}</span>
            </button>

            <button
              onClick={() => onOpenInspector(item)}
              className="px-3 py-2 text-xs font-mono text-slate-200 bg-[#040818] hover:bg-[#09112e] border border-white/10 hover:border-[#447BFF] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#447BFF]" />
              <span>Audit Report</span>
            </button>

            <button
              onClick={() => onDownloadSingle(item)}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#09318D] to-[#FD91CC] hover:from-[#FD91CC] hover:to-[#09318D] hover:text-[#030712] rounded-xl shadow-[0_0_20px_rgba(253,145,204,0.35)] transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Clean</span>
            </button>
          </div>
        </div>

        {/* Status metrics comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-[#030714] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-[#FD91CC] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">Original File</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {originalTagCount > 0
                    ? `${originalTagCount} tags detected`
                    : 'Unsanitized raw binary'}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-300 tabular-nums">
              {formatBytes(item.originalSize)}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#030714] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-[#447BFF] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">Sanitized Output</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  0 tags · clean pixel buffer
                </div>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-300 tabular-nums">
              {formatBytes(item.cleanSize)}
            </span>
          </div>
        </div>

        {/* Interactive Comparison Viewport */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMoveLoupe}
          className="relative w-full h-[360px] sm:h-[480px] rounded-2xl overflow-hidden select-none bg-[#02050e] border border-white/10 group cursor-ew-resize"
        >
          {/* Base Layer: Sanitized Image */}
          <img
            src={item.cleanDataUrl}
            alt="Sanitized Result"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Top Layer: Original Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={item.originalDataUrl}
              alt="Original Unsanitized"
              className="absolute inset-0 w-full h-full object-contain max-w-none"
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                height: '100%',
              }}
            />
          </div>

          {/* Draggable Divider Line */}
          <div
            onPointerDown={handlePointerDown}
            className="absolute top-0 bottom-0 w-[2px] bg-white cursor-ew-resize shadow-[0_0_12px_#FFFFFF] z-20 flex items-center justify-center -translate-x-1/2"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-7 h-7 rounded-full bg-white text-[#09318D] shadow-[0_0_20px_#FD91CC] border-2 border-[#09318D] flex items-center justify-center pointer-events-auto hover:scale-110 transition-transform">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Subtle Corner Text Overlays (No bulky pills) */}
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#030712]/90 text-slate-300 border border-white/10 backdrop-blur-md">
              Before ({originalTagCount} tags)
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-[#030712]/90 text-[#FD91CC] border border-[#FD91CC]/30 backdrop-blur-md">
              Clean (0 tags)
            </span>
          </div>

          {/* Optional Zoom Loupe Overlay */}
          {showZoomLoupe && (
            <div
              className="absolute z-30 pointer-events-none w-36 h-36 rounded-full border-2 border-[#FD91CC] shadow-[0_0_25px_#FD91CC] overflow-hidden -translate-x-1/2 -translate-y-1/2 bg-[#030712]"
              style={{
                left: `${zoomCoord.x * 100}%`,
                top: `${zoomCoord.y * 100}%`,
              }}
            >
              <img
                src={item.cleanDataUrl}
                alt="Zoomed Loupe"
                className="w-full h-full object-cover"
                style={{
                  transform: 'scale(2.5)',
                  transformOrigin: `${zoomCoord.x * 100}% ${zoomCoord.y * 100}%`,
                }}
              />
              <div className="absolute inset-0 border border-white/30 rounded-full" />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#FD91CC] bg-[#030712]/90 px-1.5 rounded">
                2.5X LOUPE
              </div>
            </div>
          )}
        </div>

        {/* Explanatory footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
          <span>Drag divider horizontally to inspect visual preservation</span>
          <span className="text-slate-300 tabular-nums">
            {item.width} × {item.height} px · {item.format.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
