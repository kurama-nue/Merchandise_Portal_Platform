import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Product } from '../../types/product';
import { Button } from '../ui/button';
import { ShoppingCart, Eye, Heart, Star, Zap } from 'lucide-react';

interface Props {
  product: Product;
  index?: number;
  onQuickView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}


const ProductCard = ({ product, index = 0, onQuickView, onAddToCart }: Props) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className={cn(
        "block group",
        !product.inStock && "pointer-events-none opacity-70"
      )}
      tabIndex={0}
      aria-label={`View details for ${product.name}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full overflow-hidden border-0",
          !product.inStock && "opacity-70"
        )}
      >
        <div className="relative aspect-square bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden group">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; (e.target as HTMLImageElement).onerror = null; }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 font-medium">
              No image available
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => { e.preventDefault(); /* Add to wishlist logic */ }}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-black shadow-lg">
              {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            <div className="w-full flex gap-2">
              <Button
                onClick={e => { e.preventDefault(); onQuickView(product); }}
                variant="outline"
                size="sm"
                className="flex-1 bg-white/95 hover:bg-white text-gray-900 border-none font-black rounded-2xl h-12"
              >
                <Eye className="w-4 h-4 mr-2" />
                QUICK VIEW
              </Button>
              <Button
                onClick={e => { e.preventDefault(); onAddToCart(product); }}
                size="sm"
                disabled={!product.inStock}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl h-12 shadow-lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                {product.category || 'General'}
              </span>
              {product.brand && (
                <span className="text-sm font-medium text-gray-600">
                  {product.brand}
                </span>
              )}
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2 font-medium">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {product.discountPrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-purple-600">
                    ₹{product.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through font-medium">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-black text-purple-600">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
            
            {product.inStock ? (
              <div className="flex items-center gap-1 text-green-600 font-bold">
                <Zap className="w-4 h-4" />
                <span className="text-sm">In Stock</span>
              </div>
            ) : (
              <span className="text-sm text-red-600 font-bold">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={e => { e.preventDefault(); onAddToCart(product); }}
            disabled={!product.inStock}
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
          </Button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
