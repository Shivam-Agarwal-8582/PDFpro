import React, { useState, useEffect } from 'react';
import { usePDF } from '../context/PDFContext';
import EditorToolbar from '../components/EditorToolbar';
import ToolsBar from '../components/ToolsBar';
import PageSidebar from '../components/PageSidebar';
import PDFViewer from '../components/PDFViewer';
import PropertiesPanel from '../components/PropertiesPanel';
import FileUpload from '../components/FileUpload';
import { FileUp, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function Editor() {
  const {
    pdfDoc,
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    currentPage,
    selectedAnnotationId,
    setSelectedAnnotationId,
    deleteAnnotation,
    undo,
    redo,
    canUndo,
    canRedo,
    notification,
    errorMessage,
    setErrorMessage,
  } = usePDF();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input, textarea or contenteditable element
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z (without shift)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
        return;
      }

      // Redo: Ctrl+Y or Cmd+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && e.shiftKey)
      ) {
        e.preventDefault();
        if (canRedo) redo();
        return;
      }

      // Delete selected annotation: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedAnnotationId && currentPage) {
        e.preventDefault();
        deleteAnnotation(currentPage.id, selectedAnnotationId);
        return;
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        setSelectedAnnotationId(null);
        return;
      }

      // Navigation: Left / Right arrow keys
      if (e.key === 'ArrowLeft') {
        setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    selectedAnnotationId,
    currentPage,
    deleteAnnotation,
    setSelectedAnnotationId,
    pages.length,
    setCurrentPageIndex,
  ]);

  // If no document is currently loaded, show the friendly upload workspace
  if (!pdfDoc || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Basic Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              PDF<span className="text-blue-600">Pro</span> Workspace
            </span>
          </div>
          <a
            href="/"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
          >
            Back to Home
          </a>
        </header>

        {/* Empty state file upload */}
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="max-w-xl w-full text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Document Loaded
            </h2>
            <p className="text-sm text-gray-600">
              Upload a PDF document to begin editing or try with our built-in sample document.
            </p>
          </div>

          <FileUpload />
        </main>
      </div>
    );
  }

  // Active Editor Workspace
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden select-none">
      {/* 1. Top Toolbar */}
      <EditorToolbar onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      {/* 2. Secondary Tools Bar */}
      <ToolsBar />

      {/* 3. Main Workspace Area: Left Sidebar + Center Canvas Viewer + Right Properties Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Thumbnails Sidebar */}
        <PageSidebar />

        {/* Center Canvas Viewport */}
        <PDFViewer />

        {/* Right Properties & Formatting Panel */}
        <PropertiesPanel />
      </div>

      {/* Upload New Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 max-w-xl w-full p-6 relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Open / Switch PDF Document
            </h3>

            <FileUpload />
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-gray-800 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Error Toast */}
      {errorMessage && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-bottom-2 duration-200">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
