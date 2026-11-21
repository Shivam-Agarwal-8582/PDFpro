import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, TrendingDown, ArrowDownRight, Layers, Image, HardDrive, FileCheck } from 'lucide-react';
import { formatBytes } from '../services/compressionService';
import DownloadButton from './DownloadButton';

export default function CompressionResults({ result, onCompressAnother }) {
  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti not supported
    }
  }, []);

  if (!result) return null;

  const {
    originalSize,
    compressedSize,
    savedSize,
    compressionRatio,
    compressionLevel,
    compressedFileName,
    downloadUrl,
    pagesCount,
    imagesOptimized
  } = result;

  const levelDisplay = {
    low: 'Low Compression (Max Quality)',
    recommended: 'Recommended Compression (Balanced)',
    high: 'Extreme Compression (Smallest File)'
  }[compressionLevel] || compressionLevel;

  return (
    <div className="w-full space-y-6">
      {/* Top Success Banner */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Your PDF is {compressionRatio}% smaller!
        </h2>
        <p className="text-emerald-700 text-sm mt-1 max-w-md">
          Successfully compressed with <strong>{levelDisplay}</strong>. All text, fonts, and pages preserved.
        </p>

        {/* Big Action Download Area */}
        <div className="mt-6 w-full max-w-md">
          <DownloadButton
            downloadUrl={downloadUrl}
            fileName={compressedFileName}
            onCompressAnother={onCompressAnother}
          />
        </div>
      </div>

      {/* Metrics Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Original Size */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Original Size
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-800">
            {formatBytes(originalSize)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Uncompressed file</span>
        </div>

        {/* Compressed Size */}
        <div className="bg-white rounded-2xl border border-indigo-100 p-4 sm:p-5 shadow-sm bg-gradient-to-br from-indigo-50/30 to-white">
          <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider block mb-1">
            Compressed Size
          </span>
          <div className="text-xl sm:text-2xl font-bold text-indigo-600">
            {formatBytes(compressedSize)}
          </div>
          <span className="text-[11px] text-indigo-400 mt-1 block">New file size</span>
        </div>

        {/* Space Saved */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-4 sm:p-5 shadow-sm bg-gradient-to-br from-emerald-50/30 to-white">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
            Space Saved
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 flex items-center gap-1">
            <ArrowDownRight className="w-5 h-5 text-emerald-500 shrink-0" />
            {formatBytes(savedSize)}
          </div>
          <span className="text-[11px] text-emerald-600/70 mt-1 block">Reduction amount</span>
        </div>

        {/* Compression % */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Total Reduction
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-1">
            <TrendingDown className="w-5 h-5 text-indigo-500 shrink-0" />
            {compressionRatio}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Efficiency ratio</span>
        </div>
      </div>

      {/* Visual Size Comparison Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-800">
          Size Comparison Visualizer
        </h4>

        {/* Original */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
            <span>Before (Original)</span>
            <span>{formatBytes(originalSize)} (100%)</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-slate-400 h-full w-full rounded-full" />
          </div>
        </div>

        {/* Compressed */}
        <div>
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
            <span className="text-indigo-600 font-semibold">After (Compressed)</span>
            <span className="text-indigo-600 font-semibold">
              {formatBytes(compressedSize)} ({Math.max(1, Math.round((compressedSize / (originalSize || 1)) * 100))}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.max(5, Math.min(100, (compressedSize / (originalSize || 1)) * 100))}%`
              }}
            />
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
          {pagesCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>{pagesCount} {pagesCount === 1 ? 'Page' : 'Pages'}</span>
            </div>
          )}
          {imagesOptimized > 0 && (
            <div className="flex items-center gap-1.5">
              <Image className="w-4 h-4 text-slate-400" />
              <span>{imagesOptimized} {imagesOptimized === 1 ? 'Image' : 'Images'} re-encoded</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-emerald-500" />
            <span>100% PDF standard compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
