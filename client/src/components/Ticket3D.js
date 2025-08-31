import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js';
import { Text, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import './Ticket3D.css';

// Custom OrbitControls component
const OrbitControls = () => {
  const controlsRef = useRef();
  const { camera, gl } = useThree();
  
  useEffect(() => {
    if (camera && gl && gl.domElement) {
      controlsRef.current = new OrbitControlsImpl(camera, gl.domElement);
      controlsRef.current.enableDamping = true;
      controlsRef.current.dampingFactor = 0.1;
      controlsRef.current.minDistance = 3;
      controlsRef.current.maxDistance = 20;
      controlsRef.current.enablePan = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.enableRotate = true;
    }
    
    return () => {
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
    };
  }, [camera, gl]);
  
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });
  
  return null;
};

// Simple Box component
const Box = ({ args, position, children, ...props }) => {
  
  return (
    <mesh position={position} {...props}>
      <boxGeometry args={args} />
      {children || <meshStandardMaterial color="#cccccc" />}
    </mesh>
  );
};

// Simple Plane component  
const Plane = ({ args, position, rotation, children, ...props }) => {
  
  return (
    <mesh position={position} rotation={rotation} {...props}>
      <planeGeometry args={args} />
      {children || <meshStandardMaterial color="#ffffff" />}
    </mesh>
  );
};

// 3D Kiosk Component
const Kiosk3D = ({ position, onClick }) => {
  
  return (
    <group position={position} onClick={onClick}>
      {/* Main Kiosk Body */}
      <Box args={[1, 2, 0.3]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>
      
      {/* Screen */}
      <Box args={[0.8, 1.2, 0.05]} position={[0, 1.2, 0.16]}>
        <meshStandardMaterial color="#000" />
      </Box>
      
      {/* Screen Content */}
      <Plane args={[0.7, 1]} position={[0, 1.2, 0.18]}>
        <meshStandardMaterial color="#4285f4" />
      </Plane>
      
      {/* Header Sign */}
      <Box args={[0.9, 0.2, 0.05]} position={[0, 1.9, 0.16]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Card Slots */}
      <Box args={[0.3, 0.03, 0.05]} position={[0, 0.3, 0.16]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.3, 0.03, 0.05]} position={[0, 0.2, 0.16]}>
        <meshStandardMaterial color="#e74c3c" />
      </Box>
      <Box args={[0.3, 0.03, 0.05]} position={[0, 0.1, 0.16]}>
        <meshStandardMaterial color="#95a5a6" />
      </Box>
      
      {/* Stand */}
      <Box args={[0.1, 1, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#7f8c8d" />
      </Box>
    </group>
  );
};

// Security Guard 3D Component
const SecurityGuard = ({ position }) => {
  return (
    <group position={position}>
      {/* Head */}
      <Box args={[0.2, 0.2, 0.2]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
      
      {/* Cap */}
      <Box args={[0.25, 0.1, 0.25]} position={[0, 1.8, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Body */}
      <Box args={[0.4, 0.8, 0.2]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#f8f8f8" />
      </Box>
      
      {/* Badge */}
      <Box args={[0.05, 0.05, 0.01]} position={[0.1, 1.4, 0.11]}>
        <meshStandardMaterial color="gold" />
      </Box>
      
      {/* Belt */}
      <Box args={[0.42, 0.05, 0.22]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Legs */}
      <Box args={[0.35, 0.8, 0.15]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Arms */}
      <Box args={[0.1, 0.6, 0.1]} position={[0.25, 1.1, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
      <Box args={[0.1, 0.6, 0.1]} position={[-0.25, 1.1, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
    </group>
  );
};

// Customer 3D Component
const Customer = ({ position }) => {
  return (
    <group position={position}>
      {/* Head */}
      <Box args={[0.18, 0.18, 0.18]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
      
      {/* Hair */}
      <Box args={[0.22, 0.12, 0.22]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#4a4a4a" />
      </Box>
      
      {/* Body */}
      <Box args={[0.35, 0.7, 0.18]} position={[0, 1.1, 0]}>
        <meshStandardMaterial color="#e67e22" />
      </Box>
      
      {/* Legs */}
      <Box args={[0.3, 0.7, 0.12]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Arms */}
      <Box args={[0.08, 0.5, 0.08]} position={[0.22, 1, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
      <Box args={[0.08, 0.5, 0.08]} position={[-0.22, 1, 0]}>
        <meshStandardMaterial color="#fdbcb4" />
      </Box>
    </group>
  );
};

// Bus Model Component
const BusModel = ({ position, color = "#e74c3c" }) => {
  const busRef = useRef();
  
  useFrame((state) => {
    if (busRef.current) {
      busRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });
  
  return (
    <group ref={busRef} position={position}>
      {/* Bus Body */}
      <Box args={[2.5, 2, 7]} position={[0, 1, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.7} />
      </Box>
      
      {/* Roof */}
      <Box args={[2.6, 0.1, 7.2]} position={[0, 2.05, 0]} castShadow>
        <meshStandardMaterial color="#2c3e50" />
      </Box>
      
      {/* Front Windshield */}
      <Box args={[2.2, 1.2, 0.1]} position={[0, 1.5, 3.5]} castShadow>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} metalness={0.1} />
      </Box>
      
      {/* Side Windows */}
      {[-2, -1, 0, 1, 2].map((z, i) => (
        <group key={`window-${i}`}>
          <Box args={[0.05, 0.8, 0.8]} position={[1.26, 1.5, z]}>
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
          </Box>
          <Box args={[0.05, 0.8, 0.8]} position={[-1.26, 1.5, z]}>
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
          </Box>
        </group>
      ))}
      
      {/* Wheels */}
      {[-2.5, 2.5].map((z, i) => (
        <group key={`wheels-${i}`}>
          <Cylinder args={[0.3, 0.3, 0.2]} position={[1, 0, z]} rotation={[0, 0, Math.PI/2]} castShadow>
            <meshStandardMaterial color="#1a1a1a" />
          </Cylinder>
          <Cylinder args={[0.3, 0.3, 0.2]} position={[-1, 0, z]} rotation={[0, 0, Math.PI/2]} castShadow>
            <meshStandardMaterial color="#1a1a1a" />
          </Cylinder>
        </group>
      ))}
      
      {/* Headlights */}
      <Box args={[0.3, 0.3, 0.1]} position={[0.7, 0.8, 3.51]} castShadow>
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </Box>
      <Box args={[0.3, 0.3, 0.1]} position={[-0.7, 0.8, 3.51]} castShadow>
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={0.5} />
      </Box>
      
      {/* Bus Number */}
      <Text
        position={[0, 1.5, 3.52]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ABC-01
      </Text>
    </group>
  );
};

// Terminal Environment Component
const TerminalEnvironment = () => {
  return (
    <group>
      {/* Modern Terminal Floor with pattern */}
      <Plane args={[40, 30]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#f0f0f0" roughness={0.8} />
      </Plane>
      
      {/* Floor Lines/Patterns */}
      {[-15, -10, -5, 0, 5, 10, 15].map((x, i) => (
        <Box key={`line-x-${i}`} args={[0.1, 0.01, 30]} position={[x, 0.01, 0]} receiveShadow>
          <meshStandardMaterial color="#d0d0d0" />
        </Box>
      ))}
      {[-10, -5, 0, 5, 10].map((z, i) => (
        <Box key={`line-z-${i}`} args={[40, 0.01, 0.1]} position={[0, 0.01, z]} receiveShadow>
          <meshStandardMaterial color="#d0d0d0" />
        </Box>
      ))}
      
      {/* Glass Ceiling with metal frame */}
      <Plane args={[40, 30]} rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
      </Plane>
      
      {/* Ceiling Support Beams */}
      {[-10, 0, 10].map((x, i) => (
        <Box key={`beam-${i}`} args={[0.3, 0.3, 30]} position={[x, 7.8, 0]} castShadow>
          <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
        </Box>
      ))}
      
      {/* Main Terminal Building - Back Wall with Windows */}
      <group position={[0, 0, -15]}>
        <Box args={[40, 8, 0.5]} position={[0, 4, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#e8e8e8" />
        </Box>
        
        {/* Large Windows */}
        {[-15, -10, -5, 0, 5, 10, 15].map((x, i) => (
          <Box key={`window-${i}`} args={[4, 5, 0.1]} position={[x, 4, 0.3]} castShadow>
            <meshStandardMaterial color="#4a90e2" transparent opacity={0.3} metalness={0.5} />
          </Box>
        ))}
      </group>
      
      {/* Ticket Counters Area */}
      <group position={[0, 0, -13]}>
        {/* Main Counter */}
        <Box args={[20, 1.2, 2]} position={[0, 0.6, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#8b6914" />
        </Box>
        <Box args={[20, 0.1, 2.2]} position={[0, 1.21, 0]} castShadow>
          <meshStandardMaterial color="#333333" />
        </Box>
        
        {/* Counter Windows */}
        {[-7, -3.5, 0, 3.5, 7].map((x, i) => (
          <group key={`counter-${i}`} position={[x, 2, 0]}>
            <Box args={[2.5, 1.5, 0.1]} position={[0, 0, 0.1]} castShadow>
              <meshStandardMaterial color="#2c3e50" transparent opacity={0.8} />
            </Box>
            <Text
              position={[0, 0.8, 0.2]}
              fontSize={0.15}
              color="#ffffff"
              anchorX="center"
            >
              Counter {i + 1}
            </Text>
          </group>
        ))}
        
        {/* ABC BUS Sign */}
        <Box args={[8, 1.5, 0.2]} position={[0, 5, 0.5]} castShadow>
          <meshStandardMaterial color="#1e40af" />
        </Box>
        <Text
          position={[0, 5, 0.7]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ABC BUS TERMINAL
        </Text>
      </group>
      
      {/* Waiting Area with Modern Seats */}
      {[-10, -5, 0, 5, 10].map((x, i) => (
        <group key={`seats-row-${i}`} position={[x, 0, 3]}>
          {[0, 1, 2].map((z, j) => (
            <group key={`seat-${j}`} position={[0, 0, z * 1.2]}>
              <Box args={[0.8, 0.5, 0.8]} position={[0, 0.25, 0]} castShadow receiveShadow>
                <meshStandardMaterial color="#3b82f6" />
              </Box>
              <Box args={[0.8, 0.8, 0.1]} position={[0, 0.6, -0.35]} castShadow>
                <meshStandardMaterial color="#2563eb" />
              </Box>
            </group>
          ))}
        </group>
      ))}
      
      {/* Digital Display Boards */}
      {[-12, 0, 12].map((x, i) => (
        <group key={`display-${i}`} position={[x, 3, 0]}>
          <Box args={[0.2, 3, 0.2]} position={[0, -1.5, 0]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.7} />
          </Box>
          <Box args={[3, 2, 0.2]} position={[0, 1.5, 0]} castShadow>
            <meshStandardMaterial color="#000000" />
          </Box>
          <Box args={[2.8, 1.8, 0.05]} position={[0, 1.5, 0.11]} >
            <meshStandardMaterial 
              color="#00ff00" 
              emissive="#00ff00" 
              emissiveIntensity={0.3}
            />
          </Box>
          <Text
            position={[0, 2, 0.15]}
            fontSize={0.2}
            color="#000000"
            anchorX="center"
          >
            DEPARTURES
          </Text>
          <Text
            position={[0, 1.5, 0.15]}
            fontSize={0.15}
            color="#000000"
            anchorX="center"
          >
            Manila - 10:30 AM
          </Text>
          <Text
            position={[0, 1.2, 0.15]}
            fontSize={0.15}
            color="#000000"
            anchorX="center"
          >
            Baguio - 11:00 AM
          </Text>
        </group>
      ))}
      
      {/* Bus Parking Bays */}
      {[-8, 0, 8].map((x, i) => (
        <group key={`bay-${i}`} position={[x, 0, -5]}>
          {/* Bay Markings */}
          <Box args={[3, 0.01, 8]} position={[0, 0.02, 0]} receiveShadow>
            <meshStandardMaterial color="#ffeb3b" />
          </Box>
          {/* Bay Number */}
          <Text
            position={[0, 0.03, 3]}
            fontSize={0.5}
            color="#333333"
            anchorX="center"
            rotation={[-Math.PI / 2, 0, 0]}
          >
            {i + 1}
          </Text>
        </group>
      ))}
      
      {/* Side Glass Walls */}
      <Box args={[0.2, 8, 30]} position={[-20, 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.2} metalness={0.5} />
      </Box>
      <Box args={[0.2, 8, 30]} position={[20, 4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.2} metalness={0.5} />
      </Box>
      
      {/* Pillars */}
      {[-15, -7.5, 0, 7.5, 15].map((x, i) => (
        [-10, 0, 10].map((z, j) => (
          <Cylinder 
            key={`pillar-${i}-${j}`} 
            args={[0.3, 0.3, 8]} 
            position={[x, 4, z]} 
            castShadow
          >
            <meshStandardMaterial color="#808080" metalness={0.5} roughness={0.5} />
          </Cylinder>
        ))
      ))}
    </group>
  );
};

const Ticket3D = () => {

  const handleKioskClick = () => {
    console.log('Kiosk clicked!');
  };

  return (
    <div className="ticket-3d-container">
      <div className="card">
        <h1>🏢 3D Bus Terminal Scene</h1>
        <p>Real interactive 3D model using WebGL - drag to orbit, scroll to zoom</p>
        
        <div className="controls">
          <span className="control-hint">🖱️ Left click + drag to orbit • Right click + drag to pan • Scroll to zoom</span>
        </div>

        <div className="real-3d-scene">
          <Canvas
            camera={{ 
              position: [15, 10, 20], 
              fov: 60,
              near: 0.1,
              far: 1000
            }}
            shadows
            gl={{ antialias: true }}
            style={{ width: '100%', height: '600px' }}
          >
            {/* Better Lighting Setup */}
            <color attach="background" args={['#f0f4f8']} />
            <fog attach="fog" args={['#f0f4f8', 20, 60]} />
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 15, 10]} 
              intensity={1} 
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} />
            <pointLight position={[-10, 8, -10]} intensity={0.3} />
            
            {/* Environment */}
            <TerminalEnvironment />
            
            {/* Buses in parking bays */}
            <BusModel position={[-8, 0, -5]} color="#e74c3c" />
            <BusModel position={[0, 0, -5]} color="#3498db" />
            <BusModel position={[8, 0, -5]} color="#27ae60" />
            
            {/* Characters and Objects */}
            <SecurityGuard position={[-3, 0, 2]} />
            <SecurityGuard position={[15, 0, 0]} />
            
            {/* Multiple Customers */}
            <Customer position={[0.5, 0, 1]} />
            <Customer position={[-6, 0, 3]} />
            <Customer position={[4, 0, 4]} />
            <Customer position={[-10, 0, 5]} />
            
            {/* Multiple Kiosks */}
            <Kiosk3D position={[-5, 0, 8]} onClick={handleKioskClick} />
            <Kiosk3D position={[0, 0, 8]} onClick={handleKioskClick} />
            <Kiosk3D position={[5, 0, 8]} onClick={handleKioskClick} />
            
            {/* Counter Staff at different counters */}
            {[-7, -3.5, 0, 3.5, 7].map((x, i) => (
              <group key={`staff-${i}`} position={[x, 0, -12]}>
                <Box args={[0.3, 1.6, 0.2]} position={[0, 0.8, 0]}>
                  <meshStandardMaterial color={i % 2 === 0 ? "#2c3e50" : "#4a90e2"} />
                </Box>
                <Box args={[0.15, 0.15, 0.15]} position={[0, 1.7, 0]}>
                  <meshStandardMaterial color="#fdbcb4" />
                </Box>
              </group>
            ))}
            
            {/* Orbit Controls for mouse interaction */}
            <OrbitControls />
            
          </Canvas>
        </div>

      </div>
    </div>
  );
};

export default Ticket3D;