import React, { useRef, useState } from 'react';
import { UploadCloud, Sliders, Check, Sparkles } from 'lucide-react';
import { SanitizerOptions } from '../types';
import { SAMPLE_PRESETS, SamplePreset, generateSampleFile } from '../utils/sampleImages';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
  processingProgress: number;
  options: SanitizerOptions;
  onOptionsChange: (newOptions: SanitizerOptions) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  isProcessing,
  processingProgress,
  options,
  onOptionsChange,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      e.target.value = '';
    }
  };

  const handleLoadSample = async (preset: SamplePreset) => {
    setLoadingPresetId(preset.id);
    try {
      const sampleFile = await generateSampleFile(preset);
      onFilesSelected([sampleFile]);
    } catch (err) {
      console.error('Failed to generate sample file', err);
    } finally {
      setLoadingPresetId(null);
    }
  };

  return (
    <div id="dropzone" className="max-w-4xl mx-auto px-6 py-6">
      <div className="rounded-3xl glass-panel p-6 sm:p-10 transition-all">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Image Decoupling Engine
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Raw pixel re-encoding directly via HTML5 2D canvas
            </p>
          </div>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-[#040817] border border-white/10 hover:border-[#FD91CC]/50 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#FD91CC]" />
            <span>{showAdvanced ? 'Hide Settings' : 'Encoding Settings'}</span>
          </button>
        </div>

        {/* Collapsible Options Drawer */}
        {showAdvanced && (
          <div className="mb-8 p-5 rounded-2xl bg-[#030714] border border-white/10 space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#FD91CC] font-semibold">
              Encoding & Watermark Parameters
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs text-slate-300 font-mono mb-2">
                  Target Export Format
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'original', label: 'Original' },
                    { id: 'image/png', label: 'PNG' },
                    { id: 'image/jpeg', label: 'JPG' },
                    { id: 'image/webp', label: 'WebP' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() =>
                        onOptionsChange({
                          ...options,
                          outputFormat: fmt.id as SanitizerOptions['outputFormat'],
                        })
                      }
                      className={`py-2 px-2 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                        options.outputFormat === fmt.id
                          ? 'bg-[#09318D] border-[#FD91CC] text-white shadow-[0_0_15px_rgba(253,145,204,0.3)] font-semibold'
                          : 'bg-[#070e24] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-mono mb-2">
                  Anti-Steganography Jitter Filter
                </label>
                <button
                  type="button"
                  onClick={() =>
                    onOptionsChange({
                      ...options,
                      applyMicroPerturbation: !options.applyMicroPerturbation,
                    })
                  }
                  className={`w-full py-2.5 px-3.5 text-xs font-mono rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
                    options.applyMicroPerturbation
                      ? 'bg-[#FD91CC]/15 border-[#FD91CC] text-[#FD91CC]'
                      : 'bg-[#070e24] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate pr-2">SynthID frequency disruption</span>
                  <span className="font-bold shrink-0">
                    {options.applyMicroPerturbation ? 'ACTIVE' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Drop Area */}
        <div
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 cursor-pointer ${
            isDragOver
              ? 'border-[#FD91CC] bg-[#FD91CC]/10 shadow-[0_0_40px_rgba(253,145,204,0.35)] scale-[1.01]'
              : 'border-[#09318D]/70 hover:border-[#FD91CC]/70 bg-[#040818]/70 hover:bg-[#070e28]'
          } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleInputChange}
            className="hidden"
          />

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-[#09318D] border-t-[#FD91CC] animate-spin shadow-[0_0_20px_#FD91CC]" />
              <div className="space-y-1">
                <div className="text-base font-bold text-white tracking-wide">
                  Sanitizing Image Pixels...
                </div>
                <div className="text-xs font-mono text-slate-300">
                  Dumping container chunks & generating metadata-free buffer
                </div>
              </div>
              <div className="w-full max-w-xs bg-[#070e24] h-1.5 rounded-full overflow-hidden border border-white/10 mt-2">
                <div
                  className="h-full bg-gradient-to-r from-[#09318D] via-[#FD91CC] to-white transition-all duration-300"
                  style={{ width: `${Math.max(15, processingProgress)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#09318D] to-[#FD91CC] p-[1.5px] shadow-[0_0_30px_rgba(9,49,141,0.5)]">
                <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
                  <UploadCloud className="w-7 h-7 text-[#FD91CC]" />
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Click or drag images here
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
                  JPG, PNG, WebP · Single files or batch drop · Client-side processing
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-[#FD91CC]" />
                  100% offline
                </span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#447BFF]" />
                  Natural resolution preserved
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Selector */}
        <div className="mt-8 pt-6 border-t border-white/[0.08]">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
            Or test with a pre-configured synthetic image:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_PRESETS.map((preset) => {
              const isLoading = loadingPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleLoadSample(preset)}
                  disabled={isProcessing || isLoading}
                  className="text-left p-3.5 rounded-xl bg-[#040817] hover:bg-[#070e28] border border-white/10 hover:border-[#FD91CC]/60 transition-all duration-200 cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white group-hover:text-[#FD91CC] transition-colors truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-white">
                      {preset.simulatedGenerator}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {preset.tagline}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
