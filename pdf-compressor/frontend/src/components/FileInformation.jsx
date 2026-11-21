import React from 'react';
import { FileText, Trash2, Check, RefreshCw } from 'lucide-react';
import { formatBytes } from '../services/compressionService';

export default function FileInformation({ file, onRemove, onChangeFile }) {
  if (!file) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* File Details */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200/60 flex items-center justify-center shrink-0">
          <FileText className="w-6 h-6 text-red-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-slate-800 truncate" title={file.name}>
              {file.name}
            </h4>
            <span className="px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 text-slate-600">
              PDF
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <span>Original Size: <strong className="text-slate-700 font-medium">{formatBytes(file.size)}</strong></span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <Check className="w-3.5 h-3.5" /> Ready to compress
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        {onChangeFile && (
          <button
            type="button"
            onClick={onChangeFile}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change</span>
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
          title="Remove file"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
}
