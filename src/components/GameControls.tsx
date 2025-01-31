import { Button } from "../components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface GameControlsProps {
  onControlPress: (direction: string) => void;
}

const GameControls = ({ onControlPress }: GameControlsProps) => {
  return (
    <div className="text-white flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold mb-4">Snake Game Controller</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-start-2">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onControlPress('up')}
            className="w-16 h-16 rounded-full"
          >
            <ArrowUp className="h-8 w-8" />
          </Button>
        </div>
        <div className="col-start-1">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onControlPress('left')}
            className="w-16 h-16 rounded-full"
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="col-start-3">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onControlPress('right')}
            className="w-16 h-16 rounded-full"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>
        <div className="col-start-2">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => onControlPress('down')}
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
  );
};

export default GameControls;