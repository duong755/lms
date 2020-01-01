import { createContext } from 'react';

const AppTheme = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export default AppTheme;
