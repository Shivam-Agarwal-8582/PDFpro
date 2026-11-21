import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Uploading PDF securely to processing engine...',
  'Analyzing document tree and embedded resources...',
  'Re-encoding embedded images and color streams...',
  'Deduplicating identical objects and font tables...',
  'Finalizing genuine compressed document...'
];

export default function CompressionProgress({ progress, statusMessage }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Step forward dynamically as progress advances
    if (progress < 25) {
      setCurrentStepIndex(0);
    } else if (progress < 45) {
      setCurrentStepIndex(1);
    } else if (progress < 70) {
      setCurrentStepIndex(2);
    } else if (progress < 90) {
      setCurrentStepIndex(3);
    } else {
      setCurrentStepIndex(4);
    }
  }, [progress]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-1">
          Compressing Your PDF
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          Please wait while our engine optimizes your file...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-3 border border-slate-200/60">
          <div
            className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>

        <div className="w-full flex justify-between items-center text-xs font-semibold text-slate-600 mb-6">
          <span>{statusMessage || STEPS[currentStepIndex]}</span>
          <span className="text-indigo-600">{progress}%</span>
        </div>

        {/* Processing step indicators */}
        <div className="w-full space-y-2 text-left pt-4 border-t border-slate-100">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-2.5 text-xs transition-colors ${
                  isCompleted
                    ? 'text-emerald-700 font-medium'
                    : isCurrent
                    ? 'text-indigo-600 font-semibold'
                    : 'text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-slate-300'
                    }`}
                  >
                    {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />}
                  </div>
                )}
                <span>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
