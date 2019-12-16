import PropTypes from 'prop-types';

export const UserType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  email: PropTypes.string,
  type: PropTypes.oneOf(['teacher', 'student']).isRequired,
  info: PropTypes.shape({
    fullname: PropTypes.string,
    birthday: PropTypes.string,
    image: PropTypes.string
  })
});
