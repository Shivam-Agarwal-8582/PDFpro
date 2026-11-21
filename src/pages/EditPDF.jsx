import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PDFProvider, usePDF } from '../features/edit-pdf/context/PDFContext';
import EditorToolbar from '../features/edit-pdf/components/EditorToolbar';
import ToolsBar from '../features/edit-pdf/components/ToolsBar';
import PageSidebar from '../features/edit-pdf/components/PageSidebar';
import PDFViewer from '../features/edit-pdf/components/PDFViewer';
import PropertiesPanel from '../features/edit-pdf/components/PropertiesPanel';
import FileUpload from '../features/edit-pdf/components/FileUpload';
import {
  FileEdit,
  ArrowLeft,
  Sparkles,
  Type,
  Eraser,
  ImagePlus,
  Highlighter,
  PenLine,
  RotateCw,
  Layers,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';

function EditPDFContent() {
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

  // Keyboard shortcut listener for active editor
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      // Undo: Ctrl+Z or Cmd+Z
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

  // If no document is currently loaded, display upload workspace with features overview
  if (!pdfDoc || pages.length === 0) {
    const featureHighlights = [
      { icon: Type, title: 'Add Custom Text', desc: 'Insert text boxes anywhere with customizable fonts, sizes, and colors.' },
      { icon: Eraser, title: 'Whiteout & Replace', desc: 'Mask existing underlying text and place clean replacement text over it.' },
      { icon: ImagePlus, title: 'Add Images & Logos', desc: 'Place PNG or JPG images, signatures, and stamps with full scaling.' },
      { icon: Highlighter, title: 'Highlight Content', desc: 'Mark key phrases and paragraphs with colored transparent highlights.' },
      { icon: PenLine, title: 'Draw & Sketch', desc: 'Freehand drawings and notes with stroke thickness and color controls.' },
      { icon: RotateCw, title: 'Rotate & Manage Pages', desc: 'Rotate pages 90°, delete unwanted pages, duplicate and reorder them.' },
    ];

    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

          {/* Heading */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Browser-Based PDF Editor</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Edit PDF Document
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Edit your PDF documents by adding text, images, highlights, and annotations.
            </p>
          </div>

          {/* File Upload Zone */}
          <div className="mb-14">
            <FileUpload />
          </div>

          {/* Feature Highlights Grid */}
          <div className="pt-10 border-t border-slate-200/80">
            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-slate-900">
                Everything You Can Do in PDFPro Editor
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                All features work 100% in your browser. No files uploaded to external servers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureHighlights.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 transition-all space-y-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{feat.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Editor Workspace
  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* 1. Top Editor Toolbar */}
      <EditorToolbar onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      {/* 2. Secondary Tools Bar */}
      <ToolsBar />

      {/* 3. Main Workspace Area: Sidebar + Canvas Viewport + Properties Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Thumbnails Sidebar */}
        <PageSidebar />

        {/* Center Canvas Viewport */}
        <PDFViewer />

        {/* Right Properties Panel */}
        <PropertiesPanel />
      </div>

      {/* Upload New Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Open / Switch PDF Document
            </h3>

            <FileUpload />
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Error Toast */}
      {errorMessage && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 bg-rose-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-bottom-2 duration-200">
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

export default function EditPDF() {
  return (
    <PDFProvider>
      <EditPDFContent />
    </PDFProvider>
  );
}
