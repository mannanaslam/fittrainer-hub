import { useState, useCallback } from 'react';
import { api, ApiError } from '@/services/api';

interface MutationState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

interface MutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

type MutationFn<T, V> = (variables: V) => Promise<T>;

export function useMutation<T = any, V = any>(
  mutationFn: MutationFn<T, V>,
  options: MutationOptions<T> = {}
) {
  const [state, setState] = useState<MutationState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const mutate = useCallback(
    async (variables: V) => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const data = await mutationFn(variables);
        setState({ data, error: null, isLoading: false });
        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const apiError = error instanceof ApiError ? error : new ApiError('Failed to mutate data');
        setState({ data: null, error: apiError, isLoading: false });
        options.onError?.(apiError);
        throw apiError;
      }
    },
    [mutationFn, options.onSuccess, options.onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Example usage:
// const { mutate, isLoading, error } = useMutation(
//   (variables) => api.post('table', variables),
//   {
//     onSuccess: (data) => console.log('Success:', data),
//     onError: (error) => console.error('Error:', error),
//   }
// ); 