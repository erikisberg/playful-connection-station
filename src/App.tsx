// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';         // Public display: QR code + highscore
import GamePage from './pages/GamePage';           // Desktop game display
import MobileGameController from './pages/MobileGameController'; // Mobile controller flow

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/controller" element={<MobileGameController />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;