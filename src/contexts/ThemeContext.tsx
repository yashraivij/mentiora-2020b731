import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type ColorTheme = 'default' | 'ocean' | 'sunset' | 'forest' | 'royal';

interface ThemeContextType {
  theme: Theme;
  colorTheme: ColorTheme;
  toggleTheme: () => void;
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mentiora-theme') as Theme;
      return savedTheme || 'light';
    }
    return 'light';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    if (typeof window !== 'undefined') {
      const savedColorTheme = localStorage.getItem('mentiora-color-theme') as ColorTheme;
      return savedColorTheme || 'default';
    }
    return 'default';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('mentiora-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('theme-default', 'theme-ocean', 'theme-sunset', 'theme-forest', 'theme-royal');
    root.classList.add(`theme-${colorTheme}`);
    localStorage.setItem('mentiora-color-theme', colorTheme);
  }, [colorTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, colorTheme, toggleTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}