import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  RotateCcw,
  Copy,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { usePDF } from '../context/PDFContext';
import { renderThumbnail } from '../services/pdfService';
import DeleteConfirmModal from './DeleteConfirmModal';

// Thumbnail item component
function PageThumbnailItem({
  page,
  index,
  isActive,
  onSelect,
  onRotateCw,
  onRotateCcw,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  pdfDoc,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (page.isBlank || !pdfDoc || !page.pageNumber) {
      // Clear or draw blank page
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = 120;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Blank Page', 60, 80);
      }
      return;
    }

    if (canvasRef.current && pdfDoc) {
      renderThumbnail(pdfDoc, page.pageNumber, canvasRef.current, 120, page.rotation);
    }
  }, [page, pdfDoc]);

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col items-center p-2 rounded-xl border-2 transition-all cursor-pointer ${
        isActive
          ? 'border-blue-600 bg-blue-50/40 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
      }`}
    >
      {/* Page number badge */}
      <div className="w-full flex items-center justify-between mb-1.5 px-1">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-md ${
            isActive ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          {index + 1}
        </span>

        {/* Quick action icons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRotateCw();
            }}
            className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-white"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 rounded text-gray-500 hover:text-blue-600 hover:bg-white"
            title="Duplicate Page"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded text-gray-500 hover:text-red-600 hover:bg-white"
            title="Delete Page"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Canvas */}
      <div className="bg-white rounded-md shadow-xs border border-gray-200 overflow-hidden flex items-center justify-center p-0.5">
        <canvas ref={canvasRef} className="max-w-full h-auto object-contain" />
      </div>

      {/* Reorder and rotation controls bar below thumbnail */}
      <div className="w-full mt-2 pt-1 border-t border-gray-100 flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={!canMoveUp}
            className="p-0.5 rounded hover:text-gray-800 disabled:opacity-20"
            title="Move Page Up"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={!canMoveDown}
            className="p-0.5 rounded hover:text-gray-800 disabled:opacity-20"
            title="Move Page Down"
          >
            <ArrowDown className="w-3 h-3" />
          </button>
        </div>

        <span className="text-[10px] text-gray-400">
          {page.rotation > 0 ? `${page.rotation}°` : ''}
        </span>
      </div>
    </div>
  );
}

export default function PageSidebar() {
  const {
    pages,
    currentPageIndex,
    setCurrentPageIndex,
    pdfDoc,
    rotatePage,
    deletePage,
    duplicatePage,
    addBlankPage,
    movePage,
  } = usePDF();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, pageNumber }

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deletePage(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-200 flex flex-col shrink-0 z-20 ${
          isCollapsed ? 'w-12' : 'w-56 sm:w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-gray-900">
                Pages ({pages.length})
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition mx-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Thumbnail List */}
        {!isCollapsed ? (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {pages.map((page, index) => (
              <PageThumbnailItem
                key={page.id}
                page={page}
                index={index}
                isActive={currentPageIndex === index}
                pdfDoc={pdfDoc}
                onSelect={() => setCurrentPageIndex(index)}
                onRotateCw={() => rotatePage(page.id, 90)}
                onRotateCcw={() => rotatePage(page.id, -90)}
                onDuplicate={() => duplicatePage(page.id)}
                onDelete={() => setDeleteTarget({ id: page.id, pageNumber: index + 1 })}
                onMoveUp={() => movePage(index, 'up')}
                onMoveDown={() => movePage(index, 'down')}
                canMoveUp={index > 0}
                canMoveDown={index < pages.length - 1}
              />
            ))}

            {/* Add Blank Page Button */}
            <button
              onClick={() => addBlankPage(currentPageIndex)}
              className="w-full py-2.5 px-3 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-gray-600 hover:text-blue-600 flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Blank Page</span>
            </button>
          </div>
        ) : (
          /* Collapsed View */
          <div className="flex-1 overflow-y-auto p-1.5 space-y-2">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setCurrentPageIndex(index)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition mx-auto ${
                  currentPageIndex === index
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={`Jump to Page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => addBlankPage(currentPageIndex)}
              className="w-8 h-8 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-500 hover:text-blue-600 flex items-center justify-center mx-auto transition"
              title="Add Blank Page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </aside>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        pageNumber={deleteTarget?.pageNumber}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
