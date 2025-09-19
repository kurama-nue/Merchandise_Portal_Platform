import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageTransition } from '../PageTransition';

const AuthLayout: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-teal-400/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
        </motion.div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-teal-400 to-blue-500"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 8 + Math.random() * 4, 
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        ))}

        <motion.div 
          key={location.pathname}
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          {/* Glowing background effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 blur-3xl transform scale-110"
            animate={{ 
              scale: [1.1, 1.2, 1.1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Main content container */}
          <div className="relative">
            <Outlet />
          </div>

          {/* Decorative corner accents */}
          <motion.div 
            className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-teal-400/60 rounded-tl-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <motion.div 
            className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-blue-400/60 rounded-br-lg"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AuthLayout;