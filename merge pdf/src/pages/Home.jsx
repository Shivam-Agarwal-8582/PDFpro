import React from 'react';
import { Link } from 'react-router-dom';
import { FileStack, FileEdit, ShieldCheck, Zap, Layers, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50/70 via-slate-50/40 to-white py-16 sm:py-24 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="w-4 h-4" />
            <span>Next-Generation In-Browser PDF Suite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Work with PDFs <span className="text-blue-600">Privately & Fast</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Merge, edit, and organize your PDF documents directly inside your browser. No server uploads, no privacy risks, 100% free.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/merge-pdf"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all"
            >
              <FileStack className="w-5 h-5" />
              <span>Merge PDF Files</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/edit-pdf"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-xs hover:border-slate-400 transition-all"
            >
              <FileEdit className="w-4 h-4 text-slate-500" />
              <span>Edit PDF</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered for Security and Performance
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything happens client-side using cutting-edge WebAssembly and JavaScript libraries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileStack className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Precision PDF Merge</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Combine any number of PDF files in your preferred sequence. Select specific page ranges and preserve exact original dimensions and orientation.
            </p>
            <Link to="/merge-pdf" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 pt-2">
              <span>Try Merge PDF</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% Privacy Guarantee</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your sensitive documents never leave your computer. Processing occurs locally in your browser memory and disappears when you close the tab.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Wait Time</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No slow server queues or file upload delays. Instant rendering and merging directly powered by your machine's hardware.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
