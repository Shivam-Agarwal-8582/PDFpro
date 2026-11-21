import React from 'react';
import { Upload, Sliders, Download, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Upload your PDF',
      description: 'Select your document from your computer, tablet, or phone, or simply drag and drop it into the tool workspace.',
      icon: Upload,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      step: '02',
      title: 'Choose your desired PDF operation',
      description: 'Edit text and images, arrange and merge multiple files, compress file size, or select and delete unwanted pages with ease.',
      icon: Sliders,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      step: '03',
      title: 'Download your processed PDF',
      description: 'Save your completed, high-quality PDF document instantly to your device. No watermarks, delays, or email sign-ups required.',
      icon: Download,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/60">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Transform and manage your PDF files in three easy, straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-7 h-7 stroke-[2]" />
                    </div>
                    <span className="text-3xl font-black text-slate-200">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600">
                  <span>Step {index + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
