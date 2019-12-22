import PropTypes from 'prop-types';

export const JoinRequestType = PropTypes.shape({
  course_id: PropTypes.string.isRequired,
  request_at: PropTypes.string.isRequired,
  teacher_id: PropTypes.string.isRequired,
  student_id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
});
