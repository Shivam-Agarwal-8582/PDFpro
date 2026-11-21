import React from 'react';
import { Trash2, AlertTriangle, FileText, Check, Undo2 } from 'lucide-react';

export default function SelectionSummary({
  totalPages,
  selectedCount,
  onRemoveClick,
  onResetSelection,
  isProcessing,
  canUndo,
  onUndo,
}) {
  const remainingCount = totalPages - selectedCount;
  const isAllSelected = selectedCount === totalPages && totalPages > 0;
  const isNoneSelected = selectedCount === 0;

  return (
    <div className="sticky bottom-4 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/90 shadow-xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Statistics Badges */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Pages:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-900 font-bold text-sm">
              {totalPages}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Selected for Deletion:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-sm transition-colors ${
                selectedCount > 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {selectedCount}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Remaining Pages:
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-sm transition-colors ${
                isAllSelected
                  ? 'bg-red-100 text-red-700'
                  : remainingCount > 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {remainingCount}
            </span>
          </div>
        </div>

        {/* Warning Alert if All Selected */}
        {isAllSelected && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Cannot delete all pages. At least 1 page must remain.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          {canUndo && (
            <button
              type="button"
              onClick={onUndo}
              disabled={isProcessing}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors disabled:opacity-50"
              title="Undo last deletion"
            >
              <Undo2 className="w-4 h-4 text-gray-600" />
              <span>Undo</span>
            </button>
          )}

          {selectedCount > 0 && (
            <button
              type="button"
              onClick={onResetSelection}
              disabled={isProcessing}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Reset Selection
            </button>
          )}

          <button
            type="button"
            onClick={onRemoveClick}
            disabled={isNoneSelected || isAllSelected || isProcessing}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
              isNoneSelected || isAllSelected || isProcessing
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-red-200 hover:scale-[1.02]'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>
              {isNoneSelected
                ? 'Select Pages to Remove'
                : isAllSelected
                ? 'Cannot Remove All Pages'
                : `Remove Selected (${selectedCount})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
