import { createContext, useState, useEffect, useContext } from 'react';

/* REQUIREMENT: Mechanism for Global State Management (Context API) */
export const GlobalContext = createContext();

export function GlobalProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to body and save to local storage
    document.body.className = theme;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <GlobalContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
}

// Custom hook for easier consumption
export function useGlobalContext() {
  return useContext(GlobalContext);
}
