import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import {
  Type,
  Eraser,
  ImagePlus,
  Highlighter,
  PenLine,
  Trash2,
  RotateCw,
  Layers,
  Download,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Type,
      title: 'Add Text',
      description: 'Insert custom text boxes anywhere on your document with customizable font families, sizes, bold, italic, and colors.',
    },
    {
      icon: Eraser,
      title: 'Edit & Replace Text',
      description: 'Cleanly whiteout or redact existing underlying text and place replacement text with matching styling right on top.',
    },
    {
      icon: ImagePlus,
      title: 'Add Images',
      description: 'Insert JPG and PNG images, company logos, stamps, and graphics onto any page with full move and resize control.',
    },
    {
      icon: Highlighter,
      title: 'Highlight Text',
      description: 'Mark critical passages with semi-transparent highlight rectangles in multiple colors and adjustable opacity.',
    },
    {
      icon: PenLine,
      title: 'Draw on PDF',
      description: 'Freehand sketching and notes with pen tools, thickness controls, custom colors, and eraser support.',
    },
    {
      icon: Trash2,
      title: 'Delete Pages',
      description: 'Remove unnecessary pages from your document with built-in confirmation to prevent accidental loss.',
    },
    {
      icon: RotateCw,
      title: 'Rotate Pages',
      description: 'Rotate individual pages 90° clockwise or counter-clockwise to fix orientation issues permanently.',
    },
    {
      icon: Layers,
      title: 'Reorder & Duplicate',
      description: 'Rearrange page sequences and clone pages effortlessly with intuitive up and down reordering controls.',
    },
    {
      icon: Download,
      title: 'Download Edited PDF',
      description: 'Export an authentic, high-quality modified PDF that opens seamlessly in all standard PDF readers.',
    },
  ];

  const faqs = [
    {
      q: 'Are my PDF documents uploaded to your servers?',
      a: 'No, absolutely not. PDFPro operates 100% in your browser using modern WebAssembly and client-side JavaScript (PDF.js and pdf-lib). Your files never leave your device.',
    },
    {
      q: 'Can I edit the existing text in my PDF?',
      a: 'Standard PDFs store text as vector glyphs. PDFPro provides a dedicated "Whiteout & Replace" tool that covers old text with a clean background matching your page and places new editable text directly over it.',
    },
    {
      q: 'Is PDFPro free to use?',
      a: 'Yes, PDFPro is completely free without limits, watermarks, or account registration requirements.',
    },
    {
      q: 'Will the downloaded file work in Adobe Acrobat and Preview?',
      a: 'Yes! PDFPro generates standardized PDF files using pdf-lib that strictly comply with ISO PDF specifications and open properly across all PDF readers.',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Features Grid Section */}
        <section className="py-20 bg-gray-50/50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                Powerful Editing Toolkit
              </h2>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Everything you need to edit PDFs in one place
              </p>
              <p className="mt-4 text-base text-gray-600">
                Experience the convenience of desktop-grade PDF editing without installing heavy software.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white p-7 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-200 transition group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                Simple 3-Step Process
              </h2>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                How It Works
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload your PDF</h3>
                <p className="text-sm text-gray-600">
                  Select or drag-and-drop your PDF into the secure editor. It loads instantly in your browser.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Edit your document</h3>
                <p className="text-sm text-gray-600">
                  Add notes, insert photos, highlight sections, whiteout old text, and reorder pages.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-lg shadow-sm mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Download your edited PDF</h3>
                <p className="text-sm text-gray-600">
                  Click Download to generate a fresh PDF containing all of your annotations and modifications.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                to="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95"
              >
                <span>Launch PDF Editor</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Privacy Highlight Banner */}
        <section className="py-16 bg-blue-50/60 border-b border-blue-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 mx-auto mb-4 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Your Privacy Is Guaranteed
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-2xl mx-auto">
              Unlike other online PDF converters and editors that upload your sensitive contracts, tax records, and documents to remote cloud servers, PDFPro processes everything right inside your browser session.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-700 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" /> Zero Server Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" /> No Data Retention
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-600" /> No Account Required
              </span>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-gray-50 border border-gray-200 shadow-2xs"
                >
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">
              PDF<span className="text-blue-600">Pro</span>
            </span>
            <span className="text-xs text-gray-500">
              – Browser-Based PDF Editor
            </span>
          </div>
          <p className="text-xs text-gray-500 text-center sm:text-right">
            © {new Date().getFullYear()} PDFPro. Processed securely on your device.
          </p>
        </div>
      </footer>
    </div>
  );
}
