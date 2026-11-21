import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Generates a sample 6-page PDF document entirely in the browser using pdf-lib.
 * This gives users an instant demo document without requiring an external file.
 * 
 * @returns {Promise<Uint8Array>}
 */
export async function generateSamplePdf() {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pagesInfo = [
    {
      title: 'Page 1: Project Overview & Executive Summary',
      badge: 'Cover & Intro',
      color: rgb(0.24, 0.35, 0.85),
      bgAccent: rgb(0.94, 0.96, 1.0),
      desc: 'This is the cover page of the sample report. It introduces the project goals, market research, and high-level deliverables.',
      badgeColor: rgb(0.24, 0.35, 0.85),
    },
    {
      title: 'Page 2: Financial Forecasts & Q3 Revenue',
      badge: 'Financials',
      color: rgb(0.1, 0.6, 0.4),
      bgAccent: rgb(0.92, 0.98, 0.95),
      desc: 'Contains detailed revenue projections, gross margins, EBITDA calculations, and operational expense breakdowns for 2026.',
      badgeColor: rgb(0.1, 0.6, 0.4),
    },
    {
      title: 'Page 3: Unwanted Draft Notes (Delete Me!)',
      badge: 'Draft / Outdated',
      color: rgb(0.85, 0.25, 0.25),
      bgAccent: rgb(1.0, 0.94, 0.94),
      desc: 'Notice: This page contains rough scratchpad notes, unfinished meeting minutes, and superseded charts intended for removal.',
      badgeColor: rgb(0.85, 0.25, 0.25),
    },
    {
      title: 'Page 4: Technical Architecture & Security',
      badge: 'System Design',
      color: rgb(0.35, 0.25, 0.75),
      bgAccent: rgb(0.96, 0.94, 1.0),
      desc: 'Describes client-side encryption, WebAssembly modules, zero-server document handling, and browser-native processing.',
      badgeColor: rgb(0.35, 0.25, 0.75),
    },
    {
      title: 'Page 5: Duplicate Appendix Page (Delete Me!)',
      badge: 'Duplicate / Extra',
      color: rgb(0.85, 0.4, 0.15),
      bgAccent: rgb(1.0, 0.96, 0.92),
      desc: 'Notice: This is a duplicate appendix page accidentally included during export. Ideal for testing page deletion.',
      badgeColor: rgb(0.85, 0.4, 0.15),
    },
    {
      title: 'Page 6: Final Recommendations & Sign-off',
      badge: 'Conclusion',
      color: rgb(0.15, 0.45, 0.75),
      bgAccent: rgb(0.93, 0.97, 1.0),
      desc: 'Summary of approvals, executive signatures, milestone timeline, and next steps for rollout in late 2026.',
      badgeColor: rgb(0.15, 0.45, 0.75),
    },
  ];

  for (let i = 0; i < pagesInfo.length; i++) {
    const info = pagesInfo[i];
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
    const { width, height } = page.getSize();

    // Top Header Banner
    page.drawRectangle({
      x: 0,
      y: height - 80,
      width: width,
      height: 80,
      color: info.bgAccent,
    });

    // Decorative top stripe
    page.drawRectangle({
      x: 0,
      y: height - 6,
      width: width,
      height: 6,
      color: info.color,
    });

    // Brand logo text
    page.drawText('PDFPro Sample Document', {
      x: 45,
      y: height - 48,
      size: 16,
      font: fontBold,
      color: rgb(0.12, 0.15, 0.2),
    });

    // Badge
    page.drawRectangle({
      x: width - 170,
      y: height - 52,
      width: 125,
      height: 24,
      color: info.color,
    });

    page.drawText(info.badge, {
      x: width - 158,
      y: height - 44,
      size: 10,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // Main Card Box
    page.drawRectangle({
      x: 45,
      y: height - 420,
      width: width - 90,
      height: 310,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1.5,
      color: rgb(0.99, 0.99, 1.0),
    });

    // Title
    page.drawText(info.title, {
      x: 70,
      y: height - 150,
      size: 17,
      font: fontBold,
      color: info.color,
    });

    // Divider line
    page.drawLine({
      start: { x: 70, y: height - 170 },
      end: { x: width - 70, y: height - 170 },
      thickness: 1,
      color: rgb(0.85, 0.88, 0.92),
    });

    // Content Description
    page.drawText(info.desc, {
      x: 70,
      y: height - 210,
      size: 12,
      font: font,
      color: rgb(0.25, 0.3, 0.35),
      lineHeight: 18,
      maxWidth: width - 140,
    });

    // Mock content lines / diagram
    for (let j = 0; j < 4; j++) {
      const lineY = height - 280 - (j * 26);
      page.drawRectangle({
        x: 70,
        y: lineY,
        width: (width - 140) * (0.85 - j * 0.12),
        height: 12,
        color: rgb(0.9, 0.92, 0.95),
      });
    }

    // Bottom Footer
    page.drawLine({
      start: { x: 45, y: 55 },
      end: { x: width - 45, y: 55 },
      thickness: 1,
      color: rgb(0.85, 0.88, 0.92),
    });

    page.drawText(`Confidential - For Testing PDF Page Removal Tool`, {
      x: 45,
      y: 35,
      size: 9,
      font: font,
      color: rgb(0.55, 0.6, 0.65),
    });

    page.drawText(`Page ${i + 1} of ${pagesInfo.length}`, {
      x: width - 110,
      y: 35,
      size: 10,
      font: fontBold,
      color: rgb(0.3, 0.35, 0.4),
    });
  }

  return await pdfDoc.save();
}
