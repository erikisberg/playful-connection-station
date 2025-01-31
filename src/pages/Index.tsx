import { useEffect, useState } from "react";
import { insertCoin, isStreamScreen, onPlayerJoin, RPC } from "playroomkit";
import { GameState, INITIAL_GAME_STATE } from "../game/types";
import { moveSnake } from "../game/gameLogic";
import { INITIAL_DIRECTION, INITIAL_SNAKE } from "../game/constants";
import GameCanvas from "../components/GameCanvas";
import { Button } from "../components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

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
          maxPlayersPerRoom: 4  // Increased from 1 to 4 players
        });
        
        setIsLoading(false);

        // Register RPC for handling player input
        RPC.register("handleInput", async (input: string) => {
          if (gameState.gameOver) {
            setGameState({
              snake: INITIAL_SNAKE,
              food: { x: 15, y: 15 },
              direction: INITIAL_DIRECTION,
              score: 0,
              gameOver: false
            });
            return Promise.resolve("Game Reset");
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

          return Promise.resolve("Direction Updated");
        });

        onPlayerJoin((player) => {
          console.log("Player joined:", player.getProfile().name);
        });

      } catch (error) {
        console.error("Error initializing game:", error);
      }
    };

    initGame();
  }, []);

  const handleControlPress = async (direction: string) => {
    await RPC.call("handleInput", direction, RPC.Mode.ALL);
  };

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
        <div className="text-white flex flex-col items-center gap-8">
          <h1 className="text-2xl font-bold mb-4">Snake Game Controller</h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-start-2">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleControlPress('up')}
                className="w-16 h-16 rounded-full"
              >
                <ArrowUp className="h-8 w-8" />
              </Button>
            </div>
            <div className="col-start-1">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleControlPress('left')}
                className="w-16 h-16 rounded-full"
              >
                <ArrowLeft className="h-8 w-8" />
              </Button>
            </div>
            <div className="col-start-3">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleControlPress('right')}
                className="w-16 h-16 rounded-full"
              >
                <ArrowRight className="h-8 w-8" />
              </Button>
            </div>
            <div className="col-start-2">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => handleControlPress('down')}
                className="w-16 h-16 rounded-full"
              >
                <ArrowDown className="h-8 w-8" />
              </Button>
            </div>
          </div>
          <p className="mt-4 text-center">
            Tap the arrows to control the snake!
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;