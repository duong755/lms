import Head from 'next/head';
import PropTypes from 'prop-types';

import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

import absURL from '../helpers/URL';
import { UserType, CourseType } from '../propTypes';

/**
 *
 * @param {React.FC} CoursePage
 * @param {string} tab
 */
function withCourse(CoursePage) {
  const Page = (props) => {
    const { course } = props;

    return (
      <>
        <Head>
          <title>{course.course_name}</title>
        </Head>
        <Box>
          <Container maxWidth="xl">
            <CoursePage {...props} />
          </Container>
        </Box>
      </>
    );
  };

  Page.propTypes = {
    userId: PropTypes.string.isRequired,
    courseId: PropTypes.string.isRequired,
    user: UserType,
    course: CourseType
  };

  Page.getInitialProps = async (context) => {
    const { userId, courseId } = context.query;
    let user = {};
    let course = {};
    let coursePageProps = {};
    if (CoursePage.getInitialProps) {
      coursePageProps = await CoursePage.getInitialProps(context);
    }
    try {
      const courseResponse = await fetch(absURL(`/api/user/${userId}/course/${courseId}`));
      const userResponse = await fetch(absURL(`/api/user/${userId}`));
      course = await courseResponse.json();
      user = await userResponse.json();
    } catch (err) {
      console.error(err);
    }

    return { userId: userId, courseId: courseId, ...course, ...user, ...coursePageProps };
  };

  return Page;
}

export default withCourse;
