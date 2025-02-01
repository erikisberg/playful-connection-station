// src/pages/Controller.tsx
import React from 'react';
import { RPC } from 'playroomkit'; // Make sure Playroom Kit is installed & imported

const Controller: React.FC = () => {
  // A simple handler that sends a command via RPC.
  const handleControl = async (command: string) => {
    try {
      // For example, you might want to use RPC.Mode.OTHERS or RPC.Mode.ALL depending on your game logic.
      await RPC.call("handleInput", command, RPC.Mode.ALL);
    } catch (error) {
      console.error("RPC error:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Game Controller</h1>
      <p>Use the buttons below to control the game.</p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button onTouchStart={() => handleControl("up")} onTouchEnd={() => handleControl("stopUp")}>
          Up
        </button>
        <div>
          <button onTouchStart={() => handleControl("left")} onTouchEnd={() => handleControl("stopLeft")}>
            Left
          </button>
          <button onTouchStart={() => handleControl("right")} onTouchEnd={() => handleControl("stopRight")}>
            Right
          </button>
        </div>
        <button onTouchStart={() => handleControl("down")} onTouchEnd={() => handleControl("stopDown")}>
          Down
        </button>
      </div>
    </div>
  );
};

export default Controller;