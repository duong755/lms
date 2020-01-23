import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, orange, red, grey, lightGreen } from '@material-ui/core/colors';

const customBreakpoints = {
  values: {
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
    xs: 0
  }
};

const selectTheme = (name?: string | null) => {
  name = ['dark', 'light'].includes(name || '') ? name : 'light';

  return createMuiTheme({
    breakpoints: customBreakpoints,
    palette: {
      type: name as 'light' | 'dark' | undefined,
      primary: deepOrange,
      secondary: orange,
      success: lightGreen,
      error: red,
      divider: grey[500]
    },
    typography: {
      button: {
        textTransform: 'none'
      }
    }
  });
};

export default selectTheme;
