// In src/pages/GamePage.tsx (or a similar desktop display file)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RetroGameCanvas from './RetroGameCanvas';
import EmailSubmission from './EmailSubmission';
import { insertCoin, RPC } from 'playroomkit';

const GamePage: React.FC = () => {
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Initialize Playroom Kit for the desktop (public display)
  useEffect(() => {
    const initGame = async () => {
      try {
        await insertCoin({
          streamMode: true, // Desktop acts as the public display
          skipLobby: true,
          maxPlayersPerRoom: 1,
        });
      } catch (error) {
        console.error("Error initializing Playroom Kit:", error);
      }
    };
    initGame();

    // Register RPC handlers from the mobile controller.
    RPC.register("setUsername", async (username: string) => {
      console.log("Username set:", username);
      // Optionally update public display or highscore state with this username.
      return Promise.resolve();
    });
    RPC.register("startGame", async () => {
      console.log("Start game command received.");
      // You might trigger a reset or start of the RetroGameCanvas here.
      return Promise.resolve();
    });
    RPC.register("submitEmail", async (email: string) => {
      console.log("Email received:", email);
      // Process the email (e.g., store in Supabase or update highscore).
      return Promise.resolve();
    });
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