import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debounceValue, setDebonceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebonceValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounceValue;
}
