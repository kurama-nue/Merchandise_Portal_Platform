import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveChat from './components/LiveChat';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import ProductsPage from './pages/ProductsPage';
import { PageTransition } from './components/PageTransition';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              theme="system"
            />
            <main className="flex-grow pt-16">
              <AnimatePresence mode="wait">
                <Suspense 
                  fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500" />
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    } />
                    <Route path="/login" element={
                      <PageTransition>
                        <Login />
                      </PageTransition>
                    } />
                    <Route path="/products" element={
                      <PageTransition>
                        <ProductsPage />
                      </PageTransition>
                    } />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </main>
            <Footer />
            <LiveChat />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App