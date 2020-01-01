import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, orange, red, grey } from '@material-ui/core/colors';

const customBreakpoints = {
  values: {
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
    xs: 0
  }
};

const customTypography = {
  button: {
    textTransform: 'none'
  }
};

const MUIRichTextEditor = {
  root: {
    width: '100%'
  },
  container: {
    borderWidth: 1,
    borderColor: grey[300],
    borderStyle: 'solid',
    borderRadius: '4px'
  },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: grey[300],
    borderBottomStyle: 'solid'
  },
  editorContainer: {
    padding: '16px 16px 24px',
    minHeight: 80
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
  },
  typography: customTypography,
  overrides: {
    MUIRichTextEditor: MUIRichTextEditor
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
  },
  typography: customTypography,
  overrides: {
    MUIRichTextEditor: MUIRichTextEditor
  }
});

const themes = {
  dark: DarkTheme,
  light: LightTheme
};

export default themes;
