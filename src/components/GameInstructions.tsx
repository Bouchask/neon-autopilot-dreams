
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const GameInstructions = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDismiss = () => {
    setIsVisible(false);
    toast("Instructions hidden. Press 'H' to show again.", {
      position: "bottom-center",
    });
  };
  
  // Handle H key to show instructions again
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-10 max-w-md">
      <div className="neon-panel">
        <div className="flex justify-between items-center mb-2">
          <h2 className="neon-blue neon-text">MISSION BRIEFING</h2>
          <Button 
            onClick={handleDismiss}
            className="cyber-button h-7 text-xs"
          >
            Dismiss
          </Button>
        </div>
        
        <div className="space-y-3 text-sm">
          <p>Welcome to the Autonomous Vehicle Training Simulation.</p>
          
          <div>
            <p className="font-bold neon-purple mb-1">CONTROLS:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Arrow keys ↑ ↓ ← → to drive</li>
              <li>Press M to toggle between Manual/Auto mode</li>
              <li>Press H to show/hide this guide</li>
            </ul>
          </div>
          
          <div>
            <p className="font-bold neon-purple mb-1">OBJECTIVE:</p>
            <p>
              Drive manually to train the AI model. Once training 
              reaches sufficient levels, switch to Autonomous Mode 
              to test the AI's capabilities.
            </p>
          </div>
          
          <p className="neon-pink">
            WARNING: Autonomous systems still in prototype phase.
            Override recommended in hazardous conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameInstructions;
