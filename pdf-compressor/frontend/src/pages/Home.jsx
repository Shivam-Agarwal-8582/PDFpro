import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileDown,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  ArrowRight,
  UploadCloud,
  Sliders,
  Download
} from 'lucide-react';

export default function Home() {
  const steps = [
    {
      num: '01',
      title: 'Select PDF File',
      desc: 'Drag and drop your PDF or browse from your desktop, tablet, or phone.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Choose Compression',
      desc: 'Select Low, Recommended, or High compression according to your needs.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Download Optimized PDF',
      desc: 'Instant genuine compression with detailed size reduction metrics.',
      icon: Download,
    },
  ];

  const faqs = [
    {
      q: 'How does PDF compression actually work?',
      a: 'PDF documents frequently contain unoptimized high-resolution images, duplicate font definitions, and uncompressed content streams. DocPress re-encodes embedded bitmaps, deduplicates identical objects, applies Flate compression to operators, and removes redundant metadata without altering visible text layout.'
    },
    {
      q: 'Will my text or layout be altered?',
      a: 'No. The compression engine only optimizes resource streams and raster graphics. Vector curves, fonts, bookmarks, form fields, and text glyphs are untouched, ensuring crystal-clear readability.'
    },
    {
      q: 'Is it completely safe and private?',
      a: 'Yes. We respect your confidentiality. Uploaded and compressed files are processed securely over TLS and are permanently deleted automatically after 60 minutes. We never view, log, or sell document contents.'
    },
    {
      q: 'What is the maximum upload file size?',
      a: 'You can upload PDF files up to 50 MB completely free without registering an account.'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-blue-200/40 blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Fast, Free & Professional PDF Compression</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Compress PDF Files Online <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700">
              Without Quality Loss
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reduce your PDF file size while maintaining pristine document readability. Genuine image re-encoding, stream optimization, and zero sign-up required.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/compress"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <FileDown className="w-5 h-5" />
              <span>Select PDF to Compress</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-6 py-4 rounded-xl text-base font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>See How It Works</span>
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Registration
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" /> Auto-deleted in 1 Hour
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 256-Bit SSL Encrypted
            </span>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Simple 3-Step Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            How to Compress Your PDF Document
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Optimizing heavy PDF files only takes a few seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative group hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="text-4xl font-extrabold text-slate-200 group-hover:text-indigo-100 transition-colors mb-4">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              Engineered For Quality
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 text-white">
              Why Choose Our PDF Compressor?
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              Unlike simplistic tools, we genuinely inspect, downsample, and compress your document.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Genuine Compression</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Images are re-encoded using Pillow and Lanczos downsampling, while content streams are compressed with Flate encoding.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Guaranteed Privacy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your documents are never permanently stored. Everything is cleaned up automatically after 1 hour.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-2">Three Flexible Modes</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Select between Low, Recommended, and High compression profiles depending on whether quality or tiny file size matters most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-xs uppercase tracking-widest mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Got Questions? We Have Answers
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">
                {faq.q}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
            Ready to Compress Your PDF?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mb-6">
            Join thousands of users who reduce file sizes quickly, securely, and completely free.
          </p>
          <Link
            to="/compress"
            className="px-8 py-4 rounded-xl text-base font-bold text-indigo-600 bg-white hover:bg-slate-100 shadow-md active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>Compress PDF Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
