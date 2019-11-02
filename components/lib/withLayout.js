import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Cookies } from 'react-cookie';

import Header from '../Header';
import CustomThemeProvider from '../theme/CustomThemeProvider';

/**
 *
 * @param {React.Component} BaseComponent
 */
function withLayout(BaseComponent) {
  // eslint-disable-next-line react/display-name
  const Layout = ({ theme }) => (
    <>
      <CustomThemeProvider theme={theme}>
        <Header />
        <BaseComponent />
      </CustomThemeProvider>
    </>
  );

  Layout.getInitialProps = async context => {
    const paletteType = new Cookies().get('paletteType');
    return { theme: get(context, ['req', 'cookies', 'paletteType'], paletteType) };
  };

  Layout.propTypes = {
    theme: PropTypes.string
  };

  return Layout;
}

export default withLayout;
