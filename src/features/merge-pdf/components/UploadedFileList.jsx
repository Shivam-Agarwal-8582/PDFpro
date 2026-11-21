import React, { useState } from 'react';
import { Layers, Trash2, ArrowUpDown, Info } from 'lucide-react';
import PDFFileCard from './PDFFileCard';
import FileUpload from './FileUpload';
import { formatBytes } from '../utils/fileValidation';

export default function UploadedFileList({
  files,
  onRemoveFile,
  onReorderFiles,
  onPageRangeChange,
  onAddMoreFiles,
  onClearAll,
  isProcessing = false
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const totalSize = files.reduce((acc, curr) => acc + (curr.file?.size || 0), 0);
  const totalPages = files.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newFiles = [...files];
    const [movedItem] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(targetIndex, 0, movedItem);

    onReorderFiles(newFiles);
    setDraggedIndex(null);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    onReorderFiles(newFiles);
  };

  const handleMoveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    onReorderFiles(newFiles);
  };

  return (
    <div className="space-y-4">
      {/* List Header bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                Selected Documents
              </h3>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {files.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Total {totalPages} pages • {formatBytes(totalSize)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <FileUpload
            onFilesSelected={onAddMoreFiles}
            isProcessing={isProcessing}
            compact={true}
          />

          <button
            type="button"
            onClick={onClearAll}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 text-xs font-medium border border-slate-200 hover:border-red-200 transition-colors disabled:opacity-50"
            title="Remove all files"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        </div>
      </div>

      {/* Helper notice */}
      <div className="flex items-center gap-2 text-xs text-slate-500 px-1">
        <ArrowUpDown className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>
          Drag items or click the up/down arrows to arrange the exact page sequence for the merged document.
        </span>
      </div>

      {/* File Cards List */}
      <div className="space-y-2.5">
        {files.map((item, index) => (
          <PDFFileCard
            key={item.id}
            item={item}
            index={index}
            totalCount={files.length}
            onRemove={onRemoveFile}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onPageRangeChange={onPageRangeChange}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDraggingCurrent={draggedIndex === index}
          />
        ))}
      </div>
    </div>
  );
}
