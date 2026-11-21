import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  Trash2,
  Layers,
  Scissors,
  FileArchive,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [toolsOpen, setToolsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <Link to="/remove-pages" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform duration-200">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                  PDF<span className="text-indigo-600">Pro</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-600 -mt-1">
                  Document Suite
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setToolsOpen(!toolsOpen)}
                  onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100/80 flex items-center space-x-1 transition-colors"
                >
                  <span>All Tools</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {toolsOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Popular PDF Tools
                    </div>
                    <Link
                      to="/remove-pages"
                      className="flex items-center space-x-3 px-3 py-2.5 text-sm text-indigo-600 bg-indigo-50/70 font-medium rounded-lg mx-1"
                    >
                      <Trash2 className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>Remove Pages</div>
                        <div className="text-[11px] text-gray-600 font-normal">Delete unwanted PDF pages</div>
                      </div>
                    </Link>
                    <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg mx-1 cursor-default opacity-60">
                      <Layers className="w-4 h-4" />
                      <div>
                        <div>Merge PDF</div>
                        <div className="text-[11px] text-gray-600">Combine multiple files</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg mx-1 cursor-default opacity-60">
                      <Scissors className="w-4 h-4" />
                      <div>
                        <div>Split PDF</div>
                        <div className="text-[11px] text-gray-600">Extract pages or split</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg mx-1 cursor-default opacity-60">
                      <FileArchive className="w-4 h-4" />
                      <div>
                        <div>Compress PDF</div>
                        <div className="text-[11px] text-gray-600">Reduce document file size</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                to="/remove-pages"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === '/remove-pages'
                    ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                    : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100/80'
                }`}
              >
                Remove Pages
              </Link>
            </nav>
          </div>

          {/* Privacy & Client-side Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium text-gray-700">No Server Uploads</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
