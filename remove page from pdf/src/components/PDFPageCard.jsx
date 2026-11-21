import React from 'react';
import { Trash2, Check, ZoomIn } from 'lucide-react';

export default function PDFPageCard({
  pageNumber,
  thumbnailUrl,
  isSelected,
  onToggle,
  onZoom,
}) {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle(pageNumber);
    }
  };

  return (
    <div
      tabIndex={0}
      role="checkbox"
      aria-checked={isSelected}
      aria-label={`Page ${pageNumber}${isSelected ? ', marked for deletion' : ''}`}
      onKeyDown={handleKeyDown}
      onClick={() => onToggle(pageNumber)}
      className={`group relative flex flex-col rounded-xl border-2 transition-all duration-200 select-none cursor-pointer overflow-hidden outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        isSelected
          ? 'border-red-500 bg-red-50/50 shadow-md ring-2 ring-red-200'
          : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
      }`}
    >
      {/* Top Status & Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50/90 border-b border-gray-100">
        <span
          className={`text-xs font-bold transition-colors ${
            isSelected ? 'text-red-700' : 'text-gray-700'
          }`}
        >
          Page {pageNumber}
        </span>

        <div className="flex items-center space-x-1.5">
          {/* Zoom button */}
          <button
            type="button"
            title="Preview page full size"
            onClick={(e) => {
              e.stopPropagation();
              onZoom(pageNumber);
            }}
            className="p-1 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-white transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Selection Indicator Checkbox */}
          <div
            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-red-600 text-white shadow-xs'
                : 'border border-gray-300 bg-white group-hover:border-indigo-400'
            }`}
          >
            {isSelected ? (
              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : null}
          </div>
        </div>
      </div>

      {/* Thumbnail Area */}
      <div className="relative aspect-[3/4] w-full flex items-center justify-center bg-gray-100 p-2 overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={`Page ${pageNumber} thumbnail`}
            loading="lazy"
            className={`w-full h-full object-contain rounded-sm transition-all duration-200 shadow-xs ${
              isSelected
                ? 'opacity-60 saturate-50 filter grayscale-[30%]'
                : 'opacity-100 group-hover:scale-[1.02]'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 text-xs animate-pulse">
            Rendering...
          </div>
        )}

        {/* Selected Overlay Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-red-900/15 backdrop-blur-[0.5px] flex flex-col items-center justify-center text-red-700 p-2 text-center pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg mb-1 animate-in zoom-in-50 duration-150">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/90 px-2 py-0.5 rounded-full shadow-xs text-red-700 border border-red-200">
              Will Be Removed
            </span>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div
        className={`py-1.5 px-3 text-center text-[11px] font-medium border-t transition-colors ${
          isSelected
            ? 'bg-red-100/70 border-red-200 text-red-800'
            : 'bg-white border-gray-100 text-gray-500 group-hover:text-indigo-600'
        }`}
      >
        {isSelected ? 'Click to Keep' : 'Click to Remove'}
      </div>
    </div>
  );
}
