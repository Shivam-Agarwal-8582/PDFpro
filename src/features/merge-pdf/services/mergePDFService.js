import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Setup PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

/**
 * Inspect PDF to get metadata: total pages, title, and check password encryption
 */
export async function getPDFMetadata(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Check with pdf-lib
    let pdfDoc;
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    } catch (loadErr) {
      const errMsg = loadErr.message || '';
      if (errMsg.toLowerCase().includes('password') || errMsg.toLowerCase().includes('encrypted')) {
        throw new Error(`"${file.name}" is password-protected or encrypted. Please decrypt it first.`);
      }
      throw new Error(`Failed to read "${file.name}". File may be damaged or invalid.`);
    }

    const pageCount = pdfDoc.getPageCount();
    if (pageCount === 0) {
      throw new Error(`"${file.name}" contains no readable pages.`);
    }

    return {
      pageCount,
      title: pdfDoc.getTitle() || file.name,
      arrayBuffer
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Render the first page of a PDF as a thumbnail data URL
 */
export async function generatePDFThumbnail(file, pageNumber = 1) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      stopAtErrors: false
    });

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(Math.min(pageNumber, pdf.numPages));
    
    // Target thumbnail width around 180-240px
    const initialViewport = page.getViewport({ scale: 1.0 });
    const targetWidth = 200;
    const scale = targetWidth / initialViewport.width;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (err) {
    console.warn(`Could not render thumbnail for ${file.name}:`, err.message);
    return null;
  }
}

/**
 * Merge multiple PDFs using pdf-lib
 * 
 * @param {Array<{ file: File, pageRange: string, pageIndices?: number[] }>} filesWithConfig
 * @param {Function} onProgress
 * @returns {Promise<{ blob: Blob, totalPages: number, fileCount: number }>}
 */
export async function mergePDFs(filesWithConfig, onProgress = () => {}) {
  if (!filesWithConfig || filesWithConfig.length < 2) {
    throw new Error('At least two valid PDF files are required to merge.');
  }

  const mergedDoc = await PDFDocument.create();
  const totalFiles = filesWithConfig.length;

  for (let i = 0; i < totalFiles; i++) {
    const item = filesWithConfig[i];
    onProgress({
      current: i + 1,
      total: totalFiles,
      step: `Reading and processing document ${i + 1} of ${totalFiles}: "${item.file.name}"...`,
      percent: Math.round(((i) / totalFiles) * 80)
    });

    // Load source document
    const buffer = await item.file.arrayBuffer();
    let sourceDoc;
    try {
      sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    } catch (err) {
      if (err.message?.toLowerCase().includes('encrypted') || err.message?.toLowerCase().includes('password')) {
        throw new Error(`File "${item.file.name}" is password protected and cannot be merged.`);
      }
      throw new Error(`Failed to load "${item.file.name}". ${err.message}`);
    }

    const totalDocPages = sourceDoc.getPageCount();
    let indicesToCopy = item.pageIndices;

    // Default to all pages if no specific indices provided
    if (!indicesToCopy || indicesToCopy.length === 0) {
      indicesToCopy = Array.from({ length: totalDocPages }, (_, idx) => idx);
    }

    // Filter to valid bounds
    const safeIndices = indicesToCopy.filter(idx => idx >= 0 && idx < totalDocPages);

    if (safeIndices.length === 0) {
      throw new Error(`No valid pages selected from "${item.file.name}".`);
    }

    // Copy pages into merged document preserving original dimensions and orientation
    const copiedPages = await mergedDoc.copyPages(sourceDoc, safeIndices);
    copiedPages.forEach((page) => {
      mergedDoc.addPage(page);
    });
  }

  onProgress({
    current: totalFiles,
    total: totalFiles,
    step: 'Generating final merged PDF document...',
    percent: 90
  });

  const mergedBytes = await mergedDoc.save();
  const finalPageCount = mergedDoc.getPageCount();

  onProgress({
    current: totalFiles,
    total: totalFiles,
    step: 'Ready for download!',
    percent: 100
  });

  const blob = new Blob([mergedBytes], { type: 'application/pdf' });

  return {
    blob,
    totalPages: finalPageCount,
    fileCount: totalFiles
  };
}
