import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react';

interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  buttonText?: string;
  buttonAction?: () => void;
  backgroundColor?: string;
  textColor?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  height?: string;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showArrows = true,
  height = 'h-96',
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) =>
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`relative ${height} overflow-hidden rounded-2xl shadow-2xl ${className}`}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              goToNext();
            } else if (swipe > swipeConfidenceThreshold) {
              goToPrevious();
            }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="w-full h-full flex items-center justify-center relative"
            style={{
              backgroundColor: items[currentIndex].backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${items[currentIndex].image})`,
                filter: 'brightness(0.7)'
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-pink-900/80" />
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                {items[currentIndex].subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex items-center justify-center gap-2 mb-4"
                  >
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="text-lg font-bold text-yellow-200">
                      {items[currentIndex].subtitle}
                    </span>
                    <Star className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                )}
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                  style={{ color: items[currentIndex].textColor || '#ffffff' }}
                >
                  {items[currentIndex].title}
                </motion.h1>
                
                {items[currentIndex].description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-xl md:text-2xl text-gray-200 mb-8 font-medium max-w-2xl mx-auto"
                  >
                    {items[currentIndex].description}
                  </motion.p>
                )}
                
                {items[currentIndex].buttonText && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <button
                      onClick={items[currentIndex].buttonAction}
                      className="h-16 px-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-110 flex items-center"
                    >
                      <Zap className="mr-3 h-6 w-6" />
                      {items[currentIndex].buttonText}
                      <Star className="ml-3 h-6 w-6" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/20 rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-pink-400/30 rounded-full animate-bounce" />
            <div className="absolute top-1/2 right-20 w-12 h-12 border-4 border-purple-400/30 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-20"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentIndex
                  ? 'bg-white shadow-lg scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  );
};

export default Carousel;