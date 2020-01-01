import PropTypes from 'prop-types';

export const ExamType = PropTypes.shape({
  teacher_id: PropTypes.string.isRequired,
  course_id: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
});
