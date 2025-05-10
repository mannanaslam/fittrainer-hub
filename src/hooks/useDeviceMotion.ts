import { useState, useEffect, useCallback } from 'react';

interface DeviceMotionState {
  acceleration: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  accelerationIncludingGravity: {
    x: number | null;
    y: number | null;
    z: number | null;
  };
  rotationRate: {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
  };
  interval: number | null;
  error: Error | null;
}

interface UseDeviceMotionOptions {
  onError?: (error: Error) => void;
  onSuccess?: (motion: DeviceMotionState) => void;
}

export function useDeviceMotion(options: UseDeviceMotionOptions = {}) {
  const { onError, onSuccess } = options;
  const [state, setState] = useState<DeviceMotionState>({
    acceleration: {
      x: null,
      y: null,
      z: null,
    },
    accelerationIncludingGravity: {
      x: null,
      y: null,
      z: null,
    },
    rotationRate: {
      alpha: null,
      beta: null,
      gamma: null,
    },
    interval: null,
    error: null,
  });

  const handleMotion = useCallback(
    (event: DeviceMotionEvent) => {
      const newState = {
        acceleration: {
          x: event.acceleration?.x ?? null,
          y: event.acceleration?.y ?? null,
          z: event.acceleration?.z ?? null,
        },
        accelerationIncludingGravity: {
          x: event.accelerationIncludingGravity?.x ?? null,
          y: event.accelerationIncludingGravity?.y ?? null,
          z: event.accelerationIncludingGravity?.z ?? null,
        },
        rotationRate: {
          alpha: event.rotationRate?.alpha ?? null,
          beta: event.rotationRate?.beta ?? null,
          gamma: event.rotationRate?.gamma ?? null,
        },
        interval: event.interval,
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
    if (!window.DeviceMotionEvent) {
      const error = new Error('Device motion is not supported by your browser');
      handleError(error);
      return;
    }

    if (typeof (DeviceMotionEvent as any).requestPermission !== 'function') {
      window.addEventListener('devicemotion', handleMotion);
    } else {
      (DeviceMotionEvent as any)
        .requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          } else {
            handleError(new Error('Permission to access device motion was denied'));
          }
        })
        .catch(handleError);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleMotion, handleError]);

  return state;
}

// Example usage:
// const {
//   acceleration,
//   accelerationIncludingGravity,
//   rotationRate,
//   interval,
//   error,
// } = useDeviceMotion({
//   onSuccess: (motion) => console.log('Motion:', motion),
//   onError: (error) => console.error('Error:', error),
// });
//
// if (error) return <div>Error: {error.message}</div>;
//
// return (
//   <div>
//     <h3>Acceleration</h3>
//     <p>X: {acceleration.x}</p>
//     <p>Y: {acceleration.y}</p>
//     <p>Z: {acceleration.z}</p>
//
//     <h3>Acceleration (including gravity)</h3>
//     <p>X: {accelerationIncludingGravity.x}</p>
//     <p>Y: {accelerationIncludingGravity.y}</p>
//     <p>Z: {accelerationIncludingGravity.z}</p>
//
//     <h3>Rotation Rate</h3>
//     <p>Alpha: {rotationRate.alpha}</p>
//     <p>Beta: {rotationRate.beta}</p>
//     <p>Gamma: {rotationRate.gamma}</p>
//
//     <p>Interval: {interval}ms</p>
//   </div>
// ); 