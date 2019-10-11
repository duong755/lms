import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { useCookies } from 'react-cookie';

import themes from './type';

function CustomThemeProvider(props) {
  const [cookies] = useCookies();

  if (cookies['paletteType'] === 'dark') {
    return <ThemeProvider theme={themes.dark}>{props.children}</ThemeProvider>;
  }
  return <ThemeProvider theme={themes.light}>{props.children}</ThemeProvider>;
}

CustomThemeProvider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element.isRequired).isRequired
};

export default CustomThemeProvider;
