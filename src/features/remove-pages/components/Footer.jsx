import React from 'react';
import { Shield, Lock, Cpu, Heart, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      {/* Privacy Highlights Bar */}
      <div className="border-b border-gray-100 bg-gray-50/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Your Files Stay on Your Device</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Documents are processed directly in your web browser. Nothing is ever uploaded to any external server or cloud storage.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg mt-0.5">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Fast WebAssembly Engine</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  High-speed PDF rendering and page deletion powered by client-side PDF.js and pdf-lib for instant results.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Zero Logs & No Registration</h4>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  No account, email, or cookies required. All temporary memory is automatically freed when you close or reload the tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              P
            </div>
            <div>
              <span className="text-base font-bold text-gray-900">
                PDF<span className="text-indigo-600">Pro</span>
              </span>
              <p className="text-xs text-gray-500">
                Professional browser-based document utilities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100% Free to Use
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No Watermarks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Preserves Quality & Order
            </span>
          </div>

          <div className="text-xs text-gray-400 text-center md:text-right">
            &copy; {new Date().getFullYear()} PDFPro Suite. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
