import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Truck, Shield } from 'lucide-react';
import QuickView from '../components/product/QuickView';
import { useState } from 'react';
import type { Product } from '../types/product';
import type { LucideIcon } from 'lucide-react';
import ProductShowcase3D from '../components/visual/ProductShowcase3D';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ShoppingBag,
    title: "Premium Quality",
    description: "Hand-picked premium merchandise that stands out"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Swift and secure worldwide shipping"
  },
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "100% secure payment and data protection"
  },
  {
    icon: Star,
    title: "Exclusive Designs",
    description: "Unique and limited edition merchandise"
  }
];

const featuredProducts: Product[] = [
  {
    id: "1",
    name: 'Premium Graphic Tee',
    description: 'High-quality graphic tee made from 100% organic cotton',
    price: 29.99,
  images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80'],
    category: 'Clothing',
    hasSize: true,
    rating: 4.5,
    reviewCount: 128,
    brand: 'ArtisanX',
    inStock: true,
    onSale: false
  },
  {
    id: "2",
    name: 'Limited Edition Hoodie',
    description: 'Exclusive design hoodie with premium fabric and perfect fit',
    price: 59.99,
  images: ['https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=900&q=80'],
    category: 'Clothing',
    hasSize: true,
    rating: 5,
    reviewCount: 89,
    brand: 'ArtisanX',
    inStock: true,
    onSale: false
  },
  {
    id: "3",
    name: 'Designer Backpack',
    description: 'Stylish and durable backpack perfect for everyday use',
    price: 79.99,
  images: ['https://images.unsplash.com/photo-1520975693411-c6155b310fd1?auto=format&fit=crop&w=900&q=80'],
    category: 'Accessories',
    hasSize: false,
    rating: 4.8,
    reviewCount: 156,
    brand: 'ArtisanX',
    inStock: true,
    onSale: false
  }
];

const categories = [
  { name: 'Clothing', description: 'Premium apparel for every style' },
  { name: 'Accessories', description: 'Complete your look' },
  { name: 'Electronics', description: 'Tech with a personal touch' }
] as const;

const Home = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const heroShowcase = [
    'https://images.unsplash.com/photo-1518441902111-a9a2e7e705a4?auto=format&fit=crop&w=600&q=80', // headphones
    'https://images.unsplash.com/photo-1528701800489-20be3c2ea5f4?auto=format&fit=crop&w=600&q=80', // sneakers
    'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=600&q=80', // watch
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80', // hoodie
    'https://images.unsplash.com/photo-1526403226024-6f3d2b07f1c0?auto=format&fit=crop&w=600&q=80', // backpack
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80', // keyboard
    'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80', // mug
    'https://images.unsplash.com/photo-1532634896-26909d0d4b6a?auto=format&fit=crop&w=600&q=80', // bottle
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <motion.div
        style={{ opacity, scale }}
        className="relative min-h-[90vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/5"
                style={{
                  width: Math.random() * 300 + 50,
                  height: Math.random() * 300 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white">
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Premium Merchandise
              </span>
              <br />
              For Every Style
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Discover our curated collection of high-quality merchandise designed to make a statement.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
                >
                  Explore Collection
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/custom"
                  className="bg-white/10 text-white px-8 py-4 rounded-full font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                >
                  Customize Your Own
                </Link>
              </motion.div>
            </div>

            {/* 3D Product Showcase in Hero (visible on lg+) */}
            <div className="hidden lg:block max-w-5xl mx-auto">
              <ProductShowcase3D images={heroShowcase} />
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-white/50 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of quality, style, and convenience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="mb-4">
                  <feature.icon size={40} className="text-emerald-500 group-hover:text-blue-500 transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Collection</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of premium merchandise
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-w-3 aspect-h-4 overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder.jpg';
                      target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-medium">{product.category}</p>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      ${product.price}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.round(product.rating))].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className="text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedProduct(product)}
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Quick View
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-lg font-semibold text-blue-600 hover:text-emerald-600 transition-colors duration-300"
            >
              View All Products <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect merchandise for every occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-xl"
              >
                <img
                  src={{
                    Clothing: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80',
                    Accessories: 'https://images.unsplash.com/photo-1520975693411-c6155b310fd1?auto=format&fit=crop&w=1200&q=80',
                    Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
                  }[category.name as 'Clothing' | 'Accessories' | 'Electronics']}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/images/placeholder.jpg`;
                    target.onerror = null;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    <Link
                      to={`/products?category=${category.name.toLowerCase()}`}
                      className="inline-block"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-white transition-colors duration-300"
                      >
                        Explore {category.name}
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8">
              Subscribe to our newsletter for exclusive offers, new arrivals, and insider-only discounts
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-xl bg-white/10 text-white placeholder:text-gray-400 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

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

export default Home;
