import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useInfiniteScroll<T>(
  fetchNextPage: () => Promise<void>,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isFetching && enabled) {
        setIsFetching(true);
        try {
          await fetchNextPage();
        } finally {
          setIsFetching(false);
        }
      }
    },
    [fetchNextPage, hasMore, isFetching, enabled]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [handleObserver, threshold, rootMargin]);

  const setHasMoreData = useCallback((value: boolean) => {
    setHasMore(value);
  }, []);

  return {
    observerTarget,
    isFetching,
    hasMore,
    setHasMoreData,
  };
}

// Example usage:
// const { observerTarget, isFetching, hasMore, setHasMoreData } = useInfiniteScroll(
//   async () => {
//     const newData = await fetchMoreData();
//     if (newData.length === 0) {
//       setHasMoreData(false);
//     }
//   },
//   {
//     threshold: 0.5,
//     rootMargin: '100px',
//   }
// ); 