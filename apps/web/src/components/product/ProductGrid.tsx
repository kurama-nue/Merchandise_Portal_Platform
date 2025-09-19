import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../ui/button';
import useCartStore from '../../stores/cartStore';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors?: string[];
  inStock: boolean;
  badge?: string;
  category: string;
}

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
  showFilters?: boolean;
}

const ProductGrid = ({ products, viewMode = 'grid', showFilters = true }: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addItem } = useCartStore();

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Assume products with badges are newer
        filtered.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, priceRange, selectedBrands, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      discountPrice: product.originalPrice || null,
      image: product.images[0]
    });

    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
        viewMode === 'list' ? 'flex' : ''
      }`}
      whileHover={{ y: -8 }}
    >
      {/* Product Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 ${
        viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'
      }`}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
            {product.badge}
          </div>
        )}

        {/* Discount Badge */}
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 z-10">
          <Heart className="w-5 h-5" />
        </button>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <div className="w-full flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/95 hover:bg-white text-gray-900 border-none font-black rounded-2xl"
              asChild
            >
              <Link to={`/products/${product.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                QUICK VIEW
              </Link>
            </Button>
            
            <Button
              onClick={() => handleAddToCart(product)}
              size="sm"
              disabled={!product.inStock}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              ADD TO CART
            </Button>
          </div>
        </div>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
            <span className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black">
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <span className="text-sm font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full mb-2 inline-block">
              {product.brand}
            </span>
            <h3 className="font-black text-gray-900 line-clamp-2 text-lg group-hover:text-purple-600 transition-colors">
              {product.name}
            </h3>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">({product.reviewCount})</span>
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mb-4">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center text-xs font-bold">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-purple-600">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through font-medium">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <Button
          onClick={() => handleAddToCart(product)}
          disabled={!product.inStock}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
        </Button>
      </div>
    </motion.div>
  );

  const FilterSidebar = () => {
    const brands = [...new Set(products.map(p => p.brand))];

    return (
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Brands */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Brands</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedBrands([...selectedBrands, brand]);
                    } else {
                      setSelectedBrands(selectedBrands.filter(b => b !== brand));
                    }
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery('');
            setPriceRange([0, 500]);
            setSelectedBrands([]);
            setSortBy('featured');
          }}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-gray-600">
            {filteredProducts.length} products found
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <>
            {/* Desktop Filters */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                <FilterSidebar />
              </div>
            </div>

            {/* Mobile Filters */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg:hidden fixed inset-0 bg-black/50 z-50"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <motion.div
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    className="bg-white w-80 h-full p-6 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-gray-900">Filters</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <FilterSidebar />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
