import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export default function Hero() {
  const scrollToTools = () => {
    const el = document.getElementById('tools');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-slate-50/30 to-white pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-200/60">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subheading & CTAs */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/70 border border-indigo-200/60 text-indigo-800 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>All-in-One Professional PDF Toolkit</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Everything You Need to <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Work with PDFs</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Edit, merge, compress, and organize your PDF documents effortlessly. All your essential PDF tools in one place.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/edit-pdf"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={scrollToTools}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold text-base border border-slate-300/80 shadow-xs active:scale-98 transition flex items-center justify-center gap-2"
              >
                <span>Explore PDF Tools</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200/70 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% In-Browser Privacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Instant Processing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>No Registration Required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Graphic / Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Card Graphic */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 relative z-10 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400">PDFPro Workspace</span>
                </div>

                {/* PDF Simulation Box */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs shrink-0">
                      PDF
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">Annual_Report_2026.pdf</p>
                      <p className="text-xs text-slate-400">12 Pages • 2.4 MB</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-slate-200/70 text-center space-y-1">
                      <span className="text-[11px] text-slate-400 block font-medium">Original</span>
                      <span className="text-sm font-bold text-slate-700">2.4 MB</span>
                    </div>
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
                      <span className="text-[11px] text-indigo-500 block font-medium">Compressed</span>
                      <span className="text-sm font-bold text-indigo-600">680 KB (-72%)</span>
                    </div>
                  </div>
                </div>

                {/* Tool Badges List */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Add Text, Images & Annotations
                    </span>
                    <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded">Editor</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Merge Multiple Documents
                    </span>
                    <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded">Merge</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 p-2 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Extract & Delete Unwanted Pages
                    </span>
                    <span className="text-[10px] bg-slate-200/70 text-slate-600 px-1.5 py-0.5 rounded">Pages</span>
                  </div>
                </div>
              </div>

              {/* Floating decorative cards */}
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-200 text-xs font-bold text-indigo-600 flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Zero Server Uploads</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
