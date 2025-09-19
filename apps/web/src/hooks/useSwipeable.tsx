import { useState, useCallback, useEffect } from 'react';

interface SwipeConfig {
  threshold?: number;
  preventDefault?: boolean;
  trackMouse?: boolean;
}

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (event: TouchEvent | MouseEvent) => void;
  onSwipeEnd?: (event: TouchEvent | MouseEvent) => void;
}

interface SwipeInput {
  onSwiped?: (direction: 'left' | 'right' | 'up' | 'down', event: TouchEvent | MouseEvent) => void;
  delta?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackTouch?: boolean;
  trackMouse?: boolean;
  rotationAngle?: number;
}

const defaultConfig: SwipeConfig = {
  threshold: 50,
  preventDefault: true,
  trackMouse: false,
};

export const useSwipeable = (
  callbacks: SwipeCallbacks,
  config: SwipeConfig = {}
) => {
  const [isSwiping, setIsSwiping] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

  const options = { ...defaultConfig, ...config };

  const getPosition = useCallback((event: TouchEvent | MouseEvent) => {
    const isTouch = 'touches' in event;
    const pos = isTouch ? event.touches[0] || event.changedTouches[0] : event;
    return { x: pos.clientX, y: pos.clientY };
  }, []);

  const onStart = useCallback(
    (event: TouchEvent | MouseEvent) => {
      const pos = getPosition(event);
      setStartPos(pos);
      setCurrentPos(pos);
      setIsSwiping(true);
      callbacks.onSwipeStart?.(event);
    },
    [getPosition, callbacks]
  );

  const onMove = useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!isSwiping) return;
      
      if (options.preventDefault) {
        event.preventDefault();
      }
      
      const pos = getPosition(event);
      setCurrentPos(pos);
    },
    [isSwiping, getPosition, options.preventDefault]
  );

  const onEnd = useCallback(
    (event: TouchEvent | MouseEvent) => {
      if (!isSwiping) return;

      const deltaX = currentPos.x - startPos.x;
      const deltaY = currentPos.y - startPos.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX >= options.threshold! || absDeltaY >= options.threshold!) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }

      setIsSwiping(false);
      callbacks.onSwipeEnd?.(event);
    },
    [isSwiping, currentPos, startPos, options.threshold, callbacks]
  );

  const handlers = {
    onTouchStart: onStart,
    onTouchMove: onMove,
    onTouchEnd: onEnd,
    ...(options.trackMouse && {
      onMouseDown: onStart,
      onMouseMove: onMove,
      onMouseUp: onEnd,
    }),
  };

  return {
    handlers,
    isSwiping,
    deltaX: currentPos.x - startPos.x,
    deltaY: currentPos.y - startPos.y,
  };
};

// Alternative simpler hook for basic swipe detection
export const useSwipeGesture = (input: SwipeInput) => {
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
  }, []);

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!touchStartPos) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartPos.x;
      const deltaY = touch.clientY - touchStartPos.y;

      const minSwipeDistance = input.delta || 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          const direction = deltaX > 0 ? 'right' : 'left';
          input.onSwiped?.(direction, event);
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          const direction = deltaY > 0 ? 'down' : 'up';
          input.onSwiped?.(direction, event);
        }
      }

      setTouchStartPos(null);
    },
    [touchStartPos, input]
  );

  useEffect(() => {
    if (input.preventDefaultTouchmoveEvent) {
      const handleTouchMove = (e: TouchEvent) => e.preventDefault();
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => document.removeEventListener('touchmove', handleTouchMove);
    }
  }, [input.preventDefaultTouchmoveEvent]);

  return {
    onTouchStart,
    onTouchEnd,
  };
};

export default useSwipeable;