import React from 'react';

export type ThemeType = 'light' | 'dark';
export interface ThemeContextType {
  type?: ThemeType | null;
  setType(type?: ThemeType | null): void;
}

export const ThemeContext = React.createContext<ThemeContextType>({
  type: 'dark',
  setType: console.log
});

ThemeContext.displayName = 'CustomThemeContext';
