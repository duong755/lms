import App from 'next/app';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayjsUtils from '@date-io/dayjs';
import { CookiesProvider } from 'react-cookie';

import AppUserProvider from '../components/auth/AppUserProvider';
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
          <AppUserProvider user={pageProps.user}>
            <MuiPickersUtilsProvider utils={DayjsUtils}>
              <CustomThemeProvider theme={pageProps.theme}>
                <CssBaseline />
                <Component {...pageProps} />
              </CustomThemeProvider>
            </MuiPickersUtilsProvider>
          </AppUserProvider>
        </CookiesProvider>
      </>
    );
  }
}

export default CustomApp;
