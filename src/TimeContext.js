// TimerContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const initialDuration = 180; // 3 minutes in seconds
  const [count, setCount] = useState(initialDuration);

  useEffect(() => {
    let interval;

    if (count > 0) {
      interval = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [count]);

  const resetTimer = () => {
    setCount(initialDuration);
  };

  return (
    <TimerContext.Provider value={{ count, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
