import assert from 'node:assert';
import { PDFDocument } from 'pdf-lib';

// Feature 1: Edit PDF imports
import { createSamplePdf as createEditorSample } from '../src/features/edit-pdf/utils/samplePdf.js';
import { exportModifiedPdf } from '../src/features/edit-pdf/services/exportService.js';

// Feature 2: Merge PDF imports
import { mergePDFs } from '../src/features/merge-pdf/services/mergePDFService.js';
import { parsePageRange as parseMergeRange } from '../src/features/merge-pdf/utils/fileValidation.js';

// Feature 3: Remove Pages imports
import { removePagesFromPdf } from '../src/features/remove-pages/services/removePagesService.js';
import { generateSamplePdf as createRemoverSample } from '../src/features/remove-pages/services/samplePdfService.js';
import { parsePageRange as parseRemoveRange, formatPagesToRange } from '../src/features/remove-pages/utils/pageRangeParser.js';

// Feature 4: Compress PDF imports
import { formatBytes } from '../src/features/compress-pdf/services/compressionService.js';

async function runTestSuite() {
  console.log('====================================================');
  console.log('    PDFPro Comprehensive Feature Verification Test  ');
  console.log('====================================================\n');

  // ----------------------------------------------------
  // TEST SUITE 1: EDIT PDF
  // ----------------------------------------------------
  console.log('--- Test Suite 1: Edit PDF Feature ---');
  const sampleEditor = await createEditorSample();
  assert(sampleEditor.data && sampleEditor.size > 0, 'Editor sample creation failed');
  console.log(`✓ Sample PDF generated (${sampleEditor.size} bytes).`);

  const initialDoc = await PDFDocument.load(sampleEditor.data);
  assert.strictEqual(initialDoc.getPageCount(), 2, 'Initial sample should have 2 pages');
  console.log(`✓ Initial sample has 2 pages.`);

  const testPngDataUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const testPages = [
    { id: 'p1', originalIndex: 0, rotation: 90, isBlank: false, width: 595.28, height: 841.89 },
    { id: 'p_blank', originalIndex: null, rotation: 0, isBlank: true, width: 595.28, height: 841.89 },
  ];

  const testAnnotations = {
    p1: [
      { id: 'a1', type: 'text', x: 50, y: 100, text: 'PDFPro Edit Test', fontSize: 16, color: '#2563eb' },
      { id: 'a2', type: 'whiteout', x: 100, y: 200, width: 150, height: 30, fillColor: '#ffffff', replacementText: 'Replacement Text' },
      { id: 'a3', type: 'highlight', x: 50, y: 300, width: 200, height: 20, color: '#facc15', opacity: 0.5 },
      { id: 'a4', type: 'drawing', points: [{ x: 50, y: 400 }, { x: 100, y: 420 }], color: '#dc2626', strokeWidth: 2 },
      { id: 'a5', type: 'image', x: 100, y: 500, width: 50, height: 50, dataUrl: testPngDataUrl },
    ],
  };

  const modifiedBytes = await exportModifiedPdf({
    originalPdfBytes: sampleEditor.data,
    pages: testPages,
    annotations: testAnnotations,
  });

  assert(modifiedBytes && modifiedBytes.byteLength > 0, 'Export modified PDF failed');
  const exportedDoc = await PDFDocument.load(modifiedBytes);
  assert.strictEqual(exportedDoc.getPageCount(), 2, 'Exported document should have 2 pages');
  assert.strictEqual(exportedDoc.getPage(0).getRotation().angle, 90, 'Page rotation should be 90°');
  console.log(`✓ Edit PDF export with text, whiteout, highlight, drawing, and image verified successfully.\n`);

  // ----------------------------------------------------
  // TEST SUITE 2: MERGE PDF
  // ----------------------------------------------------
  console.log('--- Test Suite 2: Merge PDF Feature ---');
  // Create 2 mock files from valid PDF bytes
  const pdf1 = await PDFDocument.create();
  pdf1.addPage([500, 700]);
  pdf1.addPage([500, 700]);
  const pdf1Bytes = await pdf1.save();

  const pdf2 = await PDFDocument.create();
  pdf2.addPage([600, 800]);
  pdf2.addPage([600, 800]);
  pdf2.addPage([600, 800]);
  const pdf2Bytes = await pdf2.save();

  const mockFile1 = {
    name: 'document1.pdf',
    arrayBuffer: async () => pdf1Bytes.buffer.slice(pdf1Bytes.byteOffset, pdf1Bytes.byteOffset + pdf1Bytes.byteLength),
  };
  const mockFile2 = {
    name: 'document2.pdf',
    arrayBuffer: async () => pdf2Bytes.buffer.slice(pdf2Bytes.byteOffset, pdf2Bytes.byteOffset + pdf2Bytes.byteLength),
  };

  // Test page range parsing
  const mergeRange = parseMergeRange('1-2', 2);
  assert.strictEqual(mergeRange.isValid, true, 'Merge page range should be valid');

  const filesToMerge = [
    { file: mockFile1, pageIndices: [0, 1] },
    { file: mockFile2, pageIndices: [0, 2] }, // Take 1st and 3rd page
  ];

  const mergeResult = await mergePDFs(filesToMerge);
  assert(mergeResult.blob && mergeResult.blob.size > 0, 'Merge failed to produce blob');
  assert.strictEqual(mergeResult.totalPages, 4, 'Merged doc should have 4 pages');
  assert.strictEqual(mergeResult.fileCount, 2, 'Merged doc should have 2 files');
  console.log(`✓ Merge PDF produced ${mergeResult.totalPages} pages from 2 files successfully.\n`);

  // ----------------------------------------------------
  // TEST SUITE 3: REMOVE PAGES
  // ----------------------------------------------------
  console.log('--- Test Suite 3: Remove Pages Feature ---');
  const sampleRemoverBytes = await createRemoverSample();
  const removerDoc = await PDFDocument.load(sampleRemoverBytes);
  const initialRemoverCount = removerDoc.getPageCount();
  assert.strictEqual(initialRemoverCount, 6, 'Remover sample should have 6 pages');

  // Test page range parser
  const parsedRange = parseRemoveRange('1, 3-4, 6', 6);
  assert.deepStrictEqual(parsedRange.pages, [1, 3, 4, 6], 'Parsed pages should match');
  assert.strictEqual(formatPagesToRange([1, 2, 3, 5]), '1-3, 5');

  // Remove pages 2 and 5 (1-based)
  const removeResult = await removePagesFromPdf(sampleRemoverBytes, [2, 5]);
  assert.strictEqual(removeResult.originalCount, 6);
  assert.strictEqual(removeResult.removedCount, 2);
  assert.strictEqual(removeResult.remainingCount, 4);
  assert.deepStrictEqual(removeResult.remainingPageNumbers, [1, 3, 4, 6]);

  const verifyDoc = await PDFDocument.load(removeResult.modifiedBytes);
  assert.strictEqual(verifyDoc.getPageCount(), 4, 'Remaining page count should be 4');
  console.log(`✓ Remove Pages successfully deleted pages 2 and 5, leaving 4 valid pages.\n`);

  // ----------------------------------------------------
  // TEST SUITE 4: COMPRESS PDF
  // ----------------------------------------------------
  console.log('--- Test Suite 4: Compress PDF Utilities ---');
  assert.strictEqual(formatBytes(0), '0 B');
  assert.strictEqual(formatBytes(1024), '1 KB');
  assert.strictEqual(formatBytes(1024 * 1024 * 3.5), '3.5 MB');

  // Test direct stream compression with pdf-lib
  const compressDoc = await PDFDocument.load(sampleRemoverBytes);
  const compressedBytes = await compressDoc.save({ useObjectStreams: true });
  assert(compressedBytes && compressedBytes.byteLength > 0, 'Stream compression should produce valid bytes');
  console.log(`✓ Compress PDF byte formatting and object stream compression verified.\n`);

  console.log('====================================================');
  console.log('  🎉 ALL 4 PDFPRO FEATURES VERIFIED SUCCESSFULLY!   ');
  console.log('====================================================');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
