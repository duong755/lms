import React from 'react';
import * as PropTypes from 'prop-types';

import dayjs from 'dayjs';
import { useCookies } from 'react-cookie';
import { ThemeProvider } from '@material-ui/core/styles';

import { ThemeContext, ThemeType } from './Context';
import selectTheme from './themes';

export const CustomThemeProvider: React.FC = (props) => {
  const [cookies, setCookies] = useCookies(['theme']);

  const toggleTheme = React.useCallback<() => void>(() => {
    const currentTheme = cookies['theme'];
    const otherTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCookies('theme', otherTheme, {
      sameSite: true,
      path: '/',
      expires: dayjs()
        .add(1, 'y')
        .toDate()
    });
  }, [cookies, setCookies]);

  const currentTheme = React.useMemo<ThemeType | null | undefined>(() => {
    return cookies['theme'] as ThemeType;
  }, [cookies]);

  return (
    <ThemeContext.Provider value={{ type: currentTheme, setType: toggleTheme }}>
      <ThemeContext.Consumer>
        {(contextProps) => {
          return <ThemeProvider theme={selectTheme(contextProps.type)}>{props.children}</ThemeProvider>;
        }}
      </ThemeContext.Consumer>
    </ThemeContext.Provider>
  );
};

CustomThemeProvider.propTypes = {
  children: PropTypes.node
};
