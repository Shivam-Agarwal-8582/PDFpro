import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { formatPagesToRange } from '../utils/pageRangeParser';

export default function RemoveConfirmation({
  isOpen,
  onClose,
  onConfirm,
  selectedPages,
  totalPages,
  isProcessing,
}) {
  if (!isOpen) return null;

  const count = selectedPages.length;
  const remainingCount = totalPages - count;
  const pageRangeText = formatPagesToRange(selectedPages);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            <h3 id="confirm-modal-title" className="text-base font-bold text-gray-900">
              Confirm Page Deletion
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to remove{' '}
            <strong className="text-gray-900 font-semibold">
              {count} {count === 1 ? 'page' : 'pages'}
            </strong>{' '}
            from your PDF document?
          </p>

          {/* Details Box */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Pages to delete:</span>
              <span className="font-semibold text-red-600">
                {pageRangeText || count}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Remaining pages:</span>
              <span className="font-semibold text-emerald-600">
                {remainingCount} of {totalPages}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-2.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 p-3 rounded-xl">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              Your original file will not be changed. You can also undo this action at any time.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold shadow-md shadow-red-200 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Removing Pages...' : 'Confirm & Remove'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
