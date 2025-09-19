import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface ProductRecommendationsProps {
  currentProduct: Product;
  category: string;
}

export const ProductRecommendations = ({
  currentProduct,
  category,
}: ProductRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // In a real application, you would fetch recommendations from your API
    // This is just a mock implementation
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `/api/products/recommendations?category=${category}&productId=${currentProduct.id}`
        );
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, [currentProduct.id, category]);

  const nextSlide = () => {
    setCurrentIndex(prev =>
      prev + 1 >= recommendations.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex(prev =>
      prev - 1 < 0 ? recommendations.length - 1 : prev - 1
    );
  };

  if (!recommendations.length) return null;

  return (
    <div className="relative">
      <h3 className="text-2xl font-bold mb-6">You might also like</h3>

      <div className="relative overflow-hidden">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="overflow-hidden mx-8">
            <motion.div
              className="flex gap-4"
              initial={false}
              animate={{
                x: `${-100 * currentIndex}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              {recommendations.map(product => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-64"
                >
                  <div className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
