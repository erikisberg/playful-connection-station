import { useEffect, useState } from "react";
import { insertCoin, isStreamScreen } from "playroomkit";
import { GameState, INITIAL_GAME_STATE } from "../game/types";
import { moveSnake } from "../game/gameLogic";
import { INITIAL_DIRECTION, INITIAL_SNAKE } from "../game/constants";
import GameCanvas from "../components/GameCanvas";
import GameControls from "../components/GameControls";
import GameLobby from "../components/GameLobby";

interface PlayerForm {
  name: string;
  email: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [highScore, setHighScore] = useState(0);
  const [showLobby, setShowLobby] = useState(true);
  const [gameInitialized, setGameInitialized] = useState(false);

  // Game loop
  useEffect(() => {
    if (!isLoading && gameInitialized && !showLobby) {
      const gameLoop = window.setInterval(() => {
        setGameState(prevState => {
          if (prevState.gameOver) return prevState;
          const newState = moveSnake(prevState);
          if (newState.score > highScore) {
            setHighScore(newState.score);
          }
          return newState;
        });
      }, 150);

      return () => clearInterval(gameLoop);
    }
  }, [isLoading, gameInitialized, showLobby, highScore]);

  useEffect(() => {
    const initGame = async () => {
      try {
        console.log("Starting game initialization");
        await insertCoin();
        setGameInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize game:", error);
        setIsLoading(false);
      }
    };

    initGame();
  }, []);

  const handleControlPress = (direction: string) => {
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
      
      switch (direction) {
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
  };

  const handleJoinGame = (data: PlayerForm) => {
    console.log("Player data:", data);
    setShowLobby(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-2xl font-bold text-white">Loading game...</div>
      </div>
    );
  }

  // Main screen shows QR code and game canvas
  if (isStreamScreen()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        {showLobby ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-8">Snake Game</h1>
            <p className="text-xl text-white mb-4">High Score: {highScore}</p>
            <p className="text-white mb-8">Scan the QR code with your phone to join!</p>
          </div>
        ) : (
          <GameCanvas gameState={gameState} isLoading={isLoading} />
        )}
      </div>
    );
  }

  // Mobile screen shows lobby or controls
  return showLobby ? (
    <GameLobby highScore={highScore} onJoinGame={handleJoinGame} />
  ) : (
    <GameControls onControlPress={handleControlPress} />
  );
};

export default Index;