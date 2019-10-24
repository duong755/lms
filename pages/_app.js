import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';

import { CookiesProvider } from 'react-cookie';

import CustomThemeProvider from '../components/theme/CustomThemeProvider';
import Header from '../components/Header';

class CustomApp extends App {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <CookiesProvider>
          <CustomThemeProvider>
            <CssBaseline />
            <Header />
            <Component {...pageProps} />
          </CustomThemeProvider>
        </CookiesProvider>
      </>
    );
  }
}

export default CustomApp;
