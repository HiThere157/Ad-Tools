import { useState } from "react";

function useStorage<T>(
  storage: { getItem: Function; setItem: Function },
  key: string,
  initialValue: any,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage/sessionStorage.
  const setValue = (value: React.SetStateAction<T>) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      storage.setItem(key, JSON.stringify(valueToStore));
      return valueToStore;
    });
  };
  return [storedValue, setValue];
}

function useSessionStorage<T>(
  key: string,
  initialValue: any,
): [T, React.Dispatch<React.SetStateAction<T>>, string] {
  return [...useStorage<T>(window.sessionStorage, key, initialValue), key];
}

function useLocalStorage<T>(
  key: string,
  initialValue: any,
): [T, React.Dispatch<React.SetStateAction<T>>, string] {
  return [...useStorage<T>(window.localStorage, key, initialValue), key];
}

export { useSessionStorage, useLocalStorage };