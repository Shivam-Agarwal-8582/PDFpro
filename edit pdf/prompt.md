# Project: PDFPro – Online PDF Editor

Act as an expert React.js developer and UI/UX designer. Build a modern, professional, fully functional PDF editing website named **PDFPro**.

The main purpose of this website is to allow users to upload an existing PDF, edit its contents using different editing tools, and download the edited PDF to their devices.

## 1. Technology Stack

Use:
- React.js with Vite
- JavaScript (not TypeScript)
- Tailwind CSS
- React Router DOM
- PDF.js (pdfjs-dist) to render PDF documents
- pdf-lib to modify and export PDFs
- Lucide React for icons

Initially, build the complete application without a backend. Perform PDF processing directly inside the browser. Do not upload PDF documents to external servers.

## 2. Website Theme and Design

Use a strictly LIGHT THEME throughout the entire website.

Design requirements:
- White background.
- Light gray secondary backgrounds.
- Blue or indigo primary accent color.
- Dark gray or black text.
- Subtle borders and shadows.
- Rounded cards and buttons.
- Clean and minimal layouts.
- Professional typography.
- Smooth transitions and hover effects.
- Fully responsive design.

Do not use dark mode or dark backgrounds.

The website should look like a premium SaaS product, inspired by modern PDF editing applications.

## 3. Homepage

Create a professional landing page.

### Navbar
- PDFPro logo.
- Home.
- Edit PDF.
- About.
- Get Started button.

### Hero Section

Main heading:
"Edit Your PDFs Easily, Anytime, Anywhere."

Description:
"Upload your PDF, make changes, add text, insert images, highlight important information, and download your edited document in seconds."

Include:
- Large drag-and-drop PDF upload area.
- Browse Files button.
- PDF file type validation.
- Maximum file size information.
- Privacy message: "Your files stay on your device."

### Features Section

Display feature cards for:
- Add Text.
- Edit Text (where technically supported).
- Add Images.
- Highlight Text.
- Draw on PDF.
- Delete Pages.
- Rotate Pages.
- Reorder Pages.
- Download Edited PDF.

### How It Works
1. Upload your PDF.
2. Edit your document.
3. Download your edited PDF.

## 4. PDF Editor Workspace

This is the main functionality of the application.

After the user uploads a PDF, open a dedicated PDF editor workspace.

Create a clean, professional editing interface.

### Editor Layout

**Top Toolbar:**
- Document filename.
- Undo.
- Redo.
- Zoom In.
- Zoom Out.
- Save Changes.
- Download PDF.

**Left Sidebar:**
- Display PDF page thumbnails.
- Show page numbers.
- Select pages.
- Add blank pages.
- Delete pages.
- Duplicate pages.
- Reorder pages using drag and drop.

**Center Workspace:**
- Display PDF pages using PDF.js.
- Support zooming and scrolling.
- Allow users to select editing tools.
- Allow users to place text and images.
- Display editing elements at the correct positions.
- Support page navigation.

**Right Sidebar:**
- Text formatting options.
- Font family.
- Font size.
- Bold and italic.
- Text color.
- Background color.
- Alignment.
- Image dimensions.
- Drawing properties.

## 5. PDF Editing Features

Implement the following actual functionalities:

### A. Add Text
- Click anywhere on the PDF page to insert text.
- Enter and edit text.
- Change font size.
- Change font color.
- Change font family.
- Bold and italic formatting.
- Drag and reposition text.
- Delete inserted text.

### B. Edit Existing Text
- Support selecting and editing existing PDF text where technically possible.
- Clearly distinguish editable text from scanned or image-based content.
- Do not pretend that overlaying new text changes the original underlying PDF text.
- For unsupported documents, provide a suitable alternative such as placing a white background over old text and adding replacement text.

### C. Add Images
- Upload JPG and PNG images.
- Insert images into PDF pages.
- Resize images.
- Move images.
- Delete images.

### D. Highlight
- Highlight important areas.
- Provide multiple highlight colors.
- Allow users to change highlight opacity.

### E. Draw
- Freehand drawing with mouse and touchscreen.
- Change pen color.
- Change pen thickness.
- Erase drawings.

### F. Page Management
- Rotate pages clockwise and anticlockwise.
- Delete pages.
- Add blank pages.
- Duplicate pages.
- Rearrange pages.
- Select multiple pages where supported.

### G. Undo and Redo
- Maintain editing history.
- Undo previous actions.
- Redo undone actions.

**Do not include any signature feature, signature tool, or e-sign functionality anywhere in the application.**

## 6. Download Edited PDF

This is a mandatory feature.

After editing, users must be able to download the final modified PDF.

Requirements:
- Use pdf-lib to generate the modified PDF.
- Include inserted text, images, highlights, drawings, and page changes.
- Preserve original PDF content wherever possible.
- Provide a Download PDF button in the editor toolbar.
- Generate a real downloadable PDF file.
- Use a meaningful filename such as edited-document.pdf.
- Ensure the downloaded file opens correctly in standard PDF readers.
- Do not download the original unchanged PDF when the user has made edits.

## 7. File Upload

Implement:
- Drag-and-drop upload.
- Browse files.
- PDF validation.
- File size validation.
- Display uploaded filename.
- Display file size.
- Loading indicator.
- Error handling for corrupted or unsupported PDFs.
- Remove or replace uploaded PDF.

## 8. User Experience

Make sure:
- All buttons perform their intended actions.
- All editing tools work.
- PDF pages render correctly.
- Editing elements remain in the correct positions when zooming.
- The user can switch between editing tools.
- Changes are reflected in the final downloaded PDF.
- Display success and error notifications.
- Add confirmation before deleting pages.
- Support desktop, tablet, and mobile screens.
- Provide an empty state before uploading a PDF.

## 9. Privacy

- Process PDF files in the browser.
- Do not send documents to external servers.
- Do not save PDF contents in local storage.
- Clear document data when the user resets or closes the editor.
- Display a privacy message on the upload page.

## 10. Suggested Folder Structure

pdf-editor/
|
|-- public/
|
|-- src/
|   |
|   |-- components/
|   |   |-- Navbar.jsx
|   |   |-- Hero.jsx
|   |   |-- FileUpload.jsx
|   |   |-- PDFViewer.jsx
|   |   |-- EditorToolbar.jsx
|   |   |-- PageSidebar.jsx
|   |   |-- TextEditor.jsx
|   |   |-- ImageEditor.jsx
|   |   |-- DrawingTool.jsx
|   |   |-- PropertiesPanel.jsx
|   |
|   |-- pages/
|   |   |-- Home.jsx
|   |   |-- Editor.jsx
|   |
|   |-- services/
|   |   |-- pdfService.js
|   |   |-- exportService.js
|   |
|   |-- context/
|   |   |-- PDFContext.jsx
|   |
|   |-- hooks/
|   |
|   |-- utils/
|   |
|   |-- App.jsx
|   |-- main.jsx

## 11. Development Phases

Build the application step by step.

Phase 1:
- Setup React with Vite.
- Install dependencies.
- Configure Tailwind CSS.
- Create the light-theme homepage.
- Create navbar and upload component.

Phase 2:
- Implement PDF upload.
- Display PDF using PDF.js.
- Build the editor workspace.
- Implement page thumbnails and navigation.

Phase 3:
- Implement adding text.
- Implement adding images.
- Implement highlighting.
- Implement drawing.
- Implement page management.

Phase 4:
- Implement undo and redo.
- Implement PDF export using pdf-lib.
- Implement actual PDF downloading.
- Verify that all changes are present in the downloaded file.

Phase 5:
- Test the complete application.
- Fix UI and functionality bugs.
- Improve responsive design.
- Handle errors and edge cases.

## 12. Important Instructions

1. Build a fully functional PDF editor, not just a static UI.
2. Use React components instead of putting everything in one file.
3. Use JavaScript, not TypeScript.
4. Maintain a consistent light theme on every page.
5. Do not add dark mode.
6. Do not include signature or e-signature functionality.
7. Do not add unrelated PDF conversion tools.
8. Do not create fake or non-functional buttons.
9. Ensure that editing changes are included in the downloaded PDF.
10. Keep the original PDF unchanged and generate a separate edited copy.
11. Use clean, reusable, maintainable code.
12. Explain the purpose of each major component.
13. Start with Phase 1 and proceed incrementally.
14. Test each feature before moving to the next phase.

**Final Goal:**

Build a beautiful, responsive, light-themed online PDF editor where users can upload a PDF, edit it directly in their browser using text, image, highlighting, drawing, and page management tools, and download the final edited PDF without creating an account or uploading their documents to a server.