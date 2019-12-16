import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { useCookies } from 'react-cookie';
import dayjs from 'dayjs';

import themes from './type';
import AppTheme from './AppTheme';

function CustomThemeProvider(props) {
  const [cookies, setCookies] = useCookies(['paletteType']);

  const toggleTheme = useCallback(() => {
    const currentTheme = cookies['paletteType'] || props.theme || 'light';
    if (currentTheme === 'dark') {
      setCookies('paletteType', 'light', {
        sameSite: true,
        path: '/',
        expires: dayjs()
          .add(1, 'y')
          .toDate()
      });
    } else {
      setCookies('paletteType', 'dark', {
        sameSite: true,
        path: '/',
        expires: dayjs()
          .add(1, 'year')
          .toDate()
      });
    }
  }, [cookies['paletteType'], props.theme]);

  const theme = useMemo(() => {
    return cookies['paletteType'] || props.theme || 'light';
  }, [cookies['paletteType'], props.theme]);

  return (
    <AppTheme.Provider value={{ theme, toggleTheme }}>
      <AppTheme.Consumer>
        {(themeProps) => <ThemeProvider theme={themes[themeProps.theme]}>{props.children}</ThemeProvider>}
      </AppTheme.Consumer>
    </AppTheme.Provider>
  );
}

CustomThemeProvider.propTypes = {
  theme: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default CustomThemeProvider;
