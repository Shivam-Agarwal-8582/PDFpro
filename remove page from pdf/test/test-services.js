import assert from 'node:assert';
import { validatePdfFile, formatFileSize } from '../src/utils/fileValidation.js';
import { parsePageRange, formatPagesToRange } from '../src/utils/pageRangeParser.js';
import { removePagesFromPdf } from '../src/services/removePagesService.js';
import { generateSamplePdf } from '../src/services/samplePdfService.js';
import { PDFDocument } from 'pdf-lib';

async function runTests() {
  console.log('--- Starting PDFPro Tool Test Suite ---');

  // Test 1: File Validation
  console.log('Test 1: File Validation...');
  const validFile = { name: 'report.pdf', type: 'application/pdf', size: 1024 * 100 };
  assert.strictEqual(validatePdfFile(validFile).isValid, true);

  const nonPdfFile = { name: 'report.docx', type: 'application/msword', size: 1024 * 100 };
  assert.strictEqual(validatePdfFile(nonPdfFile).isValid, false);

  const emptyFile = { name: 'empty.pdf', type: 'application/pdf', size: 0 };
  assert.strictEqual(validatePdfFile(emptyFile).isValid, false);

  const oversizedFile = { name: 'huge.pdf', type: 'application/pdf', size: 150 * 1024 * 1024 };
  assert.strictEqual(validatePdfFile(oversizedFile).isValid, false);

  assert.strictEqual(formatFileSize(1024), '1 KB');
  assert.strictEqual(formatFileSize(1024 * 1024 * 2.5), '2.5 MB');
  console.log('✓ File validation passed.');

  // Test 2: Page Range Parser
  console.log('Test 2: Page Range Parser...');
  const range1 = parsePageRange('2-5', 10);
  assert.deepStrictEqual(range1.pages, [2, 3, 4, 5]);

  const range2 = parsePageRange('1, 3, 6-8, 10', 10);
  assert.deepStrictEqual(range2.pages, [1, 3, 6, 7, 8, 10]);

  const rangeReverse = parsePageRange('5-3', 10);
  assert.deepStrictEqual(rangeReverse.pages, [3, 4, 5]);

  const rangeDuplicates = parsePageRange('2, 2, 2-4', 10);
  assert.deepStrictEqual(rangeDuplicates.pages, [2, 3, 4]);

  const rangeOutOfBounds = parsePageRange('12', 10);
  assert.strictEqual(rangeOutOfBounds.isValid, false);

  const rangeInvalidSyntax = parsePageRange('abc', 10);
  assert.strictEqual(rangeInvalidSyntax.isValid, false);

  const prettyRange = formatPagesToRange([1, 2, 3, 5, 7, 8, 9]);
  assert.strictEqual(prettyRange, '1-3, 5, 7-9');
  console.log('✓ Page range parser passed.');

  // Test 3: Sample PDF Generation
  console.log('Test 3: Sample PDF Generation...');
  const samplePdfBytes = await generateSamplePdf();
  assert(samplePdfBytes instanceof Uint8Array);
  assert(samplePdfBytes.byteLength > 1000);

  const sampleDoc = await PDFDocument.load(samplePdfBytes);
  assert.strictEqual(sampleDoc.getPageCount(), 6);
  console.log('✓ Sample PDF generated with 6 pages.');

  // Test 4: Real Page Removal with pdf-lib
  console.log('Test 4: Page Removal Service...');
  // Remove pages 3 and 5 (which were draft and duplicate in our sample)
  const result = await removePagesFromPdf(samplePdfBytes, [3, 5]);
  assert.strictEqual(result.originalCount, 6);
  assert.strictEqual(result.removedCount, 2);
  assert.strictEqual(result.remainingCount, 4);
  assert.deepStrictEqual(result.remainingPageNumbers, [1, 2, 4, 6]);

  // Load modified PDF to verify it is valid and has 4 pages
  const modifiedDoc = await PDFDocument.load(result.modifiedBytes);
  assert.strictEqual(modifiedDoc.getPageCount(), 4);
  console.log('✓ Removed pages 3 and 5 successfully, 4 pages remain.');

  // Test 5: Prevent Removing All Pages
  console.log('Test 5: Edge Case - Cannot Remove All Pages...');
  let failedAsExpected = false;
  try {
    await removePagesFromPdf(samplePdfBytes, [1, 2, 3, 4, 5, 6]);
  } catch (err) {
    failedAsExpected = true;
    assert(err.message.includes('cannot delete all pages') || err.message.includes('at least one remaining page'));
  }
  assert.strictEqual(failedAsExpected, true);
  console.log('✓ Prevented deleting all pages.');

  // Test 6: Empty removal list error
  console.log('Test 6: Edge Case - No pages selected...');
  failedAsExpected = false;
  try {
    await removePagesFromPdf(samplePdfBytes, []);
  } catch (err) {
    failedAsExpected = true;
    assert(err.message.includes('No pages selected'));
  }
  assert.strictEqual(failedAsExpected, true);
  console.log('✓ Handled empty removal list.');

  console.log('\n========================================');
  console.log('ALL TESTS PASSED SUCCESSFULLY! (6/6)');
  console.log('========================================');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
