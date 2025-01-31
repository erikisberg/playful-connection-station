import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";

interface PlayerForm {
  name: string;
  email: string;
}

interface GameLobbyProps {
  highScore: number;
  onJoinGame: (data: PlayerForm) => void;
}

const GameLobby = ({ highScore, onJoinGame }: GameLobbyProps) => {
  const form = useForm<PlayerForm>();
  const { toast } = useToast();

  const onSubmit = async (data: PlayerForm) => {
    try {
      onJoinGame(data);
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
};

export default GameLobby;