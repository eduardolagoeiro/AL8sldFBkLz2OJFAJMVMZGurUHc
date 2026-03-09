'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme } from '@/hooks';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  effectiveColorScheme: 'light' | 'dark';
  toggleTheme: () => void;
};

const DEFAULT_MODE: ThemeMode = 'light';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider(props: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE);

  const effectiveColorScheme: 'light' | 'dark' =
    mode === 'system' ? (systemColorScheme ?? 'light') : mode;

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === 'system') return 'light';
      if (prev === 'light') return 'dark';
      return 'system';
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, effectiveColorScheme, toggleTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
