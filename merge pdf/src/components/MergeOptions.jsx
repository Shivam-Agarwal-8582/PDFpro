import React from 'react';
import { Settings2, FileCheck, ArrowRight, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function MergeOptions({
  fileCount,
  totalSelectedPages,
  outputFileName,
  onOutputFileNameChange,
  onMerge,
  isProcessing = false,
  hasRangeErrors = false
}) {
  const canMerge = fileCount >= 2 && !hasRangeErrors && !isProcessing;

  const handleFileNameChange = (e) => {
    let val = e.target.value;
    onOutputFileNameChange(val);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Settings2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-base">Merge Settings</h3>
          <p className="text-xs text-slate-500">Configure your output document</p>
        </div>
      </div>

      {/* Output Filename */}
      <div className="space-y-1.5">
        <label
          htmlFor="outputFileName"
          className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
        >
          Output Filename
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FileText className="w-4 h-4" />
          </div>
          <input
            id="outputFileName"
            type="text"
            value={outputFileName}
            onChange={handleFileNameChange}
            placeholder="merged-document.pdf"
            className="w-full pl-9 pr-14 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 transition-all font-medium"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
            .pdf
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          The merged file will be saved with this name.
        </p>
      </div>

      {/* Preservation & Integrity Information */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs text-slate-600">
        <div className="flex items-start gap-2">
          <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Format Integrity:</strong> Original page orientation (portrait/landscape) and resolutions are preserved.
          </span>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Local Processing:</strong> All pages are combined inside your browser. No files are transferred.
          </span>
        </div>
      </div>

      {/* Validation status notice */}
      {fileCount < 2 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Add at least 2 PDF files to proceed with merging.</span>
        </div>
      )}

      {hasRangeErrors && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Fix page selection errors above before merging.</span>
        </div>
      )}

      {/* Prominent Merge Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onMerge}
          disabled={!canMerge}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-md ${
            canMerge
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              : 'bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Merge {fileCount > 0 ? `${fileCount} PDFs` : 'PDF'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-2.5">
          {canMerge
            ? `Ready to merge ${fileCount} documents (${totalSelectedPages} total pages)`
            : 'Select multiple files to enable merge'}
        </p>
      </div>
    </div>
  );
}
