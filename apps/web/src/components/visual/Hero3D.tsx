import { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

// 3D Floating Product Component
function FloatingProduct({ position, rotation, productData, index }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
      meshRef.current.rotation.y += 0.003;
      
      // Scale on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.2, 1.5, 0.1]} />
          <meshStandardMaterial
            color={hovered ? '#60a5fa' : '#e5e7eb'}
            metalness={0.3}
            roughness={0.2}
            emissive={hovered ? '#1e40af' : '#000000'}
            emissiveIntensity={hovered ? 0.1 : 0}
          />
        </mesh>
        
        {/* Product Image as Texture */}
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[1.1, 1.4]} />
          <meshBasicMaterial>
            <primitive object={new THREE.TextureLoader().load(productData.image)} attach="map" />
          </meshBasicMaterial>
        </mesh>
        
        {/* Holographic Effect */}
        {hovered && (
          <mesh position={[0, 0, -0.051]}>
            <planeGeometry args={[1.3, 1.7]} />
            <meshBasicMaterial
              color="#3b82f6"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}

// Particle System Component
function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const particleCount = 500;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random() * 0.5 + 0.5;
      colors[i * 3 + 2] = 1;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.05;
      points.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// 3D Text Component
function Hero3DText() {
  return (
    <Center>
      <Text3D
        font="/fonts/helvetiker_regular.typeface.json"
        size={1}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        PREMIUM
        <meshStandardMaterial
          color="#3b82f6"
          metalness={0.8}
          roughness={0.2}
          emissive="#1e40af"
          emissiveIntensity={0.1}
        />
      </Text3D>
    </Center>
  );
}

// Main Scene Component
function Scene({ products }: { products: any[] }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 8);
  }, [camera]);

  const productPositions = [
    [-4, 2, -2],
    [4, 1, -3],
    [-3, -2, -1],
    [3, -1, -4],
    [0, 3, -5],
    [-2, -3, 0],
    [2, 2, -6]
  ];

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      
      <ParticleField />
      
      {products.map((product, index) => (
        <FloatingProduct
          key={index}
          position={productPositions[index] || [0, 0, 0]}
          rotation={[Math.random() * 0.5, Math.random() * Math.PI, 0]}
          productData={product}
          index={index}
        />
      ))}
      
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[0, -1, 0]}>
          <Hero3DText />
        </group>
      </Float>
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Interactive Hotspot Component
const InteractiveHotspot = ({ position, product, onHover }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="absolute z-20 cursor-pointer"
      style={{ left: position.x, top: position.y }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(product);
      }}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.2 : 1,
        rotate: isHovered ? 180 : 0,
      }}
    >
      <div className="relative">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75" />
        </div>
        
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-xl min-w-[200px]"
          >
            <h4 className="font-semibold text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{product.category}</p>
            <p className="text-lg font-bold text-blue-600 mt-2">${product.price}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Main Hero3D Component
export const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const products = [
    {
      id: 1,
      name: "Premium Graphic Tee",
      category: "Clothing",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      name: "Designer Hoodie",
      category: "Clothing",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      name: "Smart Watch",
      category: "Electronics",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      name: "Wireless Headphones",
      category: "Electronics",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1518441902111-a9a2e7e705a4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      name: "Designer Backpack",
      category: "Accessories",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1520975693411-c6155b310fd1?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const hotspots = [
    { x: '20%', y: '30%', productId: 1 },
    { x: '75%', y: '25%', productId: 2 },
    { x: '30%', y: '60%', productId: 3 },
    { x: '80%', y: '70%', productId: 4 },
    { x: '50%', y: '45%', productId: 5 }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale, y }}
      className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ background: 'transparent' }}
        >
          <Scene products={products} />
        </Canvas>
      </div>

      {/* Interactive Hotspots */}
      {hotspots.map((hotspot, index) => {
        const product = products.find(p => p.id === hotspot.productId);
        return product ? (
          <InteractiveHotspot
            key={index}
            position={{
              x: hotspot.x,
              y: hotspot.y
            }}
            product={product}
            onHover={() => {}}
          />
        ) : null;
      })}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400">
                Future of
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-400">
                Merchandise
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Experience immersive 3D product discovery with cutting-edge technology and premium quality merchandise
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
                  <ShoppingBag className="w-5 h-5" />
                  Explore in 3D
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" />
                Custom Design
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60 text-center"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 mb-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full"
            />
          </div>
          <p className="text-sm">Scroll to discover</p>
        </motion.div>
      </div>

      {/* Performance Stats Overlay */}
      <div className="absolute top-4 right-4 z-20 text-white/70 text-xs">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
          <p>WebGL Enabled</p>
          <p>60 FPS Rendering</p>
          <p>{products.length} Products Loaded</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero3D;
