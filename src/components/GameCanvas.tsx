import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGameState } from '@/hooks/useGameState';

const GameCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { 
    updateSensorData, 
    updateVehicleStats, 
    setIsLoaded 
  } = useGameState();

  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1A1F2C);
    scene.fog = new THREE.FogExp2(0x1A1F2C, 0.002);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    canvasRef.current.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    // Add directional light (simulates sun)
    const directionalLight = new THREE.DirectionalLight(0x3333ff, 1);
    directionalLight.position.set(0, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Create the road
    const roadGeometry = new THREE.PlaneGeometry(20, 1000);
    const roadMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x221F26,
      roughness: 0.8, 
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.y = -0.1;
    road.position.z = -300;
    road.receiveShadow = true;
    scene.add(road);
    
    // Add road markings
    const addRoadMarkings = () => {
      const markingGeometry = new THREE.PlaneGeometry(0.3, 5);
      const markingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        emissive: 0x888888
      });

      for (let i = 0; i < 50; i++) {
        const marking = new THREE.Mesh(markingGeometry, markingMaterial);
        marking.rotation.x = -Math.PI / 2;
        marking.position.set(0, -0.09, -i * 20);
        marking.receiveShadow = true;
        scene.add(marking);
      }
    };
    
    addRoadMarkings();
    
    // Create buildings on both sides of the road
    const createBuildings = () => {
      const buildingColors = [0x1A1F2C, 0x221F26, 0x111419, 0x0D1013];
      const neonColors = [0x1EAEDB, 0x8B5CF6, 0xD946EF];
      
      for (let i = 0; i < 50; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        
        for (let j = 0; j < 3; j++) {
          // Distance from road
          const distance = (j + 1) * 10; 
          
          // Random building dimensions
          const width = 8 + Math.random() * 8;
          const height = 10 + Math.random() * 50;
          const depth = 8 + Math.random() * 8;
          
          // Create building
          const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
          const buildingMaterial = new THREE.MeshStandardMaterial({ 
            color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
            roughness: 0.7,
          });
          
          const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
          
          // Position building along the road
          building.position.x = side * (distance + width / 2 + 5);
          building.position.y = height / 2;
          building.position.z = -100 - i * 40 + Math.random() * 20;
          
          // Add neon lights to some buildings
          if (Math.random() > 0.4) {
            const neonGeometry = new THREE.BoxGeometry(width + 0.2, 0.2, depth + 0.2);
            const neonMaterial = new THREE.MeshStandardMaterial({ 
              color: neonColors[Math.floor(Math.random() * neonColors.length)],
              emissive: neonColors[Math.floor(Math.random() * neonColors.length)],
              emissiveIntensity: 1 
            });
            
            // Place neon at random heights on the building
            const neonCount = Math.floor(1 + Math.random() * 3);
            
            for (let k = 0; k < neonCount; k++) {
              const neonLight = new THREE.Mesh(neonGeometry, neonMaterial);
              const neonHeight = Math.random() * height * 0.8;
              neonLight.position.set(
                building.position.x, 
                neonHeight, 
                building.position.z
              );
              scene.add(neonLight);
              
              // Add point light at neon position
              const pointLight = new THREE.PointLight(
                neonMaterial.color, 
                1, 
                10
              );
              pointLight.position.copy(neonLight.position);
              scene.add(pointLight);
            }
          }
          
          scene.add(building);
        }
      }
    };
    
    createBuildings();
    
    // Create the player's car
    const createPlayerCar = () => {
      const carGroup = new THREE.Group();
      
      // Car body
      const bodyGeometry = new THREE.BoxGeometry(2, 0.6, 4);
      const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1EAEDB,
        metalness: 0.8,
        roughness: 0.2
      });
      
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      carGroup.add(body);
      
      // Cabin
      const cabinGeometry = new THREE.BoxGeometry(1.8, 0.5, 2);
      const cabinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        metalness: 0.1,
        roughness: 0.1,
        opacity: 0.7,
        transparent: true
      });
      
      const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
      cabin.position.y = 1.1;
      cabin.position.z = -0.5;
      cabin.castShadow = true;
      carGroup.add(cabin);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
      const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      
      const wheelPositions = [
        { x: 1, y: 0.4, z: 1.2 },  // Front right
        { x: -1, y: 0.4, z: 1.2 }, // Front left
        { x: 1, y: 0.4, z: -1.2 }, // Back right
        { x: -1, y: 0.4, z: -1.2 } // Back left
      ];
      
      wheelPositions.forEach(position => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(position.x, position.y, position.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        carGroup.add(wheel);
      });
      
      // Add headlights
      const headlightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
      const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1
      });
      
      const headlightPositions = [
        { x: 0.7, y: 0.6, z: 2 },  // Right headlight
        { x: -0.7, y: 0.6, z: 2 }  // Left headlight
      ];
      
      headlightPositions.forEach(position => {
        const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        headlight.position.set(position.x, position.y, position.z);
        headlight.rotation.x = Math.PI / 2;
        carGroup.add(headlight);
        
        // Add spotlight for each headlight
        const spotlight = new THREE.SpotLight(0xffffff, 2);
        spotlight.position.set(position.x, position.y, position.z);
        spotlight.angle = Math.PI / 6;
        spotlight.target.position.set(position.x, position.y, position.z + 1);
        spotlight.castShadow = true;
        carGroup.add(spotlight);
        carGroup.add(spotlight.target);
      });
      
      // Position the car
      carGroup.position.y = 0;
      carGroup.position.z = 10;
      
      scene.add(carGroup);
      return carGroup;
    };
    
    const car = createPlayerCar();
    
    // Add obstacles
    const obstacles: THREE.Mesh[] = [];
    
    const createObstacles = () => {
      const obstacleGeometry = new THREE.ConeGeometry(0.7, 1.5, 8);
      const obstacleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xea384c,
        emissive: 0x660000,
        emissiveIntensity: 0.3
      });
      
      for (let i = 0; i < 20; i++) {
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set(
          Math.random() * 14 - 7, // Random X position across road
          0.75, // Y position
          -50 - i * 25 - Math.random() * 20 // Z position (along the road)
        );
        obstacle.castShadow = true;
        obstacles.push(obstacle);
        scene.add(obstacle);
      }
    };
    
    createObstacles();
    
    // Setup camera position
    camera.position.set(0, 3, 15);
    camera.lookAt(0, 0, 0);
    
    // Car driving controls state
    let controls = {
      acceleration: 0,
      steering: 0,
      maxSpeed: 1,
      braking: false,
      manualMode: true
    };
    
    // Game state
    let gameState = {
      speed: 0,
      distance: 0,
      sensorData: {
        lidar: [0, 0, 0],
        camera: [0, 0, 0],
        radar: [0, 0, 0]
      },
      aiConfidence: 0,
      recordedActions: [] as { steering: number, acceleration: number }[]
    };
    
    // Handle keyboard controls
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!controls.manualMode) return;
      
      switch (event.key) {
        case 'ArrowUp':
          controls.acceleration = 0.02;
          controls.braking = false;
          break;
        case 'ArrowDown':
          controls.braking = true;
          break;
        case 'ArrowLeft':
          controls.steering = -0.03;
          break;
        case 'ArrowRight':
          controls.steering = 0.03;
          break;
        case 'm':
          controls.manualMode = !controls.manualMode;
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          controls.acceleration = 0;
          break;
        case 'ArrowDown':
          controls.braking = false;
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          controls.steering = 0;
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Generate sensor data based on car position and obstacles
    const updateSensorReading = () => {
      // Simple sensor simulation
      const carPosition = new THREE.Vector3();
      car.getWorldPosition(carPosition);
      
      // Find nearest obstacles
      const nearestDistances = [100, 100, 100]; // Left, Center, Right
      
      obstacles.forEach(obstacle => {
        const obstaclePosition = new THREE.Vector3();
        obstacle.getWorldPosition(obstaclePosition);
        
        // Calculate distance and direction to obstacle
        const distance = carPosition.distanceTo(obstaclePosition);
        
        // Only consider obstacles in front of the car
        if (obstaclePosition.z < carPosition.z && distance < 50) {
          const relativePosX = obstaclePosition.x - carPosition.x;
          
          // Determine which sensor (left, center, right)
          let sensorIndex;
          if (relativePosX < -2) {
            sensorIndex = 0; // Left
          } else if (relativePosX > 2) {
            sensorIndex = 2; // Right
          } else {
            sensorIndex = 1; // Center
          }
          
          // Update nearest distance for that sensor
          nearestDistances[sensorIndex] = Math.min(nearestDistances[sensorIndex], distance);
        }
      });
      
      // Normalize distances to 0-1 range (where 1 is far and 0 is close)
      const normalizedDistances = nearestDistances.map(d => Math.min(1, d / 50));
      
      // Update sensor data
      gameState.sensorData = {
        lidar: normalizedDistances,
        radar: normalizedDistances.map(d => d * 0.9 + Math.random() * 0.1), // Small noise
        camera: normalizedDistances.map(d => d * 0.8 + Math.random() * 0.2)  // More noise
      };
      
      // Record actions for AI training
      if (controls.manualMode) {
        gameState.recordedActions.push({
          steering: controls.steering,
          acceleration: controls.acceleration
        });
        
        // Limit recorded actions to recent 1000 frames
        if (gameState.recordedActions.length > 1000) {
          gameState.recordedActions.shift();
        }
      }
      
      // Update AI confidence based on simulation
      gameState.aiConfidence = Math.min(
        1, 
        Math.max(0, gameState.recordedActions.length / 500)
      );
      
      // Send data to UI
      updateSensorData(gameState.sensorData);
      updateVehicleStats({
        speed: gameState.speed,
        distance: gameState.distance,
        aiConfidence: gameState.aiConfidence,
        mode: controls.manualMode ? 'Manual' : 'Autonomous'
      });
    };
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update car physics
      if (controls.braking) {
        gameState.speed *= 0.95; // Apply brakes
      } else {
        gameState.speed += controls.acceleration;
        gameState.speed *= 0.99; // Apply friction
      }
      
      // Clamp speed
      gameState.speed = Math.max(0, Math.min(controls.maxSpeed, gameState.speed));
      
      // Update distance
      gameState.distance += gameState.speed;
      
      // Apply steering
      car.rotation.y += controls.steering * gameState.speed;
      
      // Move car based on its rotation and speed
      car.position.x += Math.sin(car.rotation.y) * gameState.speed;
      car.position.z -= Math.cos(car.rotation.y) * gameState.speed;
      
      // Keep car within road bounds
      car.position.x = Math.max(-7, Math.min(7, car.position.x));
      
      // Update camera to follow car
      camera.position.x = car.position.x;
      camera.position.z = car.position.z + 10;
      camera.lookAt(car.position.x, car.position.y, car.position.z - 5);
      
      // Update sensor readings
      updateSensorReading();
      
      renderer.render(scene, camera);
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Notify that the game has loaded
    setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    // Start animation loop
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return <div ref={canvasRef} id="canvas-container" />;
};

export default GameCanvas;
