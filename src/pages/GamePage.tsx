// src/pages/GamePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RetroGameCanvas from './RetroGameCanvas';
import EmailSubmission from './EmailSubmission';
import { insertCoin, RPC } from 'playroomkit';

const GamePage: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Initialize Playroom Kit for the public display (desktop)
  useEffect(() => {
    const initDesktop = async () => {
      try {
        await insertCoin({
          streamMode: true, // desktop acts as host
          skipLobby: true,
          maxPlayersPerRoom: 1,
        });
        console.log("Desktop registered as host.");
      } catch (error) {
        console.error("Error initializing desktop:", error);
      }
    };
    initDesktop();

    // Register RPC handlers to receive messages from mobile.
    const unregisterSetUsername = RPC.register("setUsername", async (username: string) => {
      console.log("Desktop received username:", username);
      // Optionally update UI with the username.
      return Promise.resolve();
    });
    const unregisterStartGame = RPC.register("startGame", async () => {
      console.log("Desktop received startGame command.");
      setGameStarted(true);
      return Promise.resolve();
    });
    const unregisterSubmitEmail = RPC.register("submitEmail", async (email: string) => {
      console.log("Desktop received email:", email);
      // Here, you might update your highscore or store the email.
      return Promise.resolve();
    });
    return () => {
      if (unregisterSetUsername) unregisterSetUsername();
      if (unregisterStartGame) unregisterStartGame();
      if (unregisterSubmitEmail) unregisterSubmitEmail();
    };
  }, []);

  const handleGameOver = (score: number) => {
    setFinalScore(score);
  };

  const handleRestart = () => {
    setFinalScore(null);
    setSubmitted(false);
    setGameStarted(false);
    navigate('/');
  };

  return (
    <div>
      {!gameStarted ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Waiting for mobile to start the game...</h2>
          <p>Please use your mobile controller to begin.</p>
        </div>
      ) : (
        finalScore === null ? (
          <RetroGameCanvas onGameOver={handleGameOver} />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Game Over!</h2>
            <p>Your final score: {finalScore}</p>
            {!submitted ? (
              <EmailSubmission
                score={finalScore}
                onSubmitted={() => setSubmitted(true)}
              />
            ) : (
              <p>Score submitted! Thank you!</p>
            )}
            <button
              onClick={handleRestart}
              style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
            >
              Back to Home
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default GamePage;