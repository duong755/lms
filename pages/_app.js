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
    this.getCookies = this.getCookies.bind(this);
  }

  getCookies(ctx) {
    if (ctx && ctx.req && ctx.req.universalCookies) {
      return new Cookies(ctx.req.universalCookies);
    }

    return new Cookies();
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <CookiesProvider cookies={this.getCookies()}>
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
