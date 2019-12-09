import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import { CookiesProvider, Cookies } from 'react-cookie';

import AppUserProvider from '../components/auth/AppUserProvider';
import CustomThemeProvider from '../components/theme/CustomThemeProvider';

class CustomApp extends App {
  constructor(props, context) {
    super(props, context);
  }

  static getCookies(ctx) {
    if (ctx && ctx.req && ctx.req.universalCookies) {
      return new Cookies(ctx.req.universalCookies);
    }

    return new Cookies();
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const cookies = this.getCookies(ctx);

    return { pageProps, cookies };
  }

  render() {
    const { Component, pageProps, cookies } = this.props;

    return (
      <CookiesProvider cookies={new Cookies(cookies)}>
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
