// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import GamePage from './pages/GamePage'; // This wraps RetroGameCanvas and EmailSubmission
import { useIsMobile } from './hooks/useIsMobile';

const App: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <BrowserRouter>
      <Routes>
        {/* On mobile, directly show the game page; on desktop, show the landing page */}
        <Route path="/" element={ isMobile ? <GamePage /> : <Landing /> } />
        {/* Also allow navigation to /game on any device */}
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;