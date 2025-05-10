import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '@/services/api';

interface QueryState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

interface QueryOptions {
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useQuery<T = any>(
  table: string,
  query?: any,
  options: QueryOptions = {}
) {
  const [state, setState] = useState<QueryState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });

  const fetchData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await api.get<T>(table, query);
      setState({ data, error: null, isLoading: false });
      options.onSuccess?.(data);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('Failed to fetch data');
      setState({ data: null, error: apiError, isLoading: false });
      options.onError?.(apiError);
    }
  }, [table, query, options.onSuccess, options.onError]);

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData();
    }
  }, [fetchData, options.enabled]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
  };
} 