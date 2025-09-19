// Responsive design utilities for ArtisianX

// Breakpoint values (matches Tailwind CSS defaults)
export const breakpoints = {
  xs: 320,  // Extra small devices
  sm: 640,  // Small devices
  md: 768,  // Medium devices (tablets)
  lg: 1024, // Large devices (desktops)
  xl: 1280, // Extra large devices
  '2xl': 1536 // 2X Large devices
} as const;

// Media query strings
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  
  // Max width queries
  'max-xs': `(max-width: ${breakpoints.xs - 1}px)`,
  'max-sm': `(max-width: ${breakpoints.sm - 1}px)`,
  'max-md': `(max-width: ${breakpoints.md - 1}px)`,
  'max-lg': `(max-width: ${breakpoints.lg - 1}px)`,
  'max-xl': `(max-width: ${breakpoints.xl - 1}px)`,
  
  // Range queries
  'sm-to-md': `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  'md-to-lg': `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  'lg-to-xl': `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
} as const;

// Device type detection
export const getDeviceType = (width: number): 'mobile' | 'tablet' | 'desktop' => {
  if (width < breakpoints.md) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  return 'desktop';
};

// Check if current viewport matches a breakpoint
export const matchesBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

// Hook for responsive behavior
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      
      setWindowSize({
        width: newWidth,
        height: newHeight,
      });
      
      setDeviceType(getDeviceType(newWidth));
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    
    // Breakpoint checks
    isXs: windowSize.width >= breakpoints.xs,
    isSm: windowSize.width >= breakpoints.sm,
    isMd: windowSize.width >= breakpoints.md,
    isLg: windowSize.width >= breakpoints.lg,
    isXl: windowSize.width >= breakpoints.xl,
    is2Xl: windowSize.width >= breakpoints['2xl'],
    
    // Max width checks
    isMaxXs: windowSize.width < breakpoints.xs,
    isMaxSm: windowSize.width < breakpoints.sm,
    isMaxMd: windowSize.width < breakpoints.md,
    isMaxLg: windowSize.width < breakpoints.lg,
    isMaxXl: windowSize.width < breakpoints.xl,
  };
};

// Responsive values utility
export const getResponsiveValue = <T>(
  values: {
    xs?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
    '2xl'?: T;
  },
  currentWidth: number,
  fallback: T
): T => {
  if (currentWidth >= breakpoints['2xl'] && values['2xl'] !== undefined) return values['2xl'];
  if (currentWidth >= breakpoints.xl && values.xl !== undefined) return values.xl;
  if (currentWidth >= breakpoints.lg && values.lg !== undefined) return values.lg;
  if (currentWidth >= breakpoints.md && values.md !== undefined) return values.md;
  if (currentWidth >= breakpoints.sm && values.sm !== undefined) return values.sm;
  if (currentWidth >= breakpoints.xs && values.xs !== undefined) return values.xs;
  
  return fallback;
};

// Container max widths for different breakpoints
export const containerSizes = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Common responsive classes for Tailwind
export const responsiveClasses = {
  // Hide/show at different breakpoints
  hideOnMobile: 'hidden md:block',
  hideOnTablet: 'block md:hidden lg:block',
  hideOnDesktop: 'block lg:hidden',
  showOnMobile: 'block md:hidden',
  showOnTablet: 'hidden md:block lg:hidden',
  showOnDesktop: 'hidden lg:block',
  
  // Grid columns
  gridCols: {
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    twoToFour: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    oneToThree: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },
  
  // Flexbox
  flex: {
    responsive: 'flex-col md:flex-row',
    reverseOnMobile: 'flex-col-reverse md:flex-row',
  },
  
  // Spacing
  padding: {
    responsive: 'px-4 md:px-6 lg:px-8',
    container: 'px-4 sm:px-6 lg:px-8',
  },
  
  // Text sizes
  text: {
    hero: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    heading: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    subheading: 'text-lg sm:text-xl md:text-2xl',
    body: 'text-sm sm:text-base',
  }
} as const;

export default {
  breakpoints,
  mediaQueries,
  getDeviceType,
  matchesBreakpoint,
  useBreakpoint,
  getResponsiveValue,
  containerSizes,
  responsiveClasses
};