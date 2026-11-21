import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  Mail,
  Lock,
  Layers,
  Minimize2,
  Trash2,
  FileEdit,
  ArrowRight,
  ExternalLink,
  X,
} from 'lucide-react';

export default function Footer() {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group inline-flex">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                PDF<span className="text-indigo-400">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              PDFPro makes working with PDF files simple. Edit, merge, compress, and remove pages from your PDF documents using our easy-to-use online tools.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% In-Browser & Private Processing</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/edit-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Edit PDF
                </Link>
              </li>
              <li>
                <Link to="/merge-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/compress-pdf" className="text-slate-400 hover:text-white transition-colors">
                  Compress PDF
                </Link>
              </li>
              <li>
                <Link to="/remove-pages" className="text-slate-400 hover:text-white transition-colors">
                  Remove Pages
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPrivacyModalOpen(true)}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* PDF Tools */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              All PDF Tools
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/edit-pdf"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <FileEdit className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                  <span>PDF Editor</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/merge-pdf"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                  <span>Merge PDFs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/compress-pdf"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                  <span>PDF Compressor</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/remove-pages"
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                  <span>Remove Pages</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Security */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact & Support
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Have questions, feedback, or need help with a document? Reach out to our team anytime.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <a
                  href="mailto:pdfpro.shivam@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  pdfpro.shivam@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Client-Side Security Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Required Copyright Notice */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-medium text-slate-300">
            All rights are reserved by Shivam Agarwal.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPrivacyModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Privacy & Security
            </button>
            <span>•</span>
            <span>PDFPro v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 text-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Privacy & Security Notice</h4>
                <p className="text-xs text-slate-500">Your documents stay safe with you</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p>
                At <strong>PDFPro</strong>, document privacy and confidentiality are built into the architecture. All PDF editing, merging, page deletion, and local compression run directly inside your web browser using client-side WebAssembly and JavaScript engines.
              </p>
              <p>
                <strong>No Permanent Storage:</strong> We do not store, copy, share, or read your PDF documents. Your files never leave your computer or browser environment during processing.
              </p>
              <p>
                <strong>No Registration Required:</strong> Use all PDF tools instantly without signing in or providing personal email addresses.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
