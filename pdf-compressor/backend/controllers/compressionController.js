import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { compressPDF } from '../services/compressionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');
const outputsDir = path.join(rootDir, 'outputs');

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // Sanitize base name
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `upload-${uniqueSuffix}${ext}`);
  }
});

// PDF file filter
const fileFilter = (req, file, cb) => {
  const isPdfMime = file.mimetype === 'application/pdf';
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';

  if (isPdfMime || isPdfExt) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files (.pdf) are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 50) * 1024 * 1024 // default 50 MB
  }
});

/**
 * Handle PDF compression request
 */
export async function compressFile(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No PDF file uploaded. Please select a valid PDF file.'
    });
  }

  const inputPath = req.file.path;
  const originalFileName = req.file.originalname;
  const level = (req.body.level || 'recommended').toLowerCase();

  // Validate compression level
  const validLevels = ['low', 'recommended', 'high'];
  const compressionLevel = validLevels.includes(level) ? level : 'recommended';

  // Construct output filename
  const fileId = path.parse(req.file.filename).name;
  const outputFileName = `compressed-${fileId}.pdf`;
  const outputPath = path.join(outputsDir, outputFileName);

  try {
    const stats = await compressPDF(inputPath, outputPath, compressionLevel);

    // Clean up temporary uploaded file safely
    try {
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
    } catch (cleanupErr) {
      console.warn('Could not remove temp upload file:', cleanupErr.message);
    }

    // Determine target download name: <original_name_without_ext>_compressed.pdf
    const baseName = path.parse(originalFileName).name;
    const downloadDisplayName = `${baseName}_compressed.pdf`;

    return res.status(200).json({
      success: true,
      message: 'PDF compressed successfully',
      data: {
        fileId: outputFileName,
        originalFileName,
        compressedFileName: downloadDisplayName,
        downloadUrl: `/api/compress/download/${outputFileName}?name=${encodeURIComponent(downloadDisplayName)}`,
        originalSize: stats.originalSize,
        compressedSize: stats.compressedSize,
        savedSize: stats.savedSize,
        compressionRatio: stats.compressionRatio,
        compressionLevel: stats.compressionLevel,
        pagesCount: stats.pagesCount,
        imagesOptimized: stats.imagesOptimized
      }
    });
  } catch (error) {
    // Clean up temporary upload on failure
    try {
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }
    } catch {
      // Ignore
    }

    console.error('Compression controller error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while compressing the PDF document.'
    });
  }
}

/**
 * Download compressed PDF
 */
export function downloadFile(req, res) {
  const { filename } = req.params;
  const safeFilename = path.basename(filename); // Prevent directory traversal
  const filePath = path.join(outputsDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: 'The requested compressed file was not found or has expired.'
    });
  }

  // Requested display name if query provided
  const displayName = req.query.name
    ? path.basename(req.query.name)
    : safeFilename;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(displayName)}"`);

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on('error', (err) => {
    console.error('Download stream error:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to download file' });
    }
  });
}
