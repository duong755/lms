import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Cookies } from 'react-cookie';
import axios from 'axios';

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

  Layout.getInitialProps = async (context) => {
    const paletteType = new Cookies().get('paletteType') || 'light';
    try {
      const authRes = await axios.post('/api/user', null, { withCredentials: true });
      return { theme: get(context, ['req', 'cookies', 'paletteType'], paletteType), user: authRes.data };
    } catch (err) {
      return { theme: get(context, ['req', 'cookies', 'paletteType'], paletteType), user: null };
    }
  };

  Layout.propTypes = {
    theme: PropTypes.string
  };

  return Layout;
}

export default withLayout;
