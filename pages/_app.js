import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';

import { CookiesProvider } from 'react-cookie';

import CustomThemeProvider from '../components/theme/CustomThemeProvider';
import Header from '../components/Header';

class CustomApp extends App {
  constructor(props, context) {
    super(props, context);
  }

  static async getInitialProps({ Component, ctx }) {
    const pageProps = {};

    if (Component.getInitialProps) {
      Object.assign(pageProps, await Component.getInitialProps(ctx));
    }

    return { pageProps };
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
