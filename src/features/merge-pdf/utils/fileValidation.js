/**
 * PDFPro - File Validation and Utility Functions
 */

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB per file

/**
 * Format bytes to readable string (e.g. 2.4 MB)
 */
export function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Validate PDF file format and size
 */
export async function validatePDFFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  // Check file extension and mime type
  const isPDFMime = file.type === 'application/pdf';
  const isPDFExt = file.name.toLowerCase().endsWith('.pdf');

  if (!isPDFMime && !isPDFExt) {
    return {
      isValid: false,
      error: `"${file.name}" is not a valid PDF file. Only .pdf files are supported.`,
    };
  }

  // Check file size
  if (file.size === 0) {
    return {
      isValid: false,
      error: `"${file.name}" is an empty file (0 bytes).`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `"${file.name}" exceeds the maximum 50MB file size limit.`,
    };
  }

  // Inspect the first few bytes for the %PDF- magic header
  try {
    const slice = file.slice(0, 10);
    const buffer = await slice.arrayBuffer();
    const header = new TextDecoder('ascii').decode(buffer);
    if (!header.startsWith('%PDF-')) {
      return {
        isValid: false,
        error: `"${file.name}" does not appear to be a valid or uncorrupted PDF document.`,
      };
    }
  } catch (err) {
    return {
      isValid: false,
      error: `Could not read "${file.name}". File may be corrupted.`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Parse and validate page ranges string (e.g. "1-3, 5, 7-9")
 * Returns 0-based page indices
 */
export function parsePageRange(rangeStr, totalPages) {
  if (!rangeStr || rangeStr.trim() === '' || rangeStr.trim().toLowerCase() === 'all') {
    return {
      isValid: true,
      pageIndices: Array.from({ length: totalPages }, (_, i) => i),
      summary: `All (${totalPages} pages)`
    };
  }

  const clean = rangeStr.replace(/\s+/g, '');
  const parts = clean.split(',');
  const indicesSet = new Set();

  for (const part of parts) {
    if (!part) continue;

    // Check for range (e.g. "1-3")
    if (part.includes('-')) {
      const bounds = part.split('-');
      if (bounds.length !== 2) {
        return { isValid: false, error: `Invalid range format: "${part}"` };
      }
      const start = parseInt(bounds[0], 10);
      const end = parseInt(bounds[1], 10);

      if (isNaN(start) || isNaN(end)) {
        return { isValid: false, error: `Invalid numbers in range: "${part}"` };
      }
      if (start < 1) {
        return { isValid: false, error: `Page numbers must start from 1: "${part}"` };
      }
      if (end > totalPages) {
        return { isValid: false, error: `Page ${end} exceeds total pages (${totalPages}) in range "${part}"` };
      }
      if (start > end) {
        return { isValid: false, error: `Start page cannot be greater than end page: "${part}"` };
      }

      for (let p = start; p <= end; p++) {
        indicesSet.add(p - 1);
      }
    } else {
      // Single page number
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum)) {
        return { isValid: false, error: `Invalid page number: "${part}"` };
      }
      if (pageNum < 1) {
        return { isValid: false, error: `Page numbers must start from 1` };
      }
      if (pageNum > totalPages) {
        return { isValid: false, error: `Page ${pageNum} exceeds total pages (${totalPages})` };
      }
      indicesSet.add(pageNum - 1);
    }
  }

  const sortedIndices = Array.from(indicesSet).sort((a, b) => a - b);

  if (sortedIndices.length === 0) {
    return { isValid: false, error: 'No valid pages selected.' };
  }

  return {
    isValid: true,
    pageIndices: sortedIndices,
    summary: `${sortedIndices.length} of ${totalPages} pages`
  };
}
