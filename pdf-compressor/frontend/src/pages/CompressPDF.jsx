import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, FileText, Lock, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFUpload from '../components/PDFUpload';
import FileInformation from '../components/FileInformation';
import CompressionOptions from '../components/CompressionOptions';
import CompressionProgress from '../components/CompressionProgress';
import CompressionResults from '../components/CompressionResults';
import { compressPDF } from '../services/compressionService';

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
    setProgress(10);
    setStatusMessage('Uploading document...');
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
    <div className="min-h-[calc(100vh-16rem)] py-8 sm:py-12">
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
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Genuine Quality-Preserving Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Compress PDF
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Reduce your PDF file size without compromising document quality.
          </p>
        </div>

        {/* Main Workflow Box */}
        <div className="space-y-6">
          {/* 1. When Success: Display Results */}
          {status === 'success' && result ? (
            <CompressionResults
              result={result}
              onCompressAnother={handleReset}
            />
          ) : status === 'processing' ? (
            /* 2. When Processing: Display Animated Progress */
            <CompressionProgress
              progress={progress}
              statusMessage={statusMessage}
            />
          ) : (
            /* 3. Normal State: Upload + Configuration */
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
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
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStartCompression}
                      className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Compress PDF Now</span>
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Files are processed securely and deleted automatically within 1 hour.</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Educational Trust & How It Works Info */}
          {status !== 'processing' && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-slate-200/80">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Genuine Re-encoding</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Embedded images are compressed with Lanczos downsampling and Flate stream filters.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">End-to-End Privacy</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    No sign-up or email needed. Documents are strictly deleted from the server after 1 hour.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">100% Layout Integrity</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Typography, forms, page sequence, and structural tables remain perfectly intact.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
