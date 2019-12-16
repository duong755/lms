import PropTypes from 'prop-types';

export const ExamType = PropTypes.shape({
  teacher_id: PropTypes.string.isRequired,
  course_id: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      choices: PropTypes.arrayOf(PropTypes.string),
      answer: PropTypes.string.isRequired,
      point: PropTypes.number.isRequired
    })
  )
});
