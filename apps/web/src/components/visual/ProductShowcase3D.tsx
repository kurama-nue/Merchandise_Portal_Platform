import React, { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export interface ProductShowcase3DProps {
  images: string[];
  className?: string;
}

export default function ProductShowcase3D({ images, className }: ProductShowcase3DProps) {
  const controls = useAnimation();
  const itemCount = images.length;
  const radius = 220; // px
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { margin: '-20% 0px -20% 0px', once: false });

  useEffect(() => {
    if (inView) {
      controls.start({ rotateY: 360, transition: { repeat: Infinity, ease: 'linear', duration: 40 } });
    } else {
      controls.stop();
    }
  }, [inView, controls]);

  return (
    <div ref={containerRef} className={['relative h-[420px] select-none', className].filter(Boolean).join(' ')}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-amber/10 to-brand-teal/10 blur-2xl opacity-70" />
      <motion.div className="absolute inset-0" style={{ perspective: 1200 }}>
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ transformStyle: 'preserve-3d' }}
          animate={controls}
          initial={{ rotateY: 0 }}
          onHoverStart={() => controls.stop()}
          onHoverEnd={() => controls.start({ rotateY: 360, transition: { repeat: Infinity, ease: 'linear', duration: 40 } })}
        >
          {images.map((src, idx) => {
            const angle = (360 / itemCount) * idx;
            return (
              <motion.div
                key={idx}
                className="absolute drop-shadow-2xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 200, damping: 16 }}
              >
                <div className="w-44 h-64 rounded-2xl overflow-hidden border border-white/20 bg-white/50 dark:bg-gray-900/40 backdrop-blur-md">
                  <img
                    src={src}
                    alt={`Product ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <div className="absolute bottom-2 left-0 right-0 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">Trending picks from our latest drops</p>
      </div>
    </div>
  );
}
