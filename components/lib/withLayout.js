import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Cookies } from 'react-cookie';

import Header from '../Header';

/**
 *
 * @param {React.FC} BaseComponent
 */
function withLayout(BaseComponent) {
  const Layout = (pageProps) => (
    <>
      <Header {...pageProps} />
      <BaseComponent {...pageProps} />
    </>
  );

  Layout.getInitialProps = async (context) => {
    const paletteType = new Cookies().get('paletteType') || 'light';
    let componentProps = {};

    if (BaseComponent.getInitialProps) {
      componentProps = await BaseComponent.getInitialProps(context);
    }

    return {
      theme: get(context, ['req', 'cookies', 'paletteType'], paletteType),
      ...componentProps
    };
  };

  Layout.propTypes = {
    theme: PropTypes.string,
    user: PropTypes.shape({
      id: PropTypes.string,
      email: PropTypes.string,
      username: PropTypes.string,
      type: PropTypes.oneOf(['teacher', 'student']),
      info: PropTypes.shape({
        fullname: PropTypes.string,
        birthday: PropTypes.string,
        image: PropTypes.string
      })
    })
  };

  return Layout;
}

export default withLayout;
