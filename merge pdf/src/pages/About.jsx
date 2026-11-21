import React from 'react';
import { ShieldCheck, Lock, Heart, Award, Cpu } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            About PDFPro
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base leading-relaxed">
            PDFPro was built on a simple conviction: document utilities shouldn't compromise your privacy or sell your confidential data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Private by Architecture</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Most online PDF tools upload your sensitive tax forms, contracts, and IDs to remote servers. PDFPro runs 100% inside your client browser using WebAssembly.
            </p>
          </div>

          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Modern Browser Tech</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Powered by pdf-lib, PDF.js, Vite, and Tailwind CSS. We deliver desktop-grade performance without heavy installs or server dependencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
