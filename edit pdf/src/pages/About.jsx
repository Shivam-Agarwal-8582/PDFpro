import React from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, Cpu, Code2, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              About <span className="text-blue-600">PDFPro</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A modern, high-performance, strictly light-themed online PDF editor engineered for speed, privacy, and simplicity.
            </p>
          </div>

          {/* Core Values Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                100% Client-Side Privacy
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your documents never leave your browser. All PDF rendering, text addition, highlighting, and export operations happen locally in memory.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Zero Cloud Latency
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Without server upload delays, file size bottlenecks, or backend queues, edits happen instantly with zero waiting time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Standard Compliant
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Exported files are generated using pdf-lib adhering to standard ISO 32000 PDF specifications, opening reliably in Acrobat, Preview, Chrome, and iOS.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                No Sign-Up or Tracking
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Enjoy immediate access without creating accounts, providing email addresses, or dealing with intrusive ads and subscription gates.
              </p>
            </div>
          </div>

          {/* Technical Architecture */}
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xs mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Architecture & Technology Stack
            </h2>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p>
                <strong>React.js & Vite:</strong> For an ultra-fast, reactive user experience and smooth canvas state management.
              </p>
              <p>
                <strong>PDF.js (pdfjs-dist):</strong> Mozilla's industry-standard library to parse and render PDF pages directly to HTML5 Canvas elements with device pixel ratio scaling.
              </p>
              <p>
                <strong>pdf-lib:</strong> JavaScript PDF manipulation engine that embeds fonts, shapes, highlights, images, and drawings into a new standalone PDF binary.
              </p>
              <p>
                <strong>Tailwind CSS:</strong> Delivering a clean, modern, accessible light-theme design system.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/editor"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95"
            >
              <span>Get Started with PDFPro</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
