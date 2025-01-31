import { useEffect, useState } from "react";
import { insertCoin, isStreamScreen, onPlayerJoin, RPC } from "playroomkit";
import { GameState, INITIAL_GAME_STATE } from "../game/types";
import { moveSnake } from "../game/gameLogic";
import { INITIAL_DIRECTION, INITIAL_SNAKE } from "../game/constants";
import GameCanvas from "../components/GameCanvas";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);

  // Game loop
  useEffect(() => {
    let gameLoop: number;
    
    if (!isLoading && isStreamScreen()) {
      gameLoop = window.setInterval(() => {
        setGameState(prevState => moveSnake(prevState));
      }, 150); // Game speed
    }

    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [isLoading]);

  useEffect(() => {
    const initGame = async () => {
      try {
        await insertCoin({ 
          streamMode: true,
          maxPlayersPerRoom: 1
        });
        
        setIsLoading(false);

        // Register RPC for handling player input
        RPC.register("handleInput", (input: string) => {
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

        onPlayerJoin((player) => {
          console.log("Player joined:", player.getProfile().name);
          
          // Send input through RPC
          player.getProfile().name && RPC.call("handleInput", player.getProfile().name, RPC.Mode.ALL);
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
          <GameCanvas gameState={gameState} isLoading={isLoading} />
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