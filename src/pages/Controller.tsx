// src/pages/Controller.tsx
import React from 'react';
import { RPC } from 'playroomkit';

const Controller: React.FC = () => {
  // A helper function to send a control command via RPC.
  const sendCommand = async (command: string) => {
    try {
      // Send command to all connected devices (or adjust the mode as needed)
      await RPC.call("handleInput", command, RPC.Mode.ALL);
    } catch (error) {
      console.error("Error sending RPC command:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Mobile Controller</h1>
      <p>Use the buttons below to control the game.</p>
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
      {/* You can add additional buttons for "up" or "down" if needed */}
    </div>
  );
};

export default Controller;