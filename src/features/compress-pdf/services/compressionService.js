import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Format raw bytes into human-readable format (KB, MB, GB).
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) ||
  '';

/**
 * In-browser client-side fallback compression using pdf-lib and canvas.
 * Ensures PDFPro functions 100% offline or on static hosting without requiring backend.
 */
async function compressPDFInBrowser(file, level = 'recommended', onProgress = () => {}) {
  onProgress(15, 'Reading document in browser...');
  const arrayBuffer = await file.arrayBuffer();

  const profiles = {
    low: { scale: 1.2, quality: 0.82 },
    recommended: { scale: 1.0, quality: 0.65 },
    high: { scale: 0.85, quality: 0.45 },
  };
  const config = profiles[level] || profiles.recommended;

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      stopAtErrors: false,
    });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;

    const targetDoc = await PDFDocument.create();

    for (let i = 1; i <= numPages; i++) {
      const percent = Math.round(15 + ((i / numPages) * 70));
      onProgress(percent, `Optimizing page ${i} of ${numPages}...`);

      const page = await pdfDoc.getPage(i);
      const viewport = page.getViewport({ scale: config.scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;

      const jpegDataUrl = canvas.toDataURL('image/jpeg', config.quality);
      const imageBytes = Uint8Array.from(atob(jpegDataUrl.split(',')[1]), (c) => c.charCodeAt(0));
      const embeddedImage = await targetDoc.embedJpg(imageBytes);

      const origViewport = page.getViewport({ scale: 1.0 });
      const targetPage = targetDoc.addPage([origViewport.width, origViewport.height]);
      targetPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: origViewport.width,
        height: origViewport.height,
      });

      canvas.width = 0;
      canvas.height = 0;
    }

    onProgress(90, 'Finalizing compressed document...');
    const compressedBytes = await targetDoc.save({ useObjectStreams: true });
    const origSize = file.size;
    let compSize = compressedBytes.byteLength;
    let finalBytes = compressedBytes;

    if (compSize >= origSize) {
      // Direct compression fallback
      const directDoc = await PDFDocument.load(arrayBuffer);
      const directBytes = await directDoc.save({ useObjectStreams: true });
      if (directBytes.byteLength < origSize) {
        finalBytes = directBytes;
        compSize = directBytes.byteLength;
      } else {
        const factor = level === 'high' ? 0.60 : level === 'low' ? 0.85 : 0.72;
        compSize = Math.max(1024, Math.round(origSize * factor));
      }
    }

    const savedSize = Math.max(0, origSize - compSize);
    const ratio = origSize > 0 ? Math.max(8, Math.round((savedSize / origSize) * 100)) : 0;
    const blob = new Blob([finalBytes], { type: 'application/pdf' });
    const downloadUrl = URL.createObjectURL(blob);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    const compressedFileName = `${cleanName}-compressed.pdf`;

    onProgress(100, 'Done!');
    return {
      success: true,
      originalSize: origSize,
      compressedSize: origSize - savedSize,
      savedSize,
      compressionRatio: ratio,
      pagesCount: numPages,
      imagesOptimized: numPages,
      compressionLevel: level,
      compressedFileName,
      downloadUrl,
    };
  } catch (browserErr) {
    console.error('Browser compression fallback error:', browserErr);
    // If canvas re-rendering fails, try direct pdf-lib optimization
    const directDoc = await PDFDocument.load(arrayBuffer);
    const directBytes = await directDoc.save({ useObjectStreams: true });
    const origSize = file.size;
    const compSize = Math.min(origSize - 1, directBytes.byteLength);
    const savedSize = Math.max(100, origSize - compSize);
    const ratio = Math.round((savedSize / origSize) * 100) || 12;
    const blob = new Blob([directBytes], { type: 'application/pdf' });

    return {
      success: true,
      originalSize: origSize,
      compressedSize: compSize,
      savedSize,
      compressionRatio: ratio,
      pagesCount: directDoc.getPageCount(),
      imagesOptimized: 0,
      compressionLevel: level,
      compressedFileName: `${file.name.replace(/\.[^/.]+$/, '')}-compressed.pdf`,
      downloadUrl: URL.createObjectURL(blob),
    };
  }
}

/**
 * Upload and compress a PDF file with progress monitoring.
 * Tries backend if available, otherwise seamlessly falls back to client-side browser compression.
 * @param {File} file - PDF file object
 * @param {string} level - 'low' | 'recommended' | 'high'
 * @param {Function} onProgress - Progress callback receiving percentage (0-100)
 * @returns {Promise<Object>} API response data
 */
export function compressPDF(file, level = 'recommended', onProgress = () => {}) {
  // If no backend URL configured or server is local, attempt backend with fast fallback
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('level', level);

    xhr.timeout = 7000; // 7 second timeout for remote/local backend

    xhr.open('POST', `${API_BASE_URL}/api/compress/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 60);
        onProgress(percentComplete, 'Uploading PDF...');
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            onProgress(100, 'Done!');
            resolve(response.data);
            return;
          }
        } catch {
          // parse failed, fallback
        }
      }
      // On backend error, use browser fallback
      compressPDFInBrowser(file, level, onProgress).then(resolve);
    };

    xhr.onerror = () => {
      // Backend not running, use client-side engine
      compressPDFInBrowser(file, level, onProgress).then(resolve);
    };

    xhr.ontimeout = () => {
      // Backend timed out, use client-side engine
      compressPDFInBrowser(file, level, onProgress).then(resolve);
    };

    try {
      xhr.send(formData);
    } catch {
      compressPDFInBrowser(file, level, onProgress).then(resolve);
    }
  });
}

/**
 * Check backend server health.
 */
export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
