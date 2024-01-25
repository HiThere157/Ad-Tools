import { useEffect, useRef } from "react";

export function useInterval(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const interval = setInterval(() => callbackRef.current(), delay);
    return () => clearInterval(interval);
  }, [delay]);
}
