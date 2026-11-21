import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PDFProvider } from './context/PDFContext';
import Home from './pages/Home';
import Editor from './pages/Editor';
import About from './pages/About';

export default function App() {
  return (
    <PDFProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </PDFProvider>
  );
}
