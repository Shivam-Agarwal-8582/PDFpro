import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  FileCheck,
  PlusCircle,
  Undo2,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadPdf } from '../services/removePagesService';

export default function DownloadSuccess({
  modifiedBytes,
  originalCount,
  removedCount,
  remainingCount,
  defaultFilename,
  onRemoveMore,
  onStartOver,
  onUndo,
  canUndo,
  thumbnails,
}) {
  const [filename, setFilename] = useState(
    defaultFilename || 'edited-document.pdf'
  );
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, []);

  const handleDownload = () => {
    downloadPdf(modifiedBytes, filename);
    setIsDownloaded(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 px-6 py-10 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 opacity-40 backdrop-blur-3xl" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-lg mb-4 animate-in zoom-in-50 duration-200">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Your PDF Has Been Updated!
            </h2>
            <p className="mt-2 text-sm sm:text-base text-emerald-50 max-w-lg leading-relaxed">
              Unwanted pages have been removed cleanly. Your updated document is ready to download.
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 bg-gray-50/70 border-b border-gray-100">
          <div className="p-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Original Pages
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-800">
              {originalCount}
            </div>
          </div>

          <div className="p-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-600">
              Pages Removed
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-red-600">
              -{removedCount}
            </div>
          </div>

          <div className="p-6 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Remaining Pages
            </span>
            <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {remainingCount}
            </div>
          </div>
        </div>

        {/* Download Section Body */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Filename Customization */}
          <div className="max-w-lg mx-auto space-y-2">
            <label
              htmlFor="pdf-filename"
              className="block text-xs font-bold uppercase tracking-wider text-gray-700"
            >
              Output File Name
            </label>
            <div className="relative">
              <input
                id="pdf-filename"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-medium text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                .pdf
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              You can edit the filename above before saving to your device.
            </p>
          </div>

          {/* Prominent Download Button */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-base shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Download className="w-5 h-5" />
              <span>Download Updated PDF</span>
            </button>

            {isDownloaded && (
              <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold animate-in fade-in">
                <FileCheck className="w-4 h-4" />
                <span>Downloaded successfully! Check your downloads folder.</span>
              </div>
            )}
          </div>

          {/* Remaining Pages Mini Preview */}
          {thumbnails && thumbnails.length > 0 && (
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>Preview Remaining Pages ({thumbnails.length})</span>
                </h4>
                <span className="text-xs text-gray-500">Preserved in original order</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1">
                {thumbnails.map((thumb, idx) => (
                  <div
                    key={idx}
                    className="shrink-0 w-28 bg-gray-50 rounded-lg border border-gray-200 p-1.5 text-center shadow-xs"
                  >
                    <div className="aspect-[3/4] bg-white rounded overflow-hidden mb-1.5 border border-gray-100">
                      <img
                        src={thumb}
                        alt={`Remaining page ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600">
                      Page {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Action Buttons */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3 text-xs">
            {canUndo && (
              <button
                type="button"
                onClick={onUndo}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-semibold transition-colors shadow-xs"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo Deletion</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRemoveMore}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-700 font-semibold transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Remove More Pages</span>
            </button>

            <button
              type="button"
              onClick={onStartOver}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 font-semibold transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
