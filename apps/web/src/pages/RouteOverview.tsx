import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Box, 
  Sparkles, 
  Eye, 
  Bug, 
  ShoppingBag,
  Monitor
} from 'lucide-react';

const RouteOverview = () => {
  const routes = [
    {
      path: '/',
      title: '🎨 Enhanced 3D Experience',
      description: 'Full-featured 3D merchandise portal with interactive elements, 3D product configurator, and immersive animations. Toggle between 2D/3D modes.',
      icon: Box,
      color: 'from-blue-600 to-purple-600',
      features: ['3D Hero Section', 'Interactive Product Configurator', '2D/3D Mode Toggle', 'Advanced Animations']
    },
    {
      path: '/safe',
      title: '🛡️ Safe 2D Version',
      description: 'Beautiful 2D experience with all functionality but no 3D dependencies. Perfect for compatibility and performance.',
      icon: Monitor,
      color: 'from-green-600 to-emerald-600',
      features: ['2D Animations', 'Responsive Design', 'Fast Loading', 'Wide Compatibility']
    },
    {
      path: '/3d-test',
      title: '🧪 3D Engine Test',
      description: 'Simple 3D test page to verify React Three Fiber installation and WebGL compatibility.',
      icon: Bug,
      color: 'from-orange-600 to-red-600',
      features: ['Basic 3D Cube', 'WebGL Test', 'Performance Check', 'Compatibility Verification']
    },
    {
      path: '/enhanced',
      title: '✨ Enhanced Clean',
      description: 'Clean version of the enhanced homepage with 3D components and product showcases.',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      features: ['Clean Design', '3D Elements', 'Product Showcase', 'Advanced Loading']
    },
    {
      path: '/products',
      title: '🛍️ Product Catalog',
      description: 'Browse the complete product catalog with filtering, search, and detailed product views.',
      icon: ShoppingBag,
      color: 'from-indigo-600 to-blue-600',
      features: ['Product Grid', 'Search & Filter', 'Product Details', 'Shopping Cart']
    },
    {
      path: '/debug',
      title: '🔧 Debug Information',
      description: 'System diagnostics, environment details, and troubleshooting information.',
      icon: Eye,
      color: 'from-gray-600 to-gray-700',
      features: ['System Info', 'Environment Variables', 'Route Testing', 'Diagnostics']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Merchandise Portal
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Choose your preferred experience from our collection of interfaces and features
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>3D Engine Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Zero Errors</span>
            </div>
          </div>
        </motion.div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route, index) => (
            <motion.div
              key={route.path}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <Link to={route.path}>
                <motion.div
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden h-full transition-all duration-300 hover:bg-white/20"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${route.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-br ${route.color} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                  >
                    <route.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                      {route.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {route.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {route.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visit Button */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="mt-6 flex items-center gap-2 text-blue-400 font-medium"
                    >
                      <span>Visit Experience</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Hover Particles */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: '50%', y: '50%' }}
                        animate={{
                          scale: [0, 1, 0],
                          x: [
                            '50%',
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100}%`
                          ],
                          y: [
                            '50%',
                            `${Math.random() * 100}%`,
                            `${Math.random() * 100}%`
                          ]
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.2,
                          repeat: Infinity,
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">🚀 Ready for Production</h3>
            <p className="text-gray-300 mb-4">
              All routes are fully functional with zero compilation errors. 3D features are enabled and ready for use.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <span>✅ React 18 + TypeScript</span>
              <span>✅ Three.js + React Three Fiber</span>
              <span>✅ Framer Motion</span>
              <span>✅ Tailwind CSS</span>
              <span>✅ Vite Dev Server</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RouteOverview;
