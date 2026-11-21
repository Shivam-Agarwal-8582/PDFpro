# PDFPro – Modern Online PDF Editor

A professional, 100% browser-based PDF editing application built with React, Vite, Tailwind CSS, PDF.js (`pdfjs-dist`), and `pdf-lib`.

---

## 🚀 Key Features

- **100% Client-Side Privacy:** All rendering, annotation, and PDF generation occur directly inside your browser. Your files never touch external servers or local storage.
- **Strict Light Theme:** Premium SaaS aesthetic with clean whites, subtle gray borders, and blue/indigo primary accents.
- **Add Text:** Insert text boxes anywhere with customizable font family (Helvetica, Times Roman, Courier), font size, bold, italic, color, alignment, and background fill.
- **Edit & Replace Text (Whiteout):** Cleanly whiteout/redact existing underlying text and place replacement text with matching typography directly over it.
- **Add Images:** Upload and insert JPG and PNG images onto any page with full dragging and resizing handles.
- **Highlight Text:** Draw semi-transparent highlight rectangles over text in multiple color presets (Yellow, Green, Pink, Blue, Orange) with opacity control.
- **Freehand Drawing:** Sketch notes, circles, and diagrams using mouse or touch with adjustable pen thickness, color palette, and eraser mode.
- **Page Management:**
  - Rotate pages 90° clockwise and counter-clockwise.
  - Delete pages with a safeguard confirmation modal.
  - Duplicate any page with all its annotations.
  - Add blank canvas pages.
  - Reorder pages up and down.
- **Undo & Redo:** Full history snapshot stack with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y` / `Cmd+Shift+Z`).
- **Export & Download:** Generates real modified PDF files using `pdf-lib` embedding all inserted annotations, shapes, images, drawings, and page structure changes.
- **Sample Document:** Built-in "Try with Sample PDF" button to immediately test all features without having to search for a PDF file on your computer.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 8
- **Language:** JavaScript (ESM)
- **Styling:** Tailwind CSS v4
- **PDF Rendering:** `pdfjs-dist` (v4/v6) with high-DPI canvas rendering and web worker
- **PDF Manipulation & Export:** `pdf-lib` (v1.17)
- **Icons:** `lucide-react`
- **Routing:** `react-router-dom` (v7)

---

## 📁 Architecture and Major Components

```
pdf-editor/
├── public/
│   └── pdf.worker.min.mjs       # Static PDF.js worker for isolated rendering
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Clean light navbar with navigation & CTA
│   │   ├── Hero.jsx             # Hero section with primary value propositions
│   │   ├── FileUpload.jsx       # Drag-and-drop zone with validation & sample trigger
│   │   ├── EditorToolbar.jsx    # Top editor bar: file rename, undo/redo, zoom, download
│   │   ├── ToolsBar.jsx         # Secondary toolbar to switch between editing tools
│   │   ├── PageSidebar.jsx      # Left sidebar with page thumbnails and page actions
│   │   ├── PDFViewer.jsx        # Center workspace: high-DPI canvas rendering
│   │   ├── AnnotationOverlay.jsx# Interactive overlay handling clicks, drags, and shapes
│   │   ├── PropertiesPanel.jsx  # Right sidebar with contextual formatting controls
│   │   └── DeleteConfirmModal.jsx # Confirmation dialog before deleting pages
│   ├── context/
│   │   └── PDFContext.jsx       # Central state management (PDF, annotations, history, tools)
│   ├── services/
│   │   ├── pdfService.js        # PDF.js loader, thumbnail renderer, text extractor
│   │   └── exportService.js     # pdf-lib export engine with coordinate translation
│   ├── utils/
│   │   ├── pdfCoordinates.js    # DOM-to-PDF coordinate mapping & color converters
│   │   └── samplePdf.js         # Built-in sample PDF generator
│   ├── pages/
│   │   ├── Home.jsx             # Landing page with hero, features, process, and FAQ
│   │   ├── Editor.jsx           # Dedicated PDF workspace with keyboard shortcuts
│   │   └── About.jsx            # Explains privacy, client-side model, and architecture
│   ├── App.jsx                  # React Router setup wrapped in PDFProvider
│   ├── main.jsx                 # React root bootstrap
│   └── index.css                # Tailwind CSS imports and scrollbar styles
├── package.json
└── vite.config.js
```

---

## 🏃 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
The application will open at `http://localhost:3000`.

### 3. Run automated tests
```bash
npm test
```

### 4. Build for production
```bash
npm run build
```
