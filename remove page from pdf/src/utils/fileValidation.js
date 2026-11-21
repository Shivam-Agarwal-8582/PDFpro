/**
 * Validates an uploaded file to ensure it's a valid PDF and within size constraints.
 */

export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB

export function validatePdfFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file selected. Please select a PDF file to upload.' };
  }

  // Check file type
  const isPdfMime = file.type === 'application/pdf';
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');

  if (!isPdfMime && !isPdfExtension) {
    return {
      isValid: false,
      error: `Invalid file format: "${file.name}". Please upload a valid PDF document (.pdf).`,
    };
  }

  // Check file size
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The uploaded file is empty (0 bytes). Please choose a valid PDF file.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File is too large (${formatFileSize(file.size)}). Maximum supported size for browser processing is 100 MB.`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Format bytes to human readable string (KB, MB)
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return 'Unknown size';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
