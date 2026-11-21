import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../features/remove-pages/components/FileUpload';
import PDFPageGrid from '../features/remove-pages/components/PDFPageGrid';
import PageSelectionToolbar from '../features/remove-pages/components/PageSelectionToolbar';
import SelectionSummary from '../features/remove-pages/components/SelectionSummary';
import RemoveConfirmation from '../features/remove-pages/components/RemoveConfirmation';
import DownloadSuccess from '../features/remove-pages/components/DownloadSuccess';
import { loadPdfDocument, renderPageThumbnail } from '../features/remove-pages/services/pdfRenderService';
import { removePagesFromPdf } from '../features/remove-pages/services/removePagesService';
import { generateSamplePdf } from '../features/remove-pages/services/samplePdfService';
import {
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

export default function RemovePages() {
  // Application State
  const [status, setStatus] = useState('idle'); // 'idle' | 'rendering' | 'ready' | 'processing' | 'success' | 'error'
  const [fileInfo, setFileInfo] = useState(null); // { name, size }
  const [originalPdfBytes, setOriginalPdfBytes] = useState(null);
  const [currentPdfBytes, setCurrentPdfBytes] = useState(null);
  const [history, setHistory] = useState([]); // Stack of previous states for Undo
  const [totalPages, setTotalPages] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPages, setSelectedPages] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [renderProgress, setRenderProgress] = useState({ current: 0, total: 0 });
  const [successResult, setSuccessResult] = useState(null);

  /**
   * Reads and renders a PDF from a Uint8Array or ArrayBuffer
   */
  const loadAndRenderPdf = async (bytes, info, isInitial = true) => {
    try {
      setStatus('rendering');
      setErrorMessage(null);

      const pdfDoc = await loadPdfDocument(bytes);
      const pageCount = pdfDoc.numPages;

      if (pageCount === 0) {
        throw new Error('This document does not contain any pages.');
      }

      setTotalPages(pageCount);
      setRenderProgress({ current: 0, total: pageCount });

      // Render page thumbnails
      const generatedThumbnails = [];
      for (let i = 1; i <= pageCount; i++) {
        setRenderProgress({ current: i, total: pageCount });
        const thumb = await renderPageThumbnail(pdfDoc, i, 340);
        generatedThumbnails.push(thumb);
      }

      setThumbnails(generatedThumbnails);
      setCurrentPdfBytes(bytes);
      if (isInitial) {
        setOriginalPdfBytes(bytes);
        setHistory([]);
      }
      setFileInfo(info);
      setSelectedPages(new Set());
      setStatus('ready');
    } catch (err) {
      console.error('Error rendering PDF:', err);
      setErrorMessage(err.message || 'Failed to process and render PDF document.');
      setStatus('error');
    }
  };

  /**
   * Handle file upload from user
   */
  const handleFileSelect = async (file) => {
    try {
      setStatus('rendering');
      setErrorMessage(null);
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const info = {
        name: file.name,
        size: file.size,
      };
      await loadAndRenderPdf(bytes, info, true);
    } catch (err) {
      console.error('File read error:', err);
      setErrorMessage(err.message || 'Failed to read uploaded file.');
      setStatus('error');
    }
  };

  /**
   * Handle sample demo PDF generation
   */
  const handleSampleSelect = async () => {
    try {
      setStatus('rendering');
      setErrorMessage(null);
      const sampleBytes = await generateSamplePdf();
      const info = {
        name: 'sample-project-report.pdf',
        size: sampleBytes.byteLength,
      };
      await loadAndRenderPdf(sampleBytes, info, true);
    } catch (err) {
      console.error('Sample generation error:', err);
      setErrorMessage('Failed to generate sample PDF.');
      setStatus('error');
    }
  };

  /**
   * Toggle individual page selection
   */
  const handleTogglePage = useCallback((pageNumber) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(pageNumber)) {
        next.delete(pageNumber);
      } else {
        next.add(pageNumber);
      }
      return next;
    });
  }, []);

  /**
   * Select All Pages
   */
  const handleSelectAll = useCallback(() => {
    const all = new Set();
    for (let i = 1; i <= totalPages; i++) {
      all.add(i);
    }
    setSelectedPages(all);
  }, [totalPages]);

  /**
   * Deselect All Pages
   */
  const handleDeselectAll = useCallback(() => {
    setSelectedPages(new Set());
  }, []);

  /**
   * Invert Selection
   */
  const handleInvertSelection = useCallback(() => {
    setSelectedPages((prev) => {
      const inverted = new Set();
      for (let i = 1; i <= totalPages; i++) {
        if (!prev.has(i)) {
          inverted.add(i);
        }
      }
      return inverted;
    });
  }, [totalPages]);

  /**
   * Apply Page Range from input
   */
  const handleApplyRange = useCallback((pageNumbers) => {
    setSelectedPages((prev) => {
      const next = new Set(prev);
      for (const p of pageNumbers) {
        next.add(p);
      }
      return next;
    });
  }, []);

  /**
   * Execute actual page deletion with pdf-lib
   */
  const handleConfirmRemoval = async () => {
    setIsConfirmOpen(false);
    if (selectedPages.size === 0) return;
    if (selectedPages.size >= totalPages) {
      setErrorMessage('Cannot delete all pages. A PDF must have at least one remaining page.');
      return;
    }

    try {
      setStatus('processing');
      const pagesToRemove = Array.from(selectedPages).sort((a, b) => a - b);

      // Perform real PDF modification
      const result = await removePagesFromPdf(currentPdfBytes, pagesToRemove);

      // Save previous state to history stack for Undo
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          pdfBytes: currentPdfBytes,
          fileInfo: { ...fileInfo },
          thumbnails: [...thumbnails],
          totalPages: totalPages,
          selectedPages: new Set(selectedPages),
        },
      ]);

      // Render thumbnails for the remaining pages
      const newDoc = await loadPdfDocument(result.modifiedBytes);
      const newThumbnails = [];
      for (let i = 1; i <= result.remainingCount; i++) {
        const thumb = await renderPageThumbnail(newDoc, i, 280);
        newThumbnails.push(thumb);
      }

      const defaultOutName = fileInfo?.name
        ? fileInfo.name.replace(/\.pdf$/i, '') + '-edited.pdf'
        : 'edited-document.pdf';

      setSuccessResult({
        modifiedBytes: result.modifiedBytes,
        originalCount: result.originalCount,
        removedCount: result.removedCount,
        remainingCount: result.remainingCount,
        defaultFilename: defaultOutName,
        thumbnails: newThumbnails,
      });

      // Update current PDF bytes & thumbnails
      setCurrentPdfBytes(result.modifiedBytes);
      setThumbnails(newThumbnails);
      setTotalPages(result.remainingCount);
      setSelectedPages(new Set());
      setStatus('success');
    } catch (err) {
      console.error('Page deletion error:', err);
      setErrorMessage(err.message || 'An error occurred while removing pages.');
      setStatus('ready');
    }
  };

  /**
   * Undo last page deletion
   */
  const handleUndo = () => {
    if (history.length === 0) return;

    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));

    setCurrentPdfBytes(previousState.pdfBytes);
    setThumbnails(previousState.thumbnails);
    setTotalPages(previousState.totalPages);
    setSelectedPages(new Set());
    setFileInfo(previousState.fileInfo);
    setSuccessResult(null);
    setStatus('ready');
  };

  /**
   * Continue editing and remove more pages from the modified PDF
   */
  const handleRemoveMore = () => {
    setSelectedPages(new Set());
    setSuccessResult(null);
    setStatus('ready');
  };

  /**
   * Complete reset: start fresh
   */
  const handleStartOver = () => {
    setStatus('idle');
    setFileInfo(null);
    setOriginalPdfBytes(null);
    setCurrentPdfBytes(null);
    setHistory([]);
    setTotalPages(0);
    setThumbnails([]);
    setSelectedPages(new Set());
    setErrorMessage(null);
    setSuccessResult(null);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Top Header / Hero */}
      <section className="bg-gradient-to-b from-rose-50/50 via-slate-50/40 to-white py-10 sm:py-14 border-b border-slate-200/60">
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
            <div className="inline-flex items-center gap-2 bg-rose-100/70 border border-rose-200/60 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Visual Page Organizer & Remover</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Remove Pages from PDF
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Delete unwanted pages from your PDF documents with just a few clicks.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% In-Browser Privacy
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-600" />
                Instant Page Removal
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-indigo-600" />
                No Registration Required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">
        {/* State 1: Upload Mode */}
        {status === 'idle' && (
          <FileUpload
            onFileSelect={handleFileSelect}
            onSampleSelect={handleSampleSelect}
            isProcessing={false}
            error={errorMessage}
          />
        )}

        {/* State 2: Loading / Rendering Spinner */}
        {status === 'rendering' && (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Loading Document...</h3>
              <p className="text-xs text-slate-500 mt-1">
                {renderProgress.total > 0
                  ? `Rendering preview thumbnail ${renderProgress.current} of ${renderProgress.total}...`
                  : 'Preparing document structure...'}
              </p>
            </div>
            {renderProgress.total > 0 && (
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.round((renderProgress.current / renderProgress.total) * 100)}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Global Error Notice if any in Ready mode */}
        {errorMessage && status !== 'idle' && status !== 'rendering' && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-xs font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* State 3: Processing Deletion Overlay / Spinner */}
        {status === 'processing' && (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Removing Selected Pages...</h3>
              <p className="text-xs text-slate-500 mt-1">
                Rebuilding PDF document and updating page previews.
              </p>
            </div>
          </div>
        )}

        {/* State 4: Page Editing Mode */}
        {status === 'ready' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <PageSelectionToolbar
              totalPages={totalPages}
              selectedCount={selectedPages.size}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onInvertSelection={handleInvertSelection}
              onApplyRange={handleApplyRange}
              disabled={false}
            />

            {/* Grid of PDF Pages */}
            <PDFPageGrid
              fileInfo={fileInfo}
              totalPages={totalPages}
              thumbnails={thumbnails}
              selectedPages={selectedPages}
              onTogglePage={handleTogglePage}
              onReplaceFile={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/pdf,.pdf';
                input.onchange = (e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                };
                input.click();
              }}
              onResetAll={handleStartOver}
            />

            {/* Sticky Selection Summary & Execution Bar */}
            <SelectionSummary
              totalPages={totalPages}
              selectedCount={selectedPages.size}
              onRemoveClick={() => setIsConfirmOpen(true)}
              onResetSelection={handleDeselectAll}
              isProcessing={status === 'processing'}
              canUndo={history.length > 0}
              onUndo={handleUndo}
            />
          </div>
        )}

        {/* State 5: Success & Download Screen */}
        {status === 'success' && successResult && (
          <DownloadSuccess
            modifiedBytes={successResult.modifiedBytes}
            originalCount={successResult.originalCount}
            removedCount={successResult.removedCount}
            remainingCount={successResult.remainingCount}
            defaultFilename={successResult.defaultFilename}
            thumbnails={successResult.thumbnails}
            onRemoveMore={handleRemoveMore}
            onStartOver={handleStartOver}
            onUndo={handleUndo}
            canUndo={history.length > 0}
          />
        )}

        {/* State 6: Error Fallback Screen */}
        {status === 'error' && (
          <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-2xl border border-rose-200 shadow-md text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Could Not Process Document</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {errorMessage || 'An unexpected error occurred while processing the PDF.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartOver}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Another PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <RemoveConfirmation
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmRemoval}
          selectedPages={Array.from(selectedPages)}
          totalPages={totalPages}
          isProcessing={status === 'processing'}
        />
      </main>
    </div>
  );
}
