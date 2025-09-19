import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { useBreakpoint } from '../utils/responsive';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

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
  description?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { isMobile } = useBreakpoint();
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.1 
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="group relative"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
              {product.isNew && (
                <span className={`bg-green-500 text-white px-2 py-1 rounded-full font-bold ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>
                  NEW
                </span>
              )}
              {product.isBestseller && (
                <span className={`bg-orange-500 text-white px-2 py-1 rounded-full font-bold ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>
                  BESTSELLER
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className={`bg-red-500 text-white px-2 py-1 rounded-full font-bold ${
                  isMobile ? 'text-xs' : 'text-xs'
                }`}>
                  -{product.discount}%
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex flex-col gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors ${
                  isMobile ? 'w-8 h-8' : 'w-10 h-10'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  // Handle wishlist action
                }}
              >
                <Heart className={`text-gray-600 hover:text-red-500 transition-colors ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`bg-black/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-black transition-colors ${
                  isMobile ? 'w-8 h-8' : 'w-10 h-10'
                }`}
                onClick={handleAddToCart}
              >
                <ShoppingCart className={`text-white ${
                  isMobile ? 'w-4 h-4' : 'w-5 h-5'
                }`} />
              </motion.button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="mb-2">
              <p className={`text-gray-500 uppercase tracking-wide font-medium ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {product.category}
              </p>
            </div>
            
            <h3 className={`font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 ${
              isMobile ? 'text-sm' : 'text-base lg:text-lg'
            }`}>
              {product.name}
            </h3>

            {/* Product Description */}
            {product.description && (
              <p className={`text-gray-600 mb-2 line-clamp-2 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.tags.slice(0, 2).map(tag => (
                  <span 
                    key={tag}
                    className={`bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 2 && (
                  <span className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    +{product.tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2 sm:mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`${
                      i < Math.floor(product.rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    } ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
                  />
                ))}
              </div>
              <span className={`text-gray-600 font-medium ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}>
                {product.rating}
              </span>
              {product.reviews && (
                <span className={`text-gray-400 ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}>
                  ({product.reviews})
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`font-black text-gray-900 ${
                  isMobile ? 'text-lg' : 'text-xl'
                }`}>
                  ₹{product.price}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className={`text-gray-500 line-through ${
                    isMobile ? 'text-sm' : 'text-base'
                  }`}>
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Mobile Add to Cart Button */}
              {isMobile && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;