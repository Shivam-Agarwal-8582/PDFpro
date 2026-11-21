import React from 'react';
import {
  Type,
  Eraser,
  Highlighter,
  PenLine,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Info,
  Sliders,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { usePDF } from '../context/PDFContext';

export default function PropertiesPanel() {
  const {
    activeTool,
    selectedAnnotation,
    selectedAnnotationId,
    currentPage,
    updateAnnotation,
    deleteAnnotation,
    toolSettings,
    updateToolSetting,
    clearPageDrawings,
    setSelectedAnnotationId,
  } = usePDF();

  const colorPresets = [
    '#111827', // Black / Dark
    '#2563eb', // Blue
    '#dc2626', // Red
    '#16a34a', // Green
    '#ca8a04', // Amber
    '#9333ea', // Purple
  ];

  const highlightColors = [
    { hex: '#facc15', label: 'Yellow' },
    { hex: '#4ade80', label: 'Green' },
    { hex: '#f472b6', label: 'Pink' },
    { hex: '#60a5fa', label: 'Blue' },
    { hex: '#fb923c', label: 'Orange' },
  ];

  // If Text annotation is selected
  if (selectedAnnotation?.type === 'text') {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Text Properties</h3>
            </div>
            <button
              onClick={() => deleteAnnotation(currentPage.id, selectedAnnotation.id)}
              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition"
              title="Delete Text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Text Content */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              rows={3}
              value={selectedAnnotation.text || ''}
              onChange={(e) =>
                updateAnnotation(currentPage.id, selectedAnnotation.id, {
                  text: e.target.value,
                })
              }
              className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Font Family
            </label>
            <select
              value={selectedAnnotation.fontFamily || 'Helvetica'}
              onChange={(e) =>
                updateAnnotation(currentPage.id, selectedAnnotation.id, {
                  fontFamily: e.target.value,
                })
              }
              className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-hidden"
            >
              <option value="Helvetica">Helvetica (Clean Sans)</option>
              <option value="TimesRoman">Times Roman (Serif)</option>
              <option value="Courier">Courier (Monospace)</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Font Size</label>
              <span className="text-xs text-gray-500 font-mono">
                {selectedAnnotation.fontSize || 14}px
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="64"
              value={selectedAnnotation.fontSize || 14}
              onChange={(e) =>
                updateAnnotation(currentPage.id, selectedAnnotation.id, {
                  fontSize: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>

          {/* Style Toggles: Bold, Italic, Alignment */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    isBold: !selectedAnnotation.isBold,
                  })
                }
                className={`p-1.5 rounded-md text-xs transition ${
                  selectedAnnotation.isBold
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    isItalic: !selectedAnnotation.isItalic,
                  })
                }
                className={`p-1.5 rounded-md text-xs transition ${
                  selectedAnnotation.isItalic
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Italic"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, { align: 'left' })
                }
                className={`p-1.5 rounded-md text-xs transition ${
                  selectedAnnotation.align === 'left' || !selectedAnnotation.align
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, { align: 'center' })
                }
                className={`p-1.5 rounded-md text-xs transition ${
                  selectedAnnotation.align === 'center'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, { align: 'right' })
                }
                className={`p-1.5 rounded-md text-xs transition ${
                  selectedAnnotation.align === 'right'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    updateAnnotation(currentPage.id, selectedAnnotation.id, { color })
                  }
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full border border-gray-300 transition ${
                    selectedAnnotation.color === color
                      ? 'ring-2 ring-blue-500 scale-110'
                      : 'hover:scale-105'
                  }`}
                />
              ))}
              <input
                type="color"
                value={selectedAnnotation.color || '#111827'}
                onChange={(e) =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    color: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border border-gray-200"
                title="Custom color"
              />
            </div>
          </div>

          {/* Background fill */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Background Fill
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    backgroundColor: 'transparent',
                  })
                }
                className={`px-2 py-1 text-xs rounded border ${
                  selectedAnnotation.backgroundColor === 'transparent' ||
                  !selectedAnnotation.backgroundColor
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                None
              </button>
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    backgroundColor: '#ffffff',
                  })
                }
                className={`px-2 py-1 text-xs rounded border ${
                  selectedAnnotation.backgroundColor === '#ffffff'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                White
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedAnnotationId(null)}
          className="w-full mt-6 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Deselect
        </button>
      </aside>
    );
  }

  // If Whiteout annotation is selected
  if (selectedAnnotation?.type === 'whiteout') {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Eraser className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Whiteout & Replace</h3>
            </div>
            <button
              onClick={() => deleteAnnotation(currentPage.id, selectedAnnotation.id)}
              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition"
              title="Delete Whiteout"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
            <strong>How it works:</strong> This covers underlying text with a clean background block and optionally renders your replacement text on top.
          </div>

          {/* Replacement Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Replacement Text (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Leave empty for plain erasure, or type replacement text..."
              value={selectedAnnotation.replacementText || ''}
              onChange={(e) =>
                updateAnnotation(currentPage.id, selectedAnnotation.id, {
                  replacementText: e.target.value,
                })
              }
              className="w-full text-xs p-2 border border-gray-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Replacement Font Size */}
          {selectedAnnotation.replacementText && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-700">Text Size</label>
                <span className="text-xs text-gray-500 font-mono">
                  {selectedAnnotation.fontSize || 12}px
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="36"
                value={selectedAnnotation.fontSize || 12}
                onChange={(e) =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    fontSize: Number(e.target.value),
                  })
                }
                className="w-full accent-blue-600"
              />
            </div>
          )}

          {/* Fill Color */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Fill Color
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    fillColor: '#ffffff',
                  })
                }
                className="px-2.5 py-1 text-xs rounded-md bg-white border border-gray-300 font-semibold"
              >
                White (Standard)
              </button>
              <input
                type="color"
                value={selectedAnnotation.fillColor || '#ffffff'}
                onChange={(e) =>
                  updateAnnotation(currentPage.id, selectedAnnotation.id, {
                    fillColor: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border border-gray-200"
                title="Custom Background Color"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedAnnotationId(null)}
          className="w-full mt-6 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Deselect
        </button>
      </aside>
    );
  }

  // If Highlight annotation is selected
  if (selectedAnnotation?.type === 'highlight') {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Highlighter className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-gray-900">Highlight Properties</h3>
            </div>
            <button
              onClick={() => deleteAnnotation(currentPage.id, selectedAnnotation.id)}
              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition"
              title="Delete Highlight"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Highlight Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {highlightColors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() =>
                    updateAnnotation(currentPage.id, selectedAnnotation.id, {
                      color: c.hex,
                    })
                  }
                  style={{ backgroundColor: c.hex }}
                  className={`h-8 rounded-lg border border-gray-300 transition ${
                    selectedAnnotation.color === c.hex
                      ? 'ring-2 ring-blue-600 scale-105'
                      : 'hover:scale-102'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Opacity</label>
              <span className="text-xs text-gray-500 font-mono">
                {Math.round((selectedAnnotation.opacity || 0.4) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={selectedAnnotation.opacity || 0.4}
              onChange={(e) =>
                updateAnnotation(currentPage.id, selectedAnnotation.id, {
                  opacity: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        <button
          onClick={() => setSelectedAnnotationId(null)}
          className="w-full mt-6 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Deselect
        </button>
      </aside>
    );
  }

  // If Image annotation is selected
  if (selectedAnnotation?.type === 'image') {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">Image Properties</h3>
            <button
              onClick={() => deleteAnnotation(currentPage.id, selectedAnnotation.id)}
              className="p-1 rounded-md text-red-500 hover:bg-red-50 transition"
              title="Delete Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">
              Size: {Math.round(selectedAnnotation.width)} × {Math.round(selectedAnnotation.height)} pt
            </p>
            <p className="text-xs text-gray-400">
              Drag the bottom-right circle handle on the image to resize.
            </p>
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Opacity</label>
              <span className="text-xs text-gray-500 font-mono">
                {Math.round((selectedAnnotation.opacity !== undefined ? selectedAnnotation.opacity : 1.0) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={selectedAnnotation.opacity !== undefined ? selectedAnnotation.opacity : 1.0}
              onChange={(e) =>
                updateAnnotation(currentPage.id, selectedAnnotation.id, {
                  opacity: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        <button
          onClick={() => setSelectedAnnotationId(null)}
          className="w-full mt-6 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          Deselect
        </button>
      </aside>
    );
  }

  // When Draw tool is active (and no specific element selected)
  if (activeTool === 'draw') {
    return (
      <aside className="w-72 bg-white border-l border-gray-200 p-4 overflow-y-auto shrink-0 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <PenLine className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900">Drawing Tool Settings</h3>
          </div>

          {/* Pen / Eraser Mode */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateToolSetting('draw', 'isEraser', false)}
              className={`py-2 text-xs font-semibold rounded-lg border transition ${
                !toolSettings.draw.isEraser
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Pen Tool
            </button>
            <button
              onClick={() => updateToolSetting('draw', 'isEraser', true)}
              className={`py-2 text-xs font-semibold rounded-lg border transition ${
                toolSettings.draw.isEraser
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Eraser
            </button>
          </div>

          {/* Pen Color */}
          {!toolSettings.draw.isEraser && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Pen Color
              </label>
              <div className="flex items-center gap-2">
                {colorPresets.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateToolSetting('draw', 'color', c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border border-gray-300 transition ${
                      toolSettings.draw.color === c
                        ? 'ring-2 ring-blue-500 scale-110'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={toolSettings.draw.color}
                  onChange={(e) => updateToolSetting('draw', 'color', e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-gray-200"
                />
              </div>
            </div>
          )}

          {/* Stroke Width */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-700">Thickness</label>
              <span className="text-xs text-gray-500 font-mono">
                {toolSettings.draw.strokeWidth}px
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={toolSettings.draw.strokeWidth}
              onChange={(e) =>
                updateToolSetting('draw', 'strokeWidth', Number(e.target.value))
              }
              className="w-full accent-blue-600"
            />
          </div>

          {/* Clear drawings button */}
          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={() => clearPageDrawings(currentPage?.id)}
              className="w-full py-2 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition"
            >
              Clear Page Drawings
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // Default Guidance State
  return (
    <aside className="w-72 bg-white border-l border-gray-200 p-5 overflow-y-auto shrink-0 flex flex-col justify-between text-gray-600">
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-gray-900">Properties Panel</h3>
        </div>

        <p className="text-xs leading-relaxed text-gray-500">
          Select any element on the PDF or choose a tool above to customize its appearance, font, color, or opacity.
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>Add / Edit Text</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Click anywhere on the document to add text notes, headers, or paragraphs.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1">
              <Eraser className="w-3.5 h-3.5 text-blue-600" />
              <span>Whiteout & Replace</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Drag over existing text to cleanly erase it and write replacement text.
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mb-1">
              <Highlighter className="w-3.5 h-3.5 text-blue-600" />
              <span>Highlight Areas</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Emphasize important text sections with yellow, green, pink, or custom colors.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <span>
          Edits are instantly embedded into your final exported PDF when you click <strong>Download PDF</strong>.
        </span>
      </div>
    </aside>
  );
}
