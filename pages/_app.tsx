import NextApp, { AppContext, AppInitialProps } from 'next/app';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import DayjsUtils from '@date-io/dayjs';
import { Cookies, CookiesProvider } from 'react-cookie';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import CssBaseline from '@material-ui/core/CssBaseline';

NProgress.configure({ showSpinner: true });
Router.events.on('routeChangeStart', NProgress.start);
Router.events.on('routeChangeComplete', NProgress.done);
Router.events.on('routeChangeError', NProgress.done);

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

    console.group('NextApp');
    console.log();
    console.log('pageProps', pageProps);
    console.log('router', router);
    console.log();
    console.groupEnd();

    return (
      <CookiesProvider cookies={new Cookies()}>
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <CssBaseline />
          <Component {...pageProps} />
        </MuiPickersUtilsProvider>
      </CookiesProvider>
    );
  }
}

export default CustomApp;
