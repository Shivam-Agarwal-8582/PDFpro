import { PDFDocument } from 'pdf-lib';

/**
 * Service to remove specified pages from a PDF document using pdf-lib.
 * 
 * @param {ArrayBuffer|Uint8Array} pdfBytes - Raw PDF binary data
 * @param {number[]} pagesToRemove - Array of 1-based page numbers to remove
 * @returns {Promise<{
 *   modifiedBytes: Uint8Array,
 *   originalCount: number,
 *   removedCount: number,
 *   remainingCount: number,
 *   remainingPageNumbers: number[]
 * }>}
 */
export async function removePagesFromPdf(pdfBytes, pagesToRemove) {
  if (!pdfBytes) {
    throw new Error('No PDF file data provided.');
  }

  if (!pagesToRemove || pagesToRemove.length === 0) {
    throw new Error('No pages selected for removal. Please select at least one page.');
  }

  let srcDoc;
  try {
    srcDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
  } catch (err) {
    if (err.message && (err.message.toLowerCase().includes('password') || err.message.toLowerCase().includes('encrypted'))) {
      throw new Error('This PDF is password-protected or encrypted. Please remove password protection before modifying pages.');
    }
    throw new Error(`Failed to read the PDF document: ${err.message || 'Corrupted or unreadable format.'}`);
  }

  const originalCount = srcDoc.getPageCount();

  if (originalCount === 0) {
    throw new Error('The PDF document contains no pages.');
  }

  // Convert 1-based pagesToRemove into unique set
  const removeSet = new Set(pagesToRemove.map((p) => Number(p)));

  // Validate that not all pages are marked for removal
  if (removeSet.size >= originalCount) {
    throw new Error('You cannot delete all pages. A PDF must contain at least one remaining page.');
  }

  // Calculate 0-based indices to keep
  const keepIndices = [];
  const remainingPageNumbers = [];

  for (let i = 0; i < originalCount; i++) {
    const pageNum = i + 1;
    if (!removeSet.has(pageNum)) {
      keepIndices.push(i);
      remainingPageNumbers.push(pageNum);
    }
  }

  if (keepIndices.length === 0) {
    throw new Error('At least one page must remain in the PDF.');
  }

  // Create a brand new PDF document
  const newDoc = await PDFDocument.create();

  // Copy all preserved pages from srcDoc
  // This automatically preserves page dimensions, orientations, annotations, and resources
  const copiedPages = await newDoc.copyPages(srcDoc, keepIndices);
  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  // Save the modified PDF
  const modifiedBytes = await newDoc.save();

  return {
    modifiedBytes,
    originalCount,
    removedCount: originalCount - keepIndices.length,
    remainingCount: keepIndices.length,
    remainingPageNumbers,
  };
}

/**
 * Triggers a download of a PDF binary array in the browser.
 * 
 * @param {Uint8Array} pdfBytes 
 * @param {string} filename 
 */
export function downloadPdf(pdfBytes, filename = 'edited-document.pdf') {
  let cleanName = filename.trim();
  if (!cleanName.toLowerCase().endsWith('.pdf')) {
    cleanName += '.pdf';
  }

  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cleanName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release object URL after a short timeout
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}
