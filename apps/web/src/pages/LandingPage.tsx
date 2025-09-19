import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, ArrowRight, Star, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/ui/accordion';
import { PageTransition } from '../components/PageTransition';

interface FAQItem {
  question: string;
  answer: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const faqs: FAQItem[] = [
    {
      question: 'What is the Merchandise Portal Platform?',
      answer: 'The Merchandise Portal Platform is a centralized system for browsing, ordering, and managing merchandise for your organization. It supports both individual and group ordering with special features for departments.'
    },
    {
      question: 'How do group orders work?',
      answer: 'Department heads can create group orders for their team. Team members can contribute to these orders, and once finalized, the entire order is processed together for efficient distribution.'
    },
    {
      question: 'How is merchandise distributed?',
      answer: 'After payment processing, our distribution team prepares your order. You can track the status (Packed, Shipped, Delivered) in real-time through your account dashboard.'
    },
    {
      question: 'Can I leave reviews for products?',
      answer: 'Yes! After receiving your order, you can rate products and leave detailed reviews to help others make informed decisions.'
    },
  ];

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section with Animated Gradient Background */}
      {/* Hero Section with Animated Gradient Background */}
      <section className="relative overflow-hidden bg-white dark:bg-gray-900 py-20 md:py-32">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 opacity-70">
          <motion.div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100%\' height=\'100%\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'grid\' width=\'40\' height=\'40\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 40 0 L 0 0 0 40\' fill=\'none\' stroke=\'%23e0e7ff\' stroke-width=\'1\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%\' height=\'100%\' fill=\'url(%23grid)\' /%3E%3C/svg%3E")',
              backgroundSize: '40px 40px'
            }}
            animate={{
              x: [0, 40],
              y: [0, 40]
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 60,
              ease: 'linear'
            }}
          />
        </div>
        
        <div className="container relative mx-auto px-6 flex flex-col lg:flex-row items-center">
          {/* Left Content */}
          <div className="lg:w-1/2 lg:pr-12 mb-12 lg:mb-0">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your One-Stop <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple">Merchandise</span> Portal
            </motion.h1>
            
            <motion.p 
              className="text-xl mb-8 text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Discover, order, and manage all your merchandise needs in one place. Designed specifically for corporate and department-based purchasing.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                variant="gradient" 
                size="lg"
                className="rounded-full px-8 shadow-glow"
                onClick={() => navigate('/products')}
              >
                <span className="mr-2">Get Started</span>
                <ArrowRight size={18} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full px-8 border-brand-blue dark:border-brand-purple dark:text-white"
                onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </motion.div>
          </div>
          
          {/* Right Content - Illustration */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <Card className="overflow-hidden glass-card border-0 shadow-2xl">
                <img 
                  src="/images/hero-illustration.svg" 
                  alt="Merchandise Portal Illustration" 
                  className="w-full h-auto"
                />
              </Card>
              
              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <ShoppingBag size={24} className="text-white" />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-gradient-to-r from-brand-blue to-brand-purple rounded-full p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
              >
                <Users size={24} className="text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Platform Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card 
                className="glass-card overflow-hidden"
                hoverEffect="scale-glow"
              >
              <div className="p-8">
                <div className="bg-gradient-to-r from-brand-blue to-brand-purple w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <ShoppingBag className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Product Catalog</h3>
                <p className="text-gray-600 dark:text-gray-300">Browse our extensive catalog with detailed product information, high-quality images, and customer reviews.</p>
                <motion.div 
                  className="mt-6 flex items-center text-brand-blue dark:text-brand-purple font-medium cursor-pointer"
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/products')}
                >
                  <span>View catalog</span>
                  <ArrowRight size={16} className="ml-2" />
                </motion.div>
              </div>
            </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card 
                className="glass-card overflow-hidden"
                hoverEffect="scale-glow"
              >
              <div className="p-8">
                <div className="bg-gradient-to-r from-brand-purple to-brand-blue w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Group Ordering</h3>
                <p className="text-gray-600 dark:text-gray-300">Create and manage department-based group orders with real-time contribution tracking and notifications.</p>
                <motion.div 
                  className="mt-6 flex items-center text-brand-blue dark:text-brand-purple font-medium cursor-pointer"
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/group-orders')}
                >
                  <span>Learn more</span>
                  <ArrowRight size={16} className="ml-2" />
                </motion.div>
              </div>
            </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card 
                className="glass-card overflow-hidden"
                hoverEffect="scale-glow"
              >
              <div className="p-8">
                <div className="bg-gradient-to-r from-brand-blue to-brand-purple w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-md">
                  <Truck className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Seamless Checkout</h3>
                <p className="text-gray-600 dark:text-gray-300">Enjoy a streamlined checkout process with multiple payment options and order tracking capabilities.</p>
                <motion.div 
                  className="mt-6 flex items-center text-brand-blue dark:text-brand-purple font-medium cursor-pointer"
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/checkout')}
                >
                  <span>See how it works</span>
                  <ArrowRight size={16} className="ml-2" />
                </motion.div>
              </div>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <AccordionItem value={`item-${index}`} className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-brand-purple text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-8">Ready to explore our merchandise?</h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">Join thousands of satisfied customers who have found the perfect merchandise for their needs.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button 
              variant="gradient" 
              size="lg"
              className="rounded-full px-8 py-6 text-lg font-medium shadow-glow"
              onClick={() => navigate('/products')}
            >
              <span className="mr-2">Browse Products</span>
              <ArrowRight size={18} />
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-16 flex justify-center items-center space-x-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center">
              <Star className="text-yellow-300 mr-2" size={20} fill="currentColor" />
              <span className="font-medium">4.9/5 Customer Rating</span>
            </div>
            <div className="flex items-center">
              <Users className="text-yellow-300 mr-2" size={20} />
              <span className="font-medium">10,000+ Happy Customers</span>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </PageTransition>
  );
};

export default LandingPage;