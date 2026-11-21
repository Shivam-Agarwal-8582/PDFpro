/**
 * Parses page range string (e.g., "2-5", "1,3,6", "2-4,7,9-11")
 * against a total page count.
 */

export function parsePageRange(input, totalPages) {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      pages: [],
      error: 'Please enter page numbers or ranges (e.g. 1-3, 5, 8).',
    };
  }

  const cleanInput = input.trim();
  // Check for invalid characters (only digits, hyphens, commas, spaces allowed)
  if (!/^[\d\s,-]+$/.test(cleanInput)) {
    return {
      isValid: false,
      pages: [],
      error: 'Invalid format. Use numbers, commas, and hyphens only (e.g. 2-5, 8).',
    };
  }

  const parts = cleanInput.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    return {
      isValid: false,
      pages: [],
      error: 'Please enter a valid page selection.',
    };
  }

  const pageSet = new Set();

  for (const part of parts) {
    if (part.includes('-')) {
      const rangeParts = part.split('-').map((s) => s.trim());
      if (rangeParts.length !== 2) {
        return {
          isValid: false,
          pages: [],
          error: `Invalid range format: "${part}". Example of valid range: 2-5`,
        };
      }

      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);

      if (isNaN(start) || isNaN(end)) {
        return {
          isValid: false,
          pages: [],
          error: `Invalid numbers in range: "${part}".`,
        };
      }

      if (start < 1) {
        return {
          isValid: false,
          pages: [],
          error: `Page number ${start} is out of range. Page numbers start from 1.`,
        };
      }

      if (end > totalPages) {
        return {
          isValid: false,
          pages: [],
          error: `Page ${end} exceeds total pages (${totalPages}).`,
        };
      }

      const min = Math.min(start, end);
      const max = Math.max(start, end);

      for (let p = min; p <= max; p++) {
        pageSet.add(p);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        return {
          isValid: false,
          pages: [],
          error: `Invalid page number: "${part}".`,
        };
      }

      if (page < 1) {
        return {
          isValid: false,
          pages: [],
          error: `Page ${page} is out of range. Page numbers start from 1.`,
        };
      }

      if (page > totalPages) {
        return {
          isValid: false,
          pages: [],
          error: `Page ${page} exceeds document total of ${totalPages} pages.`,
        };
      }

      pageSet.add(page);
    }
  }

  const sortedPages = Array.from(pageSet).sort((a, b) => a - b);

  return {
    isValid: true,
    pages: sortedPages,
    error: null,
  };
}

/**
 * Format an array of page numbers into a clean range string.
 * Example: [1, 2, 3, 5, 7, 8] -> "1-3, 5, 7-8"
 */
export function formatPagesToRange(pageNumbers) {
  if (!pageNumbers || pageNumbers.length === 0) return '';
  const sorted = Array.from(new Set(pageNumbers)).sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let prev = start;

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = curr;
      prev = curr;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(', ');
}
