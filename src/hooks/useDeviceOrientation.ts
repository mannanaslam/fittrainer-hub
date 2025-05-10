import { useState, useEffect, useCallback } from 'react';

interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  absolute: boolean | null;
  error: Error | null;
}

interface UseDeviceOrientationOptions {
  onError?: (error: Error) => void;
  onSuccess?: (orientation: DeviceOrientationState) => void;
}

export function useDeviceOrientation(options: UseDeviceOrientationOptions = {}) {
  const { onError, onSuccess } = options;
  const [state, setState] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
    absolute: null,
    error: null,
  });

  const handleOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const newState = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        absolute: event.absolute,
        error: null,
      };

      setState(newState);
      onSuccess?.(newState);
    },
    [onSuccess]
  );

  const handleError = useCallback(
    (error: Error) => {
      setState((prev) => ({
        ...prev,
        error,
      }));
      onError?.(error);
    },
    [onError]
  );

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      const error = new Error('Device orientation is not supported by your browser');
      handleError(error);
      return;
    }

    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            handleError(new Error('Permission to access device orientation was denied'));
          }
        })
        .catch(handleError);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation, handleError]);

  return state;
}

// Example usage:
// const { alpha, beta, gamma, absolute, error } = useDeviceOrientation({
//   onSuccess: (orientation) => console.log('Orientation:', orientation),
//   onError: (error) => console.error('Error:', error),
// });
//
// if (error) return <div>Error: {error.message}</div>;
//
// return (
//   <div>
//     <p>Alpha: {alpha}</p>
//     <p>Beta: {beta}</p>
//     <p>Gamma: {gamma}</p>
//     <p>Absolute: {absolute ? 'Yes' : 'No'}</p>
//   </div>
// ); 