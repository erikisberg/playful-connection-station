// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import RetroGameCanvas from './pages/RetroGameCanvas';
import EmailSubmission from './pages/EmailSubmission';
import Controller from './pages/Controller';

const GamePage: React.FC = () => {
  // (Your existing game logic for the desktop game)
  // ...
  return <RetroGameCanvas /* ...props */ />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/controller" element={<Controller />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;