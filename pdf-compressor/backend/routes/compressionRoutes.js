import express from 'express';
import { upload, compressFile, downloadFile } from '../controllers/compressionController.js';

const router = express.Router();

// Upload & compress PDF
router.post('/upload', upload.single('pdf'), compressFile);

// Download compressed PDF
router.get('/download/:filename', downloadFile);

export default router;
