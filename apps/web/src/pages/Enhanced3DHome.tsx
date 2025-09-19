import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Camera, 
  ShoppingBag, 
  Box,
  Zap,
  Settings,
  Eye
} from 'lucide-react';

// Import 3D Components
import SimpleHero3D from '../components/visual/SimpleHero3D';
import ProductConfigurator3D_v2 from '../components/visual/ProductConfigurator3D_v2';
import ScrollTriggeredAnimations_v2 from '../components/visual/ScrollTriggeredAnimations_v2';
import EnhancedProductShowcase from '../components/visual/EnhancedProductShowcase';
import AdvancedLoading from '../components/visual/AdvancedLoading';

// Simple 2D Hero for fallback
const Enhanced2DHero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: Math.random() * 200 + 20,
                height: Math.random() * 200 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 8 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
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
            Experience immersive product discovery with cutting-edge 3D technology and premium quality merchandise
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
                Explore Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
            >
              <Camera className="w-5 h-5" />
              3D Experience
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// 3D Mode Toggle Component
const ModeToggle = ({ is3D, setIs3D }: { is3D: boolean; setIs3D: (value: boolean) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-50 bg-white/10 backdrop-blur-lg rounded-full p-2 border border-white/20"
    >
      <div className="flex items-center gap-3 px-4 py-2">
        <Eye className="w-4 h-4 text-white" />
        <span className="text-white text-sm font-medium">Experience Mode</span>
        <motion.button
          onClick={() => setIs3D(!is3D)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
            is3D ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-600'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            animate={{ x: is3D ? 28 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {is3D ? <Box className="w-3 h-3 text-blue-600" /> : <Box className="w-3 h-3 text-gray-600" />}
          </motion.div>
        </motion.button>
        <span className="text-white text-xs">
          {is3D ? '3D' : '2D'}
        </span>
      </div>
    </motion.div>
  );
};

// Interactive Feature Card with 3D toggle
const InteractiveFeatureCard = ({ icon: Icon, title, description, gradient, delay, is3D }: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
  delay: number;
  is3D: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <motion.div
        whileHover={{ 
          scale: 1.05, 
          rotateY: is3D ? 5 : 0,
          rotateX: is3D ? 2 : 0,
        }}
        className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Animated Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        />
        
        {/* Icon with 3D Animation */}
        <motion.div
          animate={isHovered ? { 
            rotate: is3D ? 360 : 180, 
            scale: 1.2,
            rotateY: is3D ? 180 : 0 
          } : { 
            rotate: 0, 
            scale: 1,
            rotateY: 0 
          }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>

        {/* 3D Mode Enhancement */}
        {is3D && (
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
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%',
                      scale: 0,
                      opacity: 0,
                      rotateZ: 0
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotateZ: [0, 360],
                      x: [
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%',
                        Math.random() * 100 + '%'
                      ]
                    }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 0.5,
                      repeat: Infinity,
                    }}
                    className="absolute w-2 h-2 bg-white rounded-full"
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

// Enhanced Home Component with 3D Features
const Enhanced3DHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [is3D, setIs3D] = useState(true);
  const [showConfigurator, setShowConfigurator] = useState(false);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AdvancedLoading type="assembly" />;
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* 3D Mode Toggle */}
      <ModeToggle is3D={is3D} setIs3D={setIs3D} />
      
      {/* Hero Section with 3D Toggle */}
      <AnimatePresence mode="wait">
        {is3D ? (
          <motion.div
            key="3d-hero"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <SimpleHero3D />
          </motion.div>
        ) : (
          <motion.div
            key="2d-hero"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <Enhanced2DHero />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Revolutionary <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">3D Features</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of merchandise shopping with cutting-edge technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InteractiveFeatureCard
              icon={Box}
              title="3D Visualization"
              description="Rotate, zoom, and explore products in stunning 3D detail before making your decision."
              gradient="from-blue-600 to-cyan-600"
              delay={0}
              is3D={is3D}
            />
            <InteractiveFeatureCard
              icon={Sparkles}
              title="AR Preview"
              description="See how products look in your space with our advanced augmented reality technology."
              gradient="from-purple-600 to-pink-600"
              delay={0.2}
              is3D={is3D}
            />
            <InteractiveFeatureCard
              icon={Zap}
              title="Real-time Customization"
              description="Personalize colors, materials, and designs with instant visual feedback."
              gradient="from-emerald-600 to-teal-600"
              delay={0.4}
              is3D={is3D}
            />
          </div>
        </div>
      </section>

      {/* 3D Product Configurator Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Interactive <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Product Designer</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Customize products in real-time with our advanced 3D configurator
            </p>
            
            <motion.button
              onClick={() => setShowConfigurator(!showConfigurator)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              <Settings className="w-5 h-5" />
              {showConfigurator ? 'Hide' : 'Open'} 3D Configurator
              <Box className="w-5 h-5" />
            </motion.button>
          </motion.div>
          
          <AnimatePresence>
            {showConfigurator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <ProductConfigurator3D_v2 
                  isOpen={true}
                  onClose={() => setShowConfigurator(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Enhanced Product Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Collection</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our most popular items with interactive previews
            </p>
          </motion.div>
          
          <EnhancedProductShowcase />
        </div>
      </section>

      {/* Scroll Triggered Animations */}
      {is3D && <ScrollTriggeredAnimations_v2 />}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-emerald-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Transform</span> Your Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the future of merchandise shopping with our revolutionary 3D platform
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 flex items-center gap-3"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <motion.button
                onClick={() => setIs3D(!is3D)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
              >
                <Box className="w-5 h-5" />
                Switch to {is3D ? '2D' : '3D'} Mode
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Enhanced3DHome;
