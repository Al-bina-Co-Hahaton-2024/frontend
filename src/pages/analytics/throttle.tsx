import { useCallback, useRef } from 'react';

export function useThrottle(callback, delay) {
  const throttleTimeout = useRef(null);

  const throttledCallback = useCallback(
    (...args) => {
      if (!throttleTimeout.current) {
        // @ts-ignore
        throttleTimeout.current = setTimeout(() => {
          callback(...args);
          throttleTimeout.current = null;
        }, delay);
      }
    },
    [callback, delay]
  );

  return throttledCallback;
}
