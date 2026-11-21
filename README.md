# PDFPro – All-in-One PDF Toolkit

> **Tagline:** All Your PDF Tools in One Place.

PDFPro makes working with PDF files simple. Edit, merge, compress, and remove pages from your PDF documents using our easy-to-use online tools.

---

## 🌟 Key Features

1. **Edit PDF (`/edit-pdf`)**
   - Add customizable text boxes with font families, sizes, weights, and colors.
   - Whiteout & Redact: mask existing content and place replacement text cleanly over it.
   - Add images (PNG/JPG logos, signatures, and stamps) with scaling and positioning.
   - Highlight passages with semi-transparent highlights in multiple colors.
   - Freehand pen drawing with stroke thickness and color controls.
   - Manage pages: rotate 90°, delete pages, duplicate, and reorder.
   - Full Undo & Redo history stacks (Ctrl+Z / Ctrl+Y).
   - Export authentic modified PDF documents via ISO-compliant `pdf-lib`.

2. **Merge PDF (`/merge-pdf`)**
   - Upload multiple PDF files simultaneously.
   - Drag & reorder files with live page count and metadata inspection.
   - Specify individual page ranges per document (e.g., `1-3, 5`).
   - Merge files directly inside your browser.
   - Real-time merge progress indicator and instant one-click download.

3. **Compress PDF (`/compress-pdf`)**
   - Upload any PDF document to reduce file size.
   - Choose from 3 compression profiles:
     - **Low**: Maximum visual fidelity and mild downscaling.
     - **Recommended**: Balanced document compression and crisp text.
     - **High / Extreme**: Aggressive file reduction for easy email sharing.
   - Operates 100% in-browser with optional backend support.
   - Comparison dashboard displaying original size, compressed size, space saved, and percentage reduction.

4. **Remove Pages (`/remove-pages`)**
   - Upload any PDF or load a sample demo report.
   - Visual thumbnail grid displaying every page of the document.
   - Flexible selection: click individual cards, select all, deselect, invert, or enter page ranges.
   - Real-time confirmation modal with protection against accidental full deletion.
   - History stack with Undo support to restore deleted pages.
   - Download the revised PDF instantly.

---

## 🚀 Technology Stack

- **React.js 18** – Declarative component-based UI.
- **Vite 5** – Lightning-fast build tooling and hot module replacement.
- **Tailwind CSS 3** – Modern, clean light-themed design system.
- **React Router DOM 6** – Client-side SPA routing with 404 handling and history.
- **pdf-lib** – High-performance client-side PDF document manipulation.
- **PDF.js (`pdfjs-dist`)** – Crisp high-DPI canvas page rendering and thumbnails.
- **Lucide React** – Clean, modern icon set.
- **Canvas Confetti** – Celebration particle effects on successful downloads.

---

## 🛡️ Privacy & Security

PDFPro runs **100% inside your web browser**. 
- Documents are never transmitted to external servers.
- No files are stored or logged.
- No user accounts or registrations required.

---

## 📁 Project Structure

```text
website/
├── public/
│   ├── _redirects                  # Netlify SPA routing fallback
│   └── pdf.worker.min.mjs          # Standalone PDF.js worker
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Universal site navigation & mobile menu
│   │   ├── Footer.jsx              # Universal footer & copyright statement
│   │   ├── Hero.jsx                # Homepage hero section & graphic
│   │   ├── ToolCard.jsx            # Interactive tool card component
│   │   └── HowItWorks.jsx          # 3-step walkthrough section
│   ├── pages/
│   │   ├── Home.jsx                # Unified landing page
│   │   ├── EditPDF.jsx             # Dedicated PDF editor workspace
│   │   ├── MergePDF.jsx            # PDF merge tool
│   │   ├── CompressPDF.jsx         # PDF compressor tool
│   │   ├── RemovePages.jsx         # Visual page removal tool
│   │   └── NotFound.jsx            # Custom 404 page with Back to Home button
│   ├── features/
│   │   ├── edit-pdf/               # Editor state, annotations, and canvas
│   │   ├── merge-pdf/              # File list, page ranges, and merge service
│   │   ├── compress-pdf/           # Compression options and dual-engine service
│   │   └── remove-pages/           # Page selection grid, range parser, removal
│   ├── App.jsx                     # Route definitions & layout wrapper
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Tailwind CSS directives & light styling
├── package.json
├── vite.config.js                  # Vite configuration & chunking
├── tailwind.config.js              # Custom brand color palette
├── vercel.json                     # Vercel SPA routing rewrite
└── README.md
```

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```
Creates an optimized production bundle inside the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment

### Vercel
PDFPro includes a `vercel.json` rewrite configuration:
```bash
npm install -g vercel
vercel
```

### Netlify
PDFPro includes a `public/_redirects` file that routes all direct URLs to `index.html`:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## 📄 License & Copyright

**All rights are reserved by Shivam Agarwal.**
