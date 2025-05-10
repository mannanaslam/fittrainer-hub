import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface UseNetworkStatusOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  onChange?: (status: NetworkStatus) => void;
}

export function useNetworkStatus(options: UseNetworkStatusOptions = {}) {
  const { onOnline, onOffline, onChange } = options;
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    online: navigator.onLine,
    effectiveType: (navigator as any).connection?.effectiveType,
    downlink: (navigator as any).connection?.downlink,
    rtt: (navigator as any).connection?.rtt,
    saveData: (navigator as any).connection?.saveData,
  }));

  const updateStatus = useCallback(() => {
    const newStatus: NetworkStatus = {
      online: navigator.onLine,
      effectiveType: (navigator as any).connection?.effectiveType,
      downlink: (navigator as any).connection?.downlink,
      rtt: (navigator as any).connection?.rtt,
      saveData: (navigator as any).connection?.saveData,
    };

    setStatus(newStatus);
    onChange?.(newStatus);

    if (newStatus.online) {
      onOnline?.();
    } else {
      onOffline?.();
    }
  }, [onChange, onOnline, onOffline]);

  useEffect(() => {
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateStatus);
    }

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (connection) {
        connection.removeEventListener('change', updateStatus);
      }
    };
  }, [updateStatus]);

  return status;
}

// Example usage:
// const { online, effectiveType, downlink, rtt, saveData } = useNetworkStatus({
//   onOnline: () => console.log('Network is online'),
//   onOffline: () => console.log('Network is offline'),
//   onChange: (status) => console.log('Network status changed:', status),
// });
//
// if (!online) {
//   return <div>You are offline</div>;
// }
//
// if (saveData) {
//   return <div>Data saver is enabled</div>;
// } 