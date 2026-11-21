import React from 'react';
import { Link } from 'react-router-dom';
import { FileStack, ShieldCheck, Lock, Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <FileStack className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                PDF<span className="text-blue-600">Pro</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Professional, client-side PDF utility suite. Fast, private, and secure document manipulation directly within your modern web browser.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% In-Browser</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>No Server Uploads</span>
              </div>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/merge-pdf" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link to="/edit-pdf" className="text-slate-600 hover:text-blue-600 transition-colors">
                  Edit PDF
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Split PDF <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">
                  Compress PDF <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Soon</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Security & About */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Privacy & Info
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-600 hover:text-blue-600 transition-colors">
                  About PDFPro
                </Link>
              </li>
              <li>
                <span className="text-slate-600">
                  Client-side WebAssembly & JS
                </span>
              </li>
              <li>
                <span className="text-slate-600">
                  Zero Data Tracking
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PDFPro. Free & Open Client-Side PDF Tools.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Built with precision for speed and privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
