// src/pages/MobileGameController.tsx
import React, { useState, useEffect } from 'react';
import { RPC, insertCoin } from 'playroomkit';

const MobileGameController: React.FC = () => {
  const [phase, setPhase] = useState<'enterUsername' | 'controller' | 'gameOver'>('enterUsername');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // Register the mobile device as a player.
  useEffect(() => {
    const initMobilePlayer = async () => {
      try {
        // Call insertCoin to register this mobile device as a player.
        await insertCoin({
          streamMode: false, // Mobile controller: not a stream screen.
          skipLobby: true,   // Skip the default lobby UI.
          maxPlayersPerRoom: 1, // Adjust if you only expect one mobile controller.
        });
        console.log("Mobile device registered as player.");
      } catch (error) {
        console.error("Error initializing mobile player:", error);
      }
    };
    initMobilePlayer();
  }, []);

  const handleUsernameSubmit = async () => {
    if (username.trim() === '') return;
    console.log("Submitting username:", username);
    
    // Request storage access as part of the user gesture (the click on the submit button)
    try {
      await document.requestStorageAccess({ localStorage: true });
      console.log("localStorage access granted");
    } catch (error) {
      console.error("localStorage access denied:", error);
      // Optionally, you could inform the user that storage access is required.
      return;
    }
    
    try {
      await RPC.call("setUsername", username, RPC.Mode.ALL);
      console.log("Username submitted, switching phase");
      setPhase('controller');
    } catch (error) {
      console.error("Error setting username:", error);
    }
  };

  const handleStartGame = async () => {
    try {
      await RPC.call("startGame", null, RPC.Mode.ALL);
      setPhase('controller');
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const sendCommand = async (command: string) => {
    try {
      await RPC.call("handleInput", command, RPC.Mode.ALL);
    } catch (error) {
      console.error("Error sending RPC command:", error);
    }
  };

  const handleEmailSubmit = async () => {
    if (email.trim() === '') return;
    try {
      await RPC.call("submitEmail", email, RPC.Mode.ALL);
      alert("Email submitted. Thank you!");
      setPhase('enterUsername');
      setUsername('');
      setEmail('');
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  if (phase === 'enterUsername') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Enter Your Username</h1>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <br />
        <button
          onClick={handleUsernameSubmit}
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
        >
          Submit Username
        </button>
      </div>
    );
  }

  if (phase === 'controller') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Game Controller</h1>
        <button onClick={handleStartGame} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
          Start Game
        </button>
        <p>Use the buttons below to control the game:</p>
        <div style={{ margin: '1rem 0' }}>
          <button
            style={{ margin: '0.5rem', padding: '1rem 2rem' }}
            onTouchStart={() => sendCommand("left")}
            onTouchEnd={() => sendCommand("stopLeft")}
            onMouseDown={() => sendCommand("left")}
            onMouseUp={() => sendCommand("stopLeft")}
          >
            Left
          </button>
          <button
            style={{ margin: '0.5rem', padding: '1rem 2rem' }}
            onTouchStart={() => sendCommand("right")}
            onTouchEnd={() => sendCommand("stopRight")}
            onMouseDown={() => sendCommand("right")}
            onMouseUp={() => sendCommand("stopRight")}
          >
            Right
          </button>
        </div>
        <button onClick={() => setPhase('gameOver')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          End Game
        </button>
      </div>
    );
  }

  if (phase === 'gameOver') {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Game Over!</h1>
        <p>Enter your email to submit your score:</p>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <br />
        <button onClick={handleEmailSubmit} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
          Submit Email
        </button>
      </div>
    );
  }

  return null;
};

export default MobileGameController;