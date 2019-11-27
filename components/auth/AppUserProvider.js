import PropTypes from 'prop-types';

import AppUserContext from './AppUser';

function AppUserProvider(props) {
  return (
    <>
      <AppUserContext.Provider value={{ user: props.user }}>{props.children}</AppUserContext.Provider>
    </>
  );
}

AppUserProvider.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    type: PropTypes.oneOf(['teacher', 'student']),
    info: PropTypes.shape({
      fullname: PropTypes.string,
      birthday: PropTypes.string,
      image: PropTypes.string
    })
  }),
  children: PropTypes.node.isRequired
};

export default AppUserProvider;
