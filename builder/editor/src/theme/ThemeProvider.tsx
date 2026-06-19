import { createContext, useContext, type ReactNode } from 'react';
import type { ThemeMode } from '../types/index.js';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  theme = 'light',
  onToggleTheme,
}: {
  children: ReactNode;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}) {
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: onToggleTheme ?? (() => {}) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: 'light' as ThemeMode, toggleTheme: () => {} };
  }
  return context;
}
