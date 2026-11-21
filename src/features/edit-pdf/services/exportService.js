import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { hexToPdfRgb } from '../utils/pdfCoordinates.js';

/**
 * Convert dataURL (base64) to Uint8Array
 */
function dataUrlToBytes(dataUrl) {
  const base64 = dataUrl.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Map font family name to standard PDF-lib font
 */
async function getPdfFont(pdfDoc, fontFamily = 'Helvetica', isBold = false, isItalic = false) {
  const family = fontFamily.toLowerCase();

  try {
    if (family.includes('times') || family.includes('serif')) {
      if (isBold && isItalic) return await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic);
      if (isBold) return await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      if (isItalic) return await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
      return await pdfDoc.embedFont(StandardFonts.TimesRoman);
    } else if (family.includes('courier') || family.includes('mono')) {
      if (isBold && isItalic) return await pdfDoc.embedFont(StandardFonts.CourierBoldOblique);
      if (isBold) return await pdfDoc.embedFont(StandardFonts.CourierBold);
      if (isItalic) return await pdfDoc.embedFont(StandardFonts.CourierOblique);
      return await pdfDoc.embedFont(StandardFonts.Courier);
    } else {
      // Default Helvetica / Sans
      if (isBold && isItalic) return await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);
      if (isBold) return await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      if (isItalic) return await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
      return await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
  } catch (err) {
    console.warn('Fallback to standard Helvetica font:', err);
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
}

/**
 * Generate modified PDF document with all page manipulations and annotations
 * 
 * @param {Object} options
 * @param {ArrayBuffer} options.originalPdfBytes - Original PDF ArrayBuffer
 * @param {Array} options.pages - Array of page objects { id, originalIndex, rotation, isBlank, width, height }
 * @param {Object} options.annotations - Map of pageId -> array of annotations
 * @returns {Promise<Uint8Array>}
 */
export async function exportModifiedPdf({ originalPdfBytes, pages, annotations }) {
  // 1. Create a fresh target PDF document
  const targetDoc = await PDFDocument.create();

  // 2. Load the source PDF document if we have original bytes
  let sourceDoc = null;
  if (originalPdfBytes && originalPdfBytes.byteLength > 0) {
    sourceDoc = await PDFDocument.load(originalPdfBytes, { ignoreEncryption: true });
  }

  // Pre-load default fonts
  const defaultFont = await targetDoc.embedFont(StandardFonts.Helvetica);

  // 3. Process each page according to user's page list (order, duplications, blank pages)
  for (let i = 0; i < pages.length; i++) {
    const pageConfig = pages[i];
    let newPage;

    if (pageConfig.isBlank || !sourceDoc || pageConfig.originalIndex === null || pageConfig.originalIndex === undefined) {
      // Add a clean blank page
      const width = pageConfig.width || 595.28;
      const height = pageConfig.height || 841.89;
      newPage = targetDoc.addPage([width, height]);
    } else {
      // Copy page from original document
      const [copiedPage] = await targetDoc.copyPages(sourceDoc, [pageConfig.originalIndex]);
      newPage = targetDoc.addPage(copiedPage);
    }

    // Apply rotation
    const rotationDegrees = (pageConfig.rotation || 0) % 360;
    if (rotationDegrees !== 0) {
      const currentRotation = newPage.getRotation().angle;
      newPage.setRotation(degrees((currentRotation + rotationDegrees) % 360));
    }

    // Get page size in PDF points (72 points = 1 inch)
    const { width: pageWidth, height: pageHeight } = newPage.getSize();

    // 4. Render all annotations for this page
    const pageAnnotations = annotations[pageConfig.id] || [];

    for (const ann of pageAnnotations) {
      try {
        switch (ann.type) {
          case 'text': {
            // Text annotation:
            // ann.x, ann.y are in PDF points from TOP-LEFT of page
            // PDF-Lib coordinates have origin (0, 0) at BOTTOM-LEFT of page!
            const font = await getPdfFont(targetDoc, ann.fontFamily, ann.isBold, ann.isItalic);
            const fontSize = ann.fontSize || 14;
            const textLines = (ann.text || '').split('\n');
            const lineHeight = fontSize * 1.25;
            const textHeight = textLines.length * lineHeight;
            const textWidth = ann.width || 150;

            // Coordinate conversion:
            // In DOM: ann.y is top edge.
            // In PDF: y is bottom edge.
            const pdfX = ann.x;
            const pdfY = pageHeight - ann.y - textHeight;

            // Optional background fill behind text
            if (ann.backgroundColor && ann.backgroundColor !== 'transparent') {
              newPage.drawRectangle({
                x: pdfX - 4,
                y: pdfY - 4,
                width: textWidth + 8,
                height: textHeight + 8,
                color: hexToPdfRgb(ann.backgroundColor),
              });
            }

            // Draw each text line
            textLines.forEach((line, lineIndex) => {
              if (!line) return;
              const lineY = pageHeight - ann.y - (lineIndex + 1) * lineHeight + (lineHeight - fontSize) * 0.5;
              
              // Handle alignment
              let drawX = pdfX;
              if (ann.align === 'center' || ann.align === 'right') {
                const measuredWidth = font.widthOfTextAtSize(line, fontSize);
                if (ann.align === 'center') {
                  drawX = pdfX + Math.max(0, (textWidth - measuredWidth) / 2);
                } else if (ann.align === 'right') {
                  drawX = pdfX + Math.max(0, textWidth - measuredWidth);
                }
              }

              newPage.drawText(line, {
                x: drawX,
                y: lineY,
                size: fontSize,
                font: font,
                color: hexToPdfRgb(ann.color || '#000000'),
              });
            });
            break;
          }

          case 'whiteout': {
            // Whiteout / Redaction rectangle to cover old text
            const pdfX = ann.x;
            const pdfY = pageHeight - ann.y - ann.height;
            const fillColor = hexToPdfRgb(ann.fillColor || '#ffffff');

            newPage.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: ann.width,
              height: ann.height,
              color: fillColor,
            });

            // If user supplied replacement text to put on top of whiteout
            if (ann.replacementText && ann.replacementText.trim()) {
              const font = await getPdfFont(targetDoc, ann.fontFamily, ann.isBold, ann.isItalic);
              const fontSize = ann.fontSize || 12;
              const textLines = ann.replacementText.split('\n');
              const lineHeight = fontSize * 1.2;

              textLines.forEach((line, lineIndex) => {
                if (!line) return;
                const lineY = pageHeight - ann.y - (lineIndex + 1) * lineHeight + 4;
                newPage.drawText(line, {
                  x: pdfX + 4,
                  y: lineY,
                  size: fontSize,
                  font: font,
                  color: hexToPdfRgb(ann.color || '#111827'),
                });
              });
            }
            break;
          }

          case 'highlight': {
            // Semi-transparent highlight rectangle
            const pdfX = ann.x;
            const pdfY = pageHeight - ann.y - ann.height;
            const color = hexToPdfRgb(ann.color || '#facc15'); // Yellow default
            const opacity = ann.opacity !== undefined ? ann.opacity : 0.35;

            newPage.drawRectangle({
              x: pdfX,
              y: pdfY,
              width: ann.width,
              height: ann.height,
              color: color,
              opacity: opacity,
            });
            break;
          }

          case 'image': {
            // Inserted image (JPG or PNG)
            if (!ann.dataUrl) break;

            const imageBytes = dataUrlToBytes(ann.dataUrl);
            let embeddedImage;

            if (ann.dataUrl.startsWith('data:image/png')) {
              embeddedImage = await targetDoc.embedPng(imageBytes);
            } else {
              embeddedImage = await targetDoc.embedJpg(imageBytes);
            }

            const pdfX = ann.x;
            const pdfY = pageHeight - ann.y - ann.height;

            newPage.drawImage(embeddedImage, {
              x: pdfX,
              y: pdfY,
              width: ann.width,
              height: ann.height,
              opacity: ann.opacity !== undefined ? ann.opacity : 1.0,
            });
            break;
          }

          case 'drawing': {
            // Freehand strokes
            if (!ann.points || ann.points.length < 2) break;

            const strokeColor = hexToPdfRgb(ann.color || '#2563eb');
            const strokeWidth = ann.strokeWidth || 2.5;

            // Draw line segments connecting points
            for (let p = 0; p < ann.points.length - 1; p++) {
              const start = ann.points[p];
              const end = ann.points[p + 1];

              const startPdfX = start.x;
              const startPdfY = pageHeight - start.y;
              const endPdfX = end.x;
              const endPdfY = pageHeight - end.y;

              newPage.drawLine({
                start: { x: startPdfX, y: startPdfY },
                end: { x: endPdfX, y: endPdfY },
                thickness: strokeWidth,
                color: strokeColor,
                opacity: ann.opacity !== undefined ? ann.opacity : 1.0,
              });
            }
            break;
          }

          case 'rectangle': {
            // Bordered or filled shape
            const pdfX = ann.x;
            const pdfY = pageHeight - ann.y - ann.height;

            const rectOptions = {
              x: pdfX,
              y: pdfY,
              width: ann.width,
              height: ann.height,
              borderWidth: ann.borderWidth || 1,
              borderColor: hexToPdfRgb(ann.borderColor || '#2563eb'),
            };

            if (ann.fillColor && ann.fillColor !== 'transparent') {
              rectOptions.color = hexToPdfRgb(ann.fillColor);
            }

            newPage.drawRectangle(rectOptions);
            break;
          }

          default:
            console.warn('Unknown annotation type:', ann.type);
        }
      } catch (err) {
        console.error(`Failed to export annotation ${ann.id} on page ${pageConfig.id}:`, err);
      }
    }
  }

  // 5. Serialize and return the modified PDF
  return await targetDoc.save();
}
