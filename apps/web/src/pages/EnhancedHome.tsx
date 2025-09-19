import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShoppingBag, 
  Star,
  Box,
  Zap,
  Settings
} from 'lucide-react';
import EnhancedProductShowcase from '../components/visual/EnhancedProductShowcase';
import AdvancedLoading from '../components/visual/AdvancedLoading';
import ProductConfigurator3D from '../components/visual/ProductConfigurator3D_v2';
import Hero3D from '../components/visual/Hero3D_v2';
import ScrollTriggeredAnimations from '../components/visual/ScrollTriggeredAnimations_v2';

// Enhanced Hero Section (2D version)
const EnhancedHero = ({ onOpenConfigurator }: { onOpenConfigurator?: () => void }) => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden flex items-center justify-center"
    >
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
            Experience immersive product discovery with cutting-edge technology and premium quality merchandise
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
              onClick={onOpenConfigurator}
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
            >
              <Settings className="w-5 h-5" />
              3D Configurator
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

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
    </motion.div>
  );
};

// Interactive Feature Card Component
const InteractiveFeatureCard = ({ icon: Icon, title, description, gradient, delay }: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
  delay: number;
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
        whileHover={{ scale: 1.05, rotateY: 5 }}
        className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden"
      >
        {/* Animated Background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
        />
        
        {/* Icon with Animation */}
        <motion.div
          animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-300 leading-relaxed">{description}</p>
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
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 100 + '%',
                    y: Math.random() * 100 + '%',
                    scale: 0,
                    opacity: 0
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    repeat: Infinity,
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

// Testimonial Component
const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Designer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b9e3?w=150&h=150&fit=crop&crop=face",
      content: "The 3D visualization completely changed how I shop for merchandise. Being able to see every detail before purchasing is incredible!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "Outstanding quality and the customization options are endless. The AR preview feature saved us so much time in decision making.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "The platform's immersive experience made ordering branded merchandise for our team absolutely effortless. Highly recommended!",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            What Our <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Customers</span> Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who've transformed their merchandise experience
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-400 to-purple-400">
                    <img
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-sm"
                  />
                </motion.div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  
                  <div>
                    <p className="text-lg font-semibold text-white">{testimonials[currentIndex].name}</p>
                    <p className="text-gray-400">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 w-8' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Home Component
const EnhancedHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [use3DHero, setUse3DHero] = useState(false);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AdvancedLoading type="minimal" />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 3D/2D Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setUse3DHero(!use3DHero)}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
            use3DHero 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
              : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
          }`}
        >
          {use3DHero ? '🌟 3D Mode' : '🎨 Enhanced Mode'}
        </motion.button>
      </motion.div>

      {use3DHero ? (
        <Hero3D />
      ) : (
        <EnhancedHero onOpenConfigurator={() => setIsConfiguratorOpen(true)} />
      )}
      
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
              Revolutionary <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Features</span>
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
            />
            <InteractiveFeatureCard
              icon={Sparkles}
              title="AR Preview"
              description="See how products look in your space with our advanced augmented reality technology."
              gradient="from-purple-600 to-pink-600"
              delay={0.2}
            />
            <InteractiveFeatureCard
              icon={Zap}
              title="Real-time Customization"
              description="Personalize colors, materials, and designs with instant visual feedback."
              gradient="from-emerald-600 to-teal-600"
              delay={0.4}
            />
          </div>
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
              Featured <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">Collection</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our most popular items with interactive previews
            </p>
          </motion.div>
          
          <EnhancedProductShowcase />
        </div>
      </section>

      {/* Advanced Scroll Animations */}
      <ScrollTriggeredAnimations />

      {/* Testimonials */}
      <TestimonialCarousel />

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
              Join the future of merchandise shopping with our revolutionary platform
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsConfiguratorOpen(true)}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-3"
              >
                <Settings className="w-5 h-5" />
                3D Configurator
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Product Configurator */}
      <ProductConfigurator3D 
        isOpen={isConfiguratorOpen}
        onClose={() => setIsConfiguratorOpen(false)}
      />
    </div>
  );
};

export default EnhancedHome;
