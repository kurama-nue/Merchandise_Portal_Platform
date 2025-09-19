import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useBreakpoint } from '../utils/responsive';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews?: number;
  discount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  title = "⭐ TRENDING NOW",
  subtitle = "Most loved by our community",
  viewAllLink = "/products"
}) => {
  const { isMobile, isTablet } = useBreakpoint();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Limit products shown based on screen size
  const displayProducts = products.slice(0, isMobile ? 4 : isTablet ? 6 : 8);

  return (
    <motion.section 
      className="py-8 sm:py-12 lg:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4" 
          variants={itemVariants}
        >
          <div>
            <h2 className={`font-black text-gray-900 mb-2 ${
              isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              {title}
            </h2>
            <p className={`text-gray-600 ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>
              {subtitle}
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={viewAllLink}
              className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm sm:text-base group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
        
        <div className={`grid gap-4 sm:gap-6 ${
          isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {displayProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        {isMobile && (
          <motion.div 
            className="mt-8 text-center"
            variants={itemVariants}
          >
            <Link
              to={viewAllLink}
              className="inline-flex items-center px-8 py-3 bg-gray-100 text-gray-900 rounded-full font-bold hover:bg-gray-200 transition-colors gap-2"
            >
              Explore More Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedProducts;