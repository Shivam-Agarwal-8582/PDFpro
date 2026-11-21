# Project: PDFPro – All-in-One PDF Toolkit Website

Act as an expert React.js developer and UI/UX designer. I have already developed four separate PDF tool websites inside one parent folder named `website`.

Your task is to **combine all four existing projects into one complete, professional, responsive website called PDFPro**.

Do not build four separate websites. Integrate all existing functionality into one single website with a common homepage, navigation bar, footer, and consistent design.

## 1. Existing Project Structure

My current folder structure is:

```text
website/
│
├── edit pdf/
│
├── merge pdf/
│
├── pdf-compressor/
│
└── remove page from pdf/
```

These folders contain four separate projects:

1. Edit PDF
2. Merge PDF
3. Compress PDF
4. Remove Pages from PDF

First, inspect all four projects and understand their existing code, features, dependencies, components, and functionality.

**Important:** Reuse the existing functionality. Do not unnecessarily recreate the tools from scratch.

## 2. Main Website Information

Website name: **PDFPro**

Website tagline:

"All Your PDF Tools in One Place."

Website description:

"PDFPro makes working with PDF files simple. Edit, merge, compress, and remove pages from your PDF documents using our easy-to-use online tools."

The final result must be one unified website.

## 3. Technology Stack

Use the following technologies:

- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router DOM
- pdf-lib
- PDF.js (pdfjs-dist)
- Lucide React

Reuse the existing dependencies wherever possible.

Do not introduce unnecessary technologies or dependencies.

## 4. Main Website Design

Create a modern, clean, professional LIGHT THEME.

Design requirements:

- White background.
- Light gray sections.
- Blue or indigo primary accent color.
- Dark text.
- Modern typography.
- Rounded cards.
- Subtle shadows.
- Clean spacing.
- Professional icons.
- Smooth hover animations.
- Responsive design for desktop, tablet, and mobile.

Use one consistent design system throughout the entire website.

Do not introduce dark mode.

## 5. Main Navigation Bar

Create one common navbar for the entire website.

The navbar should contain:

- PDFPro logo and website name.
- Home
- Edit PDF
- Merge PDF
- Compress PDF
- Remove Pages

All navigation links must work correctly.

The PDFPro logo should redirect users to the homepage.

On mobile devices, use a responsive hamburger menu.

Do not create separate navigation bars for individual tools.

## 6. Homepage

Create an attractive homepage for PDFPro.

### Hero Section

Heading:

"Everything You Need to Work with PDFs"

Description:

"Edit, merge, compress, and organize your PDF documents effortlessly. All your essential PDF tools in one place."

Include:

- Get Started button.
- Explore PDF Tools button.
- Attractive PDF-related illustration or graphics.

The buttons should navigate to the appropriate sections.

### PDF Tools Section

Create four attractive tool cards.

**Card 1: Edit PDF**

Description:
"Edit your PDF documents by adding text, images, highlights, and annotations."

Button: Edit PDF

Route: `/edit-pdf`

**Card 2: Merge PDF**

Description:
"Combine multiple PDF files into one document quickly and easily."

Button: Merge PDF

Route: `/merge-pdf`

**Card 3: Compress PDF**

Description:
"Reduce PDF file size while maintaining the best possible document quality."

Button: Compress PDF

Route: `/compress-pdf`

**Card 4: Remove Pages**

Description:
"Delete unwanted pages from your PDF documents with just a few clicks."

Button: Remove Pages

Route: `/remove-pages`

Each card should have:
- A suitable Lucide icon.
- Tool name.
- Short description.
- Open Tool button.
- Hover animation.

Clicking anywhere appropriate on a card should open its corresponding tool.

### How It Works Section

Display three simple steps:

1. Upload your PDF.
2. Choose your desired PDF operation.
3. Download your processed PDF.

### Why Choose PDFPro Section

Include:

- Easy to use.
- Fast PDF processing.
- Secure file handling.
- No registration required.
- Browser-based processing.
- Free access to available tools.

### Footer

Create one common footer across the website.

Include:
- PDFPro logo.
- Short website description.
- Quick links.
- All four PDF tools.
- Privacy Policy.
- Contact information section if available.

At the very bottom of the footer, display this exact copyright statement:

**All rights are reserved by Shivam Agarwal.**

Do not omit this statement.

## 7. Integrate All Four Existing Tools

This is the most important part of the project.

Integrate all four existing applications into the main PDFPro website.

### Edit PDF

Route: `/edit-pdf`

Reuse the existing Edit PDF functionality.

Users must be able to:
- Upload a PDF.
- Preview PDF pages.
- Add text.
- Add images.
- Highlight content.
- Draw on PDF pages.
- Manage pages.
- Download the edited PDF.

Preserve all existing working editing functionality.

### Merge PDF

Route: `/merge-pdf`

Reuse the existing Merge PDF functionality.

Users must be able to:
- Upload multiple PDF files.
- Preview uploaded files.
- Reorder PDF files.
- Remove uploaded files.
- Merge PDFs.
- Download the merged PDF.

Preserve all existing working merge functionality.

### Compress PDF

Route: `/compress-pdf`

Reuse the existing PDF Compressor functionality.

Users must be able to:
- Upload a PDF.
- Select compression options if implemented.
- Compress the PDF.
- Display original and compressed file sizes.
- Display the compression percentage.
- Download the compressed PDF.

Preserve the existing compression implementation and functionality.

### Remove Pages

Route: `/remove-pages`

Reuse the existing Remove Pages functionality.

Users must be able to:
- Upload a PDF.
- Preview all PDF pages.
- Select individual pages.
- Select multiple pages.
- Select page ranges.
- Remove selected pages.
- Preview the updated PDF.
- Download the modified PDF.

Preserve the existing page deletion implementation.

## 8. Project Integration and Architecture

Organize the final application into one main React application.

Use a structure similar to:

```text
PDFPro/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── ToolCard.jsx
│   │   └── HowItWorks.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── EditPDF.jsx
│   │   ├── MergePDF.jsx
│   │   ├── CompressPDF.jsx
│   │   └── RemovePages.jsx
│   │
│   ├── features/
│   │   ├── edit-pdf/
│   │   ├── merge-pdf/
│   │   ├── compress-pdf/
│   │   └── remove-pages/
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

This is a suggested structure. You may adjust it according to the existing projects.

## 9. Important Integration Instructions

Before making changes:

1. Inspect all four project folders.
2. Understand how each project currently works.
3. Identify dependencies and conflicting package versions.
4. Identify existing components and reusable functionality.
5. Identify entry points and routing configurations.

Then integrate them carefully.

Follow these rules:

- Create only one main React application.
- Use only one main `package.json`.
- Use one Vite configuration.
- Use one React Router configuration.
- Use one common Navbar.
- Use one common Footer.
- Reuse existing PDF processing logic.
- Avoid duplicate components.
- Avoid duplicate application entry points.
- Resolve dependency conflicts.
- Keep the four PDF tools in separate feature folders.
- Do not break existing functionality.
- Do not remove working features.
- Do not create placeholder implementations for working features.

If the existing projects use different configurations, adapt them carefully to work within the main PDFPro application.

## 10. Routing Requirements

Implement React Router DOM.

The following routes must work:

| Route | Page |
|---|---|
| `/` | Homepage |
| `/edit-pdf` | Edit PDF |
| `/merge-pdf` | Merge PDF |
| `/compress-pdf` | Compress PDF |
| `/remove-pages` | Remove Pages |

Requirements:

- Navigation must work without page errors.
- Browser refresh must work on every route.
- The navbar and footer should remain consistent.
- Each tool should have its own page.
- Add a custom 404 page for invalid routes.
- Add a Back to Home button on the 404 page.

## 11. Functionality and Privacy

- All existing PDF operations must remain functional.
- Process PDF files in the browser wherever the existing implementation supports it.
- Do not introduce unnecessary server uploads.
- Do not store users' PDF documents permanently.
- Handle invalid and corrupted PDFs.
- Display appropriate loading indicators.
- Display success and error messages.
- Make all buttons functional.
- Allow users to download their processed PDF files.

Do not add any signature or e-signature feature.

## 12. Responsive Design

Ensure the website works correctly on:

- Desktop.
- Laptop.
- Tablet.
- Mobile phones.

The tool cards should automatically adjust their layout according to screen size.

PDF editing workspaces should remain usable on smaller screens.

## 13. Testing Requirements

After integration, test every route and tool.

Verify:

- Homepage loads correctly.
- Navbar navigation works.
- Edit PDF works.
- Merge PDF works.
- Compress PDF works.
- Remove Pages works.
- PDF previews render correctly.
- Download buttons generate actual PDF files.
- No existing functionality is broken.
- No duplicate navbar or footer appears.
- No console errors.
- No dependency or build errors.
- All routes work after refreshing the browser.

Run the production build and fix any errors before considering the project complete.

## 14. Deployment Preparation

Prepare the unified PDFPro application for deployment.

Requirements:

- One production build.
- One deployment configuration.
- Correct React Router fallback configuration for direct route access.
- Correct asset paths.
- Environment variables only if actually required.
- A README explaining installation and deployment.

The final website should be deployable as one project on platforms such as Vercel or Netlify.

## 15. Final Goal

Transform my four existing separate projects:

1. Edit PDF
2. Merge PDF
3. Compress PDF
4. Remove Pages from PDF

Into one professional, fully functional website named **PDFPro**.

The homepage should allow users to choose any PDF tool, use it on its dedicated route, and download the processed PDF.

Maintain the existing functionality, use one common design, and make the complete website feel like one unified product.

**Website Name: PDFPro**

**Tagline: All Your PDF Tools in One Place.**

**Footer Copyright: All rights are reserved by Shivam Agarwal.**

Do not just provide instructions or sample code. Inspect the existing projects and implement the complete integration in the actual codebase.