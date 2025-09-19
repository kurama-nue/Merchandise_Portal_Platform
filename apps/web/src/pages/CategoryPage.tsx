import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  Heart, 
  ShoppingBag, 
  Star, 
  ArrowUpDown
} from 'lucide-react';
import { allProducts, getProductsByCategory, Product } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

interface FilterOptions {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRanges: { label: string; min: number; max: number }[];
}

const CategoryPage = () => {
  const { category } = useParams();
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  
  const filterOptions: FilterOptions = {
    categories: ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Sneakers', 'Accessories'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Pink', 'Grey', 'Navy'],
    priceRanges: [
      { label: 'Under ₹500', min: 0, max: 500 },
      { label: '₹500 - ₹1000', min: 500, max: 1000 },
      { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
      { label: '₹2000 - ₹3000', min: 2000, max: 3000 },
      { label: 'Above ₹3000', min: 3000, max: 999999 }
    ]
  };

  // Load products
  useEffect(() => {
    // Get all products or filter by category if specified
    const categoryProducts = category && category !== 'all' 
      ? getProductsByCategory(category)
      : allProducts;
    
    setProducts(categoryProducts);
    setLoading(false);
  }, [category]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Category filter - now using subcategory for more specific filtering
    if (category && category !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase() ||
        product.subcategory.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = filterOptions.priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product =>
          product.price >= range.min && product.price <= range.max
        );
      }
    }

    // Sort products
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
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - bestsellers first, then new, then by rating
        filtered.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return b.rating - a.rating;
        });
    }

    setFilteredProducts(filtered);
  }, [products, category, selectedSizes, selectedColors, selectedPriceRange, sortBy]);

  const toggleFilter = (type: 'size' | 'color', value: string) => {
    if (type === 'size') {
      setSelectedSizes(prev =>
        prev.includes(value)
          ? prev.filter(s => s !== value)
          : [...prev, value]
      );
    } else if (type === 'color') {
      setSelectedColors(prev =>
        prev.includes(value)
          ? prev.filter(c => c !== value)
          : [...prev, value]
      );
    }
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPriceRange('');
    setSortBy('featured');
  };

  const activeFiltersCount = selectedSizes.length + selectedColors.length + (selectedPriceRange ? 1 : 0);

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: product.colors[0], // Default to first color
      size: product.sizes?.[0] // Default to first size if available
    });
    
    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`
    });
  };

  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    : 'All Products';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                {categoryTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {filteredProducts.length} products found
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium lg:hidden"
              >
                <Filter size={16} />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Size</h3>
                <div className="grid grid-cols-3 gap-2">
                  {filterOptions.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => toggleFilter('size', size)}
                      className={`py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:border-purple-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Color</h3>
                <div className="grid grid-cols-5 gap-2">
                  {filterOptions.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => toggleFilter('color', color)}
                      className={`w-10 h-10 rounded-full border-2 relative ${
                        selectedColors.includes(color)
                          ? 'border-purple-600'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColors.includes(color) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Price Range</h3>
                <div className="space-y-2">
                  {filterOptions.priceRanges.map(range => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range.label}
                        checked={selectedPriceRange === range.label}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="mr-3 text-purple-600"
                      />
                      <span className="text-gray-700 dark:text-gray-300">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">No products found</div>
                <button
                  onClick={clearAllFilters}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
              }>
                {filteredProducts.map(product => (
                  <Link 
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 block ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full object-cover bg-gray-100 ${
                          viewMode === 'list' ? 'h-48' : 'h-64'
                        }`}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            BESTSELLER
                          </span>
                        )}
                        {product.originalPrice && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Handle wishlist
                            toast.info('Wishlist feature coming soon!');
                          }}
                          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        >
                          <Heart size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-2">
                        <span className="text-purple-600 text-sm font-medium">
                          {product.subcategory}
                        </span>
                      </div>
                      
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Product Description */}
                      {product.description && (
                        <p className={`text-gray-600 dark:text-gray-300 text-sm mb-3 ${
                          viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2'
                        }`}>
                          {product.description}
                        </p>
                      )}
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      
                      {/* Tags */}
                      {product.tags && product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.tags.slice(0, 3).map(tag => (
                            <span 
                              key={tag}
                              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {product.tags.length > 3 && (
                            <span className="text-gray-500 text-xs">+{product.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl font-black text-gray-900 dark:text-white">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through ml-2">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        
                        {product.originalPrice && (
                          <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded">
                            Save ₹{product.originalPrice - product.price}
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => handleAddToCart(product, e)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 flex items-center justify-center"
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
