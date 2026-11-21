# DocPress - Professional PDF Compressor

A modern, responsive, professional **PDF Compressor web application built with React.js, Vite, Tailwind CSS, Node.js, and Express.js**.

Users can upload PDF files, select from three distinct compression levels, compress them using a genuine quality-preserving engine, visualize real-time compression metrics (original size, compressed size, space saved, compression ratio), and download the compressed PDF files.

---

## 🌟 Key Features

- **Genuine PDF Compression Engine**: Re-encodes embedded raster images (Lanczos downsampling & Pillow JPEG/PNG optimization), applies Flate stream compression, and deduplicates identical PDF objects.
- **Three Compression Levels**:
  - **Low Compression**: Preserves maximum document quality (~20-40% reduction).
  - **Recommended Compression (Default)**: Optimal balance of quality and size reduction (~50-70% reduction).
  - **High Compression**: Maximum file size reduction for email attachments and mobile sharing (~70-85% reduction).
- **Accurate Real-Time Metrics**: Displays exact original size, compressed size, bytes saved, and compression percentage calculated from actual files.
- **Drag-and-Drop Upload**: Fast drag-and-drop interface with format validation and file size verification (up to 50 MB).
- **Interactive Visual Comparison**: Dynamic before/after size visualizer with page count and image optimization counts.
- **Instant Secure Download**: Downloads the compressed PDF with `_compressed` naming suffix.
- **Security & Privacy by Design**: Zero permanent storage. Files are automatically purged from the server after 1 hour. No user registration required.

---

## 🏗️ Architecture

```text
pdf-compressor/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Navigation bar with responsive menu
│   │   │   ├── Footer.jsx               # Site footer with security badges
│   │   │   ├── PDFUpload.jsx            # Drag-and-drop file upload zone
│   │   │   ├── FileInformation.jsx      # Selected file metadata and remove button
│   │   │   ├── CompressionOptions.jsx   # Low, Recommended, High level selector
│   │   │   ├── CompressionProgress.jsx  # Multi-step progress bar and animated spinner
│   │   │   ├── CompressionResults.jsx   # Dynamic statistics, metric cards & confetti
│   │   │   └── DownloadButton.jsx       # Download trigger and reset button
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Homepage with hero, how-it-works & FAQs
│   │   │   └── CompressPDF.jsx          # Dedicated compression workflow page
│   │   │
│   │   ├── services/
│   │   │   └── compressionService.js    # API service with progress tracking & byte formatting
│   │   │
│   │   ├── App.jsx                      # React Router DOM routes
│   │   ├── main.jsx                     # Application entry point
│   │   └── index.css                    # Tailwind CSS directives and styles
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   └── compressionRoutes.js         # API routes for upload, compression, and download
│   ├── controllers/
│   │   └── compressionController.js     # Multer config, file handling, and validation
│   ├── services/
│   │   ├── compressionService.js        # Service calling Python compression engine & cleanup
│   │   └── pdf_compressor.py            # Genuine PDF compression script (pypdf + Pillow)
│   ├── uploads/                         # Temporary upload directory
│   ├── outputs/                         # Processed compressed PDF directory
│   ├── server.js                        # Express server entry point with CORS and error handling
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or later (tested with v22.x)
- **Python 3**: with `pypdf` and `Pillow` installed (`pypdf >= 4.0`, `Pillow >= 10.0`)

### Quick Setup & Installation

You can install dependencies for both frontend and backend in one step:

```bash
cd pdf-compressor
npm run install:all
```

Or install separately:

```bash
# 1. Install Backend Dependencies
cd backend
npm install

# 2. Install Frontend Dependencies
cd ../frontend
npm install
```

---

## 🏃 Running the Application

### 1. Start the Backend API (Port 5001)

```bash
cd backend
npm run dev
```

The backend server will start at: `http://localhost:5001`

### 2. Start the Frontend Development Server (Port 5173)

In a separate terminal:

```bash
cd frontend
npm run dev
```

Open your browser and navigate to: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check endpoint |
| `POST` | `/api/compress/upload` | Uploads PDF (field: `pdf`) and compresses using `level` (`low`, `recommended`, `high`) |
| `GET` | `/api/compress/download/:filename` | Downloads the generated compressed PDF |

---

## 🔒 Security & Privacy

- **MIME & Extension Validation**: Only valid PDF documents are accepted on both frontend and backend.
- **Path Traversal Protection**: File download routes sanitize filenames using `path.basename`.
- **Automatic Lifecycle Cleanup**: Files in `uploads/` and `outputs/` are automatically deleted after 60 minutes.
- **Configurable Upload Limit**: Maximum file upload size is set to 50 MB by default.
