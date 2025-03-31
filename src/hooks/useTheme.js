import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const THEME_KEY = 'theme';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return {
    theme,
    toggleTheme,
  };
};

export const useSystemTheme = () => {
  const [theme, setTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (isDarkMode === null) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode !== null) {
      root.classList.toggle('dark', isDarkMode);
      setTheme(isDarkMode ? 'dark' : 'light');
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [isDarkMode, theme]);

  const toggleDarkMode = () => {
    setIsDarkMode(isDarkMode === null ? !theme.includes('dark') : !isDarkMode);
  };

  return {
    isDarkMode: isDarkMode ?? theme.includes('dark'),
    theme,
    toggleDarkMode,
  };
};

export const useThemeColors = () => {
  const { theme } = useTheme();

  const colors = {
    light: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#111827',
      textSecondary: '#4b5563',
      border: '#e5e7eb',
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151',
    },
  };

  return colors[theme];
};

export const useThemeTransition = () => {
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    return () => {
      root.style.transition = '';
    };
  }, []);
}; 