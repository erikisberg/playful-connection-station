// App.tsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import RetroGameCanvas from './pages/RetroGameCanvas';
import EmailSubmission from './pages/EmailSubmission';

const GamePage: React.FC = () => {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Callback passed to RetroGameCanvas when the game ends
  const handleGameOver = (score: number) => {
    setFinalScore(score);
  };

  // Restarting the game will send the user back to the landing page
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;