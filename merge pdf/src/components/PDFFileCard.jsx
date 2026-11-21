import React, { useState } from 'react';
import {
  FileText,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Sliders,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatBytes, parsePageRange } from '../utils/fileValidation';

export default function PDFFileCard({
  item,
  index,
  totalCount,
  onRemove,
  onMoveUp,
  onMoveDown,
  onPageRangeChange,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingCurrent,
}) {
  const [showRangeOptions, setShowRangeOptions] = useState(false);
  const [rangeInput, setRangeInput] = useState(item.pageRange || 'All');

  const handleRangeInputChange = (e) => {
    const val = e.target.value;
    setRangeInput(val);
    onPageRangeChange(item.id, val);
  };

  const rangeValidation = parsePageRange(rangeInput, item.pageCount);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative bg-white border rounded-xl p-4 transition-all duration-200 ${
        isDraggingCurrent
          ? 'opacity-40 border-blue-400 shadow-inner'
          : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left Side: Drag Handle, Number, Preview, File Info */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0 w-full sm:w-auto">
          {/* Drag Handle & Index Badge */}
          <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-600 cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 shrink-0" />
            <span className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
          </div>

          {/* Thumbnail Preview */}
          <div className="relative w-14 h-18 sm:w-16 sm:h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={`Preview of ${item.file.name}`}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-1 text-center">
                <FileText className="w-7 h-7 text-blue-500/80 mb-0.5" />
                <span className="text-[9px] font-semibold uppercase text-slate-500">PDF</span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-2xs text-[9px] text-white text-center py-0.5 font-medium">
              {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
            </div>
          </div>

          {/* File Name & Metadata */}
          <div className="min-w-0 flex-1">
            <h4
              className="text-sm font-semibold text-slate-900 truncate"
              title={item.file.name}
            >
              {item.file.name}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
              <span>{formatBytes(item.file.size)}</span>
              <span>•</span>
              <span className="text-blue-600 font-medium">
                {rangeValidation.isValid ? rangeValidation.summary : 'Page error'}
              </span>
            </div>

            {/* Custom Range hint if applied */}
            {item.pageRange && item.pageRange.toLowerCase() !== 'all' && (
              <div className="mt-1 text-[11px] text-slate-600 font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded inline-block">
                Pages: {item.pageRange}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reordering, Page Select, Remove */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
          {/* Page Range Toggle */}
          <button
            type="button"
            onClick={() => setShowRangeOptions(!showRangeOptions)}
            title="Configure page selection"
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              showRangeOptions || (item.pageRange && item.pageRange.toLowerCase() !== 'all')
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:bg-slate-100 border border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden md:inline">Pages</span>
          </button>

          {/* Move Up */}
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            title="Move document up"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={index === totalCount - 1}
            title="Move document down"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            title="Remove document"
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Page Selection Section */}
      {showRangeOptions && (
        <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-4 -mb-4 p-4 rounded-b-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Page Selection (Total: {item.pageCount} pages)
              </label>
              <p className="text-[11px] text-slate-500">
                Specify pages to include (e.g. <span className="font-mono font-medium">1-3, 5</span>) or type <span className="font-mono font-medium">All</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={rangeInput}
                onChange={handleRangeInputChange}
                placeholder="e.g. 1-3, 5"
                className={`text-xs px-3 py-1.5 rounded-lg border bg-white focus:outline-none focus:ring-2 font-mono w-full sm:w-44 ${
                  rangeValidation.isValid
                    ? 'border-slate-300 focus:border-blue-500 focus:ring-blue-100 text-slate-800'
                    : 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-700'
                }`}
              />

              <button
                type="button"
                onClick={() => {
                  setRangeInput('All');
                  onPageRangeChange(item.id, 'All');
                }}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Validation Error Message */}
          {!rangeValidation.isValid && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{rangeValidation.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
