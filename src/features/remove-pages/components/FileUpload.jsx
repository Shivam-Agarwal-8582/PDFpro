import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  ShieldCheck,
  AlertCircle,
  FileCheck,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { validatePdfFile, formatFileSize } from '../utils/fileValidation';

export default function FileUpload({ onFileSelect, onSampleSelect, isProcessing, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  const displayError = error || localError;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file) => {
    setLocalError(null);
    if (!file) return;

    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      setLocalError(validation.error);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
    // Reset file input value so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>Client-Side PDF Editor</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Remove Pages from PDF
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
          Delete unwanted pages from your PDF document easily. Select the pages you want to remove and download your updated PDF in seconds.
        </p>
      </div>

      {/* Upload Box Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center bg-white shadow-sm hover:shadow-md ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Icon */}
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-sm ${
              isDragging
                ? 'bg-indigo-600 text-white scale-110'
                : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-10 h-10 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 transition-transform group-hover:-translate-y-1" />
            )}
          </div>

          {/* Texts */}
          {isProcessing ? (
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">Processing Your PDF...</h3>
              <p className="text-sm text-gray-500">
                Rendering page previews and parsing document structure...
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                  Choose a PDF file or drag & drop it here
                </h3>
                <p className="text-sm text-gray-500">
                  Select a document from your computer (up to 100 MB)
                </p>
              </div>

              {/* Browse Button */}
              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm shadow-md shadow-indigo-200 transition-all group-hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Browse Files</span>
                </button>
              </div>
            </>
          )}

          {/* Privacy Message */}
          <div className="pt-4 flex items-center space-x-2 text-xs text-gray-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Your files stay on your device. Zero cloud uploads.</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {displayError && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-3 text-red-800 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Upload Error: </span>
            {displayError}
          </div>
        </div>
      )}

      {/* Quick Test with Sample PDF Card */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-indigo-50/70 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 text-left">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Don't have a PDF right now?</h4>
            <p className="text-xs text-gray-600">
              Try our pre-made 6-page sample report to test page removal instantly.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={(e) => {
            e.stopPropagation();
            onSampleSelect();
          }}
          className="shrink-0 inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white font-medium text-xs shadow-xs transition-colors"
        >
          <span>Load Sample PDF</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Feature Highlights Grid */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
            1
          </div>
          <h4 className="text-sm font-bold text-gray-900">1. Upload Document</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Drag & drop your PDF file. Instant page thumbnail previews are generated locally.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
            2
          </div>
          <h4 className="text-sm font-bold text-gray-900">2. Select Unwanted Pages</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Click thumbnails or use custom page ranges (e.g. 2-5, 8) to choose pages for deletion.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
            3
          </div>
          <h4 className="text-sm font-bold text-gray-900">3. Download Clean PDF</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Get your freshly trimmed PDF document in seconds with 100% original quality intact.
          </p>
        </div>
      </div>
    </div>
  );
}
