// src/pages/MobileGameController.tsx
import React, { useState } from 'react';
import { RPC } from 'playroomkit';

const MobileGameController: React.FC = () => {
  const [phase, setPhase] = useState<'enterUsername' | 'controller' | 'gameOver'>('enterUsername');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // When the username is submitted, send it to the desktop display via RPC.
  const handleUsernameSubmit = async () => {
    if (username.trim() === '') return;
    try {
      console.log("Submitting username:", username); // Debug log
      await RPC.call("setUsername", username, RPC.Mode.ALL);
      console.log("Username submitted, switching phase");
      setPhase('controller');
    } catch (error) {
      console.error("Error setting username:", error);
    }
  };

  // When the start button is pressed, tell the desktop to start the game.
  const handleStartGame = async () => {
    try {
      await RPC.call("startGame", null, RPC.Mode.ALL);
      // Remain in the controller phase so that you can control the game.
      // (Alternatively, you might automatically switch to controller UI if not already there.)
      setPhase('controller');
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  // Function to send control commands.
  const sendCommand = async (command: string) => {
    try {
      await RPC.call("handleInput", command, RPC.Mode.ALL);
    } catch (error) {
      console.error("Error sending RPC command:", error);
    }
  };

  // When game is over, submit the email.
  const handleEmailSubmit = async () => {
    if (email.trim() === '') return;
    try {
      await RPC.call("submitEmail", email, RPC.Mode.ALL);
      alert("Email submitted. Thank you!");
      // Optionally reset the controller for the next player.
      setPhase('enterUsername');
      setUsername('');
      setEmail('');
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  // Render different screens based on the phase.
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
        <button onClick={handleUsernameSubmit} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
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
        {/* For demonstration, you might include a button to simulate game over */}
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