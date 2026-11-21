import React, { useState, useEffect } from 'react';
import {
  FileStack,
  AlertCircle,
  X,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import UploadedFileList from '../components/UploadedFileList';
import MergeOptions from '../components/MergeOptions';
import MergeProgress from '../components/MergeProgress';
import MergeSuccess from '../components/MergeSuccess';
import { validatePDFFile, parsePageRange } from '../utils/fileValidation';
import { getPDFMetadata, generatePDFThumbnail, mergePDFs } from '../services/mergePDFService';

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

        // Asynchronously generate thumbnail without blocking UI
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
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white py-12 sm:py-16 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
            <FileStack className="w-3.5 h-3.5" />
            <span>Fast, Secure & Free Client-Side Tool</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Merge PDF Files Easily
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Combine multiple PDF documents into one file in seconds. Upload your PDFs, arrange their order, and download your merged document.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Private (No upload)
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              Instant Browser Processing
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              Zero Registration Required
            </span>
          </div>
        </div>
      </section>

      {/* Main Workspace Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Error notification banner */}
        {errorBanner && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed">{errorBanner}</div>
            </div>
            <button
              type="button"
              onClick={() => setErrorBanner(null)}
              className="p-1 rounded-md text-red-400 hover:text-red-700 hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Switching: Success Result vs Workspace */}
        {mergedResult ? (
          <MergeSuccess result={mergedResult} onReset={handleReset} />
        ) : (
          <div>
            {files.length === 0 ? (
              /* Empty State: Hero Upload Box */
              <div className="max-w-2xl mx-auto">
                <FileUpload
                  onFilesSelected={handleFilesSelected}
                  isProcessing={isProcessing}
                  compact={false}
                />
              </div>
            ) : (
              /* Active State: File List + Sidebar Options */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left 2 Cols: File List */}
                <div className="lg:col-span-2">
                  <UploadedFileList
                    files={files}
                    onRemoveFile={handleRemoveFile}
                    onReorderFiles={handleReorderFiles}
                    onPageRangeChange={handlePageRangeChange}
                    onAddMoreFiles={handleFilesSelected}
                    onClearAll={handleClearAll}
                    isProcessing={isProcessing}
                  />
                </div>

                {/* Right Col: Merge Options & Action */}
                <div className="lg:col-span-1 sticky top-24">
                  <MergeOptions
                    fileCount={files.length}
                    totalSelectedPages={totalSelectedPages}
                    outputFileName={outputFileName}
                    onOutputFileNameChange={setOutputFileName}
                    onMerge={handleMerge}
                    isProcessing={isProcessing}
                    hasRangeErrors={hasRangeErrors}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Progress Overlay */}
      {isProcessing && <MergeProgress progress={progress} />}
    </div>
  );
}
