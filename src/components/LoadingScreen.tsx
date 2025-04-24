
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  
  useEffect(() => {
    const messages = [
      "Calibrating sensors...",
      "Loading neural network...",
      "Rendering environment...",
      "Compiling shaders...",
      "Initializing physics engine...",
      "Activating AI systems...",
    ];
    
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(95, currentStep * 19);
      setProgress(newProgress);
      
      if (currentStep < messages.length) {
        setStatus(messages[currentStep]);
      }
      
      if (currentStep >= 5) {
        clearInterval(interval);
      }
    }, 700);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-cyberpunk-dark flex flex-col items-center justify-center z-50">
      <div className="max-w-md w-full px-6">
        <h1 className="text-4xl font-bold mb-2 neon-blue neon-text text-center">
          NEON AUTOPILOT
        </h1>
        <h2 className="text-xl mb-8 neon-pink text-center">
          Autonomous Driving Simulation v0.1
        </h2>
        
        <div className="neon-border p-6 mb-8">
          <div className="mb-4">
            <Progress value={progress} className="h-1 mb-2" />
            <div className="flex justify-between text-xs">
              <span>System Boot: {progress}%</span>
              <span className="neon-purple">BOOT SEQUENCE</span>
            </div>
          </div>
          
          <div className="h-32 overflow-hidden font-mono text-sm debug-panel">
            <p className="text-cyberpunk-blue mb-1">$ Initializing autopilot systems</p>
            <p className="text-cyberpunk-gray mb-1">$ Loading neural networks...</p>
            <p className="text-cyberpunk-gray mb-1">$ Calibrating sensors...</p>
            <p className="text-cyberpunk-gray mb-1">$ {status}</p>
            <p className="text-cyberpunk-coolGray mb-1 animate-pulse">_</p>
          </div>
        </div>
        
        <p className="text-center text-cyberpunk-coolGray text-sm">
          CORPORATION: NexusAutoAI • PROTOTYPE: MK4-750 • BUILD: 0xA37F2C
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
