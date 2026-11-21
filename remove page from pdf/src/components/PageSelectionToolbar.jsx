import React from 'react';
import {
  CheckSquare,
  Square,
  RotateCcw,
  SlidersHorizontal,
  Bookmark,
  Layers,
  Sparkles,
} from 'lucide-react';
import PageRangeInput from './PageRangeInput';

export default function PageSelectionToolbar({
  totalPages,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onInvertSelection,
  onApplyRange,
  disabled,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Selection Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={onSelectAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-xs font-semibold text-gray-700 transition-colors disabled:opacity-50"
            title="Mark all pages for deletion"
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>Select All</span>
          </button>

          <button
            type="button"
            disabled={disabled || selectedCount === 0}
            onClick={onDeselectAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors disabled:opacity-40 disabled:hover:bg-gray-50"
            title="Clear all page selections"
          >
            <Square className="w-3.5 h-3.5 text-gray-500" />
            <span>Deselect All</span>
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={onInvertSelection}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-xs font-semibold text-gray-700 transition-colors disabled:opacity-50"
            title="Invert current page selection"
          >
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>Invert Selection</span>
          </button>
        </div>

        {/* Page Range Input Area */}
        <div className="w-full lg:max-w-md">
          <PageRangeInput
            totalPages={totalPages}
            onApplyRange={onApplyRange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
