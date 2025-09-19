import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Simple 3D Box component
function FloatingBox({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#6366f1" 
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

// Simple 3D Sphere for text placeholder
function Hero3DSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2}>
      <mesh ref={meshRef} position={[-2, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          metalness={0.9}
          roughness={0.1}
          emissive="#4c1d95"
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

// 3D Scene
function Scene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
      
      {/* Environment */}
      <Environment preset="sunset" />
      
      {/* 3D Objects */}
      <Hero3DSphere />
      <FloatingBox position={[2, 1, 0]} />
      <FloatingBox position={[-1, -1, 2]} />
      <FloatingBox position={[3, -0.5, -1]} />
      
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
}

// Simple Hero 3D Component
const SimpleHero3D = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
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
              Experience immersive 3D product discovery with cutting-edge technology
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg"
              >
                Explore 3D Collection
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20"
              >
                Customize Products
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-center">
        <p className="text-sm">🖱️ Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
};

export default SimpleHero3D;
