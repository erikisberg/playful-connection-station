import { useEffect, useRef, useState } from "react";
import { insertCoin, isStreamScreen, onPlayerJoin } from "playroomkit";

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initGame = async () => {
      try {
        // Initialize PlayroomKit with stream mode
        await insertCoin({ 
          streamMode: true,
          maxPlayersPerRoom: 1 // Only one player at a time
        });
        
        setIsLoading(false);

        // Handle different screens
        if (isStreamScreen()) {
          console.log("This is the public display screen");
          // Initialize game canvas here
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              // Set canvas size
              canvasRef.current.width = 800;
              canvasRef.current.height = 600;
              
              // Draw initial game state
              ctx.fillStyle = '#000';
              ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              
              // Draw instructions
              ctx.fillStyle = '#fff';
              ctx.font = '24px Arial';
              ctx.textAlign = 'center';
              ctx.fillText('Scan QR code to play!', canvasRef.current.width / 2, canvasRef.current.height / 2);
            }
          }
        } else {
          console.log("This is the controller screen");
          // Mobile controller screen will be handled by PlayroomKit
        }

        // Handle when a player joins
        onPlayerJoin(async (player) => {
          console.log("Player joined:", player.getProfile().name);
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
          <h1 className="text-2xl font-bold mb-4">Game Controller</h1>
          <p>Use your phone to control the game on the big screen!</p>
        </div>
      )}
    </div>
  );
};

export default Index;