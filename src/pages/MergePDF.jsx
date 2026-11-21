import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileStack,
  AlertCircle,
  X,
  ShieldCheck,
  Zap,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import FileUpload from '../features/merge-pdf/components/FileUpload';
import UploadedFileList from '../features/merge-pdf/components/UploadedFileList';
import MergeOptions from '../features/merge-pdf/components/MergeOptions';
import MergeProgress from '../features/merge-pdf/components/MergeProgress';
import MergeSuccess from '../features/merge-pdf/components/MergeSuccess';
import { validatePDFFile, parsePageRange } from '../features/merge-pdf/utils/fileValidation';
import { getPDFMetadata, generatePDFThumbnail, mergePDFs } from '../features/merge-pdf/services/mergePDFService';

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [outputFileName, setOutputFileName] = useState('merged-document.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, step: '', percent: 0 });
  const [errorBanner, setErrorBanner] = useState(null);
  const [mergedResult, setMergedResult] = useState(null);

  // Clean up object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (mergedResult?.downloadUrl) {
        URL.revokeObjectURL(mergedResult.downloadUrl);
      }
    };
  }, [mergedResult]);

  /**
   * Process and validate newly selected files
   */
  const handleFilesSelected = async (newRawFiles) => {
    setErrorBanner(null);
    if (!newRawFiles || newRawFiles.length === 0) return;

    const validatedItems = [];
    const errorMessages = [];

    for (const file of newRawFiles) {
      // Basic validation
      const val = await validatePDFFile(file);
      if (!val.isValid) {
        errorMessages.push(val.error);
        continue;
      }

      // Check if duplicate file already added
      const isDuplicate = files.some(
        (f) => f.file.name === file.name && f.file.size === file.size && f.file.lastModified === file.lastModified
      );
      if (isDuplicate) {
        errorMessages.push(`"${file.name}" is already in the merge list.`);
        continue;
      }

      // Read metadata & page count
      try {
        const metadata = await getPDFMetadata(file);
        const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        const item = {
          id,
          file,
          pageCount: metadata.pageCount,
          thumbnail: null,
          pageRange: 'All',
          pageIndices: Array.from({ length: metadata.pageCount }, (_, i) => i),
          rangeError: null,
        };

        validatedItems.push(item);

        // Asynchronously generate thumbnail
        generatePDFThumbnail(file, 1).then((thumbUrl) => {
          if (thumbUrl) {
            setFiles((prev) =>
              prev.map((f) => (f.id === id ? { ...f, thumbnail: thumbUrl } : f))
            );
          }
        });
      } catch (metaErr) {
        errorMessages.push(metaErr.message || `Failed to read "${file.name}".`);
      }
    }

    if (errorMessages.length > 0) {
      setErrorBanner(errorMessages.join(' '));
    }

    if (validatedItems.length > 0) {
      setFiles((prev) => [...prev, ...validatedItems]);
    }
  };

  /**
   * Remove single file by id
   */
  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  /**
   * Clear all files and reset
   */
  const handleClearAll = () => {
    setFiles([]);
    setErrorBanner(null);
  };

  /**
   * Reorder file list
   */
  const handleReorderFiles = (reorderedList) => {
    setFiles(reorderedList);
  };

  /**
   * Update page range for a specific file
   */
  const handlePageRangeChange = (id, rangeStr) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f;
        const res = parsePageRange(rangeStr, f.pageCount);
        return {
          ...f,
          pageRange: rangeStr,
          pageIndices: res.isValid ? res.pageIndices : null,
          rangeError: res.isValid ? null : res.error,
        };
      })
    );
  };

  /**
   * Compute total selected pages across all files
   */
  const totalSelectedPages = files.reduce((acc, curr) => {
    if (curr.pageIndices) {
      return acc + curr.pageIndices.length;
    }
    return acc + (curr.pageCount || 0);
  }, 0);

  /**
   * Check if any file has an invalid range
   */
  const hasRangeErrors = files.some((f) => !!f.rangeError);

  /**
   * Execute PDF merge operation
   */
  const handleMerge = async () => {
    setErrorBanner(null);

    if (files.length < 2) {
      setErrorBanner('Please select at least 2 PDF files to merge.');
      return;
    }

    if (hasRangeErrors) {
      setErrorBanner('Please resolve page selection errors before merging.');
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: files.length, step: 'Initializing merge process...', percent: 5 });

    try {
      // Execute actual client-side merge
      const result = await mergePDFs(files, (p) => {
        setProgress(p);
      });

      // Prepare download URL
      const downloadUrl = URL.createObjectURL(result.blob);
      let finalName = outputFileName.trim();
      if (!finalName) finalName = 'merged-document.pdf';
      if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

      setMergedResult({
        blob: result.blob,
        totalPages: result.totalPages,
        fileCount: result.fileCount,
        downloadUrl,
        fileName: finalName,
      });
    } catch (err) {
      console.error('Merge failure:', err);
      setErrorBanner(err.message || 'An unexpected error occurred while merging your PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Reset the tool to merge more PDFs
   */
  const handleReset = () => {
    if (mergedResult?.downloadUrl) {
      URL.revokeObjectURL(mergedResult.downloadUrl);
    }
    setMergedResult(null);
    setFiles([]);
    setOutputFileName('merged-document.pdf');
    setErrorBanner(null);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Top Header / Hero */}
      <section className="bg-gradient-to-b from-indigo-50/60 via-slate-50/40 to-white py-10 sm:py-14 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Tools</span>
            </Link>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-100/70 border border-indigo-200/60 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
              <FileStack className="w-3.5 h-3.5" />
              <span>Fast, Secure & Free Client-Side Tool</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Merge PDF Files Easily
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Combine multiple PDF documents into one document quickly and easily.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% In-Browser Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                Instant Processing
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                No Registration Required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Error notification banner */}
        {errorBanner && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm leading-relaxed">{errorBanner}</div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-rose-400 hover:text-rose-700 p-1"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* State 1: Active Processing Dialog */}
        {isProcessing && (
          <div className="py-12">
            <MergeProgress progress={progress} />
          </div>
        )}

        {/* State 2: Success & Download Screen */}
        {!isProcessing && mergedResult && (
          <MergeSuccess result={mergedResult} onReset={handleReset} />
        )}

        {/* State 3: Workflow Editing State */}
        {!isProcessing && !mergedResult && (
          <div className="space-y-8">
            {/* Multi-file Upload Zone */}
            <FileUpload
              onFilesSelected={handleFilesSelected}
              fileCount={files.length}
            />

            {/* Uploaded File List with reordering & page selection */}
            {files.length > 0 && (
              <UploadedFileList
                files={files}
                onRemoveFile={handleRemoveFile}
                onReorderFiles={handleReorderFiles}
                onPageRangeChange={handlePageRangeChange}
                onClearAll={handleClearAll}
              />
            )}

            {/* Merge options & Start button bar */}
            {files.length > 0 && (
              <MergeOptions
                files={files}
                outputFileName={outputFileName}
                onFileNameChange={setOutputFileName}
                onMerge={handleMerge}
                isProcessing={isProcessing}
                totalSelectedPages={totalSelectedPages}
                hasRangeErrors={hasRangeErrors}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
