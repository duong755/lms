import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { useCookies } from 'react-cookie';

import themes from './type';
import AppTheme from './AppTheme';

function CustomThemeProvider(props) {
  const [cookies, setCookies] = useCookies(['paletteType']);

  const toggleTheme = useCallback(() => {
    const currentTheme = cookies['paletteType'] || props.theme || 'light';
    if (currentTheme === 'dark') {
      setCookies('paletteType', 'light');
    } else {
      setCookies('paletteType', 'dark');
    }
  }, [cookies['paletteType'], props.theme]);

  const theme = useMemo(() => {
    return cookies['paletteType'] || props.theme || 'light';
  }, [cookies['paletteType'], props.theme]);

  return (
    <AppTheme.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={themes[theme]}>{props.children}</ThemeProvider>
    </AppTheme.Provider>
  );
}

CustomThemeProvider.propTypes = {
  theme: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired
};

export default CustomThemeProvider;
