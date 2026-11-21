import React from 'react';
import FileUpload from './FileUpload';
import { Shield, Sparkles, Zap, Lock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Next-Generation Browser PDF Editor</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
          Edit Your PDFs Easily, <br className="hidden sm:inline" />
          <span className="text-blue-600">Anytime, Anywhere.</span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your PDF, make changes, add text, insert images, highlight important information,
          and download your edited document in seconds.
        </p>

        {/* Upload Box Component */}
        <FileUpload />

        {/* Trust Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">100% Private</p>
              <p className="text-[11px] text-gray-500">Processed in browser</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Blazing Fast</p>
              <p className="text-[11px] text-gray-500">Zero server latency</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">No Account</p>
              <p className="text-[11px] text-gray-500">No sign-up required</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Rich Tools</p>
              <p className="text-[11px] text-gray-500">Text, images, draw</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
