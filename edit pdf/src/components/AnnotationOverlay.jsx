import React, { useState, useRef, useEffect } from 'react';
import { usePDF } from '../context/PDFContext';
import { hexToRgba } from '../utils/pdfCoordinates';
import { Trash2, Move, Edit3 } from 'lucide-react';

export default function AnnotationOverlay({ page, zoom, width, height }) {
  const {
    activeTool,
    setActiveTool,
    selectedAnnotationId,
    setSelectedAnnotationId,
    annotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
    toolSettings,
  } = usePDF();

  const pageAnnotations = annotations[page.id] || [];
  const overlayRef = useRef(null);

  // Dragging state for creating new shapes (whiteout, highlight, rectangle)
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [shapeStart, setShapeStart] = useState({ x: 0, y: 0 });
  const [currentRect, setCurrentRect] = useState(null);

  // Freehand drawing state
  const [isPenDown, setIsPenDown] = useState(false);
  const [currentStroke, setCurrentStroke] = useState([]);

  // Moving existing annotation
  const [isMoving, setIsMoving] = useState(false);
  const [moveStart, setMoveStart] = useState({ x: 0, y: 0 });
  const [movingAnnotation, setMovingAnnotation] = useState(null);

  // Resizing existing annotation
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [resizingAnnotation, setResizingAnnotation] = useState(null);

  // Inline text editing
  const [editingTextId, setEditingTextId] = useState(null);

  // Convert client mouse/touch event to unscaled PDF points
  const getPointFromEvent = (e) => {
    if (!overlayRef.current) return { x: 0, y: 0 };
    const rect = overlayRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    const xDom = clientX - rect.left;
    const yDom = clientY - rect.top;

    return {
      x: Math.round(xDom / zoom),
      y: Math.round(yDom / zoom),
      xDom,
      yDom,
    };
  };

  // MOUSE DOWN HANDLER
  const handleMouseDown = (e) => {
    const pt = getPointFromEvent(e);

    // If active tool is Text: click places a new text box
    if (activeTool === 'text') {
      const newId = addAnnotation(page.id, {
        type: 'text',
        x: pt.x,
        y: pt.y,
        text: 'Type text here',
        fontFamily: toolSettings.text.fontFamily,
        fontSize: toolSettings.text.fontSize,
        color: toolSettings.text.color,
        backgroundColor: toolSettings.text.backgroundColor,
        isBold: toolSettings.text.isBold,
        isItalic: toolSettings.text.isItalic,
        align: toolSettings.text.align,
        width: 140,
      });
      setEditingTextId(newId);
      setActiveTool('select');
      return;
    }

    // If active tool is Whiteout, Highlight, or Rectangle: start drag rectangle
    if (activeTool === 'whiteout' || activeTool === 'highlight' || activeTool === 'rectangle') {
      setIsDrawingShape(true);
      setShapeStart({ x: pt.x, y: pt.y });
      setCurrentRect({ x: pt.x, y: pt.y, width: 0, height: 0 });
      return;
    }

    // If active tool is Draw: start freehand stroke
    if (activeTool === 'draw') {
      setIsPenDown(true);
      setCurrentStroke([{ x: pt.x, y: pt.y }]);
      return;
    }

    // If Select tool: clicking background deselects
    if (activeTool === 'select' && e.target === overlayRef.current) {
      setSelectedAnnotationId(null);
      setEditingTextId(null);
    }
  };

  // MOUSE MOVE HANDLER
  const handleMouseMove = (e) => {
    const pt = getPointFromEvent(e);

    // Drag-drawing shape
    if (isDrawingShape && currentRect) {
      const x = Math.min(shapeStart.x, pt.x);
      const y = Math.min(shapeStart.y, pt.y);
      const w = Math.abs(pt.x - shapeStart.x);
      const h = Math.abs(pt.y - shapeStart.y);
      setCurrentRect({ x, y, width: w, height: h });
      return;
    }

    // Freehand drawing stroke
    if (isPenDown && activeTool === 'draw') {
      setCurrentStroke((prev) => [...prev, { x: pt.x, y: pt.y }]);
      return;
    }

    // Moving selected annotation
    if (isMoving && movingAnnotation) {
      const dx = pt.x - moveStart.x;
      const dy = pt.y - moveStart.y;
      updateAnnotation(page.id, movingAnnotation.id, {
        x: Math.max(0, movingAnnotation.initialX + dx),
        y: Math.max(0, movingAnnotation.initialY + dy),
      });
      return;
    }

    // Resizing selected annotation
    if (isResizing && resizingAnnotation) {
      const dx = pt.x - moveStart.x;
      const dy = pt.y - moveStart.y;
      let newW = Math.max(20, resizingAnnotation.initialWidth + dx);
      let newH = Math.max(15, resizingAnnotation.initialHeight + dy);

      updateAnnotation(page.id, resizingAnnotation.id, {
        width: newW,
        height: newH,
      });
      return;
    }
  };

  // MOUSE UP HANDLER
  const handleMouseUp = () => {
    // Finish drawing shape
    if (isDrawingShape && currentRect) {
      if (currentRect.width > 5 && currentRect.height > 5) {
        if (activeTool === 'whiteout') {
          addAnnotation(page.id, {
            type: 'whiteout',
            x: currentRect.x,
            y: currentRect.y,
            width: currentRect.width,
            height: currentRect.height,
            fillColor: toolSettings.whiteout.fillColor,
            replacementText: '',
            color: toolSettings.whiteout.color,
            fontSize: toolSettings.whiteout.fontSize,
          });
        } else if (activeTool === 'highlight') {
          addAnnotation(page.id, {
            type: 'highlight',
            x: currentRect.x,
            y: currentRect.y,
            width: currentRect.width,
            height: currentRect.height,
            color: toolSettings.highlight.color,
            opacity: toolSettings.highlight.opacity,
          });
        } else if (activeTool === 'rectangle') {
          addAnnotation(page.id, {
            type: 'rectangle',
            x: currentRect.x,
            y: currentRect.y,
            width: currentRect.width,
            height: currentRect.height,
            borderWidth: 2,
            borderColor: '#2563eb',
            fillColor: 'transparent',
          });
        }
        setActiveTool('select');
      }
      setIsDrawingShape(false);
      setCurrentRect(null);
    }

    // Finish freehand drawing
    if (isPenDown && currentStroke.length > 1) {
      addAnnotation(page.id, {
        type: 'drawing',
        points: currentStroke,
        color: toolSettings.draw.isEraser ? '#ffffff' : toolSettings.draw.color,
        strokeWidth: toolSettings.draw.strokeWidth,
        opacity: 1.0,
      });
      setIsPenDown(false);
      setCurrentStroke([]);
    }

    setIsMoving(false);
    setMovingAnnotation(null);
    setIsResizing(false);
    setResizingAnnotation(null);
  };

  // Start moving an annotation
  const startMove = (e, ann) => {
    e.stopPropagation();
    if (activeTool !== 'select') return;
    setSelectedAnnotationId(ann.id);
    const pt = getPointFromEvent(e);
    setIsMoving(true);
    setMoveStart({ x: pt.x, y: pt.y });
    setMovingAnnotation({
      id: ann.id,
      initialX: ann.x,
      initialY: ann.y,
    });
  };

  // Start resizing an annotation
  const startResize = (e, ann, handle) => {
    e.stopPropagation();
    if (activeTool !== 'select') return;
    const pt = getPointFromEvent(e);
    setIsResizing(true);
    setResizeHandle(handle);
    setMoveStart({ x: pt.x, y: pt.y });
    setResizingAnnotation({
      id: ann.id,
      initialWidth: ann.width,
      initialHeight: ann.height,
    });
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`absolute inset-0 select-none overflow-hidden ${
        activeTool === 'draw'
          ? 'cursor-crosshair'
          : activeTool === 'text'
          ? 'cursor-text'
          : activeTool === 'whiteout' || activeTool === 'highlight' || activeTool === 'rectangle'
          ? 'cursor-crosshair'
          : 'cursor-default'
      }`}
    >
      {/* 1. Render Freehand Drawings SVG layer */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {pageAnnotations
          .filter((a) => a.type === 'drawing' && a.points?.length > 1)
          .map((drawing) => {
            const pathData = drawing.points
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * zoom} ${p.y * zoom}`)
              .join(' ');

            return (
              <path
                key={drawing.id}
                d={pathData}
                fill="none"
                stroke={drawing.color}
                strokeWidth={drawing.strokeWidth * zoom}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={drawing.opacity || 1}
              />
            );
          })}

        {/* Live stroke during drawing */}
        {isPenDown && currentStroke.length > 1 && (
          <path
            d={currentStroke
              .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * zoom} ${p.y * zoom}`)
              .join(' ')}
            fill="none"
            stroke={toolSettings.draw.isEraser ? '#ffffff' : toolSettings.draw.color}
            strokeWidth={toolSettings.draw.strokeWidth * zoom}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>

      {/* 2. Render Existing Annotations (Whiteouts, Highlights, Images, Text, Rectangles) */}
      {pageAnnotations.map((ann) => {
        const isSelected = selectedAnnotationId === ann.id && activeTool === 'select';
        const domX = ann.x * zoom;
        const domY = ann.y * zoom;
        const domW = (ann.width || 120) * zoom;
        const domH = (ann.height || 40) * zoom;

        // Render based on type
        switch (ann.type) {
          case 'whiteout': {
            return (
              <div
                key={ann.id}
                onMouseDown={(e) => startMove(e, ann)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotationId(ann.id);
                }}
                style={{
                  left: `${domX}px`,
                  top: `${domY}px`,
                  width: `${domW}px`,
                  height: `${domH}px`,
                  backgroundColor: ann.fillColor || '#ffffff',
                }}
                className={`absolute group cursor-move transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-blue-500 shadow-md'
                    : 'hover:ring-1 hover:ring-blue-300'
                }`}
              >
                {/* Replacement text preview if set */}
                {ann.replacementText ? (
                  <div
                    style={{
                      color: ann.color || '#111827',
                      fontSize: `${(ann.fontSize || 12) * zoom}px`,
                    }}
                    className="p-1 font-sans leading-tight overflow-hidden break-words"
                  >
                    {ann.replacementText}
                  </div>
                ) : (
                  <span className="text-[10px] text-gray-400 p-1 block select-none pointer-events-none opacity-0 group-hover:opacity-100">
                    Whiteout
                  </span>
                )}

                {/* Resize Handle */}
                {isSelected && (
                  <div
                    onMouseDown={(e) => startResize(e, ann, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 rounded-full cursor-se-resize border-2 border-white shadow-xs"
                  />
                )}
              </div>
            );
          }

          case 'highlight': {
            return (
              <div
                key={ann.id}
                onMouseDown={(e) => startMove(e, ann)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotationId(ann.id);
                }}
                style={{
                  left: `${domX}px`,
                  top: `${domY}px`,
                  width: `${domW}px`,
                  height: `${domH}px`,
                  backgroundColor: hexToRgba(ann.color || '#facc15', ann.opacity || 0.4),
                }}
                className={`absolute cursor-move rounded-xs transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-blue-500 shadow-xs'
                    : 'hover:ring-1 hover:ring-yellow-400'
                }`}
              >
                {isSelected && (
                  <div
                    onMouseDown={(e) => startResize(e, ann, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 rounded-full cursor-se-resize border-2 border-white shadow-xs"
                  />
                )}
              </div>
            );
          }

          case 'image': {
            return (
              <div
                key={ann.id}
                onMouseDown={(e) => startMove(e, ann)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotationId(ann.id);
                }}
                style={{
                  left: `${domX}px`,
                  top: `${domY}px`,
                  width: `${domW}px`,
                  height: `${domH}px`,
                }}
                className={`absolute group cursor-move select-none ${
                  isSelected
                    ? 'ring-2 ring-blue-500 shadow-md'
                    : 'hover:ring-1 hover:ring-blue-300'
                }`}
              >
                <img
                  src={ann.dataUrl}
                  alt="Inserted"
                  draggable={false}
                  style={{ opacity: ann.opacity !== undefined ? ann.opacity : 1.0 }}
                  className="w-full h-full object-fill pointer-events-none rounded-xs"
                />

                {isSelected && (
                  <div
                    onMouseDown={(e) => startResize(e, ann, 'se')}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-600 rounded-full cursor-se-resize border-2 border-white shadow-sm"
                  />
                )}
              </div>
            );
          }

          case 'text': {
            const isEditing = editingTextId === ann.id;

            return (
              <div
                key={ann.id}
                onMouseDown={(e) => startMove(e, ann)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotationId(ann.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingTextId(ann.id);
                }}
                style={{
                  left: `${domX}px`,
                  top: `${domY}px`,
                  width: ann.width ? `${ann.width * zoom}px` : 'auto',
                  minWidth: `${100 * zoom}px`,
                  fontFamily: ann.fontFamily || 'Helvetica, sans-serif',
                  fontSize: `${(ann.fontSize || 14) * zoom}px`,
                  color: ann.color || '#111827',
                  backgroundColor:
                    ann.backgroundColor && ann.backgroundColor !== 'transparent'
                      ? ann.backgroundColor
                      : 'transparent',
                  fontWeight: ann.isBold ? 'bold' : 'normal',
                  fontStyle: ann.isItalic ? 'italic' : 'normal',
                  textAlign: ann.align || 'left',
                }}
                className={`absolute p-1 cursor-move transition-shadow rounded-xs ${
                  isSelected
                    ? 'ring-2 ring-blue-500 shadow-xs'
                    : 'hover:ring-1 hover:ring-blue-300'
                }`}
              >
                {isEditing ? (
                  <textarea
                    value={ann.text}
                    autoFocus
                    onChange={(e) =>
                      updateAnnotation(page.id, ann.id, { text: e.target.value })
                    }
                    onBlur={() => setEditingTextId(null)}
                    onMouseDown={(e) => e.stopPropagation()}
                    style={{
                      fontSize: `${(ann.fontSize || 14) * zoom}px`,
                      color: ann.color || '#111827',
                    }}
                    className="w-full bg-white/95 border border-blue-400 rounded-xs p-1 focus:outline-hidden resize-none"
                    rows={Math.max(1, (ann.text || '').split('\n').length)}
                  />
                ) : (
                  <div className="whitespace-pre-wrap break-words leading-tight">
                    {ann.text || 'Double-click to type'}
                  </div>
                )}

                {/* Resize width handle */}
                {isSelected && !isEditing && (
                  <div
                    onMouseDown={(e) => startResize(e, ann, 'e')}
                    className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full cursor-e-resize border-2 border-white shadow-xs"
                  />
                )}
              </div>
            );
          }

          case 'rectangle': {
            return (
              <div
                key={ann.id}
                onMouseDown={(e) => startMove(e, ann)}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotationId(ann.id);
                }}
                style={{
                  left: `${domX}px`,
                  top: `${domY}px`,
                  width: `${domW}px`,
                  height: `${domH}px`,
                  borderColor: ann.borderColor || '#2563eb',
                  borderWidth: `${(ann.borderWidth || 2) * zoom}px`,
                  backgroundColor: ann.fillColor || 'transparent',
                }}
                className={`absolute border cursor-move ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {isSelected && (
                  <div
                    onMouseDown={(e) => startResize(e, ann, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-blue-600 rounded-full cursor-se-resize border-2 border-white shadow-xs"
                  />
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}

      {/* 3. Live Shape Box Preview while user is dragging */}
      {isDrawingShape && currentRect && (
        <div
          style={{
            left: `${currentRect.x * zoom}px`,
            top: `${currentRect.y * zoom}px`,
            width: `${currentRect.width * zoom}px`,
            height: `${currentRect.height * zoom}px`,
            backgroundColor:
              activeTool === 'whiteout'
                ? '#ffffff'
                : activeTool === 'highlight'
                ? hexToRgba(toolSettings.highlight.color, toolSettings.highlight.opacity)
                : 'transparent',
            borderColor: activeTool === 'whiteout' ? '#94a3b8' : '#2563eb',
            borderWidth: '1.5px',
            borderStyle: activeTool === 'whiteout' ? 'dashed' : 'solid',
          }}
          className="absolute pointer-events-none shadow-xs"
        />
      )}
    </div>
  );
}
