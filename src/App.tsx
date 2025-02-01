// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import RetroGameCanvas from './pages/RetroGameCanvas';
import EmailSubmission from './pages/EmailSubmission';
import Controller from './pages/Controller';
import { insertCoin } from 'playroomkit'; // Ensure you import and call this as needed

// A wrapper for the game page that integrates the RetroGameCanvas and email submission
const GamePage: React.FC = () => {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Initialize Playroom Kit (for example, in stream mode)
  // This will allow the desktop game and mobile controller to join the same session.
  React.useEffect(() => {
    const initGame = async () => {
      try {
        await insertCoin({
          streamMode: true,
          maxPlayersPerRoom: 4, // Adjust if needed
        });
      } catch (error) {
        console.error("Error initializing Playroom Kit:", error);
      }
    };
    initGame();
  }, []);

  const handleGameOver = (score: number) => {
    setFinalScore(score);
  };

  const handleRestart = () => {
    setFinalScore(null);
    setSubmitted(false);
    navigate('/');
  };

  return (
    <div>
      {finalScore === null ? (
        <RetroGameCanvas onGameOver={handleGameOver} />
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Game Over!</h2>
          <p>Your final score: {finalScore}</p>
          {!submitted ? (
            <EmailSubmission score={finalScore} onSubmitted={() => setSubmitted(true)} />
          ) : (
            <p>Score submitted! Thank you!</p>
          )}
          <button onClick={handleRestart} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
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