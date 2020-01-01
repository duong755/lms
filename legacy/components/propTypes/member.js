import PropTypes from 'prop-types';

export const MemberType = PropTypes.shape({
  teacher_id: PropTypes.string.isRequired,
  course_id: PropTypes.string.isRequired,
  student_id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  joined_at: PropTypes.string.isRequired
});
