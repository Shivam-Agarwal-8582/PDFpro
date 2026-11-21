import React, { useRef } from 'react';
import {
  MousePointer,
  Type,
  Eraser,
  Highlighter,
  PenLine,
  ImagePlus,
  Square,
  HelpCircle,
} from 'lucide-react';
import { usePDF } from '../context/PDFContext';

export default function ToolsBar() {
  const { activeTool, setActiveTool, addAnnotation, currentPage, showNotification } = usePDF();
  const imageInputRef = useRef(null);

  const tools = [
    {
      id: 'select',
      label: 'Select / Move',
      icon: MousePointer,
      description: 'Select, move and resize existing elements',
    },
    {
      id: 'text',
      label: 'Add Text',
      icon: Type,
      description: 'Click anywhere on the page to insert text',
    },
    {
      id: 'whiteout',
      label: 'Whiteout & Replace',
      icon: Eraser,
      description: 'Erase or whiteout existing text and write replacement',
    },
    {
      id: 'highlight',
      label: 'Highlight',
      icon: Highlighter,
      description: 'Draw highlight boxes to emphasize important text',
    },
    {
      id: 'draw',
      label: 'Draw / Pen',
      icon: PenLine,
      description: 'Freehand sketch and annotations',
    },
    {
      id: 'image',
      label: 'Add Image',
      icon: ImagePlus,
      description: 'Insert JPG or PNG images',
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      icon: Square,
      description: 'Add border box or colored shape',
    },
  ];

  // Handle image upload and insert directly onto the active page
  const handleImageFileChange = (e) => {
    if (!currentPage) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a JPG or PNG image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        // Calculate reasonable initial dimensions (max 200px wide, keeping aspect ratio)
        const maxWidth = 200;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Place near center of page
        const x = Math.max(20, Math.round((currentPage.width - width) / 2));
        const y = Math.max(50, Math.round((currentPage.height - height) / 3));

        addAnnotation(currentPage.id, {
          type: 'image',
          x,
          y,
          width,
          height,
          dataUrl,
          opacity: 1.0,
        });

        setActiveTool('select');
        showNotification('Image added to page');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  };

  const handleToolClick = (toolId) => {
    if (toolId === 'image') {
      imageInputRef.current?.click();
    } else {
      setActiveTool(toolId);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between overflow-x-auto shadow-2xs">
      {/* Hidden image file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleImageFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-1.5 sm:gap-2 mx-auto sm:mx-0">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={tool.description}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden md:inline">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contextual tool guidance message */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200/80">
        <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        <span>
          {activeTool === 'select' && 'Click any element to select, move, or format.'}
          {activeTool === 'text' && 'Click anywhere on the PDF page to add text.'}
          {activeTool === 'whiteout' && 'Drag a box over text to erase or replace it.'}
          {activeTool === 'highlight' && 'Drag over areas to add semi-transparent highlight.'}
          {activeTool === 'draw' && 'Click and drag on the page to sketch freehand.'}
          {activeTool === 'image' && 'Click to browse and insert a JPG/PNG.'}
          {activeTool === 'rectangle' && 'Drag on the page to create a box shape.'}
        </span>
      </div>
    </div>
  );
}
