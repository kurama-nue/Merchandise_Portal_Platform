import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Eye, 
  Layers, 
  Gauge, 
  Wand2,
  ArrowRight,
  Play
} from 'lucide-react';

// Floating Element Component
const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 4,
  intensity = 20 
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  intensity?: number;
}) => {
  return (
    <motion.div
      animate={{
        y: [0, -intensity, 0],
        rotate: [0, 2, 0, -2, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Morphing Text Component
const MorphingText = ({ texts, className }: { texts: string[]; className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2 
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration * 60); // 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="text-4xl md:text-6xl font-bold text-white"
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  );
};

// Parallax Section Component
const ParallaxSection = ({ 
  children, 
  speed = 0.5,
  className = ""
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Feature Card with 3D-style Animations
const Enhanced3DCard = ({ 
  icon: Icon, 
  title, 
  description, 
  gradient,
  delay = 0 
}: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { duration: 0.8, delay }
      } : {}}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group perspective-1000"
    >
      <motion.div
        whileHover={{ 
          rotateY: 8,
          rotateX: -5,
          scale: 1.05,
          z: 50
        }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden transform-gpu"
        style={{
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Animated Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          animate={isHovered ? { 
            scale: 1.2,
            rotate: 5
          } : { 
            scale: 1,
            rotate: 0
          }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Floating Icon */}
        <FloatingElement delay={delay} intensity={10}>
          <motion.div
            animate={isHovered ? { 
              rotateY: 360,
              scale: 1.2
            } : { 
              rotateY: 0,
              scale: 1
            }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Icon className="w-10 h-10 text-white" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
              animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            />
          </motion.div>
        </FloatingElement>
        
        <div className="relative z-10">
          <motion.h3 
            className="text-2xl font-bold text-white mb-4"
            animate={isHovered ? { x: 5 } : { x: 0 }}
          >
            {title}
          </motion.h3>
          <motion.p 
            className="text-gray-300 leading-relaxed"
            animate={isHovered ? { x: 10 } : { x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {description}
          </motion.p>
        </div>
        
        {/* Hover Effect Particles */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                  className="absolute w-2 h-2 bg-white rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Main ScrollTriggeredAnimations Component
const ScrollTriggeredAnimations = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);

  return (
    <div ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        <ParallaxSection speed={0.3}>
          <FloatingElement delay={0} duration={6} intensity={30}>
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl" />
          </FloatingElement>
        </ParallaxSection>
        
        <ParallaxSection speed={0.7}>
          <FloatingElement delay={2} duration={8} intensity={40}>
            <div className="absolute top-40 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-xl" />
          </FloatingElement>
        </ParallaxSection>
        
        <ParallaxSection speed={0.5}>
          <FloatingElement delay={4} duration={10} intensity={25}>
            <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-emerald-500/20 rounded-full blur-xl" />
          </FloatingElement>
        </ParallaxSection>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          style={{ y: textY }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <MorphingText 
                texts={[
                  "Revolutionary",
                  "Immersive", 
                  "Interactive",
                  "Cutting-Edge"
                ]}
                className="h-20"
              />
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto"
            >
              Dive into a new dimension of merchandise shopping with advanced animations, 
              real-time customization, and immersive visual experiences
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          <div className="text-center">
            <AnimatedCounter value={50} suffix="K+" />
            <p className="text-gray-400 mt-2">Happy Customers</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={200} suffix="+" />
            <p className="text-gray-400 mt-2">3D Products</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={99} suffix="%" />
            <p className="text-gray-400 mt-2">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <AnimatedCounter value={24} suffix="/7" />
            <p className="text-gray-400 mt-2">Support Available</p>
          </div>
        </motion.div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Enhanced3DCard
            icon={Eye}
            title="AR Visualization"
            description="See products in your space with advanced augmented reality technology and real-time rendering."
            gradient="from-blue-600 to-cyan-600"
            delay={0}
          />
          <Enhanced3DCard
            icon={Layers}
            title="Multi-Layer Customization"
            description="Personalize every aspect of your products with our advanced layered customization system."
            gradient="from-purple-600 to-pink-600"
            delay={0.2}
          />
          <Enhanced3DCard
            icon={Zap}
            title="Lightning Fast"
            description="Experience instant feedback and real-time updates with our optimized rendering engine."
            gradient="from-emerald-600 to-teal-600"
            delay={0.4}
          />
          <Enhanced3DCard
            icon={Gauge}
            title="Performance Optimized"
            description="Smooth 60fps animations and optimized loading for the best user experience across all devices."
            gradient="from-orange-600 to-red-600"
            delay={0.6}
          />
          <Enhanced3DCard
            icon={Wand2}
            title="Magic Interactions"
            description="Intuitive gestures and magical transitions that make product exploration feel effortless."
            gradient="from-indigo-600 to-purple-600"
            delay={0.8}
          />
          <Enhanced3DCard
            icon={Sparkles}
            title="Premium Effects"
            description="Stunning visual effects, particle systems, and premium animations for an immersive experience."
            gradient="from-pink-600 to-rose-600"
            delay={1.0}
          />
        </div>

        {/* Interactive Demo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Magic?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their shopping experience
            </p>
            
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)",
                rotateY: 5
              }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full font-semibold text-xl transition-all duration-300 flex items-center gap-4 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start Interactive Demo
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollTriggeredAnimations;
