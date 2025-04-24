
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
    }, 4500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <GameStateProvider>
      <div className="min-h-screen bg-cyberpunk-dark text-cyberpunk-coolGray relative">
        {isLoading && <LoadingScreen />}
        <GameCanvas />
        <DebuggingInterface />
        <GameInstructions />
      </div>
    </GameStateProvider>
  );
};

export default Index;
