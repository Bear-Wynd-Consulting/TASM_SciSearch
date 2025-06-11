
"use client";

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

function useLocalStorageState<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This part runs only on the client after hydration
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Effect to update localStorage when storedValue changes
  useEffect(() => {
    // This effect also runs only on the client
    if (typeof window !== 'undefined') {
      try {
        const valueToStore = JSON.stringify(storedValue);
        window.localStorage.setItem(key, valueToStore);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);
  
  // Effect to initialize value on client side if it wasn't already set
  // This handles the case where the component mounts and `initialValue` is used
  // before localStorage can be read.
   useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        } else {
          // If no item, ensure localStorage is set with initialValue
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          setStoredValue(initialValue); // ensure state is also initialValue
        }
      } catch (error) {
        console.error(`Error initializing localStorage key "${key}":`, error);
        // If error, ensure localStorage is set with initialValue
         window.localStorage.setItem(key, JSON.stringify(initialValue));
         setStoredValue(initialValue); // ensure state is also initialValue
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only run on mount for this key


  const setValue: SetValue<T> = useCallback(value => {
    setStoredValue(prevValue => {
      const valueToStore = value instanceof Function ? value(prevValue) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorageState;
