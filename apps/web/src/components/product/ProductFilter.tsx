import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Search, Star, Zap, Tag, Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

interface FilterProps {
  categories: string[];
  brands: string[];
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  onSale: boolean;
  rating: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

const initialFilters: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 5000],
  inStock: false,
  onSale: false,
  rating: 0,
  searchQuery: '',
  sortBy: 'featured',
};

export const ProductFilter = ({
  categories,
  brands,
  onFilterChange,
  className = '',
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    onFilterChange(initialFilters);
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.inStock ? 1 : 0) + 
    (filters.onSale ? 1 : 0) + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.searchQuery ? 1 : 0) +
    (filters.priceRange[1] < 5000 ? 1 : 0);

  const FilterSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

  return (
    <div className={className}>
      {/* Filter Trigger Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mb-6"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="relative w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Filter className="w-5 h-5" />
          </motion.div>
          <span>FILTERS & SORT</span>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-white"
            >
              {activeFilterCount}
            </motion.div>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full h-10 border-2 border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 font-bold rounded-xl transition-all duration-300"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </motion.div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Filter className="w-6 h-6" />
                    </motion.div>
                    Filters & Sort
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-2xl flex items-center justify-center transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center gap-2 text-white/90"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="font-bold">{activeFilterCount} filters active</span>
                  </motion.div>
                )}
              </div>

              {/* Filter Content */}
              <div className="p-6 space-y-8 overflow-y-auto h-[calc(100vh-200px)]">
                {/* Search */}
                <FilterSection
                  title="Search Products"
                  icon={<Search className="w-5 h-5 text-purple-600" />}
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search for products..."
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                      className="pl-12 h-12 bg-gray-50 border-2 border-gray-200 focus:border-purple-500 rounded-2xl font-medium text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </FilterSection>

                {/* Sort By */}
                <FilterSection
                  title="Sort By"
                  icon={<Star className="w-5 h-5 text-yellow-500" />}
                >
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                    className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 focus:border-purple-500 rounded-2xl font-medium text-gray-900 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">🔥 Featured</option>
                    <option value="newest">✨ Newest First</option>
                    <option value="price-low">💰 Price: Low to High</option>
                    <option value="price-high">💎 Price: High to Low</option>
                    <option value="rating">⭐ Highest Rated</option>
                  </select>
                </FilterSection>

                {/* Categories */}
                {categories.length > 0 && (
                  <FilterSection
                    title="Categories"
                    icon={<Tag className="w-5 h-5 text-purple-600" />}
                  >
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <motion.label
                          key={category}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-purple-50 transition-all duration-300"
                        >
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...filters.categories, category]
                                : filters.categories.filter(c => c !== category);
                              handleFilterChange({ categories: newCategories });
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all ${
                            filters.categories.includes(category)
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-300 group-hover:border-purple-400'
                          }`}>
                            {filters.categories.includes(category) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </motion.svg>
                            )}
                          </div>
                          <span className="font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
                            {category}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Brands */}
                {brands.length > 0 && (
                  <FilterSection
                    title="Brands"
                    icon={<Heart className="w-5 h-5 text-pink-500" />}
                  >
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {brands.map((brand) => (
                        <motion.label
                          key={brand}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-pink-50 transition-all duration-300"
                        >
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand)}
                            onChange={(e) => {
                              const newBrands = e.target.checked
                                ? [...filters.brands, brand]
                                : filters.brands.filter(b => b !== brand);
                              handleFilterChange({ brands: newBrands });
                            }}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all ${
                            filters.brands.includes(brand)
                              ? 'bg-pink-600 border-pink-600'
                              : 'border-gray-300 group-hover:border-pink-400'
                          }`}>
                            {filters.brands.includes(brand) && (
                              <motion.svg
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-3 h-3 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </motion.svg>
                            )}
                          </div>
                          <span className="font-bold text-gray-700 group-hover:text-pink-600 transition-colors">
                            {brand}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </FilterSection>
                )}

                {/* Price Range */}
                <FilterSection
                  title="Price Range"
                  icon={<span className="text-green-600 font-black text-lg">₹</span>}
                >
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange({ priceRange: [0, parseInt(e.target.value)] })}
                      className="w-full h-3 bg-gray-200 rounded-2xl appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #9333ea 0%, #9333ea ${(filters.priceRange[1] / 5000) * 100}%, #e5e7eb ${(filters.priceRange[1] / 5000) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-600">₹0</span>
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-black">
                        ₹{filters.priceRange[1].toLocaleString()}
                      </div>
                    </div>
                  </div>
                </FilterSection>

                {/* Rating */}
                <FilterSection
                  title="Minimum Rating"
                  icon={<Star className="w-5 h-5 text-yellow-500 fill-current" />}
                >
                  <div className="flex items-center justify-between">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFilterChange({ rating: rating === filters.rating ? 0 : rating })}
                        className={`p-3 rounded-2xl transition-all ${
                          rating <= filters.rating
                            ? 'text-yellow-500 bg-yellow-100 shadow-md'
                            : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                        }`}
                      >
                        <Star className="w-6 h-6 fill-current" />
                      </motion.button>
                    ))}
                  </div>
                </FilterSection>

                {/* Additional Options */}
                <FilterSection
                  title="More Options"
                  icon={<ShoppingBag className="w-5 h-5 text-blue-600" />}
                >
                  <div className="space-y-4">
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-green-50 transition-all duration-300"
                    >
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all ${
                        filters.inStock
                          ? 'bg-green-600 border-green-600'
                          : 'border-gray-300 group-hover:border-green-400'
                      }`}>
                        {filters.inStock && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-green-600 transition-colors">
                        ✅ In Stock Only
                      </span>
                    </motion.label>

                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center cursor-pointer group p-3 rounded-xl hover:bg-red-50 transition-all duration-300"
                    >
                      <input
                        type="checkbox"
                        checked={filters.onSale}
                        onChange={(e) => handleFilterChange({ onSale: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all ${
                        filters.onSale
                          ? 'bg-red-600 border-red-600'
                          : 'border-gray-300 group-hover:border-red-400'
                      }`}>
                        {filters.onSale && (
                          <motion.svg
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </motion.svg>
                        )}
                      </div>
                      <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">
                        🔥 On Sale
                      </span>
                    </motion.label>
                  </div>
                </FilterSection>
              </div>

              {/* Footer Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t-2 border-gray-100 space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <Filter className="mr-2 h-5 w-5" />
                    APPLY FILTERS
                  </Button>
                </motion.div>
                
                {activeFilterCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-700 font-black rounded-2xl transition-all duration-300"
                    >
                      <X className="mr-2 h-4 w-4" />
                      CLEAR ALL FILTERS
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
