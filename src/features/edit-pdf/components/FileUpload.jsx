import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, AlertCircle, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { usePDF } from '../context/PDFContext';
import { formatBytes } from '../utils/pdfCoordinates';

export default function FileUpload({ compact = false }) {
  const { loadPdf, loadSampleDocument, isLoading, errorMessage, setErrorMessage } = usePDF();
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processSelectedFile(file);
    }
  };

  const handleFileInputChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processSelectedFile(file);
    }
  };

  const processSelectedFile = async (file) => {
    // PDF Validation
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Please select a valid PDF file (.pdf). Other formats are not supported.');
      return;
    }

    // Size limit check (50 MB)
    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File size (${formatBytes(file.size)}) exceeds the ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    const success = await loadPdf(file);
    if (success && window.location.pathname !== '/edit-pdf') {
      navigate('/edit-pdf');
    }
  };

  const handleTrySample = async () => {
    const success = await loadSampleDocument();
    if (success && window.location.pathname !== '/edit-pdf') {
      navigate('/edit-pdf');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drag & Drop Upload Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer bg-white group ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 scale-[1.01] shadow-lg ring-4 ring-blue-100'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/80 shadow-sm hover:shadow'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-100 transition duration-200">
            {isLoading ? (
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isLoading ? 'Processing PDF Document...' : 'Upload your PDF document'}
          </h3>

          <p className="text-sm text-gray-500 max-w-md mb-6">
            Drag and drop your PDF file here, or click to browse files from your computer.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95 disabled:opacity-50"
            >
              Browse Files
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleTrySample();
              }}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Try with Sample PDF</span>
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
            <span>• Supported: PDF (.pdf)</span>
            <span>• Maximum size: 50 MB</span>
            <span>• Instant browser processing</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-600 hover:text-red-800 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Privacy Message */}
      <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center gap-2.5 text-xs text-gray-600">
        <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
        <span>
          <strong className="text-gray-800 font-semibold">Privacy First:</strong> Your files stay on your device. All editing and rendering happen directly in your browser.
        </span>
      </div>
    </div>
  );
}
