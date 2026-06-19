// src/hooks/useDebouncedValue.js
import { useEffect, useState } from 'react';

/** Returns `value`, but updated only after `delay` ms of inactivity — keeps search-as-you-type smooth. */
export function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
