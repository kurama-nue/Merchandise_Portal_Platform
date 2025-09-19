import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// 3D Floating Elements
function FloatingElement({ position, text, color, delay = 0 }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      if (isHovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        >
          <boxGeometry args={[1, 1, 0.2]} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
        </mesh>
        
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          {text}
        </Text>
      </group>
    </Float>
  );
}

// Parallax Scene Component
function ParallaxScene({ scrollProgress }: { scrollProgress: any }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollProgress.get() * Math.PI * 2;
      groupRef.current.position.z = scrollProgress.get() * 5;
    }
  });

  const elements = [
    { position: [-3, 1, 0], text: "PREMIUM", color: "#3b82f6", delay: 0 },
    { position: [3, -1, -2], text: "QUALITY", color: "#8b5cf6", delay: 0.5 },
    { position: [0, 2, -4], text: "DESIGN", color: "#10b981", delay: 1 },
    { position: [-2, -2, -6], text: "STYLE", color: "#f59e0b", delay: 1.5 },
  ];

  return (
    <group ref={groupRef}>
      {elements.map((element, index) => (
        <FloatingElement key={index} {...element} />
      ))}
    </group>
  );
}

// Morphing Text Component
const MorphingText = ({ texts, className = "" }: { texts: string[]; className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [texts]);

  return (
    <div className={`relative ${className}`}>
      {texts.map((text, index) => (
        <motion.span
          key={text}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            y: index === currentIndex ? 0 : -20
          }}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
};

// Number Counter Animation
const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = "" }: any) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true });
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(from + (to - from) * easeOutQuart);
      
      if (nodeRef.current) {
        nodeRef.current.textContent = `${currentValue}${suffix}`;
      }
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, from, to, duration, suffix]);
  
  return <span ref={nodeRef}>{from}{suffix}</span>;
};

// Progressive Image Reveal
const ProgressiveImageReveal = ({ src, alt, className = "" }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [lowResLoaded, setLowResLoaded] = useState(false);
  
  const lowResSrc = src.replace(/w=\d+/, 'w=50').replace(/q=\d+/, 'q=10');
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low-res placeholder */}
      <motion.img
        src={lowResSrc}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
        onLoad={() => setLowResLoaded(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: lowResLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* High-res image */}
      <motion.img
        src={src}
        alt={alt}
        className="relative w-full h-full object-cover"
        onLoad={() => setImageLoaded(true)}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ 
          opacity: imageLoaded ? 1 : 0,
          scale: imageLoaded ? 1 : 1.1
        }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      
      {/* Loading overlay */}
      {!imageLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: imageLoaded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </div>
  );
};

// Main Scroll Triggered Animations Component
export const ScrollTriggeredAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const { scrollYProgress: featuresProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"]
  });
  
  // Spring animations for smooth movement
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  
  // Transform values based on scroll
  const heroY = useTransform(heroProgress, [0, 1], [0, -200]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.8]);
  
  const featuresY = useTransform(featuresProgress, [0, 0.5, 1], [100, 0, -100]);
  const featuresOpacity = useTransform(featuresProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  // Mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);
  
  const heroInView = useInView(heroRef, { margin: "-20%" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-20%" });
  const statsInView = useInView(statsRef, { once: true, margin: "-20%" });
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-20%" });

  const morphingTexts = [
    "PREMIUM MERCHANDISE",
    "STUNNING 3D EXPERIENCE", 
    "INFINITE POSSIBILITIES",
    "YOUR STYLE, PERFECTED"
  ];

  const features = [
    {
      title: "3D Product Visualization",
      description: "Interact with products in stunning 3D detail",
      icon: "🔮",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Real-time Customization",
      description: "Customize colors, materials, and designs instantly",
      icon: "🎨",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "AR Preview",
      description: "See how products look in your space",
      icon: "📱",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Premium Quality",
      description: "Hand-picked materials and craftsmanship",
      icon: "⭐",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Happy Customers" },
    { value: 500, suffix: "+", label: "Premium Products" },
    { value: 99, suffix: "%", label: "Satisfaction Rate" },
    { value: 24, suffix: "h", label: "Fast Delivery" }
  ];

  return (
    <div ref={containerRef} className="relative min-h-[500vh] bg-black overflow-hidden">
      {/* Hero Section with 3D Elements */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="sticky top-0 h-screen flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <Environment preset="sunset" />
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            
            <ParallaxScene scrollProgress={smoothProgress} />
            
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>
        
        <div className="relative z-10 text-center text-white px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <MorphingText 
                texts={morphingTexts}
                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              />
            </h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1 }}
            >
              Discover the future of online shopping with immersive 3D product experiences
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg"
              >
                Explore Collection
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20"
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        style={{ y: featuresY, opacity: featuresOpacity }}
        className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the next generation of e-commerce with cutting-edge technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50, rotateY: -10 }}
                animate={featuresInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ 
                  scale: 1.05, 
                  rotateY: 5,
                  z: 20
                }}
                className="group relative p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 group-hover:text-white transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.5 }}
            animate={statsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-16"
          >
            Trusted by Thousands
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <motion.div
                  className="text-5xl md:text-6xl font-bold text-white mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </motion.div>
                <p className="text-xl text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Showcase Section */}
      <motion.section
        ref={showcaseRef}
        className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={showcaseInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
                Experience the
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  {" "}Future
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Revolutionary 3D product visualization that transforms how you shop online. 
                See, touch, and customize products like never before.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg"
              >
                Start Exploring
              </motion.button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={showcaseInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden">
                <ProgressiveImageReveal
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                  alt="3D Product Showcase"
                  className="w-full h-full"
                />
              </div>
              
              {/* Floating elements around image */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                🚀
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ScrollTriggeredAnimations;
