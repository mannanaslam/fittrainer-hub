import { useState, useCallback, useEffect, useRef } from 'react';
import { api, ApiError } from '@/services/api';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

interface UseApiOptions<T> {
  initialData?: T;
  cacheTime?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  enabled?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
}

export function useApi<T = any>(
  table: string,
  query?: any,
  options: UseApiOptions<T> = {}
) {
  const {
    initialData = null,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    onSuccess,
    onError,
    enabled = true,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    error: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
  });

  const cache = useRef<Map<string, CacheItem<T>>>(new Map());
  const abortController = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    const cacheKey = `${table}-${JSON.stringify(query)}`;
    const cachedItem = cache.current.get(cacheKey);

    if (cachedItem && Date.now() - cachedItem.timestamp < cacheTime) {
      setState({
        data: cachedItem.data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      onSuccess?.(cachedItem.data);
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Cancel previous request if it exists
      if (abortController.current) {
        abortController.current.abort();
      }

      // Create new abort controller
      abortController.current = new AbortController();

      const data = await api.get<T>(table, query);
      
      // Update cache
      cache.current.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });

      setState({
        data,
        error: null,
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      onSuccess?.(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setState({
          data: null,
          error,
          isLoading: false,
          isError: true,
          isSuccess: false,
        });
        onError?.(error);
      }
    } finally {
      abortController.current = null;
    }
  }, [table, query, cacheTime, enabled, onSuccess, onError]);

  const invalidateCache = useCallback(() => {
    cache.current.clear();
  }, []);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
    invalidateCache,
  };
}

// Example usage:
// const { data, isLoading, error, refetch } = useApi<Profile[]>(
//   'profiles',
//   'role=eq.trainer',
//   {
//     cacheTime: 10 * 60 * 1000, // 10 minutes
//     onSuccess: (data) => console.log('Success:', data),
//     onError: (error) => console.error('Error:', error),
//   }
// ); 