
import { createContext, useContext, useState } from "react";

type SensorData = {
  lidar: number[],
  radar: number[],
  camera: number[]
};

type VehicleStats = {
  speed: number,
  distance: number,
  aiConfidence: number,
  mode: 'Manual' | 'Autonomous'
};

type GameStateContextType = {
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  sensorData: SensorData;
  updateSensorData: (data: SensorData) => void;
  vehicleStats: VehicleStats;
  updateVehicleStats: (stats: VehicleStats) => void;
  isDebuggingVisible: boolean;
  toggleDebugging: () => void;
};

const initialSensorData: SensorData = {
  lidar: [0, 0, 0],
  radar: [0, 0, 0],
  camera: [0, 0, 0]
};

const initialVehicleStats: VehicleStats = {
  speed: 0,
  distance: 0,
  aiConfidence: 0,
  mode: 'Manual'
};

const GameStateContext = createContext<GameStateContextType>({
  isLoaded: false,
  setIsLoaded: () => {},
  sensorData: initialSensorData,
  updateSensorData: () => {},
  vehicleStats: initialVehicleStats,
  updateVehicleStats: () => {},
  isDebuggingVisible: true,
  toggleDebugging: () => {},
});

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>(initialSensorData);
  const [vehicleStats, setVehicleStats] = useState<VehicleStats>(initialVehicleStats);
  const [isDebuggingVisible, setIsDebuggingVisible] = useState(true);

  const updateSensorData = (data: SensorData) => {
    setSensorData(data);
  };

  const updateVehicleStats = (stats: VehicleStats) => {
    setVehicleStats(stats);
  };

  const toggleDebugging = () => {
    setIsDebuggingVisible(!isDebuggingVisible);
  };

  return (
    <GameStateContext.Provider
      value={{
        isLoaded,
        setIsLoaded,
        sensorData,
        updateSensorData,
        vehicleStats,
        updateVehicleStats,
        isDebuggingVisible,
        toggleDebugging
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = () => useContext(GameStateContext);
