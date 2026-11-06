# AI Label & Metadata Remover (AuraStrip)

> An in-browser, 100% offline image sanitizer and provenance stripper built with high-contrast Neofuturistic styling, kinetic typography, and fluid WebGL waves.

![Clean Metadata Sanitization](https://raw.githubusercontent.com/Saif-Cipher/AI-lABEL-REMOVER/main/public/assets/aistudio/Screenshot_20261103-003328_ff18fdac.png)

## Overview

Social platforms like Instagram, Facebook, and Threads automatically inspect digital images for embedded provenance metadata to attach "AI info" or "Made with AI" labels. 

**AuraStrip** runs entirely inside your browser, decoding images onto an isolated HTML5 2D canvas context and re-exporting the raw pixel buffer afresh. This completely eradicates container-level tracking packets without sending any data over the internet or degrading visual resolution.

---

## Key Features

- **C2PA Manifest Stripping**: Eradicates Coalition for Content Provenance and Authenticity (`jumbf`) chunks injected by DALL-E, Bing Image Creator, Midjourney, and Adobe Firefly.
- **XMP & EXIF Purge**: Erases embedded schema packets containing prompts, seeds, model hashes, and camera sensor parameters.
- **100% Client-Side Execution**: Zero server uploads, zero network latency, zero telemetry. Works even with network disconnected.
- **Interactive Before/After Comparator**: Live split slider with a 2.5x magnification loupe to verify 100% pixel fidelity.
- **Batch Processing & ZIP Bundler**: Drop single images or multiple files to download an organized `cleaned_images.zip` archive via JSZip.
- **Anti-Steganography Jitter Filter**: Optional subtle $\pm 1$ bit pixel perturbation to disrupt frequency-domain heuristic watermarks like Google SynthID.
- **Fluid WebGL Waves Background**: Integrated `ShaderBackground` wave visualizer.
- **Synthetic AI Test Presets**: Built-in interactive test templates for instant evaluation without needing local AI files.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Neofuturistic design system (Deep Blue `#09318D`, Pure White `#FFFFFF`, Bubblegum Pink `#FD91CC`)
- **Shader**: Custom WebGL fragment shader canvas
- **Packaging**: JSZip client-side binary bundler
- **Architecture**: shadcn-compatible structure (`components.json`, `@/components/ui`, `@/lib/utils`)

---

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Saif-Cipher/AI-lABEL-REMOVER.git
cd AI-lABEL-REMOVER

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

---

## License

MIT License. Open-source and free to use.
