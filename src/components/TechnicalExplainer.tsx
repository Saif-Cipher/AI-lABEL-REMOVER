import React, { useState } from 'react';
import { Lock, ChevronDown, Check } from 'lucide-react';

export const TechnicalExplainer: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const steps = [
    {
      title: 'Container Manifest Inspection',
      desc: 'The browser reads the raw binary buffer of the uploaded file, identifying C2PA JUMBF boxes, EXIF APP1 headers, and XMP packets without sending any bytes to external servers.',
    },
    {
      title: 'HTML5 Canvas Decoupling',
      desc: 'Images are drawn to an isolated offscreen canvas context. Because the 2D canvas extracts solely the raw RGB pixel matrix, all non-raster metadata containers are immediately discarded.',
    },
    {
      title: 'Clean Binary Re-Export',
      desc: 'The clean canvas buffer is exported afresh (or bundled via JSZip for batch drops) with clean headers, bypassing social media automated AI tag detection.',
    },
  ];

  const faqs = [
    {
      q: 'How does this bypass Instagram and Facebook AI labels?',
      a: 'Meta platforms automatically flag posts by scanning for C2PA (Coalition for Content Provenance and Authenticity) manifest boxes, EXIF APP1 metadata, and XMP packets embedded by generative models (such as Midjourney, DALL-E 3, Adobe Firefly, and Google Imagen). By decoding the image into raw RGB pixel values on an in-browser canvas and re-encoding it afresh, every container-level metadata packet is removed.',
    },
    {
      q: 'Does this compromise visual resolution or image quality?',
      a: 'No. The image is rendered to canvas at its exact 1:1 natural pixel dimensions (naturalWidth × naturalHeight) and re-exported at maximum quality. Visual pixel clarity is 100% preserved while all hidden tracking packets and prompt text are erased.',
    },
    {
      q: 'Are files uploaded to any remote server or cloud database?',
      a: 'Never. The entire pipeline executes 100% client-side inside your browser engine using the standard Canvas and FileReader APIs. You can disconnect your network or turn on Airplane mode and the tool functions normally.',
    },
    {
      q: 'What about invisible pixel-level watermarks like Google SynthID?',
      a: 'Canvas re-encoding erases file container markers. To disrupt frequency-domain heuristic detectors like SynthID, you can toggle our optional "Anti-Steganography Jitter Filter", which applies an imperceptible ±1 bit jitter across ~1% of pixels to disrupt convolutional neural network watermark classifiers without degrading visual fidelity.',
    },
  ];

  return (
    <section id="technical-specs" className="max-w-5xl mx-auto px-6 py-12">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-[#FD91CC] font-semibold mb-2">
          Technical Architecture
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How Metadata Stripping Works
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2 font-normal">
          The engineering pipeline behind digital provenance decoupling and C2PA elimination.
        </p>
      </div>

      {/* 3 Step Architecture Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl glass-panel relative overflow-hidden group hover:border-[#FD91CC]/50 transition-colors"
          >
            <div className="text-xs font-mono text-[#FD91CC] font-semibold mb-3">
              Step 0{idx + 1}
            </div>
            <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Accordion FAQ */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white mb-5">Frequently Asked Questions</h3>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-white/[0.08] bg-[#030714] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:text-[#FD91CC] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#FD91CC]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 font-normal leading-relaxed border-t border-white/[0.06] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Offline Privacy Guarantee */}
      <div
        id="offline-privacy"
        className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#09318D]/25 via-[#060c22] to-[#FD91CC]/15 border border-white/[0.09] flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#030712] border border-[#FD91CC]/40 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-[#FD91CC]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              100% Offline Processing Guarantee
            </h4>
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              Your files never leave your device. All decoding and re-encoding executes in-memory.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-[#FD91CC] shrink-0">
          Zero Network Transmission
        </div>
      </div>
    </section>
  );
};
