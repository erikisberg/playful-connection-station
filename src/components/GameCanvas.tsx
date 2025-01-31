import { useEffect, useRef } from 'react';
import { GameState } from '../game/types';
import { CELL_SIZE, GRID_SIZE } from '../game/constants';

interface GameCanvasProps {
  gameState: GameState;
  isLoading: boolean;
}

const GameCanvas = ({ gameState, isLoading }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (isLoading) {
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Loading game...', canvasRef.current.width / 2, canvasRef.current.height / 2);
      return;
    }

    if (gameState.gameOver) {
      ctx.fillStyle = '#ff0000';
      ctx.font = '32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvasRef.current.width / 2, canvasRef.current.height / 2);
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${gameState.score}`, canvasRef.current.width / 2, canvasRef.current.height / 2 + 40);
      return;
    }

    // Draw snake
    ctx.fillStyle = '#00ff00';
    gameState.snake.forEach(segment => {
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(
      gameState.food.x * CELL_SIZE,
      gameState.food.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
  }, [gameState, isLoading]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = GRID_SIZE * CELL_SIZE;
      canvasRef.current.height = GRID_SIZE * CELL_SIZE;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="border-4 border-white rounded-lg shadow-lg"
    />
  );
};

export default GameCanvas;