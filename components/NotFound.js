/**
 * @typedef {{ id: string, username: string, email: string, type: 'teacher' | 'student', info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string }} Lesson
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string, deadline: string }} Exercise
 * @typedef {{ teacher_id: string, course_id: string, id: string, title: string, content: string, duration: string, start_at: string }} Exam
 * @typedef {'lesson' | 'exercise' | 'exam'} Item
 * @typedef {{ user?: User, course?: Course, lesson?: Lesson, exercise?: Exercise, exam?: Exam, item?: Item }} NotFoundProps
 */
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

import { UserType, CourseType, LessonType, ExamType, ExerciseType } from './propTypes';

/**
 * @type {React.FunctionComponent<NotFoundProps>}
 */
const NotFound = (props) => {
  const { user, course, lesson, exercise, exam, item } = props;
  if (!user) {
    return ((
      <Typography variant="h4">
        <strong>User Not Found</strong>
      </Typography>
    ));
  } else {
    if (!course) {
      return ((
        <Typography variant="h4">
          <strong>Course Not Found</strong>
        </Typography>
      ));
    } else {
      switch (item) {
        case 'lesson':
          return lesson ? null : (
            (<Typography variant="h4">
              <strong>Lesson Not Found</strong>
            </Typography>)
          );
        case 'exercise':
          return exercise ? null : (
            (<Typography variant="h4">
              <strong>Exercise Not Found</strong>
            </Typography>)
          );
        case 'exam':
          return exam ? null : (
            (<Typography variant="h4">
              <strong>Exam Not Found</strong>
            </Typography>)
          );
        default:
          return null;
      }
    }
  }
};

NotFound.propTypes = {
  item: PropTypes.oneOf(['lesson', 'exercise', 'exam']),
  user: UserType,
  course: CourseType,
  lesson: LessonType,
  exercise: ExerciseType,
  exam: ExamType
};

export default NotFound;
