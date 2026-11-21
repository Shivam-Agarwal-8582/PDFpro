import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker source to the static file in public directory
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Load a PDF document from an ArrayBuffer
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<pdfjsLib.PDFDocumentProxy>}
 */
export async function loadPdfDocument(arrayBuffer) {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer.slice(0),
    });
    return await loadingTask.promise;
  } catch (error) {
    console.error('Error loading PDF document:', error);
    throw new Error('Failed to load PDF file. Please ensure it is a valid, uncorrupted PDF document.');
  }
}

/**
 * Get basic page dimensions at 72 DPI
 * @param {pdfjsLib.PDFDocumentProxy} pdfDoc
 * @param {number} pageNumber (1-based)
 */
export async function getPageDimensions(pdfDoc, pageNumber) {
  try {
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.0 });
    return {
      width: viewport.width,
      height: viewport.height,
    };
  } catch (error) {
    console.error(`Error getting dimensions for page ${pageNumber}:`, error);
    return { width: 595.28, height: 841.89 }; // Fallback A4
  }
}

/**
 * Render a PDF page onto an HTML canvas with crisp high-DPI scaling
 * @param {pdfjsLib.PDFDocumentProxy} pdfDoc
 * @param {number} pageNumber (1-based)
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale (zoom level, e.g. 1.0, 1.5)
 * @param {number} extraRotation (0, 90, 180, 270)
 * @returns {Promise<{ width: number, height: number }>}
 */
export async function renderPageToCanvas(pdfDoc, pageNumber, canvas, scale = 1.0, extraRotation = 0) {
  if (!pdfDoc || !canvas) return null;

  try {
    const page = await pdfDoc.getPage(pageNumber);
    const baseRotation = page.rotate || 0;
    const totalRotation = (baseRotation + extraRotation) % 360;

    const viewport = page.getViewport({ scale, rotation: totalRotation });
    const pixelRatio = window.devicePixelRatio || 1;

    // Set canvas dimensions according to pixel ratio for sharp rendering
    canvas.width = Math.floor(viewport.width * pixelRatio);
    canvas.height = Math.floor(viewport.height * pixelRatio);

    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    return {
      width: viewport.width,
      height: viewport.height,
      originalWidth: viewport.width / scale,
      originalHeight: viewport.height / scale,
    };
  } catch (error) {
    if (error?.name === 'RenderingCancelledException') {
      return null;
    }
    console.error(`Error rendering page ${pageNumber}:`, error);
    throw error;
  }
}

/**
 * Render a fast thumbnail of a PDF page onto a thumbnail canvas
 * @param {pdfjsLib.PDFDocumentProxy} pdfDoc
 * @param {number} pageNumber (1-based)
 * @param {HTMLCanvasElement} canvas
 * @param {number} maxWidth
 * @param {number} extraRotation
 */
export async function renderThumbnail(pdfDoc, pageNumber, canvas, maxWidth = 160, extraRotation = 0) {
  if (!pdfDoc || !canvas) return;

  try {
    const page = await pdfDoc.getPage(pageNumber);
    const baseRotation = page.rotate || 0;
    const totalRotation = (baseRotation + extraRotation) % 360;

    const unscaledViewport = page.getViewport({ scale: 1.0, rotation: totalRotation });
    const scale = maxWidth / unscaledViewport.width;
    const viewport = page.getViewport({ scale, rotation: totalRotation });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;
  } catch (error) {
    console.error(`Error rendering thumbnail for page ${pageNumber}:`, error);
  }
}

/**
 * Extract text content items and text bounds from a page
 * @param {pdfjsLib.PDFDocumentProxy} pdfDoc
 * @param {number} pageNumber
 */
export async function extractPageText(pdfDoc, pageNumber) {
  try {
    const page = await pdfDoc.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });

    const items = textContent.items.map(item => {
      // transform: [scaleX, skewY, skewX, scaleY, tx, ty]
      const tx = item.transform[4];
      const ty = item.transform[5];
      // Convert to top-left origin
      const y = viewport.height - ty;
      return {
        str: item.str,
        dir: item.dir,
        width: item.width,
        height: item.height,
        x: tx,
        y: y - item.height,
      };
    });

    return {
      items,
      fullText: items.map(i => i.str).join(' '),
    };
  } catch (error) {
    console.error(`Error extracting text from page ${pageNumber}:`, error);
    return { items: [], fullText: '' };
  }
}
