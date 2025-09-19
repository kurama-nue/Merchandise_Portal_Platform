import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Star, 
  ChevronRight, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Plus,
  Minus,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { allProducts, Product } from "../data/products";
import { useCart } from "../contexts/CartContext";

function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  // Load product data from the actual products database
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const foundProduct = allProducts.find(p => p.id === productId);
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    // Add to cart with selected options
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    });
    
    toast.success('Added to cart!', {
      description: `${product.name}${selectedSize ? ` (${selectedSize})` : ''}${selectedColor ? ` in ${selectedColor}` : ''} has been added to your cart.`,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) { // Set a reasonable max limit
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product not found</h1>
          <Link
            to="/products"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-purple-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-purple-600">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to={`/category/${product.category}`} className="text-gray-500 hover:text-purple-600">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </span>
                )}
                {product.isBestseller && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    BESTSELLER
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnail Images - Single image for now */}
            <div className="grid grid-cols-1 gap-2">
              <div className="relative rounded-lg overflow-hidden border-2 border-purple-600">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-20 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-gray-900 dark:text-white">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-600 text-sm font-bold px-3 py-1 rounded-full">
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Size</h3>
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 px-4 text-sm font-bold rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-purple-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-sm text-red-500 mt-2">Please select a size</p>
                )}
              </div>
            )}

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Color: {selectedColor && <span className="font-normal">{selectedColor}</span>}
              </h3>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 relative ${
                      selectedColor === color
                        ? 'border-purple-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {!selectedColor && (
                <p className="text-sm text-red-500 mt-2">Please select a color</p>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              {/* Quantity */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 10}
                      className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">
                    In Stock
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleWishlist}
                  className={`p-4 rounded-xl border-2 transition-colors ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-purple-600'
                  }`}
                >
                  <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
                </button>
                
                <button className="p-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl hover:border-purple-600 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Product Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping & Returns */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Free Shipping</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">On orders above ₹999</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Easy Returns</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">30 days return policy</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-500" />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">Secure Payment</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">100% secure checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'reviews', label: `Reviews (${product.reviews})` },
                  { id: 'shipping', label: 'Shipping & Returns' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-4 px-6 text-center font-bold transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-purple-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Description</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    {product.description || 'No description available for this product.'}
                  </p>
                  
                  {product.features && product.features.length > 0 && (
                    <>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Features & Benefits</h4>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {product.material && (
                    <>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6">Material</h4>
                      <p className="text-gray-700 dark:text-gray-300">{product.material}</p>
                    </>
                  )}
                  
                  {product.care && product.care.length > 0 && (
                    <>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6">Care Instructions</h4>
                      <ul className="space-y-1">
                        {product.care.map((instruction, index) => (
                          <li key={index} className="text-gray-700 dark:text-gray-300">• {instruction}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customer Reviews</h3>
                  
                  {/* Review Summary */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-black text-gray-900 dark:text-white">{product.rating}</div>
                        <div className="flex justify-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={20}
                              className={i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Based on {product.reviews} reviews
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map(star => (
                          <div key={star} className="flex items-center gap-3 mb-2">
                            <span className="text-sm w-8">{star}★</span>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${(star <= product.rating ? 80 : 20)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300 w-12">
                              {Math.floor(product.reviews * (star <= product.rating ? 0.6 : 0.1))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="space-y-6">
                    {[
                      { name: 'Arjun K.', rating: 5, comment: 'Amazing quality! The print is vibrant and the fabric feels premium. Highly recommended!', date: '2 days ago' },
                      { name: 'Priya S.', rating: 4, comment: 'Great t-shirt, good fit. Only wish there were more color options available.', date: '1 week ago' },
                      { name: 'Raj M.', rating: 5, comment: 'Perfect for Marvel fans! The design is exactly as shown and delivery was quick.', date: '2 weeks ago' }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 dark:text-white">{review.name}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={i < review.rating 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shipping & Returns</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipping Information</h4>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Free shipping on orders above ₹999
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Standard delivery: 3-5 business days
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Express delivery: 1-2 business days (₹99)
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Cash on delivery available
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Return Policy</h4>
                      <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          30 days easy returns
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Free return pickup
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Full refund on return
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          Size exchange available
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the ProductDetailPage component
export default ProductDetailPage;
