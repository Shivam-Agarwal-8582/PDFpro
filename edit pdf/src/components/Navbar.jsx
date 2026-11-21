import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Shield, ArrowRight, Upload } from 'lucide-react';
import { usePDF } from '../context/PDFContext';

export default function Navbar() {
  const location = useLocation();
  const { pdfDoc, loadSampleDocument } = usePDF();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                PDF<span className="text-blue-600">Pro</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                100% In-Browser
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-6">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                location.pathname === '/'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/editor"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                location.pathname === '/editor'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Edit PDF {pdfDoc && <span className="ml-1 inline-block w-2 h-2 rounded-full bg-green-500"></span>}
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                location.pathname === '/about'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              About
            </Link>

            {/* CTA Button */}
            <div className="pl-2 border-l border-gray-200 flex items-center gap-2">
              <Link
                to="/editor"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95"
              >
                <span>{pdfDoc ? 'Open Editor' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
