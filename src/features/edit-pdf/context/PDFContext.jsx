import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { loadPdfDocument, getPageDimensions } from '../services/pdfService';
import { exportModifiedPdf } from '../services/exportService';
import { downloadBlob, generateId } from '../utils/pdfCoordinates';
import { createSamplePdf } from '../utils/samplePdf';

const PDFContext = createContext(null);

const DEFAULT_TOOL_SETTINGS = {
  text: {
    fontFamily: 'Helvetica',
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'transparent',
    isBold: false,
    isItalic: false,
    align: 'left',
  },
  whiteout: {
    fillColor: '#ffffff',
    color: '#111827',
    fontSize: 14,
    replacementText: '',
  },
  highlight: {
    color: '#facc15',
    opacity: 0.4,
  },
  draw: {
    color: '#2563eb',
    strokeWidth: 3,
    isEraser: false,
  },
  image: {
    opacity: 1.0,
  },
};

export function PDFProvider({ children }) {
  // Document state
  const [pdfBytes, setPdfBytes] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  // Pages state: [{ id, originalIndex, rotation, isBlank, width, height }]
  const [pages, setPages] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Annotations state: { [pageId]: [annotation1, annotation2, ...] }
  const [annotations, setAnnotations] = useState({});

  // Active tool & selected annotation
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'text' | 'whiteout' | 'highlight' | 'draw' | 'image'
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);

  // Tool settings (font, color, stroke, etc.)
  const [toolSettings, setToolSettings] = useState(DEFAULT_TOOL_SETTINGS);

  // View settings
  const [zoom, setZoom] = useState(1.0); // 0.5 to 2.5

  // App statuses
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState(null);

  // Undo / Redo history stacks
  const [historyStack, setHistoryStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Helper to show transient toast notification
  const showNotification = useCallback((message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 3500);
  }, []);

  // Save current snapshot into history before a modifying operation
  const pushHistorySnapshot = useCallback(() => {
    setHistoryStack((prev) => [
      ...prev.slice(-25), // Keep max 25 history steps
      {
        pages: JSON.parse(JSON.stringify(pages)),
        annotations: JSON.parse(JSON.stringify(annotations)),
      },
    ]);
    setRedoStack([]); // Clear redo stack on new action
  }, [pages, annotations]);

  // Undo
  const undo = useCallback(() => {
    if (historyStack.length === 0) return;

    const previousSnapshot = historyStack[historyStack.length - 1];
    const newHistory = historyStack.slice(0, -1);

    // Push current state to redo
    setRedoStack((prev) => [
      ...prev,
      {
        pages: JSON.parse(JSON.stringify(pages)),
        annotations: JSON.parse(JSON.stringify(annotations)),
      },
    ]);

    setPages(previousSnapshot.pages);
    setAnnotations(previousSnapshot.annotations);
    setHistoryStack(newHistory);
    setSelectedAnnotationId(null);
    showNotification('Undo action applied');
  }, [historyStack, pages, annotations, showNotification]);

  // Redo
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextSnapshot = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    // Push current state to history
    setHistoryStack((prev) => [
      ...prev,
      {
        pages: JSON.parse(JSON.stringify(pages)),
        annotations: JSON.parse(JSON.stringify(annotations)),
      },
    ]);

    setPages(nextSnapshot.pages);
    setAnnotations(nextSnapshot.annotations);
    setRedoStack(newRedo);
    setSelectedAnnotationId(null);
    showNotification('Redo action applied');
  }, [redoStack, pages, annotations, showNotification]);

  /**
   * Load PDF from File or ArrayBuffer
   */
  const loadPdf = useCallback(async (fileOrBytes, customName = '') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let arrayBuffer;
      let name = customName;
      let size = 0;

      if (fileOrBytes instanceof File || fileOrBytes instanceof Blob) {
        name = name || fileOrBytes.name || 'document.pdf';
        size = fileOrBytes.size;
        arrayBuffer = await fileOrBytes.arrayBuffer();
      } else if (fileOrBytes instanceof ArrayBuffer) {
        arrayBuffer = fileOrBytes;
        name = name || 'document.pdf';
        size = arrayBuffer.byteLength;
      } else {
        throw new Error('Unsupported file format');
      }

      const loadedDoc = await loadPdfDocument(arrayBuffer);
      const numPages = loadedDoc.numPages;

      // Extract dimensions for all pages
      const pageList = [];
      const initialAnnotations = {};

      for (let i = 1; i <= numPages; i++) {
        const dims = await getPageDimensions(loadedDoc, i);
        const pId = generateId();
        pageList.push({
          id: pId,
          originalIndex: i - 1, // 0-based index for pdf-lib copyPages
          pageNumber: i, // 1-based index for PDF.js getPage
          rotation: 0,
          isBlank: false,
          width: dims.width,
          height: dims.height,
        });
        initialAnnotations[pId] = [];
      }

      setPdfBytes(arrayBuffer);
      setPdfDoc(loadedDoc);
      setFileName(name);
      setFileSize(size);
      setPages(pageList);
      setAnnotations(initialAnnotations);
      setCurrentPageIndex(0);
      setHistoryStack([]);
      setRedoStack([]);
      setActiveTool('select');
      setSelectedAnnotationId(null);
      setZoom(1.0);
      showNotification(`Successfully loaded ${name} (${numPages} pages)`);
      return true;
    } catch (err) {
      console.error('Error loading PDF:', err);
      setErrorMessage(err.message || 'Failed to load PDF file');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  /**
   * Load the interactive built-in sample document
   */
  const loadSampleDocument = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const sample = await createSamplePdf();
      await loadPdf(sample.data, sample.name);
      return true;
    } catch (err) {
      console.error('Failed to load sample document:', err);
      setErrorMessage('Could not initialize sample document');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [loadPdf]);

  /**
   * Reset / Clear current document
   */
  const resetDocument = useCallback(() => {
    setPdfBytes(null);
    setPdfDoc(null);
    setFileName('');
    setFileSize(0);
    setPages([]);
    setAnnotations({});
    setCurrentPageIndex(0);
    setHistoryStack([]);
    setRedoStack([]);
    setActiveTool('select');
    setSelectedAnnotationId(null);
    setErrorMessage(null);
  }, []);

  /**
   * Page Management Functions
   */
  const rotatePage = useCallback((pageId, degreesDelta = 90) => {
    pushHistorySnapshot();
    setPages((prevPages) =>
      prevPages.map((page) => {
        if (page.id === pageId) {
          const newRotation = (page.rotation + degreesDelta + 360) % 360;
          return { ...page, rotation: newRotation };
        }
        return page;
      })
    );
    showNotification('Page rotated');
  }, [pushHistorySnapshot, showNotification]);

  const deletePage = useCallback((pageId) => {
    if (pages.length <= 1) {
      setErrorMessage('A document must have at least one page.');
      return false;
    }
    pushHistorySnapshot();
    const indexToDelete = pages.findIndex((p) => p.id === pageId);
    setPages((prevPages) => prevPages.filter((p) => p.id !== pageId));
    setAnnotations((prevAnn) => {
      const nextAnn = { ...prevAnn };
      delete nextAnn[pageId];
      return nextAnn;
    });

    // Adjust active page if needed
    setCurrentPageIndex((prevIndex) => {
      if (prevIndex >= pages.length - 1) {
        return Math.max(0, pages.length - 2);
      }
      return prevIndex;
    });

    showNotification(`Deleted page ${indexToDelete + 1}`);
    return true;
  }, [pages, pushHistorySnapshot, showNotification]);

  const duplicatePage = useCallback((pageId) => {
    pushHistorySnapshot();
    const targetIndex = pages.findIndex((p) => p.id === pageId);
    if (targetIndex === -1) return;

    const sourcePage = pages[targetIndex];
    const newPageId = generateId();
    const duplicatedPage = {
      ...sourcePage,
      id: newPageId,
    };

    // Duplicate annotations on that page with new IDs
    const sourceAnnotations = annotations[pageId] || [];
    const duplicatedAnnotations = sourceAnnotations.map((ann) => ({
      ...ann,
      id: generateId(),
    }));

    const newPages = [...pages];
    newPages.splice(targetIndex + 1, 0, duplicatedPage);

    setPages(newPages);
    setAnnotations((prev) => ({
      ...prev,
      [newPageId]: duplicatedAnnotations,
    }));
    setCurrentPageIndex(targetIndex + 1);
    showNotification(`Duplicated page ${targetIndex + 1}`);
  }, [pages, annotations, pushHistorySnapshot, showNotification]);

  const addBlankPage = useCallback((afterIndex = null) => {
    pushHistorySnapshot();
    const newPageId = generateId();
    const insertIndex = afterIndex !== null ? afterIndex + 1 : pages.length;

    // Use dimensions of current page or standard A4
    const currentPage = pages[currentPageIndex];
    const width = currentPage ? currentPage.width : 595.28;
    const height = currentPage ? currentPage.height : 841.89;

    const newBlankPage = {
      id: newPageId,
      originalIndex: null,
      pageNumber: null,
      rotation: 0,
      isBlank: true,
      width,
      height,
    };

    const newPages = [...pages];
    newPages.splice(insertIndex, 0, newBlankPage);

    setPages(newPages);
    setAnnotations((prev) => ({
      ...prev,
      [newPageId]: [],
    }));
    setCurrentPageIndex(insertIndex);
    showNotification('Added blank page');
  }, [pages, currentPageIndex, pushHistorySnapshot, showNotification]);

  const reorderPages = useCallback((sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return;
    pushHistorySnapshot();

    const newPages = [...pages];
    const [movedPage] = newPages.splice(sourceIndex, 1);
    newPages.splice(destinationIndex, 0, movedPage);

    setPages(newPages);
    setCurrentPageIndex(destinationIndex);
    showNotification('Reordered pages');
  }, [pages, pushHistorySnapshot, showNotification]);

  const movePage = useCallback((index, direction) => {
    const dest = direction === 'up' ? index - 1 : index + 1;
    if (dest < 0 || dest >= pages.length) return;
    reorderPages(index, dest);
  }, [pages.length, reorderPages]);

  /**
   * Annotation Management Functions
   */
  const addAnnotation = useCallback((pageId, annotationData) => {
    pushHistorySnapshot();
    const newAnnotation = {
      id: generateId(),
      ...annotationData,
    };

    setAnnotations((prev) => ({
      ...prev,
      [pageId]: [...(prev[pageId] || []), newAnnotation],
    }));

    setSelectedAnnotationId(newAnnotation.id);
    return newAnnotation.id;
  }, [pushHistorySnapshot]);

  const updateAnnotation = useCallback((pageId, annotationId, updates) => {
    setAnnotations((prev) => {
      const pageAnns = prev[pageId] || [];
      const updatedAnns = pageAnns.map((ann) =>
        ann.id === annotationId ? { ...ann, ...updates } : ann
      );
      return {
        ...prev,
        [pageId]: updatedAnns,
      };
    });
  }, []);

  const deleteAnnotation = useCallback((pageId, annotationId) => {
    pushHistorySnapshot();
    setAnnotations((prev) => ({
      ...prev,
      [pageId]: (prev[pageId] || []).filter((ann) => ann.id !== annotationId),
    }));
    setSelectedAnnotationId(null);
    showNotification('Annotation deleted');
  }, [pushHistorySnapshot, showNotification]);

  const clearPageDrawings = useCallback((pageId) => {
    pushHistorySnapshot();
    setAnnotations((prev) => ({
      ...prev,
      [pageId]: (prev[pageId] || []).filter((ann) => ann.type !== 'drawing'),
    }));
    showNotification('Cleared drawings on current page');
  }, [pushHistorySnapshot, showNotification]);

  /**
   * Export & Download PDF
   */
  const downloadPdf = useCallback(async () => {
    if (pages.length === 0) return;
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const modifiedBytes = await exportModifiedPdf({
        originalPdfBytes: pdfBytes,
        pages,
        annotations,
      });

      const baseName = fileName.replace(/\.pdf$/i, '');
      const exportName = `${baseName || 'document'}-edited.pdf`;

      const blob = new Blob([modifiedBytes], { type: 'application/pdf' });
      downloadBlob(blob, exportName);
      showNotification(`Downloaded ${exportName}`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setErrorMessage('Failed to export modified PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  }, [pages, pdfBytes, annotations, fileName, showNotification]);

  // Update specific tool setting
  const updateToolSetting = useCallback((tool, key, value) => {
    setToolSettings((prev) => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        [key]: value,
      },
    }));
  }, []);

  // Selected annotation object
  const currentPage = pages[currentPageIndex];
  const currentPageAnnotations = currentPage ? (annotations[currentPage.id] || []) : [];
  const selectedAnnotation = selectedAnnotationId
    ? currentPageAnnotations.find((a) => a.id === selectedAnnotationId)
    : null;

  const value = {
    // Document
    pdfBytes,
    pdfDoc,
    fileName,
    setFileName,
    fileSize,
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    currentPage,
    annotations,
    currentPageAnnotations,
    loadPdf,
    loadSampleDocument,
    resetDocument,

    // Tools & Selection
    activeTool,
    setActiveTool,
    selectedAnnotationId,
    setSelectedAnnotationId,
    selectedAnnotation,
    toolSettings,
    updateToolSetting,

    // Annotations
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearPageDrawings,

    // Page Management
    rotatePage,
    deletePage,
    duplicatePage,
    addBlankPage,
    reorderPages,
    movePage,

    // Undo / Redo
    undo,
    redo,
    canUndo: historyStack.length > 0,
    canRedo: redoStack.length > 0,

    // View
    zoom,
    setZoom,

    // Export
    downloadPdf,
    isExporting,

    // State & Toasts
    isLoading,
    errorMessage,
    setErrorMessage,
    notification,
    showNotification,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
}
