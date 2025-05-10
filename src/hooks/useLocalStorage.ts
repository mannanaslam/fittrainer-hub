import { useState, useEffect, useCallback } from 'react';

type StorageValue<T> = T | null;

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: Error) => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError = console.error,
  } = options;

  const [storedValue, setStoredValue] = useState<StorageValue<T>>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Failed to read from localStorage'));
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: StorageValue<T>) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, serializer(valueToStore));
      } catch (error) {
        onError(error instanceof Error ? error : new Error('Failed to write to localStorage'));
      }
    },
    [key, serializer, storedValue, onError]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(null);
      window.localStorage.removeItem(key);
    } catch (error) {
      onError(error instanceof Error ? error : new Error('Failed to remove from localStorage'));
    }
  }, [key, onError]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(deserializer(event.newValue));
        } catch (error) {
          onError(error instanceof Error ? error : new Error('Failed to parse storage event'));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserializer, onError]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
}

// Example usage:
// const { value, setValue, removeValue } = useLocalStorage('user', {
//   name: 'John',
//   age: 30,
// });
//
// const { value: theme, setValue: setTheme } = useLocalStorage('theme', 'light', {
//   serializer: (value) => value.toString(),
//   deserializer: (value) => value as 'light' | 'dark',
// }); 