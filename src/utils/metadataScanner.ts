import { MetadataScanResult, MetadataTag } from '../types';

/**
 * Inspects a Blob or File's binary header and byte content to detect
 * C2PA manifests, EXIF tags, XMP packets, and PNG text chunks.
 */
export async function scanMetadata(blob: Blob): Promise<MetadataScanResult> {
  const arrayBuffer = await blob.slice(0, 1024 * 1024).arrayBuffer(); // Scan up to 1MB of header & chunks
  const bytes = new Uint8Array(arrayBuffer);
  const detectedTags: MetadataTag[] = [];

  let hasC2PA = false;
  let hasEXIF = false;
  let hasXMP = false;
  let hasPNGText = false;

  const textDecoder = new TextDecoder('utf-8', { fatal: false });
  const rawString = textDecoder.decode(bytes);

  // 1. C2PA / Content Credentials Detection
  if (
    rawString.includes('c2pa') ||
    rawString.includes('jumb') ||
    rawString.includes('C2PA') ||
    rawString.includes('contentauth') ||
    rawString.includes('urn:c2pa')
  ) {
    hasC2PA = true;
    detectedTags.push({
      category: 'C2PA',
      label: 'C2PA Content Credentials Manifest',
      detail: 'Found jumbf/c2pa digital signature used by Meta/Instagram AI flags',
      severity: 'high',
    });
  }

  // 2. EXIF Marker & Tag Detection
  // Check for JPEG APP1 EXIF (0xFFE1 followed by Exif) or raw Exif string
  let exifFound = false;
  for (let i = 0; i < Math.min(bytes.length - 6, 2048); i++) {
    if (
      bytes[i] === 0xff &&
      bytes[i + 1] === 0xe1 &&
      bytes[i + 4] === 0x45 && // E
      bytes[i + 5] === 0x78 && // x
      bytes[i + 6] === 0x69 && // i
      bytes[i + 7] === 0x66    // f
    ) {
      exifFound = true;
      break;
    }
  }

  if (exifFound || rawString.includes('Exif') || rawString.includes('Make') || rawString.includes('Model')) {
    hasEXIF = true;
    detectedTags.push({
      category: 'EXIF',
      label: 'EXIF Camera & Sensor Metadata',
      detail: 'Hardware serial, timestamps, software parameters, and device tags',
      severity: 'medium',
    });
  }

  // 3. XMP Packet Detection
  if (
    rawString.includes('<x:xmpmeta') ||
    rawString.includes('adobe:ns:meta/') ||
    rawString.includes('http://ns.adobe.com/xap/1.0/') ||
    rawString.includes('xmp:CreatorTool')
  ) {
    hasXMP = true;
    let generator = 'AI Tool / Image Editor';
    if (rawString.includes('Midjourney')) generator = 'Midjourney Generation Packet';
    else if (rawString.includes('DALL-E') || rawString.includes('dall-e')) generator = 'OpenAI DALL-E 3 Marker';
    else if (rawString.includes('Stable Diffusion') || rawString.includes('Automatic1111')) generator = 'Stable Diffusion Workflow Chunk';
    else if (rawString.includes('Adobe Firefly')) generator = 'Adobe Firefly AI Provenance';

    detectedTags.push({
      category: 'XMP',
      label: `XMP Metadata Packet (${generator})`,
      detail: 'Embedded XML schema containing prompt, seed, model hashes, and software info',
      severity: 'high',
    });
  }

  // 4. PNG Ancillary Chunks (tEXt, iTXt, zTXt)
  if (
    rawString.includes('tEXt') ||
    rawString.includes('iTXt') ||
    rawString.includes('zTXt') ||
    rawString.includes('parameters') ||
    rawString.includes('Comment')
  ) {
    hasPNGText = true;
    detectedTags.push({
      category: 'PNG_CHUNK',
      label: 'PNG Ancillary Text & Parameter Chunks',
      detail: 'Textual metadata blocks storing synthesis prompts, steps, cfg scale',
      severity: 'medium',
    });
  }

  // 5. SynthID / Heuristic Provenance indicators
  if (rawString.includes('SynthID') || rawString.includes('synthid') || rawString.includes('Google-AI')) {
    detectedTags.push({
      category: 'WATERMARK',
      label: 'AI Model Header Watermark Tag',
      detail: 'Container-level provenance string',
      severity: 'high',
    });
  }

  return {
    hasC2PA,
    hasEXIF,
    hasXMP,
    hasPNGText,
    detectedTags,
    rawBytesInspected: bytes.length,
  };
}
