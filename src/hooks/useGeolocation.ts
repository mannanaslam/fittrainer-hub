import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  onSuccess?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationPositionError) => void;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = false,
    timeout = Infinity,
    maximumAge = 0,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
  });

  const onSuccessCallback = useCallback(
    (position: GeolocationPosition) => {
      const {
        coords: { accuracy, altitude, altitudeAccuracy, heading, latitude, longitude, speed },
        timestamp,
      } = position;

      setState({
        loading: false,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
        timestamp,
        error: null,
      });

      onSuccess?.(position);
    },
    [onSuccess]
  );

  const onErrorCallback = useCallback(
    (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        loading: false,
        error,
      }));

      onError?.(error);
    },
    [onError]
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: {
          code: 2,
          message: 'Geolocation is not supported by your browser',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        },
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      onSuccessCallback,
      onErrorCallback,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enableHighAccuracy, timeout, maximumAge, onSuccessCallback, onErrorCallback]);

  return state;
}

// Example usage:
// const {
//   loading,
//   accuracy,
//   altitude,
//   altitudeAccuracy,
//   heading,
//   latitude,
//   longitude,
//   speed,
//   timestamp,
//   error,
// } = useGeolocation({
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0,
//   onSuccess: (position) => console.log('Position:', position),
//   onError: (error) => console.error('Error:', error),
// });
//
// if (loading) return <div>Loading...</div>;
// if (error) return <div>Error: {error.message}</div>;
// if (latitude && longitude) {
//   return (
//     <div>
//       Latitude: {latitude}
//       Longitude: {longitude}
//     </div>
//   );
// } 