import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, orange, red } from '@material-ui/core/colors';

const customBreakpoints = {
  values: {
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
    xs: 0
  }
};

const DarkTheme = createMuiTheme({
  breakpoints: customBreakpoints,
  palette: {
    type: 'dark',
    primary: deepOrange,
    secondary: orange,
    error: red,
    text: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5'
    }
  }
});
const LightTheme = createMuiTheme({
  breakpoints: customBreakpoints,
  palette: {
    type: 'light',
    primary: deepOrange,
    secondary: orange,
    error: red,
    text: {
      primary: '#000000',
      secondary: '#333333'
    }
  }
});

const themes = {
  dark: DarkTheme,
  light: LightTheme
};

export default themes;
