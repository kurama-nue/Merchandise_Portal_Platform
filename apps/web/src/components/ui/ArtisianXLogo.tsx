import { motion } from 'framer-motion';

interface ArtisianXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const ArtisianXLogo = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  animate = true 
}: ArtisianXLogoProps) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl' }
  };

  const logoVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      rotate: -10 
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, -2, 2, 0],
      transition: {
        duration: 0.3
      }
    }
  };

  const textVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className={`flex items-center gap-3 ${className}`}
      initial={animate ? "initial" : undefined}
      animate={animate ? "animate" : undefined}
      whileHover={animate ? "hover" : undefined}
      variants={logoVariants}
    >
      {/* Logo Icon */}
      <motion.div 
        className={`${sizeClasses[size].icon} relative flex items-center justify-center`}
        variants={logoVariants}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle with Gradient */}
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>

            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {/* Main Circle Background */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#bgGradient)"
            filter="url(#shadow)"
          />
          
          {/* Artisan 'A' Symbol - Creative Brush Stroke */}
          <path
            d="M25 65 L35 30 L42 30 L52 65 M30 50 L47 50"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Creative 'X' Symbol - Crossed Tools */}
          <path
            d="M55 35 L75 55 M75 35 L55 55"
            stroke="url(#accentGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Decorative Dots */}
          <circle cx="30" cy="70" r="2" fill="white" opacity="0.8" />
          <circle cx="70" cy="70" r="2" fill="white" opacity="0.8" />
          <circle cx="50" cy="75" r="1.5" fill="url(#accentGradient)" />
          
          {/* Inner Ring */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.3"
          />
        </svg>
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          variants={textVariants}
        >
          <span className={`font-black text-gray-900 ${sizeClasses[size].text} leading-tight`}>
            ArtisianX
          </span>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider -mt-1">
            Artisan Crafted
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ArtisianXLogo;