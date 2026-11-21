import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { compressPDF } from './services/compressionService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTest() {
  console.log('🧪 Starting End-to-End PDF Compressor Test...\n');

  const samplePdfPath = path.join(__dirname, 'test_sample.pdf');
  const compressedLowPath = path.join(__dirname, 'test_sample_low.pdf');
  const compressedRecPath = path.join(__dirname, 'test_sample_rec.pdf');
  const compressedHighPath = path.join(__dirname, 'test_sample_high.pdf');

  console.log('1️⃣ Generating realistic multi-page test PDF with photos...');
  execSync(`python3 -c "
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from PIL import Image

c = canvas.Canvas('${samplePdfPath}', pagesize=letter)

# Page 1 with gradient photo
w, h = 1400, 1000
img1 = Image.new('RGB', (w, h))
pixels1 = img1.load()
for i in range(w):
    for j in range(h):
        pixels1[i, j] = ((i * 255) // w, (j * 255) // h, (i + j) % 255)
buf1 = io.BytesIO()
img1.save(buf1, format='JPEG', quality=95)
buf1.seek(0)

c.setFont('Helvetica-Bold', 22)
c.drawString(100, 720, 'DocPress Annual Report')
c.drawImage(ImageReader(buf1), 100, 200, width=400, height=300)
c.showPage()

# Page 2 with second photo
img2 = Image.new('RGB', (1000, 800))
pixels2 = img2.load()
for i in range(1000):
    for j in range(800):
        pixels2[i, j] = ((j * 255) // 800, (i * 255) // 1000, (i * j) % 255)
buf2 = io.BytesIO()
img2.save(buf2, format='JPEG', quality=95)
buf2.seek(0)

c.setFont('Helvetica-Bold', 18)
c.drawString(100, 720, 'Page 2: Supporting Documentation')
c.drawImage(ImageReader(buf2), 100, 200, width=350, height=280)
c.showPage()

c.save()
"`);

  const originalSize = fs.statSync(samplePdfPath).size;
  console.log(`   Created test_sample.pdf (${originalSize} bytes)\n`);

  // Step 2: Test Low Compression
  console.log('2️⃣ Testing Low Compression...');
  const resLow = await compressPDF(samplePdfPath, compressedLowPath, 'low');
  console.log('   Result Low:', resLow);

  // Step 3: Test Recommended Compression
  console.log('\n3️⃣ Testing Recommended Compression (Default)...');
  const resRec = await compressPDF(samplePdfPath, compressedRecPath, 'recommended');
  console.log('   Result Recommended:', resRec);

  // Step 4: Test High Compression
  console.log('\n4️⃣ Testing High Compression...');
  const resHigh = await compressPDF(samplePdfPath, compressedHighPath, 'high');
  console.log('   Result High:', resHigh);

  // Validations
  console.log('\n🔍 Verifying Assertions:');
  if (!resLow.success) throw new Error('Low compression failed');
  if (!resRec.success) throw new Error('Recommended compression failed');
  if (!resHigh.success) throw new Error('High compression failed');
  if (resRec.compressedSize >= originalSize) throw new Error('Recommended size should be smaller than original');
  if (resHigh.compressedSize > resRec.compressedSize) throw new Error('High compression should be <= Recommended size');
  if (resRec.pagesCount !== 2) throw new Error('Should detect 2 pages');

  console.log('   ✅ All assertions passed successfully!');
  console.log(`   - Original:    ${originalSize} bytes`);
  console.log(`   - Low:         ${resLow.compressedSize} bytes (${resLow.compressionRatio}% saved)`);
  console.log(`   - Recommended: ${resRec.compressedSize} bytes (${resRec.compressionRatio}% saved)`);
  console.log(`   - High:        ${resHigh.compressedSize} bytes (${resHigh.compressionRatio}% saved)`);

  // Cleanup test files
  fs.unlinkSync(samplePdfPath);
  fs.unlinkSync(compressedLowPath);
  fs.unlinkSync(compressedRecPath);
  fs.unlinkSync(compressedHighPath);

  console.log('\n🎉 End-to-End PDF Compressor verified completely!\n');
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
