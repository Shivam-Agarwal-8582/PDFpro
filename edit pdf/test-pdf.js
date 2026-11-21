import { createSamplePdf } from './src/utils/samplePdf.js';
import { exportModifiedPdf } from './src/services/exportService.js';
import { PDFDocument } from 'pdf-lib';

async function runTests() {
  console.log('--- Starting PDFPro End-to-End Verification Tests ---');

  // Test 1: Sample PDF creation
  console.log('1. Testing createSamplePdf()...');
  const sample = await createSamplePdf();
  if (!sample.data || sample.size <= 0) {
    throw new Error('createSamplePdf failed to produce bytes');
  }
  console.log(`✓ Sample PDF generated successfully (${sample.size} bytes).`);

  // Verify sample PDF can be parsed by pdf-lib
  const sampleDoc = await PDFDocument.load(sample.data);
  const samplePageCount = sampleDoc.getPageCount();
  console.log(`✓ Sample PDF verified with ${samplePageCount} pages.`);
  if (samplePageCount !== 2) {
    throw new Error(`Expected 2 pages in sample PDF, got ${samplePageCount}`);
  }

  // Test 2: Modify PDF with annotations and page operations
  console.log('2. Testing exportModifiedPdf with full annotations...');

  // Mock a 1x1 transparent PNG dataUrl for image test
  const testPngDataUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  const testPages = [
    {
      id: 'page_1',
      originalIndex: 0,
      rotation: 90, // Test rotation
      isBlank: false,
      width: 595.28,
      height: 841.89,
    },
    {
      id: 'page_blank',
      originalIndex: null,
      rotation: 0,
      isBlank: true, // Test blank page insertion
      width: 595.28,
      height: 841.89,
    },
    {
      id: 'page_dup',
      originalIndex: 0,
      rotation: 0,
      isBlank: false, // Test duplication of original page 1
      width: 595.28,
      height: 841.89,
    },
  ];

  const testAnnotations = {
    page_1: [
      {
        id: 'ann_text_1',
        type: 'text',
        x: 50,
        y: 100,
        text: 'PDFPro Automated Test Note\nLine 2 of text annotation',
        fontFamily: 'Helvetica',
        fontSize: 16,
        isBold: true,
        isItalic: false,
        color: '#2563eb',
        backgroundColor: '#ffffff',
        align: 'left',
        width: 250,
      },
      {
        id: 'ann_whiteout_1',
        type: 'whiteout',
        x: 100,
        y: 200,
        width: 200,
        height: 30,
        fillColor: '#ffffff',
        replacementText: 'Replacement Text Approved',
        color: '#16a34a',
        fontSize: 14,
      },
      {
        id: 'ann_highlight_1',
        type: 'highlight',
        x: 50,
        y: 300,
        width: 300,
        height: 25,
        color: '#facc15',
        opacity: 0.4,
      },
      {
        id: 'ann_drawing_1',
        type: 'drawing',
        points: [
          { x: 50, y: 400 },
          { x: 100, y: 420 },
          { x: 150, y: 400 },
          { x: 200, y: 430 },
        ],
        color: '#dc2626',
        strokeWidth: 3,
        opacity: 1.0,
      },
      {
        id: 'ann_image_1',
        type: 'image',
        x: 100,
        y: 500,
        width: 80,
        height: 80,
        dataUrl: testPngDataUrl,
        opacity: 0.9,
      },
    ],
    page_blank: [
      {
        id: 'ann_blank_text',
        type: 'text',
        x: 100,
        y: 100,
        text: 'Text on Blank Page',
        fontFamily: 'TimesRoman',
        fontSize: 20,
        color: '#111827',
      },
    ],
    page_dup: [],
  };

  const modifiedBytes = await exportModifiedPdf({
    originalPdfBytes: sample.data,
    pages: testPages,
    annotations: testAnnotations,
  });

  if (!modifiedBytes || modifiedBytes.byteLength <= 0) {
    throw new Error('exportModifiedPdf failed to produce bytes');
  }

  console.log(`✓ Exported modified PDF successfully (${modifiedBytes.byteLength} bytes).`);

  // Verify exported PDF structure with pdf-lib
  const exportedDoc = await PDFDocument.load(modifiedBytes);
  const exportedPageCount = exportedDoc.getPageCount();
  console.log(`✓ Exported document verified with ${exportedPageCount} pages.`);

  if (exportedPageCount !== 3) {
    throw new Error(`Expected 3 pages in exported PDF, got ${exportedPageCount}`);
  }

  // Verify page 1 rotation
  const exportedPage1 = exportedDoc.getPage(0);
  const page1Rotation = exportedPage1.getRotation().angle;
  console.log(`✓ Page 1 rotation verified: ${page1Rotation}° (expected 90°).`);
  if (page1Rotation !== 90) {
    throw new Error(`Expected page 1 rotation to be 90°, got ${page1Rotation}°`);
  }

  console.log('--- ALL TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
