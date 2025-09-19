import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Text3D, 
  Float, 
  Environment, 
  Sparkles as DreiSparkles,
  Html,
  ContactShadows
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Camera } from 'lucide-react';
import * as THREE from 'three';

// Floating Product Component
const FloatingProduct = ({ position, color, scale = 1 }: {
  position: [number, number, number];
  color: string;
  scale?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh
        ref={meshRef}
        position={position}
        scale={hovered ? scale * 1.2 : scale}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.1}
          metalness={0.8}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
    </Float>
  );
};

// Particle System Component
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 2000;
  
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Random positions in a sphere
    const radius = 20;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = radius * Math.cos(phi);
    
    // Random colors
    const colorIntensity = Math.random();
    colors[i] = 0.3 + colorIntensity * 0.7; // R
    colors[i + 1] = 0.5 + colorIntensity * 0.5; // G
    colors[i + 2] = 1; // B
  }
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        transparent
        opacity={0.6}
        vertexColors
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// 3D Text Component
const Hero3DText = () => {
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
        position={[-4, 0, 0]}
      >
        Future of Merchandise
        <meshStandardMaterial 
          color="#4f46e5"
          roughness={0.1}
          metalness={0.8}
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </Text3D>
    </group>
  );
};

// Interactive Hotspot Component
const InteractiveHotspot = ({ position, info, onClick }: {
  position: [number, number, number];
  info: string;
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#fbbf24" : "#60a5fa"}
          emissive={hovered ? "#f59e0b" : "#3b82f6"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {hovered && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            {info}
          </div>
        </Html>
      )}
    </group>
  );
};

// Scene Environment Component
const SceneEnvironment = () => {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
      <ContactShadows 
        position={[0, -3, 0]} 
        opacity={0.4} 
        scale={50} 
        blur={2} 
        far={10} 
      />
    </>
  );
};

// Main 3D Scene Component
const Hero3DScene = ({ onHotspotClick }: { onHotspotClick: (info: string) => void }) => {
  const { camera } = useThree();
  
  // Set initial camera position
  camera.position.set(0, 0, 10);

  return (
    <>
      <SceneEnvironment />
      <ParticleField />
      
      {/* Floating Products */}
      <FloatingProduct position={[-3, 1, 2]} color="#3b82f6" scale={0.8} />
      <FloatingProduct position={[3, -1, 1]} color="#8b5cf6" scale={0.6} />
      <FloatingProduct position={[1, 2, -2]} color="#10b981" scale={0.7} />
      <FloatingProduct position={[-2, -2, 3]} color="#f59e0b" scale={0.5} />
      
      {/* Interactive Hotspots */}
      <InteractiveHotspot 
        position={[-3, 1, 2.5]} 
        info="Premium T-Shirt Collection"
        onClick={() => onHotspotClick("Premium T-Shirt Collection")}
      />
      <InteractiveHotspot 
        position={[3, -1, 1.5]} 
        info="Designer Accessories"
        onClick={() => onHotspotClick("Designer Accessories")}
      />
      <InteractiveHotspot 
        position={[1, 2, -1.5]} 
        info="Tech Gadgets"
        onClick={() => onHotspotClick("Tech Gadgets")}
      />
      
      {/* 3D Text */}
      <Suspense fallback={null}>
        <Hero3DText />
      </Suspense>
      
      {/* Sparkles Effect */}
      <DreiSparkles 
        count={100}
        scale={10}
        size={3}
        speed={0.4}
        opacity={0.6}
      />
      
      {/* Camera Controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Loading Fallback Component
const Hero3DLoading = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="text-white text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg">Loading 3D Experience...</p>
    </div>
  </div>
);

// Main Hero3D Component
const Hero3D = () => {
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  
  const handleHotspotClick = (info: string) => {
    setSelectedHotspot(info);
    // Auto-clear after 3 seconds
    setTimeout(() => setSelectedHotspot(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          shadows
        >
          <Suspense fallback={<Hero3DLoading />}>
            <Hero3DScene onHotspotClick={handleHotspotClick} />
          </Suspense>
        </Canvas>
      </div>

      {/* 2D UI Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold mb-6"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent bg-size-200">
                Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-400 bg-clip-text text-transparent">
                Merchandise
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Experience immersive 3D product discovery with cutting-edge WebGL technology
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  Explore 3D Collection
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
              >
                <Camera className="w-5 h-5" />
                AR Preview
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Hotspot Information Display */}
      {selectedHotspot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-8 right-8 z-20 bg-black/80 backdrop-blur-sm text-white p-4 rounded-xl max-w-sm"
        >
          <h3 className="text-lg font-semibold mb-2">Product Spotlight</h3>
          <p className="text-gray-300">{selectedHotspot}</p>
          <div className="mt-3">
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Learn More →
            </button>
          </div>
        </motion.div>
      )}

      {/* 3D Navigation Hint */}
      <motion.div
        className="absolute bottom-8 left-8 z-20 text-white/60 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p>🖱️ Drag to rotate • Click hotspots to explore</p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-white/60 text-center">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 mb-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full"
            />
          </div>
          <p className="text-sm">Scroll to discover</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero3D;
