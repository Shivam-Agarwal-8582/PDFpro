import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  Upload,
  RefreshCw,
  Home,
} from 'lucide-react';
import { usePDF } from '../context/PDFContext';

export default function EditorToolbar({ onOpenUploadModal }) {
  const {
    fileName,
    setFileName,
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    zoom,
    setZoom,
    undo,
    redo,
    canUndo,
    canRedo,
    downloadPdf,
    isExporting,
    resetDocument,
  } = usePDF();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(fileName);

  const handleNameSave = () => {
    setIsEditingName(false);
    if (tempName.trim()) {
      let finalName = tempName.trim();
      if (!finalName.toLowerCase().endsWith('.pdf')) {
        finalName += '.pdf';
      }
      setFileName(finalName);
    }
  };

  const zoomPercentages = [50, 75, 100, 125, 150, 200];

  const handleZoomChange = (newZoom) => {
    setZoom(Math.min(2.5, Math.max(0.5, newZoom)));
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs sticky top-0 z-30">
      {/* Left section: Home link & File name */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to="/"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
          title="Back to Home"
        >
          <Home className="w-5 h-5" />
        </Link>

        <div className="h-5 w-px bg-gray-200" />

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <FileText className="w-4 h-4" />
          </div>

          {isEditingName ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                autoFocus
                className="text-sm font-semibold text-gray-900 px-2 py-1 border border-blue-400 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
              />
              <button
                onClick={handleNameSave}
                className="p-1 rounded-md text-green-600 hover:bg-green-50"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempName(fileName);
                setIsEditingName(true);
              }}
              className="group flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 text-left transition max-w-[180px] sm:max-w-xs truncate"
              title="Click to rename document"
            >
              <span className="text-sm font-semibold text-gray-800 truncate">
                {fileName || 'Untitled.pdf'}
              </span>
              <Edit2 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* Center section: Undo/Redo & Zoom & Page navigation */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded-md text-gray-700 hover:bg-white hover:shadow-xs disabled:opacity-40 disabled:hover:bg-transparent transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded-md text-gray-700 hover:bg-white hover:shadow-xs disabled:opacity-40 disabled:hover:bg-transparent transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5">
          <button
            onClick={() => handleZoomChange(zoom - 0.2)}
            disabled={zoom <= 0.5}
            className="p-1.5 rounded-md text-gray-700 hover:bg-white hover:shadow-xs disabled:opacity-40 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <select
            value={Math.round(zoom * 100)}
            onChange={(e) => handleZoomChange(Number(e.target.value) / 100)}
            className="text-xs font-semibold text-gray-700 bg-transparent px-1.5 py-1 focus:outline-hidden cursor-pointer"
          >
            {zoomPercentages.map((pct) => (
              <option key={pct} value={pct}>
                {pct}%
              </option>
            ))}
          </select>

          <button
            onClick={() => handleZoomChange(zoom + 0.2)}
            disabled={zoom >= 2.5}
            className="p-1.5 rounded-md text-gray-700 hover:bg-white hover:shadow-xs disabled:opacity-40 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Page Navigator */}
        {pages.length > 0 && (
          <div className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-0.5 text-xs text-gray-700">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-xs disabled:opacity-40 transition"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPageIndex + 1} of {pages.length}
            </span>
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
              disabled={currentPageIndex >= pages.length - 1}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-xs disabled:opacity-40 transition"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Right section: Upload New & Download PDF button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenUploadModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          title="Upload or switch PDF"
        >
          <Upload className="w-3.5 h-3.5 text-gray-600" />
          <span>New PDF</span>
        </button>

        <button
          onClick={downloadPdf}
          disabled={isExporting || pages.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95 disabled:opacity-50"
          title="Download the modified PDF to your computer"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
