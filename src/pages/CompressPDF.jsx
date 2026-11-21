import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, ShieldCheck, Zap, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFUpload from '../features/compress-pdf/components/PDFUpload';
import FileInformation from '../features/compress-pdf/components/FileInformation';
import CompressionOptions from '../features/compress-pdf/components/CompressionOptions';
import CompressionProgress from '../features/compress-pdf/components/CompressionProgress';
import CompressionResults from '../features/compress-pdf/components/CompressionResults';
import { compressPDF } from '../features/compress-pdf/services/compressionService';

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [compressionLevel, setCompressionLevel] = useState('recommended');
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'error'
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelected = (selectedFile) => {
    setFile(selectedFile);
    setError('');
    setStatus('idle');
    setResult(null);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    setStatus('idle');
    setResult(null);
    setProgress(0);
  };

  const handleStartCompression = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setStatus('processing');
    setProgress(15);
    setStatusMessage('Preparing document...');
    setError('');

    try {
      const data = await compressPDF(file, compressionLevel, (percent, msg) => {
        setProgress(percent);
        if (msg) setStatusMessage(msg);
      });

      setResult(data);
      setStatus('success');
      setProgress(100);
    } catch (err) {
      console.error('Compression failed:', err);
      setStatus('error');
      setError(err.message || 'An error occurred while compressing your PDF.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setError('');
    setProgress(0);
    setCompressionLevel('recommended');
  };

  return (
    <div className="flex-1 bg-white py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Tools</span>
          </Link>
        </div>

        {/* Page Title & Subtitle */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quality-Preserving PDF Optimizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Compress PDF
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Reduce PDF file size while maintaining the best possible document quality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% In-Browser Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-600" />
              Instant Optimization
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              No Registration Required
            </span>
          </div>
        </div>

        {/* Main Workflow Box */}
        <div className="space-y-6">
          {/* State 1: When Success: Display Results */}
          {status === 'success' && result ? (
            <CompressionResults
              result={result}
              onCompressAnother={handleReset}
            />
          ) : status === 'processing' ? (
            /* State 2: When Processing: Display Animated Progress */
            <CompressionProgress
              progress={progress}
              statusMessage={statusMessage}
            />
          ) : (
            /* State 3: Normal State: Upload + Configuration */
            <div className="space-y-6">
              {/* File Upload Zone or Selected File Preview */}
              {!file ? (
                <PDFUpload
                  onFileSelected={handleFileSelected}
                  error={error}
                  setError={setError}
                />
              ) : (
                <div className="space-y-6">
                  {/* Selected File Details */}
                  <FileInformation
                    file={file}
                    onRemove={handleRemoveFile}
                    onChangeFile={handleRemoveFile}
                  />

                  {/* Compression Level Selector */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                    <CompressionOptions
                      selectedLevel={compressionLevel}
                      onSelectLevel={setCompressionLevel}
                      disabled={status === 'processing'}
                    />
                  </div>

                  {/* Error Message if any */}
                  {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                      <div className="flex-1">
                        <p className="font-semibold">Compression error</p>
                        <p className="text-xs text-rose-600/90 mt-0.5">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={handleStartCompression}
                    className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/25 active:scale-98 transition flex items-center justify-center gap-2"
                  >
                    <span>Compress PDF Now</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
