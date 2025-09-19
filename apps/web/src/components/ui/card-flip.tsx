import React from 'react';
import { motion } from 'framer-motion';

interface CardFlipProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  isFlipped: boolean;
  onFlip: () => void;
  className?: string;
}

export const CardFlip: React.FC<CardFlipProps> = ({
  frontContent,
  backContent,
  isFlipped,
  className = '',
}) => {
  return (
    <div className={`card-flip ${isFlipped ? 'flipped' : ''} ${className}`}>
      <div className="card-flip-inner">
        <motion.div 
          className="card-flip-front"
          initial={{ opacity: 1 }}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {frontContent}
        </motion.div>
        <motion.div 
          className="card-flip-back"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.4, delay: isFlipped ? 0.4 : 0 }}
        >
          {backContent}
        </motion.div>
      </div>
    </div>
  );
};

export default CardFlip;