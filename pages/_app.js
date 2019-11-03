import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';

import { CookiesProvider } from 'react-cookie';

import CustomThemeProvider from '../components/theme/CustomThemeProvider';

class CustomApp extends App {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <CookiesProvider>
          <CustomThemeProvider theme={pageProps.theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </CustomThemeProvider>
        </CookiesProvider>
      </>
    );
  }
}

export default CustomApp;
