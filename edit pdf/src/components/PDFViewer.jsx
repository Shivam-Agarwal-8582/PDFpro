import React, { useEffect, useRef, useState } from 'react';
import { usePDF } from '../context/PDFContext';
import { renderPageToCanvas } from '../services/pdfService';
import AnnotationOverlay from './AnnotationOverlay';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function PDFViewer() {
  const {
    pdfDoc,
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    currentPage,
    zoom,
    isLoading,
  } = usePDF();

  const canvasRef = useRef(null);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [renderedDims, setRenderedDims] = useState({ width: 595, height: 842 });

  // Render the current PDF page whenever page or zoom or rotation changes
  useEffect(() => {
    let isCancelled = false;

    async function render() {
      if (!currentPage) return;

      // Blank page rendering
      if (currentPage.isBlank || !pdfDoc || !currentPage.pageNumber) {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const pixelRatio = window.devicePixelRatio || 1;
          const w = (currentPage.width || 595) * zoom;
          const h = (currentPage.height || 842) * zoom;

          canvas.width = Math.floor(w * pixelRatio);
          canvas.height = Math.floor(h * pixelRatio);
          canvas.style.width = `${Math.floor(w)}px`;
          canvas.style.height = `${Math.floor(h)}px`;

          const ctx = canvas.getContext('2d');
          ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);

          setRenderedDims({ width: Math.floor(w), height: Math.floor(h) });
        }
        return;
      }

      if (!canvasRef.current || !pdfDoc) return;

      try {
        setIsPageRendering(true);
        const result = await renderPageToCanvas(
          pdfDoc,
          currentPage.pageNumber,
          canvasRef.current,
          zoom,
          currentPage.rotation
        );

        if (!isCancelled && result) {
          setRenderedDims({ width: result.width, height: result.height });
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Error rendering current page:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsPageRendering(false);
        }
      }
    }

    render();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, zoom]);

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 text-gray-500">
        No document loaded
      </div>
    );
  }

  return (
    <div className="flex-1 relative overflow-auto bg-gray-100/90 bg-canvas-pattern flex flex-col items-center p-4 sm:p-8">
      {/* Floating Navigation Controls */}
      <div className="sticky top-2 z-20 flex items-center gap-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-md border border-gray-200 mb-4">
        <button
          onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentPageIndex === 0}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        <span className="text-xs font-semibold text-gray-800">
          Page {currentPageIndex + 1} of {pages.length}
        </span>

        <button
          onClick={() => setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))}
          disabled={currentPageIndex >= pages.length - 1}
          className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-30 transition"
          title="Next Page (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Main Canvas & Overlay Container */}
      <div
        className="relative bg-white shadow-xl rounded-sm border border-gray-200 transition-all duration-150"
        style={{
          width: `${renderedDims.width}px`,
          height: `${renderedDims.height}px`,
        }}
      >
        {/* PDF Page Canvas */}
        <canvas ref={canvasRef} className="block w-full h-full" />

        {/* Interactive Annotation Overlay */}
        <AnnotationOverlay
          page={currentPage}
          zoom={zoom}
          width={renderedDims.width}
          height={renderedDims.height}
        />

        {/* Loading Spinner during render */}
        {isPageRendering && (
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full p-1.5 shadow-sm border border-gray-200">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-12 w-full" />
    </div>
  );
}
