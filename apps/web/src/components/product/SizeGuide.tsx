import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
}

const sizeGuides = {
  clothing: {
    headers: ['Size', 'Chest (in)', 'Waist (in)', 'Hip (in)'],
    rows: [
      ['S', '34-36', '28-30', '34-36'],
      ['M', '38-40', '32-34', '38-40'],
      ['L', '42-44', '36-38', '42-44'],
      ['XL', '46-48', '40-42', '46-48'],
    ],
  },
  shoes: {
    headers: ['US Size', 'UK Size', 'EU Size', 'Foot Length (cm)'],
    rows: [
      ['7', '6', '40', '25'],
      ['8', '7', '41', '25.5'],
      ['9', '8', '42', '26'],
      ['10', '9', '43', '27'],
    ],
  },
  accessories: {
    headers: ['Size', 'Measurement'],
    rows: [
      ['One Size', 'Universal Fit'],
    ],
  },
};

export const SizeGuide = ({ isOpen, onClose, category }: SizeGuideProps) => {
  const guide = sizeGuides[category as keyof typeof sizeGuides] || sizeGuides.clothing;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-2xl w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Size Guide
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Find your perfect fit
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      {guide.headers.map((header, index) => (
                        <th
                          key={index}
                          className="py-4 px-6 bg-gray-50 dark:bg-gray-800 font-medium text-gray-900 dark:text-white"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-gray-100 dark:border-gray-800"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="py-4 px-6 text-gray-700 dark:text-gray-300"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Measurements are approximate. For the best fit, we recommend
                  taking your own measurements and comparing them to the size chart.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
