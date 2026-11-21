import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_PATH = path.join(__dirname, 'pdf_compressor.py');

/**
 * Execute Python PDF compression script.
 * @param {string} inputPath - Path to uploaded PDF
 * @param {string} outputPath - Path to save compressed PDF
 * @param {string} level - 'low' | 'recommended' | 'high'
 * @returns {Promise<Object>} Compression statistics
 */
export async function compressPDF(inputPath, outputPath, level = 'recommended') {
  return new Promise((resolve, reject) => {
    // Validate inputs
    if (!fs.existsSync(inputPath)) {
      return reject(new Error('Input file does not exist on server'));
    }

    const pythonProcess = spawn('python3', [
      SCRIPT_PATH,
      '--input', inputPath,
      '--output', outputPath,
      '--level', level
    ]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        let errMsg = stderrData.trim();
        try {
          const parsed = JSON.parse(stdoutData);
          if (parsed.error) errMsg = parsed.error;
        } catch {
          // keep stderrData
        }
        return reject(new Error(errMsg || `Compression failed with exit code ${code}`));
      }

      try {
        const result = JSON.parse(stdoutData.trim());
        if (!result.success) {
          return reject(new Error(result.error || 'Compression failed'));
        }
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse compression response: ${err.message}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start compression process: ${err.message}`));
    });
  });
}

/**
 * Cleanup files older than maxAgeMs in directory.
 */
export function cleanupOldFiles(dirPath, maxAgeMs = 60 * 60 * 1000) {
  try {
    if (!fs.existsSync(dirPath)) return;
    const now = Date.now();
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (file === '.gitkeep') continue;
      const filePath = path.join(dirPath, file);
      try {
        const stats = fs.statSync(filePath);
        if (now - stats.mtimeMs > maxAgeMs) {
          fs.unlinkSync(filePath);
        }
      } catch {
        // Ignore stat or delete error on active files
      }
    }
  } catch (err) {
    console.error('Error during directory cleanup:', err.message);
  }
}
