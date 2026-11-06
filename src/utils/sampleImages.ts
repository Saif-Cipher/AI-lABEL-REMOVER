/**
 * Generates interactive synthetic AI test images with embedded C2PA, EXIF, and XMP markers
 * so users can test the stripper immediately without needing their own files.
 */

export interface SamplePreset {
  id: string;
  name: string;
  tagline: string;
  simulatedGenerator: 'Midjourney v6.1' | 'DALL-E 3' | 'Adobe Firefly';
  themeColor: string;
  filename: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Metropolis',
    tagline: 'Simulated DALL-E 3 with C2PA Manifest & Prompt Chunks',
    simulatedGenerator: 'DALL-E 3',
    themeColor: '#FD91CC',
    filename: 'dalle3_cyberpunk_neon_grid.png',
  },
  {
    id: 'synthetic-portrait',
    name: 'Synthetic Android Visage',
    tagline: 'Simulated Midjourney v6 with XMP Parameter Packets',
    simulatedGenerator: 'Midjourney v6.1',
    themeColor: '#09318D',
    filename: 'midjourney_synthetic_portrait.png',
  },
  {
    id: 'firefly-abstract',
    name: 'Prismatic Void Sphere',
    tagline: 'Simulated Adobe Firefly with Content Credentials',
    simulatedGenerator: 'Adobe Firefly',
    themeColor: '#FFFFFF',
    filename: 'firefly_prismatic_c2pa_sphere.png',
  },
];

/**
 * Creates an in-memory sample image with embedded binary strings simulating
 * real AI provenance tags (C2PA, XMP, EXIF).
 */
export async function generateSampleFile(preset: SamplePreset): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 750;
  const ctx = canvas.getContext('2d')!;

  // Background deep gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1000, 750);
  bgGrad.addColorStop(0, '#050814');
  bgGrad.addColorStop(0.4, '#09153a');
  bgGrad.addColorStop(0.8, '#1b0d26');
  bgGrad.addColorStop(1, '#050814');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1000, 750);

  // Futuristic geometric & neon grid visuals
  ctx.strokeStyle = 'rgba(9, 49, 141, 0.4)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1000; x += 50) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 750);
    ctx.stroke();
  }
  for (let y = 0; y <= 750; y += 50) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1000, y);
    ctx.stroke();
  }

  // Glowing neon circles / orbs (Bubblegum Pink #FD91CC and Deep Blue #09318D)
  const orbGrad = ctx.createRadialGradient(500, 360, 20, 500, 360, 260);
  orbGrad.addColorStop(0, 'rgba(253, 145, 204, 0.95)');
  orbGrad.addColorStop(0.35, 'rgba(9, 49, 141, 0.85)');
  orbGrad.addColorStop(0.7, 'rgba(253, 145, 204, 0.2)');
  orbGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = orbGrad;
  ctx.beginPath();
  ctx.arc(500, 360, 260, 0, Math.PI * 2);
  ctx.fill();

  // Futuristic typography inside image
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(preset.name.toUpperCase(), 500, 340);

  ctx.fillStyle = '#FD91CC';
  ctx.font = '600 18px "JetBrains Mono", monospace';
  ctx.fillText(`AI MODEL: ${preset.simulatedGenerator}`, 500, 385);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '14px "JetBrains Mono", monospace';
  ctx.fillText('ORIGINAL FILE: EMBEDDED C2PA / XMP / EXIF PROVENANCE', 500, 420);

  // Convert canvas to blob
  const baseBlob = await new Promise<Blob>((res) =>
    canvas.toBlob((b) => res(b!), 'image/png')
  );

  // Inject simulated metadata chunks into the file buffer so the metadata scanner detects it!
  const arrayBuffer = await baseBlob.arrayBuffer();
  const simulatedHeader = `\n<!-- c2pa contentauth urn:c2pa:manifest:ai_provenance Midjourney v6.1 DALL-E 3 parameters: { prompt: "hyper-detailed neofuturistic glowing metropolis", seed: 9817234 } http://ns.adobe.com/xap/1.0/ <x:xmpmeta> xmp:CreatorTool SynthID Exif 0xFFE1 -->\n`;
  const textEncoder = new TextEncoder();
  const headerBytes = textEncoder.encode(simulatedHeader);

  // Combine bytes
  const combined = new Uint8Array(arrayBuffer.byteLength + headerBytes.byteLength);
  combined.set(new Uint8Array(arrayBuffer), 0);
  combined.set(headerBytes, arrayBuffer.byteLength);

  return new File([combined], preset.filename, { type: 'image/png' });
}
