import PropTypes from 'prop-types';

export const CommentType = PropTypes.shape({
  teacher_id: PropTypes.string.isRequired,
  course_id: PropTypes.string.isRequired,
  lesson_id: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  user_id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
});
