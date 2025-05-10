import { useState, useEffect, useCallback } from 'react';

type MediaQueryCallback = (matches: boolean) => void;

interface UseMediaQueryOptions {
  onMatch?: MediaQueryCallback;
  onUnmatch?: MediaQueryCallback;
}

export function useMediaQuery(
  query: string,
  options: UseMediaQueryOptions = {}
) {
  const [matches, setMatches] = useState(false);
  const { onMatch, onUnmatch } = options;

  const handleChange = useCallback(
    (event: MediaQueryListEvent) => {
      setMatches(event.matches);
      if (event.matches) {
        onMatch?.(true);
      } else {
        onUnmatch?.(false);
      }
    },
    [onMatch, onUnmatch]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    // Add the callback as a listener for changes to the media query's match state
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, handleChange]);

  return matches;
}

// Example usage:
// const isMobile = useMediaQuery('(max-width: 768px)');
// const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
// const isLandscape = useMediaQuery('(orientation: landscape)', {
//   onMatch: () => console.log('Device is in landscape mode'),
//   onUnmatch: () => console.log('Device is in portrait mode'),
// }); 