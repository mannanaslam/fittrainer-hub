import { useState, useEffect, useCallback } from 'react';

// Battery API type definitions
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface NavigatorWithBattery extends Navigator {
  getBattery(): Promise<BatteryManager>;
}

interface BatteryStatus {
  charging: boolean;
  chargingTime: number | null;
  dischargingTime: number | null;
  level: number | null;
  error: Error | null;
}

interface UseBatteryStatusOptions {
  onError?: (error: Error) => void;
  onSuccess?: (status: BatteryStatus) => void;
}

export function useBatteryStatus(options: UseBatteryStatusOptions = {}) {
  const { onError, onSuccess } = options;
  const [status, setStatus] = useState<BatteryStatus>({
    charging: false,
    chargingTime: null,
    dischargingTime: null,
    level: null,
    error: null,
  });

  const updateBatteryStatus = useCallback(
    (battery: BatteryManager) => {
      const newStatus = {
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        level: battery.level,
        error: null,
      };

      setStatus(newStatus);
      onSuccess?.(newStatus);
    },
    [onSuccess]
  );

  const handleError = useCallback(
    (error: Error) => {
      setStatus((prev) => ({
        ...prev,
        error,
      }));
      onError?.(error);
    },
    [onError]
  );

  useEffect(() => {
    const navigatorWithBattery = navigator as NavigatorWithBattery;
    
    if (!navigatorWithBattery.getBattery) {
      const error = new Error('Battery status is not supported by your browser');
      handleError(error);
      return;
    }

    let battery: BatteryManager | null = null;

    navigatorWithBattery
      .getBattery()
      .then((batteryManager) => {
        battery = batteryManager;
        updateBatteryStatus(battery);

        battery.addEventListener('chargingchange', () => updateBatteryStatus(battery!));
        battery.addEventListener('chargingtimechange', () => updateBatteryStatus(battery!));
        battery.addEventListener('dischargingtimechange', () => updateBatteryStatus(battery!));
        battery.addEventListener('levelchange', () => updateBatteryStatus(battery!));
      })
      .catch(handleError);

    return () => {
      if (battery) {
        battery.removeEventListener('chargingchange', () => updateBatteryStatus(battery!));
        battery.removeEventListener('chargingtimechange', () => updateBatteryStatus(battery!));
        battery.removeEventListener('dischargingtimechange', () => updateBatteryStatus(battery!));
        battery.removeEventListener('levelchange', () => updateBatteryStatus(battery!));
      }
    };
  }, [updateBatteryStatus, handleError]);

  return status;
}

// Example usage:
// const { charging, chargingTime, dischargingTime, level, error } = useBatteryStatus({
//   onSuccess: (status) => console.log('Battery status:', status),
//   onError: (error) => console.error('Error:', error),
// });
//
// if (error) return <div>Error: {error.message}</div>;
//
// return (
//   <div>
//     <p>Charging: {charging ? 'Yes' : 'No'}</p>
//     <p>Level: {level ? `${level * 100}%` : 'Unknown'}</p>
//     {charging ? (
//       <p>Time until full: {chargingTime ? `${chargingTime} seconds` : 'Unknown'}</p>
//     ) : (
//       <p>Time until empty: {dischargingTime ? `${dischargingTime} seconds` : 'Unknown'}</p>
//     )}
//   </div>
// ); 