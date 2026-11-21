import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Creates a clean 2-page sample PDF for users to quickly test PDFPro
 * without needing an existing PDF on their device.
 */
export async function createSamplePdf() {
  const pdfDoc = await PDFDocument.create();
  const fontHelvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontHelveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // --- Page 1: Welcome & Overview ---
  const page1 = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points
  const { width: p1Width, height: p1Height } = page1.getSize();

  // Header Banner
  page1.drawRectangle({
    x: 40,
    y: p1Height - 110,
    width: p1Width - 80,
    height: 70,
    color: rgb(0.93, 0.96, 1.0), // Light blue
  });

  page1.drawText('PDFPro Sample Document', {
    x: 60,
    y: p1Height - 75,
    size: 24,
    font: fontHelveticaBold,
    color: rgb(0.12, 0.35, 0.85),
  });

  page1.drawText('Test editing, highlighting, drawing, whiteout, and page management.', {
    x: 60,
    y: p1Height - 95,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.28, 0.35, 0.45),
  });

  // Section 1: Introduction
  page1.drawText('1. Welcome to PDFPro', {
    x: 40,
    y: p1Height - 150,
    size: 16,
    font: fontHelveticaBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  const introText = [
    'PDFPro is a modern, light-themed, 100% client-side PDF editor.',
    'Your files are processed directly within your browser and are never uploaded to any server.',
    'Try out the various editing features directly on this sample document:'
  ];

  let currentY = p1Height - 175;
  introText.forEach(line => {
    page1.drawText(line, {
      x: 40,
      y: currentY,
      size: 11,
      font: fontHelvetica,
      color: rgb(0.25, 0.3, 0.38),
    });
    currentY -= 18;
  });

  // Feature Checklist Box
  currentY -= 15;
  page1.drawRectangle({
    x: 40,
    y: currentY - 140,
    width: p1Width - 80,
    height: 140,
    color: rgb(0.98, 0.98, 0.99),
    borderColor: rgb(0.85, 0.88, 0.92),
    borderWidth: 1,
  });

  page1.drawText('Interactive Testing Guide:', {
    x: 55,
    y: currentY - 25,
    size: 13,
    font: fontHelveticaBold,
    color: rgb(0.15, 0.2, 0.3),
  });

  const instructions = [
    '[ ] Add Text: Click "Add Text" in the top bar, then click anywhere on this page to insert notes.',
    '[ ] Edit / Whiteout: Use "Whiteout" to hide old text and write replacement text on top.',
    '[ ] Highlight: Select "Highlight" and draw over this section to mark key points.',
    '[ ] Draw: Use the freehand Pen tool to sketch notes, circles, or diagrams.',
    '[ ] Add Images: Upload a JPG/PNG logo or screenshot to place anywhere on the page.'
  ];

  let instY = currentY - 48;
  instructions.forEach(inst => {
    page1.drawText(inst, {
      x: 55,
      y: instY,
      size: 10,
      font: fontHelvetica,
      color: rgb(0.3, 0.35, 0.45),
    });
    instY -= 20;
  });

  // Sample Data Section
  currentY -= 180;
  page1.drawText('2. Sample Report Data (Try Erasing & Replacing)', {
    x: 40,
    y: currentY,
    size: 14,
    font: fontHelveticaBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  currentY -= 25;
  page1.drawText('Department: Customer Success & Operations', {
    x: 40,
    y: currentY,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.2, 0.25, 0.35),
  });

  currentY -= 20;
  page1.drawText('Status: Pending Review (Try using Whiteout to change this to Approved!)', {
    x: 40,
    y: currentY,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.2, 0.25, 0.35),
  });

  // Footer for page 1
  page1.drawText('PDFPro Client-Side Editor - Page 1 of 2', {
    x: p1Width / 2 - 90,
    y: 35,
    size: 9,
    font: fontHelvetica,
    color: rgb(0.55, 0.6, 0.68),
  });

  // --- Page 2: Page Management & Export ---
  const page2 = pdfDoc.addPage([595.28, 841.89]);
  const { width: p2Width, height: p2Height } = page2.getSize();

  page2.drawText('3. Page Management Features', {
    x: 40,
    y: p2Height - 60,
    size: 18,
    font: fontHelveticaBold,
    color: rgb(0.1, 0.15, 0.25),
  });

  page2.drawText('Use the Left Sidebar to manage document pages:', {
    x: 40,
    y: p2Height - 85,
    size: 11,
    font: fontHelvetica,
    color: rgb(0.3, 0.35, 0.45),
  });

  const pageMgmtPoints = [
    '• Rotate Pages: Rotate individual pages 90 degrees clockwise or counter-clockwise.',
    '• Reorder Pages: Move pages up or down to rearrange document sequence.',
    '• Duplicate Page: Clone any page with one click.',
    '• Add Blank Page: Insert an empty canvas page anywhere in your PDF.',
    '• Delete Page: Remove unwanted pages (with confirmation safeguard).'
  ];

  let p2Y = p2Height - 120;
  pageMgmtPoints.forEach(pt => {
    page2.drawText(pt, {
      x: 50,
      y: p2Y,
      size: 11,
      font: fontHelvetica,
      color: rgb(0.25, 0.3, 0.4),
    });
    p2Y -= 24;
  });

  p2Y -= 20;
  page2.drawRectangle({
    x: 40,
    y: p2Y - 100,
    width: p2Width - 80,
    height: 100,
    color: rgb(0.95, 0.98, 0.95), // Light green
    borderColor: rgb(0.7, 0.85, 0.7),
    borderWidth: 1,
  });

  page2.drawText('Downloading Your Modified PDF', {
    x: 60,
    y: p2Y - 30,
    size: 13,
    font: fontHelveticaBold,
    color: rgb(0.1, 0.45, 0.2),
  });

  page2.drawText('When you are ready, click "Download PDF" in the top-right corner.', {
    x: 60,
    y: p2Y - 55,
    size: 10.5,
    font: fontHelvetica,
    color: rgb(0.15, 0.35, 0.2),
  });

  page2.drawText('PDFPro merges all your changes, annotations, and page modifications into a real PDF.', {
    x: 60,
    y: p2Y - 75,
    size: 10.5,
    font: fontHelvetica,
    color: rgb(0.15, 0.35, 0.2),
  });

  // Footer for page 2
  page2.drawText('PDFPro Client-Side Editor - Page 2 of 2', {
    x: p2Width / 2 - 90,
    y: 35,
    size: 9,
    font: fontHelvetica,
    color: rgb(0.55, 0.6, 0.68),
  });

  const pdfBytes = await pdfDoc.save();
  return {
    name: 'PDFPro-Sample-Document.pdf',
    size: pdfBytes.byteLength,
    data: pdfBytes.buffer,
  };
}
