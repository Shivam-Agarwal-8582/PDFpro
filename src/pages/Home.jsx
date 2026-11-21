import React from 'react';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import HowItWorks from '../components/HowItWorks';
import {
  FileEdit,
  Layers,
  Minimize2,
  Trash2,
  CheckCircle2,
  Shield,
  Zap,
  Lock,
  Globe,
  Smile,
  Check,
  HelpCircle,
} from 'lucide-react';

export default function Home() {
  const tools = [
    {
      title: 'Edit PDF',
      description: 'Edit your PDF documents by adding text, images, highlights, and annotations.',
      route: '/edit-pdf',
      buttonText: 'Edit PDF',
      icon: FileEdit,
      badge: 'Editor',
      colorClass: 'bg-blue-50 text-blue-600 shadow-blue-100',
    },
    {
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into one document quickly and easily.',
      route: '/merge-pdf',
      buttonText: 'Merge PDF',
      icon: Layers,
      badge: 'Combine',
      colorClass: 'bg-indigo-50 text-indigo-600 shadow-indigo-100',
    },
    {
      title: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining the best possible document quality.',
      route: '/compress-pdf',
      buttonText: 'Compress PDF',
      icon: Minimize2,
      badge: 'Optimizer',
      colorClass: 'bg-emerald-50 text-emerald-600 shadow-emerald-100',
    },
    {
      title: 'Remove Pages',
      description: 'Delete unwanted pages from your PDF documents with just a few clicks.',
      route: '/remove-pages',
      buttonText: 'Remove Pages',
      icon: Trash2,
      badge: 'Organizer',
      colorClass: 'bg-rose-50 text-rose-600 shadow-rose-100',
    },
  ];

  const whyChooseFeatures = [
    {
      title: 'Easy to use',
      description: 'Clean, intuitive interfaces designed for instant productivity with zero learning curve.',
      icon: Smile,
    },
    {
      title: 'Fast PDF processing',
      description: 'Near-instantaneous operations powered by client-side WebAssembly and modern PDF engines.',
      icon: Zap,
    },
    {
      title: 'Secure file handling',
      description: 'Your documents never leave your browser. Private processing guarantees 100% confidentiality.',
      icon: Shield,
    },
    {
      title: 'No registration required',
      description: 'No account creation, passwords, subscriptions, or personal email addresses necessary.',
      icon: Lock,
    },
    {
      title: 'Browser-based processing',
      description: 'Works entirely in modern web browsers on macOS, Windows, Linux, iOS, and Android.',
      icon: Globe,
    },
    {
      title: 'Free access to available tools',
      description: 'Enjoy unlimited use of all our essential PDF toolkit features without sneaky paywalls.',
      icon: CheckCircle2,
    },
  ];

  const faqs = [
    {
      q: 'Are my PDF documents uploaded to an external server?',
      a: 'No. PDFPro processes files directly in your web browser using modern WebAssembly and JavaScript technologies. Your private documents never leave your computer.',
    },
    {
      q: 'Can I reorder or rotate pages in the PDF Editor?',
      a: 'Yes! The Edit PDF workspace includes a sidebar that lets you rotate individual pages by 90°, delete unwanted pages, and reorder them before downloading.',
    },
    {
      q: 'Is there a limit on how many files I can merge?',
      a: 'You can merge as many PDF files as your browser memory can handle comfortably. Reorder them and select custom page ranges per file anytime.',
    },
    {
      q: 'Will compressed PDFs lose readable text quality?',
      a: 'No. PDFPro preserves vector fonts, glyphs, and structural layout intact while intelligently optimizing embedded graphics and deduplicating objects.',
    },
  ];

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. PDF Tools Section */}
      <section id="tools" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Essential PDF Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore All PDF Tools
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Select an operation below to start working on your PDF document immediately.
          </p>
        </div>

        {/* 4 Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {tools.map((tool) => (
            <ToolCard
              key={tool.route}
              title={tool.title}
              description={tool.description}
              route={tool.route}
              buttonText={tool.buttonText}
              icon={tool.icon}
              badge={tool.badge}
              colorClass={tool.colorClass}
            />
          ))}
        </div>
      </section>

      {/* 3. How It Works Section */}
      <HowItWorks />

      {/* 4. Why Choose PDFPro Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Why Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Choose PDFPro
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Designed for speed, security, and simplicity without compromising quality or privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyChooseFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Frequently Asked Questions Section */}
      <section className="py-20 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base text-slate-600">
              Common questions about working with PDFs on PDFPro.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-2"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                  <h4 className="text-base font-bold text-slate-900">{faq.q}</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed pl-7.5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
