# PDFPro – Remove Pages from PDF Tool

A professional, client-side web application built with **React**, **Vite**, **Tailwind CSS**, **pdf-lib**, and **PDF.js** to delete unwanted pages from PDF documents directly in the browser with 100% privacy and zero server uploads.

## Features

- **100% Client-Side Privacy**: All processing runs in the browser using WebAssembly and Web Workers. No files are ever sent to an external server or cloud storage.
- **Interactive PDF Thumbnail Grid**: Renders crisp visual previews for all pages with PDF.js.
- **Granular Page Selection**:
  - Click any thumbnail card to mark/unmark for removal with distinct red visual indicators.
  - Select All, Deselect All, and Invert Selection with single clicks.
  - Custom Page Range syntax support (e.g. `2-5`, `1,3,6`, `2-4,7,9-11`) with validation and instant feedback.
  - Quick presets: Odd pages, Even pages, Last page.
- **Real-Time Selection Summary**: Live count of Total Pages, Pages Marked for Deletion, and Remaining Pages. Prevents accidental deletion of all pages.
- **Confirmation Modal**: Clear summary of pages being removed with safeguard warnings.
- **Actual Document Modification**: Uses `pdf-lib` to create a separate modified PDF copying only preserved pages while retaining original dimensions, fonts, and orientations.
- **Undo & Reset Support**: Revert the previous deletion operation, restore original document, or upload a new file.
- **Customizable Download**: Download the modified PDF directly to the device with customizable output filename.
- **Built-in Sample PDF Generator**: Instant 1-click test with a pre-generated 6-page demo document.

## Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **PDF Manipulation**: `pdf-lib`
- **PDF Page Previews**: `pdfjs-dist` (v4 with local Web Worker)
- **Routing**: `react-router-dom` (dedicated route `/remove-pages`)
- **Icons**: `lucide-react`
- **Celebration Effects**: `canvas-confetti`

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

### 4. Run Test Suite
```bash
npm test
```

## Project Structure

```
├── public/
│   └── pdf.worker.min.mjs
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── FileUpload.jsx
│   │   ├── PDFPageGrid.jsx
│   │   ├── PDFPageCard.jsx
│   │   ├── PageSelectionToolbar.jsx
│   │   ├── PageRangeInput.jsx
│   │   ├── SelectionSummary.jsx
│   │   ├── RemoveConfirmation.jsx
│   │   └── DownloadSuccess.jsx
│   ├── pages/
│   │   └── RemovePages.jsx
│   ├── services/
│   │   ├── pdfRenderService.js
│   │   ├── removePagesService.js
│   │   └── samplePdfService.js
│   ├── utils/
│   │   ├── fileValidation.js
│   │   └── pageRangeParser.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── test/
│   └── test-services.js
├── prompt.md
├── package.json
├── tailwind.config.js
└── vite.config.js
```
