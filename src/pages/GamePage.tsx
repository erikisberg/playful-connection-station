// src/pages/GamePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RetroGameCanvas from './RetroGameCanvas';
import EmailSubmission from './EmailSubmission';
import { insertCoin } from 'playroomkit';

const GamePage: React.FC = () => {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Initialize Playroom Kit for the game.
  // Using skipLobby:true will bypass the default lobby UI.
  useEffect(() => {
    const initGame = async () => {
      try {
        await insertCoin({
          streamMode: true,  // false because we're not showing a stream screen on mobile
          skipLobby: false,
          maxPlayersPerRoom: 1, // Adjust as needed
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

export default GamePage;