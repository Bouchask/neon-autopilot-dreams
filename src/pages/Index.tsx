
import { useState, useEffect } from "react";
import { GameStateProvider } from "@/hooks/useGameState";
import GameCanvas from "@/components/GameCanvas";
import LoadingScreen from "@/components/LoadingScreen";
import DebuggingInterface from "@/components/DebuggingInterface";
import GameInstructions from "@/components/GameInstructions";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete, showing game");
    }, 3000); // Reduced loading time for testing
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <GameStateProvider>
      <div className="min-h-screen bg-cyberpunk-dark text-cyberpunk-coolGray relative overflow-hidden">
        {isLoading && <LoadingScreen />}
        <div className="absolute inset-0">
          <GameCanvas />
        </div>
        <DebuggingInterface />
        <GameInstructions />
      </div>
    </GameStateProvider>
  );
};

export default Index;
