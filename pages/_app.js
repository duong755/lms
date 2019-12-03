import App from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import { CookiesProvider, Cookies } from 'react-cookie';

import AppUserProvider from '../components/auth/AppUserProvider';
import CustomThemeProvider from '../components/theme/CustomThemeProvider';

NProgress.configure({ showSpinner: true });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class CustomApp extends App {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <CookiesProvider cookies={new Cookies()}>
        <AppUserProvider user={pageProps.user}>
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <CustomThemeProvider theme={pageProps.theme}>
              <CssBaseline />
              <Component {...pageProps} />
            </CustomThemeProvider>
          </MuiPickersUtilsProvider>
        </AppUserProvider>
      </CookiesProvider>
    );
  }
}

export default CustomApp;
