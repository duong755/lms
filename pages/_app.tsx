import debug from 'debug';

import NextApp, { AppContext, AppInitialProps } from 'next/app';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import DayjsUtils from '@date-io/dayjs';
import { Cookies, CookiesProvider } from 'react-cookie';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';

import { CustomThemeProvider } from '../lib/theme';

NProgress.configure({ showSpinner: true });
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

if (typeof window === 'object') {
  localStorage.debug = '*';
}
class CustomApp extends NextApp {
  static async getInitialProps(context: AppContext): Promise<AppInitialProps> {
    let pageProps = {};

    const { Component, ctx } = context;

    if (Component.getInitialProps) {
      const initialProps = await Component.getInitialProps(ctx);
      pageProps = { ...pageProps, ...initialProps };
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;
    debug('NextApp')('%s', 'begin');
    debug('NextApp:pageProps')('%O', pageProps);
    debug('NextApp:router')('%O', router);
    debug('NextApp')('%s', 'end');

    return (
      <CookiesProvider cookies={new Cookies()}>
        <CustomThemeProvider>
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <CssBaseline />
            <Component {...pageProps} />
          </MuiPickersUtilsProvider>
        </CustomThemeProvider>
      </CookiesProvider>
    );
  }
}

export default CustomApp;
