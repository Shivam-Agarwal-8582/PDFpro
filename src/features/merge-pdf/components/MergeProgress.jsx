import React from 'react';
import { Loader2, FileStack, Sparkles } from 'lucide-react';

export default function MergeProgress({ progress }) {
  const percent = progress?.percent || 20;
  const current = progress?.current || 1;
  const total = progress?.total || 1;
  const step = progress?.step || 'Merging your PDF files...';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Animated Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/20 animate-pulse" />
        </div>

        {/* Status text */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Merging your PDF files...
          </h3>
          <p className="text-sm text-slate-600 min-h-[40px] flex items-center justify-center">
            {step}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Document {current} of {total}</span>
            <span>{percent}%</span>
          </div>
        </div>

        {/* Informative Note */}
        <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">
          Merging is performed entirely in memory on your computer.
        </p>
      </div>
    </div>
  );
}
