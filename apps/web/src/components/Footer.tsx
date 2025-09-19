import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, Star, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-black text-white">
                ArtisianX
              </span>
            </div>
            <p className="text-gray-300 font-medium leading-relaxed">
              Express yourself with our awesome collection of trendy merchandise. 
              Where style meets soul! ✨
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center hover:shadow-lg transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/clothing" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/electronics" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link 
                  to="/category/accessories" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link 
                  to="/wishlist" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Wishlist
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Care */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Customer Care
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/orders" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-300 hover:translate-x-1 transform inline-block"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              Get In Touch
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">support@artisianx.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">
                    123 Fashion Street,<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-black text-white mb-2">Stay In The Loop! 🎉</h3>
            <p className="text-gray-300 font-medium">
              Subscribe to get updates on new arrivals, exclusive deals, and more awesome stuff!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-white/10 border border-gray-600 rounded-2xl text-white placeholder-gray-400 font-medium focus:outline-none focus:border-purple-500 focus:bg-white/20 transition-all duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              SUBSCRIBE
            </motion.button>
          </div>
        </motion.div>
        
        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-700 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 font-medium">
              &copy; {currentYear} ArtisianX. Made with ❤️ for awesome people.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white font-medium transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-300 hover:text-white font-medium transition-colors">
                Refund Policy
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;