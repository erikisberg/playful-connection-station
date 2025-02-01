// RetroGameCanvas.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RPC } from 'playroomkit';

interface GameState {
  playerX: number;
  obstacles: { x: number, y: number, width: number, height: number }[];
  score: number;
  gameOver: boolean;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 20;
const OBSTACLE_SPEED = 3;
const PLAYER_SPEED = 5;

interface RetroGameCanvasProps {
  onGameOver: (score: number) => void;
}

const RetroGameCanvas: React.FC<RetroGameCanvasProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    playerX: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    obstacles: [],
    score: 0,
    gameOver: false,
  });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
  
  // New state for mobile (RPC) controls
  const [remoteInput, setRemoteInput] = useState<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKeysPressed(prev => ({ ...prev, [e.key]: true }));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setKeysPressed(prev => ({ ...prev, [e.key]: false }));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Register RPC handler for mobile controls
  useEffect(() => {
    RPC.register("handleInput", async (input: string) => {
      if (input === "left") {
        setRemoteInput(prev => ({ ...prev, left: true }));
      } else if (input === "right") {
        setRemoteInput(prev => ({ ...prev, right: true }));
      } else if (input === "stopLeft") {
        setRemoteInput(prev => ({ ...prev, left: false }));
      } else if (input === "stopRight") {
        setRemoteInput(prev => ({ ...prev, right: false }));
      }
      return Promise.resolve("Input received");
    });
  }, []);

  // Game loop update
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      setGameState(prevState => {
        if (prevState.gameOver) return prevState;
        let newPlayerX = prevState.playerX;
        // Combine keyboard and remote inputs:
        if (keysPressed['ArrowLeft'] || keysPressed['a'] || remoteInput.left) {
          newPlayerX = Math.max(0, newPlayerX - PLAYER_SPEED);
        }
        if (keysPressed['ArrowRight'] || keysPressed['d'] || remoteInput.right) {
          newPlayerX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, newPlayerX + PLAYER_SPEED);
        }

        // Update obstacles (move them downward)
        let newObstacles = prevState.obstacles.map(ob => ({ ...ob, y: ob.y + OBSTACLE_SPEED }));
        // Remove obstacles that have gone off-screen
        newObstacles = newObstacles.filter(ob => ob.y < CANVAS_HEIGHT);

        // Occasionally add a new obstacle
        if (Math.random() < 0.02) { // roughly a 2% chance per frame
          const x = Math.random() * (CANVAS_WIDTH - OBSTACLE_WIDTH);
          newObstacles.push({ x, y: -OBSTACLE_HEIGHT, width: OBSTACLE_WIDTH, height: OBSTACLE_HEIGHT });
        }

        // Collision detection between player and any obstacle
        const collision = newObstacles.some(ob => 
          newPlayerX < ob.x + ob.width &&
          newPlayerX + PLAYER_WIDTH > ob.x &&
          (CANVAS_HEIGHT - PLAYER_HEIGHT) < ob.y + ob.height &&
          CANVAS_HEIGHT > ob.y
        );

        const newScore = prevState.score + 1;
        if (collision) {
          onGameOver(prevState.score);
          return { ...prevState, gameOver: true };
        }

        return { ...prevState, playerX: newPlayerX, obstacles: newObstacles, score: newScore };
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, remoteInput, onGameOver]);

  // Render the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const render = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw the player
      context.fillStyle = '#00FF00';
      context.fillRect(gameState.playerX, CANVAS_HEIGHT - PLAYER_HEIGHT, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Draw obstacles
      context.fillStyle = '#FF0000';
      gameState.obstacles.forEach(ob => {
        context.fillRect(ob.x, ob.y, ob.width, ob.height);
      });

      // Draw score
      context.fillStyle = '#FFFFFF';
      context.font = '20px Arial';
      context.fillText(`Score: ${gameState.score}`, 10, 30);

      requestAnimationFrame(render);
    };

    render();
  }, [gameState]);

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT} 
        style={{ background: '#000', border: '2px solid #fff' }} 
      />
    </div>
  );
};

export default RetroGameCanvas;