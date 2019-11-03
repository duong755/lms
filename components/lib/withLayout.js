import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Cookies } from 'react-cookie';

import Header from '../Header';

/**
 *
 * @param {React.Component} BaseComponent
 */
function withLayout(BaseComponent) {
  const Layout = () => (
    <>
      <Header />
      <BaseComponent />
    </>
  );

  Layout.getInitialProps = async context => {
    const paletteType = new Cookies().get('paletteType') || 'light';
    return { theme: get(context, ['req', 'cookies', 'paletteType'], paletteType) };
  };

  Layout.propTypes = {
    theme: PropTypes.string
  };

  return Layout;
}

export default withLayout;
