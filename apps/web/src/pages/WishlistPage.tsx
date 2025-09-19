import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Trash2, Plus, Zap, Gift, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    description?: string;
    category?: string;
    brand?: string;
    rating?: number;
  };
  addedAt: string;
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { addToCart } = useCart();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/wishlist' } });
      return;
    }
    
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API integration
      setTimeout(() => {
        const mockWishlist: WishlistItem[] = [
          {
            id: '1',
            productId: 'p1',
            product: {
              id: 'p1',
              name: 'ArtisianX Premium Hoodie',
              price: 1299,
              images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center'],
              description: 'Ultra-comfortable premium hoodie with iconic designs',
              category: 'Clothing',
              brand: 'ArtisianX',
              rating: 4.8
            },
            addedAt: new Date().toISOString()
          },
          {
            id: '2',
            productId: 'p2',
            product: {
              id: 'p2',
              name: 'Designer Wireless Mouse',
              price: 899,
              images: ['/images/electronics/wireless-mouse.svg'],
              description: 'Ergonomic wireless mouse with premium design',
              category: 'Electronics',
              brand: 'TechSoul',
              rating: 4.6
            },
            addedAt: new Date().toISOString()
          },
          {
            id: '3',
            productId: 'p3',
            product: {
              id: 'p3',
              name: 'Vintage Graphic Tee',
              price: 599,
              images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center'],
              description: 'Classic vintage design tee with premium cotton',
              category: 'Clothing',
              brand: 'ArtisianX',
              rating: 4.7
            },
            addedAt: new Date().toISOString()
          }
        ];
        setWishlistItems(mockWishlist);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load your wishlist. Please try again.',
        type: 'destructive'
      });
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    setRemovingItems(prev => new Set([...prev, itemId]));
    
    try {
      // Simulate API call
      setTimeout(() => {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        
        addToast({
          title: 'Removed from Wishlist',
          description: 'Item has been removed from your wishlist.',
          type: 'success'
        });
      }, 500);
    } catch (error) {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      
      addToast({
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
        type: 'destructive'
      });
    }
  };

  const handleAddToCart = async (product: WishlistItem['product']) => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: 1
      });
      
      addToast({
        title: 'Added to Cart!',
        description: `${product.name} has been added to your cart.`,
        type: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        type: 'destructive'
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
          <p className="text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-5xl font-black text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Heart className="w-12 h-12 text-red-500" />
              Your Wishlist
              <Sparkles className="w-12 h-12 text-pink-500" />
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              {wishlistItems.length > 0 
                ? `${wishlistItems.length} item${wishlistItems.length === 1 ? '' : 's'} saved for later`
                : 'Save your favorite items here!'
              }
            </p>
          </motion.div>

          {/* Empty State */}
          {wishlistItems.length === 0 && (
            <motion.div variants={itemVariants} className="text-center">
              <Card className="bg-white shadow-2xl rounded-2xl overflow-hidden border-0 max-w-md mx-auto">
                <CardContent className="p-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 mb-8">
                    <Heart className="w-12 h-12 text-purple-500" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-4">Your Wishlist is Empty!</h3>
                  <p className="text-gray-600 font-medium mb-8">
                    Discover amazing products and save them for later!
                  </p>
                  <Button
                    onClick={() => navigate('/products')}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Star className="mr-3 h-5 w-5" />
                    START SHOPPING
                    <Zap className="ml-3 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Wishlist Items */}
          {wishlistItems.length > 0 && (
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {wishlistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                      className={`${removingItems.has(item.id) ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Card className="bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden border-0 transition-all duration-300 transform hover:scale-105 group">
                        <div className="relative">
                          {/* Product Image */}
                          <div className="aspect-square bg-gradient-to-br from-purple-50 to-pink-50 p-6">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            disabled={removingItems.has(item.id)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-red-500 text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                          >
                            {removingItems.has(item.id) ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"
                              />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>

                          {/* Rating */}
                          {item.product.rating && (
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-black text-gray-900">
                                {item.product.rating}
                              </span>
                            </div>
                          )}
                        </div>

                        <CardContent className="p-6">
                          <div className="mb-4">
                            <h3 
                              className="text-lg font-black text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors"
                              onClick={() => navigate(`/product/${item.product.id}`)}
                            >
                              {item.product.name}
                            </h3>
                            
                            {item.product.brand && (
                              <p className="text-sm text-gray-600 font-medium mb-2">
                                {item.product.brand}
                              </p>
                            )}
                            
                            {item.product.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {item.product.description}
                              </p>
                            )}
                            
                            <p className="text-2xl font-black text-purple-600">
                              ₹{item.product.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <Button
                              onClick={() => handleAddToCart(item.product)}
                              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              ADD TO CART
                            </Button>
                            
                            <Button
                              onClick={() => navigate(`/product/${item.product.id}`)}
                              variant="outline"
                              className="w-full h-12 border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-700 hover:text-purple-700 font-black rounded-2xl transition-all duration-300"
                            >
                              VIEW DETAILS
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <motion.div variants={itemVariants} className="text-center mt-12">
                <Button
                  onClick={() => navigate('/products')}
                  variant="outline"
                  className="h-14 px-8 border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-700 font-black text-lg rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="mr-3 h-5 w-5" />
                  DISCOVER MORE PRODUCTS
                  <Gift className="ml-3 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WishlistPage;