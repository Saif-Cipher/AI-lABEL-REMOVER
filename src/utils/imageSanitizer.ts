import JSZip from 'jszip';
import { ProcessedImageItem, SanitizerOptions } from '../types';
import { scanMetadata } from './metadataScanner';

/**
 * Sanitizes an image file by drawing its raw pixel buffer to an HTML5 Canvas,
 * stripping all container-level C2PA manifests, EXIF tags, XMP packets, and ancillary chunks.
 */
export async function sanitizeImage(
  file: File,
  options: SanitizerOptions
): Promise<ProcessedImageItem> {
  const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const originalScan = await scanMetadata(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const originalDataUrl = event.target?.result as string;
      const img = new Image();

      img.onload = async () => {
        try {
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', {
            willReadFrequently: options.applyMicroPerturbation,
          });

          if (!ctx) {
            throw new Error('Failed to create canvas 2D rendering context');
          }

          // Render raw pixels
          ctx.drawImage(img, 0, 0);

          // Optional subtle anti-steganographic micro-perturbation
          // (disrupts frequency-domain watermark classifiers without visible artifacts)
          if (options.applyMicroPerturbation) {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            const totalPixels = width * height;
            // Perturb ~1% of pixels by +/- 1 value
            for (let i = 0; i < totalPixels; i += 79) {
              const pixelIdx = i * 4;
              const delta = (Math.random() > 0.5 ? 1 : -1);
              data[pixelIdx] = Math.min(255, Math.max(0, data[pixelIdx] + delta));
            }
            ctx.putImageData(imageData, 0, 0);
          }

          // Determine target MIME type
          let mimeType = file.type;
          if (options.outputFormat !== 'original') {
            mimeType = options.outputFormat;
          }
          if (!mimeType || mimeType === '') {
            mimeType = 'image/png';
          }

          // Use canvas.toBlob for high memory efficiency
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                // Fallback to toDataURL
                const cleanDataUrl = canvas.toDataURL(mimeType, options.quality);
                const byteString = atob(cleanDataUrl.split(',')[1]);
                const mimeString = cleanDataUrl.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                  ia[i] = byteString.charCodeAt(i);
                }
                const fallbackBlob = new Blob([ab], { type: mimeString });
                const cleanScan = await scanMetadata(fallbackBlob);

                resolve({
                  id,
                  originalFile: file,
                  originalDataUrl,
                  originalSize: file.size,
                  originalScan,
                  cleanDataUrl,
                  cleanBlob: fallbackBlob,
                  cleanSize: fallbackBlob.size,
                  cleanScan,
                  width,
                  height,
                  format: mimeString,
                  status: 'ready',
                  timestamp: Date.now(),
                });
                return;
              }

              const cleanDataUrl = URL.createObjectURL(blob);
              const cleanScan = await scanMetadata(blob);

              resolve({
                id,
                originalFile: file,
                originalDataUrl,
                originalSize: file.size,
                originalScan,
                cleanDataUrl,
                cleanBlob: blob,
                cleanSize: blob.size,
                cleanScan,
                width,
                height,
                format: mimeType,
                status: 'ready',
                timestamp: Date.now(),
              });
            },
            mimeType,
            options.quality
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown image processing error';
          reject(new Error(message));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image. Ensure it is a valid JPG, PNG, or WebP file.'));
      };

      img.src = originalDataUrl;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file from disk.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Packages multiple cleaned images into a single ZIP file with duplicate filename protection.
 */
export async function createZipBundle(
  items: ProcessedImageItem[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const nameCounts: Record<string, number> = {};

  for (const item of items) {
    if (item.status !== 'ready' || !item.cleanBlob) continue;

    let baseName = item.originalFile.name.replace(/\.[^/.]+$/, '');
    const ext = item.format.includes('png')
      ? 'png'
      : item.format.includes('webp')
      ? 'webp'
      : 'jpg';

    if (nameCounts[baseName] !== undefined) {
      nameCounts[baseName]++;
      baseName = `${baseName}_${nameCounts[baseName]}`;
    } else {
      nameCounts[baseName] = 0;
    }

    const cleanFilename = `clean_${baseName}.${ext}`;
    zip.file(cleanFilename, item.cleanBlob);
  }

  return zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );
}
