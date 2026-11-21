import React, { useState } from 'react';
import { parsePageRange } from '../utils/pageRangeParser';
import { AlertCircle, Check, ArrowRight } from 'lucide-react';

export default function PageRangeInput({ totalPages, onApplyRange, disabled }) {
  const [rangeText, setRangeText] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rangeText.trim()) {
      setError('Please enter page numbers or ranges (e.g. 2-5, 8).');
      return;
    }

    const result = parsePageRange(rangeText, totalPages);
    if (!result.isValid) {
      setError(result.error);
      return;
    }

    setError(null);
    onApplyRange(result.pages);
  };

  const handleInputChange = (e) => {
    setRangeText(e.target.value);
    if (error) setError(null);
  };

  const handlePreset = (type) => {
    const pages = [];
    if (type === 'odd') {
      for (let i = 1; i <= totalPages; i += 2) pages.push(i);
      setRangeText(pages.join(', '));
      onApplyRange(pages);
    } else if (type === 'even') {
      for (let i = 2; i <= totalPages; i += 2) pages.push(i);
      setRangeText(pages.join(', '));
      onApplyRange(pages);
    } else if (type === 'last') {
      setRangeText(`${totalPages}`);
      onApplyRange([totalPages]);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={rangeText}
            onChange={handleInputChange}
            disabled={disabled}
            placeholder="e.g. 2-5, 8, 10-12"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-2 transition-all ${
              error
                ? 'border-red-400 focus:ring-red-300'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
        </div>

        <button
          type="submit"
          disabled={disabled || !rangeText.trim()}
          className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 active:bg-black text-white text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <span>Select Range</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Validation Error Feedback */}
      {error && (
        <div className="mt-2 flex items-center space-x-1.5 text-xs text-red-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Preset Quick Badges */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
        <span className="text-gray-400">Quick presets:</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePreset('odd')}
          className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          Odd pages
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePreset('even')}
          className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          Even pages
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => handlePreset('last')}
          className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
        >
          Last page
        </button>
      </div>
    </div>
  );
}
