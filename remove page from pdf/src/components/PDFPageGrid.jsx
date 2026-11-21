import React, { useState } from 'react';
import PDFPageCard from './PDFPageCard';
import {
  FileText,
  RotateCw,
  X,
  Filter,
  Grid,
  ZoomIn,
  CheckCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { formatFileSize } from '../utils/fileValidation';

export default function PDFPageGrid({
  fileInfo,
  totalPages,
  thumbnails,
  selectedPages,
  onTogglePage,
  onReplaceFile,
  onResetAll,
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'selected' | 'remaining'
  const [zoomPage, setZoomPage] = useState(null); // pageNumber for full modal preview

  // Calculate filtered pages list
  const allPageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const displayedPages = allPageNumbers.filter((pageNum) => {
    const isSelected = selectedPages.has(pageNum);
    if (filterMode === 'selected') return isSelected;
    if (filterMode === 'remaining') return !isSelected;
    return true;
  });

  const handleNextZoom = () => {
    if (zoomPage < totalPages) setZoomPage(zoomPage + 1);
  };

  const handlePrevZoom = () => {
    if (zoomPage > 1) setZoomPage(zoomPage - 1);
  };

  return (
    <div className="space-y-6">
      {/* File Metadata Header Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3
              className="text-base font-bold text-gray-900 truncate max-w-xs sm:max-w-md lg:max-w-lg"
              title={fileInfo?.name}
            >
              {fileInfo?.name || 'document.pdf'}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
              <span>{formatFileSize(fileInfo?.size || 0)}</span>
              <span>&bull;</span>
              <span className="font-semibold text-gray-700">
                {totalPages} {totalPages === 1 ? 'page' : 'pages'} total
              </span>
              <span>&bull;</span>
              <span className="text-red-600 font-semibold">
                {selectedPages.size} marked for removal
              </span>
            </div>
          </div>
        </div>

        {/* Change file & Reset actions */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
          <button
            type="button"
            onClick={onReplaceFile}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Change File</span>
          </button>
          <button
            type="button"
            onClick={onResetAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-semibold text-gray-500 transition-colors"
            title="Remove document and start over"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Grid Filter and Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-gray-400 font-medium">Show:</span>
          <div className="inline-flex rounded-lg bg-gray-100 p-0.5 border border-gray-200">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Pages ({totalPages})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('selected')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'selected'
                  ? 'bg-white text-red-600 shadow-xs'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              To Remove ({selectedPages.size})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('remaining')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                filterMode === 'remaining'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              To Keep ({totalPages - selectedPages.size})
            </button>
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Click any page to toggle selection for deletion
        </div>
      </div>

      {/* Pages Grid Container with smooth scrolling */}
      {displayedPages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-sm text-gray-500">No pages match the selected filter.</p>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className="mt-3 text-xs text-indigo-600 font-semibold hover:underline"
          >
            Show All Pages
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {displayedPages.map((pageNum) => {
            const isSelected = selectedPages.has(pageNum);
            const thumb = thumbnails[pageNum - 1];

            return (
              <PDFPageCard
                key={pageNum}
                pageNumber={pageNum}
                thumbnailUrl={thumb}
                isSelected={isSelected}
                onToggle={onTogglePage}
                onZoom={(p) => setZoomPage(p)}
              />
            );
          })}
        </div>
      )}

      {/* Full Page Zoom Modal */}
      {zoomPage !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xs animate-in fade-in"
          onClick={() => setZoomPage(null)}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold text-gray-900">
                  Page Preview &bull; Page {zoomPage} of {totalPages}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedPages.has(zoomPage)
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {selectedPages.has(zoomPage) ? 'Marked for Deletion' : 'Keeping'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onTogglePage(zoomPage)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedPages.has(zoomPage)
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  {selectedPages.has(zoomPage) ? 'Keep this Page' : 'Remove this Page'}
                </button>

                <button
                  type="button"
                  onClick={() => setZoomPage(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body with image */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-100">
              {thumbnails[zoomPage - 1] ? (
                <img
                  src={thumbnails[zoomPage - 1]}
                  alt={`Zoom preview page ${zoomPage}`}
                  className="max-h-[70vh] object-contain rounded-md shadow-md bg-white"
                />
              ) : (
                <div className="text-sm text-gray-500">Loading preview...</div>
              )}
            </div>

            {/* Modal Navigation Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 text-xs">
              <button
                type="button"
                onClick={handlePrevZoom}
                disabled={zoomPage <= 1}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="text-gray-500 font-medium">
                {zoomPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextZoom}
                disabled={zoomPage >= totalPages}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 disabled:opacity-40"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
