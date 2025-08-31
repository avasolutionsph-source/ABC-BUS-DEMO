import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder } from '@react-three/drei';
import { BrowserQRCodeReader } from '@zxing/browser';
import { toast } from 'react-toastify';
import * as THREE from 'three';

// Bus Interior Component
const BusInterior = () => {
  return (
    <group>
      {/* Bus Floor */}
      <Box args={[10, 0.2, 25]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial color="#404040" roughness={0.8} />
      </Box>
      
      {/* Bus Floor Pattern */}
      <Box args={[1.5, 0.01, 25]} position={[0, 0.21, 0]} receiveShadow>
        <meshStandardMaterial color="#ffd700" metalness={0.3} roughness={0.4} />
      </Box>
      
      {/* Bus Walls - Transparent */}
      <Box args={[0.3, 7, 25]} position={[-5, 3.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e8e8" transparent opacity={0.1} />
      </Box>
      <Box args={[0.3, 7, 25]} position={[5, 3.5, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#e8e8e8" transparent opacity={0.1} />
      </Box>
      
      {/* Bus Ceiling - Transparent */}
      <Box args={[10, 0.3, 25]} position={[0, 7, 0]} receiveShadow>
        <meshStandardMaterial color="#f5f5f5" transparent opacity={0.15} />
      </Box>
      
      {/* Wall Frames for structure visibility */}
      <Box args={[0.05, 7, 0.05]} position={[-5, 3.5, -12]} castShadow>
        <meshStandardMaterial color="#666666" />
      </Box>
      <Box args={[0.05, 7, 0.05]} position={[-5, 3.5, 12]} castShadow>
        <meshStandardMaterial color="#666666" />
      </Box>
      <Box args={[0.05, 7, 0.05]} position={[5, 3.5, -12]} castShadow>
        <meshStandardMaterial color="#666666" />
      </Box>
      <Box args={[0.05, 7, 0.05]} position={[5, 3.5, 12]} castShadow>
        <meshStandardMaterial color="#666666" />
      </Box>
      
      {/* Front Wall with Door Opening */}
      <group position={[0, 3.5, -12.5]}>
        <Box args={[3, 7, 0.3]} position={[-3.5, 0, 0]} castShadow>
          <meshStandardMaterial color="#e8e8e8" />
        </Box>
        <Box args={[3, 7, 0.3]} position={[3.5, 0, 0]} castShadow>
          <meshStandardMaterial color="#e8e8e8" />
        </Box>
        <Box args={[4, 2, 0.3]} position={[0, 2.5, 0]} castShadow>
          <meshStandardMaterial color="#e8e8e8" />
        </Box>
      </group>
      
      {/* Back Wall */}
      <Box args={[10, 7, 0.3]} position={[0, 3.5, 12.5]} castShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Box>
      
      {/* Windows */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <group key={`window-${i}`}>
          <Box args={[0.1, 2.5, 3]} position={[-4.85, 4, z]}>
            <meshStandardMaterial color="#87CEEB" opacity={0.4} transparent metalness={0.1} roughness={0.1} />
          </Box>
          <Box args={[0.1, 2.5, 3]} position={[4.85, 4, z]}>
            <meshStandardMaterial color="#87CEEB" opacity={0.4} transparent metalness={0.1} roughness={0.1} />
          </Box>
        </group>
      ))}
      
      {/* Modern Bus Seats */}
      {[-9, -6, -3, 0, 3, 6, 9].map((z, rowIndex) => (
        <group key={`row-${rowIndex}`}>
          {/* Left side seats */}
          <group position={[-3, 0.8, z]}>
            {/* Seat Base */}
            <Box args={[1.8, 0.6, 1.8]} position={[0, 0, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#2563eb" roughness={0.4} />
            </Box>
            {/* Seat Back */}
            <Box args={[1.8, 2, 0.2]} position={[0, 1.5, -0.8]} castShadow receiveShadow>
              <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
            </Box>
            {/* Headrest */}
            <Box args={[1.2, 0.4, 0.15]} position={[0, 2.8, -0.75]} castShadow>
              <meshStandardMaterial color="#1e40af" roughness={0.3} />
            </Box>
          </group>
          
          {/* Right side seats */}
          <group position={[3, 0.8, z]}>
            {/* Seat Base */}
            <Box args={[1.8, 0.6, 1.8]} position={[0, 0, 0]} castShadow receiveShadow>
              <meshStandardMaterial color="#2563eb" roughness={0.4} />
            </Box>
            {/* Seat Back */}
            <Box args={[1.8, 2, 0.2]} position={[0, 1.5, -0.8]} castShadow receiveShadow>
              <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
            </Box>
            {/* Headrest */}
            <Box args={[1.2, 0.4, 0.15]} position={[0, 2.8, -0.75]} castShadow>
              <meshStandardMaterial color="#1e40af" roughness={0.3} />
            </Box>
          </group>
        </group>
      ))}
      
      {/* Handrails - Vertical Poles */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <group key={`pole-${i}`}>
          <Cylinder args={[0.05, 0.05, 6.8]} position={[-1.5, 3.5, z]} castShadow>
            <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 6.8]} position={[1.5, 3.5, z]} castShadow>
            <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>
      ))}
      
      {/* Horizontal Handrails */}
      <Cylinder args={[0.04, 0.04, 20]} position={[-1.5, 6.5, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <Cylinder args={[0.04, 0.04, 20]} position={[1.5, 6.5, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </Cylinder>
    </group>
  );
};

// QR Scanner Device Component
const QRScannerDevice = ({ scanning, validScan }) => {
  const scannerRef = useRef();
  
  useFrame((state) => {
    if (scannerRef.current && scanning) {
      scannerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });
  
  return (
    <group position={[0, 0, -8]}>
      {/* Mounting Pole - Thinner */}
      <Cylinder args={[0.04, 0.04, 3.5]} position={[0, 1.75, 0]} castShadow>
        <meshStandardMaterial color="#c0c0c0" metalness={0.7} roughness={0.3} />
      </Cylinder>
      
      {/* Base Mount - Smaller */}
      <Cylinder args={[0.08, 0.08, 0.05]} position={[0, 0.025, 0]} castShadow>
        <meshStandardMaterial color="#808080" metalness={0.6} roughness={0.4} />
      </Cylinder>
      
      {/* Scanner Unit - Much Smaller */}
      <group ref={scannerRef} position={[0, 3.2, 0]}>
        {/* Main Body - Compact size */}
        <Box args={[0.5, 0.7, 0.15]} position={[0, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
        </Box>
        
        {/* Screen Frame */}
        <Box args={[0.4, 0.5, 0.02]} position={[0, 0.05, 0.08]} castShadow>
          <meshStandardMaterial color="#2d2d2d" />
        </Box>
        
        {/* Display Screen */}
        <Box args={[0.35, 0.45, 0.01]} position={[0, 0.05, 0.09]}>
          <meshStandardMaterial 
            color={validScan ? "#00ff00" : scanning ? "#ffaa00" : "#0066ff"} 
            emissive={validScan ? "#00ff00" : scanning ? "#ffaa00" : "#0066ff"}
            emissiveIntensity={0.8}
          />
        </Box>
        
        {/* QR Scanner Area - Smaller */}
        <Box args={[0.25, 0.25, 0.02]} position={[0, -0.15, 0.08]} castShadow>
          <meshStandardMaterial color="#000000" />
        </Box>
        
        {/* Scanner Glass */}
        <Box args={[0.2, 0.2, 0.005]} position={[0, -0.15, 0.095]}>
          <meshStandardMaterial 
            color="#333333" 
            transparent 
            opacity={0.6}
            metalness={0.2}
            roughness={0.1}
          />
        </Box>
        
        {/* Status LED Indicator - Single small light */}
        <Box args={[0.04, 0.04, 0.02]} position={[-0.15, 0.28, 0.08]}>
          <meshStandardMaterial 
            color={scanning ? "#00ff00" : "#ff0000"}
            emissive={scanning ? "#00ff00" : "#ff0000"}
            emissiveIntensity={1}
          />
        </Box>
        
        {/* Logo Text - Smaller */}
        <Text
          position={[0, 0.28, 0.095]}
          fontSize={0.04}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ABC
        </Text>
        
        {/* Status Text - Smaller */}
        <Text
          position={[0, 0.05, 0.1]}
          fontSize={0.05}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {validScan ? "✓" : scanning ? "SCAN" : "READY"}
        </Text>
        
        {/* Small instruction icon */}
        <Text
          position={[0, -0.28, 0.095]}
          fontSize={0.03}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
        >
          QR
        </Text>
      </group>
      
      {/* Scanning Effect - Smaller cone */}
      {scanning && (
        <group position={[0, 3, 0.3]}>
          <Cylinder 
            args={[0.15, 0.4, 0.8, 6, 1, true]} 
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color="#0066ff" 
              opacity={0.15} 
              transparent 
              side={THREE.DoubleSide}
            />
          </Cylinder>
        </group>
      )}
    </group>
  );
};

// Camera Animation Component
const CameraController = ({ focusOnScanner }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    if (focusOnScanner) {
      camera.position.lerp(new THREE.Vector3(2, 4, -4), 0.05);
      camera.lookAt(0, 3.8, -8);
    }
  });
  
  return null;
};

const BusScanner3D = () => {
  const [showQRReader, setShowQRReader] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [validScan, setValidScan] = useState(false);
  // const [scannedData, setScannedData] = useState(null);
  const [passengerCount, setPassengerCount] = useState(0);
  const [recentScans, setRecentScans] = useState([]);

  const videoRef = useRef(null);
  const [codeReader, setCodeReader] = useState(null);

  useEffect(() => {
    // Initialize QR code reader
    const reader = new BrowserQRCodeReader();
    setCodeReader(reader);
    
    // Capture the video element reference at effect time
    const video = videoRef.current;
    
    return () => {
      // Cleanup - stop any active video streams
      if (video && video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleScan = (result) => {
    if (result) {
      setScanning(false);
      setShowQRReader(false);
      
      // Parse QR data (expecting format: ABC-BUS-{bookingReference}-{bookingId})
      const qrData = result.text || result;
      
      if (qrData.includes('ABC-BUS')) {
        setValidScan(true);
        setPassengerCount(prev => prev + 1);
        
        const parts = qrData.split('-');
        const bookingRef = parts[2] || 'Unknown';
        
        const scanRecord = {
          id: Date.now(),
          bookingRef,
          time: new Date().toLocaleTimeString(),
          status: 'Valid'
        };
        
        setRecentScans(prev => [scanRecord, ...prev].slice(0, 5));
        // setScannedData(qrData);
        
        toast.success(`✅ Valid Ticket: ${bookingRef}`);
        
        // Reset after 3 seconds
        setTimeout(() => {
          setValidScan(false);
          // setScannedData(null);
        }, 3000);
      } else {
        toast.error('❌ Invalid QR Code - Not an ABC Bus ticket');
        setValidScan(false);
      }
      
      // Stop scanning
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const startScanning = async () => {
    if (!codeReader || !videoRef.current) return;
    
    try {
      const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
      const selectedDeviceId = videoInputDevices[0]?.deviceId;
      
      if (selectedDeviceId) {
        setScanning(true);
        setShowQRReader(true);
        
        await codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              handleScan(result);
            }
            if (err && !(err.name === 'NotFoundException')) {
              console.error(err);
            }
          }
        );
      }
    } catch (err) {
      console.error(err);
      toast.error('Camera error. Please check permissions.');
      setScanning(false);
      setShowQRReader(false);
    }
  };

  return (
    <div style={{ height: '100vh', position: 'relative', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '20px',
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🚌 ABC Bus - QR Ticket Scanner</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
          3D Bus Interior with Smart Ticket Validation
        </p>
      </div>

      {/* 3D Scene */}
      <Canvas 
        camera={{ position: [8, 10, 15], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <fog attach="fog" args={['#f0f0f0', 10, 50]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        <Suspense fallback={null}>
          <BusInterior />
          <QRScannerDevice scanning={scanning} validScan={validScan} />
          <CameraController focusOnScanner={scanning} />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>

      {/* Control Panel */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Scanner Controls */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Scanner Controls</h3>
          
          <button
            onClick={startScanning}
            disabled={scanning}
            style={{
              background: scanning ? '#95a5a6' : '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: scanning ? 'not-allowed' : 'pointer',
              width: '100%',
              marginBottom: '10px'
            }}
          >
            {scanning ? '📷 Scanning...' : '📷 Start QR Scanner'}
          </button>

          <button
            onClick={() => {
              // Simulate a scan
              handleScan('ABC-BUS-' + Math.random().toString(36).substr(2, 9).toUpperCase() + '-123');
            }}
            style={{
              background: '#27ae60',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            🎫 Simulate Valid Scan
          </button>
        </div>

        {/* Statistics */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Today's Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: '#ecf0f1', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50' }}>{passengerCount}</div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Passengers Boarded</div>
            </div>
            <div style={{ background: '#ecf0f1', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                {recentScans.filter(s => s.status === 'Valid').length}
              </div>
              <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Valid Tickets</div>
            </div>
          </div>
        </div>

        {/* Recent Scans */}
        <div style={{ flex: 1.5 }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>Recent Scans</h3>
          <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
            {recentScans.length === 0 ? (
              <p style={{ color: '#95a5a6', fontSize: '14px' }}>No scans yet today</p>
            ) : (
              recentScans.map(scan => (
                <div key={scan.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: '#f8f9fa',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  fontSize: '14px'
                }}>
                  <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                    {scan.bookingRef}
                  </span>
                  <span style={{ color: '#7f8c8d' }}>{scan.time}</span>
                  <span style={{ color: '#27ae60', fontWeight: '500' }}>✓ {scan.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* QR Reader Modal */}
      {showQRReader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ margin: '0 0 20px 0', textAlign: 'center' }}>Scan QR Ticket</h2>
            
            <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
              <video 
                ref={videoRef} 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  background: '#000'
                }} 
              />
            </div>

            <p style={{ textAlign: 'center', color: '#7f8c8d', marginTop: '15px' }}>
              Position the QR code within the camera view
            </p>

            <button
              onClick={() => {
                // Stop scanning
                if (videoRef.current && videoRef.current.srcObject) {
                  const stream = videoRef.current.srcObject;
                  const tracks = stream.getTracks();
                  tracks.forEach(track => track.stop());
                  videoRef.current.srcObject = null;
                }
                setShowQRReader(false);
                setScanning(false);
              }}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                width: '100%',
                marginTop: '15px'
              }}
            >
              Cancel Scanning
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '12px',
        padding: '15px',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>How to Use:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#7f8c8d' }}>
          <li>Click "Start QR Scanner" to activate camera</li>
          <li>Passengers show their QR ticket</li>
          <li>Scanner validates automatically</li>
          <li>Green light = Valid ticket ✅</li>
          <li>Red alert = Invalid ticket ❌</li>
        </ol>
      </div>
    </div>
  );
};

export default BusScanner3D;