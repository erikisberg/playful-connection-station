import { useEffect, useRef, useState } from "react";
import { insertCoin, isStreamScreen, onPlayerJoin } from "playroomkit";

// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    direction: INITIAL_DIRECTION,
    score: 0,
    gameOver: false
  });

  // Game loop
  useEffect(() => {
    let gameLoop: number;
    
    if (!isLoading && isStreamScreen() && canvasRef.current) {
      gameLoop = window.setInterval(() => {
        setGameState(prevState => {
          if (prevState.gameOver) return prevState;

          // Move snake
          const newHead = {
            x: (prevState.snake[0].x + prevState.direction.x + GRID_SIZE) % GRID_SIZE,
            y: (prevState.snake[0].y + prevState.direction.y + GRID_SIZE) % GRID_SIZE
          };

          // Check collision with self
          if (prevState.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            return { ...prevState, gameOver: true };
          }

          const newSnake = [newHead, ...prevState.snake];
          
          // Check if food is eaten
          if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
            // Generate new food position
            const newFood = {
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE)
            };
            return {
              ...prevState,
              snake: newSnake,
              food: newFood,
              score: prevState.score + 1
            };
          }

          // Remove tail if no food eaten
          newSnake.pop();

          return { ...prevState, snake: newSnake };
        });
      }, 150); // Game speed
    }

    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [isLoading]);

  // Draw game
  useEffect(() => {
    if (!canvasRef.current || !isStreamScreen()) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (isLoading) {
      // Draw loading message
      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Loading game...', canvasRef.current.width / 2, canvasRef.current.height / 2);
      return;
    }

    if (gameState.gameOver) {
      // Draw game over message
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
    const initGame = async () => {
      try {
        await insertCoin({ 
          streamMode: true,
          maxPlayersPerRoom: 1
        });
        
        if (canvasRef.current) {
          canvasRef.current.width = GRID_SIZE * CELL_SIZE;
          canvasRef.current.height = GRID_SIZE * CELL_SIZE;
        }
        
        setIsLoading(false);

        onPlayerJoin(async (player) => {
          console.log("Player joined:", player.getProfile().name);
          
          player.onInput((input) => {
            if (gameState.gameOver) {
              setGameState({
                snake: INITIAL_SNAKE,
                food: { x: 15, y: 15 },
                direction: INITIAL_DIRECTION,
                score: 0,
                gameOver: false
              });
              return;
            }

            setGameState(prevState => {
              const newDirection = { ...prevState.direction };
              
              switch (input) {
                case 'up':
                  if (prevState.direction.y !== 1) newDirection.y = -1, newDirection.x = 0;
                  break;
                case 'down':
                  if (prevState.direction.y !== -1) newDirection.y = 1, newDirection.x = 0;
                  break;
                case 'left':
                  if (prevState.direction.x !== 1) newDirection.x = -1, newDirection.y = 0;
                  break;
                case 'right':
                  if (prevState.direction.x !== -1) newDirection.x = 1, newDirection.y = 0;
                  break;
              }
              
              return { ...prevState, direction: newDirection };
            });
          });
        });

      } catch (error) {
        console.error("Error initializing game:", error);
      }
    };

    initGame();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading game...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      {isStreamScreen() ? (
        <>
          <canvas
            ref={canvasRef}
            className="border-4 border-white rounded-lg shadow-lg"
          />
          <div className="mt-4 text-white text-xl">
            Use your phone to control the game!
          </div>
        </>
      ) : (
        <div className="text-white text-xl text-center p-4">
          <h1 className="text-2xl font-bold mb-4">Snake Game Controller</h1>
          <p>Use your phone to control the snake!</p>
          <p className="mt-2">Swipe or tap the arrows to move.</p>
        </div>
      )}
    </div>
  );
};

export default Index;