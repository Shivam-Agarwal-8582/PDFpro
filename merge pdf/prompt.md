# Project: PDFPro – Merge PDF Tool

Act as an expert React.js developer and UI/UX designer. Build a fully functional **Merge PDF** tool that allows users to upload multiple PDF files, arrange them in their preferred order, combine them into a single PDF document, and download the merged PDF.

Use the existing PDFPro website design and maintain the same professional LIGHT THEME.

## 1. Technology Stack

Use:
- React.js with Vite
- JavaScript (not TypeScript)
- Tailwind CSS
- React Router DOM
- pdf-lib for merging PDF documents
- PDF.js (pdfjs-dist) for PDF previews
- Lucide React for icons

Do not introduce a backend. Process PDF files directly inside the browser.

## 2. Design and Theme

Maintain the existing PDFPro light theme.

Design requirements:
- White background.
- Light gray sections.
- Blue or indigo primary accent.
- Dark text.
- Rounded cards.
- Subtle shadows and borders.
- Professional typography.
- Smooth hover effects.
- Responsive layout for desktop, tablet, and mobile.

The Merge PDF page should match the existing website's navbar, buttons, typography, spacing, and footer.

Do not introduce dark mode.

## 3. Merge PDF Page

Create a dedicated page at:

`/merge-pdf`

### Navbar
- PDFPro logo.
- Home.
- Edit PDF.
- Merge PDF.
- About.

### Hero Section

Heading:

"Merge PDF Files Easily"

Description:

"Combine multiple PDF documents into one file in seconds. Upload your PDFs, arrange their order, and download your merged document."

Display a large upload area with:
- Drag-and-drop support.
- Browse Files button.
- Support multiple PDF uploads.
- Maximum file size information.
- Privacy message: "Your files stay on your device."

## 4. Upload Multiple PDF Files

Implement actual multiple-file upload functionality.

Requirements:
- Allow selecting multiple PDFs simultaneously.
- Allow uploading PDFs one by one.
- Support drag and drop.
- Validate file types.
- Validate file sizes.
- Reject corrupted or unsupported PDFs with clear error messages.
- Display uploaded file names.
- Display individual file sizes.
- Display the total number of uploaded files.
- Allow users to remove individual files.
- Provide an Add More Files button.

At least two valid PDF files must be required before enabling the merge operation.

## 5. PDF File List and Preview

After uploading files, display them in a clean file management interface.

Each uploaded PDF should have:
- PDF file icon.
- Filename.
- File size.
- Number of pages.
- Page thumbnail or preview.
- Remove button.
- Drag-and-drop reorder functionality.

Allow users to rearrange files by dragging them into their preferred sequence.

The final merged PDF must follow exactly the displayed file order.

## 6. Merge Options

Provide the following options:

### File Ordering
- Drag and drop to change document order.
- Move file up.
- Move file down.

### Page Selection (Optional)
- Allow users to select specific page ranges from individual PDFs.
- Example: Pages 1-3, 5, 7-9.
- Validate page numbers and ranges.
- Allow selecting all pages.

### Output Settings
- Output filename field.
- Default filename: `merged-document.pdf`.
- Preserve the original page orientation and page dimensions wherever possible.

## 7. Merge PDF Functionality

This is the most important feature.

Use pdf-lib to implement actual PDF merging.

Requirements:
1. Read all uploaded PDF files.
2. Load each PDF using pdf-lib.
3. Create a new PDF document.
4. Copy pages from each source PDF in the selected order.
5. Respect the selected page ranges, if implemented.
6. Preserve original page dimensions and orientation.
7. Append all selected pages into one document.
8. Generate the final merged PDF.
9. Ensure the output is a valid PDF document.

Do not simulate merging or display fake results.

## 8. Merge Button and Processing

Create a prominent button:

"Merge PDF"

When clicked:
- Validate uploaded files.
- Check that at least two valid PDFs are selected.
- Display a loading indicator.
- Show processing status.
- Disable the merge button while processing.
- Handle errors properly.
- Generate the merged PDF.
- Display a success notification after successful merging.

Prevent duplicate processing when the user clicks multiple times.

## 9. Download Merged PDF

After successful merging, display a download section.

Show:
- Success icon.
- Heading: "Your PDFs have been merged!"
- Total number of merged files.
- Total number of pages.
- Final filename.
- Download PDF button.
- Merge More PDFs button.

The Download PDF button must:
- Download the actual merged PDF.
- Use the filename entered by the user.
- Work in supported desktop and mobile browsers.
- Not download an unchanged source PDF.

Allow users to start another merge operation without refreshing the entire website.

## 10. Privacy and Security

- Perform all merging directly in the browser.
- Do not upload PDF files to external servers.
- Do not store PDF contents in local storage.
- Validate uploaded files.
- Handle encrypted PDFs and unsupported files gracefully.
- Clear temporary file data when the user resets the tool or leaves the page.
- Display a privacy notice explaining local processing.

## 11. Empty, Loading, and Error States

Implement all necessary UI states.

### Empty State
Display:
- PDF illustration or icon.
- "Upload PDF files to get started."
- Browse Files button.

### Loading State
Display:
- Loading spinner.
- "Merging your PDF files..."
- Processing feedback.

### Error State
Handle:
- Invalid file format.
- Corrupted PDF.
- Password-protected PDF.
- File too large.
- Fewer than two uploaded files.
- Failed PDF processing.

Display clear and user-friendly error messages.

## 12. Component Structure

Create reusable components:

`src/components/`
- Navbar.jsx
- Footer.jsx
- FileUpload.jsx
- UploadedFileList.jsx
- PDFFileCard.jsx
- MergeOptions.jsx
- MergeProgress.jsx
- MergeSuccess.jsx

`src/pages/`
- MergePDF.jsx

`src/services/`
- mergePDFService.js

`src/utils/`
- fileValidation.js

Integrate the Merge PDF page with the existing React Router configuration.

Do not duplicate existing navbar or footer components.

## 13. Important Development Rules

1. Build the actual PDF merging functionality.
2. Use pdf-lib for merging.
3. Use JavaScript, not TypeScript.
4. Follow the existing PDFPro design system.
5. Maintain a consistent light theme.
6. Do not add signature functionality.
7. Do not add unrelated PDF editing features.
8. Do not create non-functional buttons.
9. Do not upload files to a server.
10. Keep the code modular and reusable.
11. Test merging with PDFs containing different page counts and page dimensions.
12. Ensure the downloaded merged PDF opens correctly.
13. Preserve the uploaded file order.
14. Handle errors without crashing the application.

## 14. Development Sequence

Build the feature incrementally:

Phase 1: Create the Merge PDF page UI.

Phase 2: Implement multiple PDF uploads and validation.

Phase 3: Display uploaded files with previews and page counts.

Phase 4: Implement drag-and-drop file reordering.

Phase 5: Integrate pdf-lib and implement actual merging.

Phase 6: Implement download functionality.

Phase 7: Test all functionality and improve responsive design.

Start implementing Phase 1 and continue through the phases. Explain which files you create or modify.

## Final Goal

Create a fully functional Merge PDF tool inside PDFPro that allows users to upload multiple PDF files, preview them, rearrange their order, merge them into one PDF document, and download the final merged PDF directly to their devices.

The entire process must happen in the browser without requiring user registration, a backend, or uploading documents to external servers.