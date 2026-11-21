import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import EditPDF from './pages/EditPDF';
import MergePDF from './pages/MergePDF';
import CompressPDF from './pages/CompressPDF';
import RemovePages from './pages/RemovePages';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const location = useLocation();
  // Check if current route is active editor workspace (in edit-pdf when document is active)
  // Even then, navbar is always visible, and footer displays on standard views
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <ScrollToTop />
      {/* 1. Common Navigation Bar */}
      <Navbar />

      {/* 2. Page Content */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit-pdf" element={<EditPDF />} />
          <Route path="/editor" element={<Navigate to="/edit-pdf" replace />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/compress-pdf" element={<CompressPDF />} />
          <Route path="/remove-pages" element={<RemovePages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* 3. Common Footer */}
      <Footer />
    </div>
  );
}
