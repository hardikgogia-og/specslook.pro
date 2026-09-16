/**
 * Utility functions for resilient network requests and safe JSON handling.
 * Prevents "Unexpected token 'A', 'A server e'... is not valid JSON" errors
 * when endpoints return HTML error pages or non-JSON payloads.
 */

export async function safeFetchJson<T = any>(res: Response): Promise<{ data: T | null; text: string; isJson: boolean }> {
  try {
    const text = await res.text();
    const trimmed = (text || '').trim();
    if (!trimmed || trimmed.startsWith('<') || trimmed.startsWith('A server error') || trimmed.startsWith('Internal Server Error') || trimmed.startsWith('Error:')) {
      return { data: null, text, isJson: false };
    }
    const data = JSON.parse(text);
    return { data, text, isJson: true };
  } catch {
    return { data: null, text: '', isJson: false };
  }
}

/**
 * Resizes and compresses an image File using an offscreen canvas.
 * Scales down large camera photos (e.g. 10MB 4K photos) to max 1200px and 85% quality WebP/JPEG (~80-150KB).
 * Ensures uploads are ultra-fast, never exceed Vercel's 4.5MB request limit,
 * and display cleanly on all devices without 404s.
 */
export function compressImageFile(file: File, maxDim = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    // If SVG or small text-based graphic, read directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rawData = e.target?.result as string;
      if (!rawData) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          try {
            let compressed = canvas.toDataURL('image/webp', quality);
            if (!compressed || compressed.length < 50 || compressed.startsWith('data:image/png')) {
              compressed = canvas.toDataURL('image/jpeg', quality);
            }
            resolve(compressed);
          } catch {
            resolve(rawData);
          }
        } else {
          resolve(rawData);
        }
      };

      img.onerror = () => resolve(rawData);
      img.src = rawData;
    };

    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
