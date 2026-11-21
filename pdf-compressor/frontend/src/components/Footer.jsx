import React from 'react';
import { Link } from 'react-router-dom';
import { FileDown, ShieldCheck, Clock, Lock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <FileDown className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">DocPress</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Professional, genuine PDF compression without compromising document clarity or formatting.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span>256-Bit SSL Secured</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              PDF Solutions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/compress" className="text-slate-600 hover:text-indigo-600 font-medium">
                  Compress PDF
                </Link>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Merge PDF (Coming soon)</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">Split PDF (Coming soon)</span>
              </li>
              <li>
                <span className="text-slate-400 cursor-not-allowed">PDF to JPG (Coming soon)</span>
              </li>
            </ul>
          </div>

          {/* Privacy & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Security & Privacy
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Auto-deleted after 1 hour</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero file logging or selling</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>No registration required</span>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Information
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/#how-it-works" className="hover:text-indigo-600">
                  How Compression Works
                </Link>
              </li>
              <li>
                <Link to="/#features" className="hover:text-indigo-600">
                  Key Features
                </Link>
              </li>
              <li>
                <a href="#privacy" className="hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-indigo-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DocPress PDF Compressor. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> using React.js & Node.js
          </p>
        </div>
      </div>
    </footer>
  );
}
