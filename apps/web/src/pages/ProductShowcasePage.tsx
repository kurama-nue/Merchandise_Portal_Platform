import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Share2, 
  ChevronRight,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Eye,
  Plus,
  Minus,
  Grid3X3,
  Filter
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import useCartStore from '../stores/cartStore';
import { toast } from 'sonner';

// Mock product data with high-quality image URLs
const productCategories = {
  fashion: {
    name: 'Fashion & Apparel',
    icon: '👕',
    products: [
      {
        id: 'fashion-001',
        name: 'Premium Cotton T-Shirt',
        brand: 'StyleCraft',
        price: 29.99,
        originalPrice: 39.99,
        rating: 4.8,
        reviewCount: 124,
        colors: ['#000000', '#FFFFFF', '#1E40AF', '#EF4444', '#10B981'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800',
          'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800',
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800'
        ],
        description: 'Crafted from 100% organic cotton, this premium t-shirt offers unmatched comfort and durability. Perfect for everyday wear with a classic fit that flatters all body types.',
        features: ['100% Organic Cotton', 'Pre-shrunk', 'Reinforced Seams', 'Machine Washable'],
        inStock: true,
        stockCount: 45,
        badge: 'Bestseller'
      },
      {
        id: 'fashion-002',
        name: 'Designer Denim Jacket',
        brand: 'UrbanVibe',
        price: 89.99,
        originalPrice: 120.00,
        rating: 4.6,
        reviewCount: 89,
        colors: ['#4A5568', '#2D3748', '#1A202C'],
        sizes: ['S', 'M', 'L', 'XL'],
        images: [
          'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800',
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
          'https://images.unsplash.com/photo-1564584217132-2271339fa2ca?w=800'
        ],
        description: 'Classic denim jacket with a modern twist. Features distressed detailing and a comfortable relaxed fit perfect for layering.',
        features: ['Premium Denim', 'Distressed Details', 'Metal Hardware', 'Relaxed Fit'],
        inStock: true,
        stockCount: 23,
        badge: 'Limited Edition'
      }
    ]
  },
  electronics: {
    name: 'Electronics & Tech',
    icon: '📱',
    products: [
      {
        id: 'tech-001',
        name: 'Wireless Bluetooth Headphones',
        brand: 'SoundMax Pro',
        price: 149.99,
        originalPrice: 199.99,
        rating: 4.9,
        reviewCount: 256,
        colors: ['#000000', '#FFFFFF', '#DC2626'],
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'
        ],
        description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience studio-quality sound with deep bass and crystal-clear highs.',
        features: ['Active Noise Cancellation', '30hr Battery Life', 'Quick Charge', 'Premium Drivers'],
        inStock: true,
        stockCount: 78,
        badge: 'Editor\'s Choice'
      }
    ]
  },
  home: {
    name: 'Home & Lifestyle',
    icon: '🏠',
    products: [
      {
        id: 'home-001',
        name: 'Minimalist Table Lamp',
        brand: 'LightCraft',
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.7,
        reviewCount: 134,
        colors: ['#F7FAFC', '#EDF2F7', '#2D3748'],
        images: [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
        ],
        description: 'Sleek minimalist design meets functionality. This modern table lamp features adjustable brightness and wireless charging base.',
        features: ['Wireless Charging Base', 'Adjustable Brightness', 'Touch Controls', 'Energy Efficient LED'],
        inStock: true,
        stockCount: 34,
        badge: 'New Arrival'
      }
    ]
  }
};

const ProductShowcasePage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(category || 'fashion');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCartStore();

  useEffect(() => {
    if (selectedCategory && productCategories[selectedCategory as keyof typeof productCategories]) {
      const categoryData = productCategories[selectedCategory as keyof typeof productCategories];
      setSelectedProduct(categoryData.products[0]);
      setSelectedColor(categoryData.products[0].colors[0]);
      // Only set size if the product has sizes
      const firstProduct = categoryData.products[0] as any;
      setSelectedSize(firstProduct.sizes?.[0] || '');
    }
  }, [selectedCategory]);

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    addItem({
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      discountPrice: selectedProduct.originalPrice !== selectedProduct.price ? selectedProduct.originalPrice : null,
      image: selectedProduct.images[0]
    });

    toast.success("Added to cart!", {
      description: `${selectedProduct.name} has been added to your cart.`,
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const ProductGallery = ({ product }: { product: any }) => (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div 
        className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group cursor-zoom-in"
        onClick={() => setShowZoom(true)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <motion.div 
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <div className="bg-white/90 rounded-full p-3">
            <Eye className="w-6 h-6" />
          </div>
        </motion.div>
        
        {product.badge && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {product.badge}
          </div>
        )}
      </motion.div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {product.images.map((image: string, index: number) => (
          <motion.button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              currentImageIndex === index ? 'border-teal-500 ring-2 ring-teal-200' : 'border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={image} alt="" className="w-full h-full object-cover" />
          </motion.button>
        ))}
      </div>
    </div>
  );

  const ProductInfo = ({ product }: { product: any }) => (
    <div className="space-y-6">
      {/* Title and Rating */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{product.brand}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-gray-900">${product.price}</span>
        {product.originalPrice > product.price && (
          <>
            <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`font-medium ${product.inStock ? 'text-green-700' : 'text-red-700'}`}>
          {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
        </span>
      </div>

      {/* Color Selection */}
      {product.colors && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Color</h3>
          <div className="flex gap-3">
            {product.colors.map((color: string) => (
              <motion.button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {product.sizes && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-6 gap-2">
            {product.sizes.map((size: string) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className="h-12"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              disabled={quantity >= product.stockCount}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <Button
            onClick={handleAddToCart}
            variant="cart"
            size="lg"
            className="flex-1"
            disabled={!product.inStock}
            glow
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsWishlist(!isWishlist)}
            className={isWishlist ? 'text-red-500 border-red-500' : ''}
          >
            <Heart className={`w-5 h-5 ${isWishlist ? 'fill-current' : ''}`} />
          </Button>
          
          <Button variant="outline" size="lg">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        <Button variant="gradient-blue" size="lg" className="w-full">
          Buy Now
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-600">Secure Payment</span>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-blue-600" />
          <span className="text-sm text-gray-600">Free Shipping</span>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-gray-600">Easy Returns</span>
        </div>
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-orange-600" />
          <span className="text-sm text-gray-600">Quality Guarantee</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/showcase" className="text-gray-500 hover:text-gray-700">Products</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">{productCategories[selectedCategory as keyof typeof productCategories]?.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Product Showcase</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            {Object.entries(productCategories).map(([key, category]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(key)}
                className="flex items-center gap-2"
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Product Display */}
        {selectedProduct && (
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <ProductGallery product={selectedProduct} />
            <ProductInfo product={selectedProduct} />
          </div>
        )}

        {/* Product Details Tabs */}
        {selectedProduct && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-600 text-lg mb-6">{selectedProduct.description}</p>
                  <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedProduct.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Product Details</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Brand:</dt>
                        <dd className="font-medium">{selectedProduct.brand}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Model:</dt>
                        <dd className="font-medium">{selectedProduct.id}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Colors Available:</dt>
                        <dd className="font-medium">{selectedProduct.colors?.length || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button variant="outline">Write a Review</Button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{selectedProduct.rating}</div>
                      <div className="flex justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-2">Based on {selectedProduct.reviewCount} reviews</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Shipping Information</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Free standard shipping on orders over $50</li>
                      <li>• Express shipping available for $9.99</li>
                      <li>• International shipping to select countries</li>
                      <li>• Estimated delivery: 3-7 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Return Policy</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 30-day return window</li>
                      <li>• Free returns on all orders</li>
                      <li>• Items must be in original condition</li>
                      <li>• Refunds processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(productCategories).flatMap(category => category.products).slice(0, 4).map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                whileHover={{ y: -4 }}
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">${product.price}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showZoom && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowZoom(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-4xl max-h-full"
            >
              <img
                src={selectedProduct.images[currentImageIndex]}
                alt={selectedProduct.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductShowcasePage;
