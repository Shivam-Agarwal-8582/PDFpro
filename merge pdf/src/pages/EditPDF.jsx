import React from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, FileStack, ArrowRight } from 'lucide-react';

export default function EditPDF() {
  return (
    <div className="flex-1 bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <FileEdit className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Edit PDF Tool
        </h1>
        <p className="text-slate-600 max-w-xl mx-auto text-base">
          Our advanced PDF editor module is currently being fine-tuned. In the meantime, you can combine and arrange all your documents using our high-speed Merge PDF tool.
        </p>

        <div className="pt-4">
          <Link
            to="/merge-pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            <FileStack className="w-4 h-4" />
            <span>Go to Merge PDF</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
