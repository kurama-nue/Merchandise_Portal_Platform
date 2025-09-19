import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProductFilter } from '@/components/product/ProductFilter';
import QuickView from '@/components/product/QuickView';
import { Product } from '@/types/product';

const mockProducts: Product[] = [
  {
    id: "1",
    name: 'Premium Graphic Tee',
    description: 'High-quality graphic tee made from 100% organic cotton',
    price: 29.99,
    images: ['/images/clothing/premium-tee.jpg'],
    category: 'Clothing',
    hasSize: true,
    rating: 4.5,
    reviewCount: 128,
    brand: 'ArtisanX',
    inStock: true,
    onSale: false
  },
  // Add more mock products here
];

const categories = ['Clothing', 'Accessories', 'Electronics'];
const brands = ['ArtisanX', 'TechStyle', 'UrbanGear'];

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  const handleFilterChange = (filters: any) => {
    let filtered = mockProducts;

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Apply brand filters
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && 
      product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => 
        product.rating >= filters.rating
      );
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.onSale);
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <ProductFilter
              categories={categories}
              brands={brands}
              onFilterChange={handleFilterChange}
              className="sticky top-24"
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                        target.onerror = null; // Prevent infinite loop
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold">${product.price}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">{product.rating}</span>
                        <span className="text-gray-400">
                          ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Quick View
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* QuickView Modal */}
      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductsPage;
