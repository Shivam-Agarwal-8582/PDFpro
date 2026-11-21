import React, { useState } from 'react';
import { Download, RefreshCw, Check } from 'lucide-react';

export default function DownloadButton({ downloadUrl, fileName, onCompressAnother }) {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!downloadUrl) return;

    // Create an anchor element to trigger download with proper filename
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName || 'compressed_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="w-full space-y-3">
      {/* Primary Download Button */}
      <button
        type="button"
        onClick={handleDownload}
        className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2.5 active:scale-[0.98] transition-all text-base ${
          downloaded
            ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 ring-2 ring-emerald-500/50'
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
        }`}
      >
        {downloaded ? (
          <>
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Downloaded!</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            <span>Download Compressed PDF</span>
          </>
        )}
      </button>

      {/* Compress Another Button */}
      {onCompressAnother && (
        <button
          type="button"
          onClick={onCompressAnother}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Compress another PDF document</span>
        </button>
      )}
    </div>
  );
}
