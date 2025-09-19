import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Tag, Shield, Truck, Heart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Official Marvel Iron Man T-Shirt',
      price: 899,
      originalPrice: 1299,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&crop=center',
      size: 'L',
      color: 'Red',
      quantity: 2,
      stock: 10
    },
    {
      id: '2', 
      name: 'Anime Collection Hoodie',
      price: 1599,
      originalPrice: 2199,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&crop=center',
      size: 'M',
      color: 'Black',
      quantity: 1,
      stock: 5
    },
    {
      id: '3',
      name: 'Gaming Mouse Wireless',
      price: 2499,
      image: '/images/electronics/wireless-mouse.svg',
      size: 'Standard',
      color: 'Black',
      quantity: 1,
      stock: 15
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === 'save10') {
        setAppliedPromo('SAVE10');
      } else if (promoCode.toLowerCase() === 'first20') {
        setAppliedPromo('FIRST20');
      }
      setIsLoading(false);
    }, 1000);
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo === 'SAVE10' ? subtotal * 0.1 : 
                  appliedPromo === 'FIRST20' ? subtotal * 0.2 : 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Review your items and proceed to checkout
            </p>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center px-6 py-3 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Items in your cart
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl bg-gray-100"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Size: <span className="font-medium">{item.size}</span>
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            Color: <span className="font-medium">{item.color}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl font-black text-gray-900 dark:text-white">
                              ₹{item.price}
                            </span>
                            {item.originalPrice && (
                              <span className="text-lg text-gray-500 line-through ml-2">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        
                        {item.stock <= 5 && (
                          <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                            Only {item.stock} left in stock!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Promo Code
                </label>
                {!appliedPromo ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={applyPromoCode}
                      disabled={!promoCode || isLoading}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {appliedPromo} Applied
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Order Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({appliedPromo})</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                
                {subtotal < 999 && (
                  <div className="text-sm text-orange-600 dark:text-orange-400">
                    Add ₹{999 - subtotal} more for free shipping
                  </div>
                )}
                
                <hr className="border-gray-200 dark:border-gray-700" />
                
                <div className="flex justify-between text-xl font-black text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-2 text-blue-500" />
                  <span>Free delivery on orders above ₹999</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  <span>30 days easy returns</span>
                </div>
              </div>
              
              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg text-center hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 block"
              >
                Proceed to Checkout
              </Link>
              
              <Link
                to="/products"
                className="w-full text-center block mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;