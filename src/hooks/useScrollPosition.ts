import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

interface UseScrollPositionOptions {
  throttleMs?: number;
  element?: HTMLElement | null;
  onScroll?: (position: ScrollPosition) => void;
}

export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const { throttleMs = 100, element, onScroll } = options;
  const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  const getScrollPosition = useCallback((): ScrollPosition => {
    if (element) {
      return {
        x: element.scrollLeft,
        y: element.scrollTop,
      };
    }
    return {
      x: window.pageXOffset,
      y: window.pageYOffset,
    };
  }, [element]);

  const handleScroll = useCallback(() => {
    const newPosition = getScrollPosition();
    setPosition(newPosition);
    onScroll?.(newPosition);
  }, [getScrollPosition, onScroll]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let lastCall = 0;

    const throttledScroll = () => {
      const now = Date.now();
      if (now - lastCall >= throttleMs) {
        handleScroll();
        lastCall = now;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(handleScroll, throttleMs - (now - lastCall));
      }
    };

    const target = element || window;
    target.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      target.removeEventListener('scroll', throttledScroll);
      clearTimeout(timeoutId);
    };
  }, [element, handleScroll, throttleMs]);

  return position;
}

// Example usage:
// const { x, y } = useScrollPosition({
//   throttleMs: 100,
//   onScroll: (position) => console.log('Scroll position:', position),
// });
//
// const { y } = useScrollPosition({
//   element: containerRef.current,
//   throttleMs: 200,
// });
//
// const isScrolled = y > 100; 