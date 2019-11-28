/**
 * @typedef {{ id: string, username: string, email: string, image: Object<string, string> }} UserData
 */
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import AppUserContext from './AppUser';

function AppUserProvider(props) {
  const [cookies, setCookies] = useCookies(['lms.user']);

  /**
   * @type {(u: UserData | null) => void}
   */
  const setUser = useCallback(
    (userData) => {
      setCookies('lms.user', userData, { sameSite: true, path: '/' });
    },
    [cookies['lms.user'], props.user]
  );

  return (
    <>
      <AppUserContext.Provider value={{ user: cookies['lms.user'] || null, setUser: setUser }}>
        {props.children}
      </AppUserContext.Provider>
    </>
  );
}

AppUserProvider.propTypes = {
  user: PropTypes.oneOfType([
    null,
    PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string,
      type: PropTypes.oneOf(['teacher', 'student']),
      info: PropTypes.shape({
        fullname: PropTypes.string,
        birthday: PropTypes.string,
        image: PropTypes.string
      })
    })
  ]),
  children: PropTypes.node.isRequired
};

export default AppUserProvider;
