import PropTypes from 'prop-types';

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
    return { theme: context.req.cookies.paletteType };
  };

  Layout.propTypes = {
    theme: PropTypes.string
  };

  return Layout;
}

export default withLayout;
