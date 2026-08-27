'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemePreference {
  mode: Theme;
  timestamp: number;
}

const STORAGE_KEY = 'theme-preference';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: ThemePreference = JSON.parse(stored);
    return parsed.mode;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: Theme): void {
  try {
    const preference: ThemePreference = {
      mode: theme,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
  } catch {
    // localStorage full or disabled — fail silently
  }
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    const initial = stored ?? getSystemTheme();
    setTheme(initial);
    applyTheme(initial);
    setIsLoaded(true);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only follow system if user hasn't set a preference
      const hasPreference = getStoredTheme() !== null;
      if (!hasPreference) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      setStoredTheme(next);
      applyTheme(next);
      return next;
    });
  }, []);

  const setMode = useCallback((mode: Theme) => {
    setTheme(mode);
    setStoredTheme(mode);
    applyTheme(mode);
  }, []);

  return { theme, isLoaded, toggleTheme, setMode };
}
