import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function PDFUpload({ onFileSelected, error, setError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndSelect = (file) => {
    if (!file) return;

    // Check extension and mime type
    const isPdfExt = file.name.toLowerCase().endsWith('.pdf');
    const isPdfMime = file.type === 'application/pdf';

    if (!isPdfExt && !isPdfMime) {
      setError('Please select a valid PDF document (.pdf).');
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File is too large. Maximum supported size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    if (file.size === 0) {
      setError('The selected PDF file appears to be empty.');
      return;
    }

    setError('');
    onFileSelected(file);
  };

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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const triggerPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerPicker}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          {/* Animated Upload Icon */}
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-200 ${
              isDragging
                ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/30'
                : 'bg-indigo-50 text-indigo-600 group-hover:scale-105'
            }`}
          >
            <UploadCloud className="w-10 h-10" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
            Select PDF files
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">
            or drag and drop your PDF document here
          </p>

          {/* Upload Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerPicker();
            }}
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/25 active:scale-95 transition-all text-base inline-flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            <span>Select PDF File</span>
          </button>

          {/* Validation & Security info */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Supported: PDF (.pdf)
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Up to {MAX_FILE_SIZE_MB} MB
            </span>
            <span className="inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              100% Private & Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <p className="font-semibold">Unable to process file</p>
            <p className="text-rose-600/90 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
