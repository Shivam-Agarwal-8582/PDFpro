import React, { useRef, useState } from 'react';
import { UploadCloud, FilePlus, ShieldCheck, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE, formatBytes } from '../utils/fileValidation';

export default function FileUpload({ onFilesSelected, isProcessing = false, compact = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragError, setDragError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isProcessing) {
      setIsDragging(true);
      setDragError(null);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input value so same files can be re-selected if removed
      e.target.value = '';
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-medium text-sm hover:bg-blue-100 hover:border-blue-300 transition-all shadow-xs disabled:opacity-50"
        >
          <FilePlus className="w-4 h-4" />
          <span>Add More Files</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={handleFileChange}
        className="hidden"
        disabled={isProcessing}
      />

      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`group relative flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-blue-600 bg-blue-50/80 scale-[1.01] shadow-lg shadow-blue-500/10'
            : 'border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 shadow-sm'
        }`}
      >
        {/* Upload Icon circle */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging
              ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-500/30'
              : 'bg-blue-100 text-blue-600 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white shadow-sm'
          }`}
        >
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:-translate-y-0.5" />
        </div>

        <div className="mt-5 text-center space-y-1.5">
          <p className="text-lg sm:text-xl font-semibold text-slate-800">
            {isDragging ? 'Drop your PDF files here' : 'Drag & drop PDF files here'}
          </p>
          <p className="text-sm text-slate-500">
            or <span className="text-blue-600 font-semibold underline underline-offset-2">browse files</span> from your computer
          </p>
        </div>

        {/* Buttons / Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full font-medium shadow-xs">
            Multi-file support
          </span>
          <span className="bg-white border border-slate-200 px-3 py-1.5 rounded-full font-medium shadow-xs">
            Up to {formatBytes(MAX_FILE_SIZE)} per file
          </span>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-slate-500 bg-white/80 border border-slate-200/60 px-3.5 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Your files stay on your device. Zero cloud uploads.</span>
        </div>
      </div>
    </div>
  );
}
