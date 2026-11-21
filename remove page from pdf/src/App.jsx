import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RemovePages from './pages/RemovePages';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/remove-pages" element={<RemovePages />} />
            <Route path="/" element={<Navigate to="/remove-pages" replace />} />
            <Route path="*" element={<Navigate to="/remove-pages" replace />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
