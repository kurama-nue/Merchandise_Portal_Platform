import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Eye, 
  Star, 
  Grid3X3,
  List,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Camera,
  Zap
} from 'lucide-react';
import { ProductConfigurator3D } from './ProductConfigurator3D';
import { Button } from '../ui/button';

// 3D Card Component with Tilt Effect
const Product3DCard = ({ product, index, onQuickView, onAddToCart, onConfigure }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePosition({ x, y });
    };

    if (isHovered && cardRef.current) {
      cardRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isHovered]);

  const getTransform = () => {
    if (!isHovered || !cardRef.current) return '';
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (mousePosition.y - centerY) / 10;
    const rotateY = (centerX - mousePosition.x) / 10;
    
    return `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? 20 : 0}px)`;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: getTransform(),
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <motion.img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            whileHover={{ scale: 1.05 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/placeholder.jpg';
            }}
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onQuickView(product)}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onConfigure(product)}
                className="p-3 bg-blue-500 backdrop-blur-sm rounded-full shadow-lg hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>
          </div>
          
          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                NEW
              </span>
            )}
            {product.onSale && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                SALE
              </span>
            )}
            {product.isTrending && (
              <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                HOT
              </span>
            )}
          </div>
          
          {/* Quick Action Top Right */}
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </motion.button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500 font-medium">{product.category}</p>
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{product.name}</h3>
            </div>
            <div className="flex items-center gap-1 ml-4">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-700">{product.rating}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          
          {/* Price and Stock */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold text-blue-600">${product.discountPrice}</span>
                  <span className="text-lg text-gray-400 line-through">${product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-xs text-gray-500">
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              variant="cart"
              size="lg"
              className="flex-1"
            >
              <ShoppingBag className="w-5 h-5 inline mr-2" />
              Add to Cart
            </Button>
            
            <Button
              onClick={() => onConfigure(product)}
              variant="outline"
              size="lg"
              className="p-3"
            >
              <Zap className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* 3D Effect Layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ transform: 'translateZ(10px)' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: any) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {categories.map((category: any) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <category.icon className="w-5 h-5 inline mr-2" />
          {category.name}
          <span className="ml-2 text-sm opacity-75">({category.count})</span>
        </motion.button>
      ))}
    </div>
  );
};

// Main Enhanced Product Showcase Component
export const EnhancedProductShowcase = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [configuratorProduct, setConfiguratorProduct] = useState<any>(null);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  // Mock product data with enhanced properties
  const products = [
    {
      id: 1,
      name: "Premium Graphic Tee",
      description: "High-quality organic cotton tee with exclusive artwork",
      price: 29.99,
      discountPrice: null,
      images: ["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"],
      category: "Clothing",
      rating: 4.8,
      reviewCount: 234,
      inStock: true,
      onSale: false,
      isNew: true,
      isTrending: false,
      type: "tshirt"
    },
    {
      id: 2,
      name: "Designer Hoodie",
      description: "Cozy premium hoodie with modern fit and style",
      price: 79.99,
      discountPrice: 59.99,
      images: ["https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80"],
      category: "Clothing",
      rating: 4.9,
      reviewCount: 156,
      inStock: true,
      onSale: true,
      isNew: false,
      isTrending: true,
      type: "hoodie"
    },
    {
      id: 3,
      name: "Smart Wireless Headphones",
      description: "Premium audio experience with noise cancellation",
      price: 299.99,
      discountPrice: null,
      images: ["https://images.unsplash.com/photo-1518441902111-a9a2e7e705a4?auto=format&fit=crop&w=600&q=80"],
      category: "Electronics",
      rating: 4.7,
      reviewCount: 89,
      inStock: true,
      onSale: false,
      isNew: true,
      isTrending: true,
      type: "electronics"
    },
    {
      id: 4,
      name: "Designer Backpack",
      description: "Stylish and functional backpack for everyday use",
      price: 129.99,
      discountPrice: 99.99,
      images: ["https://images.unsplash.com/photo-1520975693411-c6155b310fd1?auto=format&fit=crop&w=600&q=80"],
      category: "Accessories",
      rating: 4.6,
      reviewCount: 178,
      inStock: false,
      onSale: true,
      isNew: false,
      isTrending: false,
      type: "backpack"
    },
    {
      id: 5,
      name: "Premium Coffee Mug",
      description: "Ceramic mug with custom design options",
      price: 24.99,
      discountPrice: null,
      images: ["https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80"],
      category: "Home",
      rating: 4.4,
      reviewCount: 267,
      inStock: true,
      onSale: false,
      isNew: false,
      isTrending: false,
      type: "mug"
    },
    {
      id: 6,
      name: "Smartphone Case",
      description: "Protective case with custom design options",
      price: 39.99,
      discountPrice: null,
      images: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80"],
      category: "Electronics",
      rating: 4.5,
      reviewCount: 145,
      inStock: true,
      onSale: false,
      isNew: true,
      isTrending: false,
      type: "phone-case"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', icon: Grid3X3, count: products.length },
    { id: 'clothing', name: 'Clothing', icon: ShoppingBag, count: products.filter(p => p.category === 'Clothing').length },
    { id: 'electronics', name: 'Electronics', icon: Zap, count: products.filter(p => p.category === 'Electronics').length },
    { id: 'accessories', name: 'Accessories', icon: Camera, count: products.filter(p => p.category === 'Accessories').length },
    { id: 'home', name: 'Home', icon: Heart, count: products.filter(p => p.category === 'Home').length },
  ];

  useEffect(() => {
    let filtered = products;
    
    if (selectedCategory !== 'all') {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name;
      filtered = products.filter(p => p.category === categoryName);
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - prioritize trending, new, on sale
        filtered.sort((a, b) => {
          const aScore = (a.isTrending ? 3 : 0) + (a.isNew ? 2 : 0) + (a.onSale ? 1 : 0);
          const bScore = (b.isTrending ? 3 : 0) + (b.isNew ? 2 : 0) + (b.onSale ? 1 : 0);
          return bScore - aScore;
        });
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy]);

  const handleAddToCart = (product: any) => {
    console.log('Adding to cart:', product);
    // Integration with actual cart store would go here
    // For now, just showing a placeholder
  };

  const handleQuickView = (product: any) => {
    console.log('Quick view product:', product);
    // Add quick view logic here
  };

  const handleConfigure = (product: any) => {
    setConfiguratorProduct(product);
  };

  const handleSaveConfiguration = (config: any) => {
    console.log('Saving configuration:', config);
    setConfiguratorProduct(null);
    // Add your save configuration logic here
  };

  return (
    <motion.section
      ref={containerRef}
      style={{ opacity }}
      className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 mb-6">
            Discover Premium
            <br />
            <span className="text-4xl md:text-5xl">Merchandise Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore our curated selection of high-quality products with cutting-edge 3D visualization and customization options
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{products.length}+</div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">4.7★</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">24h</div>
              <div className="text-sm text-gray-500">Delivery</div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12"
        >
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          {/* View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          style={{ y }}
          className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence mode="wait">
            {filteredProducts.map((product, index) => (
              <Product3DCard
                key={product.id}
                product={product}
                index={index}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
                onConfigure={handleConfigure}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              View All Products
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* 3D Product Configurator Modal */}
      <ProductConfigurator3D
        product={configuratorProduct}
        isOpen={!!configuratorProduct}
        onClose={() => setConfiguratorProduct(null)}
        onSave={handleSaveConfiguration}
      />
    </motion.section>
  );
};

export default EnhancedProductShowcase;
