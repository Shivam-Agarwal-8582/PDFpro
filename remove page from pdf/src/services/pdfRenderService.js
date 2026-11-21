import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure the worker source
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || '/pdf.worker.min.mjs';
}

/**
 * Loads a PDF document from binary data using PDF.js.
 * 
 * @param {ArrayBuffer|Uint8Array} data 
 * @returns {Promise<pdfjsLib.PDFDocumentProxy>}
 */
export async function loadPdfDocument(data) {
  try {
    // Clone buffer to avoid detached ArrayBuffer issues if transferred
    const buffer = data instanceof Uint8Array ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data.slice(0);
    const loadingTask = pdfjsLib.getDocument({
      data: buffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/',
    });

    const pdfDoc = await loadingTask.promise;
    return pdfDoc;
  } catch (err) {
    if (err.name === 'PasswordException' || err.message?.includes('password')) {
      throw new Error('This PDF is password-protected. Please unlock it before removing pages.');
    }
    if (err.name === 'InvalidPDFException') {
      throw new Error('The file is corrupted or not a valid PDF document.');
    }
    throw new Error(`Failed to parse PDF: ${err.message}`);
  }
}

/**
 * Renders a single PDF page to a base64 image data URL for thumbnail display.
 * 
 * @param {pdfjsLib.PDFDocumentProxy} pdfDoc 
 * @param {number} pageNumber 1-based page number
 * @param {number} targetWidth Desired thumbnail width in px
 * @returns {Promise<string>} Data URL
 */
export async function renderPageThumbnail(pdfDoc, pageNumber, targetWidth = 320) {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0 });
  const scale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: false });

  // Handle high-DPI displays
  const outputScale = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewport.width * outputScale);
  canvas.height = Math.floor(viewport.height * outputScale);
  canvas.style.width = Math.floor(viewport.width) + 'px';
  canvas.style.height = Math.floor(viewport.height) + 'px';

  context.scale(outputScale, outputScale);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
    background: '#ffffff',
  };

  await page.render(renderContext).promise;
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

  // Clean up canvas
  canvas.width = 0;
  canvas.height = 0;

  return dataUrl;
}

/**
 * Renders a page in high resolution for the zoom preview modal.
 * 
 * @param {pdfjsLib.PDFDocumentProxy} pdfDoc 
 * @param {number} pageNumber 
 * @returns {Promise<string>} High-res Data URL
 */
export async function renderHighResPage(pdfDoc, pageNumber) {
  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0 });
  // Scale so width is around 900-1100px
  const scale = Math.min(2.0, 1000 / unscaledViewport.width);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { alpha: false });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport: viewport,
    background: '#ffffff',
  }).promise;

  return canvas.toDataURL('image/jpeg', 0.92);
}
