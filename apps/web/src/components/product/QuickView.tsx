import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Share2, ShoppingCart, Maximize2, Star, Plus, Minus, Zap, Eye, Tag } from 'lucide-react';
import { Product } from '../../types/product';
import { useToast } from '../../contexts/ToastContext';
import useWishlistStore from '../../stores/wishlistStore';
import useCartStore from '../../stores/cartStore';
import { Button } from '../../components/ui/button';
import { SizeGuide } from './SizeGuide';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickView = ({ product, isOpen, onClose }: QuickViewProps) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToast } = useToast();
  const addToWishlist = useWishlistStore((state: { addItem: (product: Product) => void }) => state.addItem);
  const addToCart = useCartStore((state: { addItem: (item: any) => void }) => state.addItem);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab') {
        // basic focus trap: keep focus inside modal
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    // focus the dialog
    setTimeout(() => dialogRef.current?.focus(), 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize && product.hasSize) {
      addToast({
        title: 'Please select a size',
        description: 'Choose a size to continue.',
        type: 'destructive',
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice || null,
      image: product.images && product.images.length > 0 ? product.images[0] : '',
      quantity: quantity,
      size: selectedSize
    });
    
    addToast({
      title: '🛒 Added to cart!',
      description: `${product.name} (${quantity}x) added successfully!`,
      type: 'success',
    });
    
    onClose();
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    setIsWishlisted(!isWishlisted);
    addToWishlist(product);
    addToast({
      title: '💖 Added to wishlist!',
      description: `${product.name} saved to your favorites!`,
      type: 'success',
    });
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
      addToast({
        title: '📤 Shared successfully!',
        description: 'Product link shared with friends!',
        type: 'success',
      });
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: '🔗 Link copied!',
        description: 'Product link copied to clipboard!',
        type: 'success',
      });
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const discount = product?.discountPrice 
    ? Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)
    : 0;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
            ref={dialogRef}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Eye className="w-6 h-6" />
                  </motion.div>
                  <h2 className="text-2xl font-black">Quick View</h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 overflow-y-auto max-h-[calc(95vh-100px)]">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden group">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                      target.onerror = null;
                    }}
                  />
                  
                  {discount > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: -12 }}
                      className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-xl font-black text-sm shadow-lg"
                    >
                      {discount}% OFF
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(product.images[selectedImage], '_blank')}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-2xl flex items-center justify-center shadow-lg transition-all"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.images.map((img: string, index: number) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? 'border-purple-500 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                            target.onerror = null;
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Product Basic Info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-xl text-sm font-bold">
                      {product.category}
                    </span>
                    <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-xl text-sm font-bold">
                      <Tag className="w-3 h-3 inline mr-1" />
                      {product.brand || 'ArtisianX'}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-black text-gray-900 mb-3">
                    {product.name}
                  </h1>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.discountPrice.toFixed(2)}
                      </span>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-xl text-sm font-bold">
                        Save ${(product.discountPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Size Selection */}
                {product.hasSize && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-black text-gray-900">Size</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-bold underline"
                      >
                        📏 Size Guide
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <motion.button
                          key={size}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 rounded-xl border-2 font-bold transition-all ${
                            selectedSize === size
                              ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md'
                              : 'border-gray-200 hover:border-purple-300 text-gray-700'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </motion.button>
                      
                      <span className="mx-6 text-xl font-black text-gray-900 min-w-[3rem] text-center">
                        {quantity}
                      </span>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-6 border-t-2 border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleAddToWishlist}
                        variant="outline"
                        className={`w-full h-14 border-2 font-black rounded-2xl transition-all duration-300 ${
                          isWishlisted
                            ? 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100'
                            : 'border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-700'
                        }`}
                      >
                        <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                        {isWishlisted ? 'WISHLISTED' : 'WISHLIST'}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleAddToCart}
                        className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        ADD TO CART
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-700 hover:text-purple-800 font-black rounded-2xl transition-all duration-300"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      BUY NOW
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Size Guide Modal */}
          <SizeGuide
            isOpen={isSizeGuideOpen}
            onClose={() => setSizeGuideOpen(false)}
            category={product.category}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickView;
