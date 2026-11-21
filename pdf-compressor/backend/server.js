import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import compressionRoutes from './routes/compressionRoutes.js';
import { cleanupOldFiles } from './services/compressionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup - Allow all development origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static routes for output files if accessed directly
app.use('/outputs', express.static(path.join(__dirname, 'outputs')));

// API Routes
app.use('/api/compress', compressionRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'PDF Compressor API'
  });
});

// Periodic cleanup of temporary uploads and outputs (every 30 mins)
const uploadsDir = path.join(__dirname, 'uploads');
const outputsDir = path.join(__dirname, 'outputs');
setInterval(() => {
  cleanupOldFiles(uploadsDir, 60 * 60 * 1000); // 1 hour old
  cleanupOldFiles(outputsDir, 60 * 60 * 1000); // 1 hour old
}, 30 * 60 * 1000);

// Global Error Handler (including multer file limit errors)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File size exceeds maximum allowed limit (50 MB).'
    });
  }

  if (err.message && err.message.includes('Only PDF files')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`🚀 PDF Compressor Backend running at http://localhost:${PORT}`);
  });
}

export default app;
