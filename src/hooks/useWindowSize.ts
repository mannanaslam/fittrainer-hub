import { useState, useEffect, useCallback } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

interface UseWindowSizeOptions {
  debounceMs?: number;
  onResize?: (size: WindowSize) => void;
}

export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const { debounceMs = 100, onResize } = options;
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleResize = useCallback(() => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setSize(newSize);
    onResize?.(newSize);
  }, [onResize]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, debounceMs);
    };

    window.addEventListener('resize', debouncedResize);
    handleResize(); // Initial size

    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize, debounceMs]);

  return size;
}

// Example usage:
// const { width, height } = useWindowSize({
//   debounceMs: 200,
//   onResize: (size) => console.log('Window resized:', size),
// });
//
// const isMobile = width < 768;
// const isTablet = width >= 768 && width < 1024;
// const isDesktop = width >= 1024; 