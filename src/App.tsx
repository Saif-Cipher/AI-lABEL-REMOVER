import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { KineticHero } from './components/KineticHero';
import { DropZone } from './components/DropZone';
import { ComparisonSlider } from './components/ComparisonSlider';
import { BatchGallery } from './components/BatchGallery';
import { MetadataInspectorModal } from './components/MetadataInspectorModal';
import { TechnicalExplainer } from './components/TechnicalExplainer';
import { Footer } from './components/Footer';
import { ProcessedImageItem, SanitizerOptions } from './types';
import { sanitizeImage, createZipBundle } from './utils/imageSanitizer';
import { SAMPLE_PRESETS, generateSampleFile } from './utils/sampleImages';
import { ShaderBackground } from '@/components/ui/adisyon-shader';

export default function App() {
  const [processedItems, setProcessedItems] = useState<ProcessedImageItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ProcessedImageItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [inspectedItem, setInspectedItem] = useState<ProcessedImageItem | null>(null);

  const [sanitizerOptions, setSanitizerOptions] = useState<SanitizerOptions>({
    outputFormat: 'original',
    quality: 1.0,
    applyMicroPerturbation: false,
    stripICCProfile: true,
  });

  const handleScrollToDrop = () => {
    const el = document.getElementById('dropzone');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(10);

    const newItems: ProcessedImageItem[] = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      try {
        const item = await sanitizeImage(file, sanitizerOptions);
        newItems.push(item);
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err);
      }
      setProcessingProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    setIsProcessing(false);
    setProcessingProgress(0);

    if (newItems.length > 0) {
      setProcessedItems((prev) => [...newItems, ...prev]);
      setSelectedItem(newItems[0]);

      // Celebrate with high-contrast neon confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FD91CC', '#09318D', '#FFFFFF', '#6BA3FF'],
        });
      } catch (e) {
        // Safe fallback if confetti canvas not ready
      }

      // Scroll smoothly down to the comparison/batch gallery area
      setTimeout(() => {
        const el = document.getElementById('comparison') || document.getElementById('dropzone');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const handleTryPreset = async () => {
    try {
      const preset = SAMPLE_PRESETS[0];
      const sampleFile = await generateSampleFile(preset);
      handleFilesSelected([sampleFile]);
    } catch (err) {
      console.error('Failed to load sample preset', err);
    }
  };

  const handleDownloadSingle = (item: ProcessedImageItem) => {
    const a = document.createElement('a');
    let baseName = item.originalFile.name.replace(/\.[^/.]+$/, '');
    const ext = item.format.includes('png')
      ? 'png'
      : item.format.includes('webp')
      ? 'webp'
      : 'jpg';
    a.href = item.cleanDataUrl;
    a.download = `clean_${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = async () => {
    if (processedItems.length === 0) return;
    setIsZipping(true);
    setZipProgress(0);

    try {
      const zipBlob = await createZipBundle(processedItems, (percent) => {
        setZipProgress(percent);
      });

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cleaned_images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating zip:', err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const handleRemoveItem = (id: string) => {
    setProcessedItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (selectedItem?.id === id) {
        setSelectedItem(next.length > 0 ? next[0] : null);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setProcessedItems([]);
    setSelectedItem(null);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-[#FD91CC] selection:text-[#09318D] overflow-x-hidden">
      {/* Live WebGL Wave Shader Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-50 mix-blend-screen">
        <ShaderBackground className="w-full h-full" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top Bar Header */}
        <Header
          onScrollToDrop={handleScrollToDrop}
          processedCount={processedItems.length}
        />

      <main>
        {/* Kinetic Hero */}
        <KineticHero
          onScrollToDrop={handleScrollToDrop}
          onTryPreset={handleTryPreset}
        />

        {/* Dropzone & Sanitizer Controls */}
        <DropZone
          onFilesSelected={handleFilesSelected}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
          options={sanitizerOptions}
          onOptionsChange={setSanitizerOptions}
        />

        {/* Comparison Slider (Visible when at least 1 image is processed) */}
        {selectedItem && (
          <ComparisonSlider
            item={selectedItem}
            onDownloadSingle={handleDownloadSingle}
            onOpenInspector={(item) => setInspectedItem(item)}
          />
        )}

        {/* Batch Gallery */}
        <BatchGallery
          items={processedItems}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          onDownloadSingle={handleDownloadSingle}
          onDownloadZip={handleDownloadZip}
          onRemoveItem={handleRemoveItem}
          onClearAll={handleClearAll}
          isZipping={isZipping}
          zipProgress={zipProgress}
        />

        {/* Under the Hood Technical Details & FAQs */}
        <TechnicalExplainer />
      </main>

      {/* Metadata Inspector Modal */}
      <MetadataInspectorModal
        item={inspectedItem}
        onClose={() => setInspectedItem(null)}
      />

      {/* Footer */}
      <Footer />
      </div>
    </div>
  );
}
