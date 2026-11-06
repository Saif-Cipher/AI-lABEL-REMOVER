export interface MetadataTag {
  category: 'C2PA' | 'EXIF' | 'XMP' | 'PNG_CHUNK' | 'WATERMARK';
  label: string;
  detail: string;
  severity: 'high' | 'medium' | 'low';
}

export interface MetadataScanResult {
  hasC2PA: boolean;
  hasEXIF: boolean;
  hasXMP: boolean;
  hasPNGText: boolean;
  detectedTags: MetadataTag[];
  rawBytesInspected: number;
}

export interface ProcessedImageItem {
  id: string;
  originalFile: File;
  originalDataUrl: string;
  originalSize: number;
  originalScan: MetadataScanResult;
  cleanDataUrl: string;
  cleanBlob: Blob;
  cleanSize: number;
  cleanScan: MetadataScanResult;
  width: number;
  height: number;
  format: string;
  status: 'processing' | 'ready' | 'error';
  errorMessage?: string;
  timestamp: number;
}

export interface SanitizerOptions {
  outputFormat: 'original' | 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
  applyMicroPerturbation: boolean; // Subtle anti-steganographic pixel noise
  stripICCProfile: boolean;
}
