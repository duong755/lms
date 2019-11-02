import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';

import { CookiesProvider } from 'react-cookie';

class CustomApp extends App {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <CookiesProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </CookiesProvider>
      </>
    );
  }
}

export default CustomApp;
