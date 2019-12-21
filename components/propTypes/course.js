import PropTypes from 'prop-types';

export const CourseType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  course_name: PropTypes.string.isRequired,
  description: PropTypes.string,
  created_at: PropTypes.string.isRequired,
  archive: PropTypes.bool,
  topics: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  members: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
});
