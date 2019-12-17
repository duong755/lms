/**
 * @typedef {'teacher' | 'student'} UserType
 * @typedef {{ id: string, email: string, username: string, type: UserType, info: Object<string, string> }} User
 * @typedef {{ id: string, teacher_id: string, course_name: string, created_at: string, archive?: boolean, description?: string, topics?: string | string[], members?: string | string[] }} Course
 * @typedef {{ userId: string, courseId: string, course: Course, user: User }} CoursePageProps
 */
import Head from 'next/head';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import withLayout from '../../../../../components/lib/withLayout';
import withCourse from '../../../../../components/lib/withCourse';
import { CourseType, UserType } from '../../../../../components/propTypes';
/**
 * @type {React.FunctionComponent<CoursePageProps>}
 */
const CoursePage = (props) => {
  const { course } = props;
  const { topics } = course;

  const allTopics = topics ? ((topics instanceof Array ? topics : [topics])) : [];

  return ((
    <>
      <Head>
        <title>{course.course_name}</title>
      </Head>
      <Box py={2}>
        {course.description || (
          <Typography color="textSecondary">
            <em>No description provided</em>
          </Typography>
        )}
      </Box>
      {allTopics.length &&
        allTopics.map((currentTopic) => (
          <Box component="span" key={currentTopic} mr={1}>
            <Button variant="outlined" color="primary">
              {currentTopic}
            </Button>
          </Box>
        ))}
    </>
  ));
};

CoursePage.propTypes = {
  userId: PropTypes.string,
  courseId: PropTypes.string,
  user: UserType,
  course: CourseType
};

export default withLayout(withCourse(CoursePage));
