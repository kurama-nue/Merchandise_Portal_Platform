import { Link } from 'react-router-dom';
import { Star, ArrowRight, Heart, Shield, Truck, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreakpoint } from '../utils/responsive';
import FeaturedProducts from '../components/FeaturedProducts';
import { getFeaturedProducts, getProductStats } from '../data/products';

const ProductsIndexPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobile, isTablet } = useBreakpoint();
  
  // Get dynamic product data
  const featuredProducts = getFeaturedProducts(24); // Get 24 featured products
  const productStats = getProductStats();

  const banners = [
    {
      id: 1,
      title: "ARTISAN CRAFTED",
      subtitle: "Premium Designs with Authentic Licensed Products",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=600&fit=crop&crop=center",
      ctaText: "Shop Men",
      ctaLink: "/category/men",
      secondaryCtaText: "Shop Women", 
      secondaryCtaLink: "/category/women",
      bgColor: "from-purple-600 to-pink-600",
      emoji: "✨"
    },
    {
      id: 2,
      title: "NEW DROPS WEEKLY",
      subtitle: "Fresh Designs from Marvel, DC, Anime & More",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=600&fit=crop&crop=center", 
      ctaText: "Explore New",
      ctaLink: "/category/new-arrivals",
      bgColor: "from-blue-600 to-cyan-600",
      emoji: "🔥"
    },
    {
      id: 3,
      title: "POP CULTURE PARADISE",
      subtitle: "From Superhero Tees to K-Pop Hoodies",
      image: "https://images.unsplash.com/photo-1583743089695-4b013aba3fb5?w=1200&h=600&fit=crop&crop=center",
      ctaText: "Shop Collection",
      ctaLink: "/category/pop-culture",
      bgColor: "from-emerald-600 to-teal-600",
      emoji: "🎬"
    },
    {
      id: 4,
      title: "ANIME UNIVERSE",
      subtitle: "Naruto, Dragon Ball, One Piece & More",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=600&fit=crop&crop=center",
      ctaText: "Shop Anime",
      ctaLink: "/category/anime",
      bgColor: "from-orange-600 to-red-600",
      emoji: "🎌"
    }
  ];

  const featuredCategories = [
    {
      id: 1,
      name: 'MEN',
      slug: 'men',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop&crop=center',
      description: 'T-shirts, Hoodies, Polos',
      productCount: productStats.men,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'WOMEN',
      slug: 'women', 
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&crop=center',
      description: 'Crop Tops, Hoodies, Tees',
      productCount: productStats.women,
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 3,
      name: 'NEW ARRIVALS',
      slug: 'new-arrivals',
      image: 'https://images.unsplash.com/photo-1583743089695-4b013aba3fb5?w=400&h=300&fit=crop&crop=center',
      description: 'Latest Drops & Trends',
      productCount: productStats.newArrivals,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      name: 'ACCESSORIES',
      slug: 'accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center', 
      description: 'Bags, Mugs, Phone Cases',
      productCount: productStats.accessories,
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const collections = [
    { name: 'Marvel Universe', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=200&fit=crop&crop=center', link: '/category/marvel' },
    { name: 'DC Comics', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=300&h=200&fit=crop&crop=center', link: '/category/dc-comics' },
    { name: 'Anime Collection', image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=200&fit=crop&crop=center', link: '/category/anime' },
    { name: 'Disney Classics', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop&crop=center', link: '/category/disney' },
    { name: 'Harry Potter', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=200&fit=crop&crop=center', link: '/category/harry-potter' },
    { name: 'Friends TV Show', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop&crop=center', link: '/category/friends' },
    { name: 'Netflix Originals', image: 'https://images.unsplash.com/photo-1583743089695-4b013aba3fb5?w=300&h=200&fit=crop&crop=center', link: '/category/netflix' },
    { name: 'K-Pop & Music', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=200&fit=crop&crop=center', link: '/category/music' },
    { name: 'Gaming Gear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop&crop=center', link: '/category/gaming' },
    { name: 'Vintage Retro', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=200&fit=crop&crop=center', link: '/category/retro' },
    { name: 'Movies & Cinema', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=200&fit=crop&crop=center', link: '/category/movies' },
    { name: 'Sports Teams', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=200&fit=crop&crop=center', link: '/category/sports' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {banners.map((banner, index) => (
            index === currentSlide && (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <div className={`h-full bg-gradient-to-br ${banner.bgColor} relative overflow-hidden`}>
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-center">
                      <motion.div 
                        className="text-white text-center lg:text-left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                      >
                        <div className="text-4xl sm:text-5xl md:text-6xl mb-4">
                          {banner.emoji}
                        </div>
                        <h1 className={`font-black mb-4 ${
                          isMobile ? 'text-2xl' : isTablet ? 'text-4xl' : 'text-5xl lg:text-6xl'
                        }`}>
                          {banner.title}
                        </h1>
                        <p className={`mb-8 text-white/90 ${
                          isMobile ? 'text-base' : 'text-lg md:text-xl'
                        }`}>
                          {banner.subtitle}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Link
                              to={banner.ctaLink}
                              className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl ${
                                isMobile ? 'text-base' : 'text-lg'
                              }`}
                            >
                              <Zap className="mr-2 w-5 h-5" />
                              {banner.ctaText}
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                          </motion.div>
                          {banner.secondaryCtaText && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Link
                                to={banner.secondaryCtaLink}
                                className={`inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-gray-900 transition-all ${
                                  isMobile ? 'text-base' : 'text-lg'
                                }`}
                              >
                                {banner.secondaryCtaText}
                                <ArrowRight className="ml-2 w-5 h-5" />
                              </Link>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                      
                      {!isMobile && (
                        <motion.div 
                          className="hidden md:block"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.6 }}
                        >
                          <div className="relative">
                            <img
                              src={banner.image}
                              alt={banner.title}
                              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Carousel Controls */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
          {/* Indicators */}
          <div className="flex space-x-2">
            {banners.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="hidden sm:block w-16 h-1 bg-white/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              key={currentSlide}
            />
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
            <h2 className={`font-black text-gray-900 mb-4 ${
              isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              🛍️ SHOP BY CATEGORY
            </h2>
            <p className={`text-gray-600 ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>
              Discover our premium merchandise collections
            </p>
          </motion.div>
          
          <div className={`grid gap-4 sm:gap-6 ${
            isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-2' : 'grid-cols-4'
          }`}>
            {featuredCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 block"
                >
                  <div className={`bg-gradient-to-br ${category.color} p-4 sm:p-6 lg:p-8 flex flex-col justify-between ${
                    isMobile ? 'h-40' : isTablet ? 'h-48' : 'h-64'
                  }`}>
                    <div className="text-white">
                      <h3 className={`font-black mb-2 ${
                        isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-2xl'
                      }`}>
                        {category.name}
                      </h3>
                      <p className={`text-white/90 ${
                        isMobile ? 'text-xs' : 'text-sm'
                      }`}>
                        {category.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className={`text-white/80 font-medium ${
                        isMobile ? 'text-xs' : 'text-sm'
                      }`}>
                        {category.productCount}+ items
                      </span>
                      <ArrowRight className={`text-white group-hover:translate-x-1 transition-transform ${
                        isMobile ? 'w-4 h-4' : 'w-5 h-5'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <FeaturedProducts products={featuredProducts} />

      {/* Collections Grid */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-8 sm:mb-12" variants={itemVariants}>
            <h2 className={`font-black text-gray-900 mb-4 ${
              isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              🔥 TRENDING COLLECTIONS
            </h2>
            <p className={`text-gray-600 ${
              isMobile ? 'text-base' : 'text-lg'
            }`}>
              Explore our most popular merchandise collections
            </p>
          </motion.div>
          
          <div className={`grid gap-3 sm:gap-4 ${
            isMobile ? 'grid-cols-3' : isTablet ? 'grid-cols-4' : 'grid-cols-6'
          }`}>
            {collections.map((collection, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to={collection.link}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg transition-all overflow-hidden block"
                >
                  <div className="aspect-square">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className={`p-2 sm:p-3 lg:p-4 ${
                    isMobile ? 'min-h-[3rem]' : 'min-h-[4rem]'
                  } flex items-center justify-center`}>
                    <h3 className={`font-bold text-gray-900 text-center group-hover:text-purple-600 transition-colors line-clamp-2 ${
                      isMobile ? 'text-xs' : isTablet ? 'text-sm' : 'text-sm'
                    }`}>
                      {collection.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid gap-6 sm:gap-8 ${
            isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'
          }`}>
            <motion.div className="text-center" variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-3 sm:mb-4">
                <Star className={`text-purple-600 ${
                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                }`} />
              </div>
              <h3 className={`font-bold text-gray-900 mb-2 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                Premium Quality
              </h3>
              <p className={`text-gray-600 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                100% genuine products with quality guarantee
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
                <Truck className={`text-green-600 ${
                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                }`} />
              </div>
              <h3 className={`font-bold text-gray-900 mb-2 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                Free Shipping
              </h3>
              <p className={`text-gray-600 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                Free delivery on orders above ₹999
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4">
                <Shield className={`text-blue-600 ${
                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                }`} />
              </div>
              <h3 className={`font-bold text-gray-900 mb-2 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                30 Days Return
              </h3>
              <p className={`text-gray-600 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                Easy returns & exchanges within 30 days
              </p>
            </motion.div>
            
            <motion.div className="text-center" variants={itemVariants}>
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full mb-3 sm:mb-4">
                <Heart className={`text-red-600 ${
                  isMobile ? 'w-6 h-6' : 'w-8 h-8'
                }`} />
              </div>
              <h3 className={`font-bold text-gray-900 mb-2 ${
                isMobile ? 'text-base' : 'text-lg'
              }`}>
                6M+ Customers
              </h3>
              <p className={`text-gray-600 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}>
                Trusted by millions across India
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Newsletter Section */}
      <motion.section 
        className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-purple-600 to-pink-600"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants}>
            <h2 className={`font-black text-white mb-4 ${
              isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-3xl md:text-4xl'
            }`}>
              🎉 GET 10% OFF ON YOUR FIRST ORDER
            </h2>
            <p className={`text-white/90 mb-6 sm:mb-8 ${
              isMobile ? 'text-base' : 'text-xl'
            }`}>
              Subscribe to our newsletter and get exclusive offers & updates
            </p>
          </motion.div>
          
          <motion.div 
            className={`flex gap-3 sm:gap-4 max-w-lg mx-auto ${
              isMobile ? 'flex-col' : 'flex-col sm:flex-row'
            }`}
            variants={itemVariants}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-gray-900 font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                isMobile ? 'text-base' : 'text-base'
              }`}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 ${
                isMobile ? 'text-base' : 'text-base'
              }`}
            >
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProductsIndexPage;
