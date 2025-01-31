import { useEffect, useState } from "react";
import { insertCoin, isStreamScreen, onPlayerJoin, RPC } from "playroomkit";
import { GameState, INITIAL_GAME_STATE } from "../game/types";
import { moveSnake } from "../game/gameLogic";
import { INITIAL_DIRECTION, INITIAL_SNAKE } from "../game/constants";
import GameCanvas from "../components/GameCanvas";
import { Button } from "../components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/use-toast";

interface PlayerForm {
  name: string;
  email: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [highScore, setHighScore] = useState(0);
  const [showLobby, setShowLobby] = useState(true);
  const { toast } = useToast();
  const form = useForm<PlayerForm>();

  // Game loop
  useEffect(() => {
    let gameLoop: number;
    
    if (!isLoading && isStreamScreen()) {
      gameLoop = window.setInterval(() => {
        setGameState(prevState => {
          const newState = moveSnake(prevState);
          // Update high score if current score is higher
          if (newState.score > highScore) {
            setHighScore(newState.score);
          }
          return newState;
        });
      }, 150);
    }

    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [isLoading, highScore]);

  useEffect(() => {
    const initGame = async () => {
      try {
        await insertCoin({ 
          streamMode: true,
          maxPlayersPerRoom: 1,  // Limit to 1 player per game
          skipLobby: true // We'll use our custom lobby
        });
        
        setIsLoading(false);

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

  const onSubmit = async (data: PlayerForm) => {
    try {
      // Here you could store the player data or handle it as needed
      console.log("Player data:", data);
      setShowLobby(false);
      toast({
        title: "Welcome to Snake Game!",
        description: `Good luck, ${data.name}!`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join the game. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold">Loading game...</div>
      </div>
    );
  }

  if (showLobby && !isStreamScreen()) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Join Snake Game</h1>
          
          <div className="mb-6 text-center">
            <p className="text-white mb-2">High Score: {highScore}</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Start Playing
              </Button>
            </form>
          </Form>
        </div>
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