# Project: PDFPro – Remove Pages from PDF Tool

Act as an expert React.js developer and UI/UX designer. Build a fully functional **Remove Pages from PDF** tool that allows users to upload a PDF, select unwanted pages, delete them, and download the modified PDF.

Integrate this tool into the existing PDFPro website. Maintain the same professional LIGHT THEME and design system.

## 1. Technology Stack

Use:
- React.js with Vite
- JavaScript (not TypeScript)
- Tailwind CSS
- React Router DOM
- pdf-lib for removing pages and generating modified PDFs
- PDF.js (pdfjs-dist) for displaying PDF pages
- Lucide React for icons

Requirements:
- No backend.
- No database.
- Process PDF documents directly in the browser.
- Do not upload documents to external servers.

## 2. Design and Theme

Maintain the existing PDFPro light theme.

Design requirements:
- White background.
- Light gray secondary backgrounds.
- Blue or indigo primary accent color.
- Dark text.
- Rounded cards and buttons.
- Subtle borders and shadows.
- Clean typography.
- Smooth hover effects.
- Fully responsive design.

Keep the same navbar, footer, button styles, and typography used throughout PDFPro.

Do not introduce dark mode.

## 3. Remove Pages Page

Create a dedicated page:

`/remove-pages`

### Hero Section

Heading:

"Remove Pages from PDF"

Description:

"Delete unwanted pages from your PDF document easily. Select the pages you want to remove and download your updated PDF in seconds."

Include:
- PDF upload area.
- Drag-and-drop support.
- Browse Files button.
- PDF file validation.
- File size information.
- Privacy message: "Your files stay on your device."

## 4. Upload PDF

Implement actual PDF upload functionality.

Requirements:
- Allow users to upload one PDF.
- Support drag and drop.
- Support Browse Files.
- Validate PDF file type.
- Validate file size.
- Display uploaded filename.
- Display file size.
- Display total page count.
- Show loading indicator while processing.
- Allow users to replace or remove the uploaded file.
- Handle corrupted and password-protected PDFs gracefully.

## 5. PDF Page Preview

After uploading, display all PDF pages as thumbnails.

Each page card should contain:
- PDF page thumbnail.
- Page number.
- Selection checkbox.
- Delete selection indicator.

Requirements:
- Generate thumbnails using PDF.js.
- Display pages in a responsive grid.
- Allow selecting individual pages.
- Highlight selected pages with a red border or subtle red background.
- Clearly distinguish selected and unselected pages.
- Support scrolling through large documents.

## 6. Page Selection Tools

Provide the following selection functionality:

### Individual Selection
- Click a page to select it for deletion.
- Click again to deselect it.

### Multiple Selection
- Select multiple pages.
- Select all pages.
- Deselect all pages.

### Page Range Selection
Provide an input field where users can enter page ranges.

Examples:
- `2-5`
- `1,3,6`
- `2-4,7,9-11`

Validate page numbers and ranges.

Display clear errors for invalid page selections.

### Selection Summary

Show:
- Total pages.
- Selected pages.
- Pages to be removed.
- Pages remaining after deletion.

Example:

Total pages: 20

Selected for deletion: 5

Remaining pages: 15

Update this information immediately whenever the user changes their selection.

## 7. Remove Pages Functionality

Create a prominent button:

"Remove Selected Pages"

When clicked:

1. Check that a PDF is uploaded.
2. Verify that at least one page is selected.
3. Prevent deleting every page, since a valid PDF must contain at least one page.
4. Ask for confirmation before deleting.
5. Load the original PDF using pdf-lib.
6. Create a new PDF document.
7. Copy all pages except the selected pages.
8. Preserve the original order of remaining pages.
9. Generate the modified PDF.
10. Update the preview to show the remaining pages.

Important:
- Actually remove pages from the PDF.
- Do not simply hide pages from the preview.
- Do not modify the original uploaded file.
- Create a separate modified PDF.

## 8. Undo and Reset

Provide:

- Undo last page deletion.
- Reset selection.
- Upload another PDF.
- Restore original PDF.

Undo should restore the previous document state without losing the original file.

## 9. Download Modified PDF

After successful deletion, display a success section.

Heading:

"Your PDF Has Been Updated!"

Display:
- Original page count.
- Number of pages removed.
- Remaining page count.
- Modified PDF filename.

Provide a prominent button:

"Download Updated PDF"

Requirements:
- Generate an actual modified PDF.
- Download the PDF to the user's device.
- Default filename: `edited-document.pdf`.
- Allow users to customize the output filename.
- Ensure the downloaded PDF opens correctly.
- Preserve remaining page content, order, dimensions, and orientation.

Also provide:
- Remove More Pages button.
- Start Over button.

## 10. Error Handling

Handle these situations:

- No PDF uploaded.
- Invalid file format.
- Corrupted PDF.
- Password-protected PDF.
- No pages selected.
- All pages selected for deletion.
- Invalid page numbers.
- Invalid page ranges.
- PDF processing failure.
- Download failure.

Display clear, helpful error messages.

## 11. Privacy and Security

- Process files entirely in the browser.
- Do not upload documents to external servers.
- Do not save PDF contents in local storage.
- Clear temporary document data when the user resets or leaves the page.
- Validate files before processing.
- Display a privacy notice explaining local processing.

## 12. Suggested Component Structure

Create reusable components:

`src/components/`
- Navbar.jsx
- Footer.jsx
- FileUpload.jsx
- PDFPageGrid.jsx
- PDFPageCard.jsx
- PageSelectionToolbar.jsx
- PageRangeInput.jsx
- SelectionSummary.jsx
- RemoveConfirmation.jsx
- DownloadSuccess.jsx

`src/pages/`
- RemovePages.jsx

`src/services/`
- removePagesService.js

`src/utils/`
- fileValidation.js
- pageRangeParser.js

Integrate the page into the existing React Router configuration.

Reuse the existing Navbar and Footer instead of creating duplicates.

## 13. Development Instructions

Build the feature incrementally.

Phase 1:
- Create the Remove Pages page UI.
- Add the PDF upload component.

Phase 2:
- Implement PDF rendering using PDF.js.
- Generate page thumbnails.
- Display page numbers.

Phase 3:
- Implement individual and multiple page selection.
- Add select all and deselect all.
- Add page range selection.

Phase 4:
- Integrate pdf-lib.
- Implement actual page deletion.
- Add undo and reset functionality.

Phase 5:
- Implement modified PDF preview.
- Implement PDF downloading.
- Add success and error notifications.

Phase 6:
- Test with different PDF documents.
- Test large PDFs.
- Test page ranges and multiple selections.
- Verify the downloaded PDF.
- Improve mobile responsiveness.

## 14. Important Rules

1. Use React and JavaScript.
2. Use pdf-lib for actual page deletion.
3. Use PDF.js for PDF previews.
4. Maintain the existing PDFPro light theme.
5. Do not introduce a backend.
6. Do not include signature functionality.
7. Do not add unrelated PDF tools.
8. Do not create fake or non-functional buttons.
9. Do not upload files to external servers.
10. Do not delete the original uploaded file.
11. Ensure all selected pages are actually removed from the downloaded PDF.
12. Do not allow users to remove every page.
13. Keep components reusable and code maintainable.
14. Test every major feature before completion.

## Final Goal

Build a professional, fully functional Remove Pages from PDF tool where users can upload a PDF, preview all pages, select individual pages or page ranges, remove unwanted pages, preview the updated document, and download the final modified PDF directly to their devices.

The entire process should happen inside the browser without registration, backend processing, or external file uploads.