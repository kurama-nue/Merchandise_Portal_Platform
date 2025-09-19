import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// 3D Loading Spinner Component
function LoadingSpinner3D() {
  const meshRef = React.useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </Sphere>
      
      <Box args={[0.3, 0.3, 0.3]} position={[1.2, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" metalness={0.6} roughness={0.3} />
      </Box>
      
      <Cylinder args={[0.2, 0.2, 0.6]} position={[-1.2, 0, 0]}>
        <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.25} />
      </Cylinder>
      
      <Box args={[0.25, 0.25, 0.25]} position={[0, 1.2, 0]}>
        <meshStandardMaterial color="#f59e0b" metalness={0.5} roughness={0.4} />
      </Box>
      
      <Sphere args={[0.3]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#ef4444" metalness={0.9} roughness={0.1} />
      </Sphere>
    </group>
  );
}

// Morphing Loader Component
function MorphingLoader() {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.2);
      meshRef.current.rotation.y = time * 0.5;
      
      // Color morphing
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      const hue = (time * 0.1) % 1;
      material.color.setHSL(hue, 0.8, 0.6);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

// Floating Particles Loader
function ParticleLoader() {
  const particlesRef = React.useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = React.useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#3b82f6" />
    </points>
  );
}

// DNA Helix Loader
function DNALoader() {
  const groupRef = React.useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  const spheres = React.useMemo(() => {
    const sphereElements = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 4;
      const y = (i - 10) * 0.2;
      const radius = 1;
      
      sphereElements.push(
        <Sphere key={`sphere-${i}`} args={[0.1]} position={[
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ]}>
          <meshStandardMaterial color={i % 2 === 0 ? "#3b82f6" : "#8b5cf6"} />
        </Sphere>
      );
    }
    return sphereElements;
  }, []);

  return <group ref={groupRef}>{spheres}</group>;
}

// Product Assembly Animation
function ProductAssemblyLoader() {
  const [assemblyStep, setAssemblyStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAssemblyStep((prev) => (prev + 1) % 4);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      <group
        position={[
          assemblyStep >= 1 ? 0 : -2,
          assemblyStep >= 1 ? 0 : 1,
          0
        ]}
      >
        <Box args={[0.8, 0.8, 0.1]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" />
        </Box>
      </group>
      
      <group
        position={[
          assemblyStep >= 2 ? 0 : 2,
          assemblyStep >= 2 ? 0 : -1,
          0
        ]}
      >
        <Box args={[0.6, 0.6, 0.15]} position={[0, 0, 0.125]}>
          <meshStandardMaterial color="#8b5cf6" />
        </Box>
      </group>
      
      <group
        scale={assemblyStep >= 3 ? 1 : 0}
        rotation={[0, 0, assemblyStep >= 3 ? 0 : Math.PI]}
      >
        <Cylinder args={[0.1, 0.1, 0.3]} position={[0, 0, 0.35]}>
          <meshStandardMaterial color="#10b981" />
        </Cylinder>
      </group>
    </group>
  );
}

// Floating Text Loader
const FloatingTextLoader = ({ text }: { text: string }) => {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h3
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {text}
      </motion.h3>
      
      <div className="flex justify-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Main Advanced Loading Component
export const AdvancedLoading = ({ 
  type = 'spinner', 
  text = 'Loading...', 
  isVisible = true,
  progress = 0,
  showProgress = false 
}: {
  type?: 'spinner' | 'morphing' | 'particles' | 'dna' | 'assembly' | 'minimal';
  text?: string;
  isVisible?: boolean;
  progress?: number;
  showProgress?: boolean;
}) => {
  const [loadingPhase, setLoadingPhase] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const phases = [
      'Initializing 3D Engine...',
      'Loading Product Models...',
      'Applying Textures...',
      'Optimizing Performance...',
      'Almost Ready...'
    ];
    
    const interval = setInterval(() => {
      setLoadingPhase((prev) => (prev + 1) % phases.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  const get3DLoader = () => {
    switch (type) {
      case 'morphing':
        return <MorphingLoader />;
      case 'particles':
        return <ParticleLoader />;
      case 'dna':
        return <DNALoader />;
      case 'assembly':
        return <ProductAssemblyLoader />;
      default:
        return <LoadingSpinner3D />;
    }
  };

  if (type === 'minimal') {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <FloatingTextLoader text={text} />
              
              {showProgress && (
                <div className="mt-6 w-64 mx-auto">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{Math.round(progress)}% Complete</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 backdrop-blur-sm flex items-center justify-center"
        >
          <div className="text-center">
            {/* 3D Loading Animation */}
            <div className="w-64 h-64 mx-auto mb-8">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
                
                {get3DLoader()}
              </Canvas>
            </div>
            
            {/* Loading Text with Phase Animation */}
            <motion.div
              key={loadingPhase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-white space-y-4"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {text}
              </h2>
              
              <motion.p
                className="text-blue-200 text-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Preparing your premium experience...
              </motion.p>
            </motion.div>
            
            {/* Progress Bar */}
            {showProgress && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 w-80 mx-auto"
              >
                <div className="bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-size-200 bg-pos-0"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${progress}%`,
                      backgroundPosition: ['0% 50%', '200% 50%', '0% 50%']
                    }}
                    transition={{ 
                      width: { duration: 0.5 },
                      backgroundPosition: { duration: 2, repeat: Infinity }
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-blue-200 text-sm">
                  <span>Loading Assets</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </motion.div>
            )}
            
            {/* Features Loading */}
            <div className="mt-12 grid grid-cols-3 gap-6 text-center">
              {[
                { icon: '🎨', label: 'Textures' },
                { icon: '🔮', label: '3D Models' },
                { icon: '⚡', label: 'Animations' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="text-white/80"
                >
                  <motion.div
                    className="text-3xl mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <p className="text-sm">{feature.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Performance Stats */}
          <div className="absolute bottom-8 right-8 text-white/60 text-xs">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                WebGL Active
              </div>
              <div>3D Rendering: 60 FPS</div>
              <div>Memory: Optimized</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvancedLoading;
