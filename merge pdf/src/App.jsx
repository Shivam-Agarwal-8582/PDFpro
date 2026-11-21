import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MergePDF from './pages/MergePDF';
import Home from './pages/Home';
import EditPDF from './pages/EditPDF';
import About from './pages/About';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge-pdf" element={<MergePDF />} />
          <Route path="/edit-pdf" element={<EditPDF />} />
          <Route path="/about" element={<About />} />
          {/* Fallback to merge-pdf */}
          <Route path="*" element={<Navigate to="/merge-pdf" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
