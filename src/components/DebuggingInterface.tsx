
import { useGameState } from "@/hooks/useGameState";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DebuggingInterface = () => {
  const { sensorData, vehicleStats, isDebuggingVisible, toggleDebugging } = useGameState();

  if (!isDebuggingVisible) {
    return (
      <div className="fixed top-2 right-2 z-10">
        <Button 
          onClick={toggleDebugging} 
          className="cyber-button"
        >
          Show Debug
        </Button>
      </div>
    );
  }

  // Convert sensor values to percentages for visualization
  const sensorToPercent = (value: number) => Math.round((1 - value) * 100);

  return (
    <div className="fixed top-0 right-0 w-72 p-4 z-10 h-screen overflow-y-auto">
      <div className="p-2 flex justify-between items-center">
        <h2 className="neon-blue neon-text text-lg">DEBUG INTERFACE</h2>
        <Button 
          onClick={toggleDebugging} 
          className="cyber-button text-xs h-7"
        >
          Hide
        </Button>
      </div>
      
      <div className="debug-panel my-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="neon-purple text-base">VEHICLE STATUS</h3>
          <Badge 
            className={vehicleStats.mode === "Manual" 
              ? "bg-cyberpunk-blue" 
              : "bg-cyberpunk-purple"
            }
          >
            {vehicleStats.mode}
          </Badge>
        </div>
        
        <div className="sensor-data">
          <span>Speed:</span>
          <span className="debug-value">{vehicleStats.speed.toFixed(2)} u/s</span>
          
          <span>Distance:</span>
          <span className="debug-value">{vehicleStats.distance.toFixed(2)} u</span>
          
          <span>AI Training:</span>
          <div className="w-full">
            <Progress value={vehicleStats.aiConfidence * 100} className="h-2" />
          </div>
        </div>
      </div>
      
      <div className="debug-panel my-2">
        <h3 className="neon-pink mb-2 text-base">SENSOR DATA</h3>
        
        <div className="mb-3">
          <div className="flex justify-between">
            <span>LIDAR:</span>
            <span className="debug-value">Proximity %</span>
          </div>
          
          <div className="flex space-x-1 mt-1">
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.lidar[0])} className="h-2" />
              <div className="text-xs text-center">L</div>
            </div>
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.lidar[1])} className="h-2" />
              <div className="text-xs text-center">C</div>
            </div>
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.lidar[2])} className="h-2" />
              <div className="text-xs text-center">R</div>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between">
            <span>RADAR:</span>
            <span className="debug-value">Proximity %</span>
          </div>
          
          <div className="flex space-x-1 mt-1">
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.radar[0])} className="h-2" />
              <div className="text-xs text-center">L</div>
            </div>
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.radar[1])} className="h-2" />
              <div className="text-xs text-center">C</div>
            </div>
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.radar[2])} className="h-2" />
              <div className="text-xs text-center">R</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between">
            <span>CAMERA:</span>
            <span className="debug-value">Proximity %</span>
          </div>
          
          <div className="flex space-x-1 mt-1">
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.camera[0])} className="h-2" />
              <div className="text-xs text-center">L</div>
            </div>
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.camera[1])} className="h-2" />
              <div className="text-xs text-center">C</div>
            </div>
            <div className="w-1/3">
              <Progress value={sensorToPercent(sensorData.camera[2])} className="h-2" />
              <div className="text-xs text-center">R</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="debug-panel my-2">
        <h3 className="neon-blue mb-2 text-base">AI PREDICTION</h3>
        
        <div className="sensor-data">
          <span>Steering:</span>
          <div className="w-full">
            <Progress 
              value={50 + (vehicleStats.aiConfidence > 0.5 ? Math.random() * 20 - 10 : 0)} 
              className="h-2" 
            />
          </div>
          
          <span>Acceleration:</span>
          <div className="w-full">
            <Progress 
              value={vehicleStats.aiConfidence > 0.5 ? 50 + Math.random() * 30 : 20} 
              className="h-2" 
            />
          </div>
          
          <span>Decision:</span>
          <span className="debug-value">
            {vehicleStats.aiConfidence > 0.5 
              ? "Continue" 
              : "Training Required"}
          </span>
        </div>
      </div>
      
      <div className="debug-panel my-2">
        <h3 className="neon-purple mb-2 text-base">CONTROLS</h3>
        <div className="space-y-1 text-xs">
          <p>↑ - Accelerate</p>
          <p>↓ - Brake</p>
          <p>← → - Steer</p>
          <p>M - Toggle Manual/Auto</p>
        </div>
      </div>
    </div>
  );
};

export default DebuggingInterface;
