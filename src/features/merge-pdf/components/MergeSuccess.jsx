import React from 'react';
import { CheckCircle2, Download, ExternalLink, RotateCcw, FileText, Check } from 'lucide-react';
import { formatBytes } from '../utils/fileValidation';

export default function MergeSuccess({ result, onReset }) {
  const { blob, totalPages, fileCount, downloadUrl, fileName } = result;

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName || 'merged-document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenPreview = () => {
    if (!downloadUrl) return;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg shadow-blue-500/5 max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-300">
      {/* Success Badge */}
      <div className="mx-auto w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce-short">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Your PDFs have been merged!
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          All selected documents and page ranges have been combined into a single, high-quality PDF.
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Documents
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {fileCount} Files
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Pages
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {totalPages} Pages
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Output Size
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-900">
            {formatBytes(blob?.size || 0)}
          </span>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Filename
          </span>
          <span className="text-sm font-bold text-slate-900 truncate block" title={fileName}>
            {fileName}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        {/* Main Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download Merged PDF</span>
        </button>

        {/* Preview Button */}
        <button
          type="button"
          onClick={handleOpenPreview}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors border border-slate-200 cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Preview in New Tab</span>
        </button>
      </div>

      {/* Start Another Merge Button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Merge More PDFs</span>
        </button>
      </div>
    </div>
  );
}
