import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';
import useCartStore from '../stores/cartStore';

import ProductCard from '../components/product/ProductCard';
import QuickView from '../components/product/QuickView';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  images: string[];
  department?: {
    id: string;
    name: string;
  } | null;
  averageRating: number;
  reviewCount: number;
  type?: string; // Added for filtering by type
}

interface Department {
  id: string;
  name: string;
}

interface ProductType {
  id: string;
  name: string;
}

// Products are fetched from the API and mapped into the UI Product shape

const ProductListingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [params] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [productTypes] = useState<ProductType[]>([
    { id: 'type1', name: 'T-Shirts' },
    { id: 'type2', name: 'Mugs' },
    { id: 'type3', name: 'Stickers' },
    { id: 'type4', name: 'Hoodies' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const addToCart = useCartStore(state => state.addItem);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Fetch departments (used for filter sidebar)
    api.get('/departments')
      .then(response => setDepartments(response.data))
      .catch(error => console.error('Error fetching departments:', error));

    // Fetch products from API
    fetchProducts();
  }, []);

  // Keep search query in sync with URL param `q`
  useEffect(() => {
    const q = params.get('q') || '';
    setSearchQuery(q);
    // Refetch when q changes from the URL
    fetchProducts(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  
  // Apply client-side filtering when products or filter values change
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query)
        );
      }
      
      // Apply type filter
      if (selectedType) {
        filtered = filtered.filter(product => product.type === selectedType);
      }
      
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, searchQuery, selectedType]);
  
  const fetchProducts = (qOverride?: string) => {
    setLoading(true);
    setError('');
    
    // Build query params
    const params: Record<string, string> = {};
    
    if (selectedDepartment) {
      params.departmentId = selectedDepartment;
    }
    
    if (minPrice) {
      params.minPrice = minPrice;
    }
    
    if (maxPrice) {
      params.maxPrice = maxPrice;
    }
    
  const qParam = (qOverride ?? searchQuery)?.trim();
  if (qParam) params.q = qParam;

  api.get('/products', { params })
      .then(response => {
        const productsData = response.data || [];

        // Map API product shape to frontend Product type
        const mapped: Product[] = productsData.map((p: any) => ({
          id: p._id || p.id || '',
          name: p.name || '',
          description: p.description || '',
          price: p.price || 0,
          discountPrice: p.discountPrice ?? null,
          stock: p.stock || 0,
          images: p.images || [],
          department: p.department ? { id: p.department._id, name: p.department.name } : null,
          averageRating: p.averageRating ?? 0,
          reviewCount: p.reviewCount ?? (p.reviews ? p.reviews.length : 0),
          type: productTypes.find(t => t.name.toLowerCase() === (p.category || '').toLowerCase())?.id || ''
        }));

        setProducts(mapped);
        setFilteredProducts(mapped);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
      });
  };
  
  const handleFilter = () => {
    fetchProducts();
  };
  
  const resetFilters = () => {
    setSelectedDepartment('');
    setSelectedType('');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
    fetchProducts();
  };
  
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 gradient-text relative z-10"
      >
  Discover ArtisanX
      </motion.h1>
      
      {/* Decorative floating circles */}
      <div className="decorative-circle bg-brand-teal/20 w-24 h-24 absolute top-20 right-10 animate-float"></div>
      <div className="decorative-circle bg-brand-amber/20 w-16 h-16 absolute top-40 left-10 animate-pulse-glow"></div>
      
      {/* Mobile filter toggle */}
      <div className="md:hidden mb-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileFilters}
          className="w-full flex items-center justify-between p-3 bg-teal-amber-gradient text-white rounded-lg shadow-md btn-modern"
        >
          <span className="flex items-center">
            <Filter className="mr-2" size={18} />
            Filters
          </span>
          {mobileFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </motion.button>
      </div>
      
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden md:block w-64 flex-shrink-0"
        >
          <div className="glass-card-premium p-5 sticky top-4">
            <h2 className="text-xl font-semibold mb-4 gradient-text">Filters</h2>
            
            <div className="space-y-6">
              {/* Department filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Department</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="department"
                      checked={selectedDepartment === ''}
                      onChange={() => setSelectedDepartment('')}
                      className="mr-2 h-4 w-4 text-primary"
                    />
                    <span>All Departments</span>
                  </label>
                  
                  {departments.map(dept => (
                    <label key={dept.id} className="flex items-center">
                      <input
                        type="radio"
                        name="department"
                        checked={selectedDepartment === dept.id}
                        onChange={() => setSelectedDepartment(dept.id)}
                        className="mr-2 h-4 w-4 text-primary"
                      />
                      <span>{dept.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Product type filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Product Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      checked={selectedType === ''}
                      onChange={() => setSelectedType('')}
                      className="mr-2 h-4 w-4 text-primary"
                    />
                    <span>All Types</span>
                  </label>
                  
                  {productTypes.map(type => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === type.id}
                        onChange={() => setSelectedType(type.id)}
                        className="mr-2 h-4 w-4 text-primary"
                      />
                      <span>{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price range filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="sr-only">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="sr-only">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full p-2 border border-gray-300 rounded"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-teal-amber-gradient text-white py-2 px-4 rounded-lg shadow-md hover-glow btn-modern"
                  onClick={handleFilter}
                >
                  Apply Filters
                </motion.button>
                
                <button
                  className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
                  onClick={resetFilters}
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Mobile filters - collapsible */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mb-4"
            >
              <div className="glass-card-premium p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold gradient-text">Filters</h2>
                  <button onClick={toggleMobileFilters}>
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Department filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Department</h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Product type filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Product Type</h3>
                    <select
                      className="w-full p-2 border border-gray-300 rounded"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {productTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price range filter */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="p-2 border border-gray-300 rounded"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="p-2 border border-gray-300 rounded"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      className="w-full bg-teal-amber-gradient text-white py-2 px-4 rounded-lg shadow-md hover-glow btn-modern"
                      onClick={() => {
                        handleFilter();
                        toggleMobileFilters();
                      }}
                    >
                      Apply Filters
                    </button>
                    
                    <button
                      className="w-full mt-2 text-sm text-gray-500"
                      onClick={() => {
                        resetFilters();
                        toggleMobileFilters();
                      }}
                    >
                      Reset All
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      
        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="glass-card overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-shimmer relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full"></div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-shimmer relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-shimmer relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full"></div>
                    </div>
                    <div className="h-10 bg-gray-200 rounded animate-shimmer relative overflow-hidden mt-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              <AnimatePresence>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={{
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        discountPrice: product.discountPrice ?? undefined,
                        images: product.images,
                        category: product.department?.name || 'General',
                        hasSize: false,
                        rating: Math.round(product.averageRating) || 0,
                        reviewCount: product.reviewCount || 0,
                        brand: 'Brand',
                        inStock: product.stock > 0,
                        onSale: !!product.discountPrice
                      }}
                      index={index}
                      onQuickView={(p) => setQuickViewProduct(p as any)}
                      onAddToCart={(p) => addToCart({ productId: p.id, name: p.name, price: p.price, discountPrice: p.discountPrice ?? null, image: p.images[0] || '/images/placeholder.jpg' })}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
              {/* Quick View Modal: use shared QuickView component with accessibility */}
              <QuickView 
                product={quickViewProduct ? {
                  id: quickViewProduct.id,
                  name: quickViewProduct.name,
                  description: quickViewProduct.description,
                  price: quickViewProduct.price,
                  discountPrice: quickViewProduct.discountPrice ?? undefined,
                  images: quickViewProduct.images,
                  category: quickViewProduct.department?.name || 'General',
                  rating: Math.round(quickViewProduct.averageRating) || 0,
                  reviewCount: quickViewProduct.reviewCount || 0,
                  brand: 'Brand',
                  inStock: quickViewProduct.stock > 0,
                  onSale: !!quickViewProduct.discountPrice,
                  hasSize: false
                } : null} 
                isOpen={!!quickViewProduct} 
                onClose={() => setQuickViewProduct(null)} 
              />
              
              {!loading && !error && filteredProducts.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 glass-card-premium"
                >
                  <p className="text-xl text-gray-500 mb-4">
                    No products found matching your criteria.
                  </p>
                  <button 
                    onClick={resetFilters}
                    className="text-brand-teal hover:underline"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;